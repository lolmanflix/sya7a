import React, { useState, useMemo } from 'react';
import { Route, Plus, Filter, Search, MapPin, Edit3, Trash2, Layers, Building2, Navigation } from 'lucide-react';
import { BusEditorModal } from '../components/fleet/BusEditorModal';
import { AddBusLineModal } from '../components/companies/AddBusLineModal';
import { LineManagerModal } from '../components/companies/LineManagerModal';
import { LineCatalogTable } from '../components/routes/LineCatalogTable';
import { BusRouteDefinition, CompanyRecord } from '../types';
import { saveBus, deleteBus } from '../services/busesService';
import { useLineOperations } from '../hooks/useLineOperations';
import { useTranslation } from '../i18n/useTranslation';
import { toast } from 'sonner';

interface RoutesPageProps {
  buses: BusRouteDefinition[];
  companies: CompanyRecord[];
}

/**
 * Transit corridors manager and visual route designer page.
 */
export const RoutesPage: React.FC<RoutesPageProps> = ({ buses, companies }) => {
  const { t } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<'corridors' | 'lines'>('corridors');
  const [search, setSearch] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const { handleRenameLine, handleDeleteLine } = useLineOperations();

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAddLineOpen, setIsAddLineOpen] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<BusRouteDefinition | null>(null);
  const [selectedCompanyForLineManager, setSelectedCompanyForLineManager] = useState<CompanyRecord | null>(null);

  // Flattened Bus Lines across all companies
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

  /**
   * Deletes a configured route definition from the company node.
   */
  const handleDeleteRoute = async (companyId: string, busId: string) => {
    if (confirm(t('routes.deleteConfirm', { id: busId }))) {
      try {
        await deleteBus(companyId, busId);
        toast.success(t('routes.deleteSuccess', { id: busId }));
      } catch {
        toast.error(t('routes.deleteError'));
      }
    }
  };


  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Route className="w-5 h-5 text-brand-400" />
            {t('routes.title')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('routes.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAddLineOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all shadow-md whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            {t('routes.addLineCode')}
          </button>
          <button
            type="button"
            onClick={() => {
              setRouteToEdit(null);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/25 whitespace-nowrap"
          >
            <Route className="w-3.5 h-3.5 shrink-0" />
            {t('routes.designOnMap')}
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-sm">
          <span className="text-[11px] font-medium text-slate-400">{t('routes.totalCorridors')}</span>
          <p className="text-lg font-bold text-white mt-0.5">{buses.length}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-sm">
          <span className="text-[11px] font-medium text-slate-400">{t('routes.registeredLineCodes')}</span>
          <p className="text-lg font-bold text-brand-400 mt-0.5">{allBusLines.length}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-sm">
          <span className="text-[11px] font-medium text-slate-400">{t('routes.activeRoadRoutes')}</span>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">{buses.filter((b) => b.isActive).length}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-sm">
          <span className="text-[11px] font-medium text-slate-400">{t('routes.operatingCarriers')}</span>
          <p className="text-lg font-bold text-purple-400 mt-0.5">{companies.length}</p>
        </div>
      </div>

      {/* Tabs & Search Filter Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setActiveSubTab('corridors')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeSubTab === 'corridors'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            {t('routes.tabCorridors', { count: buses.length })}
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
            {t('routes.tabLines', { count: allBusLines.length })}
          </button>
        </div>

        {/* Search & Operator Filter */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeSubTab === 'corridors' ? t('routes.searchCorridors') : t('routes.searchLines')}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl ps-8 pe-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 shrink-0">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs max-w-[130px] sm:max-w-[200px] truncate"
            >
              <option value="all" className="bg-slate-900">{t('routes.allOperators')}</option>
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
            <table
              className={`w-full text-start text-xs ${filteredCorridors.length > 0 ? 'min-w-[860px]' : ''}`}
            >
              <thead className="bg-slate-800/40 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">{t('routes.colLineCode')}</th>
                  <th className="py-3 px-4">{t('routes.colCarrier')}</th>
                  <th className="py-3 px-4">{t('routes.colOrigin')}</th>
                  <th className="py-3 px-4">{t('routes.colStops')}</th>
                  <th className="py-3 px-4">{t('routes.colDestination')}</th>
                  <th className="py-3 px-4 text-end">{t('routes.colActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCorridors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      {t('routes.emptyTable')}
                    </td>
                  </tr>
                ) : (
                  filteredCorridors.map((route) => {
                    const stopsCount = route.stops && route.stops.length > 0 ? route.stops.length : 2;
                    return (
                      <tr key={`${route.companyId}-${route.busId}`} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-white text-sm block">{t('routes.lineShort', { line: route.lineId })}</span>
                          <span className="text-[10px] font-mono text-slate-500">{route.busId}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                            {route.companyId}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-[180px]">
                          <div className="flex items-center gap-1.5 text-blue-300 truncate">
                            <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                            <span className="truncate">{route.startPoint || t('routes.originFallback')}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-[200px]">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                            {t('routes.stopsCount', { count: stopsCount })}
                          </span>
                          {route.stops && route.stops.length > 2 && (
                            <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                              {t('routes.intermediateStops', { count: route.stops.length - 2 })}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-[180px]">
                          <div className="flex items-center gap-1.5 text-purple-300 truncate">
                            <Navigation className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="truncate">{route.endPoint || t('routes.destinationFallback')}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setRouteToEdit(route);
                                setIsEditorOpen(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                              title={t('routes.editRouteTitle')}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoute(route.companyId, route.busId)}
                              className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                              title={t('routes.deleteRouteTitle')}
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
      ) : (
        <LineCatalogTable
          lines={filteredLines}
          companies={companies}
          onRenameLine={handleRenameLine}
          onDeleteLine={handleDeleteLine}
          onOpenCompanyLineManager={(comp) => setSelectedCompanyForLineManager(comp)}
        />
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
