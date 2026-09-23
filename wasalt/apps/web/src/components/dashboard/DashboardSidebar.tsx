import React from 'react';
import { DASHBOARD_NAV_ITEMS } from '@wasalt/config';
import { useCompany } from '../../context/CompanyContext';
import {
  LayoutDashboard,
  Users,
  Palette,
  CreditCard,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface DashboardSidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  onExitToWebsite: () => void;
}

const iconMap = {
  LayoutDashboard,
  Users,
  Palette,
  CreditCard,
  Settings,
};

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentTab,
  onSelectTab,
  onExitToWebsite,
}) => {
  const { activeCompany } = useCompany();
  const primaryColor = activeCompany?.theme?.colors?.primary || '#2563EB';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Banner */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm transition-colors duration-300"
              style={{ backgroundColor: primaryColor }}
            >
              {activeCompany?.logoUrl ? (
                <img
                  src={activeCompany.logoUrl}
                  alt={activeCompany.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : activeCompany?.name ? (
                activeCompany.name[0].toUpperCase()
              ) : (
                'W'
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {activeCompany?.name || 'Wasalt Workspace'}
              </h2>
              <p className="text-[11px] text-slate-500 font-mono truncate">
                {activeCompany?.slug || 'workspace'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace Navigation
          </div>

          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={
                  isActive
                    ? {
                        borderLeft: `3px solid ${primaryColor}`,
                      }
                    : {}
                }
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="w-4 h-4 transition-colors"
                    style={{ color: isActive ? primaryColor : undefined }}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom section: Website link */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <button
          onClick={onExitToWebsite}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Public Website</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500">
          <div className="font-semibold text-slate-700">Pro Plan Active</div>
          <div>All multi-tenant features enabled</div>
        </div>
      </div>
    </aside>
  );
};
