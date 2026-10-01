/**
 * Centralized Pricing Plans & Feature Matrix (Egyptian Pound / EGP - Egyptian Market SaaS Model)
 */
import { PricingPlan } from '../../types/src/subscription';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For smaller schools and emerging transport fleets (up to 5 buses).',
    priceMonthly: 1450,
    priceAnnual: 1150, // 1,150 EGP/mo billed annually (~20% discount)
    currency: 'EGP',
    currencySymbol: 'ج.م',
    maxCompanies: 1,
    maxAdmins: 3,
    highlighted: false,
    ctaText: 'Start 14-Day Free Trial',
    features: [
      { text: '1 Transportation Organization Workspace', included: true },
      { text: 'Up to 5 Fleet Vehicles & Buses', included: true },
      { text: 'Up to 3 Transportation Admin Seats', included: true },
      { text: 'Live Telemetry Map & Route Progress', included: true },
      { text: 'Automatic Logo Theme Extraction', included: true },
      { text: 'Standard Analytics & Activity Logs', included: true },
      { text: 'Multi-Company Switcher', included: false },
      { text: 'Dedicated Account Manager', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    badge: 'Most Popular',
    tagline: 'For established private schools, universities, and corporate fleets (up to 25 buses).',
    priceMonthly: 3850,
    priceAnnual: 3100, // 3,100 EGP/mo billed annually (~20% discount)
    currency: 'EGP',
    currencySymbol: 'ج.م',
    maxCompanies: 5,
    maxAdmins: 15,
    highlighted: true,
    ctaText: 'Launch Pro Workspace',
    features: [
      { text: 'Up to 5 Organization Workspaces', included: true },
      { text: 'Up to 25 Fleet Vehicles & Full Telemetry', included: true },
      { text: 'Up to 15 Transportation Admin Seats', included: true },
      { text: 'Instant Multi-Company Quick Switcher', included: true },
      { text: 'Dynamic Brand Color & Contrast Engine', included: true },
      { text: 'Advanced Role-Based Access Control', included: true },
      { text: 'Driver Dispatch & Shift Management', included: true },
      { text: 'Priority Local Support (Phone & WhatsApp)', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'Maximum Power',
    tagline: 'For large tourism operators, city-wide carriers, and multi-branch educational complexes.',
    priceMonthly: 8900,
    priceAnnual: 7200, // 7,200 EGP/mo billed annually (~20% discount)
    currency: 'EGP',
    currencySymbol: 'ج.م',
    maxCompanies: 50,
    maxAdmins: 100,
    highlighted: false,
    ctaText: 'Contact Enterprise Sales',
    features: [
      { text: 'Unlimited Organization Workspaces', included: true },
      { text: 'Unlimited Fleet Buses & Route Lines', included: true },
      { text: 'Unlimited Admin & Transportation Staff Seats', included: true },
      { text: 'Full Custom White-label & Custom Domains', included: true },
      { text: 'Electron Desktop Build Packages (.exe / .dmg)', included: true },
      { text: 'Custom Security & SAML/SSO Integration', included: true },
      { text: 'Dedicated Success Manager in Egypt (24/7)', included: true },
      { text: 'Custom Operational & Financial Reporting', included: true },
    ],
  },
];
