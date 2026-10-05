import React, { useState } from 'react';
import { CompanyTheme } from '@wasalt/types';
import { getPresetThemeById } from '@wasalt/theme';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { StepAdminAccount } from './StepAdminAccount';
import { StepCompanyDetails } from './StepCompanyDetails';
import { StepBrandTheme } from './StepBrandTheme';
import { StepPlanSelection } from './StepPlanSelection';
import { recordPlanSelection } from '../../services/subscriptionService';
import { Sparkles, Check, X } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (companyName: string) => void;
  onCancel: () => void;
  initialPlanId?: string;
  billingCycle?: 'monthly' | 'annual';
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onCancel,
  initialPlanId = 'pro',
  billingCycle = 'monthly',
}) => {
  const { signUp, admin } = useAuth();
  const { createNewCompany } = useCompany();

  const [step, setStep] = useState<number>(admin ? 2 : 1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);

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

  const { language } = useLanguageTheme();
  const stepTitles =
    language === 'ar'
      ? ['حساب المشرف', 'بيانات المؤسسة', 'الهوية والمظهر', 'اختر الخطة والتنزيل']
      : ['Admin Account', 'Company Details', 'Brand & Theme', 'Select Plan & Download'];

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

  const handleProceedToPaymentAndDownload = async () => {
    setIsLoading(true);
    try {
      const createdCompany = await createNewCompany({
        name: companyData.name,
        slug: companyData.slug,
        industry: companyData.industry,
        companySize: companyData.companySize,
        website: companyData.website,
        theme,
        logoUrl,
      });
      // Persist the chosen plan to /subscriptions/{companyId}/ so the
      // admin dashboard sees it immediately (pending payment confirmation).
      try {
        await recordPlanSelection(createdCompany.id, selectedPlanId, billingCycle);
      } catch (subErr) {
        console.error('[Onboarding] Failed to record plan selection:', subErr);
      }
      onComplete(companyData.name);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-scaleUp">
        {/* Wizard Top Header */}
        <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold tracking-tight">Wasalt Onboarding Wizard</h2>
              <p className="text-[10px] text-slate-400">
                Step {step} of 4: {stepTitles[step - 1]}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar & Step Indicator */}
        <div className="bg-slate-100 dark:bg-slate-800/60 px-5 py-2.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 w-full">
            {stepTitles.map((title, idx) => {
              const stepNumber = idx + 1;
              const isPast = stepNumber < step;
              const isCurrent = stepNumber === step;
              return (
                <div key={title} className="flex items-center gap-1.5 flex-1">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400/30'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3" /> : stepNumber}
                  </div>
                  <span
                    className={`text-[11px] font-semibold truncate hidden sm:inline ${
                      isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {title}
                  </span>
                  {idx < stepTitles.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        isPast ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-5 sm:p-6">
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
            <StepPlanSelection
              selectedPlanId={selectedPlanId}
              billingCycle={billingCycle}
              onSelectPlan={setSelectedPlanId}
              onProceedToPaymentAndDownload={handleProceedToPaymentAndDownload}
              onBack={() => setStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
