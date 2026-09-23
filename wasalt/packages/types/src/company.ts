/**
 * Company tenant and settings data models
 */
import { CompanyTheme } from './theme';

export interface Company {
  id: string; // Tenant UID
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  contactEmail?: string;
  theme: CompanyTheme;
  subscriptionPlanId: string;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CompanyCreatePayload {
  name: string;
  slug?: string;
  logoUrl?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  contactEmail?: string;
  theme: CompanyTheme;
}

export interface CompanyStats {
  totalMembers: number;
  activeUsers: number;
  teamsCount: number;
  storageUsedMb: number;
  operationsHealthScore: number;
}
