'use client';

import { useState, useCallback, useMemo } from 'react';
import { InventoryItem, CreateInventoryItemData, BaseFilters } from '@/lib/types';
import { mockInventoryItems, mockCategories, mockUnits, mockSuppliers, simulateApiDelay, generateId, getCurrentTimestamp } from '@/lib/mock-data';
import { filterBySearch, sortItems, paginateItems } from '@/lib/utils';

interface UseInventoryItemsOptions {
  initialFilters?: BaseFilters;
}

export function useInventoryItems(options: UseInventoryItemsOptions = {}) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<BaseFilters>({
    search: '',
    page: 1,
    per_page: 10,
    sort_field: 'created_at',
    sort_direction: 'desc',
    ...options.initialFilters,
  });

  // Get filtered and paginated inventory items
  const paginatedInventoryItems = useMemo(() => {
    let filteredItems = [...inventoryItems];

    // Apply search filter
    if (filters.search) {
      filteredItems = filterBySearch(filteredItems, filters.search, ['name']);
    }

    // Apply sorting
    if (filters.sort_field && filters.sort_direction) {
      filteredItems = sortItems(filteredItems, filters.sort_field as keyof InventoryItem, filters.sort_direction);
    }

    // Apply pagination
    return paginateItems(filteredItems, filters.page || 1, filters.per_page || 10);
  }, [inventoryItems, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create inventory item
  const createInventoryItem = useCallback(async (data: CreateInventoryItemData): Promise<InventoryItem> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(800);
      
      // Find related entities
      const category = mockCategories.find(c => c.id === data.inventory_item_category_id);
      const unit = mockUnits.find(u => u.id === data.unit_id);
      const supplier = mockSuppliers.find(s => s.id === data.preferred_supplier_id);
      
      const newItem: InventoryItem = {
        id: generateId(),
        name: data.name,
        inventory_item_category_id: data.inventory_item_category_id,
        unit_id: data.unit_id,
        threshold_quantity: data.threshold_quantity,
        preferred_supplier_id: data.preferred_supplier_id,
        reorder_quantity: data.reorder_quantity,
        unit_purchase_price: data.unit_purchase_price,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
        // Include relations
        category,
        unit,
        preferred_supplier: supplier,
      };

      setInventoryItems(prev => [newItem, ...prev]);
      return newItem;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update inventory item
  const updateInventoryItem = useCallback(async (id: string, data: CreateInventoryItemData): Promise<InventoryItem> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(800);
      
      // Find related entities
      const category = mockCategories.find(c => c.id === data.inventory_item_category_id);
      const unit = mockUnits.find(u => u.id === data.unit_id);
      const supplier = mockSuppliers.find(s => s.id === data.preferred_supplier_id);
      
      const updatedItem: InventoryItem = {
        id,
        name: data.name,
        inventory_item_category_id: data.inventory_item_category_id,
        unit_id: data.unit_id,
        threshold_quantity: data.threshold_quantity,
        preferred_supplier_id: data.preferred_supplier_id,
        reorder_quantity: data.reorder_quantity,
        unit_purchase_price: data.unit_purchase_price,
        created_at: inventoryItems.find(i => i.id === id)?.created_at || getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
        // Include relations
        category,
        unit,
        preferred_supplier: supplier,
      };

      setInventoryItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
      
      return updatedItem;
    } finally {
      setLoading(false);
    }
  }, [inventoryItems]);

  // Delete inventory item
  const deleteInventoryItem = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(600);
      setInventoryItems(prev => prev.filter(item => item.id !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  // Get inventory item by ID
  const getInventoryItem = useCallback((id: string): InventoryItem | undefined => {
    return inventoryItems.find(item => item.id === id);
  }, [inventoryItems]);

  // Refresh inventory items
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await simulateApiDelay(500);
      setInventoryItems(mockInventoryItems);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    inventoryItems: paginatedInventoryItems.data,
    pagination: paginatedInventoryItems.pagination,
    allInventoryItems: inventoryItems,
    
    // State
    loading,
    filters,
    
    // Actions
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryItem,
    refresh,
    updateFilters,
  };
}
