'use client';

import { useState, useCallback, useMemo } from 'react';
import { Unit, CreateUnitData, PaginatedResponse, BaseFilters } from '@/lib/types';
import { mockUnits, simulateApiDelay, generateId, getCurrentTimestamp } from '@/lib/mock-data';
import { filterBySearch, sortItems, paginateItems } from '@/lib/utils';

interface UseUnitsOptions {
  initialFilters?: BaseFilters;
}

export function useUnits(options: UseUnitsOptions = {}) {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<BaseFilters>({
    search: '',
    page: 1,
    per_page: 10,
    sort_field: 'created_at',
    sort_direction: 'desc',
    ...options.initialFilters,
  });

  // Get filtered and paginated units
  const paginatedUnits = useMemo(() => {
    let filteredUnits = [...units];

    // Apply search filter
    if (filters.search) {
      filteredUnits = filterBySearch(filteredUnits, filters.search, ['name', 'symbol']);
    }

    // Apply sorting
    if (filters.sort_field && filters.sort_direction) {
      filteredUnits = sortItems(filteredUnits, filters.sort_field as keyof Unit, filters.sort_direction);
    }

    // Apply pagination
    return paginateItems(filteredUnits, filters.page || 1, filters.per_page || 10);
  }, [units, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create unit
  const createUnit = useCallback(async (data: CreateUnitData): Promise<Unit> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(800);
      
      const newUnit: Unit = {
        id: generateId(),
        name: data.name,
        symbol: data.symbol,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      setUnits(prev => [newUnit, ...prev]);
      return newUnit;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update unit
  const updateUnit = useCallback(async (id: string, data: CreateUnitData): Promise<Unit> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(800);
      
      const updatedUnit: Unit = {
        id,
        name: data.name,
        symbol: data.symbol,
        created_at: units.find(u => u.id === id)?.created_at || getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      setUnits(prev => prev.map(unit => 
        unit.id === id ? updatedUnit : unit
      ));
      
      return updatedUnit;
    } finally {
      setLoading(false);
    }
  }, [units]);

  // Delete unit
  const deleteUnit = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    
    try {
      await simulateApiDelay(600);
      setUnits(prev => prev.filter(unit => unit.id !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  // Get unit by ID
  const getUnit = useCallback((id: string): Unit | undefined => {
    return units.find(unit => unit.id === id);
  }, [units]);

  // Refresh units (simulate refetch)
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await simulateApiDelay(500);
      // In a real app, this would refetch from the API
      // For now, we'll just reset to mock data
      setUnits(mockUnits);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    units: paginatedUnits.data,
    pagination: paginatedUnits.pagination,
    allUnits: units,
    
    // State
    loading,
    filters,
    
    // Actions
    createUnit,
    updateUnit,
    deleteUnit,
    getUnit,
    refresh,
    updateFilters,
  };
}
