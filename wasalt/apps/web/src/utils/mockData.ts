/**
 * Initial Demo & Fallback Datasets for Wasalt SaaS Platform
 */
import { AdminProfile } from '@wasalt/types';
import { Company } from '@wasalt/types';
import { AdminCompanyMembership } from '@wasalt/types';
import { Subscription } from '@wasalt/types';
import { PRESET_THEMES, getPresetThemeById } from '@wasalt/theme';

export const DEMO_ADMIN: AdminProfile = {
  id: 'admin_master_1',
  email: 'kareem@wasalt.io',
  fullName: 'Kareem Diyaa',
  jobTitle: 'VP of Platform Operations',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'company_wasalt_tech',
    name: 'Wasalt Logistics HQ',
    slug: 'wasalt-logistics',
    description: 'Central operations hub managing multi-city vehicle dispatches and shuttle routes.',
    industry: 'Transportation & Logistics',
    companySize: '50-250 Employees',
    website: 'https://wasalt.io',
    contactEmail: 'ops@wasalt.io',
    theme: getPresetThemeById('wasalt-sapphire'),
    subscriptionPlanId: 'pro',
    subscriptionStatus: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'company_apex_transit',
    name: 'Apex Campus Shuttle',
    slug: 'apex-campus',
    description: 'Private university shuttle network serving 12,000 enrolled daily students.',
    industry: 'Education & Transit',
    companySize: '10-50 Employees',
    website: 'https://apex.edu/transit',
    contactEmail: 'dispatch@apex.edu',
    theme: getPresetThemeById('emerald-ops'),
    subscriptionPlanId: 'starter',
    subscriptionStatus: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'company_aurora_vip',
    name: 'Aurora Executive Limousines',
    slug: 'aurora-vip',
    description: 'Bespoke corporate chauffeur and executive transport service.',
    industry: 'Luxury Travel',
    companySize: '5-20 Employees',
    website: 'https://aurora-vip.com',
    contactEmail: 'concierge@aurora-vip.com',
    theme: getPresetThemeById('royal-amethyst'),
    subscriptionPlanId: 'enterprise',
    subscriptionStatus: 'active',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_MEMBERSHIPS: AdminCompanyMembership[] = [
  {
    id: 'mem_1',
    adminId: DEMO_ADMIN.id,
    companyId: 'company_wasalt_tech',
    role: 'owner',
    adminName: DEMO_ADMIN.fullName,
    adminEmail: DEMO_ADMIN.email,
    status: 'active',
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_2',
    adminId: DEMO_ADMIN.id,
    companyId: 'company_apex_transit',
    role: 'admin',
    adminName: DEMO_ADMIN.fullName,
    adminEmail: DEMO_ADMIN.email,
    status: 'active',
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_3',
    adminId: DEMO_ADMIN.id,
    companyId: 'company_aurora_vip',
    role: 'manager',
    adminName: DEMO_ADMIN.fullName,
    adminEmail: DEMO_ADMIN.email,
    status: 'active',
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_4',
    adminId: 'admin_sarah',
    companyId: 'company_wasalt_tech',
    role: 'admin',
    adminName: 'Sarah Jenkins',
    adminEmail: 'sarah.j@wasalt.io',
    status: 'active',
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_5',
    adminId: 'admin_alex',
    companyId: 'company_wasalt_tech',
    role: 'manager',
    adminName: 'Alex Mercer',
    adminEmail: 'alex.m@wasalt.io',
    status: 'active',
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
