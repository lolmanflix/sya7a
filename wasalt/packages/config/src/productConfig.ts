/**
 * Centralized Product Branding & Metadata for Wasalt
 * All UI references to product name, logo, URLs, and taglines MUST import from here.
 */

export const PRODUCT_CONFIG = {
  name: 'Wasalt',
  legalName: 'Wasalt Technologies Inc.',
  shortName: 'Wasalt',
  domain: 'wasalt.io',
  tagline: 'The Multi-Tenant Operations Platform for Modern Enterprises',
  subheadline:
    'One master account. Infinite branded company workspaces. Unified team governance, live operations, and custom branded portals in seconds.',
  description:
    'Wasalt empowers businesses, institutions, and fleet operators to deploy fully isolated, dynamically branded company portals with zero DevOps overhead.',
  keywords: [
    'SaaS',
    'Multi-Tenant Platform',
    'Company Workspace',
    'Custom Branding',
    'Operations Dashboard',
    'Team Governance',
    'White-label SaaS',
  ],
  supportEmail: 'support@wasalt.io',
  salesEmail: 'sales@wasalt.io',
  copyrightYear: 2026,

  // Visual Identity Defaults
  colors: {
    brandPrimary: '#2563EB', // Wasalt Sapphire Blue
    brandPrimaryHover: '#1D4ED8',
    brandSecondary: '#0D9488', // Wasalt Emerald Teal
    brandAccent: '#F59E0B', // Amber
    brandDark: '#0F172A', // Slate 900
    brandLight: '#F8FAFC',
  },

  // Open Graph & SEO
  openGraph: {
    title: 'Wasalt — Multi-Tenant Enterprise Operations Platform',
    description:
      'Manage multiple companies, deploy instant branded client portals, and orchestrate global team operations.',
    type: 'website',
    url: 'https://wasalt.io',
    siteName: 'Wasalt',
    locale: 'en_US',
    image: '/og-wasalt.png',
  },

  links: {
    app: '/dashboard',
    onboarding: '/onboarding',
    login: '/login',
    signup: '/onboarding',
    pricing: '#pricing',
    features: '#features',
    faq: '#faq',
    docs: 'https://docs.wasalt.io',
    github: 'https://github.com/wasalt',
    terms: '/terms',
    privacy: '/privacy',
  },
} as const;

export type ProductConfig = typeof PRODUCT_CONFIG;
