import React from 'react';
import { Layers } from 'lucide-react';

/**
 * Modern floating legend overlay for the fleet map showing route and marker conventions.
 */
export const FleetMapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-xs space-y-2 shadow-2xl pointer-events-auto">
      <span className="font-bold text-white tracking-wider text-[10px] uppercase block border-b border-slate-800 pb-1 flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-brand-400" /> Map Legend
      </span>
      <div className="flex items-center gap-2">
        <span className="h-2 w-6 rounded-full bg-emerald-500 shadow-sm"></span>
        <span className="text-slate-300 font-medium">Active Bus Line (Road Network)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-5 rounded bg-emerald-600 border border-white text-[8px] font-bold text-white flex items-center justify-center">BUS</span>
        <span className="text-slate-300">Active Bus Vehicle</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-blue-600 border border-white text-[8px] text-white flex items-center justify-center font-bold">A</span>
        <span className="text-slate-300">Start Terminal</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-purple-600 border border-white text-[8px] text-white flex items-center justify-center font-bold">B</span>
        <span className="text-slate-300">Destination Terminal</span>
      </div>
    </div>
  );
};
