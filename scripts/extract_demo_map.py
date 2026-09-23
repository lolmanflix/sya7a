#!/usr/bin/env python3
"""
extract_demo_map.py
Extracts essential vector map layers (roads, water bodies, landmarks) from
/home/kimo/Storage/datasets/map.mbtiles in STRICT READ-ONLY mode.
Produces lightweight, compressed vector assets for offline map rendering
and client-side Bidirectional A* routing.
"""

import os
import sys
import json
import math
import gzip
import shutil
import sqlite3
from typing import Dict, List, Any, Tuple

MBTILES_PATH = "/home/kimo/Storage/datasets/map.mbtiles"
OUTPUT_DIR = os.path.abspath("data/demo_map")
ADMIN_DATA_DIR = os.path.abspath("admin/public/data")
MOBILE_DATA_DIR = os.path.abspath("mobile/assets/data")

APPROVED_POI_CLASSES = {
    "bus", "railway", "transit", "aerodrome",
    "university", "college", "school",
    "hospital", "healthcare",
    "attraction", "monument", "museum", "place_of_worship",
    "mall", "townhall", "stadium"
}

ROAD_CLASSES = {"motorway", "trunk", "primary", "secondary", "tertiary"}


def num2deg(xtile: int, ytile: int, zoom: int) -> Tuple[float, float]:
    """Convert tile column/row at zoom to WGS84 lat/lon of Northwest corner."""
    n = 2.0 ** zoom
    lon_deg = xtile / n * 360.0 - 180.0
    lat_rad = math.atan(math.sinh(math.pi * (1.0 - 2.0 * ytile / n)))
    lat_deg = math.degrees(lat_rad)
    return lat_deg, lon_deg


def tile_to_wgs84(px: float, py: float, z: int, x: int, y_xyz: int, extent: int = 4096) -> Tuple[float, float]:
    """Transform pixel coordinates inside an MVT tile to WGS84 (lon, lat)."""
    n = 2.0 ** z
    lon = (x + (px / extent)) / n * 360.0 - 180.0
    y_unit = y_xyz + (py / extent)
    lat_rad = math.atan(math.sinh(math.pi * (1.0 - 2.0 * y_unit / n)))
    lat = math.degrees(lat_rad)
    return round(lon, 5), round(lat, 5)


