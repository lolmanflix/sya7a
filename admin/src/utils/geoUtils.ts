/**
 * @file geoUtils.ts
 * @description Centralized geolocation mathematics and distance calculation utilities.
 */

const EARTH_RADIUS_METERS = 6371000;
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates the great-circle distance between two GPS coordinates in meters via the Haversine formula.
 * @param lat1 - Origin latitude in degrees.
 * @param lon1 - Origin longitude in degrees.
 * @param lat2 - Destination latitude in degrees.
 * @param lon2 - Destination longitude in degrees.
 * @returns Distance in meters.
 */
export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Calculates the great-circle distance between two GPS coordinates in kilometers via the Haversine formula.
 * @param lat1 - Origin latitude in degrees.
 * @param lon1 - Origin longitude in degrees.
 * @param lat2 - Destination latitude in degrees.
 * @param lon2 - Destination longitude in degrees.
 * @returns Distance in kilometers.
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  return haversineDistanceMeters(lat1, lon1, lat2, lon2) / 1000;
}
