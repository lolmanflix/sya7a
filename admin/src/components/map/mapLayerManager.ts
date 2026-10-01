/**
 * @file mapLayerManager.ts
 * @description Manages cartographic base vector tile layers for Leaflet maps.
 * 100% offline and local, powered directly by /home/kimo/Storage/datasets/map.mbtiles
 * via the in-process Vite tile server on /local-tiles/{z}/{x}/{y}.
 * Zero external cloud server dependencies (no OSM server requests, no CartoDB API keys).
 */

import L from 'leaflet';
import * as maplibregl from 'maplibre-gl';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createLocalVectorStyle } from './localMapStyles';

// Configure the self-hosted worker so MapLibre GL operates 100% offline without Vite bundler resolution errors
if (typeof window !== 'undefined' && typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl(`${window.location.origin}/maplibre-gl-worker.mjs`);
}

export type MapTheme = 'dark' | 'clean' | 'offline';

/**
 * Attaches the local MBTiles vector base layer to a Leaflet map instance.
 * @param map - Leaflet map instance.
 * @param theme - Selected map theme ('dark' | 'clean' | 'offline').
 * @returns Cleanup function to remove base layer on theme change or unmount.
 */
export function attachMapBaseTheme(map: L.Map, theme: MapTheme): () => void {
  const container = map.getContainer();
  const vectorTheme: 'dark' | 'clean' = theme === 'clean' ? 'clean' : 'dark';

  // Set background to prevent flash during layer loading
  container.style.backgroundColor = vectorTheme === 'dark' ? '#090d16' : '#f8fafc';

  // Ensure Leaflet animation proxy exists to prevent zoom animation null listener errors
  const mapAny = map as unknown as { _createAnimProxy?: () => void; _proxy?: HTMLElement };
  if (typeof mapAny._createAnimProxy === 'function' && !mapAny._proxy) {
    try {
      mapAny._createAnimProxy();
    } catch {
      // Graceful fallback
    }
  }

  let glLayer: L.Layer | null = null;
  try {
    const style = createLocalVectorStyle(vectorTheme);
    glLayer = maplibreGL({
      style,
      interactive: false,
    }).addTo(map);
  } catch (err) {
    console.error('[MapLayerManager] Failed to initialize local vector layer:', err);
  }

  return () => {
    if (glLayer) {
      try {
        glLayer.remove();
      } catch (removeErr) {
        console.warn('[MapLayerManager] Cleanup warning:', removeErr);
      }
    }
  };
}
