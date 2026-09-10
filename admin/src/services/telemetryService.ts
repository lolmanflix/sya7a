import { ref, onValue, off, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { LiveBusLocation } from '../types';

/**
 * Subscribes to live high-frequency bus locations broadcasted by active drivers.
 */
export function subscribeLiveTelemetry(callback: (locations: LiveBusLocation[]) => void) {
  const busLocationsRef = ref(database, 'busLocations');
  const unsubscribe = onValue(
    busLocationsRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      const list: LiveBusLocation[] = [];
      Object.keys(data).forEach((lineId) => {
        const drivers = data[lineId];
        if (drivers && typeof drivers === 'object') {
          Object.keys(drivers).forEach((driverUid) => {
            const loc = drivers[driverUid];
            if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
              list.push({
                id: `${lineId}-${driverUid}`,
                lineId,
                driverUid,
                latitude: loc.latitude,
                longitude: loc.longitude,
                lastUpdated: loc.lastUpdated || new Date().toISOString(),
                endPoint: loc.endPoint,
                endLat: loc.endLat,
                endLng: loc.endLng,
                driverName: loc.driverName || 'Active Driver',
                driverEmail: loc.driverEmail || 'Unknown Email',
                cameraMonitored: Boolean(loc.cameraMonitored),
                micMonitored: Boolean(loc.micMonitored),
              });
            }
          });
        }
      });
      callback(list);
    },
    (err) => {
      console.error('Error listening to live telemetry:', err);
      callback([]);
    }
  );

  return () => off(busLocationsRef, 'value', unsubscribe);
}

/**
 * Administrative override: Forcefully terminates a rogue or stranded driver session from /busLocations.
 */
export async function terminateLiveSession(lineId: string, driverUid: string): Promise<void> {
  const sessionRef = ref(database, `busLocations/${lineId}/${driverUid}`);
  await remove(sessionRef);
}
