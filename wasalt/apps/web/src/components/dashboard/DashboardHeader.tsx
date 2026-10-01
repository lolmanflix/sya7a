import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { Badge } from '../common/Badge';
import { Bell, LogOut, User, Shield, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
  onCreateNewWorkspace: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onCreateNewWorkspace,
}) => {
  const { admin, logout } = useAuth();
  const { activeCompany } = useCompany();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30">
      <div className="flex items-center gap-4">
        <WorkspaceSwitcher onCreateNewWorkspace={onCreateNewWorkspace} />

        <div className="hidden lg:flex items-center gap-2">
          <Badge variant="success" size="sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Telematics Stream</span>
          </Badge>
          <Badge variant="primary" size="sm">
            {activeCompany?.subscriptionPlanId?.toUpperCase() || 'PRO'} TIER
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              {admin?.fullName ? admin.fullName[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                {admin?.fullName || 'Master Admin'}
              </span>
              <span className="text-[10px] text-slate-500">
                {admin?.jobTitle || 'Platform Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-scaleUp">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{admin?.fullName}</div>
                <div className="text-[11px] text-slate-500 truncate">{admin?.email}</div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
