'use client';

import { useState, useCallback, useEffect } from 'react';
import { Department, CreateDepartmentData, PaginatedResponse, BaseFilters } from '@/lib/types';
import { departmentsService } from '@/lib/api/departments-service';
import { ServiceError } from '@/lib/api/client';
import { useBranchContext } from '@/contexts/branch-context';

interface UseDepartmentsOptions {
  initialFilters?: BaseFilters;
}

export function useDepartments(options: UseDepartmentsOptions = {}) {
  const { selectedBranchId } = useBranchContext();
  const [paginatedDepartments, setPaginatedDepartments] = useState<PaginatedResponse<Department>>({
    data: [],
    pagination: {
      current_page: 1,
      per_page: 5,
      total: 0,
      last_page: 0,
    },
  });
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BaseFilters>({
    branch_id: selectedBranchId || undefined,
    search: '',
    page: 1,
    per_page: 5,
    sort_field: 'created_at',
    sort_direction: 'desc',
    ...options.initialFilters,
  });

  // Fetch departments from service
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Always include the selected branch in filters
      const filtersWithBranch = {
        ...filters,
        branch_id: selectedBranchId || undefined,
      };

      const response = await departmentsService.getAll(filtersWithBranch);
      setPaginatedDepartments(response);

      // Also fetch all departments for dropdowns and local operations
      if (filters.page === 1 && !filters.search) {
        const allResponse = await departmentsService.getAll({
          ...filtersWithBranch,
          page: 1,
          per_page: 1000 // Get all departments for dropdowns
        });
        setAllDepartments(allResponse.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to fetch departments';
      setError(errorMessage);
      console.error('Error fetching departments:', err);

      // Ensure data structure integrity on error
      setPaginatedDepartments({
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
  }, [filters, selectedBranchId]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create department
  const createDepartment = useCallback(async (data: CreateDepartmentData): Promise<Department> => {
    setLoading(true);
    setError(null);

    try {
      const newDepartment = await departmentsService.create(data);

      // Refresh the list to show the new department
      await fetchDepartments();

      return newDepartment;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to create department';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDepartments]);

  // Update department
  const updateDepartment = useCallback(async (id: string, data: CreateDepartmentData): Promise<Department> => {
    setLoading(true);
    setError(null);

    try {
      const updatedDepartment = await departmentsService.update(id, data);

      // Refresh the list to show the updated department
      await fetchDepartments();

      return updatedDepartment;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to update department';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDepartments]);

  // Delete department
  const deleteDepartment = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await departmentsService.delete(id);

      // Refresh the list to remove the deleted department
      await fetchDepartments();
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to delete department';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDepartments]);

  // Get department by ID
  const getDepartment = useCallback(async (id: string): Promise<Department | null> => {
    try {
      return await departmentsService.getById(id);
    } catch (err) {
      // Fallback to local data if available
      const localDepartment = allDepartments.find(department => department.id === id);
      if (localDepartment) {
        return localDepartment;
      }

      console.error('Error fetching department by ID:', err);
      return null;
    }
  }, [allDepartments]);

  // Get department by ID (synchronous version for backward compatibility)
  const getDepartmentSync = useCallback((id: string): Department | undefined => {
    return allDepartments.find(department => department.id === id);
  }, [allDepartments]);

  // Refresh departments
  const refresh = useCallback(async () => {
    await fetchDepartments();
  }, [fetchDepartments]);

  return {
    // Data
    departments: paginatedDepartments.data || [],
    pagination: paginatedDepartments.pagination,
    allDepartments,

    // State
    loading,
    error,
    filters,

    // Actions
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartment,
    getDepartmentSync, // For backward compatibility
    refresh,
    updateFilters,
  };
}
