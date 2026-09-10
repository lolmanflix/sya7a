import React, { useState } from 'react';
import { Route, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { CompanyRecord } from '../../types';

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

export const LineCatalogTable: React.FC<LineCatalogTableProps> = ({
  lines,
  companies,
  onRenameLine,
  onDeleteLine,
  onOpenCompanyLineManager,
}) => {
  const [editingLineKey, setEditingLineKey] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

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
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/40 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Line Name</th>
              <th className="py-3 px-4">Carrier Operator</th>
              <th className="py-3 px-4">Assigned Vehicles</th>
              <th className="py-3 px-4 text-right">Line Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {lines.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No bus lines found. Click &quot;Add Line Code&quot; to register a line.
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
                            Save
                          </button>
                          <button
                            onClick={() => setEditingLineKey(null)}
                            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Route className="w-3.5 h-3.5 text-brand-400" />
                          Line {item.lineName}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {item.companyName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="font-semibold text-white">{item.busesCount}</span> assigned vehicles
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingLineKey(key);
                            setRenameValue(item.lineName);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                          title="Rename Line Code"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {comp && (
                          <button
                            onClick={() => onOpenCompanyLineManager(comp)}
                            className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="Open Carrier Line Manager"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteLine(item.companyId, item.lineName)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                          title="Delete Line Code"
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
