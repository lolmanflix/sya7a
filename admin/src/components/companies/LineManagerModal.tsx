import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CompanyRecord } from '../../types';
import { Plus, Trash2, Route, Edit2, Check, X } from 'lucide-react';
import { renameCompanyLine, deleteCompanyLine, updateCompanyLines } from '../../services/companiesService';
import { toast } from 'sonner';

interface LineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyRecord | null;
}

export const LineManagerModal: React.FC<LineManagerModalProps> = ({
  isOpen,
  onClose,
  company,
}) => {
  if (!company) return null;

  const [newLine, setNewLine] = useState('');
  const [editingLine, setEditingLine] = useState<string | null>(null);
  const [renamedValue, setRenamedValue] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddLine = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newLine.trim();
    if (!clean) return;
    if (company.busLines.includes(clean)) {
      toast.error('This bus line already exists for this operator.');
      return;
    }

    setSaving(true);
    try {
      await updateCompanyLines(company.id, [...company.busLines, clean]);
      toast.success(`Added line "${clean}" to ${company.name}`);
      setNewLine('');
    } catch {
      toast.error('Failed to add line');
    } finally {
      setSaving(false);
    }
  };

  const handleStartRename = (line: string) => {
    setEditingLine(line);
    setRenamedValue(line);
  };

  const handleSaveRename = async (oldLine: string) => {
    const clean = renamedValue.trim();
    if (!clean || clean === oldLine) {
      setEditingLine(null);
      return;
    }

    setSaving(true);
    try {
      await renameCompanyLine(company.id, oldLine, clean);
      toast.success(`Renamed line "${oldLine}" to "${clean}" and updated buses.`);
      setEditingLine(null);
    } catch {
      toast.error('Failed to rename line');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLine = async (lineToDelete: string) => {
    if (confirm(`Are you sure you want to delete bus line "${lineToDelete}"?`)) {
      try {
        await deleteCompanyLine(company.id, lineToDelete);
        toast.success(`Deleted line "${lineToDelete}"`);
      } catch {
        toast.error('Failed to delete line');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Bus Lines CRUD - ${company.name}`}
      subtitle="Add new routes, rename existing lines across all buses, or remove lines."
    >
      <div className="space-y-4">
        {/* Create Line Form */}
        <form onSubmit={handleAddLine} className="flex gap-2">
          <input
            type="text"
            value={newLine}
            onChange={(e) => setNewLine(e.target.value)}
            placeholder="Enter new line name (e.g. Line 5 or Airport Express)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add Line
          </button>
        </form>

        {/* Existing Lines List with Edit / Delete Actions */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {company.busLines.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No lines configured yet.</p>
          ) : (
            company.busLines.map((line) => (
              <div
                key={line}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200"
              >
                {editingLine === line ? (
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <input
                      type="text"
                      value={renamedValue}
                      onChange={(e) => setRenamedValue(e.target.value)}
                      className="flex-1 bg-slate-900 border border-brand-500 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(line)}
                      className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                      title="Confirm Rename"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingLine(null)}
                      className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <Route className="w-4 h-4 text-brand-400 shrink-0" />
                    <span className="font-semibold text-white">{line}</span>
                  </div>
                )}

                {editingLine !== line && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartRename(line)}
                      className="p-1 text-slate-400 hover:text-brand-300 hover:bg-slate-700 rounded transition-colors"
                      title="Rename Line across all buses"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLine(line)}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      title="Delete Line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
