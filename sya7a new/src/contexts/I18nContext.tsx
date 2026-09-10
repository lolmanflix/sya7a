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
    // Driver & Safety ViewFinder keys
    safeTripGuard: 'SafeTrip Guard™',
    liveCabinMonitoring: 'Live cabin monitoring',
    camPill: 'CAM',
    micPill: 'MIC',
    camMicPermRequired: 'Camera & Mic Access Required',
    camMicPermDesc: 'Live cabin camera and audio monitoring keeps every trip safe, fully recorded, and accountable.',
    enableSafetyMonitoring: 'Enable Safety Monitoring',
    recLiveCabin: '● REC  LIVE CABIN FEED',
    audioGuardActive: 'Audio Guard Active',
    micAccessNeeded: 'Mic Access Needed',
    cabinCameraBackground: 'Cabin Camera Running in Background',
    liveBadge: 'LIVE',
    hideViewfinder: 'Hide Viewfinder',
    showViewfinder: 'Show Viewfinder',
    activeRoute: 'Active Route',
    emergencySOS: 'Emergency SOS Signal',
    liveDispatch: 'LIVE DISPATCH',
    speedUnitKmh: 'KM/H',
    lineLabel: 'LINE',
    destinationLabel: 'DESTINATION',
    onLiveTrip: 'On Live Trip',
    standby: 'Standby',
    quickDestinations: 'QUICK DESTINATIONS',
    startLiveTrip: 'Start Live Trip',
    startLiveTripSub: 'Location sharing + Safety monitoring',
    endLiveTrip: 'End Live Trip Broadcast',
    selectedBadge: 'Selected',
    selectedLabel: 'Selected',
    // Subscription & Sidebar keys
    currentTier: 'Current Plan',
    freePlanName: 'Free Plan',
    proPlanName: 'Pro Plan',
    familyPlanName: 'Family Plan',
    freePlanBadge: 'FREE',
    upgradePlan: 'Plans',
    plansAndPricing: 'Plans',
    currentPlanActive: 'Current',
    selectPlan: 'Use this plan',
    choosePlan: 'Change plan',
    chooseBestPlan: 'Everyone starts on Free. You can switch anytime.',
    mostPopular: 'Pro',
    egpMonth: 'EGP / month',
    egpMonthPerson: 'EGP / month per person',
    freePrice: '0 EGP',
    proPrice: '20 EGP',
    familyPrice: '17 EGP',
    familyPriceOld: '20 EGP',
    discountBadge: '17 instead of 20 per person',
    freeFeature1: 'This is the default plan',
    freeFeature2: 'Live bus tracking and ETAs',
    freeFeature3: 'Ads may show in the app',
    proFeature1: 'No ads',
    proFeature2: 'Pay for the bus from the app',
    proFeature3: 'See if the bus is crowded',
    familyFeature1: 'See where family phones are on the map',
    familyFeature2: 'Mic and camera access',
    familyFeature3: 'Same Pro extras: no ads, in-app pay, crowded buses',
    subscriptionNote: 'Prices are in EGP and billed monthly.',
    historyTitle: 'Saved routes',
    noHistory: 'No saved routes yet',
    clearHistory: 'Clear',
    clearHistoryConfirm: 'Clear all saved routes?',
    routeSavedSuccess: 'Route saved',
    saveRoute: 'Save route',
    busTracker: 'Bus Tracker',
    historyMenu: 'History',
    subscriptionMenu: 'Subscription',
    logoutMenu: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
    planSubscribedSuccess: 'Plan updated',
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
    // Driver & Safety ViewFinder keys
    safeTripGuard: 'حارس الرحلة الآمنة™',
    liveCabinMonitoring: 'مراقبة الكابينة مباشرة',
    camPill: 'كاميرا',
    micPill: 'مايك',
    camMicPermRequired: 'مطلوب إذن الكاميرا والميكروفون',
    camMicPermDesc: 'المراقبة الحية لكاميرا وصوت الكابينة تضمن أمان كل رحلة وتسجيلها بالكامل.',
    enableSafetyMonitoring: 'تفعيل مراقبة الأمان',
    recLiveCabin: '● بث مباشر لكابينة السائق',
    audioGuardActive: 'الحارس الصوتي نشط',
    micAccessNeeded: 'مطلوب إذن الميكروفون',
    cabinCameraBackground: 'كاميرا الكابينة تعمل في الخلفية',
    liveBadge: 'مباشر',
    hideViewfinder: 'إخفاء شاشة المعاينة',
    showViewfinder: 'عرض شاشة المعاينة',
    activeRoute: 'المسار النشط',
    emergencySOS: 'إرسال نداء استغاثة طوارئ SOS',
    liveDispatch: 'إرسال مباشر',
    speedUnitKmh: 'كم/س',
    lineLabel: 'الخط',
    destinationLabel: 'الوجهة',
    onLiveTrip: 'في رحلة نشطة',
    standby: 'جاهز',
    quickDestinations: 'وجهات شائعة',
    startLiveTrip: 'بدء الرحلة الحية',
    startLiveTripSub: 'مشاركة الموقع + مراقبة الأمان',
    endLiveTrip: 'إنهاء بث الرحلة الحالي',
    selectedBadge: 'محدد',
    selectedLabel: 'المحدد',
    // Subscription & Sidebar keys
    currentTier: 'الخطة الحالية',
    freePlanName: 'الباقة المجانية',
    proPlanName: 'الباقة الاحترافية',
    familyPlanName: 'باقة العائلة',
    freePlanBadge: 'مجاني',
    upgradePlan: 'الباقات',
    plansAndPricing: 'الباقات',
    currentPlanActive: 'الحالية',
    selectPlan: 'اختيار هذه الباقة',
    choosePlan: 'تغيير الباقة',
    chooseBestPlan: 'الباقة المجانية هي الافتراضية. تقدر تغيّر في أي وقت.',
    mostPopular: 'احترافية',
    egpMonth: 'جنيه / شهر',
    egpMonthPerson: 'جنيه / شهر لكل فرد',
    freePrice: '0 جنيه',
    proPrice: '20 جنيه',
    familyPrice: '17 جنيه',
    familyPriceOld: '20 جنيه',
    discountBadge: '17 بدل 20 لكل فرد',
    freeFeature1: 'هذه الباقة الافتراضية',
    freeFeature2: 'تتبع الحافلات ووقت الوصول',
    freeFeature3: 'قد تظهر إعلانات',
    proFeature1: 'بدون إعلانات',
    proFeature2: 'الدفع من داخل التطبيق',
    proFeature3: 'معرفة إذا كانت الحافلة مزدحمة',
    familyFeature1: 'تتبع هواتف أفراد العائلة',
    familyFeature2: 'الوصول للميكروفون والكاميرا',
    familyFeature3: 'نفس مزايا الاحترافية: بدون إعلانات والدفع ومعرفة الزحام',
    subscriptionNote: 'الأسعار بالجنيه المصري وتُحسب شهرياً.',
    historyTitle: 'الخطوط المحفوظة',
    noHistory: 'لا توجد خطوط محفوظة بعد',
    clearHistory: 'مسح',
    clearHistoryConfirm: 'مسح كل الخطوط المحفوظة؟',
    routeSavedSuccess: 'تم حفظ الخط',
    saveRoute: 'حفظ الخط',
    busTracker: 'تتبع الحافلات',
    historyMenu: 'السجل',
    subscriptionMenu: 'الاشتراك',
    logoutMenu: 'تسجيل الخروج',
    logoutConfirm: 'هل أنت متأكد من تسجيل الخروج؟',
    planSubscribedSuccess: 'تم تفعيل الاشتراك بنجاح',
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
