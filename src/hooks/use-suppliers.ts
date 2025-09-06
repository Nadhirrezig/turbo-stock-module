'use client';

import { useState, useCallback, useEffect } from 'react';
import { Supplier, BaseFilters, PaginatedResponse } from '@/lib/types';
import { SupplierFormData } from '@/lib/schemas';
import { suppliersService } from '@/lib/api/suppliers-service';
import { ServiceError } from '@/lib/api/client';

interface UseSuppliersOptions {
  initialFilters?: BaseFilters;
}

export function useSuppliers(options: UseSuppliersOptions = {}) {
  const [paginatedSuppliers, setPaginatedSuppliers] = useState<PaginatedResponse<Supplier>>({
    data: [],
    pagination: {
      current_page: 1,
      per_page: 5,
      total: 0,
      last_page: 0,
    },
  });
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BaseFilters>({
    search: '',
    page: 1,
    per_page: 5,
    sort_field: 'created_at',
    sort_direction: 'desc',
    ...options.initialFilters,
  });

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await suppliersService.getAll(filters);
      setPaginatedSuppliers(response);

      if (filters.page === 1 && !filters.search) {
        const allResponse = await suppliersService.getAll({ ...filters, page: 1, per_page: 1000 });
        setAllSuppliers(allResponse.data || []);
      }
    } catch (error: unknown) {
      const message = error instanceof ServiceError ? error.message : 'Failed to fetch suppliers';
      setError(message);
      setPaginatedSuppliers({
        data: [],
        pagination: {
          current_page: 1,
          per_page: filters.per_page || 5,
          total: 0,
          last_page: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const createSupplier = useCallback(async (data: SupplierFormData): Promise<Supplier> => {
    setLoading(true);
    setError(null);
    try {
      const created = await suppliersService.create(data);
      await fetchSuppliers();
      return created;
    } catch (error) {
      const message = error instanceof ServiceError ? error.message : 'Failed to create supplier';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchSuppliers]);

  const updateSupplier = useCallback(async (id: string, data: SupplierFormData): Promise<Supplier> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await suppliersService.update(id, data);
      await fetchSuppliers();
      return updated;
    } catch (error) {
      const message = error instanceof ServiceError ? error.message : 'Failed to update supplier';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchSuppliers]);

  const deleteSupplier = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await suppliersService.delete(id);
      await fetchSuppliers();
    } catch (error) {
      const message = error instanceof ServiceError ? error.message : 'Failed to delete supplier';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchSuppliers]);

  const getSupplier = useCallback(async (id: string): Promise<Supplier | null> => {
    try {
      return await suppliersService.getById(id);
    } catch {
      const local = allSuppliers.find(s => s.id === id);
      return local || null;
    }
  }, [allSuppliers]);

  const getSupplierSync = useCallback((id: string): Supplier | undefined => {
    return allSuppliers.find(s => s.id === id);
  }, [allSuppliers]);

  const refresh = useCallback(async () => {
    await fetchSuppliers();
  }, [fetchSuppliers]);

  return {
    suppliers: paginatedSuppliers.data || [],
    pagination: paginatedSuppliers.pagination,
    allSuppliers,
    loading,
    error,
    filters,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplier,
    getSupplierSync,
    refresh,
    updateFilters,
  };
}

