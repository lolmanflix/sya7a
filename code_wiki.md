# Codebase Architecture Wiki (`code_wiki.md`)

## 1. Meta Information
- **Project Name:** Wasalt Bus Tracker Platform & Admin Portal
- **Semantic Version:** v0.1.0-alpha
- **Start Date:** 2026-09-08
- **Last Updated:** 2026-09-19
- **Author/Owner:** Kareem
- **AI Butler/Lead Engineering Assistant:** Jarvis
- **Core Mission:** Provide a secure, intuitive, white-label transit & fleet operations platform supporting any institution operating passenger fleets—including private schools, universities, corporate call center shuttles, and municipal transit.

---

## 2. Technical Stack & Database Schemas

### A. Core Stack
- **Client Application:** React 18+ (Vite)
- **Styling:** Tailwind CSS (modern, clean, accessible)
- **Map & Geo Engine:** Leaflet & React-Leaflet / OpenStreetMap
- **Data Backend:**
  - **Firebase Realtime Database:** Primary engine for live telematics, companies, lines, buses, drivers, and ridership logs.
  - **Firebase Authentication:** Identity provider (59 existing accounts).
  - **Firebase Admin SDK:** Server-side administrative orchestration (secure account creation, claim management, data sanitation).

### B. Database Schema (Firebase Realtime Database)
```
/
├── busLocations/               # Ephemeral live telematics streamed by drivers
│   └── <lineId>/
│       └── <driverAuthUid>/
│           ├── latitude: number
│           ├── longitude: number
│           ├── lastUpdated: string (ISO)
│           ├── endPoint: string
│           ├── endLat: number | null
│           ├── endLng: number | null
│           ├── driverName: string
│           ├── driverEmail: string
│           ├── cameraMonitored: boolean
│           └── micMonitored: boolean
│
├── companies/
│   └── <companyId>/             # e.g., "cta", "brt", "white-bus"
│       ├── name: string         # "CTA"
│       ├── domain: string       # "cta.eg"
│       ├── busLines: [string]   # ["Line 1", "Line 2", ...]
│       └── buses/
│           └── <busId>/         # e.g., "115-1761128350649"
│               ├── busId: string
│               ├── lineId: string
│               ├── companyId: string
│               ├── startPoint: string
│               ├── startLat: number
│               ├── startLng: number
│               ├── endPoint: string
│               ├── endLat: number
│               ├── endLng: number
│               ├── stops?: [ { id: string, name: string, lat: number, lng: number, order: number } ]
│               ├── isActive: boolean
│               └── createdAt: string (ISO)
│
├── drivers/
│   └── <driverAuthUid>/         # e.g., "4U2urwSR6faVF2U9d7kZ3m82oBj2"
│       ├── displayName: string  # "BRT Driver 1"
│       ├── email: string        # "driver1@brt.eg"
│       ├── companyId: string    # "brt"
│       └── lines: [string]      # ["BRT-1"]
│
├── driverControls/             # SafeTrip remote camera & microphone signaling
│   └── <driverAuthUid>/
│       ├── mediaRequest/
│       │   ├── kind: "audio" | "video" | "both"
│       │   ├── status: "pending" | "accepted" | "declined"
│       │   ├── requestedAt: string (ISO)
│       │   ├── requestedBy: string (admin email)
│       │   └── respondedAt: string (ISO)
│       └── mediaStream/
│           ├── frame: string (base64 data URL)
│           ├── updatedAt: string (ISO)
│           ├── driverName: string
│           ├── driverUid: string
│           └── kind: "audio" | "video" | "both"
│
└── users/
    └── <userAuthUid>/           # e.g., "6SUokZHADrWy00noKoJRfAbIE1q1"
        ├── history/
        │   └── <pushId>/
        │       ├── busLine: string
        │       ├── companyName: string
        │       └── timestamp: string (ISO)
        └── favorites/
            └── <lineId>: boolean
```


---

## 3. Codebase Blueprint & Directory Structure
```
bus tracker sya7a version/
├── .gitignore                      # Guards serviceAccountKey.json, .env, secrets
├── dev_rules.md                    # Project architectural rules & safety boundaries
├── project_plan.md                 # Strategic roadmap & phased milestones
├── code_wiki.md                    # Single source of truth architectural wiki
├── functions.md                    # Automated functions catalog (compiled via script)
├── manual_tests.csv                # Quality assurance test case tracker
├── TRANSIT_MARKET_DATA_AND_PROJECTIONS.md # Executive master pitch dossier & navigation index
├── docs/                           # Modular specialized documentation pillars
│   ├── 01_TRANSIT_MARKET_AND_MACRO_DATA.md
│   ├── 02_FINANCIAL_MODEL_AND_UNIT_ECONOMICS.md
│   ├── 03_TECHNICAL_INFRASTRUCTURE_AND_TELEMETRY.md
│   └── 04_FUTURE_TECH_ROADMAP_AND_SWARM_INTELLIGENCE.md
├── scripts/
│   └── generate_functions_doc.py   # Automated documentation parser
├── admin/                          # React 19 + TypeScript + Vite + Tailwind Admin Portal
└── sya7a/                          # React Native + Expo + Leaflet WebView Mobile App
```

