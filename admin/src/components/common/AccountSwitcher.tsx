import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, LogOut, ShieldCheck, UserPlus } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import { AccountRecord } from '../../utils/accountStore';

type Translate = ReturnType<typeof useTranslation>['t'];

const roleLabel = (account: AccountRecord, t: Translate): string =>
  account.role === 'SUPER_ADMIN'
    ? t('common.superAdmin')
    : `${t('common.dispatcher')}${account.companyId ? `: ${account.companyId.toUpperCase()}` : ''}`;

/**
 * Profile chip with an account-switcher dropdown: lists every added account
 * (instant silent switch), plus "Add another account" and "Sign out".
 */
export const AccountSwitcher: React.FC = () => {
  const { adminSession, accounts, activeAccountId, switchAccount, beginAddAccount, logout } = useAdminAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open]);

  const sorted = [...accounts].sort((a, b) => b.lastUsedAt - a.lastUsedAt);

  const handleSwitch = async (id: string) => {
    if (busy || id === activeAccountId) {
      setOpen(false);
      return;
    }
    setBusy(true);
    try {
      await switchAccount(id);
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t('common.switchAccount')}
        className="flex items-center gap-2 sm:gap-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl px-2.5 sm:px-3 py-1.5 transition-colors"
      >
        <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
        <div className="text-start min-w-0 hidden sm:block">
          <p className="text-xs font-medium text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
            {adminSession?.email || t('common.superAdministrator')}
          </p>
          <span className="text-[10px] uppercase tracking-wider text-brand-400 font-semibold">
            {adminSession?.role === 'SUPER_ADMIN'
              ? t('common.superAdmin')
              : `${t('common.dispatcher')}: ${adminSession?.companyId?.toUpperCase()}`}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('common.accountSwitcherLabel')}
          className="absolute end-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
        >
          <div className="px-3.5 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {t('common.signedInAccounts')}
          </div>

          <div className="px-1.5 pb-1.5 space-y-0.5 max-h-64 overflow-y-auto">
            {sorted.map((account) => {
              const isActive = account.id === activeAccountId;
              return (
                <button
                  key={account.id}
                  type="button"
                  role="menuitem"
                  disabled={busy}
                  onClick={() => handleSwitch(account.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-start transition-colors disabled:opacity-60 ${
                    isActive ? 'bg-brand-500/10' : 'hover:bg-slate-800/70'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-200 truncate">{account.email}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      {roleLabel(account, t)}
                      {account.kind === 'master' ? ` · ${t('common.masterSuffix')}` : ''}
                    </p>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-brand-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-800/80 p-1.5 space-y-0.5">
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                beginAddAccount();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4 text-slate-400" />
              {t('common.addAccount')}
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                void logout();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 transition-colors disabled:opacity-60"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              {t('common.signOutMenu')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
