import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BusRouteDefinition, CompanyRecord } from '../../types';
import { Bus, Building2, Route, Power } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { toast } from 'sonner';

interface VehicleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: CompanyRecord[];
  existingBuses: BusRouteDefinition[];
  onSaveVehicle: (companyId: string, vehicle: BusRouteDefinition) => Promise<void>;
  vehicleToEdit?: BusRouteDefinition | null;
}

/**
 * Modal for registering a new bus vehicle in the fleet.
 */
export const VehicleRegistrationModal: React.FC<VehicleRegistrationModalProps> = ({
  isOpen,
  onClose,
  companies,
  existingBuses,
  onSaveVehicle,
  vehicleToEdit,
}) => {
  const { t } = useTranslation();
  const [companyId, setCompanyId] = useState<string>(
    vehicleToEdit?.companyId || companies[0]?.id || 'cta'
  );
  const [busId, setBusId] = useState<string>(vehicleToEdit?.busId || '');
  const [lineId, setLineId] = useState<string>(vehicleToEdit?.lineId || '');
  const [isActive, setIsActive] = useState<boolean>(vehicleToEdit?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  const selectedCompany = companies.find((c) => c.id === companyId);
  const availableLines = selectedCompany?.busLines || [];

  // Auto-fill route info from existing line if available
  const matchingLineRoute = existingBuses.find(
    (b) => b.companyId.toLowerCase() === companyId.toLowerCase() && b.lineId.toLowerCase() === lineId.toLowerCase()
  );

  /**
   * Persists new vehicle registration data.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBusId = busId.trim() || `${lineId.trim() || 'BUS'}-${Date.now().toString().slice(-4)}`;
    const cleanLineId = lineId.trim();

    if (!cleanLineId) {
      toast.error(t('fleet.selectLineError'));
      return;
    }

    setSaving(true);
    try {
      const vehicleRecord: BusRouteDefinition = {
        busId: cleanBusId,
        lineId: cleanLineId,
        companyId,
        startPoint: vehicleToEdit?.startPoint || matchingLineRoute?.startPoint || 'Central Depot',
        startLat: vehicleToEdit?.startLat || matchingLineRoute?.startLat || 30.0444,
        startLng: vehicleToEdit?.startLng || matchingLineRoute?.startLng || 31.2357,
        endPoint: vehicleToEdit?.endPoint || matchingLineRoute?.endPoint || 'Terminal Station',
        endLat: vehicleToEdit?.endLat || matchingLineRoute?.endLat || 30.0626,
        endLng: vehicleToEdit?.endLng || matchingLineRoute?.endLng || 31.2469,
        isActive,
        createdAt: vehicleToEdit?.createdAt || new Date().toISOString(),
      };

      await onSaveVehicle(companyId, vehicleRecord);
      toast.success(
        vehicleToEdit
          ? t('fleet.vehicleUpdated', { id: cleanBusId })
          : t('fleet.vehicleRegistered', { id: cleanBusId })
      );
      onClose();
    } catch {
      toast.error(t('fleet.registerError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicleToEdit ? t('fleet.editVehicleModal') : t('fleet.registerVehicleModal')}
      subtitle={t('fleet.vehicleModalSubtitle')}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Company Selection */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-brand-400" />
            {t('fleet.operatingCarrier')}
          </label>
          <select
            value={companyId}
            onChange={(e) => {
              setCompanyId(e.target.value);
              const comp = companies.find((c) => c.id === e.target.value);
              if (comp && comp.busLines.length > 0) {
                setLineId(comp.busLines[0]);
              }
            }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900">
                {c.name} ({c.id.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle / Fleet Unit ID */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium flex items-center gap-1.5">
            <Bus className="w-3.5 h-3.5 text-emerald-400" />
            {t('fleet.vehicleUnitLabel')}
          </label>
          <input
            type="text"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            disabled={!!vehicleToEdit}
            placeholder={t('fleet.vehicleUnitPlaceholder')}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 disabled:opacity-60"
          />
        </div>

        {/* Line Assignment */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium flex items-center gap-1.5">
            <Route className="w-3.5 h-3.5 text-blue-400" />
            {t('fleet.assignedLine')}
          </label>
          {availableLines.length > 0 ? (
            <select
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            >
              <option value="" disabled>{t('fleet.selectCarrierLine')}</option>
              {availableLines.map((line) => (
                <option key={line} value={line} className="bg-slate-900">
                  {t('fleet.lineOption', { line })}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              placeholder={t('fleet.linePlaceholder')}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          )}
        </div>

        {/* Road Status Toggle */}
        <div className="pt-2 border-t border-slate-800">
          <label className="text-slate-300 font-medium flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2">
              <Power className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              {t('fleet.operationalReadiness')}
            </span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isActive ? t('fleet.activeOnRoadPill') : t('fleet.idleInDepotPill')}
            </button>
          </label>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('fleet.activeVehiclesHint')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50"
          >
            {saving ? t('common.saving') : vehicleToEdit ? t('fleet.updateVehicle') : t('fleet.registerVehicle')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
