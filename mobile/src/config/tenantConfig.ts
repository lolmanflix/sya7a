/**
 * @file tenantConfig.ts
 * @description Centralized White-Label Multi-Tenant Configuration.
 * Enables dynamic re-branding, custom color themes, company logos, and localized
 * institutional vocabulary for public transit, private schools, universities,
 * and corporate call center shuttles without modifying component code.
 */

export type TenantArchetype =
  | 'public_transit'
  | 'school'
  | 'call_center'
  | 'university'
  | 'corporate_fleet';

export interface TenantBranding {
  /** Display name of the institution or transport service */
  appName: string;
  /** Arabic display name */
  appNameAr: string;
  /** Primary brand accent color (e.g., #2563EB for transit, #F59E0B for school) */
  primaryColor: string;
  /** Secondary accent color */
  secondaryColor: string;
  /** Header / Card background tint */
  accentColor: string;
  /** Remote or local logo URL */
  logoUrl?: string;
  /** Slogan or organization subtitle */
  tagline: string;
  /** Arabic tagline */
  taglineAr: string;
}

export interface TenantVocabulary {
  /** e.g. "Bus Line" vs "School Route" vs "Shift Shuttle" */
  routeLabel: string;
  /** e.g. "Bus Stop" vs "Student Pickup" vs "Meeting Point" */
  stopLabel: string;
  /** e.g. "Passenger" vs "Student" vs "Employee" */
  passengerLabel: string;
  /** e.g. "Terminal Depot" vs "School Campus" vs "Corporate HQ" */
  terminalLabel: string;
  /** e.g. "Start Terminal" vs "First Pickup" */
  startPointLabel: string;
  /** e.g. "Destination" vs "School Destination" */
  endPointLabel: string;
  /** e.g. "Driver" vs "School Bus Driver" vs "Captain" */
  driverTitle: string;
}

export interface TenantProfile {
  archetype: TenantArchetype;
  branding: TenantBranding;
  en: TenantVocabulary;
  ar: TenantVocabulary;
}

/**
 * Built-in institutional profile presets.
 */
