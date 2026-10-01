import React, { useState, useEffect } from 'react';
import { AdminCompanyMembership, AdminRole } from '@wasalt/types';
import { validateInviteMember } from '@wasalt/validation';
import { useCompany } from '../../context/CompanyContext';
import * as membershipService from '../../services/membershipService';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Mail,
  User,
  CheckCircle2,
} from 'lucide-react';

export const TeamManagementView: React.FC = () => {
  const { activeCompany } = useCompany();
  const [members, setMembers] = useState<AdminCompanyMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('admin');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMembers = async () => {
    if (!activeCompany) return;
    setIsLoading(true);
    try {
      const list = await membershipService.fetchMembersForCompany(activeCompany.id);
      setMembers(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [activeCompany?.id]);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany) return;

    const validation = validateInviteMember({
      email: inviteEmail,
      fullName: inviteName,
      role: inviteRole,
    });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const newMem = await membershipService.inviteMember(activeCompany.id, {
        email: inviteEmail,
        fullName: inviteName,
        role: inviteRole,
      });
      setMembers((prev) => [...prev, newMem]);
      setInviteModalOpen(false);
      setInviteEmail('');
      setInviteName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (memberId: string, role: AdminRole) => {
    await membershipService.updateMemberRole(memberId, role);
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role } : m))
    );
  };

  const handleRemove = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      await membershipService.removeMember(memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Team & Administrator Governance</h2>
          <p className="text-xs text-slate-500">
            Control which administrators and dispatch managers have access to{' '}
            <span className="font-semibold text-slate-800">{activeCompany?.name}</span>.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setInviteModalOpen(true)}
          icon={<UserPlus className="w-4 h-4" />}
        >
          Invite Team Member
        </Button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Member</th>
                <th className="py-3.5 px-6">Assigned Role</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">
                        {m.adminName ? m.adminName[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{m.adminName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{m.adminEmail}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.id, e.target.value as AdminRole)}
                      disabled={m.role === 'owner'}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60 bg-white"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                    </select>
                  </td>

                  <td className="py-4 px-6">
                    <Badge variant={m.status === 'active' ? 'success' : 'warning'} size="sm">
                      {m.status}
                    </Badge>
                  </td>

                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>

                  <td className="py-4 px-6 text-right">
                    {m.role !== 'owner' && (
                      <button
                        onClick={() => handleRemove(m.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite New Team Member"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role & Permissions</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as AdminRole)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="admin">Admin (Full operations & team management)</option>
              <option value="manager">Manager (Dispatch telematics & fleet monitoring only)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
