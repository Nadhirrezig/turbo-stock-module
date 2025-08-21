'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { InventoryMovement, InventoryMovementFilters, MovementStats, PaginatedResponse, CreateStockEntryData } from '@/lib/types';
import { inventoryMovementsService, ServiceError } from '@/lib/api';

type MovementUpdateData = Partial<CreateStockEntryData>;

interface UseInventoryMovementsOptions {
  initialFilters?: InventoryMovementFilters;
}

export function useInventoryMovements(options: UseInventoryMovementsOptions = {}) {
  const [paginatedMovements, setPaginatedMovements] = useState<PaginatedResponse<InventoryMovement>>({
    data: [],
    pagination: {
      current_page: 1,
      per_page: 5,
      total: 0,
      last_page: 0,
    },
  });
  const [allInventoryMovements, setAllInventoryMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InventoryMovementFilters>({
    search: '',
    page: 1,
    per_page: 5,
    sort_field: 'created_at',
    sort_direction: 'desc',
    transaction_type: '',
    category: '',
    date_range: '',
    ...options.initialFilters,
  });

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await inventoryMovementsService.getAll(filters);
      setPaginatedMovements(response);

      if (filters.page === 1 && !filters.search && !filters.transaction_type && !filters.category && !filters.date_range) {
        const allResponse = await inventoryMovementsService.getAll({ ...filters, page: 1, per_page: 1000 });
        setAllInventoryMovements(allResponse.data || []);
      }
    } catch (err) {
      const message = err instanceof ServiceError ? err.message : 'Failed to fetch inventory movements';
      setError(message);
      setPaginatedMovements({
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
    fetchMovements();
  }, [fetchMovements]);

  const movementStats = useMemo((): MovementStats => {
    const totalStockIn = allInventoryMovements.filter(m => m.transaction_type === 'IN').reduce((sum, m) => sum + m.quantity, 0);
    const totalStockOut = allInventoryMovements.filter(m => m.transaction_type === 'OUT').reduce((sum, m) => sum + m.quantity, 0);
    const totalWaste = allInventoryMovements.filter(m => m.transaction_type === 'WASTE').reduce((sum, m) => sum + m.quantity, 0);
    const totalTransfers = allInventoryMovements.filter(m => m.transaction_type === 'TRANSFER').reduce((sum, m) => sum + m.quantity, 0);
    return { totalStockIn, totalStockOut, totalWaste, totalTransfers, totalMovements: allInventoryMovements.length };
  }, [allInventoryMovements]);

  const updateFilters = useCallback((newFilters: Partial<InventoryMovementFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const getMovementsByItemId = useCallback((itemId: string) => {
    return allInventoryMovements.filter(movement => movement.inventory_item_id === itemId);
  }, [allInventoryMovements]);

  const getRecentMovements = useCallback((limit: number = 10) => {
    return [...allInventoryMovements]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }, [allInventoryMovements]);

  const updateMovement = useCallback(async (movementId: string, data: MovementUpdateData) => {
    setLoading(true);
    setError(null);
    try {
      await inventoryMovementsService.update(movementId, data);
      await fetchMovements();
    } catch (err) {
      const message = err instanceof ServiceError ? err.message : 'Failed to update inventory movement';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMovements]);

  const refresh = useCallback(async () => {
    await fetchMovements();
  }, [fetchMovements]);

  return {
    inventoryMovements: paginatedMovements.data,
    pagination: paginatedMovements.pagination,
    allInventoryMovements,
    movementStats,
    loading,
    error,
    filters,
    getMovementsByItemId,
    getRecentMovements,
    updateMovement,
    refresh,
    updateFilters,
  };
}


