import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AdminSession } from '../types';
import { verifyTOTP } from '../utils/totp';
import {
  masterUsername,
  masterPassword,
  masterTotpSecret,
  masterFirebaseEmails,
  getMasterConfigError,
} from '../config/masterAdmin';
import { resolveRoleFromRTDB, establishFirebaseIdentity } from '../utils/authResolvers';
import {
  AccountRecord,
  AccountInput,
  loadAccounts,
  getActiveId,
  setActiveId,
  upsertAccount,
  removeAccount as removeAccountFromStore,
  migrateLegacySession,
  pickMostRecent,
  toAdminSession,
} from '../utils/accountStore';

interface AuthContextType {
  user: User | null;
  adminSession: AdminSession | null;
  loading: boolean;
  accounts: AccountRecord[];
  activeAccountId: string | null;
  addingAccount: boolean;
  loginWithFirebase: (email: string, pass: string) => Promise<void>;
  loginMasterAdmin: (username: string, pass: string, otpToken: string) => Promise<void>;
  logout: () => Promise<void>;
  switchAccount: (id: string) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  beginAddAccount: () => void;
  cancelAddAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const IS_PUBLIC_DEMO = new URLSearchParams(window.location.search).has('demo');

/**
 * Provides authentication state, multi-account registry, and session context.
 * Accounts persist in localStorage until manually removed via logout.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [addingAccount, setAddingAccount] = useState(false);
  const activeIdRef = useRef<string | null>(null);
  const switchingRef = useRef(false);
  /** True while a programmatic login (master or dispatcher) is completing —
   * suppresses the onAuthStateChanged self-adoption path so the service
   * identity is never registered as a phantom dispatcher account. */
  const suppressAdoptRef = useRef(false);

  const syncAccounts = () => setAccounts(loadAccounts());

  /**
   * Commits an account as the active session (registry id + AdminSession).
   * For master accounts with no Firebase identity yet, re-establishes the
   * service identity in the background (never blocks).
   */
  const commitActive = (record: AccountRecord | null) => {
    activeIdRef.current = record?.id ?? null;
    setActiveAccountId(record?.id ?? null);
    // Persist so the registry restores after a reload (until manual sign-out).
    setActiveId(record?.id ?? null);
    if (!record) {
      setAdminSession(null);
      return;
    }
    setAdminSession(toAdminSession(record));
    if (record.kind === 'master' && !auth.currentUser && masterPassword && masterFirebaseEmails.length > 0) {
      void establishFirebaseIdentity(masterPassword);
    }
  };

  /** Upserts (bumping lastUsedAt), syncs state, and activates the record. */
  const activateRecord = (input: AccountInput) => {
    const record = upsertAccount(input);
    syncAccounts();
    commitActive(record);
    return record;
  };

