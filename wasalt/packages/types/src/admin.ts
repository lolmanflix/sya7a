/**
 * Admin identity and profile data models
 */

export interface AdminProfile {
  id: string; // Corresponds to Firebase Auth UID
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  jobTitle?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface AdminCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthSession {
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
