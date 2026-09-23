import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { Button } from '../common/Button';
import { Check, Building, Globe, Mail, Hash } from 'lucide-react';

export const CompanySettingsView: React.FC = () => {
  const { activeCompany, updateCurrentCompany } = useCompany();

  const [name, setName] = useState(activeCompany?.name || '');
  const [slug, setSlug] = useState(activeCompany?.slug || '');
  const [description, setDescription] = useState(activeCompany?.description || '');
  const [industry, setIndustry] = useState(activeCompany?.industry || 'Logistics & Transportation');
  const [website, setWebsite] = useState(activeCompany?.website || '');
  const [contactEmail, setContactEmail] = useState(activeCompany?.contactEmail || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (activeCompany) {
      setName(activeCompany.name);
      setSlug(activeCompany.slug);
      setDescription(activeCompany.description || '');
      setIndustry(activeCompany.industry || 'Logistics & Transportation');
      setWebsite(activeCompany.website || '');
      setContactEmail(activeCompany.contactEmail || '');
    }
  }, [activeCompany]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany) return;
    setIsSaving(true);
    try {
      await updateCurrentCompany({
        name,
        slug,
        description,
        industry,
        website,
        contactEmail,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Workspace General Settings</h2>
        <p className="text-xs text-slate-500">
          Configure corporate identifiers and operational contact information.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Workspace profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        {/* Company Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Workspace URL Slug</label>
          <div className="relative">
            <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Summary</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Website & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="primary" type="submit" isLoading={isSaving}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
