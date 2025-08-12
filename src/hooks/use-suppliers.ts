'use client';

import { useState, useCallback, useMemo } from 'react';
import { Supplier, CreateSupplierData, BaseFilters } from '@/lib/types';
import { mockSuppliers, simulateApiDelay, generateId, getCurrentTimestamp } from '@/lib/mock-data';
import { filterBySearch, sortItems, paginateItems } from '@/lib/utils';

interface UseSuppliersOptions {
  initialFilters?: BaseFilters;
}

export function useSuppliers(options: UseSuppliersOptions = {}) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers); // TODO: Remove mock data in production
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<BaseFilters>({
    search: '',
    page: 1,
    per_page: 10,
    sort_field: 'created_at',
    sort_direction: 'desc',
    ...options.initialFilters,
  });

  // Get filtered and paginated suppliers
  const paginatedSuppliers = useMemo(() => {
    let filteredSuppliers = [...suppliers];

    // Apply search filter
    if (filters.search) {
      filteredSuppliers = filterBySearch(filteredSuppliers, filters.search, ['name', 'email', 'phone', 'address']);
    }

    // Apply sorting
    if (filters.sort_field && filters.sort_direction) {
      filteredSuppliers = sortItems(filteredSuppliers, filters.sort_field as keyof Supplier, filters.sort_direction);
    }

    // Apply pagination
    return paginateItems(filteredSuppliers, filters.page || 1, filters.per_page || 10);
  }, [suppliers, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create supplier
  const createSupplier = useCallback(async (data: CreateSupplierData): Promise<Supplier> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(800);
      
      const newSupplier: Supplier = {
        id: generateId(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      setSuppliers(prev => [newSupplier, ...prev]);
      return newSupplier;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update supplier
  const updateSupplier = useCallback(async (id: string, data: CreateSupplierData): Promise<Supplier> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(800);
      
      const updatedSupplier: Supplier = {
        id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        created_at: suppliers.find(s => s.id === id)?.created_at || getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      setSuppliers(prev => prev.map(supplier => 
        supplier.id === id ? updatedSupplier : supplier
      ));
      
      return updatedSupplier;
    } finally {
      setLoading(false);
    }
  }, [suppliers]);

  // Delete supplier
  const deleteSupplier = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(600);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  // Get supplier by ID
  const getSupplier = useCallback((id: string): Supplier | undefined => {
    return suppliers.find(supplier => supplier.id === id);
  }, [suppliers]);

  // Refresh suppliers
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await simulateApiDelay(500);
      setSuppliers(mockSuppliers);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    suppliers: paginatedSuppliers.data,
    pagination: paginatedSuppliers.pagination,
    allSuppliers: suppliers,
    
    // State
    loading,
    filters,
    
    // Actions
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplier,
    refresh,
    updateFilters,
  };
}


