/**
 * @file openFreeMap.ts
 * @description Single source of truth for OpenFreeMap vector tile/style URLs, attribution,
 * and light/dark base-style persistence. No other admin module may hardcode map URLs.
 *
 * Style choice: OpenFreeMap's Quick Start canonically demonstrates `liberty`, which we use
 * as the light/default style (kept identical to the mobile app); `dark` is the dark-mode option.
 */

/** Base layer mode: 'light' = Liberty (default), 'dark' = OpenFreeMap Dark. */
export type MapStyleMode = 'light' | 'dark';

/** OpenFreeMap vector tile endpoint (Planet PBF). Styles reference this server themselves. */
export const TILE_URL = 'https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf';

/** Default OpenFreeMap light style (Liberty — the style OFM's Quick Start demonstrates). */
export const STYLE_LIGHT_URL = 'https://tiles.openfreemap.org/styles/liberty';

/** OpenFreeMap dark style for the admin dark-slate theme. */
export const STYLE_DARK_URL = 'https://tiles.openfreemap.org/styles/dark';

/** Attribution required by OpenFreeMap: "© OpenMapTiles © OpenStreetMap contributors". */
export const ATTRIBUTION =
  '&copy; <a href="https://www.openmaptiles.org/copyright" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

/** localStorage key for the persisted base-style preference. */
export const MAP_STYLE_STORAGE_KEY = 'wasalt_map_style';

/** Window event dispatched whenever the persisted style changes (cross-component sync). */
export const MAP_STYLE_CHANGE_EVENT = 'wasalt:map-style-change';

/**
 * Resolves the MapLibre style URL for a mode.
 * @param mode - 'light' or 'dark'.
 * @returns Absolute style URL served by OpenFreeMap.
 */
export function styleUrlForMode(mode: MapStyleMode): string {
  return mode === 'dark' ? STYLE_DARK_URL : STYLE_LIGHT_URL;
}

/**
 * Reads the persisted base-style preference.
 * @returns Stored mode, or 'light' when unset/unreadable (localStorage can throw in file:// contexts).
 */
export function getStoredMapStyle(): MapStyleMode {
  try {
    const value = window.localStorage.getItem(MAP_STYLE_STORAGE_KEY);
    return value === 'dark' ? 'dark' : 'light';
  } catch (err) {
    console.warn('[OpenFreeMap] Could not read stored map style, defaulting to light:', err);
    return 'light';
  }
}

/**
 * Persists the base-style preference and notifies subscribers.
 * @param mode - 'light' or 'dark'.
 * @returns True when persistence succeeded, false when storage was unavailable.
 */
export function storeMapStyle(mode: MapStyleMode): boolean {
  let persisted = true;
  try {
    window.localStorage.setItem(MAP_STYLE_STORAGE_KEY, mode);
  } catch (err) {
    persisted = false;
    console.warn('[OpenFreeMap] Could not persist map style preference:', err);
  }
  try {
    window.dispatchEvent(new CustomEvent<MapStyleMode>(MAP_STYLE_CHANGE_EVENT, { detail: mode }));
  } catch (err) {
    console.warn('[OpenFreeMap] Could not broadcast map style change:', err);
  }
  return persisted;
}

/**
 * Subscribes to base-style changes (from this or other tabs/components).
 * @param listener - Called with the new mode on every change.
 * @returns Unsubscribe function.
 */
export function subscribeMapStyle(listener: (mode: MapStyleMode) => void): () => void {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<MapStyleMode>).detail;
    if (detail === 'light' || detail === 'dark') listener(detail);
  };
  window.addEventListener(MAP_STYLE_CHANGE_EVENT, handler);
  return () => window.removeEventListener(MAP_STYLE_CHANGE_EVENT, handler);
}
