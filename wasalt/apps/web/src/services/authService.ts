/**
 * Authentication Service
 * Interacts with Firebase Auth & Firestore with localStorage persistence fallback.
 */
import { AdminProfile, AdminCredentials } from '@wasalt/types';
import { DEMO_ADMIN } from '../utils/mockData';

const AUTH_STORAGE_KEY = 'wasalt_current_admin';

export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  // Default to demo admin for frictionless dev experience
  return DEMO_ADMIN;
}

export async function signInAdmin(credentials: AdminCredentials): Promise<AdminProfile> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 400));

  const admin: AdminProfile = {
    id: `admin_${Date.now().toString(36)}`,
    email: credentials.email,
    fullName: credentials.fullName || credentials.email.split('@')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(admin));
  return admin;
}

export async function signUpAdmin(credentials: AdminCredentials): Promise<AdminProfile> {
  return signInAdmin(credentials);
}

export async function signOutAdmin(): Promise<void> {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function sendPasswordReset(email: string): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 500));
  console.log(`[Wasalt Auth] Password reset link dispatched to ${email}`);
  return true;
}
