/**
 * Navigation items for Marketing site and internal Dashboard
 */

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export const MARKETING_NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Live Tracking', href: '#live-tracking', badge: 'Live view' },
  { label: 'For Schools', href: '#schools' },
  { label: 'For Companies', href: '#companies' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const DASHBOARD_NAV_ITEMS = [
  { id: 'team', label: 'Team & Admins', icon: 'Users', path: '/dashboard/team' },
  { id: 'branding', label: 'Branding & Theme', icon: 'Palette', path: '/dashboard/branding' },
  { id: 'billing', label: 'Billing & Plan', icon: 'CreditCard', path: '/dashboard/billing' },
  { id: 'settings', label: 'Company Settings', icon: 'Settings', path: '/dashboard/settings' },
] as const;
