/**
 * Authentication Service — Real Firebase Auth + RTDB
 * Replaces the localStorage mock. Creates real Firebase Auth users
 * and persists admin profiles to /admins/{uid}/ in the shared RTDB.
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, rtdb } from './firebaseClient';
import { AdminProfile, AdminCredentials } from '@wasalt/types';

const ADMIN_STORAGE_KEY = 'wasalt_current_admin';

/**
 * Returns the currently authenticated admin profile.
 * Checks Firebase Auth state first, then RTDB for the profile.
 */
export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (!user) {
        resolve(null);
        return;
      }
      try {
        const snap = await get(ref(rtdb, `admins/${user.uid}`));
        if (snap.exists()) {
          resolve(snap.val() as AdminProfile);
        } else {
          // Profile missing in RTDB — build a minimal one from Auth data
          const minimal: AdminProfile = {
            id: user.uid,
            email: user.email || '',
            fullName: user.displayName || user.email?.split('@')[0] || 'Admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          resolve(minimal);
        }
      } catch {
        resolve(null);
      }
    });
  });
}

/**
 * Signs in an existing admin via Firebase Auth and loads their RTDB profile.
 */
export async function signInAdmin(credentials: AdminCredentials): Promise<AdminProfile> {
  const cred = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
  const snap = await get(ref(rtdb, `admins/${cred.user.uid}`));
  if (snap.exists()) {
    const profile = snap.val() as AdminProfile;
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(profile));
    return profile;
  }
  // Profile doesn't exist yet — create it
  return _createAdminProfile(cred.user.uid, credentials);
}

/**
 * Creates a new Firebase Auth user and writes their profile to /admins/{uid}/.
 */
export async function signUpAdmin(credentials: AdminCredentials): Promise<AdminProfile> {
  const cred = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
  return _createAdminProfile(cred.user.uid, credentials);
}

/**
 * Updates the signed-in admin's profile info (full name).
 * Writes to both Firebase Auth displayName and /admins/{uid} in RTDB.
 */
export async function updateAdminProfile(fullName: string): Promise<AdminProfile> {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in to update your profile.');

  const trimmed = fullName.trim();
  if (!trimmed) throw new Error('Full name cannot be empty.');

  await updateProfile(user, { displayName: trimmed });

  const now = new Date().toISOString();
  await update(ref(rtdb, `admins/${user.uid}`), {
    fullName: trimmed,
    updatedAt: now,
  });

  const snap = await get(ref(rtdb, `admins/${user.uid}`));
  const profile: AdminProfile = snap.exists()
    ? (snap.val() as AdminProfile)
    : {
        id: user.uid,
        email: user.email || '',
        fullName: trimmed,
        createdAt: now,
        updatedAt: now,
      };

  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

/**
 * Signs out the current user from Firebase Auth and clears local session.
 */
export async function signOutAdmin(): Promise<void> {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  await signOut(auth);
}

/**
 * Sends a password reset email via Firebase Auth.
 */
export async function sendPasswordReset(email: string): Promise<boolean> {
  const { sendPasswordResetEmail } = await import('firebase/auth');
  await sendPasswordResetEmail(auth, email);
  return true;
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

/**
 * Writes an admin profile record to /admins/{uid}/ in RTDB.
 */
async function _createAdminProfile(
  uid: string,
  credentials: AdminCredentials
): Promise<AdminProfile> {
  const now = new Date().toISOString();
  const profile: AdminProfile = {
    id: uid,
    email: credentials.email,
    fullName: credentials.fullName || credentials.email.split('@')[0],
    createdAt: now,
    updatedAt: now,
  };

  await set(ref(rtdb, `admins/${uid}`), {
    ...profile,
    companyIds: [], // Will be populated when company is created
  });

  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}
