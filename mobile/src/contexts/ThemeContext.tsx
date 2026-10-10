/**
 * @file ThemeContext.tsx
 * @description Application color scheme provider. Light/dark token palettes are
 * branded from the active white-label tenant (primary follows
 * getTenantBranding().primaryColor) while mode-specific success/danger/text
 * tokens keep their platform semantics.
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTenantBranding } from '../config/tenantConfig';
import { useTenantArchetype } from '../hooks/useTenantArchetype';

type ThemeMode = 'light' | 'dark';

interface Theme {
  mode: ThemeMode;
  colors: {
    background: string;
    card: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    success: string;
    danger: string;
    muted: string;
    searchBg: string;
  };
}

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LIGHT: Theme = {
  mode: 'light',
  colors: {
    background: '#FFFFFF',
    card: '#FFFFFF',
    border: '#F0F0F0',
    textPrimary: '#000000',
    textSecondary: '#666666',
    primary: '#007AFF',
    success: '#34C759',
    danger: '#FF3B30',
    muted: '#999999',
    searchBg: '#F8F8F8',
  },
};

const DARK: Theme = {
  mode: 'dark',
  colors: {
    background: '#000000',
    card: '#121212',
    border: '#222222',
    textPrimary: '#FFFFFF',
    textSecondary: '#D0D0D0',
    primary: '#0A84FF',
    success: '#30D158',
    danger: '#FF453A',
    muted: '#8E8E93',
    searchBg: '#1C1C1E',
  },
};

const STORAGE_KEY = 'app_theme_mode_v1';

/**
 * Provides application color scheme, mode toggle, and the tenant-branded
 * primary color (from getTenantBranding().primaryColor) for the active archetype.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const archetype = useTenantArchetype();

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          setMode(saved);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
  }, [mode]);

  /**
   * Applies the tenant brand primary over the mode palette, keeping every
   * other token (success/danger/text/background) mode-specific.
   */
  const theme = useMemo(() => {
    const base = mode === 'dark' ? DARK : LIGHT;
    const brandPrimary = getTenantBranding(archetype).primaryColor;
    if (!brandPrimary || brandPrimary === base.colors.primary) return base;
    return { ...base, colors: { ...base.colors, primary: brandPrimary } };
  }, [mode, archetype]);

  const value = useMemo(
    () => ({ theme, mode, setMode, toggleMode: () => setMode(prev => (prev === 'dark' ? 'light' : 'dark')) }),
    [theme, mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Accesses current theme tokens, color palette, and mode toggle.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}