  useEffect(() => {
    // Public demo mode (?demo): render with mock data and no real session.
    if (IS_PUBLIC_DEMO) {
      setAdminSession({ email: 'demo@wasalt.io', role: 'SUPER_ADMIN' });
      setLoading(false);
      return;
    }

    // 1. Migrate any pre-multi-account legacy session into the registry.
    // 2. Restore the persisted active account (indefinite localStorage session).
    try {
      migrateLegacySession();
      const stored = loadAccounts();
      const activeId = getActiveId();
      setAccounts(stored);
      const active = stored.find((a) => a.id === activeId) ?? null;
      commitActive(active);
    } catch (err) {
      console.warn('[Auth] Failed to restore account registry:', err);
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      // Adopt a surviving Firebase session only when no registry account is
      // active and no programmatic login is in flight (never adopt the
      // service identity as a dispatcher account during master login).
      if (fbUser && fbUser.email && activeIdRef.current === null && !suppressAdoptRef.current) {
        void resolveRoleFromRTDB(fbUser.uid, fbUser.email).then(({ role, companyId }) => {
          if (activeIdRef.current !== null) return; // a login won the race
          activateRecord({
            id: `company:${fbUser.email!.toLowerCase()}`,
            email: fbUser.email!,
            role,
            companyId,
            kind: 'company',
            label: fbUser.email!,
          });
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Master Admin Login requiring Username, Password, and Authenticator App OTP.
   * Always persists the account to the registry (no remember-me distinction).
   */
  const loginMasterAdmin = async (
    username: string,
    pass: string,
    otpToken: string
  ): Promise<void> => {
    const cleanUser = username.trim().toLowerCase();

    // Fail loudly on missing configuration instead of falling back to a
    // bundled default credential (see config/masterAdmin.ts).
    const cfgUser = masterUsername;
    const cfgPass = masterPassword;
    const cfgSecret = masterTotpSecret;
    if (!cfgUser || !cfgPass || !cfgSecret || masterFirebaseEmails.length === 0) {
      throw new Error(getMasterConfigError() || 'Admin configuration incomplete.');
    }

    if (cleanUser !== cfgUser.toLowerCase()) {
      throw new Error('Invalid master admin username.');
    }

    if (pass !== cfgPass) {
      throw new Error('Invalid master admin password.');
    }

    const isValidOTP = await verifyTOTP(otpToken, cfgSecret);
    if (!isValidOTP) {
      throw new Error('Invalid or expired 6-digit Authenticator OTP code. Check your authenticator app time.');
    }

    // Authenticate with the configured Firebase service identity to satisfy RTDB security rules (auth != null)
    suppressAdoptRef.current = true;
    try {
      await establishFirebaseIdentity(cfgPass);
      activateRecord({
        id: `master:${cleanUser}`,
        email: `${cleanUser}@wasalt.eg (Master Admin)`,
        role: 'SUPER_ADMIN',
        kind: 'master',
        label: cleanUser,
      });
      setAddingAccount(false);
    } finally {
      suppressAdoptRef.current = false;
    }
  };

  /**
   * Company Dispatcher login via Firebase Auth.
   * Role/companyId are resolved from the RTDB admin profile when present,
   * falling back to email heuristics. Always persisted to the registry.
   */
  const loginWithFirebase = async (email: string, pass: string): Promise<void> => {
    suppressAdoptRef.current = true;
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user && cred.user.email) {
        const { role, companyId } = await resolveRoleFromRTDB(cred.user.uid, cred.user.email);
        activateRecord({
          id: `company:${cred.user.email.toLowerCase()}`,
          email: cred.user.email,
          role,
          companyId,
          kind: 'company',
          label: cred.user.email,
        });
        setAddingAccount(false);
      }
    } finally {
      suppressAdoptRef.current = false;
    }
  };

  /**
   * Instantly switches to another already-added account (silent, no
   * password/TOTP re-entry). Unknown ids warn without crashing.
   */
  const switchAccount = async (id: string): Promise<void> => {
    if (switchingRef.current) return;
    const record = loadAccounts().find((a) => a.id === id);
    if (!record) {
      console.warn(`[Auth] switchAccount: unknown account id "${id}"`);
      return;
    }
    if (id === activeIdRef.current) return;
    switchingRef.current = true;
    try {
      activateRecord({
        id: record.id,
        email: record.email,
        role: record.role,
        companyId: record.companyId,
        kind: record.kind,
        label: record.label,
      });
    } catch (err) {
      console.warn('[Auth] switchAccount failed:', err);
    } finally {
      switchingRef.current = false;
    }
  };

  /**
   * Removes a single account from the registry. Removing the active account
   * activates the most-recent remaining one, or falls back to the login screen.
   */
  const removeAccount = async (id: string): Promise<void> => {
    removeAccountFromStore(id);
    syncAccounts();
    if (id === activeIdRef.current) {
      const next = pickMostRecent(loadAccounts());
      if (next) {
        activateRecord({
          id: next.id,
          email: next.email,
          role: next.role,
          companyId: next.companyId,
          kind: next.kind,
          label: next.label,
        });
      } else {
        commitActive(null);
        try {
          await signOut(auth);
        } catch (err) {
          console.warn('[Auth] Firebase signOut failed:', err);
        }
      }
    }
  };

  /**
   * Manual sign-out: removes ONLY the current account from the registry,
   * clears the Firebase identity, then activates the most-recent remaining
   * account (other added accounts stay signed in).
   */
  const logout = async (): Promise<void> => {
    const currentId = activeIdRef.current;
    if (currentId) {
      removeAccountFromStore(currentId);
      syncAccounts();
    }
    activeIdRef.current = null;
    setActiveAccountId(null);
    setAdminSession(null);
    const next = pickMostRecent(loadAccounts());
    if (next) {
      // Remaining accounts keep RTDB access: preserve the existing Firebase
      // identity (rules require auth != null) — only drop it when the
      // registry is empty.
      activateRecord({
        id: next.id,
        email: next.email,
        role: next.role,
        companyId: next.companyId,
        kind: next.kind,
        label: next.label,
      });
    } else {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('[Auth] Firebase signOut failed:', err);
      }
    }
  };

  const beginAddAccount = () => setAddingAccount(true);
  const cancelAddAccount = () => setAddingAccount(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        adminSession,
        loading,
        accounts,
        activeAccountId,
        addingAccount,
        loginWithFirebase,
        loginMasterAdmin,
        logout,
        switchAccount,
        removeAccount,
        beginAddAccount,
        cancelAddAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Provides master admin authentication credentials and actions.
 */
export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AuthProvider');
  return context;
};
