import React, { useEffect, useRef, useState } from 'react';
import { Siren } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { useSosAlerts } from '../../hooks/useSosAlerts';
import { SosAlertRecord } from '../../types';

const formatTriggerTime = (triggeredAt: string): string => {
  const parsed = Date.parse(triggeredAt);
  if (Number.isNaN(parsed)) return '—';
  return new Date(parsed).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Navbar SOS beacon: red badge with the active emergency count plus a
 * dropdown panel listing live driver SOS alerts with acknowledge/dismiss.
 * Renders nothing when no admin session is active.
 */
export const SosAlertBell: React.FC = () => {
  const { adminSession } = useAdminAuth();
  const { t } = useTranslation();
  const { alerts, dismissAlert } = useSosAlerts();
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open]);

  if (!adminSession) return null;

  const count = alerts.length;
  const active = count > 0;

  const handleAcknowledge = async (alert: SosAlertRecord) => {
    if (busyId) return;
    setBusyId(alert.id);
    try {
      await dismissAlert(alert);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={
          active
            ? count > 1
              ? t('nav.sosAlertActiveMany', { count })
              : t('nav.sosAlertActiveOne', { count })
            : t('nav.sosNoneActive')
        }
        className={`relative flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 transition-all ${
          active
            ? 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/40 text-rose-300'
            : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/50 text-slate-400'
        }`}
      >
        <span className="relative flex h-4 w-4 items-center justify-center">
          <Siren className={`w-4 h-4 ${active ? 'text-rose-400' : 'text-slate-500'}`} />
          {active && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
          )}
        </span>
        {active && (
          <span className="min-w-[1.1rem] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold leading-4 text-center">
            {count}
          </span>
        )}
        <span className="hidden sm:inline text-xs font-semibold">SOS</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('nav.sosMenuLabel')}
          className="absolute end-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-slate-900 border border-rose-500/30 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
        >
          <div className="px-3.5 pt-3 pb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">
              {t('nav.sosHeader')}
            </span>
            <span className="text-[10px] font-semibold text-slate-500">{t('nav.sosLiveCount', { count })}</span>
          </div>

          <div className="px-2 pb-2 space-y-1.5 max-h-80 overflow-y-auto">
            {count === 0 && (
              <p className="px-2 py-4 text-xs text-slate-400 text-center">
                {t('nav.sosEmpty')}
              </p>
            )}
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-100 truncate">
                      {alert.driverName}
                      <span className="ms-1.5 text-rose-400">· {alert.busLine}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {t('nav.sosHeadingTo', { name: alert.endPoint })}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {t('nav.sosTriggeredAt', { time: formatTriggerTime(alert.triggeredAt) })}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => handleAcknowledge(alert)}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 transition-colors disabled:opacity-50"
                  >
                    {busyId === alert.id ? t('nav.sosSaving') : t('nav.sosAcknowledge')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
