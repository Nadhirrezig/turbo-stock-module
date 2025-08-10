'use client';

import * as React from 'react';
import { StockEntryFormData } from '@/lib/schemas';
import { useInventoryStock } from '@/hooks/use-inventory-stock';
import { PageHeader } from '@/components/shared/page-header';
import { StockTable } from '@/components/tables/stock-table';
import { StockEntryForm } from '@/components/forms/stock-entry-form';
import { formatCurrency } from '@/lib/utils';

export function InventoryStocksPageClient() {
  const {
    inventoryStock,
    pagination,
    loading,
    filters,
    stockStats,
    addStockEntry,
    updateFilters,
  } = useInventoryStock();

  // Form state
  const [showForm, setShowForm] = React.useState(false);
  const [formLoading, setFormLoading] = React.useState(false);

  // Handle search
  const handleSearchChange = React.useCallback((search: string) => {
    updateFilters({ search, page: 1 });
  }, [updateFilters]);

  // Handle pagination
  const handlePageChange = React.useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  // Handle sorting
  const handleSort = React.useCallback((field: string, direction: 'asc' | 'desc') => {
    updateFilters({ sort_field: field, sort_direction: direction });
  }, [updateFilters]);

  // Handle add stock entry
  const handleAddStockEntry = React.useCallback(() => {
    setShowForm(true);
  }, []);

  // Handle form submit
  const handleFormSubmit = React.useCallback(async (data: StockEntryFormData) => {
    setFormLoading(true);
    try {
      await addStockEntry(data);
    } finally {
      setFormLoading(false);
    }
  }, [addStockEntry]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Inventory Stock"
        description="Monitor current stock levels and manage inventory transactions"
        searchPlaceholder="Search inventory items..."
        searchValue={filters.search || ''}
        onSearchChange={handleSearchChange}
        actionLabel="Add Stock Entry"
        onActionClick={handleAddStockEntry}
        actionLoading={formLoading}
      />

      {/* Statistics Cards */}
      <div className="px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-card-foreground">{stockStats.totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">{stockStats.lowStockItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-destructive">{stockStats.outOfStockItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-card-foreground">{formatCurrency(stockStats.totalValue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="px-4 sm:px-6">
        <StockTable
          inventoryStock={inventoryStock}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortField={filters.sort_field}
          sortDirection={filters.sort_direction}
          loading={loading}
        />
      </div>

      {/* Stock Entry Form Modal */}
      <StockEntryForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
}
