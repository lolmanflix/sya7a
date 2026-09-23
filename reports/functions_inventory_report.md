# Functions Inventory & Dependency Guide

**Date:** September 18, 2026  
**Project:** Wasalt Bus Tracker Platform & Admin Portal  
**Compiled by:** Jarvis

---

## 1. Documentation Status Overview

During our audit, [`scripts/generate_functions_doc.py`](file:///home/kimo/Desktop/random%20projects/bus%20tracker%20sya7a%20version/scripts/generate_functions_doc.py) mapped **334 functions** across the active codebase. 

* **Documented Functions:** 64 (~19%)
* **Undocumented Functions ("No description provided"):** 270 (~81%)

The high ratio of undocumented functions is the root cause of the "dependency hell" and obscurity when reviewing the code. Below is the documentation distribution by subsystem:

| Module / Directory | Total Functions | Documented | Undocumented | Primary Responsibility |
| :--- | :---: | :---: | :---: | :--- |
| `admin/src/services/` | 52 | 31 | 21 | Firebase RTDB CRUD, OSRM routing, Overpass landmark lookup, WebRTC signaling |
| `admin/src/pages/` | 68 | 8 | 60 | Admin view controllers, lifecycle state, modal triggers |
| `admin/src/components/` | 74 | 14 | 60 | Map rendering, forms, tables, toolbars, safety modals |
| `sya7a new/src/screens/` | 82 | 4 | 78 | Mobile screen controllers, driver telemetry loop, commuter search |
| `sya7a new/src/utils/` | 38 | 5 | 33 | WebRTC streaming, AsyncStorage driver sessions, favorites, history |
| `sya7a new/src/contexts/` | 20 | 2 | 18 | Auth, Location, Theme, I18n, Subscription providers |

---

## 2. Plain-English Guide to Cryptic & Complex Functions

To help you quickly understand the most complex functions in the codebase without wading through hundreds of lines, here is an executive breakdown:

### A. WebRTC Peer-to-Peer Streaming
* **Files:** `sya7a new/src/utils/driverSafetyStream.ts` & `admin/src/services/webrtcAdminService.ts`
* **What it does:** Allows dispatchers in the admin portal to inspect a driver's bus interior during an emergency.
* **How it works:**
  1. `requestDriverMediaStream(driverUid, kind)` writes `{ status: 'pending', kind: 'video' }` to `/driverControls/<driverUid>/mediaRequest`.
  2. Mobile's `useDriverSafetyStream` listens to this node. When requested, it starts `expo-camera`, creates an `RTCPeerConnection`, generates an SDP offer, and sends ICE candidates through Firebase RTDB.
  3. `webrtcAdminService.ts` receives the offer, sets the remote description, sends an SDP answer, and attaches the incoming WebRTC MediaStream directly to an HTML5 `<video>` tag.
  4. Media data flows directly P2P via STUN/TURN, entirely bypassing Firebase database bandwidth limits.

---

### B. Nearest Named Landmark Resolution Engine
* **File:** `admin/src/services/landmarkService.ts`
* **Key Function:** `resolveNearestLandmark(lat, lng, radiusMeters)`
* **What it does:** Instead of showing raw coordinates (e.g. `30.0444, 31.2357`), it finds the nearest human-recognized place name (e.g. "Beside Metro Market" or "Opposite Cairo Stadium").
* **How it works:**
  1. First queries an offline database of Egyptian landmark gazetteers (`admin/src/constants/landmarks.ts`) for fast <5ms matching.
  2. If none match within 150m, it fires an Overpass API QL query: `node["amenity"~"hospital|school|restaurant|bank"](around:200, lat, lng);`.
  3. If Overpass fails or times out, it falls back to OpenStreetMap Nominatim reverse geocoding to extract street, neighborhood, and city names.

---

### C. Road-Following Multi-Stop Route Geometry
* **File:** `admin/src/services/routingService.ts`
* **Key Function:** `fetchMultiStopRouteGeometry(waypoints)`
* **What it does:** Calculates realistic road driving paths that follow street curves between terminals and intermediate bus stops, rather than straight bird-flight lines.
* **How it works:**
  1. Formats waypoints into an OSRM API URL: `https://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson`.
  2. Decodes the returned GeoJSON polyline array `[ [lat, lng], ... ]`.
  3. Stores the route in an in-memory session cache so repeated calls avoid external API rate limits.
  4. Falls back to straight-line interpolation if OSRM is unreachable.

---

### D. Driver Point A Dynamic GPS Integration
* **File:** `sya7a new/src/screens/DriverHomeScreen.tsx`
* **Key Logic:** `haversineMeters()` + `Location.watchPositionAsync()`
* **What it does:** Dynamically anchors the starting terminal (Point A) to wherever the driver turns on the bus engine and begins broadcasting, rather than forcing a rigid pre-set depot.
* **How it works:**
  1. Driver presses "Start Broadcasting".
  2. GPS location is captured and reverse-geocoded to a readable street name.
  3. Written to `/busLocations/<lineId>/<driverUid>` along with speed and timestamp.
  4. Commuters' maps instantly draw the route starting from the bus's live GPS position toward the destination.

---

### E. Master Admin 2FA Authentication
* **Files:** `admin/src/utils/totp.ts` & `admin/src/pages/LoginPage.tsx`
* **Key Functions:** `generateTotpSecret()`, `verifyTotpToken(secret, token)`
* **What it does:** Protects the dispatcher console with RFC 6238 Time-based One-Time Passwords compatible with Google Authenticator, Microsoft Authenticator, and 1Password.
* **How it works:**
  1. Evaluates HMAC-SHA1 of a shared Base32 secret combined with the current 30-second Unix time counter.
  2. Checks the current time window plus or minus 1 step (to tolerate up to 30 seconds of client device clock drift).

---

## 3. Standard JSDoc Documentation Blueprint

Every function refactored or created during this cleanup must adhere to the following clean, explicit documentation standard so that `generate_functions_doc.py` produces an informative, crystal-clear reference:

```typescript
/**
 * Subscribes in real-time to active bus locations for a designated transit line.
 *
 * @param lineId - The unique identifier of the bus line (e.g. "115", "BRT-1").
 * @param onUpdate - Callback invoked whenever a driver updates their GPS coordinates.
 * @returns An unsubscribe cleanup function to detach the RTDB listener upon unmount.
 *
 * @example
 * const unsubscribe = subscribeToLineTelemetry("115", (buses) => setBuses(buses));
 * return () => unsubscribe();
 */
export function subscribeToLineTelemetry(
  lineId: string,
  onUpdate: (buses: LiveBusLocation[]) => void
): () => void {
  // implementation...
}
```
