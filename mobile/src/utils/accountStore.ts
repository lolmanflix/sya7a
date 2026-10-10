/**
 * @file accountStore.ts
 * @description Multi-account registry (AsyncStorage `app_accounts_v1`) plus secure credential
 * vault (expo-secure-store `wasalt_acct_<uid>`) so accounts re-authenticate silently on switch.
 * Owns the global (non uid-scoped) session keys too; theme/language are untouched.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import {
  clearDriverSession,
  getDriverCompanyId,
  getDriverBusLine,
  setDriverBusLine,
  setDriverCompanyId,
} from './driverStorage';

export type AccountRole = 'passenger' | 'driver';

export interface AccountRecord {
  uid: string;
  email: string;
  displayName: string;
  userType: AccountRole;
  addedAt: number;
  lastUsedAt: number;
  /** Captured at switch-away time so a driver returns to the same company/line. */
  driverCompanyId?: string | null;
  driverBusLine?: string | null;
}

export interface StoredCredentials {
  email: string;
  password: string;
}
export type AccountPatch = Partial<AccountRecord> & { uid: string };

const ACCOUNTS_KEY = 'app_accounts_v1';
const ACTIVE_ACCOUNT_KEY = 'app_active_account_v1';
const CREDENTIAL_KEY_PREFIX = 'wasalt_acct_';
const GLOBAL_SESSION_KEYS = ['app_user_subscription_tier_v1', 'app_user_type_v1'];

/** Serializes read-modify-write cycles so concurrent updates never drop records. */
let mutationQueue: Promise<unknown> = Promise.resolve();

function enqueueMutation<T>(task: () => Promise<T>): Promise<T> {
  const run = mutationQueue.then(task, task);
  mutationQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

const credentialKey = (uid: string) => `${CREDENTIAL_KEY_PREFIX}${uid}`;

function isAccountRecord(value: unknown): value is AccountRecord {
  const rec = value as AccountRecord | null;
  return (
    !!rec && typeof rec === 'object' && typeof rec.uid === 'string' &&
    typeof rec.email === 'string' && (rec.userType === 'passenger' || rec.userType === 'driver')
  );
}

function applyPatch(target: AccountRecord, patch: AccountPatch): AccountRecord {
  const clean: Record<string, unknown> = {};
  (Object.keys(patch) as (keyof AccountPatch)[]).forEach((key) => {
    const value = patch[key];
    if (value !== undefined) clean[key] = value;
  });
  return Object.assign({}, target, clean);
}

/** Reads the full account registry; degrades to [] on any failure. */
export async function loadAccounts(): Promise<AccountRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isAccountRecord) : [];
  } catch (error) {
    console.warn('[AccountStore] Failed to read account registry:', error);
    return [];
  }
}

async function persistAccounts(accounts: AccountRecord[]): Promise<AccountRecord[]> {
  try {
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.warn('[AccountStore] Failed to persist account registry:', error);
  }
  return accounts;
}

/** Inserts or merges a record (undefined patch fields stay intact); returns registry. */
export async function upsertAccount(patch: AccountPatch): Promise<AccountRecord[]> {
  return enqueueMutation(async () => {
    const accounts = await loadAccounts();
    const now = Date.now();
    const index = accounts.findIndex((acc) => acc.uid === patch.uid);
    if (index >= 0) {
      accounts[index] = applyPatch(accounts[index], patch);
    } else {
      const base: AccountRecord = {
        uid: patch.uid,
        email: patch.email ?? '',
        displayName: patch.displayName ?? '',
        userType: patch.userType ?? 'passenger',
        addedAt: patch.addedAt ?? now,
        lastUsedAt: patch.lastUsedAt ?? now,
      };
      if (patch.driverCompanyId !== undefined) base.driverCompanyId = patch.driverCompanyId;
      if (patch.driverBusLine !== undefined) base.driverBusLine = patch.driverBusLine;
      accounts.push(base);
    }
    return persistAccounts(accounts);
  });
}

