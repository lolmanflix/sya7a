export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
}

export interface BusRouteDefinition {
  busId: string;
  lineId: string;
  companyId: string;
  startPoint: string;
  startLat: number;
  startLng: number;
  endPoint: string;
  endLat: number;
  endLng: number;
  stops?: BusStop[];
  isActive: boolean;
  createdAt: string;
}

export interface CompanyRecord {
  id: string;
  name: string;
  nameAr?: string;
  domain: string | null;
  busLines: string[];
  buses?: Record<string, BusRouteDefinition>;
  // Synced from website onboarding (shared RTDB /companies/{id}/)
  logoUrl?: string;
  theme?: CompanyThemeLike;
  ownerId?: string;
  subscriptionPlanId?: string;
  subscriptionStatus?: string;
}

export interface DriverProfile {
  uid: string;
  displayName: string;
  email: string;
  companyId: string;
  lines: string[];
}

export interface LiveBusLocation {
  id: string; // composite `${lineId}-${driverUid}`
  lineId: string;
  driverUid: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  startPoint?: string;
  startLat?: number | null;
  startLng?: number | null;
  endPoint?: string;
  endLat?: number | null;
  endLng?: number | null;
  speedKmh?: number;
  driverName?: string;
  driverEmail?: string;
  cameraMonitored?: boolean;
  micMonitored?: boolean;
}

export type MediaRequestKind = 'audio' | 'video' | 'both';
export type MediaRequestStatus = 'pending' | 'accepted' | 'declined' | 'closed';

export interface DriverMediaRequest {
  kind: MediaRequestKind;
  status: MediaRequestStatus;
  requestedAt: string;
  requestedBy: string;
  respondedAt?: string;
  driverUid?: string;
}

export interface DriverMediaStream {
  frame?: string;
  updatedAt?: string;
  driverName?: string;
  driverUid?: string;
  kind?: MediaRequestKind;
}

export interface UserHistoryItem {
  id: string;
  busLine: string;
  companyName: string;
  timestamp: string;
}

export interface UserRecord {
  uid: string;
  email?: string;
  displayName?: string;
  role?: 'DRIVER' | 'PASSENGER' | 'ADMIN';
  createdAt?: string;
  lastSignIn?: string;
  disabled?: boolean;
  historyCount: number;
  history: UserHistoryItem[];
}

export type PassengerRecord = UserRecord;

/**
 * Subset of the website's CompanyTheme persisted in RTDB during onboarding.
 */
export interface CompanyThemeLike {
  colors?: Record<string, string | undefined>;
  borderRadius?: string;
  isDark?: boolean;
  [key: string]: unknown;
}

export type AdminRole = 'SUPER_ADMIN' | 'COMPANY_ADMIN';

export interface AdminSession {
  email: string;
  role: AdminRole;
  companyId?: string; // set if COMPANY_ADMIN
}
