/**
 * AdminCompanyMembership Service — Real RTDB
 * Team invitations, role changes, and member management stored in
 * /memberships/{companyId}/ in the shared Firebase RTDB (org-scoped).
 */
import { ref, set, get, update, remove } from 'firebase/database';
import { rtdb } from './firebaseClient';
import { AdminCompanyMembership, AdminRole, InviteMemberPayload } from '@wasalt/types';

/**
 * Fetches all memberships for a company from /memberships/{companyId}/.
 */
export async function fetchMembersForCompany(companyId: string): Promise<AdminCompanyMembership[]> {
  try {
    const snap = await get(ref(rtdb, `memberships/${companyId}`));
    if (!snap.exists()) return [];
    const values = snap.val() as Record<string, AdminCompanyMembership>;
    return Object.values(values);
  } catch (err) {
    console.error('[MembershipService] fetchMembersForCompany error:', err);
    return [];
  }
}

/**
 * Best-effort lookup of an existing admin's UID by email in /admins/.
 * Returns null when no signed-up admin matches the invited email.
 */
async function _findAdminIdByEmail(email: string): Promise<string | null> {
  try {
    const snap = await get(ref(rtdb, 'admins'));
    if (!snap.exists()) return null;
    const admins = snap.val() as Record<string, { email?: string }>;
    const match = Object.entries(admins).find(
      ([, profile]) => profile?.email?.toLowerCase() === email.toLowerCase()
    );
    return match ? match[0] : null;
  } catch {
    return null;
  }
}

/**
 * Creates an invitation record for a company in /memberships/{companyId}/.
 */
export async function inviteMember(
  companyId: string,
  payload: InviteMemberPayload
): Promise<AdminCompanyMembership> {
  const now = new Date().toISOString();
  const resolvedAdminId = await _findAdminIdByEmail(payload.email);
  const membership: AdminCompanyMembership = {
    id: `mem_${Date.now().toString(36)}`,
    adminId: resolvedAdminId || `pending_${payload.email.toLowerCase()}`,
    companyId,
    role: payload.role,
    adminName: payload.fullName,
    adminEmail: payload.email,
    status: 'invited',
    invitedAt: now,
    joinedAt: now,
    updatedAt: now,
  };

  await set(ref(rtdb, `memberships/${companyId}/${membership.id}`), membership);
  return membership;
}

/**
 * Updates a member's role within a company.
 */
export async function updateMemberRole(
  companyId: string,
  membershipId: string,
  newRole: AdminRole
): Promise<AdminCompanyMembership> {
  const memberPath = `memberships/${companyId}/${membershipId}`;
  const snap = await get(ref(rtdb, memberPath));
  if (!snap.exists()) throw new Error('Membership not found');

  const existing = snap.val() as AdminCompanyMembership;
  const updated: AdminCompanyMembership = {
    ...existing,
    role: newRole,
    updatedAt: new Date().toISOString(),
  };

  await update(ref(rtdb, memberPath), { role: newRole, updatedAt: updated.updatedAt });
  return updated;
}

/**
 * Removes a member from a company.
 */
export async function removeMember(companyId: string, membershipId: string): Promise<void> {
  await remove(ref(rtdb, `memberships/${companyId}/${membershipId}`));
}
