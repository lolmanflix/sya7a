import { AdminRole, AdminSession } from '../types';

export type AccountKind = 'master' | 'company';

export interface AccountRecord {
  id: string;
  email: string;
  role: AdminRole;
  companyId?: string;
  kind: AccountKind;
  label: string;
  addedAt: number;
  lastUsedAt: number;
}

export interface AccountInput {
  id: string;
  email: string;
  role: AdminRole;
  companyId?: string;
  kind: AccountKind;
  label: string;
}

const ACCOUNTS_KEY = 'wasalt_admin_accounts_v1';
const ACTIVE_KEY = 'wasalt_admin_active_v1';
const LEGACY_SESSION_KEYS = ['wasalt_admin_session', 'sya7a_admin_session'] as const;

const getLocalStorage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const getSessionStorage = (): Storage | null => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const readRaw = (storage: Storage | null, key: string): string | null => {
  try {
    return storage ? storage.getItem(key) : null;
  } catch (err) {
    console.warn(`[accountStore] Failed to read "${key}":`, err);
    return null;
  }
};

const writeRaw = (storage: Storage | null, key: string, value: string): void => {
  try {
    storage?.setItem(key, value);
  } catch (err) {
    console.warn(`[accountStore] Failed to write "${key}":`, err);
  }
};

const removeRaw = (storage: Storage | null, key: string): void => {
  try {
    storage?.removeItem(key);
  } catch (err) {
    console.warn(`[accountStore] Failed to remove "${key}":`, err);
  }
};

const parseRecord = (value: unknown): AccountRecord | null => {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== 'string' || typeof v.email !== 'string' || typeof v.label !== 'string') return null;
  if (v.role !== 'SUPER_ADMIN' && v.role !== 'COMPANY_ADMIN') return null;
  if (v.kind !== 'master' && v.kind !== 'company') return null;
  if (typeof v.addedAt !== 'number' || typeof v.lastUsedAt !== 'number') return null;
  return {
    id: v.id,
    email: v.email,
    role: v.role,
    companyId: typeof v.companyId === 'string' ? v.companyId : undefined,
    kind: v.kind,
    label: v.label,
    addedAt: v.addedAt,
    lastUsedAt: v.lastUsedAt,
  };
};

export function loadAccounts(): AccountRecord[] {
  const raw = readRaw(getLocalStorage(), ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(parseRecord).filter((r): r is AccountRecord => r !== null);
  } catch (err) {
    console.warn('[accountStore] Failed to parse account registry:', err);
    return [];
  }
}

export function saveAccounts(accounts: AccountRecord[]): void {
  writeRaw(getLocalStorage(), ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getActiveId(): string | null {
  return readRaw(getLocalStorage(), ACTIVE_KEY);
}

export function setActiveId(id: string | null): void {
  if (id === null) {
    removeRaw(getLocalStorage(), ACTIVE_KEY);
  } else {
    writeRaw(getLocalStorage(), ACTIVE_KEY, id);
  }
}

/**
 * Inserts or refreshes an account in the registry (dedupe by id, or by
 * kind+email). Preserves `addedAt`; bumps `lastUsedAt`. Returns the stored record.
 */
export function upsertAccount(input: AccountInput): AccountRecord {
  const accounts = loadAccounts();
  const emailLower = input.email.toLowerCase();
  const now = Date.now();
  const existing = accounts.find(
    (a) => a.id === input.id || (a.kind === input.kind && a.email.toLowerCase() === emailLower)
  );
  if (existing) {
    const merged: AccountRecord = {
      ...existing,
      ...input,
      companyId: input.companyId ?? existing.companyId,
      addedAt: existing.addedAt,
      lastUsedAt: now,
    };
    saveAccounts(accounts.map((a) => (a.id === existing.id ? merged : a)));
    return merged;
  }
  const record: AccountRecord = { ...input, addedAt: now, lastUsedAt: now };
  saveAccounts([...accounts, record]);
  return record;
}

export function removeAccount(id: string): void {
  const accounts = loadAccounts();
  saveAccounts(accounts.filter((a) => a.id !== id));
  if (getActiveId() === id) {
    setActiveId(null);
  }
}

export function pickMostRecent(accounts: AccountRecord[]): AccountRecord | null {
  if (accounts.length === 0) return null;
  return [...accounts].sort((a, b) => b.lastUsedAt - a.lastUsedAt)[0];
}

export function toAdminSession(record: AccountRecord): AdminSession {
  return { email: record.email, role: record.role, companyId: record.companyId };
}

/**
 * One-time migration of the pre-multi-account single-session keys
 * (`wasalt_admin_session` / `sya7a_admin_session` in BOTH localStorage and
 * sessionStorage) into the registry. Inserts the legacy session if absent,
 * marks it active, and removes all legacy key occurrences.
 * @returns The newly active migrated record, or null when nothing was found.
 */
export function migrateLegacySession(): AccountRecord | null {
  try {
    const storages = [getLocalStorage(), getSessionStorage()];
    let legacy: { email?: unknown; role?: unknown; companyId?: unknown } | null = null;

    for (const storage of storages) {
      for (const key of LEGACY_SESSION_KEYS) {
        const raw = readRaw(storage, key);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && typeof (parsed as { email?: unknown }).email === 'string' && !legacy) {
            legacy = parsed as { email?: unknown; role?: unknown; companyId?: unknown };
          }
        } catch (err) {
          console.warn('[accountStore] Ignoring unparseable legacy session:', err);
        }
        removeRaw(storage, key);
      }
    }

    if (!legacy || typeof legacy.email !== 'string') return null;

    const accounts = loadAccounts();
    const emailLower = legacy.email.toLowerCase();
    const existing = accounts.find((a) => a.email.toLowerCase() === emailLower);
    if (existing) {
      setActiveId(existing.id);
      return existing;
    }

    const kind: AccountKind = legacy.role === 'SUPER_ADMIN' ? 'master' : 'company';
    const idBase = kind === 'master' ? emailLower.split('@')[0] || emailLower : emailLower;
    const byId = accounts.find((a) => a.id === `${kind}:${idBase}`);
    if (byId) {
      setActiveId(byId.id);
      return byId;
    }

    const record: AccountRecord = {
      id: `${kind}:${idBase}`,
      email: legacy.email,
      role: kind === 'master' ? 'SUPER_ADMIN' : 'COMPANY_ADMIN',
      companyId: typeof legacy.companyId === 'string' ? legacy.companyId : undefined,
      kind,
      label: legacy.email,
      addedAt: Date.now(),
      lastUsedAt: Date.now(),
    };
    saveAccounts([...accounts, record]);
    setActiveId(record.id);
    return record;
  } catch (err) {
    console.warn('[accountStore] Legacy session migration failed:', err);
    return null;
  }
}
