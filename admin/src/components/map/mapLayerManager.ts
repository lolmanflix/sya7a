/**
 * @file mapLayerManager.ts
 * @description Attaches the OpenFreeMap vector base layer (MapLibre GL rendered through
 * Leaflet via @maplibre/maplibre-gl-leaflet) to admin Leaflet maps, and owns runtime
 * light/dark style switching for every registered map. Failures (no WebGL, offline,
 * blocked worker) degrade to a visible empty base map with a single toast warning.
 */

import L from 'leaflet';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import { toast } from 'sonner';
import { ensureMapLibreWorker } from '../../utils/mapLibreWorker';
import {
  ATTRIBUTION,
  MapStyleMode,
  getStoredMapStyle,
  storeMapStyle,
  styleUrlForMode,
} from '../../config/openFreeMap';

/** Container background matching each style palette (prevents white/dark flashes while tiles load). */
const CONTAINER_BACKGROUND: Record<MapStyleMode, string> = {
  dark: '#090d16',
  light: '#f8fafc',
};

interface BaseLayerEntry {
  mode: MapStyleMode;
  dispose: () => void;
}

/** Maps currently holding a base layer, so `setMapStyle` can swap styles at runtime. */
const activeLayers = new Map<L.Map, BaseLayerEntry>();

/**
 * Paints the Leaflet container background to match the active style palette.
 * @param map - Leaflet map instance.
 * @param mode - Active style mode.
 */
function paintContainer(map: L.Map, mode: MapStyleMode): void {
  try {
    map.getContainer().style.backgroundColor = CONTAINER_BACKGROUND[mode];
  } catch (err) {
    console.warn('[MapLayerManager] Could not paint map container background:', err);
  }
}

/**
 * Force-deregisters a half-added layer when Leaflet's own removal path fails
 * (MapLibre constructor can throw before its GL map exists, leaving the layer
 * registered with `getEvents` handlers still bound).
 * @param map - Leaflet map instance.
 * @param layer - Layer that failed to finish adding.
 */
function forceDeregisterLayer(map: L.Map, layer: L.Layer): void {
  try {
    const handlerSource = layer as { getEvents?: () => L.LeafletEventHandlerFnMap };
    if (typeof handlerSource.getEvents === 'function') {
      const events = handlerSource.getEvents();
      Object.entries(events).forEach(([type, handler]) => {
        map.off(type, handler as L.LeafletEventHandlerFn, layer);
      });
    }
    delete (map as unknown as { _layers: Record<number, unknown> })._layers[L.Util.stamp(layer)];
    (layer as unknown as { _map?: L.Map | null })._map = null;
  } catch (err) {
    console.warn('[MapLayerManager] Forced layer deregistration failed:', err);
  }
}

/**
 * Removes a MapLibre-GL-Leaflet layer without ever throwing.
 * @param map - Leaflet map instance.
 * @param layer - Layer to remove.
 */
function detachLayerSafely(map: L.Map, layer: L.Layer): void {
  try {
    if (map.hasLayer(layer)) layer.remove();
  } catch (err) {
    console.warn('[MapLayerManager] Graceful layer removal failed, forcing deregistration:', err);
    forceDeregisterLayer(map, layer);
  }
}

/**
 * Creates and adds the OpenFreeMap vector base layer, wiring resilience handlers.
 * @param map - Leaflet map instance.
 * @param mode - Style mode to render.
 * @returns Entry whose `dispose` removes the layer (idempotent, never throws).
 */
function attachLayer(map: L.Map, mode: MapStyleMode): BaseLayerEntry {
  ensureMapLibreWorker();
  paintContainer(map, mode);

  let disposed = false;
  let layer: L.Layer | null = null;
  let warned = false;
  const warnOnce = (message: string) => {
    if (warned) return;
    warned = true;
    console.warn(`[MapLayerManager] ${message}`);
    toast.warning('Base map unavailable', { description: message, duration: 6000 });
  };

  try {
    const glLayer = maplibreGL({
      style: styleUrlForMode(mode),
      attributionControl: { customAttribution: ATTRIBUTION },
    });
    layer = glLayer;
    glLayer.addTo(map);

    try {
      const glMap = glLayer.getMaplibreMap();
      glMap?.on('error', (event: { error?: { message?: string } }) => {
        warnOnce(
          `Vector tiles or style could not be loaded (${event?.error?.message ?? 'network/WebGL error'}). The base map is empty until connectivity or WebGL recovers.`,
        );
      });
      glMap?.on('webglcontextlost', () => {
        warnOnce('WebGL context was lost. The base map is empty until the context is restored.');
      });
    } catch (err) {
      console.warn('[MapLayerManager] Could not bind MapLibre error handlers:', err);
    }
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    warnOnce(`MapLibre GL failed to initialize (${reason}). Showing an empty base map.`);
    if (layer) {
      detachLayerSafely(map, layer);
      layer = null;
    }
  }

  return {
    mode,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      if (layer) detachLayerSafely(map, layer);
    },
  };
}

/**
 * Attaches the OpenFreeMap vector base layer to a Leaflet map instance.
 * @param map - Leaflet map instance.
 * @param mode - Optional mode override; defaults to the persisted preference.
 * @returns Cleanup function that detaches the layer on unmount/theme change.
 */
export function attachMapBaseStyle(map: L.Map, mode?: MapStyleMode): () => void {
  const entry = attachLayer(map, mode ?? getStoredMapStyle());
  activeLayers.set(map, entry);
  return () => {
    // Also dispose a newer entry in case setMapStyle() swapped styles after attachment.
    const current = activeLayers.get(map);
    if (current) {
      activeLayers.delete(map);
      current.dispose();
    }
    entry.dispose();
  };
}

/**
 * Switches the base style on every registered map and persists the preference.
 * Re-adds the MapLibre layer per map with the new style; individual failures are
 * isolated so one broken map cannot prevent the rest from switching.
 * @param mode - 'light' (Positron) or 'dark' (OpenFreeMap Dark).
 */
export function setMapStyle(mode: MapStyleMode): void {
  storeMapStyle(mode);
  for (const [map, entry] of Array.from(activeLayers.entries())) {
    try {
      entry.dispose();
      const next = attachLayer(map, mode);
      activeLayers.set(map, next);
    } catch (err) {
      console.warn('[MapLayerManager] Failed to switch base style for one map:', err);
    }
  }
}
