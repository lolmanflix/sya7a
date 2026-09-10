import React, { useState, useMemo } from 'react';
import { Route, Plus, Filter, Search, MapPin, Edit3, Trash2, Layers, Building2, ExternalLink } from 'lucide-react';
import { BusEditorModal } from '../components/fleet/BusEditorModal';
import { AddBusLineModal } from '../components/companies/AddBusLineModal';
import { LineManagerModal } from '../components/companies/LineManagerModal';
import { BusRouteDefinition, CompanyRecord } from '../types';
import { saveBus, deleteBus } from '../services/busesService';
import { renameCompanyLine, deleteCompanyLine } from '../services/companiesService';
import { toast } from 'sonner';

interface RoutesPageProps {
  buses: BusRouteDefinition[];
  companies: CompanyRecord[];
}

export const RoutesPage: React.FC<RoutesPageProps> = ({ buses, companies }) => {
  const [activeSubTab, setActiveSubTab] = useState<'corridors' | 'lines'>('corridors');
  const [search, setSearch] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAddLineOpen, setIsAddLineOpen] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<BusRouteDefinition | null>(null);
  const [selectedCompanyForLineManager, setSelectedCompanyForLineManager] = useState<CompanyRecord | null>(null);

  // Quick Rename Line state in catalog
  const [editingLineKey, setEditingLineKey] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // 1. Flattened Bus Lines across all companies
  const allBusLines = useMemo(() => {
    const list: { companyId: string; companyName: string; lineName: string; busesCount: number }[] = [];
    companies.forEach((comp) => {
      comp.busLines.forEach((line) => {
        const count = buses.filter(
          (b) => b.companyId.toLowerCase() === comp.id.toLowerCase() && b.lineId.toLowerCase() === line.toLowerCase()
        ).length;
        list.push({
          companyId: comp.id,
          companyName: comp.name,
          lineName: line,
          busesCount: count,
        });
      });
    });
    return list;
  }, [companies, buses]);

  // Filtered corridors
  const filteredCorridors = buses.filter((b) => {
    const matchesCompany =
      selectedCompanyFilter === 'all' ||
      b.companyId.toLowerCase() === selectedCompanyFilter.toLowerCase();
    const matchesSearch =
      b.lineId.toLowerCase().includes(search.toLowerCase()) ||
      b.startPoint.toLowerCase().includes(search.toLowerCase()) ||
      b.endPoint.toLowerCase().includes(search.toLowerCase()) ||
      b.busId.toLowerCase().includes(search.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  // Filtered lines catalog
  const filteredLines = allBusLines.filter((l) => {
    const matchesCompany =
      selectedCompanyFilter === 'all' ||
      l.companyId.toLowerCase() === selectedCompanyFilter.toLowerCase();
    const matchesSearch =
      l.lineName.toLowerCase().includes(search.toLowerCase()) ||
      l.companyName.toLowerCase().includes(search.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  const handleDeleteRoute = async (companyId: string, busId: string) => {
    if (confirm(`Are you sure you want to delete route definition '${busId}'?`)) {
      try {
        await deleteBus(companyId, busId);
        toast.success(`Deleted route ${busId}`);
      } catch {
        toast.error('Failed to delete route');
      }
    }
  };

  const handleSaveRenameLine = async (companyId: string, oldLine: string) => {
    const clean = renameValue.trim();
    if (!clean || clean === oldLine) {
      setEditingLineKey(null);
      return;
    }
    try {
      await renameCompanyLine(companyId, oldLine, clean);
      toast.success(`Renamed line to "${clean}"`);
      setEditingLineKey(null);
    } catch {
      toast.error('Failed to rename line');
    }
  };

  const handleDeleteLine = async (companyId: string, line: string) => {
    if (confirm(`Are you sure you want to delete line "${line}"? All associated fleet vehicles will be unlinked.`)) {
      try {
        await deleteCompanyLine(companyId, line);
        toast.success(`Deleted line "${line}"`);
      } catch {
        toast.error('Failed to delete line');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Route className="w-5 h-5 text-blue-400" />
            Transit Routes & Corridors
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Design transit paths, configure origin/destination terminal coordinates, and manage line catalogs.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setIsAddLineOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all border border-slate-700 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Add Line Code
          </button>

          <button
            onClick={() => {
              setRouteToEdit(null);
              setIsEditorOpen(true);
            }}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-brand-600/20 shrink-0"
          >
            <MapPin className="w-4 h-4" /> Design Route on Map
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Mapped Routes</div>
            <div className="text-xl font-bold text-white mt-0.5">{buses.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Route className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Line Codes</div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">{allBusLines.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Active Corridors</div>
            <div className="text-xl font-bold text-amber-300 mt-0.5">{buses.filter((b) => b.isActive).length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Operators</div>
            <div className="text-xl font-bold text-purple-300 mt-0.5">{companies.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Sub-tab Switcher & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl backdrop-blur-sm">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('corridors')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeSubTab === 'corridors'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            Route Corridors ({buses.length})
          </button>
          <button
            onClick={() => setActiveSubTab('lines')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeSubTab === 'lines'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Line Catalog ({allBusLines.length})
          </button>
        </div>

        {/* Search & Operator Filter */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeSubTab === 'corridors' ? 'Search route terminals or line...' : 'Search line names...'}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 shrink-0">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-slate-900">All Operators</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      {activeSubTab === 'corridors' ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/40 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Line Code</th>
                  <th className="py-3 px-4">Carrier Operator</th>
                  <th className="py-3 px-4">Origin Terminal (Start)</th>
                  <th className="py-3 px-4">Destination Terminal (End)</th>
                  <th className="py-3 px-4">GPS Coordinates</th>
                  <th className="py-3 px-4 text-right">Route Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCorridors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No route corridors match the selected criteria. Click &quot;Design Route on Map&quot; to configure a new route.
                    </td>
                  </tr>
                ) : (
                  filteredCorridors.map((route) => (
                    <tr key={`${route.companyId}-${route.busId}`} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white text-sm block">Line {route.lineId}</span>
                        <span className="text-[10px] font-mono text-slate-500">{route.busId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                          {route.companyId}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="flex items-center gap-1.5 text-blue-300 truncate">
                          <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="truncate">{route.startPoint || 'Origin'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="flex items-center gap-1.5 text-purple-300 truncate">
                          <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{route.endPoint || 'Destination'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">
                        <div>{route.startLat.toFixed(4)}, {route.startLng.toFixed(4)}</div>
                        <div className="text-slate-500">➔ {route.endLat.toFixed(4)}, {route.endLng.toFixed(4)}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setRouteToEdit(route);
                              setIsEditorOpen(true);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="Edit Route Coordinates on Map"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoute(route.companyId, route.busId)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="Delete Route Corridor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      ) : (
        /* Line Catalog Table */
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/40 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Line Name</th>
                  <th className="py-3 px-4">Carrier Operator</th>
                  <th className="py-3 px-4">Assigned Vehicles</th>
                  <th className="py-3 px-4 text-right">Line Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLines.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No bus lines found. Click &quot;Add Line Code&quot; to register a line.
                    </td>
                  </tr>
                ) : (
                  filteredLines.map((item) => {
                    const key = `${item.companyId}:::${item.lineName}`;
                    const isEditing = editingLineKey === key;
                    const comp = companies.find((c) => c.id === item.companyId);

                    return (
                      <tr key={key} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                className="bg-slate-800 border border-brand-500 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveRenameLine(item.companyId, item.lineName)}
                                className="px-2 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded text-[10px] font-semibold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingLineKey(null)}
                                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Route className="w-3.5 h-3.5 text-brand-400" />
                              Line {item.lineName}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            {item.companyName}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <span className="font-semibold text-white">{item.busesCount}</span> assigned vehicles
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingLineKey(key);
                                setRenameValue(item.lineName);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                              title="Rename Line Code"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {comp && (
                              <button
                                onClick={() => setSelectedCompanyForLineManager(comp)}
                                className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                                title="Open Carrier Line Manager"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteLine(item.companyId, item.lineName)}
                              className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                              title="Delete Line Code"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Map Route Editor Modal */}
      <BusEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        busToEdit={routeToEdit}
        companies={companies}
        onSaveBus={async (cid, b) => {
          await saveBus(cid, b);
        }}
      />

      {/* Add Bus Line Modal */}
      <AddBusLineModal
        isOpen={isAddLineOpen}
        onClose={() => setIsAddLineOpen(false)}
        companies={companies}
      />

      {/* Line Manager Modal */}
      <LineManagerModal
        isOpen={!!selectedCompanyForLineManager}
        onClose={() => setSelectedCompanyForLineManager(null)}
        company={selectedCompanyForLineManager}
      />
    </div>
  );
};