---

## 4. Roadmap Tracking

### Completed
- [x] Secured live credentials in `.gitignore`.
- [x] Live Firebase query & reverse-engineered full data model (companies, buses, drivers, users, auth).
- [x] Clarified database engines: Realtime Database active; Firestore empty.
- [x] Cloned and documented Sya7a mobile React Native application (`sya7a/ARCHITECTURE.md`, `sya7a/DATA_CONTRACTS.md`).
- [x] Built and verified Sya7a Admin Web Portal (`admin/`) with React, Vite, Tailwind CSS v3, and Leaflet.
- [x] Implemented Live Fleet Overview Map with real-time bus telemetry markers.
- [x] Implemented Multi-Company & Bus Line Manager.
- [x] Implemented Visual Bus Route Creator with Leaflet coordinate picking.
- [x] Implemented Dedicated Drivers Directory & Search with multi-attribute filtering (name, email, UID, company, lines) and dispatch board.
- [x] Implemented Dedicated Users & Commuters Directory with real-time search across all 61 accounts, role filters, and trip history inspection.
- [x] Implemented Master Admin 2FA Authentication with RFC 6238 TOTP (Google/Microsoft Authenticator) and "Stay logged in" persistence.
- [x] Implemented Full Database CRUD Operations: Add/Edit/Delete bus routes, Add/Rename/Delete bus lines with cascading updates, and Add/Edit/Delete driver profiles.
- [x] Integrated Offline OpenStreetMap mapping matching mobile app without API key dependencies and with Egyptian transit landmark gazetteer.
- [x] Automated function catalog parsing with 295 functions indexed in `functions.md`.
- [x] Completed comprehensive market data & financial pro forma audit with modular separation of concerns (`docs/`).
- [x] Transitioned SafeTrip inspection to hardware-accelerated 30 FPS WebRTC Peer-to-Peer streaming with zero database media bandwidth.
- [x] Separated Bus Fleet (vehicle deployments, road readiness, assignments) from Transit Routes (corridors, coordinates, map editor, and line catalog) into specialized administrative portals.
- [x] Automated Deterministic Compliance Test Suite: Built `scripts/test_dev_rules.py` with 5 rigorous automated verification gates.
- [x] Source Code Documentation & Catalog Synchronization: Enriched all project functions with descriptive docstrings; `functions.md` now reflects 100% documentation coverage (0 undocumented functions).
- [x] Strict <= 400 Lines/File Rule 1 Compliance: Modularized `FleetMap.tsx` (extracted `FleetMapLegend.tsx`) and `DriverSafetyMediaModal.tsx` (extracted `DriverSafetyAudioMonitor.tsx`), achieving 100% repository-wide adherence across 119 source files.
- [x] Implemented Multipoint Route Designer in Admin Panel with intermediate mandatory stops, sequential drag/numbered reordering, and multi-waypoint OSRM road geometry.
- [x] Streamlined Driver app: replaced manual destination input & picker modal with dynamic line selection and auto-loaded route itinerary timeline with mandatory stops.
- [x] Upgraded Passenger Map (`MapScreen.tsx`) to render full multi-stop road polylines with numbered badges and stop popups, removing false Cairo mock buses.
- [x] Completely eradicated hardcoded fallback mock companies (`defaultCompanies`) and static bus lines `['M554', 'N777'...]` across both applications; fully synchronized with Firebase RTDB.
- [x] Dynamic Point A Integration: Point A dynamically anchors to driver's live GPS coordinates and reverse-geocoded place name across driver telemetry broadcast, passenger map road routing, and admin panel route design.
- [x] Fixed Route Display on Edit Map & Multipoint Schema Integrity: resolved Leaflet modal container clipping with `invalidateSize()`, auto-fitted route bounds to road geometry, modularized `RouteStopsList` and `EgyptianLandmarksPicker` to keep all files strictly under 400 lines, and verified full RTDB schema support for multipoint route sequences.
- [x] Nearest Named Landmark Resolution Engine: implemented `landmarkService.ts` utilizing Overpass API (shops, restaurants, buildings, amenities), OpenStreetMap Nominatim reverse geocoding, and offline transit hubs to automatically resolve and populate named landmarks on map point selection for drivers and commuters.
- [x] Institutional White-Label & Multi-Tenant Architecture: Created centralized `tenantConfig.ts` with domain profiles for Public Transit, School Bus Fleets, Corporate Shuttles, and University Campuses with zero hardcoded UI branding.
- [x] DriverHomeScreen Modularization: Refactored 2,060-line monolithic screen into 7 decoupled sub-modules (`useDriverTripState`, `useDriverProfile`, `DriverHeader`, `DriverTripCard`, `DriverSafetyOverlay`, `DriverRouteTimeline`, `DriverModals`) strictly under 400 lines each.
- [x] LoginScreen Modularization: Refactored 709-line authentication coordinator into 6 decoupled components and hooks (`useAuthForm`, `AuthHeader`, `UserTypeToggle`, `ForgotPasswordModal`, `DriverCompanyPickerModal`, `loginStyles.ts`).
- [x] HomeScreen Modularization: Refactored 563-line commuter discovery screen into 6 decoupled components and hooks (`useHomeBuses`, `HomeHeader`, `BusCardItem`, `ActiveBusCardItem`, `ActiveBusModal`, `homeStyles.ts`, `geoUtils.ts`) strictly under 400 lines each.
- [x] MapScreen Modularization: Refactored 419-line interactive commuter map into 5 decoupled modules (`useMapBuses`, `MapFloatingHeader`, `mapBridgeUtils`, `mapStyles`, `MapScreen`) strictly under 400 lines each; eliminated duplicate geodesic formulas and integrated institutional branding.
- [x] CompaniesPage Modularization: Refactored 400-line Admin Panel operator portal into 4 decoupled components (`CompaniesPage`, `AddCompanyModal`, `CompaniesGridView`, `LinesTableView`) strictly under 400 lines each.
- [x] Deterministic Dev Rule Test Suite: Created `scripts/test_dev_rules.py` verifying file size limits (<400 lines), presentation decoupling, secret protection, multi-tenant white-label configurations, and documentation synchronization.
- [x] Function Consolidation & Geodesic Unification: Centralized Haversine distance calculations into `admin/src/utils/geoUtils.ts` and duration formatting into `admin/src/utils/timeUtils.ts`.
- [x] Admin Bus Line Operations Hook: Built `useLineOperations` hook unifying line renaming and deletion confirmation, RTDB mutation, and toast notifications across `CompaniesPage.tsx` and `RoutesPage.tsx`.
- [x] Single Responsibility Principle (SRP) Enforcement: Decomposed multi-job functions (`handleAuth` in `useAuthForm.ts` and `startSharing` in `useDriverTripState.ts` via `driverTripHelpers.ts`) into focused, single-purpose helper functions.
- [x] Architectural Redundancy Tagging: Annotated all unused functions with `@suggestion [INTEGRATE | DELETE]` providing clear rationales without deleting any code.
- [x] In-App Local OpenStreetMap Engine: Integrated in-process native SQLite MBTiles tile serving directly into Vite (`vite.config.ts`) and `serve.js` on port 5173 without any external services or Docker containers.
- [x] Embedded Client-Side Road Routing Engine: Built `localRoutingEngine.ts` in TypeScript with an arterial road network graph and Catmull-Rom spline curves, replacing external OSRM API calls with 100% offline in-memory calculations.
- [x] Decoupled External POI & Geocoding APIs: Eradicated remote calls to Overpass API and Nominatim in `landmarkService.ts`, switching to the offline Egyptian transit gazetteer with sub-millisecond nearest-neighbor resolution.
- [x] Eradicated Mobile Admin Remnants: Stripped leftover "Admin dashboard" card from `RoleSelectionScreen.tsx` and updated mobile context types strictly to `'passenger' | 'driver'`.


