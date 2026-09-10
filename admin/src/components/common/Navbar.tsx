import React from 'react';
import { Bus, ShieldCheck, LogOut, Radio } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  activeVehiclesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeVehiclesCount }) => {
  const { adminSession, logout } = useAdminAuth();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & Live status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Bus className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-lg">Wasalt</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                OPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Transit Fleet Command Center</p>
          </div>
        </div>

        {/* Live Telemetry Pulse */}
        <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            {activeVehiclesCount} Live On Road
          </span>
        </div>
      </div>

      {/* Admin Profile & Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-1.5">
          <ShieldCheck className="w-4 h-4 text-brand-400" />
          <div className="text-left">
            <p className="text-xs font-medium text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
              {adminSession?.email || 'Super Administrator'}
            </p>
            <span className="text-[10px] uppercase tracking-wider text-brand-400 font-semibold">
              {adminSession?.role === 'SUPER_ADMIN' ? 'Super Admin' : `Dispatcher: ${adminSession?.companyId?.toUpperCase()}`}
            </span>
          </div>
        </div>

        <button
          onClick={() => logout()}
          title="Sign Out"
          className="p-2 rounded-xl bg-slate-800/40 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/30 text-slate-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
