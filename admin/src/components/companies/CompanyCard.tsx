import React from 'react';
import { Building2, Route, Globe, Plus, Trash2, CreditCard, BadgeCheck } from 'lucide-react';
import { CompanyRecord } from '../../types';

interface CompanyCardProps {
  company: CompanyRecord;
  busesCount: number;
  onManageLines: (company: CompanyRecord) => void;
  onDeleteCompany?: (companyId: string) => void;
  /** Super-admin only: manually confirm payment and activate subscription. */
  onConfirmPayment?: (companyId: string) => void;
  isDuplicate?: boolean;
}

/**
 * Card component rendering company metrics and quick actions.
 */
export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  busesCount,
  onManageLines,
  onDeleteCompany,
  onConfirmPayment,
  isDuplicate,
}) => {
  const subscriptionStatus = company.subscriptionStatus || 'none';
  const isActive = subscriptionStatus === 'active';
  const needsActivation =
    Boolean(onConfirmPayment) && !isActive && subscriptionStatus !== 'none';

  return (
    <div className={`bg-slate-900/60 border ${isDuplicate ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800'} rounded-2xl p-5 backdrop-blur-sm transition-all hover:border-slate-700/80 flex flex-col justify-between`}>
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <Building2 className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">{company.name}</h4>
                {isDuplicate && (
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Duplicate Node
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{company.nameAr || `ID: ${company.id}`}</p>
            </div>
          </div>

          {onDeleteCompany && (
            <button
              onClick={() => onDeleteCompany(company.id)}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Company Node"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Info Rows */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Bus Lines</span>
            <span className="text-base font-bold text-white mt-0.5 block flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-brand-400" />
              {company.busLines.length}
            </span>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Registered Buses</span>
            <span className="text-base font-bold text-white mt-0.5 block">
              {busesCount}
            </span>
          </div>

          <div className="col-span-2 bg-slate-800/40 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              Subscription
            </span>
            <span className="flex items-center gap-1.5">
              {company.subscriptionPlanId && company.subscriptionPlanId !== 'pending' && (
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {company.subscriptionPlanId}
                </span>
              )}
              <span
                className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded border ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : subscriptionStatus === 'none'
                      ? 'bg-slate-700/40 text-slate-400 border-slate-600/40'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                {isActive ? (
                  <span className="flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Active
                  </span>
                ) : subscriptionStatus === 'none' ? (
                  'No Plan'
                ) : (
                  subscriptionStatus.replace(/_/g, ' ')
                )}
              </span>
            </span>
          </div>
        </div>

        {company.domain && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>Staff Domain:</span>
            <code className="text-brand-300 px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[11px]">
              @{company.domain}
            </code>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-800/60 space-y-2">
        {needsActivation && (
          <button
            onClick={() => onConfirmPayment?.(company.id)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
            title="Confirm received payment (bank transfer / Vodafone Cash) and activate"
          >
            <BadgeCheck className="w-3.5 h-3.5" />
            Confirm Payment & Activate
          </button>
        )}
        <button
          onClick={() => onManageLines(company)}
          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Manage Lines ({company.busLines.length})
        </button>
      </div>
    </div>
  );
};
