import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { DriverProfile, CompanyRecord } from '../../types';
import { Route } from 'lucide-react';
import { toast } from 'sonner';

interface DriverAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: DriverProfile | null;
  companies: CompanyRecord[];
  onSaveAssignments: (driverUid: string, companyId: string, lines: string[]) => Promise<void>;
}

export const DriverAssignModal: React.FC<DriverAssignModalProps> = ({
  isOpen,
  onClose,
  driver,
  companies,
  onSaveAssignments,
}) => {
  if (!driver) return null;

  const [companyId, setCompanyId] = useState<string>(driver.companyId);
  const [selectedLines, setSelectedLines] = useState<string[]>(driver.lines);
  const [saving, setSaving] = useState(false);

  const activeCompany = companies.find((c) => c.id === companyId);
  const availableLines = activeCompany?.busLines || [];

  const handleToggleLine = (line: string) => {
    if (selectedLines.includes(line)) {
      setSelectedLines(selectedLines.filter((l) => l !== line));
    } else {
      setSelectedLines([...selectedLines, line]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveAssignments(driver.uid, companyId, selectedLines);
      toast.success(`Updated line assignments for ${driver.displayName}`);
      onClose();
    } catch {
      toast.error('Failed to update driver assignments');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dispatch Settings - ${driver.displayName}`}
      subtitle={`Configure company operator and authorized bus lines for ${driver.email}`}
    >
      <div className="space-y-4">
        {/* Company Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Operating Transit Company</label>
          <select
            value={companyId}
            onChange={(e) => {
              setCompanyId(e.target.value);
              setSelectedLines([]); // reset lines when switching company
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>
        </div>

        {/* Lines Checklist */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Authorized Routes ({availableLines.length} available in {activeCompany?.name})
          </label>

          {availableLines.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-800/40 rounded-xl">
              No lines registered under this company yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {availableLines.map((line) => {
                const checked = selectedLines.includes(line);
                return (
                  <label
                    key={line}
                    onClick={() => handleToggleLine(line)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? 'bg-brand-500/15 border-brand-500/40 text-brand-300'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}} // Handled by container
                      className="w-4 h-4 rounded text-brand-600 bg-slate-800 border-slate-700 pointer-events-none"
                    />
                    <Route className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-xs font-medium truncate">{line}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Assignments'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
