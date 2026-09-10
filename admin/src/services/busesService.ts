import { ref, get, set, remove, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';
import { BusRouteDefinition } from '../types';

/**
 * Subscribes to buses for all companies in the Realtime Database.
 */
export function subscribeAllBuses(callback: (buses: BusRouteDefinition[]) => void) {
  const companiesRef = ref(database, 'companies');
  const unsubscribe = onValue(
    companiesRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      const aggregated: BusRouteDefinition[] = [];
      Object.keys(data).forEach((compId) => {
        const comp = data[compId];
        if (comp && comp.buses && typeof comp.buses === 'object') {
          Object.keys(comp.buses).forEach((busKey) => {
            const b = comp.buses[busKey];
            aggregated.push({
              busId: b.busId || busKey,
              lineId: b.lineId || 'Unassigned',
              companyId: b.companyId || compId,
              startPoint: b.startPoint || 'Start Terminal',
              startLat: Number(b.startLat) || 30.0444,
              startLng: Number(b.startLng) || 31.2357,
              endPoint: b.endPoint || 'Destination Terminal',
              endLat: Number(b.endLat) || 30.0444,
              endLng: Number(b.endLng) || 31.2357,
              isActive: Boolean(b.isActive),
              createdAt: b.createdAt || new Date().toISOString(),
            });
          });
        }
      });
      callback(aggregated);
    },
    (err) => {
      console.error('Error fetching buses:', err);
      callback([]);
    }
  );

  return () => off(companiesRef, 'value', unsubscribe);
}

/**
 * Saves or updates a bus in /companies/<companyId>/buses/<busId>.
 * Automatically ensures the assigned lineId is synchronized with the company's busLines list.
 */
export async function saveBus(companyId: string, bus: BusRouteDefinition): Promise<void> {
  const cleanCompId = companyId.trim().toLowerCase();
  const busRef = ref(database, `companies/${cleanCompId}/buses/${bus.busId}`);
  await set(busRef, {
    busId: bus.busId,
    lineId: bus.lineId,
    companyId: cleanCompId,
    startPoint: bus.startPoint,
    startLat: Number(bus.startLat),
    startLng: Number(bus.startLng),
    endPoint: bus.endPoint,
    endLat: Number(bus.endLat),
    endLng: Number(bus.endLng),
    isActive: Boolean(bus.isActive),
    createdAt: bus.createdAt || new Date().toISOString(),
  });

  // Ensure lineId is registered in the company's busLines list
  if (bus.lineId && bus.lineId.trim()) {
    const linesRef = ref(database, `companies/${cleanCompId}/busLines`);
    const snap = await get(linesRef);
    const lines: string[] = Array.isArray(snap.val()) ? snap.val() : [];
    if (!lines.includes(bus.lineId.trim())) {
      lines.push(bus.lineId.trim());
      await set(linesRef, lines);
    }
  }
}

/**
 * Toggles a bus operational active/idle flag.
 */
export async function toggleBusActive(companyId: string, busId: string, isActive: boolean): Promise<void> {
  const activeRef = ref(database, `companies/${companyId}/buses/${busId}/isActive`);
  await set(activeRef, isActive);
}

/**
 * Deletes a bus from /companies/<companyId>/buses/<busId>.
 */
export async function deleteBus(companyId: string, busId: string): Promise<void> {
  const busRef = ref(database, `companies/${companyId}/buses/${busId}`);
  await remove(busRef);
}
