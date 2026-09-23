/**
 * @file useHomeBuses.ts
 * @description State hook managing bus catalog lines, active live vehicles,
 * real-time Firebase RTDB listeners, geodesic ETA telemetry, search filtering,
 * and user bookmarks.
 */

import { useState, useEffect, useCallback } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';
import { saveToHistory } from '../utils/historyUtils';
import { listenToFavorites, toggleFavorite } from '../utils/favoritesUtils';
import {
  calculateDistanceKm,
  calculateBearing,
  getDirectionName,
  calculateTimeToArrival,
} from '../utils/geoUtils';

/**
 * Catalog route bus line definition.
 */
export interface Bus {
  id: string;
  lineName: string;
  companyName: string;
  activeBusCount: number;
  eta?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  direction?: string;
  timeToArrival?: string;
}

/**
 * Live active vehicle telemetry record.
 */
export interface ActiveBus {
  id: string;
  lineName: string;
  driverId: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  distance?: number;
  direction?: string;
  timeToArrival?: string;
  driverName?: string;
}

interface UseHomeBusesProps {
  userId?: string | null;
  userCoords?: { latitude: number; longitude: number } | null;
  isRTL: boolean;
}

/**
 * Hook to manage live bus discovery, catalog filtering, and RTDB telemetry synchronization.
 *
 * @param props - User context and coordinate props.
 * @returns State and handlers for HomeScreen.
 */
