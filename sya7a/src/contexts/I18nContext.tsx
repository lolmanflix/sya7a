import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'ar';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'app_language_v1';

const MESSAGES: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'Bus Tracker',
    searchBus: 'Search bus line',
    activeBusSingular: 'active bus',
    activeBusPlural: 'active buses',
    noBuses: 'No buses currently active',
    eta: 'ETA',
    companies: 'Companies',
    save: 'Save',
    lastUpdated: 'Last updated',
    line: 'Line',
    settings: 'Settings',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    english: 'English',
    arabic: 'Arabic',
    close: 'Close',
  },
  ar: {
    appTitle: 'تتبع الحافلات',
    searchBus: 'ابحث عن خط الحافلة',
    activeBusSingular: 'حافلة نشطة',
    activeBusPlural: 'حافلات نشطة',
    noBuses: 'لا توجد حافلات نشطة حالياً',
    eta: 'الوقت المقدر للوصول',
    companies: 'الشركات',
    save: 'حفظ',
    lastUpdated: 'آخر تحديث',
    line: 'الخط',
    settings: 'الإعدادات',
    theme: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    language: 'اللغة',
    english: 'الإنجليزية',
    arabic: 'العربية',
    close: 'إغلاق',
  },
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'en' || saved === 'ar') {
          setLang(saved);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(() => {});
  }, [lang]);

  const t = useMemo(() => (key: string) => MESSAGES[lang][key] ?? key, [lang]);

  const value: I18nContextType = { lang, setLang, t };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}



