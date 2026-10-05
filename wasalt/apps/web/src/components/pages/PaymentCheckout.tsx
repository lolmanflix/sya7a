import React, { useState } from 'react';
import { PRICING_PLANS } from '@wasalt/config';
import { usePriceOverrides, applyPriceOverrides } from '../../services/pricingService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Check,
  CreditCard,
  Lock,
  ArrowLeft,
  ShieldCheck,
  X,
} from 'lucide-react';

interface PaymentCheckoutProps {
  planId: string;
  companyName: string;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

/**
 * Mock payment checkout modal. Simulates a payment flow after onboarding.
 */
export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  planId,
  companyName,
  onPaymentComplete,
  onCancel,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = applyPriceOverrides(PRICING_PLANS, usePriceOverrides());
  const plan = plans.find((p) => p.id === planId) || plans[1];
  const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2200));
    setIsProcessing(false);
    onPaymentComplete();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Complete Your Subscription</h2>
              <p className="text-[11px] text-slate-400">
                Activate {plan.name} for {companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Plan summary */}
          <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{plan.name} Plan</h3>
                <p className="text-xs text-slate-500">{plan.tagline}</p>
              </div>
              {plan.badge && (
                <Badge variant="primary" size="sm">
                  {plan.badge}
                </Badge>
              )}
            </div>

            {/* Billing toggle */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  !isAnnual ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
                  isAnnual ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Annual
                <span className="text-[9px] px-1 py-0.5 rounded bg-blue-500 text-white">-20%</span>
              </button>
            </div>

            <div className="flex items-baseline gap-1 pt-2 border-t border-slate-200/80">
              <span className="text-3xl font-extrabold text-slate-900">${price}</span>
              <span className="text-sm text-slate-500">/month</span>
            </div>
          </div>

          {/* Mock card form */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-700 mb-1 block">Card Number</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-700 mb-1 block">Expiry</span>
                <input
                  type="text"
                  placeholder="MM / YY"
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-700 mb-1 block">CVC</span>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </label>
            </div>
          </div>

          {/* Key features reminder */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {plan.features.slice(0, 4).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{feat.text}</span>
              </div>
            ))}
          </div>

          {/* Pay button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handlePayment}
            isLoading={isProcessing}
            icon={<Lock className="w-4 h-4" />}
            className="w-full justify-center shadow-lg shadow-blue-600/20"
          >
            {isProcessing ? 'Processing Payment...' : `Pay $${price}/month — Activate ${plan.name}`}
          </Button>

          {/* Security note */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> SSL Secured
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> PCI Compliant
            </span>
            <span>Cancel anytime</span>
          </div>

          {/* Back */}
          <button
            onClick={onCancel}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Back to pricing plans
          </button>
        </div>
      </div>
    </div>
  );
};
