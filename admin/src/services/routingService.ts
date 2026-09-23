/**
 * @file routingService.ts
 * @description In-app client-side routing service for Wasalt Admin Panel.
 * Computes road-following driving geometries, distances, and durations offline
 * using the embedded local routing engine with zero external API dependencies.
 */

import { computeLocalRoadRoute, RouteWaypoint, LocalRouteResult } from './localRoutingEngine';

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

// In-memory cache for computed road paths to avoid redundant calculations
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
 * Computes road-following route coordinates between two or more stops using the embedded local routing engine.
 * Completely offline with zero external cloud dependencies.
 * Supports passing either an array of WaypointCoord or traditional (startLat, startLng, endLat, endLng).
 * @param startLatOrWaypoints - Starting latitude or array of waypoints.
 * @param startLng - Optional starting longitude.
 * @param endLat - Optional ending latitude.
 * @param endLng - Optional ending longitude.
 * @returns Computed route geometry, distance, and duration.
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

  // If fewer than 2 valid waypoints, return minimal coordinate pair
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

  // Compute road geometry via local embedded routing engine
  const localResult: LocalRouteResult = computeLocalRoadRoute(waypoints as RouteWaypoint[]);

  const result: RouteGeometryResult = {
    coordinates: localResult.coordinates,
    distanceKm: localResult.distanceKm,
    durationMin: localResult.durationMin,
    isFallback: localResult.isFallback,
  };

  routeCache.set(key, result);
  return result;
}
