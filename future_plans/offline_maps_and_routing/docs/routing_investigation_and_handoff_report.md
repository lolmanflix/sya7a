# Road Routing Investigation & Handoff Report

**Project:** Wasalt (Sya7a) Transit Fleet Management  
**Date:** September 24, 2026 (02:45 AM)  
**Author:** Jarvis (Autonomous Engineering Agent)  
**Status:** In Progress / Ready for Morning Resumption  

---

## 1. Executive Summary

During tonight's session, we made significant progress migrating the routing infrastructure from cloud-dependent/hardcoded mock data to pure edge-device execution (Option B) using local map assets:
- Successfully extracted authentic Egyptian road network data directly from `/home/kimo/Storage/datasets/map.mbtiles` with 10-meter quantization and road curve preservation.
- Eliminated artificial shortcut bridge heuristics that previously produced severe V-turns through residential neighborhoods.
- Updated `bidirectionalAStar.ts` in both Admin and Mobile applications to unpack intermediate road curve coordinates (`pts`).
- Maintained 100% compliance across all 5 Dev Rules quality gates (135 files <= 400 lines).

However, the Admin Panel map may still appear misaligned or display straight lines. We have isolated the root causes and formulated a precise 4-step action plan to resolve this first thing tomorrow.

---

## 2. Root Cause Analysis: Why the Routing Error Persists

Through code inspection and pipeline analysis, we identified three technical causes for the persistent misalignment on the frontend:

### A. Asynchronous Graph Loading Race Condition & Fallback Caching
1. In `admin/src/services/localRoutingEngine.ts`, the 9.2 MB road graph is fetched asynchronously:
   ```ts
   fetch('/data/egypt_road_graph.json')
     .then((r) => r.json())
     .then((data) => bidirectionalRouter.loadNodes(data.nodes));
   ```
2. When the admin dashboard loads, `FleetMap.tsx` mounts immediately and calls `fetchRoadRoute([origin, dest])` within the first 50ms.
3. Because downloading and parsing 9.2 MB of JSON takes ~250–500ms, the router has 0 nodes loaded (`nodesMap.size === 0`).
4. The router immediately falls back to a direct straight line (`isFallback: true`).
5. **The Critical Flaw:** `routingService.ts` caches this fallback result in memory:
   ```ts
   // routingService.ts line 96
   routeCache.set(key, result); // CACHES STRAIGHT LINE FALLBACK PERMANENTLY!
   ```
6. Even after the graph finishes loading half a second later, all subsequent route queries for that corridor hit `routeCache` and return the straight line.

### B. Aggressive Browser HTTP Caching of Static JSON
- The browser caches `/data/egypt_road_graph.json` via HTTP 304 Not Modified. If the user previously loaded the broken graph, the browser continues using the stale cached JSON unless a cache-busting query parameter (`?v=...`) or hard reload is performed.

### C. Temporary Straight-Line Flash in Leaflet
- In `FleetMap.tsx` (lines 207–232), `liveRouteLine` is initialized with `[originPt, destPt]` before `fetchRoadRoute` resolves:
  ```ts
  const liveRouteLine = L.polyline([originPt, destPt], { ... });
  linesLayer.addLayer(liveRouteLine);
  ```
- If the async calculation is delayed or falls back, the user sees a raw diagonal chord between the two pins.

---

## 3. High-Priority Action Plan for Tomorrow Morning

When we resume tomorrow, we will execute the following targeted fixes:

### Step 1: Make Route Computation Await Graph Initialization
- In `localRoutingEngine.ts`, export an `ensureGraphLoaded(): Promise<void>` function that caches the fetch promise.
- Update `computeLocalRoadRoute` to be asynchronous (`async computeLocalRoadRoute`) so it waits for the graph before executing A*.

### Step 2: Prevent Caching of Fallback Routes
- In `routingService.ts`, only store results in `routeCache` if `!result.isFallback`. If the graph is not ready, do not pollute the cache with straight chords.

### Step 3: Add Cache-Buster & Optimize Graph Payload
- Add a cache-busting timestamp/hash to the graph fetch: `fetch('/data/egypt_road_graph.json?v=' + GRAPH_BUILD_TIMESTAMP)`.
- If 9.2 MB is too heavy for instant mobile/browser parsing, run a compact binary packing or Douglas-Peucker pass to trim redundant collinear vertices and reduce payload size to ~4-5 MB.

### Step 4: Hide Polyline in `FleetMap.tsx` Until Real Road Coordinates Resolve
- Initialize `liveRouteLine` with an empty coordinate array `[]` (or render only after `res.coordinates` arrives) so the user never sees a diagonal chord cutting through buildings.

---

## 4. Current Environment State

| Component | Status | Port / Task ID |
|---|---|---|
| **Vite Dev Server** | RUNNING | `http://localhost:5173/` (`task-594`) |
| **Telemetry Simulator** | RUNNING | Daemon (`task-1306`) streaming 384 points |
| **Road Graph Asset** | GENERATED | `admin/public/data/egypt_road_graph.json` (9.2 MB) |
| **Dev Rules Compliance** | PASSING | 5/5 Gates (`test_dev_rules.py`) |
| **TypeScript Validation** | PASSING | Both `admin` and `mobile` compile with 0 errors |

---

## 5. Handoff Checklist for Resumption
1. [ ] Read `reports/routing_investigation_and_handoff_report.md`.
2. [ ] Apply `ensureGraphLoaded` promise awaiter in `localRoutingEngine.ts` and `routingService.ts`.
3. [ ] Guard `routeCache` against fallback caching.
4. [ ] Invalidate browser cache on `http://localhost:5173/` and verify the cyan line follows the road centerlines.
