'use client';

import { useState, useCallback, useMemo } from 'react';
import { InventoryItemCategory, CreateInventoryItemCategoryData, BaseFilters } from '@/lib/types';
import { mockCategories, simulateApiDelay, generateId, getCurrentTimestamp } from '@/lib/mock-data';
import { filterBySearch, sortItems, paginateItems } from '@/lib/utils';

interface UseCategoriesOptions {
  initialFilters?: BaseFilters;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const [categories, setCategories] = useState<InventoryItemCategory[]>(mockCategories);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<BaseFilters>({
    search: '',
    page: 1,
    per_page: 10,
    sort_field: 'created_at',
    sort_direction: 'desc',
    ...options.initialFilters,
  });

  // Get filtered and paginated categories
  const paginatedCategories = useMemo(() => {
    let filteredCategories = [...categories];

    // Apply search filter
    if (filters.search) {
      filteredCategories = filterBySearch(filteredCategories, filters.search, ['name', 'description']);
    }

    // Apply sorting
    if (filters.sort_field && filters.sort_direction) {
      filteredCategories = sortItems(filteredCategories, filters.sort_field as keyof InventoryItemCategory, filters.sort_direction);
    }

    // Apply pagination
    return paginateItems(filteredCategories, filters.page || 1, filters.per_page || 10);
  }, [categories, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create category
  const createCategory = useCallback(async (data: CreateInventoryItemCategoryData): Promise<InventoryItemCategory> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(800);
      
      const newCategory: InventoryItemCategory = {
        id: generateId(),
        name: data.name,
        // description: data.description,
        branch_id: 'branch-1', // Mock branch ID
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      setCategories(prev => [newCategory, ...prev]);
      return newCategory;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update category
  const updateCategory = useCallback(async (id: string, data: CreateInventoryItemCategoryData): Promise<InventoryItemCategory> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(800);
      
      const updatedCategory: InventoryItemCategory = {
        id,
        name: data.name,
        // description: data.description,
        branch_id: categories.find(c => c.id === id)?.branch_id || 'branch-1',
        created_at: categories.find(c => c.id === id)?.created_at || getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      setCategories(prev => prev.map(category => 
        category.id === id ? updatedCategory : category
      ));
      
      return updatedCategory;
    } finally {
      setLoading(false);
    }
  }, [categories]);

  // Delete category
  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(600);
      setCategories(prev => prev.filter(category => category.id !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  // Get category by ID
  const getCategory = useCallback((id: string): InventoryItemCategory | undefined => {
    return categories.find(category => category.id === id);
  }, [categories]);

  // Refresh categories
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await simulateApiDelay(500);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    categories: paginatedCategories.data,
    pagination: paginatedCategories.pagination,
    allCategories: categories,
    
    // State
    loading,
    filters,
    
    // Actions
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    refresh,
    updateFilters,
  };
}
