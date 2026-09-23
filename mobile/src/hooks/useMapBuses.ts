/**
 * @file useMapBuses.ts
 * @description Hook managing real-time vehicle telemetry, line route geometry,
 * closest bus auto-selection, and Firebase RTDB listeners for MapScreen.
 */

import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';
import { BusLocation } from '../components/map/BusDetailsSheet';
import {
  calculateDistanceKm,
  calculateBearing,
  getDirectionName,
  calculateTimeToArrival,
} from '../utils/geoUtils';

interface UseMapBusesProps {
  busLine: string;
  userCoords: { latitude: number; longitude: number } | null;
  isRTL: boolean;
}

/**
 * Custom hook providing live vehicle telemetry and route definition for a specific transit line.
 *
 * @param props - Transit line name, user coordinates, and RTL flag.
 * @returns State properties and selection handlers.
 */
export function useMapBuses({ busLine, userCoords, isRTL }: UseMapBusesProps) {
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  const [routeDefinition, setRouteDefinition] = useState<any>(null);

  /**
   * Subscribes to company catalog to fetch route definition and mandatory stops for the line.
   */
  useEffect(() => {
    if (!busLine) return;
    let isMounted = true;
    const compRef = ref(database, 'companies');

    const unsub = onValue(
      compRef,
      (snap) => {
        if (!isMounted) return;
        const allComp = snap.val() || {};
        let found: any = null;

        Object.values(allComp).forEach((comp: any) => {
          if (comp?.buses && typeof comp.buses === 'object') {
            Object.values(comp.buses).forEach((b: any) => {
              if (b?.lineId && b.lineId.toLowerCase() === busLine.toLowerCase()) {
                found = b;
              }
            });
          }
        });

        if (found) {
          setRouteDefinition(found);
        }
      },
      (err) => {
        console.error('[useMapBuses] Failed to fetch company route definition:', err);
      }
    );

    return () => {
      isMounted = false;
      off(compRef, 'value', unsub);
    };
  }, [busLine]);

  /**
   * Subscribes to live driver telemetry broadcasting on the selected line.
   */
  useEffect(() => {
    if (!busLine) return;
    let isMounted = true;
    const busLocationsRef = ref(database, `busLocations/${busLine}`);

    const unsubscribe = onValue(
      busLocationsRef,
      (snapshot) => {
        if (!isMounted) return;
        const data = snapshot.val();
        let locations: BusLocation[] = [];

        if (data && typeof data === 'object') {
          locations = Object.keys(data).map((key) => {
            const bus = { id: key, ...data[key] };
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
                distance,
                direction: getDirectionName(bearing),
                timeToArrival: calculateTimeToArrival(distance, isRTL),
              };
            }
            return bus;
          });
        }

        // Demo Line fallback mock if empty
        if (busLine === 'Demo Line' && locations.length === 0) {
          const mockBus: BusLocation = {
            id: 'demo-bus',
            latitude: 30.0444,
            longitude: 31.2357,
            lastUpdated: new Date().toISOString(),
            eta: '5 min',
          };
          if (userCoords) {
            const distance = calculateDistanceKm(
              userCoords.latitude,
              userCoords.longitude,
              mockBus.latitude,
              mockBus.longitude
            );
            const bearing = calculateBearing(
              userCoords.latitude,
              userCoords.longitude,
              mockBus.latitude,
              mockBus.longitude
            );
            locations.push({
              ...mockBus,
              distance,
              direction: getDirectionName(bearing),
              timeToArrival: calculateTimeToArrival(distance, isRTL),
            });
          } else {
            locations.push(mockBus);
          }
        }

        setBusLocations(locations);

        // Auto-select closest active vehicle if none currently chosen
        if (!selectedBus && locations.length > 0) {
          let pick: BusLocation = locations[0];
          if (userCoords) {
            let minD = Number.MAX_VALUE;
            locations.forEach((b) => {
              const d = calculateDistanceKm(
                userCoords.latitude,
                userCoords.longitude,
                b.latitude,
                b.longitude
              );
              if (d < minD) {
                minD = d;
                pick = b;
              }
            });
          }
          setSelectedBus(pick);
        }
      },
      (err) => {
        console.error('[useMapBuses] Failed to fetch live bus locations:', err);
      }
    );

    return () => {
      isMounted = false;
      off(busLocationsRef, 'value', unsubscribe);
    };
  }, [busLine, userCoords, isRTL, selectedBus]);

  return {
    busLocations,
    selectedBus,
    setSelectedBus,
    routeDefinition,
  };
}
