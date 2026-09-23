import React from 'react';
import { useCompany } from '../../context/CompanyContext';
import { Badge } from '../common/Badge';
import {
  Users,
  Navigation,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface OverviewViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateTab }) => {
  const { activeCompany } = useCompany();
  const primaryColor = activeCompany?.theme?.colors?.primary || '#2563EB';

  const stats = [
    {
      label: 'Active Vehicles & Dispatches',
      value: '24 Units',
      change: '+3 today',
      icon: Navigation,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Authorized Dispatch Admins',
      value: '6 Members',
      change: '2 online now',
      icon: Users,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      label: 'Operational Health',
      value: '99.98%',
      change: 'Zero disruptions',
      icon: Zap,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Tenant Isolation Audit',
      value: 'Protected',
      change: 'AES-256 Scope',
      icon: ShieldCheck,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Vehicle 115-Shuttle assigned to North Route',
      time: '12 minutes ago',
      user: 'Sarah Jenkins (Admin)',
    },
    {
      id: 2,
      title: 'Company Brand Theme updated with new logo',
      time: '45 minutes ago',
      user: 'Kareem Diyaa (Owner)',
    },
    {
      id: 3,
      title: 'New Dispatch Manager invited: Alex Mercer',
      time: '2 hours ago',
      user: 'Kareem Diyaa (Owner)',
    },
    {
      id: 4,
      title: 'Live Telematics synchronization verified',
      time: '4 hours ago',
      user: 'System Telemetry Daemon',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md transition-colors duration-300"
        style={{ backgroundColor: primaryColor }}
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace Operations Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {activeCompany?.name}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            {activeCompany?.description || 'Multi-tenant fleet management portal'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('branding')}
            className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-white/90 shadow-sm transition-all"
          >
            Customize Brand
          </button>
          <button
            onClick={() => onNavigateTab('team')}
            className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
          >
            Invite Member
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>{s.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Activity Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Recent Operations Stream
            </h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
              View Audit Log
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivity.map((item) => (
              <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{item.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.user}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Workspace Quick Actions</h3>

          <div className="space-y-2">
            <button
              onClick={() => onNavigateTab('team')}
              className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                  Manage Team Permissions
                </div>
                <div className="text-[11px] text-slate-500">Add or edit dispatcher roles</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => onNavigateTab('branding')}
              className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                  Theme Customizer
                </div>
                <div className="text-[11px] text-slate-500">Extract colors from your logo</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => onNavigateTab('billing')}
              className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                  Subscription & Billing
                </div>
                <div className="text-[11px] text-slate-500">Manage plan and invoices</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
