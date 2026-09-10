import React, { useState } from 'react';
import { Search, Shield, Route, Settings2, Trash2, Copy, Check, Video } from 'lucide-react';
import { DriverProfile } from '../../types';
import { toast } from 'sonner';

interface DriverTableProps {
  drivers: DriverProfile[];
  onAssignDriver: (driver: DriverProfile) => void;
  onDeleteDriver: (driverUid: string, driverName: string) => void;
  onSafetyCheck?: (driver: DriverProfile) => void;
  selectedCompanyFilter?: string;
}

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  onAssignDriver,
  onDeleteDriver,
  onSafetyCheck,
  selectedCompanyFilter,
}) => {
  const [search, setSearch] = useState('');
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  const handleCopy = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    toast.success('Driver UID copied');
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const filtered = drivers.filter((d) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      d.displayName.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.uid.toLowerCase().includes(q) ||
      d.companyId.toLowerCase().includes(q) ||
      d.lines.some((l) => l.toLowerCase().includes(q));

    const matchesCompany =
      !selectedCompanyFilter || selectedCompanyFilter === 'all' || d.companyId.toLowerCase() === selectedCompanyFilter.toLowerCase();

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
            placeholder="Search driver by name, email, line, or UID..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <span className="text-xs text-slate-400">
          Showing: <strong className="text-white">{filtered.length}</strong> of {drivers.length} drivers
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/40 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Driver</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Assigned Lines</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No drivers found.
                </td>
              </tr>
            ) : (
              filtered.map((driver) => (
                <tr key={driver.uid} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                        {driver.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block">{driver.displayName}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-slate-400 text-xs">{driver.email}</span>
                          <span className="text-slate-600">•</span>
                          <span className="font-mono text-[10px] text-slate-500">{driver.uid.substring(0, 8)}...</span>
                          <button
                            onClick={() => handleCopy(driver.uid)}
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                            title="Copy Driver UID"
                          >
                            {copiedUid === driver.uid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center gap-1 w-max">
                      <Shield className="w-3 h-3" />
                      {driver.companyId}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-sm">
                      {driver.lines.length === 0 ? (
                        <span className="text-slate-500 italic text-[11px]">No lines assigned</span>
                      ) : (
                        driver.lines.map((l) => (
                          <span
                            key={l}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium text-[11px] flex items-center gap-1"
                          >
                            <Route className="w-3 h-3 text-brand-400" />
                            {l}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onSafetyCheck && (
                        <button
                          onClick={() => onSafetyCheck(driver)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 text-xs font-semibold inline-flex items-center gap-1 transition-colors border border-slate-700/60"
                          title="SafeTrip Camera & Mic Access"
                        >
                          <Video className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden sm:inline">Safety</span>
                        </button>
                      )}
                      <button
                        onClick={() => onAssignDriver(driver)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                        Edit Lines
                      </button>
                      <button
                        onClick={() => onDeleteDriver(driver.uid, driver.displayName)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Driver Profile"
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
