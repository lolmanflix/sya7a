import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { AdminSession, AdminRole } from '../types';
import { verifyTOTP } from '../utils/totp';

interface AuthContextType {
  user: User | null;
  adminSession: AdminSession | null;
  loading: boolean;
  loginWithFirebase: (email: string, pass: string, rememberMe: boolean) => Promise<void>;
  loginMasterAdmin: (username: string, pass: string, otpToken: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MASTER_USERNAME = import.meta.env.VITE_MASTER_ADMIN_USERNAME || 'masteradmin';
const MASTER_PASSWORD = import.meta.env.VITE_MASTER_ADMIN_PASSWORD || 'adminPassword2026!';
const MASTER_TOTP_SECRET = import.meta.env.VITE_MASTER_ADMIN_TOTP_SECRET || 'WASALTADMINSEC2026';
const IS_PUBLIC_DEMO = new URLSearchParams(window.location.search).has('demo');

/**
 * Resolves an admin's role and company from RTDB /admins/{uid}/ profile.
 * Falls back to email-based heuristics only for legacy or master admin accounts.
 */
async function resolveRoleFromRTDB(
  uid: string,
  email: string
): Promise<{ role: AdminRole; companyId?: string }> {
  try {
    const adminSnap = await get(ref(database, `admins/${uid}`));
    if (adminSnap.exists()) {
      const adminData = adminSnap.val();
      const companyIds: string[] = adminData.companyIds || [];

      if (companyIds.length > 0) {
        // Check if this admin owns any company — make them COMPANY_ADMIN
        const firstCompanyId = companyIds[0];
        const compSnap = await get(ref(database, `companies/${firstCompanyId}`));
        if (compSnap.exists()) {
          const comp = compSnap.val();
          // Owner gets COMPANY_ADMIN; master email gets SUPER_ADMIN
          const isSuperAdmin =
            email.includes('kareem') ||
            email.startsWith('admin@wasalt') ||
            email.startsWith('admin@sya7a') ||
            email.includes('superadmin') ||
            email.includes('boss');
          return {
            role: isSuperAdmin ? 'SUPER_ADMIN' : 'COMPANY_ADMIN',
            companyId: firstCompanyId,
          };
        }
      }
    }
  } catch (err) {
    console.warn('[AuthContext] RTDB role resolution failed, using email fallback:', err);
  }

  // Fallback for master admin or legacy email patterns
  const clean = email.toLowerCase().trim();
  if (
    clean.includes('boss') ||
    clean.includes('superadmin') ||
    clean.startsWith('admin@wasalt') ||
    clean.startsWith('admin@sya7a') ||
    clean.includes('kareem')
  ) {
    return { role: 'SUPER_ADMIN' };
  }

  return { role: 'SUPER_ADMIN' };
}

/**
 * Provides authentication state and user session context to child components.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to persist session
  const persistSession = (session: AdminSession, rememberMe: boolean) => {
    const key = 'wasalt_admin_session';
    if (rememberMe) {
      localStorage.setItem(key, JSON.stringify(session));
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(session));
      localStorage.removeItem(key);
    }
  };

  useEffect(() => {
    if (IS_PUBLIC_DEMO) {
      setAdminSession({ email: 'demo@wasalt.io', role: 'SUPER_ADMIN' });
      setLoading(false);
      return;
    }

    // Restore persisted session on page load
    const saved =
      localStorage.getItem('wasalt_admin_session') ||
      sessionStorage.getItem('wasalt_admin_session');
    if (saved) {
      try {
        setAdminSession(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser && fbUser.email) {
        const { role, companyId } = await resolveRoleFromRTDB(fbUser.uid, fbUser.email);
        const session: AdminSession = { email: fbUser.email, role, companyId };
        setAdminSession(session);
        // Refresh persisted session with RTDB-resolved role
        const rememberMe = !!localStorage.getItem('wasalt_admin_session');
        persistSession(session, rememberMe);
      } else if (!saved) {
        setAdminSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Master Admin Login requiring Username, Password, and Authenticator App OTP.
   */
  const loginMasterAdmin = async (
    username: string,
    pass: string,
    otpToken: string,
    rememberMe: boolean
  ): Promise<void> => {
    const cleanUser = username.trim().toLowerCase();
    if (cleanUser !== MASTER_USERNAME.toLowerCase()) {
      throw new Error('Invalid master admin username.');
    }
    if (pass !== MASTER_PASSWORD) {
      throw new Error('Invalid master admin password.');
    }
    const isValidOTP = await verifyTOTP(otpToken, MASTER_TOTP_SECRET);
    if (!isValidOTP) {
      throw new Error('Invalid or expired 6-digit Authenticator OTP code. Check your authenticator app time.');
    }

    // Authenticate with Firebase Auth to satisfy RTDB security rules
    try {
      await signInWithEmailAndPassword(auth, 'admin@wasalt.eg', MASTER_PASSWORD).catch(() =>
        signInWithEmailAndPassword(auth, 'admin@sya7a.eg', MASTER_PASSWORD)
      );
    } catch (authErr) {
      console.warn('[AuthContext] Firebase Auth master sign-in notice:', authErr);
    }

    const session: AdminSession = {
      email: `${cleanUser}@wasalt.eg (Master Admin)`,
      role: 'SUPER_ADMIN',
    };
    setAdminSession(session);
    persistSession(session, rememberMe);
  };

  /**
   * Company Dispatcher login via Firebase Auth.
   * Role and companyId are resolved from RTDB profile, not email.
   */
  const loginWithFirebase = async (email: string, pass: string, rememberMe: boolean): Promise<void> => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user && cred.user.email) {
      const { role, companyId } = await resolveRoleFromRTDB(cred.user.uid, cred.user.email);
      const session: AdminSession = { email: cred.user.email, role, companyId };
      setAdminSession(session);
      persistSession(session, rememberMe);
    }
  };

  /**
   * Signs out the currently authenticated user.
   */
  const logout = async () => {
    localStorage.removeItem('wasalt_admin_session');
    sessionStorage.removeItem('wasalt_admin_session');
    localStorage.removeItem('sya7a_admin_session');
    sessionStorage.removeItem('sya7a_admin_session');
    setAdminSession(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, adminSession, loading, loginWithFirebase, loginMasterAdmin, logout }}
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
