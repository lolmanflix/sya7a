/**
 * Company Tenant Service
 * Manages company creation, updates, and multi-tenant scoping.
 */
import { Company, CompanyCreatePayload } from '@wasalt/types';
import { INITIAL_COMPANIES } from '../utils/mockData';

const COMPANIES_STORAGE_KEY = 'wasalt_companies_data';

function getStoredCompanies(): Company[] {
  if (typeof window === 'undefined') return INITIAL_COMPANIES;
  const stored = localStorage.getItem(COMPANIES_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(INITIAL_COMPANIES));
    return INITIAL_COMPANIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_COMPANIES;
  }
}

function saveCompanies(companies: Company[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
  }
}

export async function fetchCompaniesForAdmin(adminId: string): Promise<Company[]> {
  await new Promise((res) => setTimeout(res, 200));
  // In demo/localStorage mode, all companies stored locally are associated with the active demo admin
  return getStoredCompanies();
}

export async function createCompany(payload: CompanyCreatePayload): Promise<Company> {
  await new Promise((res) => setTimeout(res, 400));
  const companies = getStoredCompanies();

  const slug =
    payload.slug ||
    payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const newCompany: Company = {
    id: `comp_${Date.now().toString(36)}`,
    name: payload.name,
    slug,
    logoUrl: payload.logoUrl,
    description: payload.description,
    industry: payload.industry,
    companySize: payload.companySize,
    website: payload.website,
    contactEmail: payload.contactEmail,
    theme: payload.theme,
    subscriptionPlanId: 'starter',
    subscriptionStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newCompany, ...companies];
  saveCompanies(updated);
  return newCompany;
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
  const companies = getStoredCompanies();
  const index = companies.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Company not found');

  const updatedCompany: Company = {
    ...companies[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  companies[index] = updatedCompany;
  saveCompanies(companies);
  return updatedCompany;
}
