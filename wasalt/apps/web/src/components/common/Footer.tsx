import React from 'react';
import { PRODUCT_CONFIG } from '@wasalt/config';
import { Sparkles, Shield, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {PRODUCT_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {PRODUCT_CONFIG.subheadline}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational (99.98% Uptime)</span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h4>
            <a href="#features" className="text-sm hover:text-white transition-colors">
              Features
            </a>
            <a href="#theme-demo" className="text-sm hover:text-white transition-colors">
              Dynamic Theming
            </a>
            <a href="#pricing" className="text-sm hover:text-white transition-colors">
              Pricing Plans
            </a>
            <a href="#how-it-works" className="text-sm hover:text-white transition-colors">
              How It Works
            </a>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Solutions</h4>
            <span className="text-sm hover:text-white transition-colors cursor-pointer">
              Corporate Fleet
            </span>
            <span className="text-sm hover:text-white transition-colors cursor-pointer">
              Higher Education
            </span>
            <span className="text-sm hover:text-white transition-colors cursor-pointer">
              Municipal Transit
            </span>
            <span className="text-sm hover:text-white transition-colors cursor-pointer">
              Private Institutions
            </span>
          </div>

          {/* Links Column 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Security</h4>
            <div className="flex items-center gap-1.5 text-sm text-slate-300">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Multi-Tenant Guard</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-300">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>WCAG AA Certified</span>
            </div>
            <span className="text-xs text-slate-500 mt-2">
              SOC-2 & GDPR Compliance Architecture
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {PRODUCT_CONFIG.copyrightYear} {PRODUCT_CONFIG.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
