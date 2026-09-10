import React from 'react';
import { Trash2 } from 'lucide-react';
import { BusStop } from '../../types';

interface RouteStopsListProps {
  stops: BusStop[];
  onUpdateName: (index: number, name: string) => void;
  onRemoveStop: (index: number) => void;
}

export const RouteStopsList: React.FC<RouteStopsListProps> = ({
  stops,
  onUpdateName,
  onRemoveStop,
}) => {
  return (
    <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
        <span>Route Stops Sequence ({stops.length}):</span>
        <span className="text-slate-500 font-normal">Click map to append intermediate stops</span>
      </div>
      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {stops.map((stop, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === stops.length - 1;
          const badgeBg = isFirst ? 'bg-blue-600' : isLast ? 'bg-purple-600' : 'bg-emerald-600';
          const label = isFirst ? 'A' : isLast ? 'B' : String(idx + 1);

          return (
            <div
              key={stop.id || idx}
              className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60"
            >
              <span
                className={`w-5 h-5 rounded-full ${badgeBg} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}
              >
                {label}
              </span>
              <input
                type="text"
                value={stop.name}
                onChange={(e) => onUpdateName(idx, e.target.value)}
                className="bg-transparent text-xs text-slate-200 flex-1 focus:outline-none border-b border-transparent focus:border-slate-500 px-1"
              />
              <span className="text-[10px] font-mono text-slate-400">
                {stop.lat.toFixed(3)}, {stop.lng.toFixed(3)}
              </span>
              {!isFirst && !isLast && (
                <button
                  type="button"
                  onClick={() => onRemoveStop(idx)}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Remove stop"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
