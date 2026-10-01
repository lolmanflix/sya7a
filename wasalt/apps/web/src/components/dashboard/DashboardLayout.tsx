import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { OverviewView } from './OverviewView';
import { TeamManagementView } from './TeamManagementView';
import { BrandingSettingsView } from './BrandingSettingsView';
import { BillingView } from './BillingView';
import { CompanySettingsView } from './CompanySettingsView';

interface DashboardLayoutProps {
  onExitToWebsite: () => void;
  onCreateNewWorkspace: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onExitToWebsite,
  onCreateNewWorkspace,
}) => {
  const [currentTab, setCurrentTab] = useState<string>('overview');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onExitToWebsite={onExitToWebsite}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader onCreateNewWorkspace={onCreateNewWorkspace} />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'overview' && <OverviewView onNavigateTab={setCurrentTab} />}
            {currentTab === 'team' && <TeamManagementView />}
            {currentTab === 'branding' && <BrandingSettingsView />}
            {currentTab === 'billing' && <BillingView />}
            {currentTab === 'settings' && <CompanySettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
};
