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

export default function App() {
  const { adminSession, loading } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  const [liveLocations, setLiveLocations] = useState<LiveBusLocation[]>([]);
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [buses, setBuses] = useState<BusRouteDefinition[]>([]);
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [passengers, setPassengers] = useState<PassengerRecord[]>([]);

  // Real-time Data Listeners
  useEffect(() => {
    if (!adminSession) return;

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

  if (!adminSession) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar activeVehiclesCount={liveLocations.length} />

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
