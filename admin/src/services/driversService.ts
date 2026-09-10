import { ref, set, remove, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';
import { DriverProfile } from '../types';

/**
 * Subscribes to driver directory in Realtime Database.
 */
export function subscribeDrivers(callback: (drivers: DriverProfile[]) => void) {
  const driversRef = ref(database, 'drivers');
  const unsubscribe = onValue(
    driversRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      const list: DriverProfile[] = Object.keys(data).map((uid) => ({
        uid,
        displayName: data[uid].displayName || 'Driver',
        email: data[uid].email || '',
        companyId: data[uid].companyId || 'unassigned',
        lines: Array.isArray(data[uid].lines) ? data[uid].lines : [],
      }));
      callback(list);
    },
    (err) => {
      console.error('Error fetching drivers:', err);
      callback([]);
    }
  );

  return () => off(driversRef, 'value', unsubscribe);
}

/**
 * Updates assigned bus lines for a specific driver.
 */
export async function updateDriverLines(driverUid: string, lines: string[]): Promise<void> {
  const linesRef = ref(database, `drivers/${driverUid}/lines`);
  await set(linesRef, lines);
}

/**
 * Updates assigned company for a driver.
 */
export async function updateDriverCompany(driverUid: string, companyId: string): Promise<void> {
  const compRef = ref(database, `drivers/${driverUid}/companyId`);
  await set(compRef, companyId);
}

/**
 * Saves or provisions a driver profile in RTDB.
 */
export async function saveDriverProfile(driver: DriverProfile): Promise<void> {
  const driverRef = ref(database, `drivers/${driver.uid}`);
  await set(driverRef, {
    displayName: driver.displayName,
    email: driver.email,
    companyId: driver.companyId,
    lines: driver.lines,
  });
}

/**
 * Removes a driver record from RTDB.
 */
export async function removeDriverProfile(driverUid: string): Promise<void> {
  const driverRef = ref(database, `drivers/${driverUid}`);
  await remove(driverRef);
}
