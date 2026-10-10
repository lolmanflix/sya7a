/**
 * @file accountSwitch.ts
 * @description Orchestration for multi-account flows: silent account switching
 * (Firebase Auth allows one currentUser, so switching re-authenticates with the
 * password stored in SecureStore), adding a new login without dropping the
 * current account, and manual logout of only the current account.
 * All UI feedback (Alerts) stays in the calling components — this module only
 * throws friendly Error messages.
 */

import { User, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { auth, database } from '../config/firebase';
import {
  AccountRecord,
  captureDriverSession,
  clearGlobalAppKeys,
  deleteCredentials,
  getActiveUid,
  loadAccounts,
  readCredentials,
  removeAccount,
  restoreDriverSession,
  setActiveUid,
  upsertAccount,
} from './accountStore';

export interface SessionControls {
  setUserType: (type: 'passenger' | 'driver') => void;
  clearUserType: () => void;
}

export interface SwitchOptions {
  accounts: AccountRecord[];
  currentUser: User | null;
  currentIsDriver: boolean;
  controls: SessionControls;
}

const SESSION_EXPIRED = (email: string) =>
  `Session expired for ${email} — please sign in again.`;

const CREDENTIAL_ERROR_CODES = new Set([
  'auth/wrong-password',
  'auth/invalid-credential',
  'auth/invalid-login-credentials',
  'auth/user-not-found',
  'auth/user-disabled',
]);

/** True when re-auth failed because the stored password is no longer valid. */
export function isCredentialAuthError(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === 'string' && CREDENTIAL_ERROR_CODES.has(code);
}

/**
 * Blocks while the current driver still has a live broadcast in RTDB
 * (mirrors the DriverHomeScreen "end trip first" logout guard).
 */
export async function ensureNoActiveDriverTrip(user: User | null): Promise<void> {
  if (!user) return;
  const email = user.email ? user.email.toLowerCase() : '';
  let busy = false;
  try {
    const snap = await get(ref(database, 'busLocations'));
    const data = snap.val();
    if (data) {
      for (const lineKey of Object.keys(data)) {
        const drivers = data[lineKey];
        if (!drivers) continue;
        for (const driverKey of Object.keys(drivers)) {
          const rec = drivers[driverKey];
          if (!rec) continue;
          const matchesEmail =
            email && typeof rec.driverEmail === 'string' &&
            rec.driverEmail.toLowerCase() === email;
          if (driverKey === user.uid || matchesEmail) busy = true;
        }
      }
    }
  } catch (error) {
    // Offline / RTDB error: fail open so the user is never locked out.
    console.warn('[AccountSwitch] Live-trip check unavailable, continuing:', error);
  }
  if (busy) {
    throw new Error('Please end your live trip before switching accounts.');
  }
}

/**
 * Silently switches to another added account.
 * Order matters: driver session is captured → credentials read (abort while the
 * current session is still intact if missing) → global keys wiped → sign-out →
 * target role and driver session restored BEFORE Firebase notifies observers →
 * re-authenticate. On credential failure the stored password and record are
 * dropped so the user can re-add the account through the normal Login flow.
 */
export async function performAccountSwitch(
  targetUid: string,
  options: SwitchOptions
): Promise<void> {
  const target = options.accounts.find((acc) => acc.uid === targetUid);
  if (!target) {
    throw new Error('This account is no longer available. Please sign in again.');
  }
  if (options.currentUser?.uid === targetUid && (await getActiveUid()) === targetUid) {
    return; // already active — nothing to do
  }

  if (options.currentIsDriver && options.currentUser) {
    await ensureNoActiveDriverTrip(options.currentUser);
    await captureDriverSession(options.currentUser.uid);
  }

  const credentials = await readCredentials(targetUid);
  if (!credentials) {
    // No stored password (e.g. migrated account): abort before touching any
    // global keys so the current session stays fully intact.
    throw new Error(SESSION_EXPIRED(target.email));
  }

  await clearGlobalAppKeys();

  if (auth.currentUser) await signOut(auth);

  // Role + driver session must land before onAuthStateChanged fires so the
  // navigator mounts DriverHome/MainTabs with the right branch immediately.
  options.controls.setUserType(target.userType);
  if (target.userType === 'driver') await restoreDriverSession(target);

  try {
    await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
  } catch (error) {
    await clearGlobalAppKeys();
    options.controls.clearUserType();
    if (isCredentialAuthError(error)) {
      await deleteCredentials(targetUid);
      await removeAccount(targetUid);
      throw new Error(SESSION_EXPIRED(target.email));
    }
    console.warn('[AccountSwitch] Re-authentication failed:', error);
    throw new Error(
      error instanceof Error && error.message
        ? error.message
        : 'Could not switch accounts. Please try again.'
    );
  }

  await setActiveUid(targetUid);
  await upsertAccount({ uid: targetUid, lastUsedAt: Date.now() });
}

/**
 * "Add account": signs out of Firebase WITHOUT removing the current record or
 * its credentials, so the account stays in the list and can be restored with a
 * silent switch later. Global keys are wiped so the next login starts clean.
 */
export async function performAddAccount(
  currentUser: User | null,
  currentIsDriver: boolean,
  controls: SessionControls
): Promise<void> {
  if (currentIsDriver && currentUser) {
    await ensureNoActiveDriverTrip(currentUser);
    await captureDriverSession(currentUser.uid);
  }
  if (auth.currentUser) await signOut(auth);
  await clearGlobalAppKeys();
  controls.clearUserType();
  await setActiveUid(null);
}

/**
 * Manual logout: removes ONLY the current account (record + stored password).
 * Every other added account and its credentials stay available.
 */
export async function performLogout(
  currentUser: User | null,
  controls: SessionControls
): Promise<void> {
  const uid = currentUser?.uid ?? (await getActiveUid());
  if (uid) {
    await deleteCredentials(uid);
    await removeAccount(uid);
  }
  await clearGlobalAppKeys();
  controls.clearUserType();
  await setActiveUid(null);
  if (auth.currentUser) await signOut(auth);
}

/** Refreshes the registry snapshot after a flow completes (best effort). */
export async function reloadAccounts(): Promise<AccountRecord[]> {
  try {
    return await loadAccounts();
  } catch (error) {
    console.warn('[AccountSwitch] Failed to reload accounts:', error);
    return [];
  }
}
