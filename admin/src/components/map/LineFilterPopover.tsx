import React, { useEffect, useRef, useState } from 'react';
import { ListFilter, Check } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { cn } from '../../utils/cn';

export interface LineFilterOption {
  lineId: string;
  color: string;
}

interface LineFilterPopoverProps {
  options: LineFilterOption[];
  hiddenLines: ReadonlySet<string>;
  onToggle: (lineId: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

/**
 * Multi-select popover for showing/hiding bus lines on the fleet map.
 * A line is hidden when its lowercased id is present in `hiddenLines`.
 */
export const LineFilterPopover: React.FC<LineFilterPopoverProps> = ({
  options,
  hiddenLines,
  onToggle,
  onShowAll,
  onHideAll,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close on click-outside (capture-phase so map popups don't interfere)
  useEffect(() => {
    if (!open) return;
    const onDocPointer = (ev: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocPointer, true);
    return () => document.removeEventListener('mousedown', onDocPointer, true);
  }, [open]);

  const visibleCount = options.filter((o) => !hiddenLines.has(o.lineId.toLowerCase())).length;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={t('map.lineFilterTitle')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all',
          open
            ? 'bg-brand-600/30 text-brand-300 border-brand-500/50'
            : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white'
        )}
      >
        <ListFilter className="w-3.5 h-3.5 text-brand-400" />
        <span className="tabular-nums">
          {visibleCount}/{options.length}
        </span>
        <span className="hidden sm:inline">{t('map.lineFilter')}</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable
          className="absolute top-full mt-2 start-0 w-64 max-w-[calc(100vw-2rem)] z-[500] bg-slate-900/97 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('map.lineFilterTitle')}
            </span>
            <div className="flex gap-2 text-[10px] font-semibold">
              <button type="button" onClick={onShowAll} className="text-emerald-400 hover:text-emerald-300">
                {t('map.lineFilterAll')}
              </button>
              <button type="button" onClick={onHideAll} className="text-slate-400 hover:text-slate-200">
                {t('map.lineFilterNone')}
              </button>
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
            {options.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-3">{t('map.noLines')}</p>
            )}
            {options.map((opt) => {
              const visible = !hiddenLines.has(opt.lineId.toLowerCase());
              return (
                <button
                  key={opt.lineId}
                  type="button"
                  role="option"
                  aria-selected={visible}
                  onClick={() => onToggle(opt.lineId)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left transition-colors',
                    visible ? 'text-slate-200 hover:bg-slate-800/80' : 'text-slate-500 hover:bg-slate-800/50'
                  )}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                    style={{ backgroundColor: opt.color, opacity: visible ? 1 : 0.3 }}
                  />
                  <span className="flex-1 truncate">{opt.lineId}</span>
                  <span
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center shrink-0',
                      visible ? 'bg-brand-600 border-brand-400' : 'border-slate-600'
                    )}
                  >
                    {visible && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
