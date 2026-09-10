/**
 * Landmark & POI Resolution Service for Wasalt Admin Panel
 * Resolves map coordinates to the nearest named real-world landmark (shop, restaurant,
 * building, amenity, station, or landmark) using Overpass API, Nominatim, and offline presets.
 */

import { OFFLINE_EGYPTIAN_LANDMARKS } from '../constants/landmarks';

export interface NearestLandmarkResult {
  name: string;
  category?: string;
  distanceMeters: number;
  isFallback?: boolean;
}

// In-memory cache for resolved coordinates (keyed by rounded lat,lng)
const landmarkCache = new Map<string, NearestLandmarkResult>();

/**
 * Calculates Haversine distance in meters between two lat/lng coordinates.
 */
function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getCacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

/**
 * Resolves the nearest named landmark, shop, restaurant, or building for a coordinate.
 * Priority:
 * 1. Offline Egyptian prominent transit hubs (if <= 250m)
 * 2. Overpass API search for named POIs within 300m
 * 3. OpenStreetMap Nominatim reverse geocoding
 * 4. Fallback coordinate label
 */
export async function resolveNearestLandmark(
  lat: number,
  lng: number
): Promise<NearestLandmarkResult> {
  const cacheKey = getCacheKey(lat, lng);
  if (landmarkCache.has(cacheKey)) {
    return landmarkCache.get(cacheKey)!;
  }

  // 1. Check curated offline Egyptian landmarks within 250 meters
  let nearestPreset: { name: string; dist: number } | null = null;
  for (const lm of OFFLINE_EGYPTIAN_LANDMARKS) {
    const dist = haversineDistanceMeters(lat, lng, lm.lat, lm.lng);
    if (dist <= 250 && (!nearestPreset || dist < nearestPreset.dist)) {
      nearestPreset = { name: lm.name.split('(')[0].trim(), dist };
    }
  }
  if (nearestPreset && nearestPreset.dist <= 150) {
    const res: NearestLandmarkResult = {
      name: nearestPreset.name,
      category: 'transit_hub',
      distanceMeters: Math.round(nearestPreset.dist),
    };
    landmarkCache.set(cacheKey, res);
    return res;
  }

  // 2. Query Overpass API for nearby named POIs (shops, restaurants, amenities, buildings)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const query = `[out:json][timeout:4];(node(around:300,${lat},${lng})["name"];way(around:300,${lat},${lng})["name"];);out center 15;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const elements: any[] = data.elements || [];

      interface Candidate {
        name: string;
        category: string;
        dist: number;
        isPoi: boolean;
      }

      const candidates: Candidate[] = [];

      for (const el of elements) {
        const tags = el.tags || {};
        const name = tags['name:ar'] || tags.name || tags['name:en'];
        if (!name || name.trim().length === 0) continue;

        const elLat = el.lat || (el.center && el.center.lat);
        const elLon = el.lon || (el.center && el.center.lon);
        if (typeof elLat !== 'number' || typeof elLon !== 'number') continue;

        const dist = haversineDistanceMeters(lat, lng, elLat, elLon);

        // Score POIs (shops, restaurants, cafes, amenities, buildings) higher than generic streets
        const isPoi = Boolean(
          tags.amenity ||
          tags.shop ||
          tags.building ||
          tags.tourism ||
          tags.historic ||
          tags.leisure ||
          tags.office ||
          tags.healthcare ||
          tags.craft ||
          tags.religion
        );

        const category =
          tags.amenity ||
          tags.shop ||
          tags.tourism ||
          tags.building ||
          tags.highway ||
          'landmark';

        candidates.push({ name: name.trim(), category, dist, isPoi });
      }

      if (candidates.length > 0) {
        // Sort POIs first, then by closest distance
        candidates.sort((a, b) => {
          if (a.isPoi !== b.isPoi) return a.isPoi ? -1 : 1;
          return a.dist - b.dist;
        });

        const best = candidates[0];
        const res: NearestLandmarkResult = {
          name: best.name,
          category: best.category,
          distanceMeters: Math.round(best.dist),
        };
        landmarkCache.set(cacheKey, res);
        return res;
      }
    }
  } catch {
    // Overpass timed out or failed; fallback to Nominatim
  }

  // 3. Fallback: OpenStreetMap Nominatim Reverse Geocoding
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ar,en`;
    const response = await fetch(nomUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Sya7aBusTracker/1.0 (admin@sya7a.transit)' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};

      const landmarkName =
        data.name ||
        addr.amenity ||
        addr.shop ||
        addr.building ||
        addr.tourism ||
        addr.historic ||
        addr.road ||
        addr.neighbourhood ||
        addr.suburb;

      if (landmarkName && landmarkName.trim().length > 0) {
        const res: NearestLandmarkResult = {
          name: landmarkName.trim(),
          category: data.type || 'place',
          distanceMeters: 0,
        };
        landmarkCache.set(cacheKey, res);
        return res;
      }
    }
  } catch {
    // Nominatim fallback failed
  }

  // 4. Default fallback: nearest preset or coordinate string
  if (nearestPreset) {
    const res: NearestLandmarkResult = {
      name: nearestPreset.name,
      category: 'preset',
      distanceMeters: Math.round(nearestPreset.dist),
    };
    landmarkCache.set(cacheKey, res);
    return res;
  }

  const fallback: NearestLandmarkResult = {
    name: `Stop @ ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    distanceMeters: 0,
    isFallback: true,
  };
  landmarkCache.set(cacheKey, fallback);
  return fallback;
}
