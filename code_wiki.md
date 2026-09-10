# Codebase Architecture Wiki (`code_wiki.md`)

## 1. Meta Information
- **Project Name:** Wasalt Bus Tracker Platform & Admin Portal
- **Semantic Version:** v0.1.0-alpha
- **Start Date:** 2026-09-08
- **Last Updated:** 2026-09-10
- **Author/Owner:** Kareem
- **AI Butler/Lead Engineering Assistant:** Jarvis
- **Core Mission:** Provide a secure, intuitive, real-time administrative web console for fleet oversight, line/bus configuration, driver assignments, and user management across transit operators.

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
- [x] Implemented Multipoint Route Designer in Admin Panel with intermediate mandatory stops, sequential drag/numbered reordering, and multi-waypoint OSRM road geometry.
- [x] Streamlined Driver app: replaced manual destination input & picker modal with dynamic line selection and auto-loaded route itinerary timeline with mandatory stops.
- [x] Upgraded Passenger Map (`MapScreen.tsx`) to render full multi-stop road polylines with numbered badges and stop popups, removing false Cairo mock buses.
- [x] Completely eradicated hardcoded fallback mock companies (`defaultCompanies`) and static bus lines `['M554', 'N777'...]` across both applications; fully synchronized with Firebase RTDB.
- [x] Dynamic Point A Integration: Point A dynamically anchors to driver's live GPS coordinates and reverse-geocoded place name across driver telemetry broadcast, passenger map road routing, and admin panel route design.
- [x] Fixed Route Display on Edit Map & Multipoint Schema Integrity: resolved Leaflet modal container clipping with `invalidateSize()`, auto-fitted route bounds to road geometry, modularized `RouteStopsList` and `EgyptianLandmarksPicker` to keep all files strictly under 400 lines, and verified full RTDB schema support for multipoint route sequences.

### In-Progress
- *(All core milestones completed and verified)*

### Backlog & Future R&D Initiatives
- [ ] Push notification dispatch from admin console to mobile drivers/passengers.
- [ ] Historical telemetry replay mode for past trips.
- [ ] Swarm intelligence congestion prediction & dynamic avoidance routing.
- [ ] Passenger crowding detection engine (ambient acoustic analysis, BLE device density, vehicle dynamics).
- [ ] Anti-bunching driver pacing & headway regularization protocol.
- [ ] Cashless QR micro-ticketing with InstaPay, Meeza, and Fawry integration.


