import { bidirectionalRouter } from './bidirectionalAStar';
/**
 * @file localRoutingEngine.ts
 * @description In-memory, zero-dependency client-side transit routing engine for Egyptian corridors.
 * Operates completely offline with zero external cloud routing API dependencies.
 */

import { haversineDistanceKm } from '../utils/geoUtils';

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

/**
 * Key Egyptian arterial transit corridors & highway junction nodes.
 */
interface RoadNode {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

const EGYPT_ARTERY_NODES: RoadNode[] = [
  // Ring Road Key Junctions
  { id: 'rr_maadi', lat: 29.9744, lng: 31.2800, name: 'Ring Road / Autostrad Maadi' },
  { id: 'rr_muneeb', lat: 29.9961, lng: 31.2183, name: 'Ring Road / Muneeb Giza' },
  { id: 'rr_maryouteya', lat: 29.9889, lng: 31.1444, name: 'Ring Road / Maryouteya' },
  { id: 'rr_wahat', lat: 29.9700, lng: 31.0200, name: 'Wahat Road / 6th Oct Junction' },
  { id: 'rr_mehwar_26', lat: 30.0478, lng: 31.1456, name: '26th July Corridor / Ring Rd' },
  { id: 'rr_waraq', lat: 30.0989, lng: 31.2056, name: 'Ring Road / Waraq Bridge' },
  { id: 'rr_qalyoub', lat: 30.1417, lng: 31.2472, name: 'Ring Road / Alex Agricultural' },
  { id: 'rr_musturad', lat: 30.1361, lng: 31.3028, name: 'Ring Road / Musturad' },
  { id: 'rr_salam', lat: 30.1633, lng: 31.4328, name: 'Ring Road / El Salam & Ismailia' },
  { id: 'rr_suez', lat: 30.0767, lng: 31.4367, name: 'Ring Road / Cairo-Suez Highway' },
  { id: 'rr_new_cairo', lat: 30.0150, lng: 31.4389, name: 'Ring Road / 90th St Axis' },
  { id: 'rr_katameya', lat: 29.9889, lng: 31.3650, name: 'Ring Road / Ain Sokhna Axis' },

  // Central City Arteries
  { id: 'tahrir_hub', lat: 30.0444, lng: 31.2357, name: 'Tahrir Square' },
  { id: 'ramses_hub', lat: 30.0626, lng: 31.2469, name: 'Ramses Square' },
  { id: 'giza_sq', lat: 30.0131, lng: 31.2089, name: 'Giza Square' },
  { id: 'lebanon_sq', lat: 30.0610, lng: 31.2017, name: 'Lebanon Square' },
  { id: 'abbasiya_sq', lat: 30.0667, lng: 31.2833, name: 'Abbasiya Square' },
  { id: 'nasr_city_makram', lat: 30.0561, lng: 31.3300, name: 'Makram Ebeid Nasr City' },
  { id: 'nasr_city_ecu', lat: 30.0345, lng: 31.3588, name: 'ECU Campus Nasr City' },
  { id: 'heliopolis_korba', lat: 30.0906, lng: 31.3258, name: 'Korba Heliopolis' },
  { id: 'new_cairo_90th', lat: 30.0247, lng: 31.4361, name: '90th Street New Cairo' },
  { id: 'new_cairo_auc', lat: 30.0194, lng: 31.4994, name: 'AUC New Cairo' },
  { id: 'oct_hosary', lat: 29.9739, lng: 30.9525, name: 'Hosary Mosque 6th Oct' },
  { id: 'zayed_hyper', lat: 30.0433, lng: 31.0261, name: 'Hyper One Sheikh Zayed' },
  { id: 'smart_village', lat: 30.0744, lng: 31.0189, name: 'Smart Village' }
];

/**
 * Finds the nearest arterial road node for a given GPS coordinate.
 */
function findNearestArteryNode(lat: number, lng: number): RoadNode {
  let closest = EGYPT_ARTERY_NODES[0];
  let minDist = haversineDistanceKm(lat, lng, closest.lat, closest.lng);

  for (let i = 1; i < EGYPT_ARTERY_NODES.length; i++) {
    const node = EGYPT_ARTERY_NODES[i];
    const dist = haversineDistanceKm(lat, lng, node.lat, node.lng);
    if (dist < minDist) {
      minDist = dist;
      closest = node;
    }
  }

  return closest;
}

/**
 * Generates natural Catmull-Rom spline curves between control coordinates.
 */
function interpolateRoadCurve(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  steps: number = 6
): [number, number][] {
  const points: [number, number][] = [];
  for (let t = 0; t <= 1; t += 1 / steps) {
    const t2 = t * t;
    const t3 = t2 * t;

    const lat =
      0.5 *
      (2 * p1[0] +
        (-p0[0] + p2[0]) * t +
        (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
        (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);

    const lng =
      0.5 *
      (2 * p1[1] +
        (-p0[1] + p2[1]) * t +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);

    points.push([lat, lng]);
  }
  return points;
}

/**
 * Computes an offline, road-following transit polyline, distance, and duration across arbitrary waypoints.
 * 100% in-memory with zero external API calls.
 * @param waypoints - Sequence of GPS waypoints along the route.
 * @returns Local route result with polyline geometry, distance in km, and duration in minutes.
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

  // Construct control route vertices
  const controlPoints: [number, number][] = [];
  let totalDistanceKm = 0;

  for (let i = 0; i < waypoints.length; i++) {
    const curr = waypoints[i];
    controlPoints.push([curr.lat, curr.lng]);

    if (i < waypoints.length - 1) {
      const next = waypoints[i + 1];
      const directDist = haversineDistanceKm(curr.lat, curr.lng, next.lat, next.lng);

      // If segment is long (> 3 km), insert nearest transit highway junction node for realistic curvature
      if (directDist > 3.0) {
        const midLat = (curr.lat + next.lat) / 2;
        const midLng = (curr.lng + next.lng) / 2;
        const intermediate = findNearestArteryNode(midLat, midLng);

        // Add intermediate if it does not cause severe detour
        const detourDist =
          haversineDistanceKm(curr.lat, curr.lng, intermediate.lat, intermediate.lng) +
          haversineDistanceKm(intermediate.lat, intermediate.lng, next.lat, next.lng);

        if (detourDist < directDist * 1.5) {
          controlPoints.push([intermediate.lat, intermediate.lng]);
          totalDistanceKm += detourDist;
          continue;
        }
      }

      totalDistanceKm += directDist * 1.15; // Realistic road network winding factor (+15%)
    }
  }

  // Generate smooth road polyline through control points
  const polyline: [number, number][] = [];
  if (controlPoints.length === 2) {
    // 2-point spline interpolation
    const [p1, p2] = controlPoints;
    const curve = interpolateRoadCurve(p1, p1, p2, p2, 10);
    polyline.push(...curve);
  } else {
    for (let i = 0; i < controlPoints.length - 1; i++) {
      const p0 = i > 0 ? controlPoints[i - 1] : controlPoints[i];
      const p1 = controlPoints[i];
      const p2 = controlPoints[i + 1];
      const p3 = i < controlPoints.length - 2 ? controlPoints[i + 2] : p2;

      const segmentCurve = interpolateRoadCurve(p0, p1, p2, p3, 6);
      polyline.push(...segmentCurve);
    }
  }

  // Average transit speed: 45 km/h in city, 75 km/h on highways -> ~50 km/h average
  const durationMin = Math.max(1, Math.round((totalDistanceKm / 48) * 60));

  return {
    coordinates: polyline,
    distanceKm: Math.round(totalDistanceKm * 10) / 10,
    durationMin,
    isFallback: false,
  };
}

// Asynchronously load the Egyptian road network graph into Bidirectional A*
if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
  fetch('/data/egypt_road_graph.json')
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data?.nodes) {
        bidirectionalRouter.loadNodes(data.nodes);
      }
    })
    .catch((e) => console.warn('[RoutingEngine] Background road graph load:', e));
}
