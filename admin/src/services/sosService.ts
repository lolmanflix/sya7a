import { ref, onValue, off, update } from 'firebase/database';
import { database } from '../config/firebase';
import { SosAlertRecord } from '../types';

/** Single config constant for the RTDB subtree this feature owns (read-only
 *  listener; acknowledgement attempts a targeted status update only). */
const DRIVER_CONTROLS_PATH = 'driverControls';

const ACTIVE_SOS_STATUS = 'critical_sos';

function asText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

/**
 * Builds a stable dedupe id for an SOS beacon.
 */
export function buildSosAlertId(driverUid: string, triggeredAt: string): string {
  return `${driverUid}:${triggeredAt}`;
}

/**
 * Parses a raw sosAlert node into a displayable record.
 * Returns null for missing/malformed/non-critical entries — never throws.
 */
export function parseSosAlert(driverUid: string, raw: unknown): SosAlertRecord | null {
  if (!driverUid || !raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  if (data.status !== ACTIVE_SOS_STATUS) return null;
  const triggeredAt = asText(data.triggeredAt, '');
  return {
    id: buildSosAlertId(driverUid, triggeredAt),
    driverUid,
    busLine: asText(data.busLine, 'Unknown line'),
    driverName: asText(data.driverName, 'Unknown driver'),
    driverEmail: typeof data.driverEmail === 'string' ? data.driverEmail : undefined,
    endPoint: asText(data.endPoint, 'Unknown destination'),
    status: ACTIVE_SOS_STATUS,
    triggeredAt,
  };
}

/**
 * Realtime listener over /driverControls that surfaces every active
 * (status === 'critical_sos') driver SOS beacon, newest first.
 * Errors are logged and degrade to an empty list — never throws.
 */
export function subscribeSosAlerts(
  callback: (alerts: SosAlertRecord[]) => void
): () => void {
  const controlsRef = ref(database, DRIVER_CONTROLS_PATH);
  const unsubscribe = onValue(
    controlsRef,
    (snapshot) => {
      try {
        const data = snapshot.val();
        if (!data || typeof data !== 'object') {
          callback([]);
          return;
        }
        const alerts: SosAlertRecord[] = [];
        Object.keys(data).forEach((driverUid) => {
          const entry = (data as Record<string, unknown>)[driverUid];
          if (!entry || typeof entry !== 'object') return;
          const alert = parseSosAlert(driverUid, (entry as Record<string, unknown>).sosAlert);
          if (alert) alerts.push(alert);
        });
        alerts.sort((a, b) => (a.triggeredAt < b.triggeredAt ? 1 : -1));
        callback(alerts);
      } catch (err) {
        console.warn('[SOS] Failed to parse driverControls snapshot:', err);
        callback([]);
      }
    },
    (err) => {
      console.warn(
        '[SOS] Listener error on driverControls (permission denied or network):',
        err instanceof Error ? err.message : err
      );
      callback([]);
    }
  );

  return () => off(controlsRef, 'value', unsubscribe);
}

/**
 * Attempts to persist an acknowledgement by flipping sosAlert/status.
 * RTDB rules only allow this for whitelisted admin identities (or the
 * driver themselves); any denial is swallowed so callers can fall back
 * to a local-only dismiss. Never throws.
 *
 * @returns true when the acknowledgement reached the database.
 */
export async function acknowledgeSosAlert(
  driverUid: string,
  adminEmail: string
): Promise<boolean> {
  if (!driverUid) return false;
  try {
    await update(ref(database, `${DRIVER_CONTROLS_PATH}/${driverUid}/sosAlert`), {
      status: 'acknowledged',
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy: adminEmail || 'admin',
    });
    return true;
  } catch (err) {
    console.warn(
      '[SOS] Acknowledgement write rejected by database rules — keeping local dismiss only:',
      err instanceof Error ? err.message : err
    );
    return false;
  }
}
