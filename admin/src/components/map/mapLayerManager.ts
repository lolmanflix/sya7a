/**
 * @file mapLayerManager.ts
 * @description Manages cartographic base tile layers for Leaflet maps in Wasalt Admin Portal.
 * Uses reliable OpenStreetMap (OSM) and CartoDB Dark Matter raster tile layers with
 * instantaneous rendering, zero WebGL worker dependencies, and smooth transitions.
 */

import L from 'leaflet';

export type MapTheme = 'dark' | 'clean' | 'osm';

const OSM_STANDARD_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const CARTO_DARK_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png';

const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';
const CARTO_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>';

/**
 * Attaches the selected OpenStreetMap raster base layer to a Leaflet map instance.
 * @param map - Leaflet map instance.
 * @param theme - Selected map theme ('dark' | 'clean' | 'osm').
 * @returns Cleanup function to detach the tile layer on theme change or unmount.
 */
export function attachMapBaseTheme(map: L.Map, theme: MapTheme): () => void {
  const container = map.getContainer();

  // Set container background matching tile palette to prevent flashes during loading
  const isDark = theme === 'dark';
  container.style.backgroundColor = isDark ? '#090d16' : '#f8fafc';

  const tileUrl = isDark ? CARTO_DARK_URL : OSM_STANDARD_URL;
  const attribution = isDark ? CARTO_ATTRIBUTION : OSM_ATTRIBUTION;

  const tileLayer = L.tileLayer(tileUrl, {
    attribution,
    maxZoom: 19,
    subdomains: isDark ? 'abcd' : '',
  }).addTo(map);

  return () => {
    try {
      tileLayer.remove();
    } catch (err) {
      console.warn('[MapLayerManager] Layer removal warning:', err);
    }
  };
}
