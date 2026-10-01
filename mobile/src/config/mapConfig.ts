/**
 * @file mapConfig.ts
 * @description Centralized configuration for commuter mobile map rendering.
 * Dynamically resolves the local MBTiles tile server endpoint across platforms
 * (Android emulator -> 10.0.2.2, iOS Simulator / Web -> localhost).
 */

import { Platform } from 'react-native';

/**
 * Default Egyptian transit coordinates and bounds.
 */
export const DEFAULT_MAP_CENTER = {
  latitude: 30.0444,
  longitude: 31.2357,
  zoom: 12,
};

/**
 * Resolves the host origin for the local in-process MBTiles vector tile server.
 * @returns Fully qualified HTTP base URL without trailing slash.
 */
export function getLocalTileServerUrl(): string {
  if (Platform.OS === 'android') {
    // Android emulator loops back to the host machine via 10.0.2.2
    return 'http://10.0.2.2:5173';
  }
  // iOS simulator, desktop web, or local proxy
  return 'http://localhost:5173';
}
