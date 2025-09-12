'use client';

import { useState, useCallback, useEffect } from 'react';
import { Unit, CreateUnitData, PaginatedResponse, BaseFilters } from '@/lib/types';
import { unitsService } from '@/lib/api/units-service';
import { ServiceError } from '@/lib/api/client';
import { useDepartmentContext } from '@/contexts/department-context';
import { useBranchContext } from '@/contexts/branch-context';

interface UseUnitsOptions {
  initialFilters?: BaseFilters;
}

export function useUnits(options: UseUnitsOptions = {}) {
  const { selectedDepartmentId } = useDepartmentContext();
  const { selectedBranchId } = useBranchContext();
  const [paginatedUnits, setPaginatedUnits] = useState<PaginatedResponse<Unit>>({
    data: [],
    pagination: {
      current_page: 1,
      per_page: 5,
      total: 0,
      last_page: 0,
    },
  });
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BaseFilters>({
    branch_id: selectedBranchId || undefined,
    search: '',
    page: 1,
    per_page: 5,
    sort_field: 'created_at',
    sort_direction: 'desc',
    department_id: selectedDepartmentId || undefined,
    ...options.initialFilters,
  });

  // Fetch units from service
  const fetchUnits = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Always include the selected branch and department in filters
      const filtersWithContext = {
        ...filters,
        branch_id: selectedBranchId || undefined,
        department_id: selectedDepartmentId || undefined,
      };

      const response = await unitsService.getAll(filtersWithContext);
      setPaginatedUnits(response);

      // Also fetch all units for dropdowns and local operations
      if (filters.page === 1 && !filters.search) {
        const allResponse = await unitsService.getAll({
          ...filtersWithContext,
          page: 1,
          per_page: 1000 // Get all units for dropdowns
        });
        setAllUnits(allResponse.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to fetch units';
      setError(errorMessage);
      console.error('Error fetching units:', err);

      // Ensure data structure integrity on error
      setPaginatedUnits({
        data: [],
        pagination: {
          current_page: 1,
          per_page: 5,
          total: 0,
          last_page: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  }, [filters, selectedBranchId, selectedDepartmentId]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create unit
  const createUnit = useCallback(async (data: CreateUnitData): Promise<Unit> => {
    setLoading(true);
    setError(null);

    try {
      const newUnit = await unitsService.create(data);

      // Refresh the list to show the new unit
      await fetchUnits();

      return newUnit;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to create unit';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUnits]);

  // Update unit
  const updateUnit = useCallback(async (id: string, data: CreateUnitData): Promise<Unit> => {
    setLoading(true);
    setError(null);

    try {
      const updatedUnit = await unitsService.update(id, data);

      // Refresh the list to show the updated unit
      await fetchUnits();

      return updatedUnit;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to update unit';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUnits]);

  // Delete unit
  const deleteUnit = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await unitsService.delete(id);

      // Refresh the list to remove the deleted unit
      await fetchUnits();
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to delete unit';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUnits]);

  // Get unit by ID
  const getUnit = useCallback(async (id: string): Promise<Unit | null> => {
    try {
      return await unitsService.getById(id);
    } catch (err) {
      // Fallback to local data if available
      const localUnit = allUnits.find(unit => unit.id === id);
      if (localUnit) {
        return localUnit;
      }

      console.error('Error fetching unit by ID:', err);
      return null;
    }
  }, [allUnits]);

  // Get unit by ID (synchronous version for backward compatibility)
  const getUnitSync = useCallback((id: string): Unit | undefined => {
    return allUnits.find(unit => unit.id === id);
  }, [allUnits]);

  // Refresh units
  const refresh = useCallback(async () => {
    await fetchUnits();
  }, [fetchUnits]);

  return {
    // Data
    units: paginatedUnits.data || [],
    pagination: paginatedUnits.pagination,
    allUnits,

    // State
    loading,
    error,
    filters,

    // Actions
    createUnit,
    updateUnit,
    deleteUnit,
    getUnit,
    getUnitSync, // For backward compatibility
    refresh,
    updateFilters,
  };
}

