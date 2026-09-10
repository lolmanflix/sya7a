import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../config/firebase';
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to determine role from email
  const resolveRole = (email: string): { role: AdminRole; companyId?: string } => {
    const clean = email.toLowerCase().trim();
    if (clean.includes('boss') || clean.includes('superadmin') || clean.startsWith('admin@wasalt') || clean.startsWith('admin@sya7a') || clean.includes('kareem')) {
      return { role: 'SUPER_ADMIN' };
    }
    const match = clean.match(/admin@([a-z0-9-]+)\.eg/);
    if (match && match[1]) {
      const compKey = match[1] === 'whitebus' ? 'white-bus' : match[1] === 'mwaslatmisr' ? 'mwaslat-misr' : match[1] === 'gobus' ? 'go-bus' : match[1] === 'superjet' ? 'super-jet' : match[1];
      return { role: 'COMPANY_ADMIN', companyId: compKey };
    }
    return { role: 'SUPER_ADMIN' };
  };

  useEffect(() => {
    // 1. Check persistent sessions (localStorage or sessionStorage)
    const localSaved = localStorage.getItem('wasalt_admin_session') || localStorage.getItem('sya7a_admin_session');
    const sessionSaved = sessionStorage.getItem('wasalt_admin_session') || sessionStorage.getItem('sya7a_admin_session');
    const activeSaved = localSaved || sessionSaved;

    if (activeSaved) {
      try {
        const parsed = JSON.parse(activeSaved);
        setAdminSession(parsed);
        if (parsed.role === 'SUPER_ADMIN' && !auth.currentUser) {
          signInWithEmailAndPassword(auth, 'admin@wasalt.eg', MASTER_PASSWORD)
            .catch(() => signInWithEmailAndPassword(auth, 'admin@sya7a.eg', MASTER_PASSWORD))
            .catch(() => {});
        }
      } catch {
        setAdminSession(null);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      if (fbUser && fbUser.email && !activeSaved) {
        const { role, companyId } = resolveRole(fbUser.email);
        const session: AdminSession = { email: fbUser.email, role, companyId };
        setAdminSession(session);
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

    // Authenticate with Firebase Auth as Master Admin to satisfy RTDB security rules (auth != null)
    try {
      await signInWithEmailAndPassword(auth, 'admin@wasalt.eg', MASTER_PASSWORD)
        .catch(() => signInWithEmailAndPassword(auth, 'admin@sya7a.eg', MASTER_PASSWORD));
    } catch (authErr) {
      console.warn('Firebase Auth Master Admin sign-in notice:', authErr);
    }

    const session: AdminSession = {
      email: `${cleanUser}@wasalt.eg (Master Admin)`,
      role: 'SUPER_ADMIN',
    };

    setAdminSession(session);
    if (rememberMe) {
      localStorage.setItem('wasalt_admin_session', JSON.stringify(session));
      sessionStorage.removeItem('wasalt_admin_session');
    } else {
      sessionStorage.setItem('wasalt_admin_session', JSON.stringify(session));
      localStorage.removeItem('wasalt_admin_session');
    }
  };

  /**
   * Company Dispatcher login via Firebase Auth.
   */
  const loginWithFirebase = async (email: string, pass: string, rememberMe: boolean): Promise<void> => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user && cred.user.email) {
      const { role, companyId } = resolveRole(cred.user.email);
      const session: AdminSession = { email: cred.user.email, role, companyId };
      setAdminSession(session);
      if (rememberMe) {
        localStorage.setItem('wasalt_admin_session', JSON.stringify(session));
        sessionStorage.removeItem('wasalt_admin_session');
      } else {
        sessionStorage.setItem('wasalt_admin_session', JSON.stringify(session));
        localStorage.removeItem('wasalt_admin_session');
      }
    }
  };

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

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AuthProvider');
  return context;
};
