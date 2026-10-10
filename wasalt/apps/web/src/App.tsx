import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageThemeProvider } from './context/LanguageThemeContext';
import { CompanyProvider } from './context/CompanyContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/marketing/HeroSection';
import { ProblemSolutionSection } from './components/marketing/ProblemSolutionSection';
import { LiveThemeDemo } from './components/marketing/LiveThemeDemo';
import { FeaturesGrid } from './components/marketing/FeaturesGrid';
import { HowItWorksSection } from './components/marketing/HowItWorksSection';
import { PricingSection } from './components/marketing/PricingSection';
import { FleetExperience } from './components/marketing/FleetExperience';
import { AudienceSections, DriverEcosystem, EcosystemSection } from './components/marketing/AudienceSections';
import { FaqSection } from './components/marketing/FaqSection';
import { CtaBanner } from './components/marketing/CtaBanner';
import { LegalPage } from './components/pages/LegalPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DownloadPage } from './components/DownloadPage';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Toaster } from 'sonner';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [viewMode, setViewMode] = useState<
    'marketing' | 'dashboard' | 'download' | 'privacy' | 'terms'
  >('marketing');
  const [currentHash, setCurrentHash] = useState<string>(
    typeof window !== 'undefined' ? window.location.hash : ''
  );
  const [createdCompanyName, setCreatedCompanyName] = useState<string>('Your Workspace');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [initialPlanId, setInitialPlanId] = useState('pro');
  const [initialBillingCycle, setInitialBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleStartOnboarding = (
    planId: string = 'pro',
    billingCycle: 'monthly' | 'annual' = 'annual'
  ) => {
    setInitialPlanId(planId);
    setInitialBillingCycle(billingCycle);
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

  // Navbar sign-in entry: authenticated users jump straight to the dashboard.
  const handleSignIn = (target?: 'login' | 'dashboard') => {
    if (target === 'dashboard' && isAuthenticated) {
      setViewMode('dashboard');
      return;
    }
    setIsLoginOpen(true);
  };

  // After sign-out, return to the marketing site instead of a stale shell.
  useEffect(() => {
    if (!isAuthenticated && viewMode === 'dashboard') {
      setViewMode('marketing');
    }
  }, [isAuthenticated, viewMode]);

  // Track URL hash so #privacy / #terms can drive the legal pages.
  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Legal-page routing: #privacy / #terms open the doc, any other hash
  // returns to the marketing page and scrolls to that section.
  useEffect(() => {
    if (currentHash === '#privacy' || currentHash === '#terms') {
      setViewMode(currentHash === '#privacy' ? 'privacy' : 'terms');
      window.scrollTo(0, 0);
      return;
    }
    setViewMode((prev) => {
      if (prev !== 'privacy' && prev !== 'terms') return prev;
      const targetId = currentHash.replace('#', '');
      if (targetId) {
        // Let the marketing sections mount before scrolling to the anchor.
        window.setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
      return 'marketing';
    });
  }, [currentHash]);

  // Closing a legal page returns home without leaving a stale hash behind.
  const handleLegalBack = () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setCurrentHash('');
    setViewMode('marketing');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Toaster richColors position="top-right" />

      {viewMode === 'download' ? (
        <DownloadPage
          companyName={createdCompanyName}
          onGoToDashboard={() => setViewMode('dashboard')}
        />
      ) : viewMode === 'privacy' || viewMode === 'terms' ? (
        <>
          <Navbar
            onStartOnboarding={() => handleStartOnboarding('pro')}
            onSignIn={handleSignIn}
            isAuthenticated={isAuthenticated}
          />

          <main className="flex-1">
            <LegalPage doc={viewMode} onBack={handleLegalBack} />
          </main>

          <Footer />
        </>
      ) : viewMode === 'dashboard' ? (
        <DashboardLayout
          onExitToWebsite={() => setViewMode('marketing')}
          onCreateNewWorkspace={() => setIsOnboardingOpen(true)}
        />
      ) : (
        <>
          <Navbar
            onStartOnboarding={() => handleStartOnboarding('pro')}
            onSignIn={handleSignIn}
            isAuthenticated={isAuthenticated}
          />

          <main className="flex-1">
            <HeroSection
              onStartOnboarding={() => handleStartOnboarding('pro')}
              onExploreDemo={() => {
                const el = document.getElementById('live-tracking');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              isAuthenticated={isAuthenticated}
              onSignIn={handleSignIn}
            />

            <ProblemSolutionSection />

            <FleetExperience />

            <AudienceSections />

            <FeaturesGrid />

            <HowItWorksSection />

            <DriverEcosystem />

            <EcosystemSection />

            <LiveThemeDemo
              onStartWithTheme={() => handleStartOnboarding('pro')}
              isAuthenticated={isAuthenticated}
              onSignIn={handleSignIn}
            />

            <PricingSection
              onSelectPlan={(planId, isAnnual) =>
                handleStartOnboarding(planId, isAnnual ? 'annual' : 'monthly')
              }
              isAuthenticated={isAuthenticated}
            />

            <FaqSection />

            <CtaBanner
              onStartOnboarding={() => handleStartOnboarding('pro')}
              isAuthenticated={isAuthenticated}
              onSignIn={handleSignIn}
            />
          </main>

          <Footer />
        </>
      )}

      {/* Onboarding Wizard Modal */}
      {isOnboardingOpen && (
        <OnboardingWizard
          initialPlanId={initialPlanId}
          billingCycle={initialBillingCycle}
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

