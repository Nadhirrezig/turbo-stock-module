'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useBranchContext } from '@/contexts/branch-context';
import { useDepartments } from '@/hooks/use-departments';
import { useCategories } from '@/hooks/use-categories';
import { useUnits } from '@/hooks/use-units';
import { useInventoryItems } from '@/hooks/use-inventory-items';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useInventoryStock } from '@/hooks/use-inventory-stock';
import { useInventoryMovements } from '@/hooks/use-inventory-movements';

/**
 * Hook for managing branch selection and ensuring complete data context shift
 * This hook coordinates all dependent data when switching branches
 */
export function useBranchSelection() {
  const { 
    selectedBranchId, 
    selectedBranch, 
    setSelectedBranchId, 
    allBranches, 
    loading: branchesLoading,
    isBranchSelected 
  } = useBranchContext();

  // Track previous branch to detect changes
  const previousBranchId = useRef<string | null>(null);
  
  // All dependent hooks that need to be refreshed when branch changes
  const departments = useDepartments();
  const categories = useCategories();
  const units = useUnits();
  const inventoryItems = useInventoryItems();
  const suppliers = useSuppliers();
  const inventoryStock = useInventoryStock();
  const inventoryMovements = useInventoryMovements();

  // Branch-specific filters are handled by individual hooks

  // Refresh all dependent data when branch changes
  const refreshAllData = useCallback(async (branchId: string) => {
    try {
      // Refresh all dependent data in parallel
      await Promise.all([
        departments.refresh(),
        categories.refresh(),
        units.refresh(),
        inventoryItems.refresh(),
        suppliers.refresh(),
        inventoryStock.refresh(),
        inventoryMovements.refresh(),
      ]);
    } catch (error) {
      console.error('Error refreshing data for branch:', branchId, error);
    }
  }, [
    departments,
    categories,
    units,
    inventoryItems,
    suppliers,
    inventoryStock,
    inventoryMovements,
  ]);

  // Enhanced branch switching with complete data refresh
  const switchBranch = useCallback(async (branchId: string) => {
    if (branchId === selectedBranchId) {
      return; // No change needed
    }

    try {
      // Update the selected branch
      setSelectedBranchId(branchId);
      
      // Refresh all dependent data
      await refreshAllData(branchId);
      
      // Update previous branch reference
      previousBranchId.current = selectedBranchId;
      
    } catch (error) {
      console.error('Error switching branch:', error);
      // Revert to previous branch on error
      setSelectedBranchId(previousBranchId.current);
    }
  }, [selectedBranchId, setSelectedBranchId, refreshAllData]);

  // Detect branch changes and refresh data
  useEffect(() => {
    if (selectedBranchId && selectedBranchId !== previousBranchId.current) {
      refreshAllData(selectedBranchId);
      previousBranchId.current = selectedBranchId;
    }
  }, [selectedBranchId, refreshAllData]);

  // Get branch data status
  const getBranchDataStatus = useCallback((branchId: string) => {
    const branch = allBranches.find(b => b.id === branchId);
    if (!branch) return { hasData: false, departments: 0, items: 0 };

    // In our mock setup:
    // Branch 1 (branch-1) has data
    // Branch 2 and 3 are empty
    const hasData = branchId === 'branch-1';
    
    return {
      hasData,
      departments: hasData ? 3 : 0, // Kitchen, Bar, Smoke for branch-1
      items: hasData ? 4 : 0, // 4 inventory items for branch-1
      description: hasData ? 'Has operational data' : 'No data available',
    };
  }, [allBranches]);

  // Get current branch data status
  const currentBranchStatus = selectedBranchId ? getBranchDataStatus(selectedBranchId) : null;

  // Check if any data is loading
  const isAnyDataLoading = 
    branchesLoading ||
    departments.loading ||
    categories.loading ||
    units.loading ||
    inventoryItems.loading ||
    suppliers.loading ||
    inventoryStock.loading ||
    inventoryMovements.loading;

  // Get data counts for current branch
  const getDataCounts = useCallback(() => {
    if (!selectedBranchId) return null;

    return {
      departments: departments.allDepartments.length,
      categories: categories.allCategories.length,
      units: units.allUnits.length,
      inventoryItems: inventoryItems.allInventoryItems.length,
      suppliers: suppliers.allSuppliers.length,
      stockEntries: inventoryStock.allInventoryStock.length,
      movements: inventoryMovements.allInventoryMovements.length,
    };
  }, [
    selectedBranchId,
    departments.allDepartments.length,
    categories.allCategories.length,
    units.allUnits.length,
    inventoryItems.allInventoryItems.length,
    suppliers.allSuppliers.length,
    inventoryStock.allInventoryStock.length,
    inventoryMovements.allInventoryMovements.length,
  ]);

  const dataCounts = getDataCounts();

  return {
    // Branch selection
    selectedBranchId,
    selectedBranch,
    allBranches,
    switchBranch,
    isBranchSelected,
    
    // Data status
    currentBranchStatus,
    dataCounts,
    isAnyDataLoading,
    
    // Data refresh
    refreshAllData: () => selectedBranchId ? refreshAllData(selectedBranchId) : Promise.resolve(),
    
    // Branch utilities
    getBranchDataStatus,
    
    // Dependent data access (for convenience)
    departments: departments.allDepartments,
    categories: categories.allCategories,
    units: units.allUnits,
    inventoryItems: inventoryItems.allInventoryItems,
    suppliers: suppliers.allSuppliers,
    inventoryStock: inventoryStock.allInventoryStock,
    inventoryMovements: inventoryMovements.allInventoryMovements,
  };
}
