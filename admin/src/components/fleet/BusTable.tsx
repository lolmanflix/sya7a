import React, { useState } from 'react';
import { Search, Power, Trash2, Edit3, MapPin } from 'lucide-react';
import { BusRouteDefinition } from '../../types';

interface BusTableProps {
  buses: BusRouteDefinition[];
  onToggleActive: (companyId: string, busId: string, currentActive: boolean) => void;
  onEditBus: (bus: BusRouteDefinition) => void;
  onDeleteBus: (companyId: string, busId: string) => void;
  selectedCompanyFilter?: string;
}

export const BusTable: React.FC<BusTableProps> = ({
  buses,
  onToggleActive,
  onEditBus,
  onDeleteBus,
  selectedCompanyFilter,
}) => {
  const [search, setSearch] = useState('');

  const filtered = buses.filter((b) => {
    const matchesSearch =
      b.lineId.toLowerCase().includes(search.toLowerCase()) ||
      b.startPoint.toLowerCase().includes(search.toLowerCase()) ||
      b.endPoint.toLowerCase().includes(search.toLowerCase()) ||
      b.busId.toLowerCase().includes(search.toLowerCase());

    const matchesCompany =
      !selectedCompanyFilter || selectedCompanyFilter === 'all' || b.companyId.toLowerCase() === selectedCompanyFilter.toLowerCase();

    return matchesSearch && matchesCompany;
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lines, terminals, or bus ID..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <span className="text-xs text-slate-400">
          Showing <strong className="text-white">{filtered.length}</strong> of {buses.length} buses
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/40 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Line & ID</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Terminals (Start ➔ End)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No buses found matching current filters.
                </td>
              </tr>
            ) : (
              filtered.map((bus) => (
                <tr key={`${bus.companyId}-${bus.busId}`} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white text-sm block">{bus.lineId}</span>
                    <span className="text-[10px] font-mono text-slate-500">{bus.busId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {bus.companyId}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="truncate">{bus.startPoint}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 truncate mt-0.5">
                      <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">{bus.endPoint}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleActive(bus.companyId, bus.busId, bus.isActive)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                        bus.isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <Power className={`w-3 h-3 ${bus.isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      {bus.isActive ? 'Active Trip' : 'Idle / Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditBus(bus)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                        title="Edit Route Coordinates"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteBus(bus.companyId, bus.busId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Bus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
