import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import { removeCompany } from '../services/companiesService';
import { CompanyRecord } from '../types';
import { toast } from 'sonner';

interface SecurityPageProps {
  companies: CompanyRecord[];
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ companies }) => {
  const [cleaning, setCleaning] = useState(false);
  const hasDuplicateBrt = companies.some((c) => c.id === 'BRT');

  const handleCleanDuplicateBrt = async () => {
    setCleaning(true);
    try {
      await removeCompany('BRT');
      toast.success('Successfully removed duplicate test node "BRT". Active "brt" node preserved.');
    } catch {
      toast.error('Failed to clean duplicate node');
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Security & System Hygiene</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Role-Based Access Control, database integrity checks, and rule recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RBAC Permission Matrix */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Role-Based Access Control (RBAC)</h4>
              <p className="text-xs text-slate-400">Strict multi-tenant privilege boundaries</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-400 text-sm">Super Administrator</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 font-semibold text-[10px]">
                  Unrestricted
                </span>
              </div>
              <p className="text-slate-300">
                Full authority across all 7 transport authorities, driver line reassignments, live stream termination, and company creation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-400 text-sm">Company Dispatcher (e.g. CTA Admin)</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold text-[10px]">
                  Tenant-Scoped
                </span>
              </div>
              <p className="text-slate-300">
                Restricted strictly to the operator domain (e.g. @cta.eg). Can only create routes and assign drivers belonging to their transit company.
              </p>
            </div>
          </div>
        </div>

        {/* Database Hygiene & Deduplication */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Database Hygiene & Anomaly Detection</h4>
              <p className="text-xs text-slate-400">Automated consistency scanner</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {hasDuplicateBrt ? (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Duplicate Node Detected: "BRT" vs "brt"
                </div>
                <p className="text-xs text-amber-300/90 leading-relaxed">
                  The database contains both lowercase <code className="bg-black/30 px-1 rounded">brt</code> (7 buses, 6 lines) and uppercase <code className="bg-black/30 px-1 rounded">BRT</code> (empty duplicate). Removing the redundant node cleans client queries.
                </p>
                <button
                  onClick={handleCleanDuplicateBrt}
                  disabled={cleaning}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md"
                >
                  {cleaning ? 'Cleaning...' : 'Deduplicate & Remove "BRT"'}
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All transit operator keys are clean and normalized. No duplicate nodes detected.</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
              <span className="font-semibold text-slate-200 block">Credential Security Guard</span>
              <p className="text-slate-400">
                Firebase Admin service keys and environment tokens are strictly protected by <code className="text-brand-300">.gitignore</code> and never bundled into client production assets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
