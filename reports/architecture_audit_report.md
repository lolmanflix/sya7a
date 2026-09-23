# Codebase Architecture & Modularity Audit Report

**Date:** September 18, 2026  
**Project:** Wasalt Bus Tracker Platform & Admin Portal  
**Prepared by:** Jarvis

---

## 1. Executive Summary

This report provides a structural assessment of the **Wasalt Bus Tracker** project following an in-depth audit of the repository. The objective is to establish a modular, maintainable baseline compliant with the project's architectural guidelines (**strictly under 400 lines per file**, clean separation of presentation from business logic, and automated documentation).

---

## 2. File Size & Complexity Hotspots

The project's architectural rule mandates that **all code files must remain strictly under 400 lines of code**. The table below identifies all files currently breaching this boundary, their line counts, and the primary causes of bloat:

| File Path | Lines | Primary Causes of Bloat | Planned Target |
| :--- | :---: | :--- | :---: |
| `sya7a new/src/screens/DriverHomeScreen.tsx` | **2,060** | GPS tracking, speed math, RTDB listeners, WebRTC camera/mic signaling, 4 modals, and ~740 lines of duplicate StyleSheet code | **< 280** (5 sub-modules) |
| `sya7a new/src/screens/AdminDashboardScreen.tsx` | **1,339** | Redundant mobile admin dashboard mixing bus tables, route creation, and auth logic | **0** (Safe removal) |
| `sya7a new/src/screens/LoginScreen.tsx` | **709** | Commuter & driver auth, company picker modal, Apple auth, password reset inline | **< 260** (3 sub-modules) |
| `sya7a/src/screens/MapScreen.tsx` (Legacy) | **682** | Monolithic Leaflet webview integration, stops rendering, bus card overlays | Archived |
| `sya7a/src/screens/HomeScreen.tsx` (Legacy) | **635** | Commuter search, favorite lines, and inline status cards | Archived |
| `sya7a new/src/screens/HomeScreen.tsx` | **563** | Commuter search input, favorites, active bus cards, and drawer animation | **< 280** (3 sub-modules) |
| `sya7a/src/screens/LoginScreen.tsx` (Legacy) | **524** | Duplicate authentication screen | Archived |
| `sya7a/src/screens/DriverHomeScreen.tsx` (Legacy) | **480** | Pre-multipoint driver screen | Archived |
| `sya7a new/src/screens/MapScreen.tsx` | **419** | Sheet state, dynamic road polyline parsing, and map event bridges | **< 300** (2 sub-modules) |
| `admin/src/pages/CompaniesPage.tsx` | **400** | Company directory, search filter, and add/edit modal state on a single screen | **< 220** (2 sub-components) |

---

## 3. High-Level Dependency & Service Mapping

Understanding function and service dependencies is essential to untangling the codebase. The ecosystem is organized around five primary data domains in the Firebase Realtime Database:

```mermaid
graph TD
    subgraph Firebase Realtime Database
        RTDB_LOC["/busLocations<br/>(Live Telematics)"]
        RTDB_COMP["/companies<br/>(Companies, Lines, Buses)"]
        RTDB_DRIV["/drivers<br/>(Driver Profiles & Lines)"]
        RTDB_CTRL["/driverControls<br/>(WebRTC Signaling & Media)"]
        RTDB_USER["/users<br/>(Commuters & Trip History)"]
    end

    subgraph Admin Web Portal
        Admin_Dash["DashboardPage / FleetMap"] --> RTDB_LOC
        Admin_Comp["CompaniesPage / RoutesPage"] --> RTDB_COMP
        Admin_Driv["DriversPage"] --> RTDB_DRIV
        Admin_Safe["DriverSafetyMediaModal"] --> RTDB_CTRL
        Admin_User["PassengersPage"] --> RTDB_USER
        Admin_OSRM["routingService / landmarkService"] --> Overpass["Overpass API / OSRM"]
    end

    subgraph Mobile App (Driver Flow)
        Driver_GPS["useDriverTripState (GPS Telemetry)"] --> RTDB_LOC
        Driver_Info["DriverHomeScreen (Line & Company)"] --> RTDB_COMP
        Driver_Safe["useDriverSafetyMonitor (WebRTC)"] --> RTDB_CTRL
    end

    subgraph Mobile App (Passenger Flow)
        Pass_Map["MapScreen (Bus Pins & Stops)"] --> RTDB_LOC
        Pass_Home["HomeScreen (Line Search)"] --> RTDB_COMP
        Pass_Hist["HistoryScreen & Favorites"] --> RTDB_USER
    end
```

---

## 4. Key Subsystem Analysis

### A. Live GPS Telemetry Pipeline
1. **Driver Broadcast:** `DriverHomeScreen.tsx` polls foreground GPS via `expo-location` every few seconds.
2. **Reverse Geocoding:** Dynamic Point A resolves local street/district names using `Location.reverseGeocodeAsync`.
3. **RTDB Persistence:** Telemetry is written to `/busLocations/<lineId>/<driverUid>`.
4. **Consumer Feeds:** 
   * `admin/src/services/telemetryService.ts` subscribes in real-time to render moving bus markers on `FleetMap.tsx`.
   * Passenger `MapScreen.tsx` listens to `/busLocations/<selectedLine>` and injects markers into Leaflet via `postMessage`.

### B. SafeTrip WebRTC Remote Inspection Pipeline
1. **Admin Trigger:** Dispatcher opens `DriverSafetyMediaModal.tsx` and writes a request to `/driverControls/<driverUid>/mediaRequest`.
2. **Mobile Listener:** `driverSafetyStream.ts` in the mobile app detects the request, activates `expo-camera` / microphone, and initializes a WebRTC peer connection.
3. **Signaling & Handshake:** SDP offers/answers and ICE candidates are exchanged via `/driverControls/<driverUid>/signaling`.
4. **Direct P2P Streaming:** Video and audio stream directly peer-to-peer at up to 30 FPS, consuming zero database bandwidth for media frames.

### C. Road Geometry & Landmark Mapping Engine
1. **OSRM Route Geometry (`routingService.ts`):** Fetches turn-by-turn road polylines from the Open Source Routing Machine API instead of drawing straight lines between stops.
2. **Nearest Named Landmark Engine (`landmarkService.ts`):** When an admin or driver drops a pin, queries the OpenStreetMap Overpass API (shops, transit hubs, prominent buildings) and falls back to Nominatim to assign human-friendly names (e.g. "Beside Metro Market") to coordinates.

---

## 5. Dead Code & Hygiene Remediation Targets

1. **`sya7a new/src/screens/AdminDashboardScreen.tsx` (1,339 lines):** Dead code; mobile admin functionality has been migrated to the dedicated `admin/` web portal.
2. **`sya7a new/admin-dashboard.html` (460 lines):** Legacy standalone HTML prototype; obsolete.
3. **`temp/` Directory (~25 MB):** Contains past hackathon pitch decks (`.pptx`), judging criteria (`.pdf`), and demo videos (`.zip`). Needs exclusion from git and documentation indexing.
4. **`sya7a/` (Legacy Directory):** Superseded by `sya7a new/`. Needs archiving to avoid confusion.
