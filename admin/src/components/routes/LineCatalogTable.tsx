import React, { useState } from 'react';
import { Route, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { CompanyRecord } from '../../types';
import { useTranslation } from '../../i18n/useTranslation';

export interface LineCatalogItem {
  companyId: string;
  companyName: string;
  lineName: string;
  busesCount: number;
}

interface LineCatalogTableProps {
  lines: LineCatalogItem[];
  companies: CompanyRecord[];
  onRenameLine: (companyId: string, oldLine: string, newLine: string) => Promise<void>;
  onDeleteLine: (companyId: string, line: string) => Promise<void>;
  onOpenCompanyLineManager: (company: CompanyRecord) => void;
}

/**
 * Table component displaying bus line routes and metadata.
 */
export const LineCatalogTable: React.FC<LineCatalogTableProps> = ({
  lines,
  companies,
  onRenameLine,
  onDeleteLine,
  onOpenCompanyLineManager,
}) => {
  const { t } = useTranslation();
  const [editingLineKey, setEditingLineKey] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  /**
   * Saves renamed bus line in the catalog.
   */
  const handleSaveRename = async (companyId: string, oldLine: string) => {
    const clean = renameValue.trim();
    if (!clean || clean === oldLine) {
      setEditingLineKey(null);
      return;
    }
    await onRenameLine(companyId, oldLine, clean);
    setEditingLineKey(null);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
      <div className="overflow-x-auto">
        <table className={`w-full text-start text-xs ${lines.length > 0 ? 'min-w-[640px]' : ''}`}>
          <thead className="bg-slate-800/40 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">{t('routes.colLineName')}</th>
              <th className="py-3 px-4">{t('routes.colCarrierOperator')}</th>
              <th className="py-3 px-4">{t('routes.colAssignedVehicles')}</th>
              <th className="py-3 px-4 text-end">{t('routes.colLineActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {lines.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  {t('routes.emptyCatalog')}
                </td>
              </tr>
            ) : (
              lines.map((item) => {
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
                            onClick={() => handleSaveRename(item.companyId, item.lineName)}
                            className="px-2 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded text-[10px] font-semibold"
                          >
                            {t('common.save')}
                          </button>
                          <button
                            onClick={() => setEditingLineKey(null)}
                            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[10px]"
                          >
                            {t('common.cancel')}
                          </button>
                        </div>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Route className="w-3.5 h-3.5 text-brand-400" />
                          {t('routes.linePrefix', { name: item.lineName })}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {item.companyName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="font-semibold text-white">{item.busesCount}</span> {t('routes.assignedVehicles')}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingLineKey(key);
                            setRenameValue(item.lineName);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                          title={t('routes.renameLineTitle')}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {comp && (
                          <button
                            onClick={() => onOpenCompanyLineManager(comp)}
                            className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title={t('routes.openLineManagerTitle')}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteLine(item.companyId, item.lineName)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                          title={t('routes.deleteLineTitle')}
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
  );
};
