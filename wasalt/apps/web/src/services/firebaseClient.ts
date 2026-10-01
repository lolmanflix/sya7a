/**
 * Firebase App & Services Initializer
 * Provides Auth and Firestore connections with safe local fallbacks.
 */
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'tracking-72393.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'tracking-72393',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'tracking-72393.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('[Wasalt Firebase] Initialization notice:', err);
  app = ({} as unknown) as FirebaseApp;
  auth = ({} as unknown) as Auth;
  db = ({} as unknown) as Firestore;
}

export { app, auth, db };
