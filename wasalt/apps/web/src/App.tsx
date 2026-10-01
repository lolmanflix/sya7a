import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CompanyProvider, useCompany } from './context/CompanyContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/marketing/HeroSection';
import { ProblemSolutionSection } from './components/marketing/ProblemSolutionSection';
import { LiveThemeDemo } from './components/marketing/LiveThemeDemo';
import { FeaturesGrid } from './components/marketing/FeaturesGrid';
import { HowItWorksSection } from './components/marketing/HowItWorksSection';
import { PricingSection } from './components/marketing/PricingSection';
import { TestimonialsSection } from './components/marketing/TestimonialsSection';
import { FaqSection } from './components/marketing/FaqSection';
import { CtaBanner } from './components/marketing/CtaBanner';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Toaster } from 'sonner';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeCompany } = useCompany();

  const [viewMode, setViewMode] = useState<'marketing' | 'dashboard'>('marketing');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [initialPlanId, setInitialPlanId] = useState('pro');

  const handleStartOnboarding = (planId: string = 'pro') => {
    setInitialPlanId(planId);
    setIsLoginOpen(false);
    setIsOnboardingOpen(true);
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingOpen(false);
    setViewMode('dashboard');
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setViewMode('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Toaster richColors position="top-right" />

      {viewMode === 'dashboard' ? (
        <DashboardLayout
          onExitToWebsite={() => setViewMode('marketing')}
          onCreateNewWorkspace={() => setIsOnboardingOpen(true)}
        />
      ) : (
        <>
          <Navbar
            onOpenLogin={() => setIsLoginOpen(true)}
            onStartOnboarding={() => handleStartOnboarding('pro')}
            onGoToDashboard={() => setViewMode('dashboard')}
            isAuthenticated={isAuthenticated}
          />

          <main className="flex-1">
            <HeroSection
              onStartOnboarding={() => handleStartOnboarding('pro')}
              onExploreDemo={() => {
                const el = document.getElementById('theme-demo');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ProblemSolutionSection />

            <LiveThemeDemo onStartWithTheme={() => handleStartOnboarding('pro')} />

            <FeaturesGrid />

            <HowItWorksSection />

            <PricingSection onSelectPlan={(planId) => handleStartOnboarding(planId)} />

            <TestimonialsSection />

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
        <CompanyProvider>
          <AppContent />
        </CompanyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
