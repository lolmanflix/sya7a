/**
 * Routing Service for Wasalt Admin Panel
 * Uses the Project-OSRM public routing engine to calculate road-following driving geometries
 * with in-memory caching and fallback straight-line polylines across multiple stops.
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

// In-memory cache for computed road paths to avoid redundant network calls
const routeCache = new Map<string, RouteGeometryResult>();

/**
 * Calculates haversine distance in km between two lat/lng coordinates.
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
 * Builds a deterministic cache key from a list of waypoints.
 */
function buildWaypointKey(waypoints: WaypointCoord[]): string {
  return waypoints.map((w) => `${w.lat.toFixed(5)},${w.lng.toFixed(5)}`).join('->');
}

/**
 * Fetches road-following route coordinates between two or more stops using OSRM driving engine.
 * Supports passing either an array of WaypointCoord or traditional (startLat, startLng, endLat, endLng).
 */
export async function fetchRoadRoute(
  startLatOrWaypoints: number | WaypointCoord[],
  startLng?: number,
  endLat?: number,
  endLng?: number
): Promise<RouteGeometryResult> {
  let waypoints: WaypointCoord[] = [];

  if (Array.isArray(startLatOrWaypoints)) {
    waypoints = startLatOrWaypoints.filter(
      (w) => typeof w.lat === 'number' && typeof w.lng === 'number' && !isNaN(w.lat) && !isNaN(w.lng)
    );
  } else if (
    typeof startLatOrWaypoints === 'number' &&
    typeof startLng === 'number' &&
    typeof endLat === 'number' &&
    typeof endLng === 'number'
  ) {
    waypoints = [
      { lat: startLatOrWaypoints, lng: startLng },
      { lat: endLat, lng: endLng },
    ];
  }

  // If fewer than 2 valid waypoints, return empty/minimal fallback
  if (waypoints.length < 2) {
    const singleCoord: [number, number] = waypoints.length === 1 ? [waypoints[0].lat, waypoints[0].lng] : [30.0444, 31.2357];
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

  // Calculate cumulative straight-line distance across all sequential legs
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
    durationMin: Math.round((totalStraightDist / 30) * 60), // estimated 30km/h average bus speed
    isFallback: true,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    // OSRM expects {lng},{lat};{lng},{lat};...
    const coordsParam = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson`;

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
    console.warn('OSRM multi-stop routing fetch failed, using fallback straight-line sequence:', err);
  }

  routeCache.set(key, fallbackResult);
  return fallbackResult;
}
