import React from 'react';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { Shield, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguageTheme();

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-700">
                <img
                  src="/wasalt-logo.png"
                  alt="Wasalt"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[185%] max-w-none"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {t('nav.brand')}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t('footer.builtFor')}</span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{t('footer.product')}</h4>
            <a href="#features" className="text-sm hover:text-white transition-colors">
              {t('nav.features')}
            </a>
            <a href="#live-tracking" className="text-sm hover:text-white transition-colors">
              {t('nav.liveTracking')}
            </a>
            <a href="#pricing" className="text-sm hover:text-white transition-colors">
              {t('nav.pricing')}
            </a>
            <a href="#how-it-works" className="text-sm hover:text-white transition-colors">
              {t('nav.howItWorks')}
            </a>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{t('footer.solutions')}</h4>
            <span className="text-sm hover:text-white transition-colors cursor-pointer">
              {t('footer.schoolTrans')}
            </span>
            <span className="text-sm hover:text-white transition-colors cursor-pointer">
              {t('footer.employeeTrans')}
            </span>
            <span className="text-sm hover:text-white transition-colors cursor-pointer">
              {t('footer.transOrgs')}
            </span>
            <span className="text-sm hover:text-white transition-colors cursor-pointer">
              {t('footer.multiOrg')}
            </span>
          </div>

          {/* Links Column 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{t('footer.security')}</h4>
            <div className="flex items-center gap-1.5 text-sm text-slate-300">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>{t('footer.tenantGuard')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-300">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{t('footer.wcag')}</span>
            </div>
            <span className="text-xs text-slate-500 mt-2">
              {t('footer.dataBoundaries')}
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; 2026 Wasalt Platform. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
