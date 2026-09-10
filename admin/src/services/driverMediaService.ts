import { ref, set, onValue, off, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { DriverMediaRequest, DriverMediaStream, MediaRequestKind } from '../types';

/**
 * Dispatches a remote camera/microphone safety check request to a driver's mobile device.
 * Writes to /driverControls/<driverUid>/mediaRequest adhering to SafeTrip protocol.
 */
export async function requestDriverMedia(
  driverUid: string,
  kind: MediaRequestKind,
  adminEmail: string
): Promise<void> {
  if (!driverUid) throw new Error('Driver UID is required to dispatch media request.');
  const requestRef = ref(database, `driverControls/${driverUid}/mediaRequest`);
  const payload: DriverMediaRequest = {
    kind,
    status: 'pending',
    requestedAt: new Date().toISOString(),
    requestedBy: adminEmail,
    driverUid,
  };
  await set(requestRef, payload);
}

/**
 * Listens in real time to the driver's consent state and safety check stream status.
 */
export function subscribeToDriverMediaRequest(
  driverUid: string,
  callback: (request: DriverMediaRequest | null) => void
): () => void {
  if (!driverUid) {
    callback(null);
    return () => {};
  }
  const requestRef = ref(database, `driverControls/${driverUid}/mediaRequest`);
  const unsubscribe = onValue(
    requestRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback(null);
        return;
      }
      callback({
        kind: data.kind || 'both',
        status: data.status || 'pending',
        requestedAt: data.requestedAt || new Date().toISOString(),
        requestedBy: data.requestedBy || 'admin',
        respondedAt: data.respondedAt,
        driverUid,
      });
    },
    (err) => {
      console.error('Error listening to driver media request:', err);
      callback(null);
    }
  );

  return () => off(requestRef, 'value', unsubscribe);
}

/**
 * Subscribes to the live incoming video/audio stream frames from the driver's mobile handset.
 * Listens to /driverControls/<driverUid>/mediaStream.
 */
export function subscribeToDriverMediaStream(
  driverUid: string,
  callback: (stream: DriverMediaStream | null) => void
): () => void {
  if (!driverUid) {
    callback(null);
    return () => {};
  }
  const streamRef = ref(database, `driverControls/${driverUid}/mediaStream`);
  const unsubscribe = onValue(
    streamRef,
    (snapshot) => {
      const data = snapshot.val();
      callback(data || null);
    },
    (err) => {
      console.error('Error listening to driver media stream:', err);
      callback(null);
    }
  );

  return () => off(streamRef, 'value', unsubscribe);
}

/**
 * Terminates an active or pending safety stream check session.
 */
export async function closeDriverMediaRequest(driverUid: string): Promise<void> {
  if (!driverUid) return;
  const requestRef = ref(database, `driverControls/${driverUid}/mediaRequest`);
  const streamRef = ref(database, `driverControls/${driverUid}/mediaStream`);
  await remove(requestRef).catch(() => {});
  await remove(streamRef).catch(() => {});
}

/**
 * Diagnostic/Simulation Helper:
 * Simulates the mobile driver tapping 'Accept' or 'Decline' in the SafeTrip prompt.
 * Enables live stream interface verification in offline testing environments.
 */
export async function simulateDriverResponse(driverUid: string, approved: boolean): Promise<void> {
  if (!driverUid) return;
  const requestRef = ref(database, `driverControls/${driverUid}/mediaRequest`);
  const payload: Partial<DriverMediaRequest> = {
    status: approved ? 'accepted' : 'declined',
    respondedAt: new Date().toISOString(),
  };
  await set(requestRef, payload);
}
