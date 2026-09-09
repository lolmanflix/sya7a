import { initializeApp } from 'firebase/app';
// @ts-expect-error - getReactNativePersistence is provided by @firebase/auth in React Native environments
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChUygjS8ysqYzCk6VjoGMa1YdR5C4L77s",
  authDomain: "tracking-72393.firebaseapp.com",
  databaseURL: "https://tracking-72393-default-rtdb.firebaseio.com",
  projectId: "tracking-72393",
  storageBucket: "tracking-72393.firebasestorage.app",
  messagingSenderId: "701536417094",
  appId: "1:701536417094:web:743f96fac5e92dd46da147",
  measurementId: "G-EJQNZRSQLS"
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
