import React from 'react';
import { LayoutDashboard, Building2, Bus, Route, Users, UserCheck, ShieldAlert, DollarSign } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTranslation } from '../../i18n/useTranslation';

export type NavTab = 'dashboard' | 'companies' | 'fleet' | 'routes' | 'drivers' | 'passengers' | 'users' | 'security' | 'pricing';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  counts: {
    liveBuses: number;
    companies: number;
    buses: number;
    routes: number;
    drivers: number;
    passengers: number;
  };
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

/**
 * Collapsible left navigation sidebar for Admin Web Portal.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  counts,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { t, dir } = useTranslation();
  const navItems = [
    { id: 'dashboard' as NavTab, label: t('nav.liveTelemetry'), icon: LayoutDashboard, badge: counts.liveBuses > 0 ? t('nav.liveBadge', { count: counts.liveBuses }) : undefined, badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'companies' as NavTab, label: t('nav.companies'), icon: Building2, count: counts.companies },
    { id: 'fleet' as NavTab, label: t('nav.fleet'), icon: Bus, count: counts.buses },
    { id: 'routes' as NavTab, label: t('nav.routes'), icon: Route, count: counts.routes },
    { id: 'drivers' as NavTab, label: t('nav.drivers'), icon: UserCheck, count: counts.drivers },
    { id: 'users' as NavTab, label: t('nav.users'), icon: Users, count: counts.passengers },
    { id: 'security' as NavTab, label: t('nav.security'), icon: ShieldAlert },
    { id: 'pricing' as NavTab, label: t('nav.pricing'), icon: DollarSign },
  ];

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile?.();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'w-64 shrink-0 border-e border-slate-800/80 bg-slate-900/40 p-4 flex flex-col justify-between fixed inset-y-0 start-0 z-50 transition-transform duration-200 md:static md:flex md:translate-x-0',
          mobileOpen
            ? 'translate-x-0'
            : dir === 'rtl'
              ? 'translate-x-full invisible md:visible'
              : '-translate-x-full invisible md:visible'
        )}
      >
        <nav className="space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {t('nav.navigation')}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
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

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>{t('nav.firebaseRtdb')}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> {t('nav.connected')}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">tracking-72393-default-rtdb</p>
        </div>
      </aside>
    </>
  );
};
