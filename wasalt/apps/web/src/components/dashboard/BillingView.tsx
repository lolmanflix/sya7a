import React, { useState, useEffect } from 'react';
import { Subscription } from '@wasalt/types';
import { PRICING_PLANS } from '@wasalt/config';
import { useCompany } from '../../context/CompanyContext';
import * as subscriptionService from '../../services/subscriptionService';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  CreditCard,
  CheckCircle2,
  Download,
  Zap,
  ArrowUpRight,
  Shield,
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const { activeCompany } = useCompany();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  useEffect(() => {
    if (activeCompany) {
      subscriptionService.fetchSubscription(activeCompany.id).then(setSub);
    }
  }, [activeCompany?.id]);

  const handleUpgrade = async () => {
    if (!activeCompany) return;
    setIsUpgrading(true);
    try {
      await subscriptionService.updatePlan(activeCompany.id, selectedPlanId);
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
          onClick={() => setUpgradeModalOpen(true)}
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
              Active Tier
            </span>
            <Badge variant="success" size="sm">
              Active &bull; Renews next month
            </Badge>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">Professional Plan</h3>
          <p className="text-xs text-slate-500 mt-1">
            $79 / month &bull; Billed to card ending in 4242
          </p>
        </div>

        <div className="sm:text-right">
          <div className="text-xs text-slate-400 font-medium">Next Billing Date</div>
          <div className="text-sm font-bold text-slate-800">October 24, 2026</div>
          <div className="text-xs text-blue-600 font-semibold mt-1 cursor-pointer hover:underline">
            Update Payment Method
          </div>
        </div>
      </div>

      {/* Resource Utilization Meters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Workspace Resource Usage</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
              <span>Admin Seats</span>
              <span>6 of 15 used</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[40%] h-full bg-blue-600 rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
              <span>Active Workspaces</span>
              <span>3 of 5 used</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[60%] h-full bg-teal-600 rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
              <span>Telematics Stream</span>
              <span>45 GB of 100 GB</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[45%] h-full bg-purple-600 rounded-full"></div>
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
                <th className="py-3 px-6 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sub?.invoices?.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">{inv.id}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">
                    {new Date(inv.date).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-6 font-semibold">${inv.amount}.00</td>
                  <td className="py-3.5 px-6">
                    <Badge variant="success" size="sm">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button className="text-blue-600 hover:text-blue-800 p-1">
                      <Download className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRICING_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
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
                        ${plan.priceMonthly}
                        <span className="text-xs font-normal text-slate-500">/mo</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{plan.tagline}</p>
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
