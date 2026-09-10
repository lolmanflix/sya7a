# Wasalt Bus Tracker - Mobile Architecture & Mechanisms

## 1. System Overview
**Wasalt** is a cross-platform transit tracking application built with **React Native** and **Expo**. It provides real-time bus telemetry, ETA estimation, line directory search, and interactive map tracking across Egyptian metropolitan and intercity bus fleets.

The application serves two distinct user personas with customized screen flows:
1. **Passengers / Commuters:** Search lines, monitor active buses on an interactive map, view proximity & ETAs, and bookmark favorite routes.
2. **Bus Drivers:** Authenticate with company credentials, select an active bus line and terminal destination, and stream high-frequency GPS telemetry to Firebase.

---

## 2. Technology Stack & Key Dependencies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React Native 0.79.5 / Expo 53.0.22 | Cross-platform Android & iOS execution |
| **Language** | TypeScript (~5.8.3) / JavaScript | Type safety and structured data models |
| **Navigation** | React Navigation 7.x (Stack + Bottom Tabs) | Screen transitions and tab routing |
| **Database & Auth** | Firebase JS SDK v12.2.1 | Realtime Database & Auth with AsyncStorage persistence |
| **Geolocation** | `expo-location` (~18.1.6) | High-accuracy foreground GPS tracking |
| **Map Rendering** | `react-native-webview` (Leaflet 1.9.4 / OSM) | Interactive map without proprietary API vendor locks |
| **Reverse Geocoding**| OpenStreetMap Nominatim & Komoot Photon | Real-time destination search and address resolution |
| **Internationalization**| Custom `I18nContext` | Bilingual Arabic (`ar`) and English (`en`) support |

---

## 3. Architecture & Layer Breakdown

```
sya7a/src/
├── components/             # Reusable UI components
│   ├── OpenStreetMap.html  # Leaflet HTML template for webview
│   ├── SettingsModal.tsx   # Theme and language toggles
│   └── SidebarMenu.tsx     # Passenger side drawer navigation
├── config/
│   └── firebase.ts         # Firebase App, Auth, and RTDB initialization
├── contexts/               # Global state providers
│   ├── AuthContext.tsx     # Authentication state, sign-in, sign-up, Apple Auth
│   ├── I18nContext.tsx     # Arabic/English translations and RTL handling
│   ├── LocationContext.tsx # Passenger device location listener
│   ├── ThemeContext.tsx    # Dark and light visual theme tokens
│   └── UserTypeContext.tsx # Persona discriminator ('passenger' | 'driver')
├── screens/                # Core user journey views
│   ├── CompaniesScreen.tsx # Directory of transport operators and bus lines
│   ├── DriverHomeScreen.tsx# Driver dashboard, destination search, live GPS broadcast
│   ├── HistoryScreen.tsx   # Passenger recent search logs
│   ├── HomeScreen.tsx      # Main passenger portal, active bus feeds, ETAs
│   ├── LoginScreen.tsx     # Credential input, role validation, session conflict check
│   ├── MapScreen.tsx       # Fullscreen interactive map with animated bus pins
│   └── RoleSelectionScreen.tsx # Initial persona gatekeeper
└── utils/                  # Utility services
    ├── driverStorage.ts    # AsyncStorage persistence for driver company & line
    ├── favoritesUtils.ts   # Realtime synchronization of favorite routes
    └── historyUtils.ts     # User trip and search history logger
```

---

## 4. Operational Mechanisms & Workflows

### A. Role Selection & Authentication
1. **Entry Point (`RoleSelectionScreen.tsx`):** Unauthenticated users choose between `Passenger` and `Driver`.
2. **Driver Concurrency Guard (`LoginScreen.tsx`):**
   - When a driver logs in, the app queries `busLocations` to verify no other active device is currently streaming location under that driver's email.
   - If an active session is detected, login is blocked until the prior stream is cleanly terminated.
3. **Session Persistence:** Auth state is cached in `AsyncStorage` via Firebase `initializeAuth` with `getReactNativePersistence`.

### B. Driver Live Telemetry Engine (`DriverHomeScreen.tsx`)
1. **Line & Destination Selection:**
   - Driver retrieves assigned lines from `/companies/<companyId>`.
   - Driver enters or searches for a terminal endpoint. The search engine combines a pre-curated dictionary of prominent Egyptian landmarks (Tahrir, Ramses, Nasr City, Pyramids, Cairo Airport) with live OpenStreetMap/Nominatim queries.
2. **GPS Broadcast Loop:**
   - On tapping **Start Sharing**, the app requests foreground location permission.
   - Initial coordinates are committed to:
     `busLocations/<selectedBusLine>/<driverUid>`
   - `Location.watchPositionAsync` fires updates every **5,000 ms** or **20 meters**.
3. **Clean Teardown:**
   - When the driver toggles **Stop Sharing** or logs out, the subscription is cancelled and the node `busLocations/<selectedBusLine>/<driverUid>` is atomically removed (`remove()`) from Firebase.

### C. Passenger Discovery & ETA Calculation (`HomeScreen.tsx` & `MapScreen.tsx`)
1. **Dual Listeners:**
   - Listens to `/buses` for static fleet catalog.
   - Listens to `/busLocations` to compute real-time active vehicle counts per line.
2. **Proximity & Bearing Algorithms:**
   - Computes distance using the **Haversine Formula**:
     $$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lon}}{2}\right)}\right)$$
   - Computes compass bearing to display directional vectors (`N`, `NE`, `SW`, etc.).
   - Estimates ETA assuming an average urban transit speed of 30 km/h in Egyptian traffic.
3. **Interactive Map Rendering:**
   - `MapScreen.tsx` injects live vehicle coordinates into a Leaflet.js instance embedded inside `react-native-webview`.
   - Custom SVG bus markers rotate and update dynamically without full-page reloads.
