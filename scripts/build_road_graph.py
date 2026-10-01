#!/usr/bin/env python3
"""
build_road_graph.py
Extracts high-fidelity road network from /home/kimo/Storage/datasets/map.mbtiles.
Preserves road curve geometry on edges with 10m quantization.
Eliminates artificial diagonal shortcuts across city blocks.
"""

import os
import sys
import gzip
import math
import json
import sqlite3
from typing import Dict, List, Tuple, Any

MBTILES_PATH = "/home/kimo/Storage/datasets/map.mbtiles"
ADMIN_OUT = os.path.abspath("admin/public/data/egypt_road_graph.json")
MOBILE_OUT = os.path.abspath("mobile/assets/data/egypt_road_graph.json")
DATA_OUT = os.path.abspath("data/demo_map/egypt_road_graph.json")

def deg2num(lat_deg: float, lon_deg: float, zoom: int) -> Tuple[int, int]:
    lat_rad = math.radians(lat_deg)
    n = 2.0 ** zoom
    xtile = int((lon_deg + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
    return xtile, ytile

def tile_to_wgs84(px: float, py: float, z: int, x: int, y_xyz: int, extent: int = 4096) -> Tuple[float, float]:
    n = 2.0 ** z
    lon = (x + (px / extent)) / n * 360.0 - 180.0
    y_unit = y_xyz + (py / extent)
    lat_rad = math.atan(math.sinh(math.pi * (1.0 - 2.0 * y_unit / n)))
    lat = math.degrees(lat_rad)
    return round(lat, 4), round(lon, 4)

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    return 2 * R * math.asin(math.sqrt(a))

def main():
    import mapbox_vector_tile
    import networkx as nx

    print("Opening MBTiles in read-only mode...")
    conn = sqlite3.connect(f"file:{os.path.abspath(MBTILES_PATH)}?mode=ro", uri=True)
    cur = conn.cursor()

    TERMINALS = [
        (30.0444, 31.2357), # Tahrir Square
        (30.0345, 31.3588), # ECU Campus Nasr City
        (30.0626, 31.2497), # Ramses Railway Station
        (30.0131, 31.2089), # Giza Station
        (30.0263, 31.2114), # Cairo University
        (30.0760, 31.3250), # Heliopolis / Korba
        (30.1450, 31.3280), # Cairo Airport Terminal
        (30.0167, 31.4333), # New Cairo / 5th Settlement
        (30.0074, 31.4913), # AUC New Cairo
        (30.0710, 31.0210), # 6th of October City
    ]

    print("Fetching Greater Cairo & Egypt tiles...")
    z13 = 13
    x1, y2 = deg2num(29.85, 31.10, z13)
    x2, y1 = deg2num(30.22, 31.50, z13)
    tms_min = (2**z13 - 1) - y2
    tms_max = (2**z13 - 1) - y1

    cur.execute(f"""
        SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles
        WHERE zoom_level = 13
        AND tile_column BETWEEN {x1} AND {x2}
        AND tile_row BETWEEN {tms_min} AND {tms_max}
    """)
    cairo_tiles = cur.fetchall()
    print(f"Loaded {len(cairo_tiles)} Cairo tiles at zoom 13.")

    cur.execute("""
        SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles
        WHERE zoom_level = 10
    """)
    national_tiles = cur.fetchall()
    print(f"Loaded {len(national_tiles)} Egypt national tiles at zoom 10.")

    all_tiles = cairo_tiles + national_tiles
    print(f"Total tiles to process: {len(all_tiles)}")

    G = nx.Graph()
    ALLOWED_ARTERIAL = {"motorway", "trunk", "primary", "secondary", "tertiary"}

    processed_tiles = 0
    for z, col, row_tms, raw in all_tiles:
        processed_tiles += 1
        if processed_tiles % 200 == 0:
            print(f"  Processed {processed_tiles}/{len(all_tiles)} tiles...")

        y_xyz = (2**z - 1) - row_tms
        data = gzip.decompress(raw) if (len(raw) >= 2 and raw[0] == 0x1F and raw[1] == 0x8B) else raw
        try:
            decoded = mapbox_vector_tile.decode(data)
        except Exception:
            continue

        trans = decoded.get("transportation")
        if not trans:
            continue

        extent = trans.get("extent", 4096)
        for feat in trans.get("features", []):
            props = feat.get("properties", {})
            cls = props.get("class", "")
            
            is_arterial = cls in ALLOWED_ARTERIAL
            is_minor = cls == "minor"
            if not is_arterial and not is_minor:
                continue

            geom = feat.get("geometry", {})
            coords = geom.get("coordinates", [])
            lines = [coords] if geom.get("type") == "LineString" else (coords if geom.get("type") == "MultiLineString" else [])

            speed = 90 if cls in ("motorway", "trunk") else (60 if cls == "primary" else (45 if cls == "secondary" else 30))

            for sub in lines:
                if len(sub) < 2:
                    continue
                pts = [tile_to_wgs84(p[0], p[1], z, col, y_xyz, extent) for p in sub]

                if is_minor:
                    near_terminal = False
                    for pt in pts:
                        for t_lat, t_lon in TERMINALS:
                            if haversine_km(pt[0], pt[1], t_lat, t_lon) < 0.6:
                                near_terminal = True
                                break
                        if near_terminal:
                            break
                    if not near_terminal:
                        continue

                for k in range(len(pts) - 1):
                    p1, p2 = pts[k], pts[k+1]
                    if p1 != p2:
                        d = haversine_km(p1[0], p1[1], p2[0], p2[1])
                        if d < 3.0:
                            if G.has_edge(p1, p2):
                                if d < G[p1][p2]["weight"]:
                                    G[p1][p2]["weight"] = d
                                    G[p1][p2]["pts"] = [p1, p2]
                            else:
                                G.add_edge(p1, p2, weight=d, speed=speed, pts=[p1, p2])

    print(f"Raw road graph built: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges.")
    
    components = sorted(nx.connected_components(G), key=len, reverse=True)
    print(f"Top component size: {len(components[0])} nodes.")
    main_G = G.subgraph(components[0]).copy()

    print("Contracting degree-2 nodes into road curve polylines...")
    deg2_nodes = [n for n in main_G.nodes() if main_G.degree(n) == 2]
    contracted = 0

    for n in deg2_nodes:
        if main_G.degree(n) != 2:
            continue
        nbrs = list(main_G.neighbors(n))
        if len(nbrs) != 2 or nbrs[0] == nbrs[1]:
            continue
        u, v = nbrs[0], nbrs[1]
        e1 = main_G[u][n]
        e2 = main_G[n][v]

        total_d = e1["weight"] + e2["weight"]
        if total_d > 0.6:
            continue

        pts1 = e1.get("pts", [u, n])
        pts2 = e2.get("pts", [n, v])
        if pts1[-1] != n:
            pts1 = list(reversed(pts1))
        if pts2[0] != n:
            pts2 = list(reversed(pts2))

        merged_pts = pts1[:-1] + pts2
        speed = min(e1.get("speed", 45), e2.get("speed", 45))

        main_G.remove_node(n)
        main_G.add_edge(u, v, weight=round(total_d, 3), speed=speed, pts=merged_pts)
        contracted += 1

    print(f"Contracted {contracted} intermediate nodes into road curves.")
    print(f"Final graph: {main_G.number_of_nodes()} nodes, {main_G.number_of_edges()} edges.")

    export_nodes = []
    for n in main_G.nodes():
        node_id = f"{n[0]:.4f},{n[1]:.4f}"
        adj = []
        for nbr in main_G.neighbors(n):
            edge_data = main_G[n][nbr]
            edge_pts = edge_data.get("pts", [n, nbr])
            if edge_pts[0] != n:
                edge_pts = list(reversed(edge_pts))
            
            formatted_pts = [[round(p[0], 5), round(p[1], 5)] for p in edge_pts]
            adj.append({
                "t": f"{nbr[0]:.4f},{nbr[1]:.4f}",
                "d": round(edge_data["weight"], 3),
                "s": edge_data.get("speed", 45),
                "pts": formatted_pts
            })

        export_nodes.append({
            "id": node_id,
            "lat": round(n[0], 5),
            "lng": round(n[1], 5),
            "adj": adj
        })

    graph_payload = {
        "nodes": export_nodes,
        "totalNodes": len(export_nodes),
        "totalEdges": main_G.number_of_edges(),
        "version": "2.0-high-fidelity-curves"
    }

    for out_path in (ADMIN_OUT, MOBILE_OUT, DATA_OUT):
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(graph_payload, f, separators=(",", ":"))
        file_size_mb = os.path.getsize(out_path) / (1024 * 1024)
        print(f"Saved {out_path} ({file_size_mb:.2f} MB)")

    print("Road graph build complete.")

if __name__ == "__main__":
    main()
