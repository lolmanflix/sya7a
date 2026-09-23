import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserType = 'passenger' | 'driver' | null;

interface UserTypeContextType {
  userType: UserType;
  setUserType: (type: Exclude<UserType, null>) => void;
  clearUserType: () => void;
}

const STORAGE_KEY = 'app_user_type_v1';

const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

/**
 * Provides user role state (passenger, driver) to child components.
 */
export function UserTypeProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserTypeState] = useState<UserType>(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'passenger' || saved === 'driver') {
          setUserTypeState(saved);
        }
      } catch {}
    })();
  }, []);

  /**
   * Updates and persists active user role selection.
   */
  const setUserType = (type: Exclude<UserType, null>) => {
    setUserTypeState(type);
    AsyncStorage.setItem(STORAGE_KEY, type).catch(() => {});
  };

  /**
   * Clears the active user role selection from state.
   * @suggestion [DELETE]: Unused across the application; switching roles or logging out utilizes setUserType() or AuthContext.logout(). Can be safely deleted once confirmed.
   */
  const clearUserType = () => {
    setUserTypeState(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  const value = useMemo(() => ({ userType, setUserType, clearUserType }), [userType]);

  return (
    <UserTypeContext.Provider value={value}>
      {children}
    </UserTypeContext.Provider>
  );
}

/**
 * Accesses the active user role selection.
 */
export function useUserType() {
  const ctx = useContext(UserTypeContext);
  if (!ctx) throw new Error('useUserType must be used within UserTypeProvider');
  return ctx;
}


