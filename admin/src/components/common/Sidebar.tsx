import React from 'react';
import { LayoutDashboard, Building2, Route, Users, UserCheck, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

export type NavTab = 'dashboard' | 'companies' | 'fleet' | 'drivers' | 'passengers' | 'users' | 'security';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  counts: {
    liveBuses: number;
    companies: number;
    buses: number;
    drivers: number;
    passengers: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, counts }) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Live Telemetry', icon: LayoutDashboard, badge: counts.liveBuses > 0 ? `${counts.liveBuses} live` : undefined, badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'companies' as NavTab, label: 'Companies & Lines', icon: Building2, count: counts.companies },
    { id: 'fleet' as NavTab, label: 'Bus Fleet & Routes', icon: Route, count: counts.buses },
    { id: 'drivers' as NavTab, label: 'Drivers', icon: UserCheck, count: counts.drivers },
    { id: 'users' as NavTab, label: 'Users', icon: Users, count: counts.passengers },
    { id: 'security' as NavTab, label: 'Security & Hygiene', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-900/40 p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <nav className="space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4 transition-transform group-hover:scale-110', active ? 'text-white' : 'text-slate-400')} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border animate-pulse', item.badgeColor)}>
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && !item.badge && (
                <span className={cn('text-xs px-2 py-0.5 rounded-md', active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400')}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Pill */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span>Firebase RTDB</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Connected
          </span>
        </div>
        <p className="text-[10px] text-slate-400 truncate">tracking-72393-default-rtdb</p>
      </div>
    </aside>
  );
};
