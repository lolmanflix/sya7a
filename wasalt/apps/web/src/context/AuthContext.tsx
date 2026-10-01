/**
 * AuthContext — Provides global Admin authentication state
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminProfile, AdminCredentials } from '@wasalt/types';
import * as authService from '../services/authService';

interface AuthContextType {
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AdminCredentials) => Promise<void>;
  signUp: (credentials: AdminCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService
      .getCurrentAdmin()
      .then((curr) => {
        setAdmin(curr);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (credentials: AdminCredentials) => {
    setIsLoading(true);
    try {
      const loggedIn = await authService.signInAdmin(credentials);
      setAdmin(loggedIn);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (credentials: AdminCredentials) => {
    setIsLoading(true);
    try {
      const newAdmin = await authService.signUpAdmin(credentials);
      setAdmin(newAdmin);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.signOutAdmin();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
