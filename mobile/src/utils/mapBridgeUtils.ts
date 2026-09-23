/**
 * @file mapBridgeUtils.ts
 * @description Injects real-time vehicle telemetry, user GPS coordinates,
 * and full multi-stop route geometries into the Leaflet WebView instance.
 */

import React from 'react';
import { WebView } from 'react-native-webview';
import { BusLocation } from '../components/map/BusDetailsSheet';

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
  const busParam = activeBus ? JSON.stringify(activeBus) : 'null';
  webViewRef.current?.injectJavaScript(`
    (function() {
      if (typeof drawFullRouteWithStops === 'function') {
        drawFullRouteWithStops(${JSON.stringify(routeDef)}, ${busParam});
      }
    })();
    true;
  `);
}
