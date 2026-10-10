import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import { removeCompany } from '../services/companiesService';
import { CompanyRecord } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import { toast } from 'sonner';

interface SecurityPageProps {
  companies: CompanyRecord[];
}

/**
 * System diagnostic and security audit dashboard.
 */
export const SecurityPage: React.FC<SecurityPageProps> = ({ companies }) => {
  const { t } = useTranslation();
  const [cleaning, setCleaning] = useState(false);
  const hasDuplicateBrt = companies.some((c) => c.id === 'BRT');

  /**
   * Cleans duplicate bus route corridor nodes from the database.
   */
  const handleCleanDuplicateBrt = async () => {
    setCleaning(true);
    try {
      await removeCompany('BRT');
      toast.success(t('security.cleanToast'));
    } catch {
      toast.error(t('security.cleanError'));
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">{t('security.title')}</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t('security.subtitle')}
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
              <h4 className="text-sm font-bold text-white">{t('security.rbacTitle')}</h4>
              <p className="text-xs text-slate-400">{t('security.rbacSubtitle')}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-brand-400 text-sm">{t('security.superAdminRole')}</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 font-semibold text-[10px]">
                  {t('security.unrestricted')}
                </span>
              </div>
              <p className="text-slate-300">
                {t('security.superAdminDesc')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-indigo-400 text-sm">{t('security.dispatcherRole')}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold text-[10px]">
                  {t('security.tenantScoped')}
                </span>
              </div>
              <p className="text-slate-300">
                {t('security.dispatcherDesc')}
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
              <h4 className="text-sm font-bold text-white">{t('security.hygieneTitle')}</h4>
              <p className="text-xs text-slate-400">{t('security.hygieneSubtitle')}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {hasDuplicateBrt ? (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  {t('security.duplicateDetected')}
                </div>
                <p className="text-xs text-amber-300/90 leading-relaxed">
                  {t('security.duplicateDescBefore')} <code className="bg-black/30 px-1 rounded">brt</code> {t('security.duplicateDescMiddle')} <code className="bg-black/30 px-1 rounded">BRT</code> {t('security.duplicateDescAfter')}
                </p>
                <button
                  onClick={handleCleanDuplicateBrt}
                  disabled={cleaning}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md"
                >
                  {cleaning ? t('security.cleaning') : t('security.deduplicate')}
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('security.cleanSuccess')}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
              <span className="font-semibold text-slate-200 block">{t('security.credentialGuard')}</span>
              <p className="text-slate-400">
                {t('security.credentialDescBefore')} <code className="text-brand-300">.gitignore</code> {t('security.credentialDescAfter')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
