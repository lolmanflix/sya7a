/**
 * @file landmarkService.ts
 * @description Pure in-memory offline landmark and transit hub resolution service.
 * Operates with zero third-party network dependencies or cloud APIs.
 */

import { OFFLINE_EGYPTIAN_LANDMARKS, EgyptianLandmark } from '../constants/landmarks';
import { haversineDistanceMeters } from '../utils/geoUtils';

export interface NearestLandmarkResult {
  name: string;
  category?: string;
  distanceMeters: number;
  isFallback?: boolean;
}

// In-memory cache for resolved coordinates (keyed by rounded lat,lng)
const landmarkCache = new Map<string, NearestLandmarkResult>();

/**
 * Generates coordinate cache key for landmark resolution caching.
 * @param lat - Latitude coordinate.
 * @param lng - Longitude coordinate.
 * @returns Deterministic cache key string.
 */
function getCacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

/**
 * Finds the closest offline Egyptian landmark using geodesic distance.
 * @param lat - Latitude coordinate.
 * @param lng - Longitude coordinate.
 * @returns Nearest landmark record with distance in meters.
 */
function findClosestPreset(lat: number, lng: number): { landmark: EgyptianLandmark; distanceMeters: number } | null {
  if (OFFLINE_EGYPTIAN_LANDMARKS.length === 0) return null;
  let bestLandmark = OFFLINE_EGYPTIAN_LANDMARKS[0];
  let minDistance = haversineDistanceMeters(lat, lng, bestLandmark.lat, bestLandmark.lng);

  for (let i = 1; i < OFFLINE_EGYPTIAN_LANDMARKS.length; i++) {
    const lm = OFFLINE_EGYPTIAN_LANDMARKS[i];
    const dist = haversineDistanceMeters(lat, lng, lm.lat, lm.lng);
    if (dist < minDistance) {
      minDistance = dist;
      bestLandmark = lm;
    }
  }

  return { landmark: bestLandmark, distanceMeters: Math.round(minDistance) };
}

/**
 * Resolves the nearest named transit hub, campus, or landmark from local spatial memory.
 * Completely offline with zero third-party network dependencies.
 * @param lat - Latitude coordinate.
 * @param lng - Longitude coordinate.
 * @returns Nearest named landmark result.
 */
export async function resolveNearestLandmark(
  lat: number,
  lng: number
): Promise<NearestLandmarkResult> {
  const cacheKey = getCacheKey(lat, lng);
  if (landmarkCache.has(cacheKey)) {
    return landmarkCache.get(cacheKey)!;
  }

  const closest = findClosestPreset(lat, lng);
  if (closest) {
    const { landmark, distanceMeters } = closest;
    const cleanName = landmark.name.split('(')[0].trim();

    // Close proximity (within 1.5 km)
    if (distanceMeters <= 1500) {
      const result: NearestLandmarkResult = {
        name: cleanName,
        category: landmark.category || 'transit_hub',
        distanceMeters,
      };
      landmarkCache.set(cacheKey, result);
      return result;
    }

    // Regional proximity (within 6 km)
    if (distanceMeters <= 6000) {
      const result: NearestLandmarkResult = {
        name: `بالقرب من ${cleanName}`,
        category: landmark.category || 'district',
        distanceMeters,
      };
      landmarkCache.set(cacheKey, result);
      return result;
    }
  }

  const fallback: NearestLandmarkResult = {
    name: `محطة @ ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    distanceMeters: 0,
    isFallback: true,
  };
  landmarkCache.set(cacheKey, fallback);
  return fallback;
}
