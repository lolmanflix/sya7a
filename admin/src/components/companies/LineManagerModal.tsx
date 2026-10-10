import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CompanyRecord } from '../../types';
import { Plus, Trash2, Route, Edit2, Check, X } from 'lucide-react';
import { renameCompanyLine, deleteCompanyLine, updateCompanyLines } from '../../services/companiesService';
import { useTranslation } from '../../i18n/useTranslation';
import { toast } from 'sonner';

interface LineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyRecord | null;
}

/**
 * Modal for managing bus lines assigned to a specific transport company.
 */
export const LineManagerModal: React.FC<LineManagerModalProps> = ({
  isOpen,
  onClose,
  company,
}) => {
  const { t } = useTranslation();

  if (!company) return null;

  const [newLine, setNewLine] = useState('');
  const [editingLine, setEditingLine] = useState<string | null>(null);
  const [renamedValue, setRenamedValue] = useState('');
  const [saving, setSaving] = useState(false);

  /**
   * Adds a new bus line to the company line catalog.
   */
  const handleAddLine = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newLine.trim();
    if (!clean) return;
    if (company.busLines.includes(clean)) {
      toast.error(t('companies.lineExistsOperator'));
      return;
    }

    setSaving(true);
    try {
      await updateCompanyLines(company.id, [...company.busLines, clean]);
      toast.success(t('companies.lineAddedTo', { line: clean, name: company.name }));
      setNewLine('');
    } catch {
      toast.error(t('companies.addLineErrorShort'));
    } finally {
      setSaving(false);
    }
  };

  /**
   * Initiates inline line renaming mode.
   */
  const handleStartRename = (line: string) => {
    setEditingLine(line);
    setRenamedValue(line);
  };

  /**
   * Persists updated line name across all related routes.
   */
  const handleSaveRename = async (oldLine: string) => {
    const clean = renamedValue.trim();
    if (!clean || clean === oldLine) {
      setEditingLine(null);
      return;
    }

    setSaving(true);
    try {
      await renameCompanyLine(company.id, oldLine, clean);
      toast.success(t('companies.lineRenamed', { old: oldLine, new: clean }));
      setEditingLine(null);
    } catch {
      toast.error(t('companies.renameError'));
    } finally {
      setSaving(false);
    }
  };

  /**
   * Removes a bus line from the company.
   */
  const handleDeleteLine = async (lineToDelete: string) => {
    if (confirm(t('companies.deleteLineConfirm', { line: lineToDelete }))) {
      try {
        await deleteCompanyLine(company.id, lineToDelete);
        toast.success(t('companies.lineDeleted', { line: lineToDelete }));
      } catch {
        toast.error(t('companies.deleteLineError'));
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('companies.linesCrudTitle', { name: company.name })}
      subtitle={t('companies.linesCrudSubtitle')}
    >
      <div className="space-y-4">
        {/* Create Line Form */}
        <form onSubmit={handleAddLine} className="flex flex-wrap gap-2">
          <input
            type="text"
            value={newLine}
            onChange={(e) => setNewLine(e.target.value)}
            placeholder={t('companies.newLinePlaceholder')}
            className="flex-1 min-w-[160px] bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50 shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0" /> {t('companies.addLine')}
          </button>
        </form>

        {/* Existing Lines List with Edit / Delete Actions */}
        <div className="space-y-2 max-h-72 overflow-y-auto pe-1">
          {company.busLines.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">{t('companies.noLinesYet')}</p>
          ) : (
            company.busLines.map((line) => (
              <div
                key={line}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200"
              >
                {editingLine === line ? (
                  <div className="flex items-center gap-2 flex-1 me-2">
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
                      title={t('companies.confirmRenameTitle')}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingLine(null)}
                      className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                      title={t('companies.cancelTitle')}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Route className="w-4 h-4 text-brand-400 shrink-0" />
                    <span className="font-semibold text-white truncate">{line}</span>
                  </div>
                )}

                {editingLine !== line && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleStartRename(line)}
                      className="p-1 text-slate-400 hover:text-brand-300 hover:bg-slate-700 rounded transition-colors"
                      title={t('companies.renameAcrossBuses')}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLine(line)}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      title={t('companies.deleteLineAction')}
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
            {t('common.done')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
