# Wasalt Bus Tracker Platform — Table of Contents & Version Archive

This document provides a comprehensive historical index and directory of all architectural iterations of the **Wasalt Bus Tracker Platform**, categorizing active production codebases and archived legacy versions to facilitate seamless maintenance and auditing.

---

## 🏛️ Ecosystem Overview & Version Timeline

```
[June - Aug 2026] ────────────────> [Early Sep 2026] ───────────────> [Mid Sep 2026] ──────────────────> [Current Production]
    v1.0 (Flutter/Dart)                v2.0 (Expo 53 JS/TS)                v2.1 / v2.5 (Hackathon)             v3.0 (Unified Ecosystem)
• Mobile & Desktop Admin            • React Native Expo 53 Prototype   • IMPACT X Pitch Decks & Videos      • Admin Web Portal (React 19 + Vite)
• SQLite + Firebase RTDB            • Basic Leaflet WebView Map         • Monolithic Mobile Admin Screen     • Mobile App (Expo 57 + RN 0.86)
• Archived in Projects/archive/     • Archived in archive/sya7a-expo53/ • Archived in archive/hackathon/     • Active in admin/ and mobile/
```

---

## 📦 Active Production Codebases (v3.0)

| Directory | Technology Stack | Role & Responsibility | Status |
| :--- | :--- | :--- | :---: |
| [`admin/`](file:///home/kimo/Projects/active/bus-tracker-sya7a/admin) | React 19, TypeScript, Vite, Tailwind CSS, Leaflet, Lucide React | **Master Admin & Dispatcher Console:** Real-time fleet telematics map, multi-operator line management, visual multi-stop route builder with OSRM road geometry, landmark geocoder, 2FA TOTP authentication, and SafeTrip WebRTC live inspection. | **Active Production** |
| [`mobile/`](file:///home/kimo/Projects/active/bus-tracker-sya7a/mobile) | React Native 0.86, Expo 57, React 19, TypeScript, Leaflet WebView | **Driver & Passenger Mobile Application:** Bilingual (Arabic/English) transit tracker, driver high-frequency GPS telemetry broadcast, dynamic Point A route anchoring, stop-by-stop passenger itinerary timeline, and WebRTC hardware camera streamer. | **Active Production** |
| [`reports/`](file:///home/kimo/Projects/active/bus-tracker-sya7a/reports) | Markdown, Mermaid Diagrams | **Architecture & Quality Documentation:** Codebase audits, function dependency maps, 400-line modularization benchmarks, and phased implementation plans. | **Active Documentation** |
| [`scripts/`](file:///home/kimo/Projects/active/bus-tracker-sya7a/scripts) | Python 3, Regex | **Developer Tooling & Automation:** Cross-platform functions parser (`generate_functions_doc.py`) compiling `functions.md`. | **Active Tooling** |

---

## 🗄️ Archived Legacy Versions & Historical Artifacts

All past versions have been preserved with complete fidelity to ensure zero data loss while keeping the active codebase pristine:

### 1. Wasalt v1.0 — Flutter & Dart Cross-Platform Prototype
* **Location:** [`/home/kimo/Projects/archive/bus-tracker-flutter-legacy/`](file:///home/kimo/Projects/archive/bus-tracker-flutter-legacy/)
* **Symlink:** `/home/kimo/Projects/bus tracker`
* **Timeline:** June 2026 – August 2026
* **Technology:** Flutter 3.x, Dart 3.x, Android SDK, Windows Desktop Runner, SQLite, Firebase RTDB.
* **Key Components:**
  * `lib/`: Passenger Flutter application with vector map pins and route calculation.
  * `admin_app/`: Flutter desktop administrative companion for Windows/Linux.
  * `research paper/`: Early technical drafts and system architecture notes.
* **Reason for Archiving:** Transitioned to web-native administrative tooling (Vite/React) and modern React Native Expo for rapid web/mobile iteration and dynamic Overpass/OSRM webview integration.

---

### 2. Wasalt v2.0 — Early Expo 53 Mobile Prototype (`sya7a-expo53-legacy`)
* **Location:** [`archive/sya7a-expo53-legacy/`](file:///home/kimo/Projects/active/bus-tracker-sya7a/archive/sya7a-expo53-legacy)
* **Timeline:** September 8 – September 10, 2026
* **Technology:** React Native 0.79.5, Expo 53.0.22, React 19.0.0.
* **Key Components:**
  * Initial Leaflet HTML injection prototype (`OpenStreetMap.html`).
  * Basic point-to-point destination picker and mock Cairo bus lines.
* **Reason for Archiving:** Superseded by Expo 57 with native Android prebuild, EAS build integration, dynamic multi-stop waypoints, and WebRTC camera streaming.

---

### 3. Wasalt v2.1 — IMPACT X Hackathon Pitch Decks & Materials (`hackathon-artifacts`)
* **Location:** [`archive/hackathon-artifacts/`](file:///home/kimo/Projects/active/bus-tracker-sya7a/archive/hackathon-artifacts)
* **Timeline:** September 9 – September 10, 2026
* **Contents:**
  * `Wasalt_5Min_Pitch_Deck.pptx`, `Wasalt_IMPACT_X_Pitch_Deck.pptx`: Official competition pitch decks.
  * `demo video/`, `demo video.zip`: Screen recordings demonstrating early prototypes.
  * `build_5min_pitch_deck.py`, `build_impact_x_deck.py`: Python automation scripts for PowerPoint slide generation.
  * `IMPACT X Judging Criteria.pdf`: Competition scoring rules and rubric.
* **Reason for Archiving:** Outdated pitch materials and temporary presentation scripts are no longer required for day-to-day software development.

---

### 4. Wasalt v2.5 — Mobile Admin Dashboard Prototype (`mobile-admin-legacy`)
* **Location:** [`archive/mobile-admin-legacy/`](file:///home/kimo/Projects/active/bus-tracker-sya7a/archive/mobile-admin-legacy)
* **Timeline:** September 10, 2026
* **Contents:**
  * `AdminDashboardScreen.tsx` (1,339 lines): Monolithic mobile administrative screen.
  * `admin-dashboard.html` (460 lines): Early standalone HTML prototype with hardcoded Firebase keys.
* **Reason for Archiving:** Administrative management is strictly centralized in the dedicated `admin/` web portal. Mobile app is dedicated 100% to Drivers and Commuters.

---

## 🧭 File System Navigation Map

```
/home/kimo/Projects/
├── active/
│   └── bus-tracker-sya7a/               <── MAIN ACTIVE REPOSITORY
│       ├── admin/                       <── React 19 Web Admin Portal
│       ├── mobile/                      <── React Native Expo 57 Mobile App
│       ├── reports/                     <── Audit, Architecture, & Roadmap Reports
│       ├── scripts/                     <── Automated Function Catalog Parser
│       ├── archive/                     <── Repository-Specific Archives
│       │   ├── hackathon-artifacts/     <── Pitch decks, videos, PPTX scripts
│       │   ├── mobile-admin-legacy/     <── Retired mobile admin screen & HTML
│       │   ├── sya7a-expo53-legacy/     <── Expo 53 early prototype
│       │   └── TABLE_OF_CONTENTS.md     <── This archive index
│       ├── code_wiki.md                 <── System architecture single source of truth
│       ├── dev_rules.md                 <── Core development & file size rules
│       ├── functions.md                 <── Auto-compiled function index (209 functions)
│       └── TABLE_OF_CONTENTS.md         <── Master index
│
└── archive/
    ├── bus-tracker-flutter-legacy/      <── Flutter v1.0 project (21 GB)
    └── TABLE_OF_CONTENTS.md             <── System-wide archive catalog
```
