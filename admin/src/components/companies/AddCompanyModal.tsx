/**
 * @file AddCompanyModal.tsx
 * @description Modal dialog allowing administrators to register new transit operators,
 * university campus shuttles, private carriers, or school transport authorities.
 */

import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { saveCompany } from '../../services/companiesService';
import { toast } from 'sonner';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (companyId: string, name: string) => void;
}

/**
 * Modal form component to register new transit operating company.
 *
 * @param props - Modal visibility and close callbacks.
 * @returns JSX Element.
 */
export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newCompId, setNewCompId] = useState('');
  const [newCompName, setNewCompName] = useState('');
  const [newCompDomain, setNewCompDomain] = useState('');
  const [saving, setSaving] = useState(false);

  /**
   * Handles company registration submission to Firebase RTDB.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = newCompId.trim();
    const cleanName = newCompName.trim();

    if (!cleanId || !cleanName) {
      toast.error('Company ID and Name are required.');
      return;
    }

    setSaving(true);
    try {
      await saveCompany(cleanId, {
        name: cleanName,
        domain: newCompDomain.trim() || null,
        busLines: [],
      });
      toast.success(`Operator ${cleanName} created.`);
      if (onSuccess) onSuccess(cleanId, cleanName);
      onClose();
      setNewCompId('');
      setNewCompName('');
      setNewCompDomain('');
    } catch (err) {
      console.error('[AddCompanyModal] Failed to create operator:', err);
      toast.error('Failed to create company.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Transit Operator"
      subtitle="Register a new public transport authority, university shuttle, or private carrier."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Company Slug / ID
          </label>
          <input
            type="text"
            value={newCompId}
            onChange={(e) =>
              setNewCompId(e.target.value.toLowerCase().replace(/\s+/g, '-'))
            }
            placeholder="e.g. ecu-shuttle, cta, or super-jet"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={newCompName}
            onChange={(e) => setNewCompName(e.target.value)}
            placeholder="e.g. ECU Transit Shuttles"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Staff Email Domain (Optional)
          </label>
          <input
            type="text"
            value={newCompDomain}
            onChange={(e) =>
              setNewCompDomain(e.target.value.toLowerCase().replace('@', ''))
            }
            placeholder="e.g. ecu.edu.eg or cta.eg"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Drivers or admins signing up with this domain will be linked automatically.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4" />
            {saving ? 'Creating...' : 'Create Operator'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
