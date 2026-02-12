import { router, usePage } from '@inertiajs/react';
import { Supplier } from '@/types/suppliers';

export const useSuppliersData = () => {
    
  const { suppliers } = usePage<{ suppliers: Supplier[] }>().props;

  const addSupplier = (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    router.post('/suppliers', data);
  };

  const updateSupplier = (id: number, updates: Partial<Supplier>) => {
    router.put(`/suppliers/${id}`, updates);
  };

  const deleteSupplier = (id: number) => {
    if (confirm('Are you sure?')) {
      router.delete(`/suppliers/${id}`);
    }
  };

  const getSupplierById = (id: number) => {
    return suppliers.find(s => s.id === id);
  };

  const resetToDefaults = () => {
    router.reload();
  };

  return {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    resetToDefaults,
  };
};