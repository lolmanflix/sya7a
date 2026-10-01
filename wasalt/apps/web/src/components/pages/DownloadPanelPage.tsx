import React, { useState } from 'react';
import { PRODUCT_CONFIG } from '@wasalt/config';
import { Button } from '../common/Button';
import {
  Download,
  CheckCircle2,
  Monitor,
  Smartphone,
  Globe,
  ArrowRight,
  Sparkles,
  Shield,
  Bus,
  Copy,
  Check,
} from 'lucide-react';

interface DownloadPanelPageProps {
  companyName: string;
  adminEmail: string;
  planName: string;
  onGoToWebDashboard: () => void;
}

/**
 * Post-payment page where the user can download the admin panel desktop app
 * or access the web-based dashboard.
 */
export const DownloadPanelPage: React.FC<DownloadPanelPageProps> = ({
  companyName,
  adminEmail,
  planName,
  onGoToWebDashboard,
}) => {
  const [copied, setCopied] = useState(false);

  const workspaceUrl = `https://${PRODUCT_CONFIG.domain}/${companyName.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(workspaceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOptions = [
    {
      icon: Monitor,
      platform: 'Desktop App',
      subtitle: 'Windows & macOS',
      description: 'Full-featured admin panel with offline support and native notifications.',
      buttonText: 'Download for Desktop',
      badge: 'Recommended',
      primary: true,
    },
    {
      icon: Globe,
      platform: 'Web Dashboard',
      subtitle: 'Any Browser',
      description: 'Access your workspace instantly from any browser. No installation needed.',
      buttonText: 'Open Web Dashboard',
      badge: null,
      primary: false,
      action: onGoToWebDashboard,
    },
    {
      icon: Smartphone,
      platform: 'Mobile App',
      subtitle: 'iOS & Android',
      description: 'Monitor your fleet on the go with real-time GPS tracking and push alerts.',
      buttonText: 'Coming Soon',
      badge: 'Soon',
      primary: false,
      disabled: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 flex flex-col">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">
              Payment Confirmed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Welcome to {PRODUCT_CONFIG.name}, {companyName}!
          </h1>
          <p className="text-emerald-100 text-sm max-w-lg mx-auto">
            Your {planName} subscription is now active. You can start managing your
            transportation operations immediately.
          </p>
        </div>
      </div>

      {/* Workspace Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-6">
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Your Workspace URL
              </p>
              <p className="text-sm font-mono text-white font-semibold">{workspaceUrl}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{adminEmail}</span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 flex-1">
        <h2 className="text-lg font-bold text-white mb-1 text-center">
          Get Started with {PRODUCT_CONFIG.name}
        </h2>
        <p className="text-sm text-slate-400 mb-8 text-center">
          Choose how you want to access your admin panel
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {downloadOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.platform}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  option.primary
                    ? 'bg-gradient-to-b from-blue-600/10 to-slate-900 border-2 border-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-900 border border-slate-700/60'
                }`}
              >
                {option.badge && (
                  <span
                    className={`absolute -top-2.5 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      option.badge === 'Recommended'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {option.badge}
                  </span>
                )}

                <div className="space-y-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{option.platform}</h3>
                    <p className="text-xs text-slate-400 font-medium">{option.subtitle}</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{option.description}</p>
                </div>

                <Button
                  variant={option.primary ? 'primary' : 'outline'}
                  onClick={option.action}
                  disabled={option.disabled}
                  icon={option.disabled ? undefined : <Download className="w-4 h-4" />}
                  className={`w-full justify-center ${
                    !option.primary ? 'border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 bg-transparent' : ''
                  }`}
                >
                  {option.buttonText}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Security note */}
        <div className="mt-8 flex items-start gap-2.5 bg-slate-900 border border-slate-700/60 rounded-xl p-4 max-w-2xl mx-auto">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            Your workspace is protected by multi-tenant isolation, AES-256 encryption, and
            role-based access controls. Enable 2FA in your admin settings for additional security.
          </p>
        </div>
      </div>
    </div>
  );
};
