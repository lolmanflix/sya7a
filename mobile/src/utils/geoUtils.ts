/**
 * @file geoUtils.ts
 * @description Geolocation mathematical helpers, coordinate boundary validation,
 * path sanitization, bearing calculation, ETA formatting, and trip duration formatters.
 */

/**
 * Calculates the great-circle distance between two coordinates in meters via Haversine formula.
 *
 * @param lat1 - Origin latitude.
 * @param lon1 - Origin longitude.
 * @param lat2 - Destination latitude.
 * @param lon2 - Destination longitude.
 * @returns Distance in meters.
 */
export function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371008.8;
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
 * Calculates distance in kilometers between two coordinates.
 *
 * @param lat1 - Origin latitude.
 * @param lon1 - Origin longitude.
 * @param lat2 - Destination latitude.
 * @param lon2 - Destination longitude.
 * @returns Distance in kilometers.
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return haversineMeters(lat1, lon1, lat2, lon2) / 1000;
}

/**
 * Calculates the forward azimuth / initial bearing from origin to destination coordinate.
 *
 * @param lat1 - Origin latitude.
 * @param lon1 - Origin longitude.
 * @param lat2 - Destination latitude.
 * @param lon2 - Destination longitude.
 * @returns Azimuth degree between 0 and 360.
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Resolves a 16-point cardinal compass direction string from a bearing angle.
 *
 * @param bearing - Azimuth angle in degrees (0 - 360).
 * @returns Compass direction acronym (e.g. 'N', 'NE', 'SSW').
 */
export function getDirectionName(bearing: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
}

/**
 * Estimates arrival time based on distance in kilometers assuming standard city transit speed (30 km/h).
 *
 * @param distanceKm - Distance to vehicle in kilometers.
 * @param isRTL - Whether to format string in Arabic (RTL) or English.
 * @returns Localized estimated travel duration string.
 */
export function calculateTimeToArrival(distanceKm: number, isRTL: boolean = false): string {
  const averageSpeedKmH = 30;
  const timeInHours = distanceKm / averageSpeedKmH;
  const timeInMinutes = Math.round(timeInHours * 60);
  if (timeInMinutes < 1) return isRTL ? 'أقل من دقيقة' : 'Less than 1 min';
  if (timeInMinutes < 60) return `${timeInMinutes} ${isRTL ? 'دقيقة' : 'min'}`;
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/**
 * Validates that coordinates are within legitimate WGS84 GPS boundaries.
 *
 * @param lat - Latitude degree (-90 to 90).
 * @param lng - Longitude degree (-180 to 180).
 * @returns True if coordinate is within standard valid boundaries.
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Sanitizes line identifiers to prevent RTDB path injection or invalid characters.
 *
 * @param key - Raw line identifier string.
 * @returns Sanitized key safe for Firebase Realtime Database path usage.
 */
export function sanitizePathKey(key: string): string {
  return key.replace(/[.$#[\]\/]/g, '_');
}

/**
 * Formats total trip elapsed seconds into HH:MM:SS or MM:SS format.
 *
 * @param totalSeconds - Total seconds elapsed in current trip.
 * @returns Formatted digital clock string.
 */
export function formatTimer(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
