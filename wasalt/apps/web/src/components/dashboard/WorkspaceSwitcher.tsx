import React, { useState, useRef, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { Building2, ChevronDown, Check, Plus, Shield } from 'lucide-react';

interface WorkspaceSwitcherProps {
  onCreateNewWorkspace: () => void;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  onCreateNewWorkspace,
}) => {
  const { companies, activeCompany, setActiveCompanyId } = useCompany();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200/80 transition-all text-left group"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs"
          style={{ backgroundColor: activeCompany?.theme?.colors?.primary || '#2563EB' }}
        >
          {activeCompany?.name ? activeCompany.name[0].toUpperCase() : 'W'}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold truncate max-w-[140px] sm:max-w-[180px]">
            {activeCompany?.name || 'Select Workspace'}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            {activeCompany?.industry || 'Multi-Tenant Workspace'}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-scaleUp">
          <div className="px-4 py-2 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Workspaces ({companies.length})
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {companies.map((company) => {
              const isSelected = activeCompany?.id === company.id;
              return (
                <button
                  key={company.id}
                  onClick={() => {
                    setActiveCompanyId(company.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    isSelected ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ backgroundColor: company.theme?.colors?.primary || '#2563EB' }}
                    >
                      {company.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {company.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {company.slug}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="p-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsOpen(false);
                onCreateNewWorkspace();
              }}
              className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
