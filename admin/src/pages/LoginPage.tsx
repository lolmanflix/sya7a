import React, { useState } from 'react';
import { Bus, Lock, User, KeyRound, ArrowRight, ShieldCheck, QrCode, HelpCircle, Check, Copy } from 'lucide-react';
import { useAdminAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'master' | 'company'>('master');

  // Form states
  const [username, setUsername] = useState('masteradmin');
  const [password, setPassword] = useState('adminPassword2026!');
  const [otpToken, setOtpToken] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginMasterAdmin, loginWithFirebase } = useAdminAuth();
  const secretKey = import.meta.env.VITE_MASTER_ADMIN_TOTP_SECRET || 'WASALTADMINSEC2026';

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    toast.success('Secret key copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'master') {
        if (!otpToken.trim() || otpToken.trim().length !== 6) {
          toast.error('Please enter the 6-digit code from your Authenticator app');
          setLoading(false);
          return;
        }
        await loginMasterAdmin(username, password, otpToken.trim(), rememberMe);
        toast.success('Authenticated as Master Administrator');
      } else {
        await loginWithFirebase(username, password, rememberMe);
        toast.success('Authenticated successfully');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 mx-auto flex items-center justify-center shadow-xl shadow-brand-500/25">
            <Bus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Wasalt Command</h1>
          <p className="text-xs text-slate-400">Transit Fleet Administrative Console</p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthMode('master')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'master'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Master Admin 2FA
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('company')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'company'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Company Dispatcher
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Email */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {authMode === 'master' ? 'Master Admin Username' : 'Dispatcher Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={authMode === 'master' ? 'text' : 'email'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={authMode === 'master' ? 'masteradmin' : 'admin@cta.eg'}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* 2FA Authenticator OTP Code (Master Mode) */}
          {authMode === 'master' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  6-Digit Authenticator App Code (OTP)
                </label>
                <button
                  type="button"
                  onClick={() => setShowSetupGuide(!showSetupGuide)}
                  className="text-[11px] text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  Setup Key
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

          {/* Stay Logged In Checkbox */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 bg-slate-800 border-slate-700 focus:ring-brand-500 cursor-pointer"
              />
              <span>Stay logged in on this device</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying Credentials...' : 'Sign In to Operations Console'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 2FA Setup Helper Accordion */}
        {showSetupGuide && (
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <QrCode className="w-4 h-4 text-brand-400" />
              Authenticator App Setup Guide
            </div>
            <p className="text-[11px] text-slate-400">
              Open <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, or <strong>Authy</strong> $\rightarrow$ Tap <strong>+</strong> $\rightarrow$ <strong>Enter a setup key</strong>:
            </p>
            <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 flex items-center justify-between">
              <code className="text-brand-300 font-mono text-xs">{secretKey}</code>
              <button
                type="button"
                onClick={handleCopySecret}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Copy Key"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Type of key: <strong>Time-based</strong>. Account: <strong>masteradmin (Wasalt)</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
