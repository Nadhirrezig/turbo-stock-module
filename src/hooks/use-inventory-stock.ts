'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { InventoryStock, CreateStockEntryData, BaseFilters, StockStats, PaginatedResponse } from '@/lib/types';
import { inventoryStockService, ServiceError } from '@/lib/api';

interface UseInventoryStockOptions {
  initialFilters?: BaseFilters;
}

export function useInventoryStock(options: UseInventoryStockOptions = {}) {
  const [paginatedInventoryStock, setPaginatedInventoryStock] = useState<PaginatedResponse<InventoryStock>>({
    data: [],
    pagination: {
      current_page: 1,
      per_page: 5,
      total: 0,
      last_page: 0,
    },
  });
  const [allInventoryStock, setAllInventoryStock] = useState<InventoryStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BaseFilters>({
    search: '',
    page: 1,
    per_page: 5,
    sort_field: 'updated_at',
    sort_direction: 'desc',
    ...options.initialFilters,
  });

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await inventoryStockService.getAll(filters);
      setPaginatedInventoryStock(response);

      if (filters.page === 1 && !filters.search) {
        const allResponse = await inventoryStockService.getAll({ ...filters, page: 1, per_page: 1000 });
        setAllInventoryStock(allResponse.data || []);
      }
    } catch (err) {
      const message = err instanceof ServiceError ? err.message : 'Failed to fetch inventory stock';
      setError(message);
      setPaginatedInventoryStock({
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
    fetchStock();
  }, [fetchStock]);

  const stockStats = useMemo((): StockStats => {
    const totalItems = allInventoryStock.length;
    const lowStockItems = allInventoryStock.filter(stock => stock.inventory_item && stock.quantity <= stock.inventory_item.threshold_quantity).length;
    const outOfStockItems = allInventoryStock.filter(stock => stock.quantity <= 0).length;
    const totalValue = allInventoryStock.reduce((sum, stock) => sum + (stock.quantity * stock.unit_purchase_price), 0);
    return { totalItems, lowStockItems, outOfStockItems, totalValue };
  }, [allInventoryStock]);

  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const addStockEntry = useCallback(async (data: CreateStockEntryData): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await inventoryStockService.addEntry(data);
      await fetchStock();
    } catch (err) {
      const message = err instanceof ServiceError ? err.message : 'Failed to add stock entry';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStock]);

  const getStockByItemId = useCallback((itemId: string): InventoryStock | undefined => {
    return allInventoryStock.find(stock => stock.inventory_item_id === itemId);
  }, [allInventoryStock]);

  const getLowStockItems = useCallback(() => {
    return allInventoryStock.filter(stock => stock.inventory_item && stock.quantity <= stock.inventory_item.threshold_quantity);
  }, [allInventoryStock]);

  const refresh = useCallback(async () => {
    await fetchStock();
  }, [fetchStock]);

  return {
    inventoryStock: paginatedInventoryStock.data,
    pagination: paginatedInventoryStock.pagination,
    allInventoryStock,
    stockStats,
    loading,
    error,
    filters,
    addStockEntry,
    getStockByItemId,
    getLowStockItems,
    refresh,
    updateFilters,
  };
}
