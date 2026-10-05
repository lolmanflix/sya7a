import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
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
  const [currentTab, setCurrentTab] = useState<string>('team');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSidebarOpen(false);
        }}
        onExitToWebsite={onExitToWebsite}
        isOpen={sidebarOpen}
      />

      {/* Mobile drawer backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          onCreateNewWorkspace={onCreateNewWorkspace}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
        />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
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
