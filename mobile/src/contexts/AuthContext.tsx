import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '../utils/appleAuth';
import { auth } from '../config/firebase';
import { useUserType } from './UserTypeContext';
import {
  AccountRecord,
  getActiveUid,
  loadAccounts,
  migrateCurrentUser,
  setActiveUid,
  storeCredentials,
  upsertAccount,
} from '../utils/accountStore';
import {
  SessionControls,
  performAccountSwitch,
  performAddAccount,
  performLogout,
  reloadAccounts,
} from '../utils/accountSwitch';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accounts: AccountRecord[];
  activeAccount: AccountRecord | null;
  activeUid: string | null;
  isSwitching: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  /** Silent switch to an already-added account (re-authenticates in background). */
  switchAccount: (uid: string) => Promise<void>;
  /** Signs out of Firebase but keeps the current account saved, for a new login. */
  addAccount: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Accesses the current user authentication state and methods.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Provides authentication state and user session context to child components.
 * Requires UserTypeProvider as an ancestor (wired in App.tsx) so account
 * switches can update the active role without provider-order races.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [activeUid, setActiveUidState] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const switchingRef = useRef(false);

  const { userType, setUserType, clearUserType } = useUserType();
  const controls: SessionControls = { setUserType, clearUserType };

  // Ref mirror so long-lived effects see the latest role without re-subscribing.
  const userTypeRef = useRef(userType);
  useEffect(() => {
    userTypeRef.current = userType;
  }, [userType]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Boot: restore registry + active pointer from AsyncStorage.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [list, active] = await Promise.all([loadAccounts(), getActiveUid()]);
        if (!cancelled) {
          setAccounts(list);
          setActiveUidState(active);
        }
      } catch (error) {
        console.warn('[Auth] Failed to restore account registry:', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // First boot with a restored Firebase session: register it in the registry
  // (waits for userType so drivers are not mislabelled while AsyncStorage loads).
  useEffect(() => {
    if (!user || !userType) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await migrateCurrentUser(user, userType);
        if (cancelled) return;
        setAccounts(list);
        const active = await getActiveUid();
        if (!cancelled && active !== user.uid) {
          await setActiveUid(user.uid);
          setActiveUidState(user.uid);
        }
      } catch (error) {
        console.warn('[Auth] Failed to migrate current user into registry:', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, userType]);

  const activeAccount = useMemo(
    () => accounts.find((acc) => acc.uid === activeUid) ?? null,
    [accounts, activeUid]
  );

  /**
   * Records a successful email/password session: registry upsert, active
   * pointer, and password vault entry (failures degrade, never block login).
   */
  const registerSession = async (
    profile: { uid: string; email?: string | null; displayName?: string | null },
    password: string
  ) => {
    try {
      const list = await upsertAccount({
        uid: profile.uid,
        email: profile.email ?? '',
        displayName:
          profile.displayName || profile.email?.split('@')[0] || 'User',
        userType: userTypeRef.current ?? 'passenger',
        lastUsedAt: Date.now(),
      });
      setAccounts(list);
      await setActiveUid(profile.uid);
      setActiveUidState(profile.uid);
      if (password) {
        await storeCredentials(profile.uid, profile.email ?? '', password);
      }
    } catch (error) {
      console.warn('[Auth] Failed to record signed-in account:', error);
    }
  };

  /**
   * Signs in a user with email and password via Firebase Auth.
   */
  const signIn = async (email: string, password: string) => {
    // Hardcoded credential allowlists are prohibited (dev_rules #3). Accounts are
    // provisioned through Firebase Auth sign-up (signUp) or the Firebase console —
    // never from credentials bundled inside the app.
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await registerSession(credential.user, password);
  };

  /**
   * Registers a new user account with email, password, and username.
   */
  const signUp = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: username
      });
      await registerSession(
        {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: username,
        },
        password
      );
    } catch (error) {
      throw error;
    }
  };

  /**
   * Initiates Google OAuth single sign-on authentication.
   * @suggestion [INTEGRATE]: If Google SSO is required for commuters, configure native Google Sign-In credentials in app.json and wire a button in LoginScreen.tsx, or remove if Email/Password and Apple SSO suffice.
   */
  const signInWithGoogle = async () => {
    // Google Sign-In temporarily disabled for Expo Go compatibility
    throw new Error('Google Sign-In is not available in Expo Go. Please use email/password authentication.');
  };

  /**
   * Initiates Apple ID OAuth single sign-on authentication.
   */
  const signInWithApple = async () => {
    try {
      // Check if Apple Sign-In is available
      const isAvailable = appleAuth.isSupported;
      if (!isAvailable) {
        throw new Error('Apple Sign-In is not available on this device.');
      }

      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = new (await import('firebase/auth')).OAuthProvider('apple.com').credential({
        idToken: identityToken,
        rawNonce: nonce,
      });

      // Sign the user in with the credential
      await signInWithCredential(auth, appleCredential);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Sends a password reset email to the specified address.
   */
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Silently switches to another added account using its stored password.
   * Throws a friendly message on failure (caller shows the Alert).
   */
  const switchAccount = async (uid: string) => {
    if (switchingRef.current) return; // double-tap guard
    switchingRef.current = true;
    setIsSwitching(true);
    try {
      await performAccountSwitch(uid, {
        accounts,
        currentUser: user,
        currentIsDriver: userType === 'driver',
        controls,
      });
      setAccounts(await reloadAccounts());
      setActiveUidState(await getActiveUid());
    } catch (error) {
      setAccounts(await reloadAccounts());
      setActiveUidState(await getActiveUid());
      throw error;
    } finally {
      switchingRef.current = false;
      setIsSwitching(false);
    }
  };

  /**
   * Begins "add a new login": signs out of Firebase only. The current account
   * stays in the registry (with its credentials) and remains switchable.
   */
  const addAccount = async () => {
    if (switchingRef.current) return; // double-tap guard
    switchingRef.current = true;
    setIsSwitching(true);
    try {
      await performAddAccount(user, userType === 'driver', controls);
      setActiveUidState(null);
    } finally {
      switchingRef.current = false;
      setIsSwitching(false);
    }
  };

  /**
   * Signs out and removes ONLY the current account from the list. Other added
   * accounts and their stored credentials remain available for switching.
   */
  const logout = async () => {
    try {
      await performLogout(user, controls);
      setUser(null);
      setActiveUidState(null);
      setAccounts(await reloadAccounts());
      // await GoogleSignin.signOut(); // Temporarily disabled
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    accounts,
    activeAccount,
    activeUid,
    isSwitching,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
    switchAccount,
    addAccount,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