### In-Progress
- *(All core milestones completed and verified)*

### Backlog & Future R&D Initiatives
- [ ] Push notification dispatch from admin console to mobile drivers/passengers.
- [ ] Historical telemetry replay mode for past trips.
- [ ] Swarm intelligence congestion prediction & dynamic avoidance routing.
- [ ] Passenger crowding detection engine (ambient acoustic analysis, BLE device density, vehicle dynamics).
- [ ] Anti-bunching driver pacing & headway regularization protocol.
- [ ] Cashless QR micro-ticketing with InstaPay, Meeza, and Fawry integration.

---

## 5. Multi-Tenant Institutional White-Labeling Architecture
The platform is designed to support diverse fleet archetypes via dynamic data-driven configuration:
- **Tenant Configuration Module (`tenantConfig.ts`):** Defines institution archetype, brand colors, custom logo URIs, and dynamic nomenclature (routes, stops, passengers).
- **Dynamic Vocabulary Adapter:** Switches labels seamlessly based on tenant archetype:
  - *Public Transit:* "Bus Line", "Bus Stop", "Passenger", "Terminal Depot"
  - *Private School:* "School Route", "Student Pickup", "Student", "School Campus"
  - *Corporate / Call Center:* "Shuttle Shift", "Meeting Point", "Employee", "Corporate HQ"
- **RTDB Dynamic Company Overrides:** Company records in `/companies/<id>` can supply bespoke branding (brand color, logo URL, custom titles) which dynamically takes precedence over defaults.
