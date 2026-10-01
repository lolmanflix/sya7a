import type { BusRouteDefinition, CompanyRecord, DriverProfile, LiveBusLocation, PassengerRecord } from './types';

// This data exists only for the public marketing demo route. It is never read from Firebase.
export const DEMO_COMPANIES: CompanyRecord[] = [
  { id: 'wasalt-school', name: 'Wasalt International School', domain: 'school.demo', busLines: ['SCH-102', 'SCH-204'] },
  { id: 'wasalt-corporate', name: 'Wasalt Corporate', domain: 'corporate.demo', busLines: ['COR-307'] },
];

export const DEMO_BUSES: BusRouteDefinition[] = [
  { busId: 'bus-102', lineId: 'SCH-102', companyId: 'wasalt-school', startPoint: 'Maadi', startLat: 29.9602, startLng: 31.2569, endPoint: 'Wasalt International School', endLat: 30.0308, endLng: 31.3436, isActive: true, createdAt: '2026-01-01T08:00:00.000Z', stops: [{ id: 's1', name: 'Maadi', lat: 29.9602, lng: 31.2569, order: 1 }, { id: 's2', name: 'Mokattam', lat: 30.0047, lng: 31.3273, order: 2 }, { id: 's3', name: 'School', lat: 30.0308, lng: 31.3436, order: 3 }] },
  { busId: 'bus-204', lineId: 'SCH-204', companyId: 'wasalt-school', startPoint: 'Nasr City', startLat: 30.0626, startLng: 31.3305, endPoint: 'Wasalt International School', endLat: 30.0308, endLng: 31.3436, isActive: true, createdAt: '2026-01-01T08:00:00.000Z' },
  { busId: 'bus-307', lineId: 'COR-307', companyId: 'wasalt-corporate', startPoint: '6th October', startLat: 29.9953, startLng: 30.9762, endPoint: 'Smart Village', endLat: 30.0788, endLng: 31.0171, isActive: true, createdAt: '2026-01-01T08:00:00.000Z' },
];

export const DEMO_DRIVERS: DriverProfile[] = [
  { uid: 'demo-ahmed', displayName: 'Ahmed Hassan', email: 'ahmed@demo.wasalt.io', companyId: 'wasalt-school', lines: ['SCH-102'] },
  { uid: 'demo-mohamed', displayName: 'Mohamed Ali', email: 'mohamed@demo.wasalt.io', companyId: 'wasalt-school', lines: ['SCH-204'] },
  { uid: 'demo-omar', displayName: 'Omar Samir', email: 'omar@demo.wasalt.io', companyId: 'wasalt-corporate', lines: ['COR-307'] },
];

export const DEMO_LIVE_LOCATIONS: LiveBusLocation[] = [
  { id: 'SCH-102-demo-ahmed', lineId: 'SCH-102', driverUid: 'demo-ahmed', driverName: 'Ahmed Hassan', driverEmail: 'ahmed@demo.wasalt.io', latitude: 29.995, longitude: 31.311, endPoint: 'Wasalt International School', endLat: 30.0308, endLng: 31.3436, lastUpdated: '2026-09-25T08:42:00.000Z' },
  { id: 'SCH-204-demo-mohamed', lineId: 'SCH-204', driverUid: 'demo-mohamed', driverName: 'Mohamed Ali', driverEmail: 'mohamed@demo.wasalt.io', latitude: 30.048, longitude: 31.337, endPoint: 'Wasalt International School', endLat: 30.0308, endLng: 31.3436, lastUpdated: '2026-09-25T08:47:00.000Z' },
  { id: 'COR-307-demo-omar', lineId: 'COR-307', driverUid: 'demo-omar', driverName: 'Omar Samir', driverEmail: 'omar@demo.wasalt.io', latitude: 30.035, longitude: 30.994, endPoint: 'Smart Village', endLat: 30.0788, endLng: 31.0171, lastUpdated: '2026-09-25T08:51:00.000Z' },
];

export const DEMO_PASSENGERS: PassengerRecord[] = [
  { uid: 'demo-passenger-1', displayName: 'Demo passenger', email: 'passenger@demo.wasalt.io', role: 'PASSENGER', historyCount: 0, history: [] },
];
