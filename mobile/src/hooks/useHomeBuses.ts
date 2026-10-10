/**
 * @file useHomeBuses.ts
 * @description State hook managing bus catalog lines, active live vehicles,
 * real-time Firebase RTDB listeners, geodesic ETA telemetry, search filtering,
 * and user bookmarks.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
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
  // Raw RTDB snapshots — listeners write these once per server event.
  const [rawBuses, setRawBuses] = useState<Bus[]>([]);
  const [rawActive, setRawActive] = useState<ActiveBus[]>([]);
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
   * Subscribes to the canonical company catalog (companies/{id}/buses).
   * The legacy root `buses` node no longer exists in RTDB — it used to return
   * permission_denied and left the home screen with a single demo row.
   */
  useEffect(() => {
    let isMounted = true;
    const busesRef = ref(database, 'companies');

    const unsubscribe = onValue(
      busesRef,
      (snapshot) => {
        if (!isMounted) return;
        const data = snapshot.val();
        let busesList: Bus[] = [];

        if (data && typeof data === 'object') {
          Object.keys(data).forEach((companyId) => {
            const company = data[companyId];
            if (!company || typeof company !== 'object') return;
            const companyBuses = company.buses;
            if (!companyBuses || typeof companyBuses !== 'object') return;
            Object.keys(companyBuses).forEach((busKey) => {
              const busRec = companyBuses[busKey];
              if (!busRec || typeof busRec !== 'object' || !busRec.lineId) return;
              busesList.push({
                id: `${companyId}-${busKey}`,
                lineName: busRec.lineId,
                companyName:
                  typeof company.name === 'string' ? company.name : companyId,
                activeBusCount: 0,
                latitude:
                  typeof busRec.startLat === 'number' && busRec.startLat !== 0
                    ? busRec.startLat
                    : undefined,
                longitude:
                  typeof busRec.startLng === 'number' && busRec.startLng !== 0
                    ? busRec.startLng
                    : undefined,
              });
            });
          });
        }

        // Demo fallback only when the catalog is genuinely empty
        if (busesList.length === 0) {
          const mockBus: Bus = {
            id: 'mock-bus',
            lineName: 'Demo Line',
            companyName: 'Demo Company',
            activeBusCount: 0,
            eta: '5 min',
            latitude: 30.0444,
            longitude: 31.2357,
          };
          busesList.push(mockBus);
        }

        // Prepend bookmarked favorites if not already present
        favoriteLines.forEach((fav) => {
          const exists = busesList.some((b) => b.lineName === fav);
          if (!exists) {
            busesList.unshift({
              id: `fav-${fav}`,
              lineName: fav,
              companyName: 'Favorite',
              activeBusCount: 0,
            });
          }
        });

        // Raw catalog only: geo + live-count enrichment runs in useMemo so this
        // listener is no longer torn down and re-subscribed on every GPS tick.
        setRawBuses(busesList);
      },
      (error) => {
        console.error('[useHomeBuses] Buses RTDB listener failed:', error);
      }
    );

    return () => {
      isMounted = false;
      off(busesRef, 'value', unsubscribe);
    };
  }, [favoriteLines]);

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
                  collected.push(base);
                }
              });
            }
          });
        }

        setActiveCounts(counts);
        // Raw trips only: distance/ETA sorting runs in the activeBuses memo so
        // this listener attaches exactly once (it previously re-subscribed on
        // every GPS coordinate change).
        setRawActive(collected);
      },
      (error) => {
        console.error('[useHomeBuses] BusLocations RTDB listener failed:', error);
      }
    );

    return () => {
      isMounted = false;
      off(busLocationsRef, 'value', unsub);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setState setters are stable; geo props are intentionally excluded
  }, []);

  /**
   * Derived catalog: merges live counts + proximity without touching RTDB.
   */
  const buses = useMemo<Bus[]>(() => {
    return rawBuses.map((bus) => {
      const count = activeCounts[bus.lineName] ?? bus.activeBusCount ?? 0;
      if (userCoords && bus.latitude && bus.longitude) {
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
        return {
          ...bus,
          activeBusCount: count,
          distance,
          direction: getDirectionName(bearing),
          timeToArrival: calculateTimeToArrival(distance, isRTL),
        };
      }
      return { ...bus, activeBusCount: count };
    });
  }, [rawBuses, activeCounts, userCoords, isRTL]);

  /**
   * Derived active trips: distance/ETA computed per render batch, sorted by
   * proximity — replaces the per-tick listener rebuild.
   */
  const activeBuses = useMemo<ActiveBus[]>(() => {
    const withGeo = rawActive.map((trip) => {
      if (userCoords) {
        const distance = calculateDistanceKm(
          userCoords.latitude,
          userCoords.longitude,
          trip.latitude,
          trip.longitude
        );
        const bearing = calculateBearing(
          userCoords.latitude,
          userCoords.longitude,
          trip.latitude,
          trip.longitude
        );
        return {
          ...trip,
          distance,
          direction: getDirectionName(bearing),
          timeToArrival: calculateTimeToArrival(distance, isRTL),
        };
      }
      return trip;
    });
    return [...withGeo].sort(
      (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
    );
  }, [rawActive, userCoords, isRTL]);

  /**
   * Filters the catalog list by user search query.
   */
  const filteredBuses = useMemo<Bus[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return buses;
    return buses.filter(
      (bus) =>
        bus.lineName.toLowerCase().includes(query) ||
        bus.companyName.toLowerCase().includes(query)
    );
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
