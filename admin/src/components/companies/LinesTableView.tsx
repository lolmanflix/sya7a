/**
 * @file LinesTableView.tsx
 * @description Master tabular catalog of all transit lines across all operators,
 * providing inline line renaming, route count metrics, and line deletions.
 */

import React, { useState } from 'react';
import { Route, Edit2, Trash2, Layers } from 'lucide-react';

export interface FlattenedLineItem {
  companyId: string;
  companyName: string;
  lineName: string;
  busesCount: number;
}

interface LinesTableViewProps {
  lines: FlattenedLineItem[];
  onDeleteLine: (companyId: string, lineName: string) => void;
  onRenameLine: (companyId: string, oldName: string, newName: string) => void;
  onOpenAddLine: () => void;
}

/**
 * Tabular component rendering cross-company bus lines with inline editing.
 *
 * @param props - Filtered lines catalog, delete/rename callbacks, and modal trigger.
 * @returns JSX Element.
 */
export const LinesTableView: React.FC<LinesTableViewProps> = ({
  lines,
  onDeleteLine,
  onRenameLine,
  onOpenAddLine,
}) => {
  const [editingLineKey, setEditingLineKey] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  /**
   * Initiates inline line renaming in the lines table.
   */
  const handleStartRename = (rowKey: string, currentName: string) => {
    setEditingLineKey(rowKey);
    setRenameValue(currentName);
  };

  /**
   * Persists inline renamed line identifier to RTDB.
   */
  const handleSaveRename = (companyId: string, oldName: string) => {
    const clean = renameValue.trim();
    if (!clean || clean === oldName) {
      setEditingLineKey(null);
      return;
    }
    onRenameLine(companyId, oldName, clean);
    setEditingLineKey(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white">
            All Operating Lines Catalog ({lines.length})
          </h3>
        </div>
        <p className="text-[11px] text-slate-400">
          Showing lines across all registered transport companies
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 font-medium uppercase text-[10px] tracking-wider border-b border-slate-800/80">
            <tr>
              <th className="py-3 px-4">Line Name / Identifier</th>
              <th className="py-3 px-4">Assigned Operator</th>
              <th className="py-3 px-4">Configured Routes</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {lines.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No bus lines found.{' '}
                  <button
                    onClick={onOpenAddLine}
                    className="text-brand-400 font-semibold hover:underline"
                  >
                    Click here to register one.
                  </button>
                </td>
              </tr>
            ) : (
              lines.map((item) => {
                const rowKey = `${item.companyId}-${item.lineName}`;
                const isEditing = editingLineKey === rowKey;

                return (
                  <tr
                    key={rowKey}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="bg-slate-950 border border-brand-500 rounded px-2 py-1 text-xs text-white"
                            autoFocus
                          />
                          <button
                            onClick={() =>
                              handleSaveRename(item.companyId, item.lineName)
                            }
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingLineKey(null)}
                            className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Route className="w-4 h-4 text-brand-400 shrink-0" />
                          <span className="font-bold text-white text-sm">
                            {item.lineName}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        {item.companyName} ({item.companyId})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-300 font-medium">
                        {item.busesCount} terminal route
                        {item.busesCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleStartRename(rowKey, item.lineName)
                          }
                          className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded transition-colors"
                          title="Rename bus line"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            onDeleteLine(item.companyId, item.lineName)
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                          title="Delete bus line"
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
