/**
 * ThemeContext — Manages dynamic company branding & CSS custom property injection
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyTheme } from '@wasalt/types';
import { getPresetThemeById, applyThemeTokens } from '@wasalt/theme';

interface ThemeContextType {
  theme: CompanyTheme;
  setTheme: (theme: CompanyTheme) => void;
  applyTemporaryTheme: (theme: CompanyTheme) => void;
  resetToCompanyTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{
  initialTheme?: CompanyTheme;
  children: React.ReactNode;
}> = ({ initialTheme, children }) => {
  const defaultTheme = initialTheme || getPresetThemeById('wasalt-sapphire');
  const [activeTheme, setActiveTheme] = useState<CompanyTheme>(defaultTheme);
  const [baseCompanyTheme, setBaseCompanyTheme] = useState<CompanyTheme>(defaultTheme);

  useEffect(() => {
    applyThemeTokens(activeTheme);
  }, [activeTheme]);

  const setTheme = (newTheme: CompanyTheme) => {
    setBaseCompanyTheme(newTheme);
    setActiveTheme(newTheme);
  };

  const applyTemporaryTheme = (tempTheme: CompanyTheme) => {
    setActiveTheme(tempTheme);
  };

  const resetToCompanyTheme = () => {
    setActiveTheme(baseCompanyTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        setTheme,
        applyTemporaryTheme,
        resetToCompanyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
