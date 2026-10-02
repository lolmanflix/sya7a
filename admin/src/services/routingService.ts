/**
 * @file routingService.ts
 * @description Online road-following routing service for Wasalt Admin Panel.
 * Uses the Project-OSRM public driving engine to compute authentic road geometries,
 * distances, and durations between waypoints with smart in-memory caching and
 * graceful straight-line fallback.
 */

export interface WaypointCoord {
  lat: number;
  lng: number;
  name?: string;
}

export interface RouteGeometryResult {
  coordinates: [number, number][];
  distanceKm: number;
  durationMin: number;
  isFallback: boolean;
}

// In-memory cache for computed road paths to avoid redundant network requests
const routeCache = new Map<string, RouteGeometryResult>();

/**
 * Builds a deterministic cache key from a list of waypoints.
 * @param waypoints - List of route waypoints.
 * @returns Serialized string key.
 */
function buildWaypointKey(waypoints: WaypointCoord[]): string {
  return waypoints.map((w) => `${w.lat.toFixed(5)},${w.lng.toFixed(5)}`).join('->');
}

/**
 * Calculates great-circle haversine distance between two coordinates in kilometers.
 * @param lat1 - Latitude of origin.
 * @param lon1 - Longitude of origin.
 * @param lat2 - Latitude of destination.
 * @param lon2 - Longitude of destination.
 * @returns Geodesic distance in kilometers.
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
 * Normalizes input arguments into a clean array of valid coordinates.
 * @param startLatOrWaypoints - Starting latitude or array of waypoints.
 * @param startLng - Optional starting longitude.
 * @param endLat - Optional ending latitude.
 * @param endLng - Optional ending longitude.
 * @returns Array of validated WaypointCoord objects.
 */
function normalizeWaypoints(
  startLatOrWaypoints: number | WaypointCoord[],
  startLng?: number,
  endLat?: number,
  endLng?: number
): WaypointCoord[] {
  if (Array.isArray(startLatOrWaypoints)) {
    return startLatOrWaypoints.filter(
      (w) => typeof w.lat === 'number' && typeof w.lng === 'number' && !isNaN(w.lat) && !isNaN(w.lng)
    );
  }
  if (
    typeof startLatOrWaypoints === 'number' &&
    typeof startLng === 'number' &&
    typeof endLat === 'number' &&
    typeof endLng === 'number'
  ) {
    return [
      { lat: startLatOrWaypoints, lng: startLng },
      { lat: endLat, lng: endLng },
    ];
  }
  return [];
}

/**
 * Computes road-following route coordinates between two or more stops using the OSRM online driving engine.
 * Supports passing either an array of WaypointCoord or traditional (startLat, startLng, endLat, endLng).
 * @param startLatOrWaypoints - Starting latitude or array of waypoints.
 * @param startLng - Optional starting longitude.
 * @param endLat - Optional ending latitude.
 * @param endLng - Optional ending longitude.
 * @returns Computed road route geometry, distance, and duration.
 */
export async function fetchRoadRoute(
  startLatOrWaypoints: number | WaypointCoord[],
  startLng?: number,
  endLat?: number,
  endLng?: number
): Promise<RouteGeometryResult> {
  const waypoints = normalizeWaypoints(startLatOrWaypoints, startLng, endLat, endLng);

  // If fewer than 2 valid waypoints, return minimal fallback
  if (waypoints.length < 2) {
    const singleCoord: [number, number] =
      waypoints.length === 1 ? [waypoints[0].lat, waypoints[0].lng] : [30.0444, 31.2357];
    return {
      coordinates: [singleCoord, singleCoord],
      distanceKm: 0,
      durationMin: 0,
      isFallback: true,
    };
  }

  const key = buildWaypointKey(waypoints);
  if (routeCache.has(key)) {
    return routeCache.get(key)!;
  }

  // Calculate cumulative straight-line distance across all sequential legs as fallback
  let totalStraightDist = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalStraightDist += haversineDistance(
      waypoints[i].lat,
      waypoints[i].lng,
      waypoints[i + 1].lat,
      waypoints[i + 1].lng
    );
  }

  const fallbackResult: RouteGeometryResult = {
    coordinates: waypoints.map((w) => [w.lat, w.lng]),
    distanceKm: Math.round(totalStraightDist * 10) / 10,
    durationMin: Math.round((totalStraightDist / 30) * 60), // estimated 30 km/h transit average
    isFallback: true,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    // OSRM coordinates param format: {lng},{lat};{lng},{lat}...
    const coordsParam = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson`;

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[RoutingService] OSRM responded with status ${response.status}. Using straight-line fallback.`);
      return fallbackResult;
    }

    const data = await response.json();
    if (data.routes && data.routes[0] && data.routes[0].geometry) {
      // OSRM returns coordinates in [lng, lat] GeoJSON format; Leaflet expects [lat, lng]
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

      // Only cache authentic road routes (never permanently cache fallbacks)
      routeCache.set(key, result);
      return result;
    }
  } catch (err) {
    console.warn('[RoutingService] OSRM routing fetch failed or timed out, using fallback:', err);
  }

  return fallbackResult;
}
