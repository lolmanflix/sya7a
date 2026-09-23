/**
 * AdminCompanyMembership Service
 * Handles team invitations, role changes, and member management.
 */
import { AdminCompanyMembership, AdminRole, InviteMemberPayload } from '@wasalt/types';
import { INITIAL_MEMBERSHIPS } from '../utils/mockData';

const MEMBERSHIPS_KEY = 'wasalt_memberships_data';

function getStoredMemberships(): AdminCompanyMembership[] {
  if (typeof window === 'undefined') return INITIAL_MEMBERSHIPS;
  const stored = localStorage.getItem(MEMBERSHIPS_KEY);
  if (!stored) {
    localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(INITIAL_MEMBERSHIPS));
    return INITIAL_MEMBERSHIPS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MEMBERSHIPS;
  }
}

function saveMemberships(items: AdminCompanyMembership[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(items));
  }
}

export async function fetchMembersForCompany(companyId: string): Promise<AdminCompanyMembership[]> {
  await new Promise((res) => setTimeout(res, 200));
  const all = getStoredMemberships();
  return all.filter((m) => m.companyId === companyId);
}

export async function inviteMember(
  companyId: string,
  payload: InviteMemberPayload
): Promise<AdminCompanyMembership> {
  const all = getStoredMemberships();
  const newMember: AdminCompanyMembership = {
    id: `mem_${Date.now().toString(36)}`,
    adminId: `admin_guest_${Date.now().toString(36)}`,
    companyId,
    role: payload.role,
    adminName: payload.fullName,
    adminEmail: payload.email,
    status: 'invited',
    invitedAt: new Date().toISOString(),
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [...all, newMember];
  saveMemberships(updated);
  return newMember;
}

export async function updateMemberRole(
  membershipId: string,
  newRole: AdminRole
): Promise<AdminCompanyMembership> {
  const all = getStoredMemberships();
  const index = all.findIndex((m) => m.id === membershipId);
  if (index === -1) throw new Error('Membership not found');

  const updated: AdminCompanyMembership = {
    ...all[index],
    role: newRole,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  saveMemberships(all);
  return updated;
}

export async function removeMember(membershipId: string): Promise<void> {
  const all = getStoredMemberships();
  const filtered = all.filter((m) => m.id !== membershipId);
  saveMemberships(filtered);
}
