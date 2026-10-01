/**
 * Subscription, pricing tiers, and billing data models
 */

export type BillingCycle = 'monthly' | 'annual';

export interface PlanFeature {
  text: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  maxCompanies: number;
  maxAdmins: number;
  features: PlanFeature[];
  highlighted?: boolean;
  ctaText: string;
}

export interface Subscription {
  id: string;
  companyId: string;
  planId: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethodLast4?: string;
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'open' | 'void';
  downloadUrl?: string;
}
