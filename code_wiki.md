# Codebase Architecture Wiki (`code_wiki.md`)

## 1. Meta Information
- **Project Name:** Wasalt Bus Tracker Platform & Admin Portal
- **Semantic Version:** v0.1.0-alpha
- **Start Date:** 2026-09-08
- **Last Updated:** 2026-10-02
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
- [x] Edge-Device Offline Road Routing Engine (Option B): Implemented pure client-side/edge dynamic road route calculation across unified Egyptian road network vertices in both Admin and Mobile applications. Eradicated all hardcoded corridors, external OSM routing servers, and synthetic splines.
- [x] High-Fidelity Road Network Alignment & Curve Retention: Rebuilt the local Egyptian road graph (`egypt_road_graph.json`) directly from `/home/kimo/Storage/datasets/map.mbtiles` with 10-meter quantization and road curve geometry (`pts`) retention on contracted edges. Eradicated artificial shortcut bridges that previously caused sharp V-turns into residential neighborhoods. Integrated minor access roads near terminals, bringing snapping distance at ECU Campus down to 29 meters (from 820m). Updated `bidirectionalAStar.ts` in Admin and Mobile and `simulate_trip_stream.mjs` to unpack full curve geometries.


- [x] Restored OpenStreetMap (OSM Standard + CartoDB Dark Matter) raster tile engine in Admin Portal with instant rendering and 0 WebGL overhead.
- [x] Reconnected online OSRM driving engine in `admin/src/services/routingService.ts` with multi-stop waypoint routing and non-caching fallback protection.
- [x] Preserved and relocated all offline vector map layers, MBTiles plugins, Web Workers, and A* road graphs to `future_plans/offline_maps_and_routing/` for future offline desktop embedding.

