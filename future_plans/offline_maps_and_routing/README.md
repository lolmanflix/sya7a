# Offline Maps & Local Routing Engine (Future Plans & Architecture)

## Overview
This directory preserves all code, datasets, extractors, and styling components developed for the offline Egyptian road network and vector tile engine. It has been moved here while the Admin Portal operates on standard OpenStreetMap (OSM) raster tiles and the online OSRM routing engine.

## Preserved Assets

### 1. Admin Services & Components
- `admin/services/bidirectionalAStar.ts`: High-performance bidirectional A* pathfinding algorithm with road curve point decompression (`pts`).
- `admin/services/localRoutingEngine.ts`: Client-side routing engine mapping coordinates to the road network graph.
- `admin/components_map/localMapStyles.ts`: MapLibre GL vector styling for Dark and Street modes sourced from local MBTiles.
- `admin/components_map/offlineMapLayer.ts`: Offline Leaflet layer renderer for Nile water bodies and road centerlines.

### 2. Map & Graph Assets
- `admin/public/egypt_road_graph.json`: 9.6 MB pre-quantized topological graph of Egyptian primary and secondary roads.
- `admin/public/cairo_demo_corridor.json`: GeoJSON demo corridor for Cairo transit arteries.
- `admin/public/egypt_transit_roads.json`: Cleaned road geometry lines.
- `admin/public/egypt_nile_water.json`: Water polygon vectors for Cairo/Giza Nile basin.
- `admin/public/maplibre-gl-shared.mjs` & `maplibre-gl-worker.mjs`: Offline standalone Web Workers for MapLibre GL.

### 3. Pipeline Scripts & Data
- `scripts/build_road_graph.py`: Python tool to extract, quantize, and graph roads from OSM or MBTiles.
- `scripts/extract_demo_map.py`: Spatial extractor for Cairo bounding box.
- `data/demo_map/`: Extracted geojson and graph fixtures.
- `docs/routing_investigation_and_handoff_report.md`: Deep-dive audit on graph loading, caching race conditions, and optimization proposals.

## Future Re-Integration Blueprint
When transitioning the Admin Panel to Electron or a native offline desktop app:
1. Re-bundle `egypt_road_graph.json` as a binary SQLite or indexed buffer rather than a monolithic 9.6 MB JSON to eliminate browser parsing lag.
2. Initialize the graph in a Background Web Worker before the UI requests routes, guaranteeing `nodesMap` is populated before first query.
3. Serve vector tiles via Electron's custom protocol (`app://tiles/{z}/{x}/{y}`) directly from `map.mbtiles` without requiring a Vite dev-server middleware.
