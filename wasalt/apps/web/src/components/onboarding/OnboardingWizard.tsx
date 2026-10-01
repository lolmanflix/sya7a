import React, { useState } from 'react';
import { CompanyTheme } from '@wasalt/types';
import { getPresetThemeById } from '@wasalt/theme';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { StepAdminAccount } from './StepAdminAccount';
import { StepCompanyDetails } from './StepCompanyDetails';
import { StepBrandTheme } from './StepBrandTheme';
import { StepConfirmWorkspace } from './StepConfirmWorkspace';
import { Sparkles, Check, X } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
  onCancel: () => void;
  initialPlanId?: string;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onCancel,
  initialPlanId = 'pro',
}) => {
  const { signUp, admin } = useAuth();
  const { createNewCompany } = useCompany();

  const [step, setStep] = useState<number>(admin ? 2 : 1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State across steps
  const [adminData, setAdminData] = useState({
    fullName: admin?.fullName || '',
    email: admin?.email || '',
    password: '',
    jobTitle: admin?.jobTitle || '',
  });

  const [companyData, setCompanyData] = useState({
    name: '',
    slug: '',
    industry: 'Logistics & Transportation',
    companySize: '10-50 Employees',
    website: '',
  });

  const [theme, setTheme] = useState<CompanyTheme>(getPresetThemeById('wasalt-sapphire'));
  const [logoUrl, setLogoUrl] = useState<string | undefined>();

  const stepTitles = [
    'Admin Account',
    'Company Details',
    'Brand & Theme',
    'Launch',
  ];

  const handleStep1Next = async (data: {
    fullName: string;
    email: string;
    password: string;
    jobTitle?: string;
  }) => {
    setAdminData({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      jobTitle: data.jobTitle || '',
    });
    setIsLoading(true);
    try {
      if (!admin) {
        await signUp({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        });
      }
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Next = (data: {
    name: string;
    slug: string;
    industry: string;
    companySize: string;
    website?: string;
  }) => {
    setCompanyData({
      name: data.name,
      slug: data.slug,
      industry: data.industry,
      companySize: data.companySize,
      website: data.website || '',
    });
    setStep(3);
  };

  const handleStep3Next = (chosenTheme: CompanyTheme, uploadedLogo?: string) => {
    setTheme(chosenTheme);
    setLogoUrl(uploadedLogo);
    setStep(4);
  };

  const handleLaunch = async () => {
    setIsLoading(true);
    try {
      await createNewCompany({
        name: companyData.name,
        slug: companyData.slug,
        industry: companyData.industry,
        companySize: companyData.companySize,
        website: companyData.website,
        theme,
        logoUrl,
      });
      onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-scaleUp">
        {/* Wizard Top Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Wasalt Onboarding Wizard</h2>
              <p className="text-[11px] text-slate-400">
                Step {step} of 4: {stepTitles[step - 1]}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Step Indicator */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 w-full">
            {stepTitles.map((title, idx) => {
              const stepNumber = idx + 1;
              const isPast = stepNumber < step;
              const isCurrent = stepNumber === step;
              return (
                <div key={title} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400/30'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : stepNumber}
                  </div>
                  <span
                    className={`text-xs font-semibold truncate hidden sm:inline ${
                      isCurrent ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {title}
                  </span>
                  {idx < stepTitles.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        isPast ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8">
          {step === 1 && (
            <StepAdminAccount
              initialData={adminData}
              onNext={handleStep1Next}
              onCancel={onCancel}
            />
          )}

          {step === 2 && (
            <StepCompanyDetails
              initialData={companyData}
              onNext={handleStep2Next}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <StepBrandTheme
              initialTheme={theme}
              companyName={companyData.name}
              onNext={handleStep3Next}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <StepConfirmWorkspace
              adminData={adminData}
              companyData={companyData}
              theme={theme}
              logoUrl={logoUrl}
              isLoading={isLoading}
              onLaunch={handleLaunch}
              onBack={() => setStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
