'use client';

import { useState, useCallback, useMemo } from 'react';
import { InventoryMovement, InventoryMovementFilters, MovementStats } from '@/lib/types';
import { mockInventoryMovements, simulateApiDelay } from '@/lib/mock-data';
import { filterBySearch, sortItems, paginateItems } from '@/lib/utils';

interface UseInventoryMovementsOptions {
  initialFilters?: InventoryMovementFilters;
}

export function useInventoryMovements(options: UseInventoryMovementsOptions = {}) {
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(mockInventoryMovements);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<InventoryMovementFilters>({
    search: '',
    page: 1,
    per_page: 10,
    sort_field: 'created_at',
    sort_direction: 'desc',
    transaction_type: '',
    category: '',
    date_range: '',
    ...options.initialFilters,
  });

  // Get filtered and paginated movements
  const paginatedMovements = useMemo(() => {
    let filteredMovements = [...inventoryMovements];

    // Apply search filter
    if (filters.search) {
      filteredMovements = filteredMovements.filter(movement => 
        movement.inventory_item?.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        movement.notes?.toLowerCase().includes(filters.search!.toLowerCase()) ||
        movement.supplier?.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    // Apply transaction type filter
    if (filters.transaction_type) {
      filteredMovements = filteredMovements.filter(movement => 
        movement.transaction_type === filters.transaction_type
      );
    }

    // Apply category filter
    if (filters.category) {
      filteredMovements = filteredMovements.filter(movement => 
        movement.inventory_item?.inventory_item_category_id === filters.category
      );
    }

    // Apply date range filter (simplified - in real app would parse date ranges)
    if (filters.date_range) {
      const today = new Date();
      const filterDate = new Date(today);
      
      switch (filters.date_range) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
        default:
          filterDate.setFullYear(1970); // Show all
      }
      
      filteredMovements = filteredMovements.filter(movement => 
        new Date(movement.created_at) >= filterDate
      );
    }

    // Apply sorting
    if (filters.sort_field && filters.sort_direction) {
      filteredMovements = sortItems(filteredMovements, filters.sort_field as keyof InventoryMovement, filters.sort_direction);
    }

    // Apply pagination
    return paginateItems(filteredMovements, filters.page || 1, filters.per_page || 10);
  }, [inventoryMovements, filters]);

  // Calculate movement statistics
  const movementStats = useMemo((): MovementStats => {
    const totalStockIn = inventoryMovements
      .filter(m => m.transaction_type === 'IN')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const totalStockOut = inventoryMovements
      .filter(m => m.transaction_type === 'OUT')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const totalWaste = inventoryMovements
      .filter(m => m.transaction_type === 'WASTE')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const totalTransfers = inventoryMovements
      .filter(m => m.transaction_type === 'TRANSFER')
      .reduce((sum, m) => sum + m.quantity, 0);

    return {
      totalStockIn,
      totalStockOut,
      totalWaste,
      totalTransfers,
      totalMovements: inventoryMovements.length,
    };
  }, [inventoryMovements]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<InventoryMovementFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Get movements by item ID
  const getMovementsByItemId = useCallback((itemId: string) => {
    return inventoryMovements.filter(movement => movement.inventory_item_id === itemId);
  }, [inventoryMovements]);

  // Get recent movements
  const getRecentMovements = useCallback((limit: number = 10) => {
    return [...inventoryMovements]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }, [inventoryMovements]);

  // Refresh movements
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await simulateApiDelay(500);
      setInventoryMovements(mockInventoryMovements);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    inventoryMovements: paginatedMovements.data,
    pagination: paginatedMovements.pagination,
    allInventoryMovements: inventoryMovements,
    movementStats,
    
    // State
    loading,
    filters,
    
    // Actions
    getMovementsByItemId,
    getRecentMovements,
    refresh,
    updateFilters,
  };
}
