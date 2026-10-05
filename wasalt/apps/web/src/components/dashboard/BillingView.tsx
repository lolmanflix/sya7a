import React, { useState, useEffect } from 'react';
import { Subscription } from '@wasalt/types';
import { PRICING_PLANS } from '@wasalt/config';
import { useCompany } from '../../context/CompanyContext';
import { usePriceOverrides, applyPriceOverrides } from '../../services/pricingService';
import * as subscriptionService from '../../services/subscriptionService';
import * as membershipService from '../../services/membershipService';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const { activeCompany, companies } = useCompany();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  // Matches the website pricing toggle (annual by default, same as PricingSection).
  const [upgradeCycle, setUpgradeCycle] = useState<'monthly' | 'annual'>('annual');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  useEffect(() => {
    if (activeCompany) {
      subscriptionService.fetchSubscription(activeCompany.id).then(setSub);
      membershipService
        .fetchMembersForCompany(activeCompany.id)
        .then((list) => setMemberCount(list.length))
        .catch(() => setMemberCount(0));
    }
  }, [activeCompany?.id]);

  // ─── Real values derived from RTDB + shared pricing config ────────────────
  // Live admin-set prices (marketing site + upgrade modal stay in sync).
  const plans = applyPriceOverrides(PRICING_PLANS, usePriceOverrides());
  const plan =
    plans.find(
      (p) => p.id === (sub?.planId || activeCompany?.subscriptionPlanId || '')
    ) || plans[0];
  const cycle: 'monthly' | 'annual' = sub?.billingCycle === 'annual' ? 'annual' : 'monthly';
  const monthlyPrice = cycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  const status = sub?.status || activeCompany?.subscriptionStatus || 'none';
  const periodEnd = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const statusBadge =
    status === 'active'
      ? { variant: 'success' as const, label: 'Active' }
      : status === 'trialing'
        ? { variant: 'warning' as const, label: 'Free Trial' }
        : status === 'past_due'
          ? { variant: 'danger' as const, label: 'Payment Overdue' }
          : { variant: 'neutral' as const, label: 'No Subscription' };

  const statusHint =
    status === 'active'
      ? periodEnd
        ? `Renews ${periodEnd}`
        : 'Subscription active'
      : status === 'trialing'
        ? periodEnd
          ? `Trial ends ${periodEnd}`
          : '14-day free trial running'
        : status === 'past_due'
          ? 'Payment overdue — confirm payment to reactivate'
          : 'Choose a plan to activate your workspace';

  const paymentNote =
    status === 'active'
      ? `Paid via bank transfer / Vodafone Cash — confirmed by Wasalt`
      : status === 'trialing'
        ? 'No charge until the trial ends and payment is confirmed'
        : 'Pay via bank transfer or Vodafone Cash — activated after manual confirmation';

  const seatsUsed = memberCount;
  const seatsLimit = plan.maxAdmins;
  const workspacesUsed = companies.length;
  const workspacesLimit = plan.maxCompanies;

  const handleUpgrade = async () => {
    if (!activeCompany) return;
    setIsUpgrading(true);
    try {
      await subscriptionService.updatePlan(activeCompany.id, selectedPlanId, upgradeCycle);
      // Refresh local subscription state so the current-plan card matches.
      const fresh = await subscriptionService.fetchSubscription(activeCompany.id);
      if (fresh) setSub(fresh);
      setUpgradeSuccess(true);
      setTimeout(() => {
        setUpgradeSuccess(false);
        setUpgradeModalOpen(false);
      }, 1500);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Subscription & Billing</h2>
          <p className="text-xs text-slate-500">
            Manage your subscription tier, billing period, and invoice records for{' '}
            <span className="font-semibold text-slate-800">{activeCompany?.name}</span>.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedPlanId(plan.id);
            setUpgradeCycle('annual');
            setUpgradeModalOpen(true);
          }}
          icon={<Zap className="w-4 h-4" />}
        >
          Change Plan
        </Button>
      </div>

      {/* Current Plan Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Plan
            </span>
            <Badge variant={statusBadge.variant} size="sm">
              {statusBadge.label}
            </Badge>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{plan.name} Plan</h3>
          <p className="text-xs text-slate-500 mt-1">
            {monthlyPrice.toLocaleString()} {plan.currency} / month
            {cycle === 'annual'
              ? ` — billed annually (${(plan.priceAnnual * 12).toLocaleString()} ${plan.currency}/year)`
              : ''}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{paymentNote}</p>
        </div>

        <div className="sm:text-right">
          <div className="text-xs text-slate-400 font-medium">
            {status === 'active' ? 'Next Billing Date' : 'Billing Period End'}
          </div>
          <div className="text-sm font-bold text-slate-800">{periodEnd || '—'}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            {statusHint}
          </div>
        </div>
      </div>

      {/* Resource Utilization Meters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Workspace Resource Usage</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
              <span>Admin Seats</span>
              <span>
                {seatsUsed} of {seatsLimit} used
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (seatsUsed / seatsLimit) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
              <span>Active Workspaces</span>
              <span>
                {workspacesUsed} of {workspacesLimit} used
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (workspacesUsed / workspacesLimit) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Billing & Invoice History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Invoice ID</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {(sub?.invoices || []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 px-6 text-center text-xs text-slate-400">
                    No invoices yet — invoices appear here after each confirmed payment.
                  </td>
                </tr>
              ) : (
                sub?.invoices?.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">{inv.id}</td>
                    <td className="py-3.5 px-6 font-mono text-slate-500">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 font-semibold">
                      {inv.amount} {plan.currency}
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge variant="success" size="sm">
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      <Modal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Upgrade Workspace Plan"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {upgradeSuccess ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Plan Upgraded Successfully!</h4>
              <p className="text-xs text-slate-500">Your workspace limits have been updated.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500">
                Choose the best tier for your operational scale:
              </p>

              {/* Billing cycle toggle — identical to the website pricing toggle */}
              <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-full w-fit mx-auto">
                <button
                  type="button"
                  onClick={() => setUpgradeCycle('monthly')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    upgradeCycle === 'monthly'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setUpgradeCycle('annual')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                    upgradeCycle === 'annual'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500 text-white font-bold">
                    Save 20%
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const price =
                    upgradeCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-sm font-bold text-slate-900">{plan.name}</div>
                      <div className="text-xl font-extrabold text-slate-900 my-2">
                        {price.toLocaleString()}
                        <span className="text-xs font-semibold text-blue-600 ml-1">EGP</span>
                        <span className="text-xs font-normal text-slate-500">/mo</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{plan.tagline}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setUpgradeModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpgrade} isLoading={isUpgrading}>
                  Confirm Upgrade
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
