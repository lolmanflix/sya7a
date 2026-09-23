/**
 * Admin-Company Membership (Many-to-Many) & RBAC permissions
 */

export type AdminRole = 'owner' | 'admin' | 'manager';

export interface RolePermission {
  action: string;
  description: string;
  allowedRoles: AdminRole[];
}

export interface AdminCompanyMembership {
  id: string; // e.g. `${adminId}_${companyId}`
  adminId: string;
  companyId: string;
  role: AdminRole;
  adminName: string;
  adminEmail: string;
  avatarUrl?: string;
  status: 'active' | 'invited' | 'suspended';
  invitedAt?: string;
  joinedAt: string;
  updatedAt: string;
}

export interface InviteMemberPayload {
  email: string;
  fullName: string;
  role: AdminRole;
}
