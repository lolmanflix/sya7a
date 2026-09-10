import React, { useState } from 'react';
import { Plus, Search, Building2, Route, Edit2, Trash2, Layers } from 'lucide-react';
import { CompanyCard } from '../components/companies/CompanyCard';
import { LineManagerModal } from '../components/companies/LineManagerModal';
import { AddBusLineModal } from '../components/companies/AddBusLineModal';
import { Modal } from '../components/common/Modal';
import { CompanyRecord, BusRouteDefinition } from '../types';
import { saveCompany, removeCompany, deleteCompanyLine, renameCompanyLine } from '../services/companiesService';
import { toast } from 'sonner';

interface CompaniesPageProps {
  companies: CompanyRecord[];
  buses: BusRouteDefinition[];
}

export const CompaniesPage: React.FC<CompaniesPageProps> = ({ companies, buses }) => {
  const [activeTab, setActiveTab] = useState<'companies' | 'lines'>('companies');
  const [search, setSearch] = useState('');
  const [selectedCompanyForLines, setSelectedCompanyForLines] = useState<CompanyRecord | null>(null);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isAddLineOpen, setIsAddLineOpen] = useState(false);

  // New Company form states
  const [newCompId, setNewCompId] = useState('');
  const [newCompName, setNewCompName] = useState('');
  const [newCompDomain, setNewCompDomain] = useState('');
  const [saving, setSaving] = useState(false);

  // Quick Rename Line state in table
  const [editingLineKey, setEditingLineKey] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // 1. Filtered Companies
  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      (c.domain && c.domain.toLowerCase().includes(search.toLowerCase()))
  );

  // 2. Flattened Bus Lines across all companies
  const allBusLines = React.useMemo(() => {
    const list: { companyId: string; companyName: string; lineName: string; busesCount: number }[] = [];
    companies.forEach((comp) => {
      comp.busLines.forEach((line) => {
        const count = buses.filter(
          (b) => b.companyId.toLowerCase() === comp.id.toLowerCase() && b.lineId.toLowerCase() === line.toLowerCase()
        ).length;
        list.push({
          companyId: comp.id,
          companyName: comp.name,
          lineName: line,
          busesCount: count,
        });
      });
    });
    return list;
  }, [companies, buses]);

  const filteredLines = allBusLines.filter(
    (l) =>
      l.lineName.toLowerCase().includes(search.toLowerCase()) ||
      l.companyName.toLowerCase().includes(search.toLowerCase()) ||
      l.companyId.toLowerCase().includes(search.toLowerCase())
  );

  const getBusCount = (companyId: string) => {
    return buses.filter((b) => b.companyId.toLowerCase() === companyId.toLowerCase()).length;
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompId.trim() || !newCompName.trim()) {
      toast.error('Company ID and Name are required.');
      return;
    }

    setSaving(true);
    try {
      await saveCompany(newCompId.trim(), {
        name: newCompName.trim(),
        domain: newCompDomain.trim() || null,
        busLines: [],
      });
      toast.success(`Operator ${newCompName} created.`);
      setIsAddCompanyOpen(false);
      setNewCompId('');
      setNewCompName('');
      setNewCompDomain('');
    } catch {
      toast.error('Failed to create company.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (confirm(`Are you sure you want to delete company node '${companyId}'?`)) {
      try {
        await removeCompany(companyId);
        toast.success(`Removed operator node ${companyId}`);
      } catch {
        toast.error('Failed to delete operator');
      }
    }
  };

  const handleDeleteLine = async (companyId: string, lineName: string) => {
    if (confirm(`Delete line "${lineName}" from ${companyId.toUpperCase()}?`)) {
      try {
        await deleteCompanyLine(companyId, lineName);
        toast.success(`Deleted bus line "${lineName}"`);
      } catch {
        toast.error('Failed to delete line');
      }
    }
  };

  const handleStartRename = (compKey: string, currentName: string) => {
    setEditingLineKey(compKey);
    setRenameValue(currentName);
  };

  const handleSaveRename = async (companyId: string, oldName: string) => {
    const clean = renameValue.trim();
    if (!clean || clean === oldName) {
      setEditingLineKey(null);
      return;
    }
    try {
      await renameCompanyLine(companyId, oldName, clean);
      toast.success(`Renamed line "${oldName}" to "${clean}"`);
      setEditingLineKey(null);
    } catch {
      toast.error('Failed to rename line');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Transit Operators & Lines</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage transport authorities, official domains, and their assigned bus lines catalog.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === 'companies' ? 'Search companies...' : 'Search bus lines...'}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => setIsAddLineOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 shrink-0"
            title="Add a new bus line to an operator's lines catalog"
          >
            <Plus className="w-4 h-4" /> Add Bus Line
          </button>

          <button
            onClick={() => setIsAddCompanyOpen(true)}
            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-brand-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Company
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'companies'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Transit Companies ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lines')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'lines'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Route className="w-4 h-4" />
          <span>Bus Lines Directory ({allBusLines.length})</span>
        </button>
      </div>

      {/* Tab 1: Transit Companies Cards Grid */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((comp) => (
            <CompanyCard
              key={comp.id}
              company={comp}
              busesCount={getBusCount(comp.id)}
              onManageLines={(c) => setSelectedCompanyForLines(c)}
              onDeleteCompany={handleDeleteCompany}
              isDuplicate={comp.id === 'BRT'}
            />
          ))}
        </div>
      )}

      {/* Tab 2: Dedicated Bus Lines Directory Table */}
      {activeTab === 'lines' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Bus Line Name</th>
                  <th className="py-3 px-4">Operating Company</th>
                  <th className="py-3 px-4">Configured Routes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLines.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No bus lines found. Click <strong>"Add Bus Line"</strong> above to register one.
                    </td>
                  </tr>
                ) : (
                  filteredLines.map((item) => {
                    const rowKey = `${item.companyId}-${item.lineName}`;
                    const isEditing = editingLineKey === rowKey;

                    return (
                      <tr key={rowKey} className="hover:bg-slate-800/30 transition-colors">
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
                                onClick={() => handleSaveRename(item.companyId, item.lineName)}
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
                              <span className="font-bold text-white text-sm">{item.lineName}</span>
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
                            {item.busesCount} terminal route{item.busesCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStartRename(rowKey, item.lineName)}
                              className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded transition-colors"
                              title="Rename bus line"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLine(item.companyId, item.lineName)}
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
      )}

      {/* Line Manager Modal for individual company */}
      <LineManagerModal
        isOpen={Boolean(selectedCompanyForLines)}
        onClose={() => setSelectedCompanyForLines(null)}
        company={selectedCompanyForLines}
      />

      {/* Add Bus Line Modal */}
      <AddBusLineModal
        isOpen={isAddLineOpen}
        onClose={() => setIsAddLineOpen(false)}
        companies={companies}
      />

      {/* Add Company Modal */}
      <Modal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        title="Add Transit Operator"
        subtitle="Register a new public transport authority, university shuttle, or private carrier."
      >
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Company Slug / ID</label>
            <input
              type="text"
              value={newCompId}
              onChange={(e) => setNewCompId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="e.g. ecu-shuttle, cta, or super-jet"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              value={newCompName}
              onChange={(e) => setNewCompName(e.target.value)}
              placeholder="e.g. ECU Transit Shuttles"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Staff Email Domain (Optional)</label>
            <input
              type="text"
              value={newCompDomain}
              onChange={(e) => setNewCompDomain(e.target.value.toLowerCase().replace('@', ''))}
              placeholder="e.g. ecu.edu.eg or cta.eg"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Drivers or admins signing up with this domain will be linked automatically.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddCompanyOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              {saving ? 'Creating...' : 'Create Operator'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
