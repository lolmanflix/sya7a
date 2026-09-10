/**
 * Routing Service for Wasalt Admin Panel
 * Uses the Project-OSRM public routing engine to calculate road-following driving geometries
 * with in-memory caching and fallback straight-line polylines.
 */

export interface RouteGeometryResult {
  coordinates: [number, number][];
  distanceKm: number;
  durationMin: number;
  isFallback: boolean;
}

// In-memory cache for computed road paths to avoid redundant network calls
const routeCache = new Map<string, RouteGeometryResult>();

/**
 * Builds a deterministic cache key from lat/lng endpoints.
 */
function buildKey(startLat: number, startLng: number, endLat: number, endLng: number): string {
  return `${startLat.toFixed(5)},${startLng.toFixed(5)}->${endLat.toFixed(5)},${endLng.toFixed(5)}`;
}

/**
 * Calculates haversine distance in km as fallback.
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Fetches road-following route coordinates between two points using OSRM driving engine.
 * Falls back to straight line if offline or endpoint is unresponsive.
 */
export async function fetchRoadRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<RouteGeometryResult> {
  const key = buildKey(startLat, startLng, endLat, endLng);
  if (routeCache.has(key)) {
    return routeCache.get(key)!;
  }

  // Fallback straight-line result
  const straightDist = haversineDistance(startLat, startLng, endLat, endLng);
  const fallbackResult: RouteGeometryResult = {
    coordinates: [
      [startLat, startLng],
      [endLat, endLng],
    ],
    distanceKm: Math.round(straightDist * 10) / 10,
    durationMin: Math.round((straightDist / 30) * 60), // estimated 30km/h average bus speed
    isFallback: true,
  };

  if (!startLat || !startLng || !endLat || !endLng) {
    return fallbackResult;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    // OSRM expects {startLng},{startLat};{endLng},{endLat}
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      routeCache.set(key, fallbackResult);
      return fallbackResult;
    }

    const data = await response.json();
    if (data.routes && data.routes[0] && data.routes[0].geometry) {
      // OSRM returns coordinates in [lng, lat] format; Leaflet expects [lat, lng]
      const rawCoords: [number, number][] = data.routes[0].geometry.coordinates;
      const latLngs: [number, number][] = rawCoords.map((pt) => [pt[1], pt[0]]);
      const distanceKm = Math.round((data.routes[0].distance / 1000) * 10) / 10;
      const durationMin = Math.round(data.routes[0].duration / 60);

      const result: RouteGeometryResult = {
        coordinates: latLngs,
        distanceKm,
        durationMin,
        isFallback: false,
      };

      routeCache.set(key, result);
      return result;
    }
  } catch (err) {
    console.warn('OSRM routing fetch failed, using straight-line fallback:', err);
  }

  routeCache.set(key, fallbackResult);
  return fallbackResult;
}
