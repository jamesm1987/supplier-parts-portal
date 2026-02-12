import React, { createContext, useContext, ReactNode } from 'react';
import { Supplier } from '@/types/suppliers';
import { useSuppliersData } from '@/hooks/use-suppliers-data';

interface SuppliersContextType {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Supplier;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getSupplierById: (id: string) => Supplier | undefined;
  importSuppliers: (newSuppliers: Supplier[]) => void;
  exportSuppliers: () => string;
  resetToDefaults: () => void;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

export const SuppliersProvider = ({ children }: { children: ReactNode }) => {
  const suppliersData = useSuppliersData();
  
  return (
    <SuppliersContext.Provider value={suppliersData}>
      {children}
    </SuppliersContext.Provider>
  );
};

export const useSuppliers = (): SuppliersContextType => {
  const context = useContext(SuppliersContext);
  if (!context) {
    throw new Error('useSuppliers must be used within a SuppliersProvider');
  }
  return context;
};
