/**
 * CompanyContext — Multi-Company Workspace Management & Active Tenant State
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, CompanyCreatePayload } from '@wasalt/types';
import * as companyService from '../services/companyService';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

interface CompanyContextType {
  companies: Company[];
  activeCompany: Company | null;
  isLoading: boolean;
  setActiveCompanyId: (companyId: string) => void;
  createNewCompany: (payload: CompanyCreatePayload) => Promise<Company>;
  updateCurrentCompany: (updates: Partial<Company>) => Promise<Company>;
  refreshCompanies: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin } = useAuth();
  const { setTheme } = useTheme();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCompanies = async () => {
    if (!admin) {
      setCompanies([]);
      setActiveCompany(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const list = await companyService.fetchCompaniesForAdmin(admin.id);
      setCompanies(list);
      if (list.length > 0) {
        // Retain current or set first
        const current = activeCompany ? list.find((c) => c.id === activeCompany.id) : list[0];
        const selected = current || list[0];
        setActiveCompany(selected);
        if (selected.theme) {
          setTheme(selected.theme);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [admin?.id]);

  const setActiveCompanyId = (companyId: string) => {
    const found = companies.find((c) => c.id === companyId);
    if (found) {
      setActiveCompany(found);
      if (found.theme) {
        setTheme(found.theme);
      }
    }
  };

  const createNewCompany = async (payload: CompanyCreatePayload): Promise<Company> => {
    const created = await companyService.createCompany(payload);
    setCompanies((prev) => [created, ...prev]);
    setActiveCompany(created);
    setTheme(created.theme);
    return created;
  };

  const updateCurrentCompany = async (updates: Partial<Company>): Promise<Company> => {
    if (!activeCompany) throw new Error('No active company selected');
    const updated = await companyService.updateCompany(activeCompany.id, updates);
    setActiveCompany(updated);
    setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (updated.theme) {
      setTheme(updated.theme);
    }
    return updated;
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        activeCompany,
        isLoading,
        setActiveCompanyId,
        createNewCompany,
        updateCurrentCompany,
        refreshCompanies: loadCompanies,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export function useCompany(): CompanyContextType {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
