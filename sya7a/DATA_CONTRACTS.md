# Wasalt Bus Tracker - Data Contracts & Schemas

This document defines the exact database structures, payload contracts, and service APIs utilized by the Wasalt application ecosystem.

---

## 1. Firebase Realtime Database Data Contracts

### A. Ephemeral Live Telemetry (`/busLocations`)
Created dynamically when a driver begins broadcasting. Deleted upon trip conclusion.

```typescript
// Path: /busLocations/<lineId>/<driverAuthUid>
interface LiveBusLocation {
  latitude: number;       // e.g. 30.044420 (WGS84)
  longitude: number;      // e.g. 31.235712 (WGS84)
  lastUpdated: string;    // ISO-8601 string, e.g. "2026-09-08T14:10:00.000Z"
  endPoint: string;       // Textual destination, e.g. "الجامعة المصرية الصينية"
  endLat: number | null;  // Terminal destination latitude
  endLng: number | null;  // Terminal destination longitude
  driverName: string;     // Driver display name
  driverEmail: string;    // Driver login email
}
```

---

### B. Fleet Catalog (`/buses` and `/companies/<companyId>/buses`)
Static route definitions and route metadata.

```typescript
// Path: /companies/<companyId>/buses/<busId>
interface BusRouteDefinition {
  busId: string;          // e.g. "115-1761037533918"
  lineId: string;         // e.g. "115", "Line 1", "BRT-1"
  companyId: string;      // e.g. "cta", "brt", "mwaslat-misr"
  startPoint: string;     // Textual start station address
  startLat: number;       // Start station latitude
  startLng: number;       // Start station longitude
  endPoint: string;       // Textual destination address
  endLat: number;         // Destination latitude
  endLng: number;         // Destination longitude
  isActive: boolean;      // Operational status flag
  createdAt: string;      // ISO-8601 creation timestamp
}
```

---

### C. Transit Operator Directory (`/companies`)
Registered transit operators, official domains, and their serviced bus lines.

```typescript
// Path: /companies/<companyId>
interface CompanyRecord {
  name: string;           // Display name (e.g. "CTA", "White Bus")
  nameAr?: string;        // Arabic name (e.g. "شركة أتوبيس القاهرة الكبرى")
  domain: string | null;  // Corporate email domain (e.g. "cta.eg")
  busLines: string[];     // Array of route names (e.g. ["Ring Road", "New Cairo Loop"])
  buses?: Record<string, BusRouteDefinition>;
}
```

---

### D. Driver Profiles (`/drivers`)
Profiles mapping Firebase Authentication identities to company fleets.

```typescript
// Path: /drivers/<driverAuthUid>
interface DriverProfile {
  displayName: string;    // "CTA Driver 1"
  email: string;          // "driver1@cta.eg"
  companyId: string;      // "cta"
  lines: string[];        // Array of lines permitted to operate
}
```

---

### E. User Search History & Favorites (`/users`)
Passenger personalization data.

```typescript
// Path: /users/<userAuthUid>/history/<pushId>
interface UserHistoryItem {
  busLine: string;        // e.g. "Demo Line"
  companyName: string;    // e.g. "CTA"
  timestamp: string;      // ISO-8601 timestamp
}

// Path: /users/<userAuthUid>/favorites/<lineId>
type UserFavorite = boolean; // true if bookmarked
```

---

## 2. External Third-Party APIs

### A. Geocoding & Destination Search
- **OpenStreetMap Nominatim:**
  - `GET https://nominatim.openstreetmap.org/search?format=jsonv2&q={query}&limit=15&accept-language=ar,en`
- **Komoot Photon API:**
  - `GET https://photon.komoot.io/api/?q={query}&limit=20&lang=ar`

### B. Map Tile Server
- **OpenStreetMap Standard Tile Layer:**
  - `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
