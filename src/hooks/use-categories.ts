'use client';

import { useState, useCallback, useEffect } from 'react';
import { InventoryItemCategory, CreateInventoryItemCategoryData, BaseFilters, PaginatedResponse } from '@/lib/types';
import { categoriesService, ServiceError } from '@/lib/api';

interface UseCategoriesOptions {
  initialFilters?: BaseFilters;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const [paginatedCategories, setPaginatedCategories] = useState<PaginatedResponse<InventoryItemCategory>>({
    data: [],
    pagination: {
      current_page: 1,
      per_page: 5,
      total: 0,
      last_page: 0,
    },
  });
  const [allCategories, setAllCategories] = useState<InventoryItemCategory[]>([]);
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

  // Fetch categories from service
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoriesService.getAll(filters);
      setPaginatedCategories(response);

      // Also fetch all categories for local operations
      if (filters.page === 1 && !filters.search) {
        const allResponse = await categoriesService.getAll({
          ...filters,
          page: 1,
          per_page: 1000 // Get all categories
        });
        setAllCategories(allResponse.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create category
  const createCategory = useCallback(async (data: CreateInventoryItemCategoryData): Promise<InventoryItemCategory> => {
    setLoading(true);
    setError(null);

    try {
      const newCategory = await categoriesService.create(data);

      // Refresh the list to show the new category
      await fetchCategories();

      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to create category';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  // Update category
  const updateCategory = useCallback(async (id: string, data: CreateInventoryItemCategoryData): Promise<InventoryItemCategory> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCategory = await categoriesService.update(id, data);

      // Refresh the list to show the updated category
      await fetchCategories();

      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to update category';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  // Delete category
  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await categoriesService.delete(id);

      // Refresh the list to remove the deleted category
      await fetchCategories();
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to delete category';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  // Get category by ID
  const getCategory = useCallback(async (id: string): Promise<InventoryItemCategory | null> => {
    try {
      return await categoriesService.getById(id);
    } catch (err) {
      // Fallback to local data if available
      const localCategory = allCategories.find(category => category.id === id);
      if (localCategory) {
        return localCategory;
      }

      console.error('Error fetching category by ID:', err);
      return null;
    }
  }, [allCategories]);

  // Get category by ID (synchronous version for backward compatibility)
  const getCategorySync = useCallback((id: string): InventoryItemCategory | undefined => {
    return allCategories.find(category => category.id === id);
  }, [allCategories]);

  // Refresh categories
  const refresh = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  return {
    // Data
    categories: paginatedCategories.data || [],
    pagination: paginatedCategories.pagination,
    allCategories,

    // State
    loading,
    error,
    filters,

    // Actions
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategorySync, // For backward compatibility
    refresh,
    updateFilters,
  };
}
