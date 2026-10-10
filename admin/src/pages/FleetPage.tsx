import React, { useState } from 'react';
import { Plus, Filter, Bus, Power, CheckCircle2, PauseCircle, Building2 } from 'lucide-react';
import { BusTable } from '../components/fleet/BusTable';
import { VehicleRegistrationModal } from '../components/fleet/VehicleRegistrationModal';
import { BusRouteDefinition, CompanyRecord } from '../types';
import { saveBus, toggleBusActive, deleteBus } from '../services/busesService';
import { useTranslation } from '../i18n/useTranslation';
import { toast } from 'sonner';

interface FleetPageProps {
  buses: BusRouteDefinition[];
  companies: CompanyRecord[];
}

/**
 * Fleet management dashboard showing road readiness, active vehicles, and dispatch controls.
 */
export const FleetPage: React.FC<FleetPageProps> = ({ buses, companies }) => {
  const { t } = useTranslation();
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'idle'>('all');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<BusRouteDefinition | null>(null);

  const activeCount = buses.filter((b) => b.isActive).length;
  const idleCount = buses.filter((b) => !b.isActive).length;
  const uniqueCarriersCount = new Set(buses.map((b) => b.companyId.toLowerCase())).size;

  /**
   * Toggles active dispatch status for a vehicle.
   */
  const handleToggle = async (companyId: string, busId: string, currentActive: boolean) => {
    try {
      await toggleBusActive(companyId, busId, !currentActive);
      toast.success(
        t('fleet.toggleSuccess', {
          id: busId,
          status: !currentActive ? t('fleet.statusActiveOnRoad') : t('fleet.statusMarkedIdle'),
        })
      );
    } catch {
      toast.error(t('fleet.toggleError'));
    }
  };

  /**
   * Deletes a vehicle record from the fleet directory.
   */
  const handleDelete = async (companyId: string, busId: string) => {
    if (confirm(t('fleet.deleteConfirm', { id: busId }))) {
      try {
        await deleteBus(companyId, busId);
        toast.success(t('fleet.deleteSuccess', { id: busId }));
      } catch {
        toast.error(t('fleet.deleteError'));
      }
    }
  };

  /**
   * Opens the vehicle registration modal.
   */
  const handleOpenNew = () => {
    setVehicleToEdit(null);
    setIsRegisterOpen(true);
  };

  /**
   * Opens the vehicle editor modal for an existing bus.
   */
  const handleOpenEdit = (bus: BusRouteDefinition) => {
    setVehicleToEdit(bus);
    setIsRegisterOpen(true);
  };

  // Filter buses by company and active/idle status
  const displayedBuses = buses.filter((b) => {
    const matchesCompany =
      selectedCompanyFilter === 'all' ||
      b.companyId.toLowerCase() === selectedCompanyFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? b.isActive : !b.isActive);
    return matchesCompany && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bus className="w-5 h-5 text-emerald-400" />
            {t('fleet.title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('fleet.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'all' ? 'bg-brand-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('fleet.allFilter', { count: buses.length })}
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                statusFilter === 'active' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {t('fleet.activeFilter', { count: activeCount })}
            </button>
            <button
              onClick={() => setStatusFilter('idle')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'idle' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('fleet.idleFilter', { count: idleCount })}
            </button>
          </div>

          {/* Company Filter */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[220px] truncate"
            >
              <option value="all" className="bg-slate-900">{t('fleet.allCarriers')}</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenNew}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20 shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0" /> {t('fleet.registerVehicle')}
          </button>
        </div>
      </div>

      {/* Fleet Telematics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{t('fleet.totalFleet')}</div>
            <div className="text-xl font-bold text-white mt-0.5">{buses.length}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Bus className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-emerald-400 font-medium uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {t('fleet.onRoad')}
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">{activeCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{t('fleet.depotIdle')}</div>
            <div className="text-xl font-bold text-slate-300 mt-0.5">{idleCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
            <PauseCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{t('fleet.carriers')}</div>
            <div className="text-xl font-bold text-purple-300 mt-0.5">{uniqueCarriersCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Bus Inventory Table */}
      <BusTable
        buses={displayedBuses}
        onToggleActive={handleToggle}
        onEditBus={handleOpenEdit}
        onDeleteBus={handleDelete}
        selectedCompanyFilter="all"
      />

      {/* Vehicle Registration & Assignment Modal */}
      <VehicleRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        companies={companies}
        existingBuses={buses}
        vehicleToEdit={vehicleToEdit}
        onSaveVehicle={async (cid, b) => {
          await saveBus(cid, b);
        }}
      />
    </div>
  );
};

