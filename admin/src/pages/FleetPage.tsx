import React, { useState } from 'react';
import { Plus, Filter, Route } from 'lucide-react';
import { BusTable } from '../components/fleet/BusTable';
import { BusEditorModal } from '../components/fleet/BusEditorModal';
import { AddBusLineModal } from '../components/companies/AddBusLineModal';
import { BusRouteDefinition, CompanyRecord } from '../types';
import { saveBus, toggleBusActive, deleteBus } from '../services/busesService';
import { toast } from 'sonner';

interface FleetPageProps {
  buses: BusRouteDefinition[];
  companies: CompanyRecord[];
}

export const FleetPage: React.FC<FleetPageProps> = ({ buses, companies }) => {
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAddLineOpen, setIsAddLineOpen] = useState(false);
  const [busToEdit, setBusToEdit] = useState<BusRouteDefinition | null>(null);

  const handleToggle = async (companyId: string, busId: string, currentActive: boolean) => {
    try {
      await toggleBusActive(companyId, busId, !currentActive);
      toast.success(`Bus ${busId} is now ${!currentActive ? 'ACTIVE on road' : 'marked IDLE'}.`);
    } catch {
      toast.error('Failed to update bus status.');
    }
  };

  const handleDelete = async (companyId: string, busId: string) => {
    if (confirm(`Are you sure you want to delete bus route '${busId}'?`)) {
      try {
        await deleteBus(companyId, busId);
        toast.success(`Deleted bus ${busId}`);
      } catch {
        toast.error('Failed to delete bus');
      }
    }
  };

  const handleOpenNew = () => {
    setBusToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (bus: BusRouteDefinition) => {
    setBusToEdit(bus);
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Bus Fleet & Route Configurator</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure line assignments, coordinates, terminal addresses, and active trip statuses.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Company Filter */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Operators</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsAddLineOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 shrink-0"
            title="Create a new bus line without coordinates"
          >
            <Route className="w-4 h-4" /> Add Bus Line
          </button>

          <button
            onClick={handleOpenNew}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-brand-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" /> Register Bus Route
          </button>
        </div>
      </div>

      {/* Bus Inventory Table */}
      <BusTable
        buses={buses}
        onToggleActive={handleToggle}
        onEditBus={handleOpenEdit}
        onDeleteBus={handleDelete}
        selectedCompanyFilter={selectedCompanyFilter}
      />

      {/* Bus Editor Modal (for route coordinates & terminals) */}
      <BusEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        busToEdit={busToEdit}
        companies={companies}
        onSaveBus={async (cid, b) => {
          await saveBus(cid, b);
        }}
      />

      {/* Add Bus Line Modal (directly to busLines catalog) */}
      <AddBusLineModal
        isOpen={isAddLineOpen}
        onClose={() => setIsAddLineOpen(false)}
        companies={companies}
      />
    </div>
  );
};
