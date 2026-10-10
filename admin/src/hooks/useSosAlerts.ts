import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAdminAuth } from '../contexts/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { acknowledgeSosAlert, subscribeSosAlerts } from '../services/sosService';
import { SosAlertRecord } from '../types';

/** Minimum gap between consecutive SOS toasts so bursts don't spam the stack. */
const SOS_TOAST_GAP_MS = 1500;

/**
 * Binds the realtime SOS listener to the authenticated admin session.
 * - Subscribes only while an adminSession exists; unsubscribes on logout/unmount.
 * - Beacons present at initial load are baseline-only (no toast), later ones
 *   raise a persistent error toast, deduped per beacon and rate-limited.
 * - Dismiss removes the beacon locally and attempts to persist status
 *   'acknowledged' (falls back to local-only when database rules reject it).
 */
export function useSosAlerts(): {
  alerts: SosAlertRecord[];
  dismissAlert: (alert: SosAlertRecord) => Promise<void>;
} {
  const { adminSession } = useAdminAuth();
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<SosAlertRecord[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const baselineRef = useRef<Set<string> | null>(null);
  const dismissedRef = useRef<Set<string>>(new Set());
  const toastedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!adminSession) {
      baselineRef.current = null;
      return;
    }

    // Alert ids the very first snapshot contains: already on screen at load.
    let toastTimer: number | null = null;
    const queue: SosAlertRecord[] = [];

    const showSosToast = (alert: SosAlertRecord) => {
      toast.error(t('nav.sosToastTitle', { name: alert.driverName }), {
        id: alert.id, // sonner-level duplicate suppression
        description: t('nav.sosToastDesc', { line: alert.busLine, end: alert.endPoint }),
        duration: Number.POSITIVE_INFINITY,
      });
    };

    const drainQueue = () => {
      const next = queue.shift();
      if (!next) {
        toastTimer = null;
        return;
      }
      showSosToast(next);
      toastTimer = window.setTimeout(drainQueue, SOS_TOAST_GAP_MS);
    };

    const enqueueToast = (alert: SosAlertRecord) => {
      if (toastedRef.current.has(alert.id)) return;
      toastedRef.current.add(alert.id);
      queue.push(alert);
      if (toastTimer === null) {
        toastTimer = window.setTimeout(drainQueue, 0);
      }
    };

    const handleSnapshot = (incoming: SosAlertRecord[]) => {
      const incomingIds = new Set(incoming.map((a) => a.id));
      if (baselineRef.current === null) {
        baselineRef.current = incomingIds;
      } else {
        incoming.forEach((alert) => {
          if (
            !baselineRef.current?.has(alert.id) &&
            !dismissedRef.current.has(alert.id)
          ) {
            enqueueToast(alert);
          }
        });
      }
      // Prune dismissed ids that cleared from the database.
      dismissedRef.current = new Set(
        [...dismissedRef.current].filter((id) => incomingIds.has(id))
      );
      setDismissedIds([...dismissedRef.current]);
      setAlerts(incoming);
    };

    const unsubscribe = subscribeSosAlerts(handleSnapshot);

    return () => {
      unsubscribe();
      if (toastTimer !== null) window.clearTimeout(toastTimer);
      queue.length = 0;
      baselineRef.current = null;
      toastedRef.current = new Set();
    };
  }, [adminSession, t]);

  const dismissAlert = useCallback(
    async (alert: SosAlertRecord) => {
      dismissedRef.current.add(alert.id);
      toastedRef.current.add(alert.id); // never re-toast a handled beacon
      setDismissedIds([...dismissedRef.current]);
      const persisted = await acknowledgeSosAlert(
        alert.driverUid,
        adminSession?.email ?? ''
      );
      if (!persisted) {
        toast.info(t('nav.sosDismissedLocal', { name: alert.driverName }), {
          duration: 5000,
        });
      }
    },
    [adminSession?.email, t]
  );

  const visibleAlerts = adminSession
    ? alerts.filter((a) => !dismissedIds.includes(a.id))
    : [];

  return { alerts: visibleAlerts, dismissAlert };
}
