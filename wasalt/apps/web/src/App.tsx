import React, { useState, useEffect, useCallback } from 'react';
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
import { NotFoundPage } from './components/pages/NotFoundPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DownloadPage } from './components/DownloadPage';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { PaymentCheckout } from './components/pages/PaymentCheckout';
import { PaymentResult } from './components/pages/PaymentResult';
import { readRedirectParams, PendingCheckout } from './services/kashierService';
import { Toaster } from 'sonner';

/** Every page the site serves, keyed by its exact URL path. */
type ViewMode = 'marketing' | 'dashboard' | 'download' | 'privacy' | 'terms' | 'notfound';

const ROUTES: Record<string, ViewMode> = {
  '/': 'marketing',
  '/download': 'download',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/dashboard': 'dashboard',
};

/**
 * Validates a URL pathname against the route table.
 * Malformed percent-encoding or any unknown path fails validation → 'notfound'.
 * Trailing slashes are tolerated ("/download/" === "/download").
 */
function parseRoute(rawPathname: string): ViewMode {
  let path: string;
  try {
    path = decodeURIComponent(rawPathname);
  } catch {
    return 'notfound'; // invalid % sequence in the URL
  }
  path = path.replace(/\/+$/, '') || '/';
  return ROUTES[path] ?? 'notfound';
}

/** sessionStorage key — keeps the workspace name alive across refreshes. */
const COMPANY_NAME_KEY = 'wasalt:companyName';

