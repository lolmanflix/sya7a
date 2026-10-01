import React from 'react';
import { CompanyTheme } from '@wasalt/types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ArrowLeft, Rocket, CheckCircle2, User, Building, Palette, Shield } from 'lucide-react';

interface StepConfirmWorkspaceProps {
  adminData: {
    fullName: string;
    email: string;
    jobTitle?: string;
  };
  companyData: {
    name: string;
    slug: string;
    industry: string;
    companySize: string;
  };
  theme: CompanyTheme;
  logoUrl?: string;
  isLoading: boolean;
  onLaunch: () => void;
  onBack: () => void;
}

export const StepConfirmWorkspace: React.FC<StepConfirmWorkspaceProps> = ({
  adminData,
  companyData,
  theme,
  logoUrl,
  isLoading,
  onLaunch,
  onBack,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Review & Launch Workspace</h3>
        <p className="text-xs text-slate-500">
          Verify your configuration. Your 14-day free trial includes full Pro features with zero
          commitment.
        </p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
        {/* Administrator Summary */}
        <div className="flex items-start gap-3 pb-4 border-b border-slate-200/80">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Master Admin
            </div>
            <div className="text-sm font-bold text-slate-900">{adminData.fullName}</div>
            <div className="text-xs text-slate-500">{adminData.email}</div>
          </div>
          <Badge variant="primary" size="sm">
            Owner Role
          </Badge>
        </div>

        {/* Company Summary */}
        <div className="flex items-start gap-3 pb-4 border-b border-slate-200/80">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Company Workspace
            </div>
            <div className="text-sm font-bold text-slate-900">{companyData.name}</div>
            <div className="text-xs font-mono text-slate-500">wasalt.io/{companyData.slug}</div>
          </div>
          <span className="text-xs text-slate-500">{companyData.industry}</span>
        </div>

        {/* Theme Summary */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Palette className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Synthesized Brand Palette
            </div>
            <div className="text-xs font-mono text-slate-800 font-semibold">
              Primary: {theme.colors.primary} &bull; WCAG: {theme.contrastRatio}:1
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accessible
          </span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-800 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span>
          Your data is isolated in a dedicated tenant space. You can invite additional team members and
          dispatch vehicles immediately after entering.
        </span>
      </div>

      {/* Buttons */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <Button
          variant="ghost"
          type="button"
          onClick={onBack}
          disabled={isLoading}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
        <Button
          variant="primary"
          type="button"
          onClick={onLaunch}
          isLoading={isLoading}
          icon={<Rocket className="w-4 h-4" />}
          className="shadow-lg shadow-blue-600/20"
        >
          Launch Workspace Now
        </Button>
      </div>
    </div>
  );
};
