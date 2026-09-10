import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CompanyRecord } from '../../types';
import { Route, Plus } from 'lucide-react';
import { addCompanyLine } from '../../services/companiesService';
import { toast } from 'sonner';

interface AddBusLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: CompanyRecord[];
  initialCompanyId?: string;
  onLineAdded?: () => void;
}

export const AddBusLineModal: React.FC<AddBusLineModalProps> = ({
  isOpen,
  onClose,
  companies,
  initialCompanyId,
  onLineAdded,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    initialCompanyId || companies[0]?.id || 'cta'
  );
  const [lineName, setLineName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lineName.trim();
    if (!clean) {
      toast.error('Please enter a bus line name.');
      return;
    }

    const company = companies.find((c) => c.id.toLowerCase() === selectedCompanyId.toLowerCase());
    if (company && company.busLines.includes(clean)) {
      toast.error(`Line "${clean}" already exists for ${company.name}.`);
      return;
    }

    setSaving(true);
    try {
      await addCompanyLine(selectedCompanyId, clean);
      toast.success(`Added bus line "${clean}" to ${company?.name || selectedCompanyId.toUpperCase()}`);
      setLineName('');
      if (onLineAdded) onLineAdded();
      onClose();
    } catch {
      toast.error('Failed to add bus line.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Bus Line"
      subtitle="Register a new transit route identifier into the company's official busLines list."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Transit Operator</label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Bus Line Identifier / Name</label>
          <input
            type="text"
            value={lineName}
            onChange={(e) => setLineName(e.target.value)}
            placeholder="e.g. Line 115, M554, Airport Express, BRT-1"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            required
            autoFocus
          />
          <p className="text-[11px] text-slate-500 mt-1">
            This adds the route to the operator's official line catalog without requiring terminal coordinates.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
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
            className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <Route className="w-3.5 h-3.5" />
            {saving ? 'Adding...' : 'Add Bus Line'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
