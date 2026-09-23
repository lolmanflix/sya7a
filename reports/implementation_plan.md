# Implementation Plan: Decomposing DriverHomeScreen.tsx & Institutional White-Labeling

Deconstruct the monolithic [`mobile/src/screens/DriverHomeScreen.tsx`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/DriverHomeScreen.tsx) (2,060 lines) into modular, single-responsibility files strictly under 400 lines of code, while introducing a centralized, data-driven institutional configuration layer (`tenantConfig.ts`) that enables effortless white-labeling for private schools, corporate call centers, universities, and public transit fleets.

## User Review Required

> [!IMPORTANT]
> **Single File Scope:** As instructed, we will exclusively refactor and decompose `DriverHomeScreen.tsx` and its direct dependencies. No other screens or files will be modified until this file is completely finished and verified.
>
> **Institutional White-Labeling Pivot:**
> - Centralized `tenantConfig.ts` defines organization archetype (`public_transit`, `school`, `call_center`, `university`, `corporate`).
> - Colors, titles, logos, and terminology (e.g. "School Route" vs "Bus Line", "Student" vs "Passenger", "Campus" vs "Terminal") are fully data-driven.
> - Dynamic company overrides from Firebase Realtime Database (`/companies/<id>`) take precedence when a driver switches company/institution.

---

## Proposed Component Breakdown

```
mobile/src/
├── config/
│   └── [NEW] tenantConfig.ts                 <── Centralized institutional branding & nomenclature (<150 lines)
├── hooks/
│   ├── [NEW] useDriverTripState.ts           <── GPS loop, speed math, RTDB telemetry broadcast (<240 lines)
│   └── [NEW] useDriverProfile.ts             <── Driver company assignment, lines, & RTDB sync (<200 lines)
├── styles/
│   └── [NEW] driverHomeStyles.ts             <── Decoupled, typed StyleSheet for driver screen (<220 lines)
├── components/driver/
│   ├── [NEW] DriverHeader.tsx                <── Avatar, company chip, SOS trigger, settings (<140 lines)
│   ├── [NEW] DriverTripCard.tsx              <── Speedometer, timer, Point A to Point B summary (<180 lines)
│   ├── [NEW] DriverSafetyOverlay.tsx         <── CameraView, flip camera, WebRTC indicator (<160 lines)
│   ├── [NEW] DriverRouteTimeline.tsx         <── Multi-stop itinerary & landmark timeline (<170 lines)
│   └── [NEW] DriverModals.tsx                <── Company and Route line selector modals (<180 lines)
└── screens/
    └── [MODIFY] DriverHomeScreen.tsx         <── Clean coordinator screen (< 220 lines, down from 2,060)
```

---

## Detailed Step-by-Step Execution Plan

### Step 1: Centralized White-Label Tenant Configuration
#### [NEW] [`mobile/src/config/tenantConfig.ts`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/config/tenantConfig.ts)
- Define `TenantArchetype`: `'public_transit' | 'school' | 'call_center' | 'university' | 'corporate'`.
- Provide default branding tokens:
  - `primaryColor`, `secondaryColor`, `logoUrl`, `appName`.
- Localized vocabulary mapping (`getTenantVocabulary(archetype, isRTL)`):
  - `routeLabel`: "Bus Line" / "School Route" / "Shift Shuttle" / "خط الحافلة" / "خط المدرسة" / "خط الوردية"
  - `stopLabel`: "Bus Stop" / "Student Pickup" / "Meeting Point" / "محطة توقف" / "نقطة تجمع الطلاب"
  - `passengerLabel`: "Passenger" / "Student" / "Employee" / "راكب" / "طالب" / "موظف"
  - `terminalLabel`: "Terminal Depot" / "School Campus" / "Corporate HQ" / "المحطة النهائية" / "مقر المدرسة"

### Step 2: Extracted Driver Stylesheet
#### [NEW] [`mobile/src/styles/driverHomeStyles.ts`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/styles/driverHomeStyles.ts)
- Extract the 740 lines of duplicate StyleSheet code into a clean, typed style factory supporting dynamic themes and RTL layouts.

### Step 3: Business Logic & State Custom Hooks
#### [NEW] [`mobile/src/hooks/useDriverTripState.ts`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/hooks/useDriverTripState.ts)
- Encapsulate `Location.watchPositionAsync`, `haversineMeters`, smoothed speed velocity, trip timer, and dynamic Point A reverse geocoding.
- Provide `startSharing()`, `stopSharing()`, `sendSOS()`, `sharing`, `currentSpeed`, `tripSeconds`, `driverLocation`.
- Include structured try/catch logging and informative error feedback.

#### [NEW] [`mobile/src/hooks/useDriverProfile.ts`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/hooks/useDriverProfile.ts)
- Encapsulate RTDB listeners for `/drivers/${uid}` and `/companies`.
- Resolve assigned company, available bus lines, and route definitions with intermediate stops.
- Provide company switching and line selection handlers with AsyncStorage caching.

### Step 4: Modular Visual Presentation Components
#### [NEW] [`mobile/src/components/driver/DriverHeader.tsx`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverHeader.tsx)
- Driver initials/avatar, display name, dynamic company switcher badge, SOS alert button, settings button.

#### [NEW] [`mobile/src/components/driver/DriverTripCard.tsx`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverTripCard.tsx)
- Live trip status indicator, digital trip timer, speedometer gauge (km/h), dynamic Point A to Point B summary.

#### [NEW] [`mobile/src/components/driver/DriverSafetyOverlay.tsx`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverSafetyOverlay.tsx)
- `CameraView` with front/back toggle, minimize/expand toggle, and WebRTC streaming banner.

#### [NEW] [`mobile/src/components/driver/DriverRouteTimeline.tsx`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverRouteTimeline.tsx)
- Multi-stop itinerary timeline with intermediate landmark names and numbered badges.

#### [NEW] [`mobile/src/components/driver/DriverModals.tsx`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/components/driver/DriverModals.tsx)
- Clean, decoupled company selection modal and bus line selection modal.

### Step 5: Refactored Coordinator Screen
#### [MODIFY] [`mobile/src/screens/DriverHomeScreen.tsx`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile/src/screens/DriverHomeScreen.tsx)
- Becomes a clean, elegant layout coordinator under 220 lines that composes the hooks and components.
- Complete JSDoc documentation on every function, interface, and hook.

### Step 6: Documentation & Function Catalog
- Run `python3 scripts/generate_functions_doc.py` to index the newly modularized, 100% documented functions.

---

## Verification Plan

### Automated Verification
1. **Line Count Verification:**
   - Verify that all newly created files and `DriverHomeScreen.tsx` are strictly under 400 lines of code.
2. **TypeScript Compilation:**
   - Run `npx tsc --noEmit` in `mobile/` to verify zero type regressions, syntax errors, or broken imports.
3. **Function Catalog:**
   - Verify that all new hooks and components appear with descriptive JSDocs in `functions.md`.

### Manual Verification
- Verify that the driver screen layout, speedometer, broadcasting loop, route timeline, camera overlay, and modals function identically.
