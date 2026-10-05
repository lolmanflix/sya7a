/**
 * Centralized Product Branding & Metadata for Wasalt
 * All UI references to product name, logo, URLs, and taglines MUST import from here.
 */

export const PRODUCT_CONFIG = {
  name: 'Wasalt',
  legalName: 'Wasalt Technologies Inc.',
  shortName: 'Wasalt',
  domain: 'wasalt.io',
  tagline: 'Transportation management with real-time bus visibility',
  subheadline:
    'Manage buses, drivers, routes, and transportation operations from one centralized platform with a clear view of every active vehicle.',
  description:
    'Wasalt is a B2B transportation management platform for schools, companies, and organizations managing buses, drivers, routes, and fleet operations.',
  keywords: [
    'bus tracking software',
    'school transportation management',
    'employee transportation management',
    'fleet tracking',
    'bus fleet management',
    'real-time bus tracking',
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
    title: 'Wasalt — Transportation Management & Bus Visibility',
    description:
      'Manage buses, drivers, routes, and transportation operations with real-time fleet visibility.',
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
