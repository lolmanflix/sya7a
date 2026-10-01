/**
 * @file mapBridgeUtils.ts
 * @description Injects real-time vehicle telemetry, user GPS coordinates,
 * and authentic road-following route geometries into the Leaflet WebView instance.
 */

import React from 'react';
import { WebView } from 'react-native-webview';
import { BusLocation } from '../components/map/BusDetailsSheet';
import { computeLocalRoadRoute, RouteWaypoint } from './localRoutingEngine';

/**
 * Injects updated active vehicle locations into the Leaflet map runtime.
 *
 * @param webViewRef - Reference to the active WebView component.
 * @param locations - Array of active bus location telemetry points.
 */
export function injectBusLocations(
  webViewRef: React.RefObject<WebView | null>,
  locations: BusLocation[]
): void {
  webViewRef.current?.injectJavaScript(`
    (function() {
      if (typeof updateBusLocations === 'function') {
        updateBusLocations(${JSON.stringify(locations)});
      }
    })();
    true;
  `);
}

/**
 * Injects current user GPS position into the Leaflet map runtime.
 *
 * @param webViewRef - Reference to the active WebView component.
 * @param latitude - User latitude.
 * @param longitude - User longitude.
 */
export function injectUserLocation(
  webViewRef: React.RefObject<WebView | null>,
  latitude: number,
  longitude: number
): void {
  webViewRef.current?.injectJavaScript(`
    (function() {
      if (typeof addUserLocation === 'function') {
        addUserLocation(${latitude}, ${longitude});
      }
    })();
    true;
  `);
}

/**
 * Injects direct transit polyline between commuter location and selected vehicle.
 *
 * @param webViewRef - Reference to the active WebView component.
 * @param userLat - User latitude.
 * @param userLng - User longitude.
 * @param busLat - Vehicle latitude.
 * @param busLng - Vehicle longitude.
 */
export function injectUserToBusRoute(
  webViewRef: React.RefObject<WebView | null>,
  userLat: number,
  userLng: number,
  busLat: number,
  busLng: number
): void {
  webViewRef.current?.injectJavaScript(`
    (function() {
      if (typeof drawUserToBus === 'function') {
        drawUserToBus(${userLat}, ${userLng}, ${busLat}, ${busLng});
      }
    })();
    true;
  `);
}

/**
 * Injects full route road geometry and intermediate mandatory stop waypoints.
 * Enriches route definition with authentic road network coordinates.
 *
 * @param webViewRef - Reference to the active WebView component.
 * @param routeDef - Route definition containing start, end, and stops.
 * @param activeBus - Optional active vehicle to anchor Point A dynamically.
 */
export function injectFullRouteWithStops(
  webViewRef: React.RefObject<WebView | null>,
  routeDef: any,
  activeBus?: any
): void {
  if (!routeDef) return;

  const waypoints: RouteWaypoint[] = [];
  if (Array.isArray(routeDef.stops) && routeDef.stops.length >= 2) {
    routeDef.stops.forEach((s: any) => {
      waypoints.push({ lat: Number(s.lat), lng: Number(s.lng), name: s.name });
    });
  } else {
    const startLat = activeBus?.latitude ?? routeDef.startLat;
    const startLng = activeBus?.longitude ?? routeDef.startLng;
    if (startLat && startLng) {
      waypoints.push({ lat: Number(startLat), lng: Number(startLng), name: routeDef.startPoint });
    }
    if (routeDef.endLat && routeDef.endLng) {
      waypoints.push({ lat: Number(routeDef.endLat), lng: Number(routeDef.endLng), name: routeDef.endPoint });
    }
  }

  const computed = computeLocalRoadRoute(waypoints);
  const enrichedDef = {
    ...routeDef,
    computedCoordinates: computed.coordinates,
    distanceKm: computed.distanceKm,
    durationMin: computed.durationMin,
  };

  const busParam = activeBus ? JSON.stringify(activeBus) : 'null';
  webViewRef.current?.injectJavaScript(`
    (function() {
      if (typeof drawFullRouteWithStops === 'function') {
        drawFullRouteWithStops(${JSON.stringify(enrichedDef)}, ${busParam});
      }
    })();
    true;
  `);
}