export const TENANT_PROFILES: Record<TenantArchetype, TenantProfile> = {
  public_transit: {
    archetype: 'public_transit',
    branding: {
      appName: 'Wasalt Transit',
      appNameAr: 'وصلت للنقل الجماعي',
      primaryColor: '#2563EB',
      secondaryColor: '#1D4ED8',
      accentColor: '#EFF6FF',
      tagline: 'Smart Public Transit & Fleet Operations',
      taglineAr: 'منظومة النقل والتتبع الذكي',
    },
    en: {
      routeLabel: 'Bus Line',
      stopLabel: 'Bus Stop',
      passengerLabel: 'Passenger',
      terminalLabel: 'Terminal Depot',
      startPointLabel: 'Starting Station',
      endPointLabel: 'Destination Terminal',
      driverTitle: 'Transit Captain',
    },
    ar: {
      routeLabel: 'خط الحافلة',
      stopLabel: 'محطة توقف',
      passengerLabel: 'راكب',
      terminalLabel: 'المحطة النهائية',
      startPointLabel: 'محطة البداية',
      endPointLabel: 'محطة الوصول',
      driverTitle: 'كابتن الحافلة',
    },
  },
  school: {
    archetype: 'school',
    branding: {
      appName: 'SchoolBus SafeTrip',
      appNameAr: 'باص المدرسة الآمن',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      accentColor: '#FFFBEB',
      tagline: 'Safe Student Commute & Live Monitoring',
      taglineAr: 'متابعة حية لرحلات الطلاب المدرسية',
    },
    en: {
      routeLabel: 'School Route',
      stopLabel: 'Student Pickup Point',
      passengerLabel: 'Student',
      terminalLabel: 'School Campus',
      startPointLabel: 'First Student Pickup',
      endPointLabel: 'School Campus Gate',
      driverTitle: 'School Bus Driver',
    },
    ar: {
      routeLabel: 'خط المدرسة',
      stopLabel: 'نقطة تجمع الطلاب',
      passengerLabel: 'طالب',
      terminalLabel: 'مبنى المدرسة',
      startPointLabel: 'أول نقطة تجمع',
      endPointLabel: 'بوابة المدرسة',
      driverTitle: 'سائق الحافلة المدرسية',
    },
  },
  call_center: {
    archetype: 'call_center',
    branding: {
      appName: 'Corporate Shuttle Command',
      appNameAr: 'نظام النقل المؤسسي والورديات',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      accentColor: '#ECFDF5',
      tagline: 'Employee Shift Shuttles & Operations Dispatch',
      taglineAr: 'إدارة ورديات الموظفين ونقل الشركات',
    },
    en: {
      routeLabel: 'Shift Shuttle Line',
      stopLabel: 'Employee Pickup Station',
      passengerLabel: 'Employee',
      terminalLabel: 'Corporate Headquarters',
      startPointLabel: 'Route Departure Station',
      endPointLabel: 'Office Facility',
      driverTitle: 'Shuttle Operator',
    },
    ar: {
      routeLabel: 'خط الوردية',
      stopLabel: 'نقطة استلام الموظف',
      passengerLabel: 'موظف',
      terminalLabel: 'المقر الرئيسي',
      startPointLabel: 'محطة التحرك',
      endPointLabel: 'مقر العمل',
      driverTitle: 'سائق الوردية',
    },
  },
  university: {
    archetype: 'university',
    branding: {
      appName: 'Campus Transit',
      appNameAr: 'نقل الحرم الجامعي',
      primaryColor: '#7C3AED',
      secondaryColor: '#6D28D9',
      accentColor: '#F5F3FF',
      tagline: 'University Shuttle & Inter-Campus Network',
      taglineAr: 'شبكة خطوط الحرم الجامعي والمحطات',
    },
    en: {
      routeLabel: 'Campus Line',
      stopLabel: 'Campus Station',
      passengerLabel: 'Student / Staff',
      terminalLabel: 'University Gate',
      startPointLabel: 'Metro / Hub Station',
      endPointLabel: 'University Campus',
      driverTitle: 'Campus Driver',
    },
    ar: {
      routeLabel: 'خط الحرم الجامعي',
      stopLabel: 'محطة الجامعة',
      passengerLabel: 'طالب / عضو هيئة',
      terminalLabel: 'بوابة الجامعة',
      startPointLabel: 'محطة التجمع',
      endPointLabel: 'الحرم الجامعي',
      driverTitle: 'سائق حافلة الجامعة',
    },
  },
  corporate_fleet: {
    archetype: 'corporate_fleet',
    branding: {
      appName: 'Fleet Logistics',
      appNameAr: 'لوجستيات الأسطول',
      primaryColor: '#0EA5E9',
      secondaryColor: '#0284C7',
      accentColor: '#F0F9FF',
      tagline: 'Enterprise Passenger Fleet Telematics',
      taglineAr: 'إدارة ومتابعة أساطيل النقل الخاص',
    },
    en: {
      routeLabel: 'Fleet Route',
      stopLabel: 'Waypoint Station',
      passengerLabel: 'Client / Passenger',
      terminalLabel: 'Operations Depot',
      startPointLabel: 'Dispatch Point',
      endPointLabel: 'Terminal Destination',
      driverTitle: 'Fleet Captain',
    },
    ar: {
      routeLabel: 'مسار الأسطول',
      stopLabel: 'محطة المرور',
      passengerLabel: 'عميل / راكب',
      terminalLabel: 'مركز العمليات',
      startPointLabel: 'نقطة الانطلاق',
      endPointLabel: 'وجهة الوصول',
      driverTitle: 'قائد الأسطول',
    },
  },
};

/**
 * Global default tenant configuration.
 * To re-theme the app for a school or corporate client, simply adjust this archetype!
 */
export const ACTIVE_TENANT: TenantArchetype = 'public_transit';

/**
 * Retrieves the branding tokens for a given archetype.
 *
 * @param archetype - Target tenant archetype or default active tenant.
 * @returns Complete branding configuration including primary colors and app names.
 */
export function getTenantBranding(archetype: TenantArchetype = ACTIVE_TENANT): TenantBranding {
  return TENANT_PROFILES[archetype].branding;
}

/**
 * Retrieves the localized vocabulary mapping for the specified tenant.
 *
 * @param isRTL - Whether the user interface is currently in Arabic (RTL).
 * @param archetype - Target tenant archetype or default active tenant.
 * @returns Localized nomenclature for routes, stops, terminals, and passengers.
 */
export function getTenantVocabulary(
  isRTL: boolean,
  archetype: TenantArchetype = ACTIVE_TENANT
): TenantVocabulary {
  const profile = TENANT_PROFILES[archetype];
  return isRTL ? profile.ar : profile.en;
}