function readRememberedCompanyName(): string {
  try {
    return sessionStorage.getItem(COMPANY_NAME_KEY) || 'Your Workspace';
  } catch {
    return 'Your Workspace';
  }
}

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // URL-driven view state: parsed from the pathname on load so a refresh
  // (or a deep link) always restores the page the visitor was on.
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    typeof window !== 'undefined' ? parseRoute(window.location.pathname) : 'marketing'
  );
  const [currentHash, setCurrentHash] = useState<string>(
    typeof window !== 'undefined' ? window.location.hash : ''
  );
  const [createdCompanyName, setCreatedCompanyName] = useState<string>(readRememberedCompanyName);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [initialPlanId, setInitialPlanId] = useState('pro');
  const [initialBillingCycle, setInitialBillingCycle] = useState<'monthly' | 'annual'>('annual');
  // Kashier return payload (?paymentStatus=…&signature=…) — read once on mount.
  const [paymentParams, setPaymentParams] = useState<Record<string, string> | null>(() =>
    readRedirectParams()
  );
  // Checkout opened right after onboarding creates the company.
  const [checkoutRequest, setCheckoutRequest] = useState<{
    planId: string;
    billingCycle: 'monthly' | 'annual';
    companyId: string;
    companyName: string;
  } | null>(null);

  /** Remembers the workspace name for the session so refreshes don't reset it. */
  const rememberCompanyName = useCallback((name: string) => {
    setCreatedCompanyName(name);
    try {
      sessionStorage.setItem(COMPANY_NAME_KEY, name);
    } catch {
      /* noop — private mode etc. */
    }
  }, []);

  /**
   * SPA navigation — keeps the URL (and therefore refresh / back / forward)
   * in sync with the rendered page.
   */
  const navigate = useCallback((to: string, opts: { replace?: boolean } = {}) => {
    const url = new URL(to, window.location.origin);
    const nextUrl = url.pathname + url.search + url.hash;
    if (opts.replace) {
      window.history.replaceState(null, '', nextUrl);
    } else {
      window.history.pushState(null, '', nextUrl);
    }
    setCurrentHash(url.hash);
    setViewMode(parseRoute(url.pathname));
    window.scrollTo(0, 0);
  }, []);

  const handleStartOnboarding = (
    planId: string = 'pro',
    billingCycle: 'monthly' | 'annual' = 'annual'
  ) => {
    setInitialPlanId(planId);
    setInitialBillingCycle(billingCycle);
    setIsLoginOpen(false);
    setIsOnboardingOpen(true);
  };

  const handleOnboardingComplete = (
    companyName: string,
    meta: { companyId: string; planId: string; billingCycle: 'monthly' | 'annual' }
  ) => {
    rememberCompanyName(companyName);
    setIsOnboardingOpen(false);
    // Go straight to the Kashier checkout instead of skipping payment.
    setCheckoutRequest({
      planId: meta.planId,
      billingCycle: meta.billingCycle,
      companyId: meta.companyId,
      companyName,
    });
  };

  // After the browser returns from Kashier, route to download or dashboard.
  const handlePaymentDone = (destination: 'download' | 'dashboard', pending: PendingCheckout | null) => {
    setPaymentParams(null);
    if (pending?.companyName) rememberCompanyName(pending.companyName);
    if (destination === 'dashboard' && isAuthenticated) {
      navigate('/dashboard');
    } else if (destination === 'dashboard') {
      navigate('/');
    } else {
      navigate('/download');
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    navigate('/dashboard');
  };

  // Navbar sign-in entry: authenticated users jump straight to the dashboard.
  const handleSignIn = (target?: 'login' | 'dashboard') => {
    if (target === 'dashboard' && isAuthenticated) {
      navigate('/dashboard');
      return;
    }
    setIsLoginOpen(true);
  };

  // After sign-out (or a direct hit on /dashboard while signed out),
  // return to the marketing site instead of a stale shell.
  useEffect(() => {
    if (!isLoading && !isAuthenticated && viewMode === 'dashboard') {
      navigate('/', { replace: true });
    }
  }, [isLoading, isAuthenticated, viewMode, navigate]);

  // Browser back/forward: re-validate the pathname and follow it.
  useEffect(() => {
    const onPopState = () => {
      setCurrentHash(window.location.hash);
      setViewMode(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Track URL hash so anchors (#pricing…) and legal links (#privacy / #terms)
  // keep driving the right page.
  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Hash routing: #privacy / #terms open the legal doc (promoted to a real
  // /privacy · /terms route), any other anchor scrolls the marketing page —
  // returning there first if the visitor is on a legal/404 page.
  useEffect(() => {
    if (!currentHash) return;

    if (currentHash === '#privacy' || currentHash === '#terms') {
      const target = currentHash.slice(1);
      if (viewMode !== target) {
        // Footer link landed here from another page → make it a real route.
        window.history.replaceState(null, '', `/${target}`);
        setViewMode(target as ViewMode);
        window.scrollTo(0, 0);
      }
      return;
    }

    const targetId = currentHash.slice(1);

    // Section anchors only exist on the marketing page.
    if (viewMode !== 'marketing') {
      navigate(`/${currentHash}`, { replace: true }); // e.g. "/#pricing"
      return;
    }

    if (targetId) {
      // Let the marketing sections mount before scrolling to the anchor.
      const timer = window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return () => window.clearTimeout(timer);
    }
  }, [currentHash, viewMode, navigate]);

  // Closing a legal page returns home without leaving a stale hash behind.
  const handleLegalBack = () => {
    navigate('/');
  };

  const renderNavbar = () => (
    <Navbar
      onStartOnboarding={() => handleStartOnboarding('pro')}
      onSignIn={handleSignIn}
      isAuthenticated={isAuthenticated}
      onGoHome={() => navigate('/')}
    />
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Toaster richColors position="top-right" />

      {viewMode === 'download' ? (
        <DownloadPage
          companyName={createdCompanyName}
          onGoToDashboard={() => navigate('/dashboard')}
        />
      ) : viewMode === 'privacy' || viewMode === 'terms' ? (
        <>
          {renderNavbar()}

          <main className="flex-1">
            <LegalPage doc={viewMode} onBack={handleLegalBack} />
          </main>

          <Footer />
        </>
      ) : viewMode === 'dashboard' ? (
        <DashboardLayout
          onExitToWebsite={() => navigate('/')}
          onCreateNewWorkspace={() => setIsOnboardingOpen(true)}
        />
      ) : viewMode === 'notfound' ? (
        <>
          {renderNavbar()}

          <main className="flex-1">
            <NotFoundPage
              currentPath={window.location.pathname}
              onGoHome={() => navigate('/')}
              onGoDownload={() => navigate('/download')}
            />
          </main>

          <Footer />
        </>
      ) : (
        <>
          {renderNavbar()}

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

      {/* Kashier checkout (opened right after onboarding) */}
      {checkoutRequest && !paymentParams && (
        <PaymentCheckout
          planId={checkoutRequest.planId}
          billingCycle={checkoutRequest.billingCycle}
          companyId={checkoutRequest.companyId}
          companyName={checkoutRequest.companyName}
          context="onboarding"
          onExit={() => {
            setCheckoutRequest(null);
            navigate('/download');
          }}
        />
      )}

      {/* Result of the redirect back from Kashier's hosted page */}
      {paymentParams && (
        <PaymentResult params={paymentParams} onDone={handlePaymentDone} />
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
