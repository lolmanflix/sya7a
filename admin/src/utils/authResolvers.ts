/**
 * @file authResolvers.ts
 * @description Pure authentication helpers extracted from AuthContext:
 * role resolution (email heuristics + RTDB admin profiles) and the
 * Firebase service-identity establishment used to satisfy RTDB rules.
 */

import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { AdminRole } from '../types';
import { masterFirebaseEmails, superAdminEmails } from '../config/masterAdmin';

interface RoleResolution {
  role: AdminRole;
  companyId?: string;
}

/**
 * Resolves the role from an email address.
 * SUPER_ADMIN is granted ONLY to addresses explicitly listed in
 * VITE_SUPER_ADMIN_EMAILS — never by name-substring match or default
 * (least privilege: unknown emails fall back to COMPANY_ADMIN).
 */
export const resolveRole = (email: string): RoleResolution => {
  const clean = email.toLowerCase().trim();
  if (superAdminEmails.includes(clean)) {
    return { role: 'SUPER_ADMIN' };
  }
  const match = clean.match(/admin@([a-z0-9-]+)\.eg/);
  if (match && match[1]) {
    const compKey =
      match[1] === 'whitebus'
        ? 'white-bus'
        : match[1] === 'mwaslatmisr'
        ? 'mwaslat-misr'
        : match[1] === 'gobus'
        ? 'go-bus'
        : match[1] === 'superjet'
        ? 'super-jet'
        : match[1];
    return { role: 'COMPANY_ADMIN', companyId: compKey };
  }
  return { role: 'COMPANY_ADMIN' };
};

/**
 * Resolves an admin's role from RTDB /admins/{uid}/ profile (companyIds
 * ownership), falling back to email heuristics for legacy/master accounts.
 */
export const resolveRoleFromRTDB = async (
  uid: string,
  email: string
): Promise<RoleResolution> => {
  try {
    const adminSnap = await get(ref(database, `admins/${uid}`));
    if (adminSnap.exists()) {
      const adminData = adminSnap.val();
      const companyIds: string[] = adminData.companyIds || [];
      if (companyIds.length > 0) {
        const firstCompanyId = companyIds[0];
        const compSnap = await get(ref(database, `companies/${firstCompanyId}`));
        if (compSnap.exists()) {
          const lower = email.toLowerCase();
          const isSuperAdmin = superAdminEmails.includes(lower);
          return {
            role: isSuperAdmin ? 'SUPER_ADMIN' : 'COMPANY_ADMIN',
            companyId: firstCompanyId,
          };
        }
      }
    }
  } catch (err) {
    console.warn('[Auth] RTDB role resolution failed, using email fallback:', err);
  }
  return resolveRole(email);
};

/**
 * Signs into Firebase with the configured service identities (ordered list,
 * first = primary) so RTDB rules see `auth != null`. Never throws.
 * @param cfgPassword - Password shared by the service identities.
 * @returns True when a Firebase session was established.
 */
export const establishFirebaseIdentity = async (cfgPassword: string): Promise<boolean> => {
  if (masterFirebaseEmails.length === 0) {
    console.warn('[Auth] Firebase identity not configured (VITE_FIREBASE_ADMIN_EMAILS).');
    return false;
  }
  let lastError: unknown;
  for (const email of masterFirebaseEmails) {
    try {
      await signInWithEmailAndPassword(auth, email, cfgPassword);
      return true;
    } catch (err) {
      lastError = err;
    }
  }
  console.warn('[Auth] Firebase service identity sign-in failed:', lastError);
  return false;
};
