/**
 * @file mapConfig.ts
 * @description Centralized OpenFreeMap configuration for the commuter mobile map.
 * Every tile endpoint, style URL, attribution string and pinned CDN asset used by
 * WebView map HTML is declared here. No other module may hardcode map URLs.
 *
 * Tiles come exclusively from the public OpenFreeMap instance
 * (https://openfreemap.org/) — no OSM raster tiles and no local/self-hosted
 * tile servers. Offline routing keeps using localRoutingEngine.ts and is
 * intentionally not configured here.
 */

/** Supported map theme modes; mirrored from ThemeContext ('light' | 'dark'). */
export type MapThemeMode = 'light' | 'dark';

/**
 * Default Egyptian transit coordinates and bounds.
 */
export const DEFAULT_MAP_CENTER = {
  latitude: 30.0444,
  longitude: 31.2357,
  zoom: 12,
};

/**
 * OpenFreeMap planet vector tiles (Mapbox Vector Tiles, OpenMapTiles schema).
 * Styles fetched below reference this endpoint internally; exported so any
 * consumer needing raw MVT tiles never hardcodes the URL.
 */
export const OFM_TILE_URL_TEMPLATE = 'https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf';

/**
 * Official OpenFreeMap default style (declared in the Quick Start Guide:
 * https://openfreemap.org/quick_start/). Warm, light basemap — used for light mode.
 */
export const OFM_STYLE_LIGHT = 'https://tiles.openfreemap.org/styles/liberty';

/** OpenFreeMap dark style — used for dark mode. */
export const OFM_STYLE_DARK = 'https://tiles.openfreemap.org/styles/dark';

/** Style URL lookup keyed by map theme mode. */
export const OFM_STYLES: Record<MapThemeMode, string> = {
  light: OFM_STYLE_LIGHT,
  dark: OFM_STYLE_DARK,
};

/**
 * Attribution required by OpenFreeMap / OpenMapTiles / OpenStreetMap.
 * Rendered through Leaflet's attribution control (glue layer passes it through).
 */
export const MAP_ATTRIBUTION = '© OpenMapTiles © OpenStreetMap contributors';

/**
 * Pinned CDN assets for the WebView map document (Leaflet + MapLibre GL + glue).
 * Versions are pinned so a CDN "latest" bump cannot silently break the page.
 */
export const MAP_CDN = {
  leafletCss: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  leafletJs: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  maplibreGlCss: 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css',
  maplibreGlJs: 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js',
  maplibreGlLeafletJs: 'https://unpkg.com/@maplibre/maplibre-gl-leaflet@0.1.4/dist/leaflet-maplibre-gl.js',
} as const;

/**
 * Resolves the OpenFreeMap style URL for the requested map theme mode.
 * Defaults to the light style for unknown/absent values.
 *
 * @param mode - Live theme mode ('light' | 'dark').
 * @returns Absolute OpenFreeMap style URL.
 */
export function resolveMapStyleUrl(mode?: MapThemeMode | null): string {
  return mode === 'dark' ? OFM_STYLE_DARK : OFM_STYLE_LIGHT;
}