- [x] Electron Desktop Application Scaffold: Created `admin/electron/main.cjs` (main process), `preload.cjs` (secure context bridge with IPC), and `menu.cjs` (native cross-platform menu). Verified production dist loads via `file://` protocol with relative asset paths (`base: "./"`).
- [x] Cross-Platform Packaging via electron-builder: Configured builds for Linux (AppImage, deb), Windows (NSIS installer, Portable), and macOS (DMG, ZIP) under `admin/package.json#build`.
- [x] Native Desktop Integration: Window minimize/maximize/close IPC, native OS notifications, single-instance lock, external link routing to system browser, and macOS hidden-inset titlebar.
- [x] TypeScript Type Definitions: Added `admin/src/types/electron.d.ts` exposing the `window.wasaltDesktop` context bridge API.
- [x] Hardcoded Credential Purge (S2): Master-admin username/password/TOTP fallbacks replaced by env-only module `admin/src/config/masterAdmin.ts` (fails closed with an actionable config error). `LoginPage.tsx` no longer prefills credentials and shows a configuration warning banner when `VITE_MASTER_ADMIN_*` keys are absent; both trip simulators read `VITE_MASTER_ADMIN_PASSWORD` from `admin/.env`; `README.md` / `INSTRUCTIONS.md` scrubbed of secrets. Remaining: `admin/.env.example` still holds sample credentials (agent access blocked by permission rules — pending owner edit), and the password/TOTP seed necessarily inline into `dist` because verification is client-side (follow-up: server-side check).
- [x] Hardcoded Credential Purge — Mobile & Identity Layer (S1+): removed the `PRECONFIGURED_USERS` password allowlist from `mobile/src/contexts/AuthContext.tsx`, env-ized the entire mobile Firebase config (`EXPO_PUBLIC_*` via `mobile/.env`, fail-fast on missing keys), deleted the hardcoded driver-role email gate in `mobile/App.tsx` and the commented Google OAuth client ID, moved admin Firebase service identities + demo-driver target to env (`VITE_FIREBASE_ADMIN_EMAILS`, `VITE_DEMO_DRIVER_*`), scrubbed the demo password from `mobile/README.md`, and hardened `resolveRole` (SUPER_ADMIN only via `VITE_SUPER_ADMIN_EMAILS`; least-privilege COMPANY_ADMIN fallback — no name-substring or default grants).
- [x] Multi-Account Session Switching (admin + mobile): registry-based accounts (`wasalt_admin_accounts_v1` localStorage / `app_accounts_v1` AsyncStorage) with active-account pointer, legacy single-session migration, **instant silent switching**, "Add another account" flow, and per-account logout (other accounts stay signed in). Mobile stores per-account passwords in **expo-secure-store** (`wasalt_acct_<uid>`) to satisfy Firebase's single-`currentUser` constraint, with failed-reauth fallback, live-trip guard, and global-key bleed prevention (user type, driver session, subscription tier remounted per uid).
- [x] OpenFreeMap Migration (admin + mobile): all raster (OSM/Carto) and local/self-hosted tile usage replaced with OpenFreeMap vector styles via MapLibre GL — default **liberty** light style + persisted **dark** option (admin `wasalt_map_style` pill control; mobile theme-driven WebView bridge `window.__setMapStyle`). Local MBTiles reader removed from `admin/serve.js`; mobile WebView map rebuilt with CDN-failure fallback; offline routing untouched. Verified by runtime smoke test: 17/17 checks, 38 OFM requests, zero local/OSM raster.
- [x] Firebase Debug MCP Integration: official `firebase-tools` MCP server registered in opencode config (`--only core,database,auth`, project via `GCLOUD_PROJECT`/`GOOGLE_CLOUD_PROJECT=tracking-72393`, `XDG_CONFIG_HOME` pinned to `~/.config` so Flatpak's redirected configstore doesn't hide the login) — `firebase login` authorized (kareemaiman2012@gmail.com) and handshake probe-verified: server `firebase v0.3.0`, 22 tools incl. `realtimedatabase_get_data/set_data`, `firebase_get_security_rules`, `auth_get_users`. Pending: opencode restart to activate.
- [x] Master Login E2E Verification & Multi-Account Defect Fixes: Playwright smoke (`/tmp/opencode/admin_login_smoke.cjs`) drives real 2FA login (in-browser TOTP), reload restore, switcher, add/cancel, second-account add, silent switch, and per-account sign-out — **27/27 PASS** with zero HTTP 400s (screenshots `smoke-5..10`). Caught and fixed three real defects in `AuthContext.tsx`: (1) `commitActive` never persisted the active-id pointer (session lost on reload, sign-out no-op), (2) observer adoption race registered the service identity as a phantom dispatcher account during master login, (3) `logout()` unconditionally revoked the shared Firebase identity while other accounts remained active (`permission_denied at /drivers`).
- [x] Service Identity Repair + TOTP Seed UI Removal: (1) `admin@wasalt.eg` did not exist in Firebase Auth — created via identitytoolkit `accounts:signUp` with the documented shared password and verified (`establishFirebaseIdentity` now succeeds first-try; zero `signInWithPassword` 400s in e2e). (2) TOTP seed removed from the login UI per owner decision: `LoginPage.tsx` Setup Key panel now points to `VITE_MASTER_ADMIN_TOTP_SECRET` in `admin/.env`/README (copy handler, seed `<code>` block, and unused icons removed); `README.md`/`INSTRUCTIONS.md` setup steps updated to env-only; verified by e2e assertion that the live seed appears nowhere in rendered text (`SEC-07`). Note: owner-pasted seed value differs from the live env value (both 16 chars, content mismatch) — owner should confirm which secret their authenticator holds.
- [x] Test-Data Sanitization + Real Route Data Import (RTDB): backed up all 8 data nodes, then rewrote `/companies` — deleted junk keys `BRT`, `k` (1.27 MB), `n` (230 KB), `journey-test-school`, `journey-two-school` and the invalid `brt` bus (`startLat: 370.05`); removed whole nodes `/subscriptions`, `/busLocations`, `/driverControls`, `/drivers`, `/users` (all test-only; phantom SOS/media states gone). Companies node 1.52 MB → 291 KB, now exactly 6 real operators (`brt`, `cta`, `go-bus`, `mwaslat-misr`, `super-jet`, `white-bus`) with `/admins` (5) and `/pricing` preserved. Real data from the official **Transport for Cairo GTFS** (GeoNode doc 88, fieldwork 2019–2023): curated import of **60 CTA + 18 Mwasalat Misr routes** with Arabic route names (GTFS translations), real first/last termini and full ordered stop coordinates; `busLines` entry = `"<AR/EN long name> (<short>)"` and `buses.<id>.lineId` = identical string (RoutesPage line-filter contract), `busId` = sanitized GTFS `route_id`. Converter + payloads in `.opencode/scratch/` (`gtfs_convert.js`, `build_companies.js`); full-CTA (351 routes, 1.87 MB) import available on demand. Firebase Auth test accounts (~61) not yet purged (no CLI delete API — console/service-account follow-up).
- [x] Admin Responsive Overhaul + Hamburger Restoration: remote PR #3 merge had overwritten the drawer wiring in `App.tsx`; re-added `sidebarOpen` state → `Sidebar.mobileOpen/onCloseMobile` + `Navbar.onToggleSidebar` hamburger (`md:hidden`, `px-4 sm:px-6` header). Responsive pass over 13 files (all pages + Navbar + shared modals + FleetMap heights): KPI grids `grid-cols-1 sm:2 lg:4`, table containers `overflow-x-auto`+`min-w`, wrapping headers/action buttons, `max-h-[85dvh]` dialogs, truncated brand titles. Automated audit: 48 combos (8 tabs × 360/390/768/1024/1440/844×390 landscape) with **zero horizontal-scroll failures**; safety modal + login card verified inside viewport incl. landscape.
- [x] Mobile Adaptive + Theme Hardening: safe-area insets applied (MapFloatingHeader, BusDetailsSheet, ActiveBusModal, App tabs, DriverModals sheets, RoleSelection via SafeAreaView+ScrollView), Android KAV keyboard handling, ≥44px touch targets, DriverHeader overlap fixes (flexShrink/numberOfLines). Theme bypasses replaced with data-driven tokens: `Button` primary/danger, Companies/RoleSelection/ForgotPassword tints, driver CTA/badges via `branding.primaryColor`/`accentColor`; `tenantConfig` missing-archetype guards added. Semantic reds/greens/warn + neutral greys intentionally kept. `npx tsc --noEmit` = 0. Note: `app.json` orientation locked portrait; `DriverHomeScreen` light `#F0F4FF` surface flagged for design decision.
- [x] Admin EN/AR i18n: new `admin/src/i18n/` module — `TranslationContext` + `useTranslation()` (`t(key, vars)` with `{var}` interpolation, missing-key → key fallback + one-time warn), localStorage persistence (`wasalt_admin_lang`), `document.documentElement.lang/dir` switched (`rtl` for Arabic). Dictionaries split by namespace under `locales/en|ar/` (`nav`, `common`, `dashboard`, `fleet`, `routes`, `companies`, `drivers`, `users`, `security`, `pricing`, `auth`, `map`, `safety`) — **531 keys, exact EN↔AR parity** (script-verified). Navbar language pill toggle (EN/ع) in right-actions. All user-visible strings extracted across pages/shared components (brand names, RTDB route data, demo content, telemetry badges left as-is). RTL: dir attribute + logical utilities (`start/end`, `ms/me`) on touched chrome (Sidebar drawer `start-0`, Navbar); full mirrored-UI polish is follow-up.
- [x] Theme Customization Verification (data-driven proof): admin read-side = RTDB `/companies/{id}/theme` → `applyCompanyTheme()` → `--brand-50..950` CSS vars consumed by Tailwind `brand-*` palette, with hex validation + default-palette fallback (`brandTheme.ts`), scoped per `COMPANY_ADMIN.activeCompany`; write-side = website dashboard `BrandingSettingsView` → `updateCurrentCompany({theme})` (onboarding `StepBrandTheme` presets). Mobile chain = `tenantConfig.getTenantBranding()` → `ThemeContext` → screens, fallback-guarded. Zero hardcoded brand colors remain on either apply-side after audit. All 6 real companies currently carry no theme → default Wasalt palette (expected; themes are set per-tenant from the dashboard).
- [x] Agent Scratch Space Rule: scratch/temp/backup files now live in project `.opencode/scratch/` (git-ignored, survives restarts — `/tmp` is wiped); rule added to AGENTS.md §3; `scripts/test_dev_rules.py` `IGNORE_DIRS` extended with `.opencode` so compliance skips scratch (fixes false 400-line failure on archived `fe_orig.tsx`).
- [x] Performance & Live-Session Fixes (round: cards/lag/camera/permissions): **(1)** FleetMap split into two render passes — static geometry (polylines/terminals/stops/orphan corridors in new `mapDrawLayers.ts`, corridor identity keyed by endpoints) vs dynamic live markers; previously one effect cleared both Leaflet layers and re-fetched road paths on every GPS tick (removed `onSelectBus` instability via ref indirection). Live-verified: line click → single SCH-102 panel → Close → hint restored (`.opencode/scratch/verification/map-refactor-single-line-panel.png`). **(2)** Mobile home: always-on Active Buses card feed removed — trip cards now reveal only after tapping their line (`handleBusPress` → `ActiveBusModal`); `useHomeBuses` listeners no longer tear down/re-subscribe per GPS tick (raw RTDB snapshots + `useMemo` enrichment for counts/proximity/ETA; `filteredBuses` memoized). **(3)** Mobile catalog repointed from phantom root `/buses` (never existed → `permission_denied` → demo row only) to `companies/{id}/buses` flatten (lineName←lineId, companyName←name, origin coords for proximity); demo fallback only when catalog empty. **(4)** Camera/mic: WebRTC broadcaster WebView gained `baseUrl: https://localhost` (secure origin → `navigator.mediaDevices` available; RNW `RNCWebChromeClient` auto-grants media perms when the host app holds CAMERA/RECORD_AUDIO); `CameraView` children extracted to `StyleSheet.absoluteFill` sibling (fixes unsupported-children warning). **(5)** RTDB security rules: live rules had drifted from repo — validated + deployed `mobile/database.rules.json` via new root `firebase.json` (`firebase deploy --only database`), clearing `permission_denied` on `/drivers/<uid>`/`/buses` for authenticated users.
- [x] Admin Dashboard UX & Trip-Close Integrity (round: badges/auto-box/race): **(1)** Map vehicle badges de-cluttered — `createCatalogBusMarker`/`createLiveBeaconMarker` render the short operator code via new `shortLineCode()` ("صفط اللبن - عبد المنعم رياض (CTA 15)" → "CTA 15"; popup still shows the full name), and `drawLiveVehicles` only badges lines with a live GPS match or the selected line — previously every active catalog line drew a green ping-pill at its midpoint (the ~86 two-line "info cards" + 86 `animate-ping` runs from Kareem's screenshot). Ping now keyed to live GPS, not the catalog `isActive` flag. **(2)** Dashboard right rail always present: auto-populating **Active Buses box** (keys `dashboard.activeBusesTitle/ActiveBusesEmpty`, EN+AR) lists every live beacon — short code, driver · destination, ticking timestamp, live count badge — with no route selection required; row click selects the line → single-line trip panel; empty state when idle; grid is `lg:grid-cols-3` unconditionally (map `col-span-2`). **(3)** Trip-close DB race fixed in `useDriverTripState` (root cause of "driver closes trip → still open in admin"): `tripGenRef` generation counter bumped on start/stop invalidates in-flight GPS `set()` writers (stale-writer guard at the top of the watch callback); `tripPathRef` captures the exact RTDB path at start so stop never depends on live `user`/`selectedBusLine` props (the old `if (user && selectedBusLine)` guard silently skipped removal); defensive second `remove()` fires 2.5s later to sweep nodes resurrected by writes that raced the first removal, auto-skipped if a new trip started (gen check). Live evidence of the original bug: Kareem's CTA 11 node (`lastUpdated 11:12Z`) persisted 54+ min in `/busLocations`. E2E (Playwright + throwaway RTDB beacon `.opencode/scratch/beacon.mjs`, Firebase identity established for the test session, AuthContext bypass used only during the test and reverted byte-identical): 2 live beacons → exactly 2 short-code badges (0 phantoms among 84 visible lines), box rows live-ticking, row → panel (CAM/MIC/Safety Check/Stop) → Close → box + hint restored (`.opencode/scratch/verification/active-box-row-selected-panel.png`). Battery: admin tsc/build/oxlint **7 errors / 20 warnings exact baseline**, mobile tsc 0, compliance clean, i18n parity **540/540**, functions.md **572**.
### In-Progress
- [x] Admin Portal Stability & OSM Mapping Verification — OSM tiles and OSRM routing confirmed operational.
- [x] Electron Desktop Application — scaffolded and verified loading production dist bundle.

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
