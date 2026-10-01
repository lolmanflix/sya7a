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
import { LoginPage } from './pages/LoginPage';

import { subscribeLiveTelemetry } from './services/telemetryService';
import { subscribeCompanies } from './services/companiesService';
import { subscribeAllBuses } from './services/busesService';
import { subscribeDrivers } from './services/driversService';
import { subscribePassengers } from './services/usersService';

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
        activeVehiclesCount={liveLocations.length}
        isDemo={isDemo}
        onOpenLogin={() => setShowLoginView(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          counts={{
            liveBuses: liveLocations.length,
            companies: companies.length,
            buses: buses.length,
            routes: companies.reduce((sum, c) => sum + (c.busLines?.length || 0), 0) || buses.length,
            drivers: drivers.length,
            passengers: passengers.length,
          }}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/60">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardPage
                liveLocations={liveLocations}
                buses={buses}
                companies={companies}
                drivers={drivers}
                onSelectBus={(busId) => {
                  console.log('Selected bus:', busId);
                }}
              />
            )}

            {currentTab === 'companies' && (
              <CompaniesPage
                companies={companies}
                buses={buses}
              />
            )}

            {currentTab === 'fleet' && (
              <FleetPage
                buses={buses}
                companies={companies}
              />
            )}

            {currentTab === 'routes' && (
              <RoutesPage
                buses={buses}
                companies={companies}
              />
            )}

            {currentTab === 'drivers' && (
              <DriversPage
                drivers={drivers}
                companies={companies}
              />
            )}

            {(currentTab === 'passengers' || currentTab === 'users') && (
              <PassengersPage
                passengers={passengers}
              />
            )}

            {currentTab === 'security' && (
              <SecurityPage
                companies={companies}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
