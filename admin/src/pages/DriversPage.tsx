import React, { useState } from 'react';
import { Plus, Filter, UserCheck } from 'lucide-react';
import { DriverTable } from '../components/drivers/DriverTable';
import { DriverAssignModal } from '../components/drivers/DriverAssignModal';
import { DriverSafetyMediaModal } from '../components/modals/DriverSafetyMediaModal';
import { Modal } from '../components/common/Modal';
import { DriverProfile, CompanyRecord } from '../types';
import { updateDriverCompany, updateDriverLines, saveDriverProfile, removeDriverProfile } from '../services/driversService';
import { toast } from 'sonner';

interface DriversPageProps {
  drivers: DriverProfile[];
  companies: CompanyRecord[];
}

export const DriversPage: React.FC<DriversPageProps> = ({ drivers, companies }) => {
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [driverToAssign, setDriverToAssign] = useState<DriverProfile | null>(null);
  const [mediaModalDriver, setMediaModalDriver] = useState<DriverProfile | null>(null);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  // New Driver Form states
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverEmail, setNewDriverEmail] = useState('');
  const [newDriverCompany, setNewDriverCompany] = useState(companies[0]?.id || 'cta');
  const [newDriverLines, setNewDriverLines] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const selectedCompObj = companies.find((c) => c.id === newDriverCompany);
  const availableLines = selectedCompObj?.busLines || [];

  const handleSaveAssignments = async (driverUid: string, companyId: string, lines: string[]) => {
    await updateDriverCompany(driverUid, companyId);
    await updateDriverLines(driverUid, lines);
  };

  const handleDeleteDriver = async (driverUid: string, driverName: string) => {
    if (confirm(`Are you sure you want to delete driver "${driverName}"?`)) {
      try {
        await removeDriverProfile(driverUid);
        toast.success(`Removed driver "${driverName}"`);
      } catch {
        toast.error('Failed to remove driver');
      }
    }
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || !newDriverEmail.trim()) {
      toast.error('Driver name and email are required');
      return;
    }

    setSaving(true);
    try {
      const generatedUid = 'drv_' + Math.random().toString(36).substring(2, 10);
      await saveDriverProfile({
        uid: generatedUid,
        displayName: newDriverName.trim(),
        email: newDriverEmail.trim().toLowerCase(),
        companyId: newDriverCompany,
        lines: newDriverLines,
      });
      toast.success(`Created profile for ${newDriverName}`);
      setIsAddDriverOpen(false);
      setNewDriverName('');
      setNewDriverEmail('');
      setNewDriverLines([]);
    } catch {
      toast.error('Failed to create driver profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Driver Dispatch & Assignment</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Oversee company drivers, assign bus lines, and manage dispatch authorization.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Company Filter */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Operators</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsAddDriverOpen(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-brand-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Driver Profile
          </button>
        </div>
      </div>

      {/* Driver Table */}
      <DriverTable
        drivers={drivers}
        onAssignDriver={(d) => setDriverToAssign(d)}
        onDeleteDriver={handleDeleteDriver}
        onSafetyCheck={(d) => setMediaModalDriver(d)}
        selectedCompanyFilter={selectedCompanyFilter}
      />

      {/* Driver Assign Modal */}
      <DriverAssignModal
        isOpen={Boolean(driverToAssign)}
        onClose={() => setDriverToAssign(null)}
        driver={driverToAssign}
        companies={companies}
        onSaveAssignments={handleSaveAssignments}
      />

      {/* Driver Safety & Media Stream Modal */}
      {mediaModalDriver && (
        <DriverSafetyMediaModal
          isOpen={Boolean(mediaModalDriver)}
          onClose={() => setMediaModalDriver(null)}
          driverUid={mediaModalDriver.uid}
          driverName={mediaModalDriver.displayName}
          driverEmail={mediaModalDriver.email}
          companyId={mediaModalDriver.companyId}
          lineId={mediaModalDriver.lines[0]}
        />
      )}

      {/* Add Driver Profile Modal */}
      <Modal
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        title="Register Driver Profile"
        subtitle="Provision a driver profile into the Realtime Database dispatch system."
      >
        <form onSubmit={handleCreateDriver} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Driver Full Name</label>
            <input
              type="text"
              value={newDriverName}
              onChange={(e) => setNewDriverName(e.target.value)}
              placeholder="e.g. Mahmoud Mohamed"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Driver Email</label>
            <input
              type="email"
              value={newDriverEmail}
              onChange={(e) => setNewDriverEmail(e.target.value)}
              placeholder="e.g. driver3@cta.eg"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Operating Transit Company</label>
            <select
              value={newDriverCompany}
              onChange={(e) => {
                setNewDriverCompany(e.target.value);
                setNewDriverLines([]);
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

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Initial Line Assignment</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {availableLines.length === 0 ? (
                <p className="text-xs text-slate-500 italic col-span-2">No lines registered for this company.</p>
              ) : (
                availableLines.map((l) => {
                  const checked = newDriverLines.includes(l);
                  return (
                    <label
                      key={l}
                      onClick={() => {
                        if (checked) {
                          setNewDriverLines(newDriverLines.filter((line) => line !== l));
                        } else {
                          setNewDriverLines([...newDriverLines, l]);
                        }
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                        checked ? 'bg-brand-500/15 border-brand-500 text-brand-300' : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <input type="checkbox" checked={checked} onChange={() => {}} className="pointer-events-none" />
                      <span className="truncate">{l}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddDriverOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              {saving ? 'Creating...' : 'Register Driver'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