export function useHomeBuses({ userId, userCoords, isRTL }: UseHomeBusesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
  const [activeBuses, setActiveBuses] = useState<ActiveBus[]>([]);
  const [activeCounts, setActiveCounts] = useState<Record<string, number>>({});
  const [favoriteLines, setFavoriteLines] = useState<Set<string>>(new Set());
  const [selectedActiveBus, setSelectedActiveBus] = useState<ActiveBus | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Subscribes to user favorite lines if authenticated.
   */
  useEffect(() => {
    if (!userId) {
      setFavoriteLines(new Set());
      return;
    }
    const unsub = listenToFavorites(userId, setFavoriteLines);
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [userId]);

  /**
   * Subscribes to the catalog buses node in RTDB.
   */
  useEffect(() => {
    let isMounted = true;
    const busesRef = ref(database, 'buses');

    const unsubscribe = onValue(
      busesRef,
      (snapshot) => {
        if (!isMounted) return;
        const data = snapshot.val();
        let busesList: Bus[] = [];

        if (data && typeof data === 'object') {
          busesList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
        }

        // Demo fallback line
        const mockBus: Bus = {
          id: 'mock-bus',
          lineName: 'Demo Line',
          companyName: 'Demo Company',
          activeBusCount: activeCounts['Demo Line'] || 0,
          eta: '5 min',
          latitude: 30.0444,
          longitude: 31.2357,
        };
        busesList.push(mockBus);

        // Prepend bookmarked favorites if not already present
        favoriteLines.forEach((fav) => {
          const exists = busesList.some((b) => b.lineName === fav);
          if (!exists) {
            busesList.unshift({
              id: `fav-${fav}`,
              lineName: fav,
              companyName: 'Favorite',
              activeBusCount: activeCounts[fav] || 0,
            });
          }
        });

        // Compute location proximity and bearing if GPS is accessible
        if (userCoords) {
          const busesWithLocation = busesList.map((bus) => {
            const count = activeCounts[bus.lineName] ?? bus.activeBusCount ?? 0;
            if (bus.latitude && bus.longitude) {
              const distance = calculateDistanceKm(
                userCoords.latitude,
                userCoords.longitude,
                bus.latitude,
                bus.longitude
              );
              const bearing = calculateBearing(
                userCoords.latitude,
                userCoords.longitude,
                bus.latitude,
                bus.longitude
              );
              const direction = getDirectionName(bearing);
              const timeToArrival = calculateTimeToArrival(distance, isRTL);
              return {
                ...bus,
                activeBusCount: count,
                distance,
                direction,
                timeToArrival,
              };
            }
            return { ...bus, activeBusCount: count };
          });
          setBuses(busesWithLocation);
        } else {
          const merged = busesList.map((b) => ({
            ...b,
            activeBusCount: activeCounts[b.lineName] ?? b.activeBusCount ?? 0,
          }));
          setBuses(merged);
        }
      },
      (error) => {
        console.error('[useHomeBuses] Buses RTDB listener failed:', error);
      }
    );

    return () => {
      isMounted = false;
      off(busesRef, 'value', unsubscribe);
    };
  }, [userCoords, activeCounts, favoriteLines, isRTL]);

  /**
   * Subscribes to live driver telemetry and vehicle locations in RTDB.
   */
  useEffect(() => {
    let isMounted = true;
    const busLocationsRef = ref(database, 'busLocations');

    const unsub = onValue(
      busLocationsRef,
      (snapshot) => {
        if (!isMounted) return;
        const data = snapshot.val();
        const counts: Record<string, number> = {};
        const collected: ActiveBus[] = [];

        if (data && typeof data === 'object') {
          Object.keys(data).forEach((line) => {
            const drivers = data[line];
            counts[line] = drivers ? Object.keys(drivers).length : 0;
            if (drivers && typeof drivers === 'object') {
              Object.keys(drivers).forEach((driverId) => {
                const d = drivers[driverId];
                if (
                  d &&
                  typeof d.latitude === 'number' &&
                  typeof d.longitude === 'number'
                ) {
                  const base: ActiveBus = {
                    id: `${line}-${driverId}`,
                    lineName: line,
                    driverId,
                    latitude: d.latitude,
                    longitude: d.longitude,
                    lastUpdated: d.lastUpdated || new Date().toISOString(),
                    driverName: d.driverName || undefined,
                  };
                  if (userCoords) {
                    const distance = calculateDistanceKm(
                      userCoords.latitude,
                      userCoords.longitude,
                      base.latitude,
                      base.longitude
                    );
                    const bearing = calculateBearing(
                      userCoords.latitude,
                      userCoords.longitude,
                      base.latitude,
                      base.longitude
                    );
                    const direction = getDirectionName(bearing);
                    const timeToArrival = calculateTimeToArrival(distance, isRTL);
                    collected.push({ ...base, distance, direction, timeToArrival });
                  } else {
                    collected.push(base);
                  }
                }
              });
            }
          });
        }

        setActiveCounts(counts);
        const sorted = [...collected].sort(
          (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
        );
        setActiveBuses(sorted);
      },
      (error) => {
        console.error('[useHomeBuses] BusLocations RTDB listener failed:', error);
      }
    );

    return () => {
      isMounted = false;
      off(busLocationsRef, 'value', unsub);
    };
  }, [userCoords, isRTL]);

  /**
   * Filters the catalog list by user search query.
   */
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setFilteredBuses(buses);
    } else {
      const filtered = buses.filter(
        (bus) =>
          bus.lineName.toLowerCase().includes(query) ||
          bus.companyName.toLowerCase().includes(query)
      );
      setFilteredBuses(filtered);
    }
  }, [searchQuery, buses]);

  /**
   * Handles pull-to-refresh action.
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  /**
   * Toggles bookmark state for a specific line.
   */
  const handleToggleFavorite = useCallback(
    async (lineName: string) => {
      if (!userId) return;
      try {
        await toggleFavorite(userId, lineName, favoriteLines.has(lineName));
      } catch (err) {
        console.error('[useHomeBuses] toggleFavorite failed:', err);
      }
    },
    [userId, favoriteLines]
  );

  /**
   * Saves selected route search to local/RTDB user history.
   */
  const handleSaveToHistory = useCallback(
    async (lineName: string, companyName: string) => {
      if (!userId) return;
      try {
        await saveToHistory(userId, lineName, companyName);
      } catch (err) {
        console.error('[useHomeBuses] saveToHistory error:', err);
      }
    },
    [userId]
  );

  return {
    searchQuery,
    setSearchQuery,
    buses,
    filteredBuses,
    activeBuses,
    favoriteLines,
    selectedActiveBus,
    setSelectedActiveBus,
    refreshing,
    handleRefresh,
    handleToggleFavorite,
    handleSaveToHistory,
  };
}
