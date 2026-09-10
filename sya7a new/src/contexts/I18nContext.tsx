import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'ar';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
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
    // New keys
    activeBuses: 'Active Buses',
    allRoutes: 'All Routes',
    noBusesActive: 'No buses currently active',
    openMap: 'Open Map',
    saveFavorites: 'Save to Favorites',
    busLine: 'Bus Line',
    selectBusLine: 'Select Bus Line',
    destination: 'Destination',
    pickOnMap: 'Pick on Map',
    startSharing: 'Start Live Sharing',
    stopSharing: 'Stop Sharing',
    driverDashboard: 'Driver Dashboard',
    company: 'Company',
    away: 'Away',
    busesActive: 'buses active',
    noActiveBuses: 'No active buses',
    lines: 'lines',
    line1: 'line',
    headingTo: 'Heading to',
    updated: 'Updated',
    driver: 'Driver',
    liveLocation: 'Live Location',
    confirmLocation: 'Confirm Location',
    searchDestination: 'Search destination',
    useCurrentLocation: 'Use Current Location',
    busesActive2: 'buses active',
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
    // New keys
    activeBuses: 'الحافلات النشطة',
    allRoutes: 'جميع الخطوط',
    noBusesActive: 'لا توجد حافلات نشطة حالياً',
    openMap: 'فتح الخريطة',
    saveFavorites: 'حفظ في المفضلة',
    busLine: 'خط الحافلة',
    selectBusLine: 'اختر خط الحافلة',
    destination: 'الوجهة',
    pickOnMap: 'اختر على الخريطة',
    startSharing: 'بدء المشاركة المباشرة',
    stopSharing: 'إيقاف المشاركة',
    driverDashboard: 'لوحة السائق',
    company: 'الشركة',
    away: 'بعيد',
    busesActive: 'حافلات نشطة',
    noActiveBuses: 'لا حافلات نشطة',
    lines: 'خطوط',
    line1: 'خط',
    headingTo: 'متجه إلى',
    updated: 'تحديث',
    driver: 'السائق',
    liveLocation: 'الموقع المباشر',
    confirmLocation: 'تأكيد الموقع',
    searchDestination: 'ابحث عن الوجهة',
    useCurrentLocation: 'استخدام الموقع الحالي',
    busesActive2: 'حافلة نشطة',
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

  const t = useMemo(() => (key: string, fallback?: string) => MESSAGES[lang][key] ?? fallback ?? key, [lang]);
  const isRTL = lang === 'ar';

  const value: I18nContextType = { lang, setLang, t, isRTL };

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
