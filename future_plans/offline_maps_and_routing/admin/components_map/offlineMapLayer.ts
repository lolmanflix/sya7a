/**
 * @file offlineMapLayer.ts
 * @description Attaches high-performance, 100% offline vector base map layers (River Nile, coastlines,
 * and Egyptian transit road network) directly to any Leaflet map instance.
 * Eliminates all external tile server network requests.
 */

import L from 'leaflet';

interface RoadProperties {
  c?: string; // class
  s?: number; // speed
}

let cachedWaterGeoJson: GeoJSON.FeatureCollection | null = null;
let cachedRoadsGeoJson: GeoJSON.FeatureCollection | null = null;

/**
 * Preloads vector map assets in background to ensure instantaneous rendering.
 */
export async function preloadOfflineMapAssets(): Promise<void> {
  try {
    if (!cachedWaterGeoJson) {
      const res = await fetch('/data/egypt_nile_water.json');
      if (res.ok) cachedWaterGeoJson = await res.json();
    }
    if (!cachedRoadsGeoJson) {
      const res = await fetch('/data/egypt_transit_roads.json');
      if (res.ok) cachedRoadsGeoJson = await res.json();
    }
  } catch (err) {
    console.warn('[OfflineMap] Asset preload warning:', err);
  }
}

/**
 * Attaches offline vector base map layers to a Leaflet map.
 * @param map - Leaflet map instance.
 * @returns Clean-up function to remove layers when map unmounts.
 */
export function attachOfflineVectorBaseMap(map: L.Map): () => void {
  // Apply a clean, modern base styling to map container
  const container = map.getContainer();
  container.style.backgroundColor = '#f1f5f9';

  const vectorGroup = L.layerGroup().addTo(map);

  // 1. Render Water Layer (River Nile & Waterbodies)
  const renderWater = (geojson: GeoJSON.FeatureCollection) => {
    L.geoJSON(geojson, {
      style: {
        color: '#0284c7',
        weight: 1.5,
        fillColor: '#38bdf8',
        fillOpacity: 0.35,
      },
    }).addTo(vectorGroup);
  };

  if (cachedWaterGeoJson) {
    renderWater(cachedWaterGeoJson);
  } else {
    fetch('/data/egypt_nile_water.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          cachedWaterGeoJson = data;
          renderWater(data);
        }
      })
      .catch((e) => console.warn('[OfflineMap] Water layer load error:', e));
  }

  // 2. Render Road Network Layer (Arteries, Ring Road, Corridors)
  const renderRoads = (geojson: GeoJSON.FeatureCollection) => {
    L.geoJSON(geojson, {
      style: (feature) => {
        const props = (feature?.properties || {}) as RoadProperties;
        const cls = props.c || 'primary';
        if (cls === 'motorway' || cls === 'trunk') {
          return { color: '#f59e0b', weight: 2.5, opacity: 0.85 };
        }
        if (cls === 'primary') {
          return { color: '#94a3b8', weight: 1.8, opacity: 0.75 };
        }
        return { color: '#cbd5e1', weight: 1.2, opacity: 0.65 };
      },
    }).addTo(vectorGroup);
  };

  if (cachedRoadsGeoJson) {
    renderRoads(cachedRoadsGeoJson);
  } else {
    fetch('/data/egypt_transit_roads.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          cachedRoadsGeoJson = data;
          renderRoads(data);
        }
      })
      .catch((e) => console.warn('[OfflineMap] Roads layer load error:', e));
  }

  return () => {
    vectorGroup.remove();
  };
}
