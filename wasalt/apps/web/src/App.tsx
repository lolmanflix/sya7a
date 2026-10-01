import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageThemeProvider } from './context/LanguageThemeContext';
import { CompanyProvider, useCompany } from './context/CompanyContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/marketing/HeroSection';
import { ProblemSolutionSection } from './components/marketing/ProblemSolutionSection';
import { LiveThemeDemo } from './components/marketing/LiveThemeDemo';
import { FeaturesGrid } from './components/marketing/FeaturesGrid';
import { HowItWorksSection } from './components/marketing/HowItWorksSection';
import { PricingSection } from './components/marketing/PricingSection';
import { AudienceSections, DriverEcosystem, EcosystemSection, FleetExperience } from './components/marketing/FleetExperience';
import { FaqSection } from './components/marketing/FaqSection';
import { CtaBanner } from './components/marketing/CtaBanner';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DownloadPage } from './components/DownloadPage';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Toaster } from 'sonner';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeCompany } = useCompany();

  const [viewMode, setViewMode] = useState<'marketing' | 'dashboard' | 'download'>('marketing');
  const [createdCompanyName, setCreatedCompanyName] = useState<string>('Your Workspace');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [initialPlanId, setInitialPlanId] = useState('pro');

  const handleStartOnboarding = (planId: string = 'pro') => {
    setInitialPlanId(planId);
    setIsLoginOpen(false);
    setIsOnboardingOpen(true);
  };

  const handleOnboardingComplete = (companyName: string) => {
    setCreatedCompanyName(companyName);
    setIsOnboardingOpen(false);
    setViewMode('download');
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setViewMode('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Toaster richColors position="top-right" />

      {viewMode === 'download' ? (
        <DownloadPage
          companyName={createdCompanyName}
          onGoToDashboard={() => setViewMode('dashboard')}
        />
      ) : viewMode === 'dashboard' ? (
        <DashboardLayout
          onExitToWebsite={() => setViewMode('marketing')}
          onCreateNewWorkspace={() => setIsOnboardingOpen(true)}
        />
      ) : (
        <>
          <Navbar
            onStartOnboarding={() => handleStartOnboarding('pro')}
            isAuthenticated={isAuthenticated}
          />

          <main className="flex-1">
            <HeroSection
              onStartOnboarding={() => handleStartOnboarding('pro')}
              onExploreDemo={() => {
                const el = document.getElementById('live-tracking');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ProblemSolutionSection />

            <FleetExperience />

            <AudienceSections />

            <FeaturesGrid />

            <HowItWorksSection />

            <DriverEcosystem />

            <EcosystemSection />

            <LiveThemeDemo onStartWithTheme={() => handleStartOnboarding('pro')} />

            <PricingSection onSelectPlan={(planId) => handleStartOnboarding(planId)} />

            <FaqSection />

            <CtaBanner onStartOnboarding={() => handleStartOnboarding('pro')} />
          </main>

          <Footer />
        </>
      )}

      {/* Onboarding Wizard Modal */}
      {isOnboardingOpen && (
        <OnboardingWizard
          initialPlanId={initialPlanId}
          onComplete={handleOnboardingComplete}
          onCancel={() => setIsOnboardingOpen(false)}
        />
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onCancel={() => setIsLoginOpen(false)}
          onForgotPassword={() => {
            setIsLoginOpen(false);
            setIsForgotPasswordOpen(true);
          }}
          onSwitchToSignUp={() => {
            setIsLoginOpen(false);
            setIsOnboardingOpen(true);
          }}
        />
      )}

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageThemeProvider>
          <CompanyProvider>
            <AppContent />
          </CompanyProvider>
        </LanguageThemeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

