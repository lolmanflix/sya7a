import React from 'react';
import { PRODUCT_CONFIG } from '@wasalt/config';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  Play,
} from 'lucide-react';

interface HeroSectionProps {
  onStartOnboarding: () => void;
  onExploreDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartOnboarding,
  onExploreDemo,
}) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-sm hover:bg-blue-100 transition-colors cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Next-Generation Multi-Tenant Architecture</span>
            <span className="text-slate-400">|</span>
            <span className="text-blue-800 flex items-center gap-0.5">
              Explore v1.0 <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            One Master Account.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Infinite Branded Workspaces.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed font-normal max-w-2xl">
            {PRODUCT_CONFIG.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
            <Button
              size="lg"
              variant="primary"
              onClick={onStartOnboarding}
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35"
            >
              Start 14-Day Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onExploreDemo}
              icon={<Play className="w-4 h-4 fill-slate-700" />}
              className="w-full sm:w-auto"
            >
              See Live Theme Demo
            </Button>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant workspace setup
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> WCAG AA Accessible
            </span>
          </div>
        </div>

        {/* Live Interactive Hero Dashboard Card Preview */}
        <div className="mt-14 max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden">
            {/* Top window bar */}
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs font-mono text-slate-400">
                  app.wasalt.io/dashboard/company_wasalt_tech
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  Active Workspace
                </Badge>
              </div>
            </div>

            {/* Dashboard Mockup Content */}
            <div className="p-6 md:p-8 bg-slate-50">
              {/* Internal header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    W
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Wasalt Logistics HQ</h3>
                    <p className="text-xs text-slate-500">
                      Logged in as Kareem Diyaa &bull; Owner Role
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    Live Telematics Active
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    Pro Plan
                  </span>
                </div>
              </div>

              {/* KPI stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span>Active Team Members</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">18 Admins</div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">
                    +4 added this month
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span>Multi-Company Workspaces</span>
                    <Building2 className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">3 Companies</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    Quick-switch enabled
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span>System Health</span>
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">99.98%</div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">
                    Zero tenant bleeds
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
