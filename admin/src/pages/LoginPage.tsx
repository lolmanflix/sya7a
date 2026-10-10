import React, { useState } from 'react';
import { Bus, Lock, User, KeyRound, ArrowRight, ShieldCheck, HelpCircle, QrCode } from 'lucide-react';
import { useAdminAuth } from '../contexts/AuthContext';
import { masterTotpSecret, masterUsername, isMasterConfigured } from '../config/masterAdmin';
import { useTranslation } from '../i18n/useTranslation';
import { toast } from 'sonner';

interface LoginPageProps {
  onBackToDashboard?: () => void;
}

/**
 * Administrative login screen supporting master 2FA TOTP and company dispatch authentication.
 */
export const LoginPage: React.FC<LoginPageProps> = ({ onBackToDashboard }) => {
  const { t, dir } = useTranslation();
  const [authMode, setAuthMode] = useState<'master' | 'company'>('master');

  // Form states (never prefill credentials — they would ship in the bundle)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginMasterAdmin, loginWithFirebase, adminSession, addingAccount, cancelAddAccount } = useAdminAuth();

  /**
   * Submits admin login credentials to authentication services.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'master') {
        if (!otpToken.trim() || otpToken.trim().length !== 6) {
          toast.error(t('auth.otpError'));
          setLoading(false);
          return;
        }
        await loginMasterAdmin(username, password, otpToken.trim());
        toast.success(t('auth.masterAuthSuccess'));
      } else {
        await loginWithFirebase(username, password);
        toast.success(t('auth.companyAuthSuccess'));
      }
    } catch (err: any) {
      toast.error(err.message || t('auth.authFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center p-4 relative overflow-x-hidden overflow-y-auto">
      {/* Background ambient lighting (clipped so it never adds scroll area) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="my-auto w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto shadow-xl shadow-brand-500/25 ring-1 ring-white/10">
            <img src="/logo-512.png" alt="Wasalt logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{t('auth.brandTitle')}</h1>
          <p className="text-xs text-slate-400">{t('auth.subtitle')}</p>
        </div>

        {/* Add-account interstitial banner */}
        {addingAccount && adminSession && (
          <div className="flex items-center justify-between gap-3 bg-brand-500/10 border border-brand-500/30 rounded-xl px-3.5 py-2.5">
            <p className="text-xs text-slate-200 leading-relaxed">
              {t('auth.addAccountBanner')}
            </p>
            <button
              type="button"
              onClick={cancelAddAccount}
              className="shrink-0 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-lg px-3 py-1.5 transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthMode('master')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              authMode === 'master'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            {t('auth.masterTab')}
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('company')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              authMode === 'company'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            {t('auth.companyTab')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Configuration warning (master mode) */}
          {authMode === 'master' && !isMasterConfigured() && (
            <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 leading-relaxed">
              {t('auth.notConfiguredBefore')}{' '}
              <code className="font-mono">VITE_MASTER_ADMIN_*</code> {t('auth.notConfiguredMiddle')}{' '}
              <code className="font-mono">admin/.env</code> {t('auth.notConfiguredAfter')}
            </div>
          )}

          {/* Username / Email */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {authMode === 'master' ? t('auth.masterUsernameLabel') : t('auth.dispatcherEmailLabel')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={authMode === 'master' ? 'text' : 'email'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={authMode === 'master' ? t('auth.usernamePlaceholder') : 'admin@cta.eg'}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl ps-10 pe-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">{t('auth.passwordLabel')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl ps-10 pe-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* 2FA Authenticator OTP Code (Master Mode) */}
          {authMode === 'master' && (
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <label className="block text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 shrink-0" />
                  {t('auth.otpLabel')}
                </label>
                <button
                  type="button"
                  onClick={() => setShowSetupGuide(!showSetupGuide)}
                  className="text-[11px] text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  {t('auth.setupKey')}
                </button>
              </div>

              <input
                type="text"
                maxLength={6}
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-slate-950 border-2 border-emerald-500/50 rounded-xl px-4 py-2.5 text-center text-lg tracking-[0.3em] font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 transition-colors"
                autoComplete="one-time-code"
                required
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 transition-all disabled:opacity-50"
          >
            {loading ? t('auth.verifying') : t('auth.signIn')}
            <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </button>
        </form>

        {/* 2FA Setup Helper Accordion */}
        {showSetupGuide && (
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs space-y-2.5 animate-in fade-in duration-150 break-words">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <QrCode className="w-4 h-4 text-brand-400" />
              {t('auth.setupGuideTitle')}
            </div>
            <p className="text-[11px] text-slate-400">
              {t('auth.guideOpen')} <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong> {t('auth.guideOr')} <strong>Authy</strong> {t('auth.guideTap')} <strong>+</strong> $\rightarrow$ <strong>{t('auth.guideEnterSetupKey')}</strong>
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {t('auth.seedCopyBefore')} <code className="text-brand-300 font-mono">VITE_MASTER_ADMIN_TOTP_SECRET</code> {t('auth.seedCopyValue')} {t('auth.seedCopyFrom')} <code className="text-brand-300 font-mono">admin/.env</code> {t('auth.seedCopySee')} <code className="text-brand-300 font-mono">admin/README.md</code> {t('auth.seedCopySection')} {t('auth.seedCopyInto')}
            </p>
            {!masterTotpSecret && (
              <p className="text-[11px] text-amber-400 leading-relaxed">
                {t('auth.totpNotConfiguredBefore')} <code className="font-mono">VITE_MASTER_ADMIN_TOTP_SECRET</code> {t('auth.totpNotConfiguredMiddle')} <code className="font-mono">admin/.env</code> {t('auth.totpNotConfiguredAfter')}
              </p>
            )}
            <p className="text-[10px] text-slate-500">
              {t('auth.keyTypeLabel')} <strong>{t('auth.timeBased')}</strong>. {t('auth.accountLabel')} <strong>{masterUsername || t('auth.yourAdmin')}</strong> {t('auth.accountSuffix')}
            </p>
          </div>
        )}

        {onBackToDashboard && (
          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold py-1.5 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
              <span>{t('auth.backToDashboard')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
