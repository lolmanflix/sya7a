import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, ColorMode } from './translations';

export type { Language, ColorMode };

interface LanguageThemeContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

const LanguageThemeContext = createContext<LanguageThemeContextType | undefined>(undefined);

export const LanguageThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('wasalt_lang') as Language) || 'ar'; // Defaulting to Arabic or saved choice
  });

  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    return (localStorage.getItem('wasalt_color_mode') as ColorMode) || 'light';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem('wasalt_lang', language);
  }, [language, dir]);

  useEffect(() => {
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('wasalt_color_mode', colorMode);
  }, [colorMode]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setColorMode = (mode: ColorMode) => setColorModeState(mode);
  const toggleColorMode = () => setColorModeState((prev) => (prev === 'light' ? 'dark' : 'light'));

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageThemeContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        t,
        colorMode,
        setColorMode,
        toggleColorMode
      }}
    >
      {children}
    </LanguageThemeContext.Provider>
  );
};

export const useLanguageTheme = (): LanguageThemeContextType => {
  const ctx = useContext(LanguageThemeContext);
  if (!ctx) {
    throw new Error('useLanguageTheme must be used within LanguageThemeProvider');
  }
  return ctx;
};
