import { useLineOperations } from '../hooks/useLineOperations';
/**
 * @file CompaniesPage.tsx
 * @description Primary administrative portal for managing transit operators,
 * corporate shuttles, school bus authorities, and cross-operator bus lines.
 */

import React, { useState, useMemo } from 'react';
import { Plus, Search, Building2, Route } from 'lucide-react';
import { CompanyRecord, BusRouteDefinition } from '../types';
import {
  removeCompany,
} from '../services/companiesService';
import { activateSubscription } from '../services/subscriptionsService';
import { useAdminAuth } from '../contexts/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { toast } from 'sonner';

// Modular Presentation Components
import { CompaniesGridView } from '../components/companies/CompaniesGridView';
import { LinesTableView, FlattenedLineItem } from '../components/companies/LinesTableView';
import { AddCompanyModal } from '../components/companies/AddCompanyModal';
import { LineManagerModal } from '../components/companies/LineManagerModal';
import { AddBusLineModal } from '../components/companies/AddBusLineModal';

interface CompaniesPageProps {
  companies: CompanyRecord[];
  buses: BusRouteDefinition[];
}

/**
 * Main Companies & Transit Lines management page coordinator.
 *
 * @param props - System company records and active bus route definitions.
 * @returns JSX Element.
 */
export const CompaniesPage: React.FC<CompaniesPageProps> = ({
  companies,
  buses,
}) => {
  const [activeTab, setActiveTab] = useState<'companies' | 'lines'>('companies');
  const [search, setSearch] = useState('');
  const [selectedCompanyForLines, setSelectedCompanyForLines] =
    useState<CompanyRecord | null>(null);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isAddLineOpen, setIsAddLineOpen] = useState(false);
  const { handleRenameLine, handleDeleteLine } = useLineOperations();
  const { adminSession } = useAdminAuth();
  const { t } = useTranslation();
  const isSuperAdmin = adminSession?.role === 'SUPER_ADMIN';

  // 1. Filtered Companies
  const filteredCompanies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.domain && c.domain.toLowerCase().includes(q))
    );
  }, [companies, search]);

  // 2. Flattened Bus Lines across all operators
  const allBusLines: FlattenedLineItem[] = useMemo(() => {
    const list: FlattenedLineItem[] = [];
    companies.forEach((comp) => {
      comp.busLines.forEach((line) => {
        const count = buses.filter(
          (b) =>
            b.companyId.toLowerCase() === comp.id.toLowerCase() &&
            b.lineId.toLowerCase() === line.toLowerCase()
        ).length;
        list.push({
          companyId: comp.id,
          companyName: comp.name,
          lineName: line,
          busesCount: count,
        });
      });
    });
    return list;
  }, [companies, buses]);

  const filteredLines = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allBusLines;
    return allBusLines.filter(
      (l) =>
        l.lineName.toLowerCase().includes(q) ||
        l.companyName.toLowerCase().includes(q) ||
        l.companyId.toLowerCase().includes(q)
    );
  }, [allBusLines, search]);

  /**
   * Deletes a transit operator node with user confirmation.
   */
  const handleDeleteCompany = async (companyId: string) => {
    if (confirm(t('companies.deleteConfirm', { id: companyId }))) {
      try {
        await removeCompany(companyId);
        toast.success(t('companies.deleteSuccess', { id: companyId }));
      } catch (err) {
        console.error('[CompaniesPage] Failed to delete operator:', err);
        toast.error(t('companies.deleteError'));
      }
    }
  };

  /**
   * Manually confirms a received payment and activates the subscription.
   * Super-admin only — mirrors the website's pending_payment flow.
   */
  const handleConfirmPayment = async (companyId: string) => {
    if (!confirm(t('companies.paymentConfirm', { id: companyId }))) {
      return;
    }
    try {
      await activateSubscription(companyId);
      toast.success(t('companies.paymentActivated', { id: companyId }));
    } catch (err) {
      console.error('[CompaniesPage] Failed to activate subscription:', err);
      toast.error(t('companies.paymentError'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {t('companies.title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('companies.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-60 sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                activeTab === 'companies'
                  ? t('companies.searchCompanies')
                  : t('companies.searchLines')
              }
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl ps-9 pe-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => setIsAddLineOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 shrink-0 whitespace-nowrap"
            title={t('companies.addBusLineTitle')}
          >
            <Plus className="w-4 h-4 shrink-0" /> {t('companies.addBusLine')}
          </button>

          <button
            onClick={() => setIsAddCompanyOpen(true)}
            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-brand-600/20 shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0" /> {t('companies.addCompany')}
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'companies'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t('companies.tabCompanies', { count: companies.length })}</span>
        </button>

        <button
          onClick={() => setActiveTab('lines')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'lines'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Route className="w-4 h-4" />
          <span>{t('companies.tabLines', { count: allBusLines.length })}</span>
        </button>
      </div>

      {/* Tab 1: Companies Grid View */}
      {activeTab === 'companies' && (
        <CompaniesGridView
          companies={filteredCompanies}
          buses={buses}
          onSelectCompanyForLines={setSelectedCompanyForLines}
          onDeleteCompany={handleDeleteCompany}
          onOpenAddCompany={() => setIsAddCompanyOpen(true)}
          onConfirmPayment={isSuperAdmin ? handleConfirmPayment : undefined}
        />
      )}

      {/* Tab 2: Bus Lines Master Table View */}
      {activeTab === 'lines' && (
        <LinesTableView
          lines={filteredLines}
          onDeleteLine={handleDeleteLine}
          onRenameLine={handleRenameLine}
          onOpenAddLine={() => setIsAddLineOpen(true)}
        />
      )}

      {/* Line Manager Modal for individual company */}
      <LineManagerModal
        isOpen={Boolean(selectedCompanyForLines)}
        onClose={() => setSelectedCompanyForLines(null)}
        company={selectedCompanyForLines}
      />

      {/* Add Bus Line Modal */}
      <AddBusLineModal
        isOpen={isAddLineOpen}
        onClose={() => setIsAddLineOpen(false)}
        companies={companies}
      />

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
      />
    </div>
  );
};
