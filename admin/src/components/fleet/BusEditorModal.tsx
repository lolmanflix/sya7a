import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { RoutePickerMap } from '../map/RoutePickerMap';
import { BusRouteDefinition, BusStop, CompanyRecord } from '../../types';
import { toast } from 'sonner';

interface BusEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  busToEdit?: BusRouteDefinition | null;
  companies: CompanyRecord[];
  onSaveBus: (companyId: string, bus: BusRouteDefinition) => Promise<void>;
}

export const BusEditorModal: React.FC<BusEditorModalProps> = ({
  isOpen,
  onClose,
  busToEdit,
  companies,
  onSaveBus,
}) => {
  const [companyId, setCompanyId] = useState<string>(busToEdit?.companyId || companies[0]?.id || 'cta');
  const [lineId, setLineId] = useState<string>(busToEdit?.lineId || '');
  const [startPoint, setStartPoint] = useState<string>(busToEdit?.startPoint || '');
  const [startLat, setStartLat] = useState<number>(busToEdit?.startLat || 30.0444);
  const [startLng, setStartLng] = useState<number>(busToEdit?.startLng || 31.2357);
  const [endPoint, setEndPoint] = useState<string>(busToEdit?.endPoint || '');
  const [endLat, setEndLat] = useState<number>(busToEdit?.endLat || 30.0561);
  const [endLng, setEndLng] = useState<number>(busToEdit?.endLng || 31.3300);
  const [stops, setStops] = useState<BusStop[] | undefined>(busToEdit?.stops);
  const [isActive, setIsActive] = useState<boolean>(busToEdit?.isActive ?? false);
  const [saving, setSaving] = useState(false);

  const selectedCompany = companies.find((c) => c.id === companyId);
  const availableLines = selectedCompany?.busLines || [];

  const handleStopsChange = (
    updatedStops: BusStop[],
    start: { lat: number; lng: number; address: string },
    end: { lat: number; lng: number; address: string }
  ) => {
    setStops(updatedStops);
    setStartLat(start.lat);
    setStartLng(start.lng);
    setStartPoint(start.address);
    setEndLat(end.lat);
    setEndLng(end.lng);
    setEndPoint(end.address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lineId.trim()) {
      toast.error('Please specify or select a bus line');
      return;
    }

    setSaving(true);
    try {
      const busId = busToEdit?.busId || `${lineId.trim()}-${Date.now()}`;
      const bus: BusRouteDefinition = {
        busId,
        lineId: lineId.trim(),
        companyId,
        startPoint: startPoint || 'Start Station',
        startLat,
        startLng,
        endPoint: endPoint || 'Destination Station',
        endLat,
        endLng,
        stops: stops && stops.length > 0 ? stops : undefined,
        isActive,
        createdAt: busToEdit?.createdAt || new Date().toISOString(),
      };

      await onSaveBus(companyId, bus);
      toast.success(busToEdit ? 'Route updated successfully' : 'New bus registered successfully');
      onClose();
    } catch {
      toast.error('Failed to save bus route');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={busToEdit ? `Edit Bus Route - ${busToEdit.lineId}` : 'Register New Bus Route'}
      subtitle="Configure mandatory stops along the route; the bus path follows actual road network."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company & Line Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Operating Transit Company</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Bus Line Name</label>
            {availableLines.length > 0 ? (
              <div className="flex gap-2">
                <select
                  value={lineId}
                  onChange={(e) => setLineId(e.target.value)}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="">Select Existing...</option>
                  {availableLines.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={lineId}
                  onChange={(e) => setLineId(e.target.value)}
                  placeholder="Or enter new line"
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            ) : (
              <input
                type="text"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                placeholder="e.g. Line 1, M554, BRT-1"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            )}
          </div>
        </div>

        {/* Visual Map Point Picker */}
        <div className="border border-slate-800 rounded-2xl p-3 bg-slate-950/40">
          <RoutePickerMap
            initialStops={stops}
            startLat={startLat}
            startLng={startLng}
            endLat={endLat}
            endLng={endLng}
            startAddress={startPoint}
            endAddress={endPoint}
            onStopsChange={handleStopsChange}
          />
        </div>

        {/* Start & End Terminal Text Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-medium text-blue-400 mb-1">Start Station Address (A)</label>
            <input
              type="text"
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block font-medium text-purple-400 mb-1">Destination Station Address (B)</label>
            <input
              type="text"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
            />
          </div>
        </div>

        {/* Active Toggle & Buttons */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 bg-slate-800 border-slate-700 focus:ring-brand-500"
            />
            <span>Set as Active Bus on Road immediately</span>
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/20 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Bus Route'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
