'use client';

import * as React from 'react';
import { Unit, InventoryItemCategory, Supplier, InventoryItem } from '@/lib/types';
import { mockUnits, mockCategories, mockSuppliers, mockInventoryItems } from '@/lib/mock-data';

interface InventoryContextType {
  // Data
  units: Unit[];
  categories: InventoryItemCategory[];
  suppliers: Supplier[];
  inventoryItems: InventoryItem[];
  
  // Loading states
  loading: {
    units: boolean;
    categories: boolean;
    suppliers: boolean;
    inventoryItems: boolean;
  };
  
  // Actions
  refreshUnits: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshSuppliers: () => Promise<void>;
  refreshInventoryItems: () => Promise<void>;
  refreshAll: () => Promise<void>;
  
  // Getters
  getUnitById: (id: string) => Unit | undefined;
  getCategoryById: (id: string) => InventoryItemCategory | undefined;
  getSupplierById: (id: string) => Supplier | undefined;
  getInventoryItemById: (id: string) => InventoryItem | undefined;
}

const InventoryContext = React.createContext<InventoryContextType | undefined>(undefined);

interface InventoryProviderProps {
  children: React.ReactNode;
}

export function InventoryProvider({ children }: InventoryProviderProps) {
  // State
  const [units, setUnits] = React.useState<Unit[]>(mockUnits);
  const [categories, setCategories] = React.useState<InventoryItemCategory[]>(mockCategories);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>(mockSuppliers);
  const [inventoryItems, setInventoryItems] = React.useState<InventoryItem[]>(mockInventoryItems);
  
  const [loading, setLoading] = React.useState({
    units: false,
    categories: false,
    suppliers: false,
    inventoryItems: false,
  });

  // Simulate API delay
  const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

  // Refresh functions
  const refreshUnits = React.useCallback(async () => {
    setLoading(prev => ({ ...prev, units: true }));
    try {
      await simulateDelay();
      setUnits(mockUnits);
    } finally {
      setLoading(prev => ({ ...prev, units: false }));
    }
  }, []);

  const refreshCategories = React.useCallback(async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    try {
      await simulateDelay();
      setCategories(mockCategories);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  const refreshSuppliers = React.useCallback(async () => {
    setLoading(prev => ({ ...prev, suppliers: true }));
    try {
      await simulateDelay();
      setSuppliers(mockSuppliers);
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }));
    }
  }, []);

  const refreshInventoryItems = React.useCallback(async () => {
    setLoading(prev => ({ ...prev, inventoryItems: true }));
    try {
      await simulateDelay();
      setInventoryItems(mockInventoryItems);
    } finally {
      setLoading(prev => ({ ...prev, inventoryItems: false }));
    }
  }, []);

  const refreshAll = React.useCallback(async () => {
    await Promise.all([
      refreshUnits(),
      refreshCategories(),
      refreshSuppliers(),
      refreshInventoryItems(),
    ]);
  }, [refreshUnits, refreshCategories, refreshSuppliers, refreshInventoryItems]);

  // Getter functions
  const getUnitById = React.useCallback((id: string) => {
    return units.find(unit => unit.id === id);
  }, [units]);

  const getCategoryById = React.useCallback((id: string) => {
    return categories.find(category => category.id === id);
  }, [categories]);

  const getSupplierById = React.useCallback((id: string) => {
    return suppliers.find(supplier => supplier.id === id);
  }, [suppliers]);

  const getInventoryItemById = React.useCallback((id: string) => {
    return inventoryItems.find(item => item.id === id);
  }, [inventoryItems]);

  // Context value
  const value = React.useMemo((): InventoryContextType => ({
    // Data
    units,
    categories,
    suppliers,
    inventoryItems,
    
    // Loading states
    loading,
    
    // Actions
    refreshUnits,
    refreshCategories,
    refreshSuppliers,
    refreshInventoryItems,
    refreshAll,
    
    // Getters
    getUnitById,
    getCategoryById,
    getSupplierById,
    getInventoryItemById,
  }), [
    units,
    categories,
    suppliers,
    inventoryItems,
    loading,
    refreshUnits,
    refreshCategories,
    refreshSuppliers,
    refreshInventoryItems,
    refreshAll,
    getUnitById,
    getCategoryById,
    getSupplierById,
    getInventoryItemById,
  ]);

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

// Hook to use the inventory context
export function useInventoryContext() {
  const context = React.useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventoryContext must be used within an InventoryProvider');
  }
  return context;
}

// Optional: Individual hooks for specific data
export function useUnits() {
  const { units, loading, refreshUnits, getUnitById } = useInventoryContext();
  return { units, loading: loading.units, refreshUnits, getUnitById };
}

export function useCategories() {
  const { categories, loading, refreshCategories, getCategoryById } = useInventoryContext();
  return { categories, loading: loading.categories, refreshCategories, getCategoryById };
}

export function useSuppliersContext() {
  const { suppliers, loading, refreshSuppliers, getSupplierById } = useInventoryContext();
  return { suppliers, loading: loading.suppliers, refreshSuppliers, getSupplierById };
}

export function useInventoryItemsContext() {
  const { inventoryItems, loading, refreshInventoryItems, getInventoryItemById } = useInventoryContext();
  return { inventoryItems, loading: loading.inventoryItems, refreshInventoryItems, getInventoryItemById };
}
