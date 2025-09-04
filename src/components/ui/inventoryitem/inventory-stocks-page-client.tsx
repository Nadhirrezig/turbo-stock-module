'use client';

import * as React from 'react';
import { StockEntryFormData } from '@/lib/schemas';
import { useInventoryStock } from '@/hooks/use-inventory-stock';
import { PageHeader } from '@/components/shared/page-header';
import { StockTable } from '@/components/tables/stock-table';
import { StockEntryForm } from '@/components/forms/stock-entry-form';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, Plus, Package, AlertTriangle, XCircle, DollarSign } from 'lucide-react';

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
        title="Inventory Stock Management"
        description="Monitor current stock levels and manage inventory transactions across all departments."
        searchPlaceholder="Search inventory items..."
        searchValue={filters.search || ''}
        onSearchChange={handleSearchChange}
        actionLabel={
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Stock Entry</span>
          </div>
        }
        onActionClick={handleAddStockEntry}
        actionLoading={formLoading}
        actionButtonProps={{
          variant: "default",
          className: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md"
        }}
        icon={<BarChart3 className="w-6 h-6 text-primary" />}
      />

      {/* Statistics Cards */}
      <div className="px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-card-foreground">{stockStats.totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">{stockStats.lowStockItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-destructive">{stockStats.outOfStockItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
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
