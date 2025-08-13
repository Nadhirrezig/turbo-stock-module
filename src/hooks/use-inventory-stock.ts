'use client';

import { useState, useCallback, useMemo } from 'react';
import { InventoryStock, CreateStockEntryData, BaseFilters, StockStats } from '@/lib/types';
import { mockInventoryStock, mockInventoryItems, simulateApiDelay, generateId, getCurrentTimestamp } from '@/lib/mock-data';
import { sortItems, paginateItems } from '@/lib/utils';

interface UseInventoryStockOptions {
  initialFilters?: BaseFilters;
}

export function useInventoryStock(options: UseInventoryStockOptions = {}) {
  const [inventoryStock, setInventoryStock] = useState<InventoryStock[]>(mockInventoryStock);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<BaseFilters>({
    search: '',
    page: 1,
    per_page: 5,
    sort_field: 'updated_at',
    sort_direction: 'desc',
    ...options.initialFilters,
  });

  // Get filtered and paginated stock
  const paginatedStock = useMemo(() => {
    let filteredStock = [...inventoryStock];

    // Apply search filter
    if (filters.search) {
      filteredStock = filteredStock.filter(stock => 
        stock.inventory_item?.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    // Apply sorting
    if (filters.sort_field && filters.sort_direction) {
      filteredStock = sortItems(filteredStock, filters.sort_field as keyof InventoryStock, filters.sort_direction);
    }

    // Apply pagination
    return paginateItems(filteredStock, filters.page || 1, filters.per_page || 10);
  }, [inventoryStock, filters]);

  // Calculate stock statistics
  const stockStats = useMemo((): StockStats => {
    const totalItems = inventoryStock.length;
    const lowStockItems = inventoryStock.filter(stock => 
      stock.inventory_item && stock.quantity <= stock.inventory_item.threshold_quantity
    ).length;
    const outOfStockItems = inventoryStock.filter(stock => stock.quantity <= 0).length;
    const totalValue = inventoryStock.reduce((sum, stock) => 
      sum + (stock.quantity * stock.unit_purchase_price), 0
    );

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalValue,
    };
  }, [inventoryStock]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Add stock entry (creates movement and updates stock)
  const addStockEntry = useCallback(async (data: CreateStockEntryData): Promise<void> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(800);
      
      // Find the inventory item
      const inventoryItem = mockInventoryItems.find(item => item.id === data.inventory_item_id);
      
      // Find existing stock record or create new one
      const existingStockIndex = inventoryStock.findIndex(
        stock => stock.inventory_item_id === data.inventory_item_id
      );

      if (existingStockIndex >= 0) {
        // Update existing stock
        setInventoryStock(prev => {
          const updated = [...prev];
          const currentStock = updated[existingStockIndex];
          
          let newQuantity = currentStock.quantity;
          if (data.transaction_type === 'IN') {
            newQuantity += data.quantity;
          } else if (data.transaction_type === 'OUT' || data.transaction_type === 'WASTE') {
            newQuantity -= data.quantity;
          }
          
          updated[existingStockIndex] = {
            ...currentStock,
            quantity: Math.max(0, newQuantity), // Prevent negative stock
            unit_purchase_price: data.unit_purchase_price || currentStock.unit_purchase_price,
            expiration_date: data.expiration_date || currentStock.expiration_date,
            updated_at: getCurrentTimestamp(),
          };
          
          return updated;
        });
      } else if (data.transaction_type === 'IN') {
        // Create new stock record for IN transactions
        const newStock: InventoryStock = {
          id: generateId(),
          inventory_item_id: data.inventory_item_id,
          branch_id: 'branch-1',
          quantity: data.quantity,
          unit_purchase_price: data.unit_purchase_price || 0,
          expiration_date: data.expiration_date,
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp(),
          inventory_item: inventoryItem,
        };
        
        setInventoryStock(prev => [newStock, ...prev]);
      }
    } finally {
      setLoading(false);
    }
  }, [inventoryStock]);

  // Get stock by inventory item ID
  const getStockByItemId = useCallback((itemId: string): InventoryStock | undefined => {
    return inventoryStock.find(stock => stock.inventory_item_id === itemId);
  }, [inventoryStock]);

  // Get low stock items
  const getLowStockItems = useCallback(() => {
    return inventoryStock.filter(stock => 
      stock.inventory_item && stock.quantity <= stock.inventory_item.threshold_quantity
    );
  }, [inventoryStock]);

  // Refresh stock
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await simulateApiDelay(500);
      setInventoryStock(mockInventoryStock);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    inventoryStock: paginatedStock.data,
    pagination: paginatedStock.pagination,
    allInventoryStock: inventoryStock,
    stockStats,
    
    // State
    loading,
    filters,
    
    // Actions
    addStockEntry,
    getStockByItemId,
    getLowStockItems,
    refresh,
    updateFilters,
  };
}
