import React, { useState, useEffect } from 'react';
import { useAdminAuth } from './contexts/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { FleetPage } from './pages/FleetPage';
import { RoutesPage } from './pages/RoutesPage';
import { DriversPage } from './pages/DriversPage';
import { PassengersPage } from './pages/PassengersPage';
import { SecurityPage } from './pages/SecurityPage';
import { PricingPage } from './pages/PricingPage';
import { LoginPage } from './pages/LoginPage';

import { subscribeLiveTelemetry } from './services/telemetryService';
import { subscribeCompanies } from './services/companiesService';
import { subscribeAllBuses } from './services/busesService';
import { subscribeDrivers } from './services/driversService';
import { subscribePassengers } from './services/usersService';
import { applyCompanyTheme } from './utils/brandTheme';

import { LiveBusLocation, CompanyRecord, BusRouteDefinition, DriverProfile, PassengerRecord } from './types';
import { DEMO_BUSES, DEMO_COMPANIES, DEMO_DRIVERS, DEMO_LIVE_LOCATIONS, DEMO_PASSENGERS } from './demoData';

const isPublicDemo = new URLSearchParams(window.location.search).has('demo');

/**
 * Root React Native application entry point component.
 */
export default function App() {
  const { adminSession, loading } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [showLoginView, setShowLoginView] = useState<boolean>(false);

  // If no authenticated adminSession, run in safe demo mode with MOCK DATA
  const isDemo = !adminSession;

  const [liveLocations, setLiveLocations] = useState<LiveBusLocation[]>(DEMO_LIVE_LOCATIONS);
  const [companies, setCompanies] = useState<CompanyRecord[]>(DEMO_COMPANIES);
  const [buses, setBuses] = useState<BusRouteDefinition[]>(DEMO_BUSES);
  const [drivers, setDrivers] = useState<DriverProfile[]>(DEMO_DRIVERS);
  const [passengers, setPassengers] = useState<PassengerRecord[]>(DEMO_PASSENGERS);

  // Real-time Data Listeners - only subscribe when logged in with a real admin session
  useEffect(() => {
    if (!adminSession) {
      // Use clean mock data when not logged in
      setLiveLocations(DEMO_LIVE_LOCATIONS);
      setCompanies(DEMO_COMPANIES);
      setBuses(DEMO_BUSES);
      setDrivers(DEMO_DRIVERS);
      setPassengers(DEMO_PASSENGERS);
      return;
    }

    // Authenticated admin: subscribe to live Firebase data
    const unsubTelemetry = subscribeLiveTelemetry(setLiveLocations);
    const unsubCompanies = subscribeCompanies(setCompanies);
    const unsubBuses = subscribeAllBuses(setBuses);
    const unsubDrivers = subscribeDrivers(setDrivers);
    const unsubPassengers = subscribePassengers(setPassengers);

    return () => {
      unsubTelemetry();
      unsubCompanies();
      unsubBuses();
      unsubDrivers();
      unsubPassengers();
    };
  }, [adminSession]);

  // ─── Company scoping for COMPANY_ADMIN dispatchers ────────────────────────
  // Dispatchers only ever see their own organization; SUPER_ADMIN sees all.
  const scopedCompanyId =
    adminSession?.role === 'COMPANY_ADMIN' && adminSession.companyId
      ? adminSession.companyId.toLowerCase()
      : null;

  const activeCompany = scopedCompanyId
    ? companies.find((c) => c.id.toLowerCase() === scopedCompanyId) || null
    : null;

  const visibleCompanies = scopedCompanyId
    ? companies.filter((c) => c.id.toLowerCase() === scopedCompanyId)
    : companies;
  const visibleBuses = scopedCompanyId
    ? buses.filter((b) => (b.companyId || '').toLowerCase() === scopedCompanyId)
    : buses;
  const visibleDrivers = scopedCompanyId
    ? drivers.filter((d) => (d.companyId || '').toLowerCase() === scopedCompanyId)
    : drivers;
  const visibleLocations = scopedCompanyId
    ? liveLocations.filter((loc) =>
        visibleBuses.some((b) => b.lineId === loc.lineId) ||
        visibleDrivers.some((d) => d.uid === loc.driverUid)
      )
    : liveLocations;

  // Paint the dispatcher's company theme (brand colors) onto the console.
  useEffect(() => {
    applyCompanyTheme(activeCompany?.theme);
  }, [activeCompany]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-medium tracking-wide">Initializing Command Center...</span>
        </div>
      </div>
    );
  }

  // Only show login page if user explicitly requested to sign in as admin
  if (showLoginView && !adminSession) {
    return <LoginPage onBackToDashboard={() => setShowLoginView(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        activeVehiclesCount={visibleLocations.length}
        isDemo={isDemo}
        company={activeCompany}
        onOpenLogin={() => setShowLoginView(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          counts={{
            liveBuses: visibleLocations.length,
            companies: visibleCompanies.length,
            buses: visibleBuses.length,
            routes: visibleCompanies.reduce((sum, c) => sum + (c.busLines?.length || 0), 0) || visibleBuses.length,
            drivers: visibleDrivers.length,
            passengers: passengers.length,
          }}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/60">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardPage
                liveLocations={visibleLocations}
                buses={visibleBuses}
                companies={visibleCompanies}
                drivers={visibleDrivers}
                onSelectBus={(busId) => {
                  console.log('Selected bus:', busId);
                }}
              />
            )}

            {currentTab === 'companies' && (
              <CompaniesPage
                companies={visibleCompanies}
                buses={visibleBuses}
              />
            )}

            {currentTab === 'fleet' && (
              <FleetPage
                buses={visibleBuses}
                companies={visibleCompanies}
              />
            )}

            {currentTab === 'routes' && (
              <RoutesPage
                buses={visibleBuses}
                companies={visibleCompanies}
              />
            )}

            {currentTab === 'drivers' && (
              <DriversPage
                drivers={visibleDrivers}
                companies={visibleCompanies}
              />
            )}

            {(currentTab === 'passengers' || currentTab === 'users') && (
              <PassengersPage
                passengers={passengers}
              />
            )}

            {currentTab === 'security' && (
              <SecurityPage
                companies={visibleCompanies}
              />
            )}

            {currentTab === 'pricing' && (
              <PricingPage />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
