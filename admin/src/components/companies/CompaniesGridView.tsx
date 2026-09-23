/**
 * @file CompaniesGridView.tsx
 * @description Renders a responsive grid of transit operator cards
 * and handles empty search state representations.
 */

import React from 'react';
import { Building2, Plus } from 'lucide-react';
import { CompanyCard } from './CompanyCard';
import { CompanyRecord, BusRouteDefinition } from '../../types';

interface CompaniesGridViewProps {
  companies: CompanyRecord[];
  buses: BusRouteDefinition[];
  onSelectCompanyForLines: (company: CompanyRecord) => void;
  onDeleteCompany: (companyId: string) => void;
  onOpenAddCompany: () => void;
}

/**
 * Grid view component rendering operator cards or an empty search prompt.
 *
 * @param props - Filtered company records, bus route definitions, and action handlers.
 * @returns JSX Element.
 */
export const CompaniesGridView: React.FC<CompaniesGridViewProps> = ({
  companies,
  buses,
  onSelectCompanyForLines,
  onDeleteCompany,
  onOpenAddCompany,
}) => {
  /**
   * Calculates the total buses assigned to a company.
   */
  const getBusCount = (companyId: string) => {
    return buses.filter(
      (b) => b.companyId.toLowerCase() === companyId.toLowerCase()
    ).length;
  };

  if (companies.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No operators found</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Try refining your search query or add a new transit authority.
        </p>
        <button
          onClick={onOpenAddCompany}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Transit Operator
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          busesCount={getBusCount(company.id)}
          onManageLines={() => onSelectCompanyForLines(company)}
          onDeleteCompany={onDeleteCompany}
        />
      ))}
    </div>
  );
};
