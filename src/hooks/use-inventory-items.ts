'use client';

import { useState, useCallback, useEffect } from 'react';
import { InventoryItem, CreateInventoryItemData, BaseFilters, PaginatedResponse } from '@/lib/types';
import { inventoryItemsService } from '@/lib/api/inventory-items-service';
import { ServiceError } from '@/lib/api/client';

interface UseInventoryItemsOptions {
  initialFilters?: BaseFilters;
}

export function useInventoryItems(options: UseInventoryItemsOptions = {}) {
  const [paginatedInventoryItems, setPaginatedInventoryItems] = useState<PaginatedResponse<InventoryItem>>({
    data: [],
    pagination: {
      current_page: 1,
      per_page: 5,
      total: 0,
      last_page: 0,
    },
  });
  const [allInventoryItems, setAllInventoryItems] = useState<InventoryItem[]>([]);
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

  // Fetch inventory items from service
  const fetchInventoryItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await inventoryItemsService.getAll(filters);
      setPaginatedInventoryItems(response);

      // Also fetch all items for local operations - TODO: REMOVE IN PRODUCTION - PERFORMANCE ISSUE!
      if (filters.page === 1 && !filters.search) {
        const allResponse = await inventoryItemsService.getAll({
          ...filters,
          page: 1,
          per_page: 1000 // TODO: REMOVE - This fetches 1000 records unnecessarily!
        });
        setAllInventoryItems(allResponse.data);
      }
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to fetch inventory items';
      setError(errorMessage);
      console.error('Error fetching inventory items:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchInventoryItems();
  }, [fetchInventoryItems]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create inventory item
  const createInventoryItem = useCallback(async (data: CreateInventoryItemData): Promise<InventoryItem> => {
    setLoading(true);
    setError(null);

    try {
      const newItem = await inventoryItemsService.create(data);

      // Refresh the list to show the new item
      await fetchInventoryItems();

      return newItem;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to create inventory item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInventoryItems]);

  // Update inventory item
  const updateInventoryItem = useCallback(async (id: string, data: CreateInventoryItemData): Promise<InventoryItem> => {
    setLoading(true);
    setError(null);

    try {
      const updatedItem = await inventoryItemsService.update(id, data);

      // Refresh the list to show the updated item
      await fetchInventoryItems();

      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to update inventory item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInventoryItems]);

  // Delete inventory item
  const deleteInventoryItem = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await inventoryItemsService.delete(id);

      // Refresh the list to remove the deleted item
      await fetchInventoryItems();
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to delete inventory item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInventoryItems]);

  // Get inventory item by ID
  const getInventoryItem = useCallback(async (id: string): Promise<InventoryItem | null> => {
    try {
      return await inventoryItemsService.getById(id);
    } catch (err) {
      // Fallback to local data if available
      const localItem = allInventoryItems.find(item => item.id === id);
      if (localItem) {
        return localItem;
      }

      console.error('Error fetching inventory item by ID:', err);
      return null;
    }
  }, [allInventoryItems]);

  // Get inventory item by ID (synchronous version for backward compatibility)
  const getInventoryItemSync = useCallback((id: string): InventoryItem | undefined => {
    return allInventoryItems.find(item => item.id === id);
  }, [allInventoryItems]);

  // Refresh inventory items
  const refresh = useCallback(async () => {
    await fetchInventoryItems();
  }, [fetchInventoryItems]);

  return {
    // Data
    inventoryItems: paginatedInventoryItems.data || [],
    pagination: paginatedInventoryItems.pagination,
    allInventoryItems,

    // State
    loading,
    error,
    filters,

    // Actions
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryItem,
    getInventoryItemSync, // For backward compatibility
    refresh,
    updateFilters,
  };
}