/** Removes one account; also clears the active pointer if it matched. */
export async function removeAccount(uid: string): Promise<AccountRecord[]> {
  return enqueueMutation(async () => {
    const accounts = await loadAccounts();
    const next = accounts.filter((acc) => acc.uid !== uid);
    await persistAccounts(next);
    try {
      if ((await AsyncStorage.getItem(ACTIVE_ACCOUNT_KEY)) === uid) {
        await AsyncStorage.removeItem(ACTIVE_ACCOUNT_KEY);
      }
    } catch (error) {
      console.warn('[AccountStore] Failed to clear active account pointer:', error);
    }
    return next;
  });
}

/** Returns the active account uid, or null. */
export async function getActiveUid(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(ACTIVE_ACCOUNT_KEY);
  } catch (error) {
    console.warn('[AccountStore] Failed to read active account:', error);
    return null;
  }
}

/** Points the active-account marker at a uid (null removes it). */
export async function setActiveUid(uid: string | null): Promise<void> {
  try {
    if (uid) await AsyncStorage.setItem(ACTIVE_ACCOUNT_KEY, uid);
    else await AsyncStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  } catch (error) {
    console.warn('[AccountStore] Failed to persist active account:', error);
  }
}

/** Boot-time registration of a restored Firebase session not yet in the registry. */
export async function migrateCurrentUser(
  user: { uid: string; email?: string | null; displayName?: string | null },
  userType: AccountRole
): Promise<AccountRecord[]> {
  return enqueueMutation(async () => {
    const accounts = await loadAccounts();
    if (accounts.some((acc) => acc.uid === user.uid)) return accounts;
    const now = Date.now();
    accounts.push({
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      userType,
      addedAt: now,
      lastUsedAt: now,
    });
    return persistAccounts(accounts);
  });
}

/** Saves a password in Keystore/Keychain; degrades with console.warn if it throws. */
export async function storeCredentials(
  uid: string, email: string, password: string
): Promise<void> {
  try {
    await SecureStore.setItemAsync(credentialKey(uid), JSON.stringify({ email, password }));
  } catch (error) {
    console.warn('[AccountStore] Unable to store credentials securely:', error);
  }
}

/** Reads stored credentials for silent re-auth; null when absent or unavailable. */
export async function readCredentials(uid: string): Promise<StoredCredentials | null> {
  try {
    const raw = await SecureStore.getItemAsync(credentialKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === 'string' && typeof parsed.password === 'string') {
      return { email: parsed.email, password: parsed.password };
    }
    return null;
  } catch (error) {
    console.warn('[AccountStore] Unable to read stored credentials:', error);
    return null;
  }
}

/** Deletes one account's stored password (on sign-out of that account). */
export async function deleteCredentials(uid: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(credentialKey(uid));
  } catch (error) {
    console.warn('[AccountStore] Unable to delete stored credentials:', error);
  }
}

/** Clears global session keys (subscription tier, user type, driver session). */
export async function clearGlobalAppKeys(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(GLOBAL_SESSION_KEYS);
  } catch (error) {
    console.warn('[AccountStore] Failed to clear global session keys:', error);
  }
  try {
    await clearDriverSession();
  } catch (error) {
    console.warn('[AccountStore] Failed to clear driver session keys:', error);
  }
}

/** Snapshots driver company/line into the record before global keys are wiped. */
export async function captureDriverSession(uid: string): Promise<void> {
  try {
    const [companyId, busLine] = await Promise.all([getDriverCompanyId(), getDriverBusLine()]);
    if (!companyId && !busLine) return;
    await upsertAccount({ uid, driverCompanyId: companyId, driverBusLine: busLine });
  } catch (error) {
    console.warn('[AccountStore] Failed to capture driver session:', error);
  }
}

/** Restores a driver account's company/line session keys after re-authentication. */
export async function restoreDriverSession(record: AccountRecord): Promise<void> {
  try {
    if (record.driverCompanyId) await setDriverCompanyId(record.driverCompanyId);
    if (record.driverBusLine) await setDriverBusLine(record.driverBusLine);
  } catch (error) {
    console.warn('[AccountStore] Failed to restore driver session:', error);
  }
}
