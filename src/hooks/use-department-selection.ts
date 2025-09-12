'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDepartmentContext } from '@/contexts/department-context';
import { useCategories } from '@/hooks/use-categories';
import { useUnits } from '@/hooks/use-units';
import { useInventoryItems } from '@/hooks/use-inventory-items';

/**
 * Hook for managing department selection and ensuring complete data context shift
 * This hook coordinates all dependent data when switching departments
 */
export function useDepartmentSelection() {
  const { 
    selectedDepartmentId, 
    selectedDepartment, 
    setSelectedDepartmentId, 
    allDepartments, 
    loading: departmentsLoading,
    isDepartmentSelected,
    currentBranchId 
  } = useDepartmentContext();

  // Track previous department to detect changes
  const previousDepartmentId = useRef<string | null>(null);
  
  // All dependent hooks that need to be refreshed when department changes
  const categories = useCategories();
  const units = useUnits();
  const inventoryItems = useInventoryItems();

  // Department-specific filters are handled by individual hooks

  // Refresh all dependent data when department changes
  const refreshAllData = useCallback(async (departmentId: string) => {
    try {
      // Refresh all dependent data in parallel
      await Promise.all([
        categories.refresh(),
        units.refresh(),
        inventoryItems.refresh(),
      ]);
    } catch (error) {
      console.error('Error refreshing data for department:', departmentId, error);
    }
  }, [
    categories,
    units,
    inventoryItems,
  ]);

  // Enhanced department switching with complete data refresh
  const switchDepartment = useCallback(async (departmentId: string) => {
    if (departmentId === selectedDepartmentId) {
      return; // No change needed
    }

    try {
      // Update the selected department
      setSelectedDepartmentId(departmentId);
      
      // Refresh all dependent data
      await refreshAllData(departmentId);
      
      // Update previous department reference
      previousDepartmentId.current = selectedDepartmentId;
      
    } catch (error) {
      console.error('Error switching department:', error);
      // Revert to previous department on error
      setSelectedDepartmentId(previousDepartmentId.current);
    }
  }, [selectedDepartmentId, setSelectedDepartmentId, refreshAllData]);

  // Detect department changes and refresh data
  useEffect(() => {
    if (selectedDepartmentId && selectedDepartmentId !== previousDepartmentId.current) {
      refreshAllData(selectedDepartmentId);
      previousDepartmentId.current = selectedDepartmentId;
    }
  }, [selectedDepartmentId, refreshAllData]);

  // Get department data status
  const getDepartmentDataStatus = useCallback((departmentId: string) => {
    const department = allDepartments.find(d => d.id === departmentId);
    if (!department) return { hasData: false, items: 0, categories: 0, units: 0 };

    // In our mock setup:
    // Kitchen department (id: '2') has data
    // Bar and Smoke departments are empty
    const hasData = departmentId === '2'; // Kitchen department
    
    return {
      hasData,
      items: hasData ? 4 : 0, // 4 inventory items for Kitchen
      categories: hasData ? 4 : 0, // 4 categories for Kitchen
      units: hasData ? 4 : 0, // 4 units for Kitchen
      description: hasData ? 'Has operational data' : 'No data available',
    };
  }, [allDepartments]);

  // Get current department data status
  const currentDepartmentStatus = selectedDepartmentId ? getDepartmentDataStatus(selectedDepartmentId) : null;

  // Check if any data is loading
  const isAnyDataLoading = 
    departmentsLoading ||
    categories.loading ||
    units.loading ||
    inventoryItems.loading;

  // Get data counts for current department
  const getDataCounts = useCallback(() => {
    if (!selectedDepartmentId) return null;

    return {
      categories: categories.allCategories.length,
      units: units.allUnits.length,
      inventoryItems: inventoryItems.allInventoryItems.length,
    };
  }, [
    selectedDepartmentId,
    categories.allCategories.length,
    units.allUnits.length,
    inventoryItems.allInventoryItems.length,
  ]);

  const dataCounts = getDataCounts();

  // Get departments by branch
  const getDepartmentsByBranch = useCallback((branchId: string) => {
    return allDepartments.filter(dept => dept.branch_id === branchId);
  }, [allDepartments]);

  // Get current branch departments
  const currentBranchDepartments = currentBranchId ? getDepartmentsByBranch(currentBranchId) : [];

  return {
    // Department selection
    selectedDepartmentId,
    selectedDepartment,
    allDepartments,
    currentBranchDepartments,
    switchDepartment,
    isDepartmentSelected,
    
    // Data status
    currentDepartmentStatus,
    dataCounts,
    isAnyDataLoading,
    
    // Data refresh
    refreshAllData: () => selectedDepartmentId ? refreshAllData(selectedDepartmentId) : Promise.resolve(),
    
    // Department utilities
    getDepartmentDataStatus,
    getDepartmentsByBranch,
    
    // Branch integration
    currentBranchId,
    
    // Dependent data access (for convenience)
    categories: categories.allCategories,
    units: units.allUnits,
    inventoryItems: inventoryItems.allInventoryItems,
  };
}
