/**
 * @file mapLayerManager.ts
 * @description Manages cartographic base tile layers and themes for Leaflet maps.
 * Supports CartoDB Dark Matter (operations dark mode), CartoDB Voyager (clean transit),
 * and an offline vector fallback mode.
 */

import L from 'leaflet';
import { attachOfflineVectorBaseMap } from './offlineMapLayer';

export type MapTheme = 'dark' | 'clean' | 'offline';

const CARTO_DARK_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png';
const CARTO_VOYAGER_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

/**
 * Attaches the selected cartographic base layer to a Leaflet map instance.
 * @param map - Leaflet map instance.
 * @param theme - Selected map theme ('dark' | 'clean' | 'offline').
 * @returns Cleanup function to remove base layer on theme change or unmount.
 */
export function attachMapBaseTheme(map: L.Map, theme: MapTheme): () => void {
  const container = map.getContainer();

  if (theme === 'offline') {
    container.style.backgroundColor = '#0b132b';
    return attachOfflineVectorBaseMap(map);
  }

  // Set background matching the tile theme to prevent flash during tile load
  container.style.backgroundColor = theme === 'dark' ? '#090d16' : '#f8fafc';

  const tileUrl = theme === 'dark' ? CARTO_DARK_URL : CARTO_VOYAGER_URL;
  const tileLayer = L.tileLayer(tileUrl, {
    attribution: ATTRIBUTION,
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);

  return () => {
    tileLayer.remove();
  };
}
