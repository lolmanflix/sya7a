import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '../utils/appleAuth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Google Sign-In temporarily disabled for Expo Go compatibility
    // GoogleSignin.configure({
    //   webClientId: '701536417094-n6pmukjrdvk0l9a1miilq40iu2430i21.apps.googleusercontent.com',
    // });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // Provision the requested preconfigured users once, through Firebase
      // Authentication, so database rules still identify the signed-in user.
      const PRECONFIGURED_USERS: Record<string, { password: string; name: string }> = {
        'essamhamza@gmail.com': { password: 'essam1234', name: 'Essam Hamza' },
        'kareemdiyaaa2007@gmail.com': { password: 'lolmanflix', name: 'Kareem Diyaa' },
        'kareemdiyaaa200@gmail.com': { password: 'lolmanflix', name: 'Kareem Diyaa' },
      };
      const normalizedEmail = email.trim().toLowerCase();
      const testUser = PRECONFIGURED_USERS[normalizedEmail];
      const isTestUser = !!testUser && testUser.password === password;
      if (isTestUser && (error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential' || error?.code === 'auth/invalid-login-credentials')) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: testUser.name });
        return;
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: username
      });
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    // Google Sign-In temporarily disabled for Expo Go compatibility
    throw new Error('Google Sign-In is not available in Expo Go. Please use email/password authentication.');
  };

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

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      if (auth.currentUser) await signOut(auth);
      // await GoogleSignin.signOut(); // Temporarily disabled
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
