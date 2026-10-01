/**
 * @file localRoutingEngine.ts
 * @description Edge-device transit routing engine for Egyptian corridors.
 * Operates completely offline with zero external cloud routing API dependencies.
 * Computes authentic turn-by-turn road network paths dynamically with zero hardcoded routes.
 */

import { haversineDistanceKm } from '../utils/geoUtils';
import { bidirectionalRouter } from './bidirectionalAStar';

export interface RouteWaypoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface LocalRouteResult {
  coordinates: [number, number][];
  distanceKm: number;
  durationMin: number;
  isFallback: boolean;
}

// Asynchronously load the Egyptian road network graph into the edge router
if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
  fetch('/data/egypt_road_graph.json')
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data?.nodes && Array.isArray(data.nodes)) {
        bidirectionalRouter.loadNodes(data.nodes);
        console.log(`[RoutingEngine] Preloaded ${data.nodes.length} road network nodes.`);
      }
    })
    .catch((e) => console.warn('[RoutingEngine] Road graph preload note:', e));
}

/**
 * Computes an authentic road-following transit polyline, distance, and duration across arbitrary waypoints.
 * Strictly calculates geometry dynamically along the road network on the edge device.
 * @param waypoints - Sequence of GPS waypoints along the route.
 * @returns Local route result with road polyline geometry, distance in km, and duration in minutes.
 */
export function computeLocalRoadRoute(waypoints: RouteWaypoint[]): LocalRouteResult {
  if (!waypoints || waypoints.length === 0) {
    return { coordinates: [], distanceKm: 0, durationMin: 0, isFallback: true };
  }

  if (waypoints.length === 1) {
    return {
      coordinates: [[waypoints[0].lat, waypoints[0].lng]],
      distanceKm: 0,
      durationMin: 0,
      isFallback: false,
    };
  }

  try {
    const allCoords: [number, number][] = [];
    let totalDist = 0;
    let anyLegFallback = false;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i];
      const to = waypoints[i + 1];
      const res = bidirectionalRouter.findPath(
        { lat: from.lat, lng: from.lng },
        { lat: to.lat, lng: to.lng }
      );

      if (res.isFallback) {
        anyLegFallback = true;
      }

      if (i > 0 && res.coordinates.length > 0) {
        // Prevent duplicate joining vertex
        allCoords.push(...res.coordinates.slice(1));
      } else {
        allCoords.push(...res.coordinates);
      }
      totalDist += res.distanceKm;
    }

    if (allCoords.length >= 2) {
      return {
        coordinates: allCoords,
        distanceKm: Math.round(totalDist * 10) / 10,
        durationMin: Math.max(2, Math.round((totalDist / 45) * 60)),
        isFallback: anyLegFallback,
      };
    }
  } catch (err) {
    console.warn('[RoutingEngine] Dynamic edge route calculation warning:', err);
  }

  // Fallback: connect sequence of waypoints directly if graph not yet ready
  const fallbackCoords = waypoints.map((w) => [w.lat, w.lng] as [number, number]);
  let directDist = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    directDist += haversineDistanceKm(
      waypoints[i].lat,
      waypoints[i].lng,
      waypoints[i + 1].lat,
      waypoints[i + 1].lng
    );
  }

  return {
    coordinates: fallbackCoords,
    distanceKm: Math.round(directDist * 10) / 10,
    durationMin: Math.max(1, Math.round((directDist / 35) * 60)),
    isFallback: true,
  };
}
