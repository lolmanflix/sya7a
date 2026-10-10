import React from 'react';
import { ShieldCheck, LogOut, Radio, Building2, Menu } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { CompanyRecord } from '../../types';
import { AccountSwitcher } from './AccountSwitcher';
import { SosAlertBell } from '../sos/SosAlertBell';

interface NavbarProps {
  activeVehiclesCount: number;
  onOpenLogin?: () => void;
  isDemo?: boolean;
  /** Active company (dispatcher) — shown instead of the Wasalt brand. */
  company?: CompanyRecord | null;
  /** Toggles the mobile navigation drawer (hamburger). */
  onToggleSidebar?: () => void;
}

/**
 * Top navigation bar for Admin Web Portal.
 */
export const Navbar: React.FC<NavbarProps> = ({
  activeVehiclesCount,
  onOpenLogin,
  isDemo = false,
  company = null,
  onToggleSidebar,
}) => {
  const { logout } = useAdminAuth();
  const { t, lang, setLang } = useTranslation();

  /** Toggles between EN/AR — the pill shows the language you would switch to. */
  const toggleLanguage = () => setLang(lang === 'en' ? 'ar' : 'en');
  const langSwitchLabel = lang === 'en' ? t('nav.switchToArabic') : t('nav.switchToEnglish');

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & Live status */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-label={t('nav.toggleMenu')}
            className="md:hidden p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 text-slate-300 transition-all shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2.5 min-w-0">
          {company?.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="w-10 h-10 shrink-0 rounded-xl object-contain bg-white border border-slate-700 shadow-lg"
            />
          ) : company ? (
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-lg shadow-brand-500/20 ring-1 ring-white/10">
              <img src="/logo-512.png" alt="Wasalt logo" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold tracking-tight text-white text-lg truncate">
                {company ? company.name : 'Wasalt'}
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 shrink-0">
                {company ? t('nav.dispatchChip') : t('nav.opsChip')}
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400 truncate">
              {company
                ? company.domain
                  ? `@${company.domain} · ${t('nav.companyConsole')}`
                  : t('nav.companyConsole')
                : t('nav.fleetCommandCenter')}
            </p>
          </div>
        </div>

        {/* Live Telemetry Pulse */}
        <div className="hidden sm:flex items-center gap-2 ms-4 ps-4 border-s border-slate-800 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            {t('nav.liveOnRoad', { count: activeVehiclesCount })}
          </span>
        </div>
      </div>

      {/* Admin Profile & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          onClick={toggleLanguage}
          aria-label={langSwitchLabel}
          title={langSwitchLabel}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white text-xs font-bold transition-all shrink-0"
        >
          {lang === 'en' ? 'ع' : 'EN'}
        </button>
        {isDemo ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-block text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold whitespace-nowrap">
              {t('nav.mockDataMode')}
            </span>
            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{t('nav.adminSignIn')}</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <SosAlertBell />

            <AccountSwitcher />

            <button
              onClick={() => logout()}
              title={t('nav.signOut')}
              aria-label={t('nav.signOut')}
              className="p-2 rounded-xl bg-slate-800/40 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/30 text-slate-400 transition-all shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