def open_mbtiles_readonly(path: str) -> sqlite3.Connection:
    """Safely open the master MBTiles file in strict read-only mode."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"Master MBTiles not found at {path}")
    uri = f"file:{os.path.abspath(path)}?mode=ro"
    return sqlite3.connect(uri, uri=True)


def extract_water_features(conn: sqlite3.Connection, mapbox_vector_tile, simplify_fn) -> List[Dict[str, Any]]:
    """Extract River Nile and major waterbodies from zoom levels 8 to 10."""
    print("Extracting water layers (River Nile & coastlines)...")
    cur = conn.cursor()
    cur.execute("SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles WHERE zoom_level IN (8, 9, 10);")
    
    water_features = []
    seen_geoms = set()
    
    for z, x, y_tms, raw_data in cur.fetchall():
        y_xyz = (2**z - 1) - y_tms
        data = gzip.decompress(raw_data) if (len(raw_data) >= 2 and raw_data[0] == 0x1F and raw_data[1] == 0x8B) else raw_data
        try:
            decoded = mapbox_vector_tile.decode(data)
        except Exception:
            continue
            
        for layer_name in ("water", "waterway"):
            layer = decoded.get(layer_name)
            if not layer:
                continue
            extent = layer.get("extent", 4096)
            for feat in layer.get("features", []):
                geom = feat.get("geometry")
                if not geom:
                    continue
                g_type = geom.get("type")
                coords = geom.get("coordinates", [])
                
                if g_type == "Polygon":
                    transformed_rings = []
                    for ring in coords:
                        wgs_ring = [tile_to_wgs84(pt[0], pt[1], z, x, y_xyz, extent) for pt in ring]
                        if len(wgs_ring) >= 3:
                            transformed_rings.append(wgs_ring)
                    if transformed_rings:
                        poly_wgs = {"type": "Polygon", "coordinates": transformed_rings}
                        simplified = simplify_fn(poly_wgs, 0.001)
                        sig = str(simplified.get("coordinates", [])[0][:2]) if simplified.get("coordinates") else ""
                        if sig and sig not in seen_geoms:
                            seen_geoms.add(sig)
                            water_features.append({
                                "type": "Feature",
                                "properties": {"class": feat.get("properties", {}).get("class", "water")},
                                "geometry": simplified
                            })
                elif g_type == "LineString":
                    wgs_line = [tile_to_wgs84(pt[0], pt[1], z, x, y_xyz, extent) for pt in coords]
                    if len(wgs_line) >= 2:
                        line_wgs = {"type": "LineString", "coordinates": wgs_line}
                        simplified = simplify_fn(line_wgs, 0.001)
                        sig = str(simplified.get("coordinates", [])[:2])
                        if sig not in seen_geoms:
                            seen_geoms.add(sig)
                            water_features.append({
                                "type": "Feature",
                                "properties": {"class": feat.get("properties", {}).get("class", "river")},
                                "geometry": simplified
                            })
    return water_features


def extract_road_network(conn: sqlite3.Connection, mapbox_vector_tile, simplify_fn) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """Extract arterial road network for Egypt & Greater Cairo and build connectivity graph."""
    print("Extracting arterial road network...")
    cur = conn.cursor()
    cur.execute("SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles WHERE zoom_level IN (10, 11);")
    
    road_features = []
    seen_edges = set()
    graph_nodes: Dict[str, Dict[str, Any]] = {}
    
    def get_or_create_node(lon: float, lat: float) -> str:
        node_id = f"{lat:.3f},{lon:.3f}"
        if node_id not in graph_nodes:
            graph_nodes[node_id] = {"id": node_id, "lat": lat, "lng": lon, "adj": []}
        return node_id

    for z, x, y_tms, raw_data in cur.fetchall():
        y_xyz = (2**z - 1) - y_tms
        data = gzip.decompress(raw_data) if (len(raw_data) >= 2 and raw_data[0] == 0x1F and raw_data[1] == 0x8B) else raw_data
        try:
            decoded = mapbox_vector_tile.decode(data)
        except Exception:
            continue
            
        layer = decoded.get("transportation")
        if not layer:
            continue
        extent = layer.get("extent", 4096)
        
        for feat in layer.get("features", []):
            props = feat.get("properties", {})
            r_class = props.get("class", "")
            if r_class not in ROAD_CLASSES:
                continue
                
            geom = feat.get("geometry", {})
            g_type = geom.get("type")
            coords_list = geom.get("coordinates", [])
            
            lines = [coords_list] if g_type == "LineString" else (coords_list if g_type == "MultiLineString" else [])
            for line in lines:
                if len(line) < 2:
                    continue
                wgs_coords = [tile_to_wgs84(pt[0], pt[1], z, x, y_xyz, extent) for pt in line]
                simplified = simplify_fn({"type": "LineString", "coordinates": wgs_coords}, 0.0008)
                pts = simplified.get("coordinates", [])
                if len(pts) < 2:
                    continue
                    
                edge_sig = f"{pts[0]}-{pts[-1]}"
                if edge_sig in seen_edges:
                    continue
                seen_edges.add(edge_sig)
                
                speed = 90 if r_class in ("motorway", "trunk") else (60 if r_class == "primary" else 45)
                road_features.append({
                    "type": "Feature",
                    "properties": {"class": r_class, "speed": speed},
                    "geometry": simplified
                })
                
                for i in range(len(pts) - 1):
                    p1, p2 = pts[i], pts[i + 1]
                    u = get_or_create_node(p1[0], p1[1])
                    v = get_or_create_node(p2[0], p2[1])
                    if u != v:
                        dist_km = math.sqrt((p2[0] - p1[0])**2 + (p2[1] - p1[1])**2) * 111.0
                        graph_nodes[u]["adj"].append({"target": v, "distKm": round(dist_km, 3), "speed": speed})
                        graph_nodes[v]["adj"].append({"target": u, "distKm": round(dist_km, 3), "speed": speed})

    graph_data = {
        "nodes": list(graph_nodes.values()),
        "totalNodes": len(graph_nodes),
        "totalFeatures": len(road_features)
    }
    return road_features, graph_data


def extract_landmarks(conn: sqlite3.Connection, mapbox_vector_tile) -> List[Dict[str, Any]]:
    """Extract curated landmarks from poi and place layers where valid name exists."""
    print("Extracting curated landmarks (Transit hubs, universities, hospitals, monuments)...")
    cur = conn.cursor()
    cur.execute("SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles WHERE zoom_level IN (12, 14);")
    
    landmarks = []
    seen_names = set()
    
    for z, x, y_tms, raw_data in cur.fetchall():
        y_xyz = (2**z - 1) - y_tms
        data = gzip.decompress(raw_data) if (len(raw_data) >= 2 and raw_data[0] == 0x1F and raw_data[1] == 0x8B) else raw_data
        try:
            decoded = mapbox_vector_tile.decode(data)
        except Exception:
            continue
            
        poi_layer = decoded.get("poi")
        if not poi_layer:
            continue
        extent = poi_layer.get("extent", 4096)
        
        for feat in poi_layer.get("features", []):
            props = feat.get("properties", {})
            p_class = props.get("class")
            name = props.get("name:latin") or props.get("name") or props.get("name:en")
            if not name or not p_class or p_class not in APPROVED_POI_CLASSES:
                continue
                
            clean_name = name.strip()
            if len(clean_name) < 3 or clean_name in seen_names:
                continue
            seen_names.add(clean_name)
            
            geom = feat.get("geometry", {})
            if geom.get("type") == "Point":
                coords = geom.get("coordinates", [0, 0])
                lon, lat = tile_to_wgs84(coords[0], coords[1], z, x, y_xyz, extent)
                
                if 24.0 <= lon <= 36.0 and 22.0 <= lat <= 32.0:
                    landmarks.append({
                        "id": f"poi_{len(landmarks)+1}",
                        "name": clean_name,
                        "nameAr": props.get("name:ar", clean_name),
                        "category": p_class,
                        "subclass": props.get("subclass", ""),
                        "lat": lat,
                        "lng": lon
                    })
    return landmarks


def build_simplifier():
    """Create Douglas-Peucker simplifier using shapely."""
    from shapely.geometry import shape, mapping
    def simplify(geom_dict: Dict[str, Any], tol: float) -> Dict[str, Any]:
        try:
            s = shape(geom_dict)
            return mapping(s.simplify(tol, preserve_topology=True))
        except Exception:
            return geom_dict
    return simplify


def main():
    """Execute full demo map vector extraction and synchronization."""
    print("=" * 60)
    print("Starting Offline Demo Map Vector Extraction")
    print(f"Source (READ-ONLY): {MBTILES_PATH}")
    print(f"Target Output: {OUTPUT_DIR}")
    print("=" * 60)
    
    import mapbox_vector_tile
    simplify_fn = build_simplifier()
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(ADMIN_DATA_DIR, exist_ok=True)
    os.makedirs(MOBILE_DATA_DIR, exist_ok=True)
    
    conn = open_mbtiles_readonly(MBTILES_PATH)
    try:
        water_features = extract_water_features(conn, mapbox_vector_tile, simplify_fn)
        water_geojson = {"type": "FeatureCollection", "features": water_features}
        water_file = os.path.join(OUTPUT_DIR, "egypt_nile_water.json")
        with open(water_file, "w", encoding="utf-8") as f:
            json.dump(water_geojson, f, separators=(",", ":"))
        print(f"✓ Saved {len(water_features)} water features -> {water_file} ({os.path.getsize(water_file)/1024:.1f} KB)")
        
        road_features, road_graph = extract_road_network(conn, mapbox_vector_tile, simplify_fn)
        road_geojson = {"type": "FeatureCollection", "features": road_features}
        road_file = os.path.join(OUTPUT_DIR, "egypt_transit_roads.json")
        with open(road_file, "w", encoding="utf-8") as f:
            json.dump(road_geojson, f, separators=(",", ":"))
        print(f"✓ Saved {len(road_features)} road features -> {road_file} ({os.path.getsize(road_file)/1024:.1f} KB)")
        
        graph_file = os.path.join(OUTPUT_DIR, "egypt_road_graph.json")
        with open(graph_file, "w", encoding="utf-8") as f:
            json.dump(road_graph, f, separators=(",", ":"))
        print(f"✓ Saved road graph with {road_graph['totalNodes']} nodes -> {graph_file} ({os.path.getsize(graph_file)/1024:.1f} KB)")
        
        landmarks = extract_landmarks(conn, mapbox_vector_tile)
        landmark_file = os.path.join(OUTPUT_DIR, "egypt_landmarks.json")
        with open(landmark_file, "w", encoding="utf-8") as f:
            json.dump(landmarks, f, ensure_ascii=False, indent=2)
        print(f"✓ Saved {len(landmarks)} curated landmarks -> {landmark_file} ({os.path.getsize(landmark_file)/1024:.1f} KB)")
        
        for filename in ("egypt_nile_water.json", "egypt_transit_roads.json", "egypt_road_graph.json", "egypt_landmarks.json"):
            src = os.path.join(OUTPUT_DIR, filename)
            shutil.copyfile(src, os.path.join(ADMIN_DATA_DIR, filename))
            shutil.copyfile(src, os.path.join(MOBILE_DATA_DIR, filename))
        print("✓ Successfully synchronized extracted assets to Admin and Mobile projects!")
        
    finally:
        conn.close()
        print("Master MBTiles connection safely closed.")
    print("=" * 60)


if __name__ == "__main__":
    main()
