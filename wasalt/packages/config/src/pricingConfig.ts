/**
 * Centralized Pricing Plans & Feature Matrix
 */
import { PricingPlan } from '../../types/src/subscription';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Ideal for solo operators, startups, and pilot projects.',
    priceMonthly: 29,
    priceAnnual: 24, // $24/mo billed annually
    maxCompanies: 1,
    maxAdmins: 3,
    highlighted: false,
    ctaText: 'Start 14-Day Free Trial',
    features: [
      { text: '1 Branded Company Workspace', included: true },
      { text: 'Up to 3 Admin & Manager Seats', included: true },
      { text: 'Automatic Logo Theme Extraction', included: true },
      { text: 'Standard Analytics & Activity Logs', included: true },
      { text: 'Community & Email Support', included: true },
      { text: 'Multi-Company Switcher', included: false },
      { text: 'Custom Domain White-labeling', included: false },
      { text: 'Dedicated Account Manager', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    badge: 'Most Popular',
    tagline: 'For growing businesses managing expanding operations and teams.',
    priceMonthly: 79,
    priceAnnual: 64, // $64/mo billed annually (~20% off)
    maxCompanies: 5,
    maxAdmins: 15,
    highlighted: true,
    ctaText: 'Launch Pro Workspace',
    features: [
      { text: 'Up to 5 Isolated Company Workspaces', included: true },
      { text: 'Up to 15 Admin & Manager Seats', included: true },
      { text: 'Instant Multi-Company Quick Switcher', included: true },
      { text: 'Dynamic Brand Color & Contrast Engine', included: true },
      { text: 'Advanced Role-Based Access Control', included: true },
      { text: 'Priority Email & Live Chat Support', included: true },
      { text: 'Custom Subdomain & Asset Storage', included: true },
      { text: 'Custom SLA & Dedicated Success Lead', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'Maximum Power',
    tagline: 'Tailored for large organizations, transit authorities, and conglomerates.',
    priceMonthly: 199,
    priceAnnual: 159,
    maxCompanies: 50,
    maxAdmins: 100,
    highlighted: false,
    ctaText: 'Contact Enterprise Sales',
    features: [
      { text: 'Unlimited Company Workspaces', included: true },
      { text: 'Unlimited Admin & Dispatcher Seats', included: true },
      { text: 'Full Custom White-label & Custom Domains', included: true },
      { text: 'Custom Security & SAML/SSO Integration', included: true },
      { text: '99.95% Guaranteed SLA & Dedicated VPC', included: true },
      { text: 'Electron Desktop Build Packages', included: true },
      { text: 'Direct Engineering & Slack Channel Support', included: true },
      { text: 'Automated Regulatory Audit Reporting', included: true },
    ],
  },
];
