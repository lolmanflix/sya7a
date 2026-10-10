import { initializeApp } from 'firebase/app';
// @ts-expect-error - getReactNativePersistence is provided by @firebase/auth in React Native environments
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Firebase configuration — injected exclusively via EXPO_PUBLIC_* env vars from
 * `mobile/.env` (gitignored; template: `mobile/.env.example`). Metro inlines these
 * at bundle time. Hardcoding credentials here is prohibited (dev_rules #3).
 */
const ENV = process.env as Record<string, string | undefined>;

const REQUIRED_ENV_KEYS = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_DATABASE_URL',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
] as const;

/** Fail fast with an actionable message instead of booting a broken Firebase app. */
const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !ENV[key]);
if (missingKeys.length > 0) {
  throw new Error(
    `Firebase configuration missing: ${missingKeys.join(', ')}. ` +
      'Create mobile/.env from mobile/.env.example, fill in the values, then restart Metro with `npx expo start -c`.'
  );
}

const firebaseConfig = {
  apiKey: ENV.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: ENV.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: ENV.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: ENV.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: ENV.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: ENV.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Realtime Database
const database = getDatabase(app);

export { auth, database };
export default app;
