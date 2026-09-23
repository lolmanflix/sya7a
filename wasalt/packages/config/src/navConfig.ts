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
  { label: 'Live Theme Demo', href: '#theme-demo', badge: 'Interactive' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const DASHBOARD_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', path: '/dashboard' },
  { id: 'team', label: 'Team & Admins', icon: 'Users', path: '/dashboard/team' },
  { id: 'branding', label: 'Branding & Theme', icon: 'Palette', path: '/dashboard/branding' },
  { id: 'billing', label: 'Billing & Plan', icon: 'CreditCard', path: '/dashboard/billing' },
  { id: 'settings', label: 'Company Settings', icon: 'Settings', path: '/dashboard/settings' },
] as const;
