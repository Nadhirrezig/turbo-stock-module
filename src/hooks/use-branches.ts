'use client';

import { useState, useCallback, useEffect } from 'react';
import { Branch, CreateBranchData, PaginatedResponse, BaseFilters } from '@/lib/types';
import { branchesService } from '@/lib/api/branches-service';
import { ServiceError } from '@/lib/api/client';

interface UseBranchesOptions {
  initialFilters?: BaseFilters;
}

export function useBranches(options: UseBranchesOptions = {}) {
  const [paginatedBranches, setPaginatedBranches] = useState<PaginatedResponse<Branch>>({
    data: [],
    pagination: {
      current_page: 1,
      per_page: 5,
      total: 0,
      last_page: 0,
    },
  });
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
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

  // Fetch branches from service
  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await branchesService.getAll(filters);
      setPaginatedBranches(response);

      // Also fetch all branches for dropdowns and local operations
      if (filters.page === 1 && !filters.search) {
        const allResponse = await branchesService.getAll({
          ...filters,
          page: 1,
          per_page: 1000 // Get all branches for dropdowns
        });
        setAllBranches(allResponse.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to fetch branches';
      setError(errorMessage);
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch all branches (for dropdowns, etc.)
  const fetchAllBranches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await branchesService.getAll({
        page: 1,
        per_page: 1000,
        sort_field: 'name',
        sort_direction: 'asc',
      });
      setAllBranches(response.data || []);
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to fetch all branches';
      setError(errorMessage);
      console.error('Error fetching all branches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get branch by ID
  const getBranchById = useCallback(async (id: string): Promise<Branch | null> => {
    try {
      const branch = await branchesService.getById(id);
      return branch;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to fetch branch';
      setError(errorMessage);
      console.error('Error fetching branch by ID:', err);
      return null;
    }
  }, []);

  // Create new branch
  const createBranch = useCallback(async (data: CreateBranchData): Promise<Branch | null> => {
    setLoading(true);
    setError(null);

    try {
      const newBranch = await branchesService.create(data);
      
      // Refresh the branches list
      await fetchBranches();
      await fetchAllBranches();
      
      return newBranch;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to create branch';
      setError(errorMessage);
      console.error('Error creating branch:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchBranches, fetchAllBranches]);

  // Update existing branch
  const updateBranch = useCallback(async (id: string, data: CreateBranchData): Promise<Branch | null> => {
    setLoading(true);
    setError(null);

    try {
      const updatedBranch = await branchesService.update(id, data);
      
      // Refresh the branches list
      await fetchBranches();
      await fetchAllBranches();
      
      return updatedBranch;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to update branch';
      setError(errorMessage);
      console.error('Error updating branch:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchBranches, fetchAllBranches]);

  // Delete branch
  const deleteBranch = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await branchesService.delete(id);
      
      // Refresh the branches list
      await fetchBranches();
      await fetchAllBranches();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof ServiceError ? err.message : 'Failed to delete branch';
      setError(errorMessage);
      console.error('Error deleting branch:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchBranches, fetchAllBranches]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<BaseFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Reset filters to default
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      page: 1,
      per_page: 5,
      sort_field: 'created_at',
      sort_direction: 'desc',
      ...options.initialFilters,
    });
  }, [options.initialFilters]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Fetch all branches on mount
  useEffect(() => {
    fetchAllBranches();
  }, [fetchAllBranches]);

  return {
    // Data
    paginatedBranches,
    allBranches,
    branches: paginatedBranches.data,
    
    // State
    loading,
    error,
    filters,
    
    // Actions
    fetchBranches,
    fetchAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
    updateFilters,
    resetFilters,
    clearError,
    
    // Pagination helpers
    currentPage: paginatedBranches.pagination.current_page,
    totalPages: paginatedBranches.pagination.last_page,
    totalItems: paginatedBranches.pagination.total,
    itemsPerPage: paginatedBranches.pagination.per_page,
  };
}