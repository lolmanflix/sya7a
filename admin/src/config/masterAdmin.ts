/**
 * Admin credential configuration.
 *
 * Single source of truth for master-admin secrets and privileged identities.
 * Values are injected exclusively from `admin/.env` (gitignored) through Vite
 * env vars — no fallback defaults ever: a missing value surfaces as a loud,
 * actionable configuration error instead of shipping a working credential
 * inside the public JS bundle (which would make the 2FA gate decorative).
 *
 * Keys:
 *   VITE_MASTER_ADMIN_USERNAME   - master login username
 *   VITE_MASTER_ADMIN_PASSWORD   - master login password (also the Firebase service password)
 *   VITE_MASTER_ADMIN_TOTP_SECRET- base32 TOTP seed for authenticator apps
 *   VITE_FIREBASE_ADMIN_EMAILS   - comma-separated Firebase service identities (first = primary)
 *   VITE_SUPER_ADMIN_EMAILS      - comma-separated emails granted SUPER_ADMIN on dispatcher login
 *   (optional demo target: VITE_DEMO_DRIVER_UID / VITE_DEMO_DRIVER_NAME → config/demoTarget.ts)
 */

/** Raw environment values; `undefined` when the key is absent. */
const username = import.meta.env.VITE_MASTER_ADMIN_USERNAME as string | undefined;
const password = import.meta.env.VITE_MASTER_ADMIN_PASSWORD as string | undefined;
const totpSecret = import.meta.env.VITE_MASTER_ADMIN_TOTP_SECRET as string | undefined;
const firebaseEmailsRaw = import.meta.env.VITE_FIREBASE_ADMIN_EMAILS as string | undefined;
const superAdminEmailsRaw = import.meta.env.VITE_SUPER_ADMIN_EMAILS as string | undefined;

/** Env keys required for a working master-admin login (used to build the error message). */
const REQUIRED_KEYS = [
  'VITE_MASTER_ADMIN_USERNAME',
  'VITE_MASTER_ADMIN_PASSWORD',
  'VITE_MASTER_ADMIN_TOTP_SECRET',
  'VITE_FIREBASE_ADMIN_EMAILS',
] as const;

/** Maps each required key to its parsed raw value for presence checks. */
const KEY_VALUES: Record<(typeof REQUIRED_KEYS)[number], string | undefined> = {
  VITE_MASTER_ADMIN_USERNAME: username,
  VITE_MASTER_ADMIN_PASSWORD: password,
  VITE_MASTER_ADMIN_TOTP_SECRET: totpSecret,
  VITE_FIREBASE_ADMIN_EMAILS: firebaseEmailsRaw,
};

/**
 * Parses a comma-separated env list into trimmed, lowercase entries.
 * @param raw - Raw env string (may be undefined).
 * @returns Normalized list; empty array when unset/blank.
 */
const parseList = (raw: string | undefined): string[] =>
  (raw || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

/** Returns the required env keys that are currently unset or blank. */
export const getMissingMasterKeys = (): string[] =>
  REQUIRED_KEYS.filter((key) => !KEY_VALUES[key]?.trim());

/**
 * Builds the actionable remediation message for incomplete configuration.
 * @returns Empty string when fully configured (callers should check isMasterConfigured() first).
 */
export const getMasterConfigError = (): string => {
  const missing = getMissingMasterKeys();
  if (missing.length === 0) return '';
  return (
    `Admin configuration incomplete — missing ${missing.join(', ')} in admin/.env. ` +
    'Copy the placeholders from admin/.env.example, set real values, and restart the dev server.'
  );
};

/** True when every required master-admin value is present. */
export const isMasterConfigured = (): boolean => getMissingMasterKeys().length === 0;

/** Master username, or `undefined` when unset. */
export const masterUsername = username;

/** Master password, or `undefined` when unset. */
export const masterPassword = password;

/** TOTP seed for authenticator enrolment, or `undefined` when unset. */
export const masterTotpSecret = totpSecret;

/** Ordered Firebase service identities (first = primary), empty when unset. */
export const masterFirebaseEmails: string[] = parseList(firebaseEmailsRaw);

/** Emails granted SUPER_ADMIN during dispatcher login (empty = none). */
export const superAdminEmails: string[] = parseList(superAdminEmailsRaw);
