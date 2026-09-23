import React, { useState } from 'react';
import { validateCompanySetup } from '@wasalt/validation';
import { Button } from '../common/Button';
import { ArrowLeft, ArrowRight, Building, Globe, Hash, Layers } from 'lucide-react';

interface StepCompanyDetailsProps {
  initialData: {
    name: string;
    slug: string;
    industry: string;
    companySize: string;
    website?: string;
  };
  onNext: (data: {
    name: string;
    slug: string;
    industry: string;
    companySize: string;
    website?: string;
  }) => void;
  onBack: () => void;
}

export const StepCompanyDetails: React.FC<StepCompanyDetailsProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [name, setName] = useState(initialData.name);
  const [slug, setSlug] = useState(initialData.slug);
  const [industry, setIndustry] = useState(initialData.industry || 'Logistics & Transportation');
  const [companySize, setCompanySize] = useState(initialData.companySize || '10-50 Employees');
  const [website, setWebsite] = useState(initialData.website || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === initialData.slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateCompanySetup({ name, slug, industry, website });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onNext({ name, slug, industry, companySize, website });
  };

  const industries = [
    'Logistics & Transportation',
    'Campus & School Shuttles',
    'Corporate Executive Travel',
    'Municipal Public Transit',
    'Hospital & Healthcare Transit',
    'Other Enterprise Operations',
  ];

  const teamSizes = ['1-10 Employees', '10-50 Employees', '50-250 Employees', '250+ Employees'];

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Set Up Your First Workspace</h3>
        <p className="text-xs text-slate-500">
          Define the identity and organizational scope of your initial company workspace.
        </p>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Company / Organization Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Apex Regional Transit"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? 'border-red-300 focus:ring-red-200'
                : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
            }`}
          />
        </div>
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Workspace URL Slug */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Workspace Slug (URL Identifier)
        </label>
        <div className="relative">
          <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder="apex-transit"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Your workspace URL: <span className="font-mono text-slate-600">wasalt.io/{slug || 'your-slug'}</span>
        </p>
      </div>

      {/* Industry and Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Company Size</label>
          <select
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          >
            {teamSizes.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Corporate Website (Optional)
        </label>
        <div className="relative">
          <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://company.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>
        {errors.website && <p className="text-xs text-red-500 mt-1">{errors.website}</p>}
      </div>

      {/* Form Buttons */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <Button variant="ghost" type="button" onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button variant="primary" type="submit" icon={<ArrowRight className="w-4 h-4" />}>
          Next: Branding & Theme
        </Button>
      </div>
    </form>
  );
};
