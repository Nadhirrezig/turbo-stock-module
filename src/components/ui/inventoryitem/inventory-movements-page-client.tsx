'use client';

import * as React from 'react';
import { useInventoryMovements } from '@/hooks/use-inventory-movements';
import { useCategories } from '@/hooks/use-categories';
import { InventoryMovement, SearchableSelectOption, InventoryItemCategory } from '@/lib/types';

// Custom type for movement edit form
type MovementEditFormData = {
  inventory_item_id: string;
  transaction_type: 'IN' | 'OUT' | 'WASTE' | 'TRANSFER';
  quantity: number;
  unit_purchase_price?: number;
  supplier_id?: string;
  destination_branch_id?: string;
  waste_reason?: string;
  notes?: string;
  expiration_date?: string;
};

// Adapter function to convert category to SearchableSelectOption
const categoryToOption = (category: InventoryItemCategory): SearchableSelectOption => ({
  id: category.id,
  name: category.name,
  created_at: category.created_at,
  updated_at: category.updated_at,
});
import { PageHeader } from '@/components/shared/page-header';
import { MovementsTable } from '@/components/tables/movements-table';
import { SearchableSelect } from '@/components/shared/searchable-select';
import { MovementViewDrawer } from '@/components/forms/movement-view-drawer';
import { MovementEditForm } from '@/components/forms/movement-edit-form';
import { formatNumber } from '@/lib/utils';
import { ArrowRightLeft } from 'lucide-react';

export function InventoryMovementsPageClient() {
  const {
    inventoryMovements,
    pagination,
    loading,
    filters,
    movementStats,
    updateFilters,
    updateMovement,
  } = useInventoryMovements();

  const { allCategories } = useCategories({ initialFilters: { page: 1, per_page: 1000 } });

  // State for view and edit drawers
  const [viewDrawerOpen, setViewDrawerOpen] = React.useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = React.useState(false);
  const [selectedMovement, setSelectedMovement] = React.useState<InventoryMovement | null>(null);
  const [editLoading, setEditLoading] = React.useState(false);

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

  // Handle transaction type filter
  const handleTransactionTypeChange = React.useCallback((value: string) => {
    updateFilters({ transaction_type: value, page: 1 });
  }, [updateFilters]);

  // Handle category filter
  const handleCategoryChange = React.useCallback((value: string) => {
    updateFilters({ category: value, page: 1 });
  }, [updateFilters]);

  // Handle date range filter
  const handleDateRangeChange = React.useCallback((value: string) => {
    updateFilters({ date_range: value, page: 1 });
  }, [updateFilters]);

  // Handle view movement
  const handleViewMovement = React.useCallback((movement: InventoryMovement) => {
    setSelectedMovement(movement);
    setViewDrawerOpen(true);
  }, []);

  // Handle edit movement
  const handleEditMovement = React.useCallback((movement: InventoryMovement) => {
    setSelectedMovement(movement);
    setEditDrawerOpen(true);
  }, []);

  // Handle edit form submission
  const handleEditSubmit = React.useCallback(async (data: MovementEditFormData) => {
    if (!selectedMovement) return;

    setEditLoading(true);
    try {
      await updateMovement(selectedMovement.id, data);
      setEditDrawerOpen(false);
      setSelectedMovement(null);
    } catch (error) {
      console.error('Failed to update movement:', error);
      throw error;
    } finally {
      setEditLoading(false);
    }
  }, [selectedMovement, updateMovement]);

  const transactionTypeOptions = [
    { id: '', name: 'All Types', description: 'Show all transaction types' },
    { id: 'IN', name: 'Stock In', description: 'Inventory received' },
    { id: 'OUT', name: 'Stock Out', description: 'Inventory used' },
    { id: 'WASTE', name: 'Waste', description: 'Inventory disposed' },
    { id: 'TRANSFER', name: 'Transfer', description: 'Inventory moved' },
  ];

  const dateRangeOptions = [
    { id: '', name: 'All Time', description: 'Show all movements' },
    { id: 'today', name: 'Today', description: 'Movements from today' },
    { id: 'week', name: 'This Week', description: 'Movements from last 7 days' },
    { id: 'month', name: 'This Month', description: 'Movements from last 30 days' },
  ];

  const categoryOptions: SearchableSelectOption[] = React.useMemo(() => [
    { id: '', name: 'All Categories', description: 'Show all categories' },
    ...allCategories.map(categoryToOption),
  ], [allCategories]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Inventory Movements"
        description="Track all inventory transactions and stock changes across your departments."
        searchPlaceholder="Search movements..."
        searchValue={filters.search || ''}
        onSearchChange={handleSearchChange}
        showAction={false}
        icon={<ArrowRightLeft className="w-6 h-6 text-primary" />}
      />

      {/* Statistics Cards */}
      <div className="px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Movements</p>
                <p className="text-2xl font-bold text-card-foreground">{movementStats.totalMovements}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Stock In</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(movementStats.totalStockIn)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Stock Out</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(movementStats.totalStockOut)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Waste</p>
                <p className="text-2xl font-bold text-destructive">{formatNumber(movementStats.totalWaste)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Transfers</p>
                <p className="text-2xl font-bold text-yellow-600">{formatNumber(movementStats.totalTransfers)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Transaction Type
              </label>
              <SearchableSelect
                options={transactionTypeOptions}
                value={filters.transaction_type || ''}
                onValueChange={handleTransactionTypeChange}
                placeholder="All types..."
                displayField="name"
                subField="description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <SearchableSelect
                options={categoryOptions}
                value={filters.category || ''}
                onValueChange={handleCategoryChange}
                placeholder="All categories..."
                displayField="name"
                subField="description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date Range
              </label>
              <SearchableSelect
                options={dateRangeOptions}
                value={filters.date_range || ''}
                onValueChange={handleDateRangeChange}
                placeholder="All time..."
                displayField="name"
                subField="description"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="px-4 sm:px-6">
        <MovementsTable
          inventoryMovements={inventoryMovements}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortField={filters.sort_field}
          sortDirection={filters.sort_direction}
          onView={handleViewMovement}
          onEdit={handleEditMovement}
          loading={loading}
          className="rounded-xl border border-border shadow-sm overflow-hidden"
          rowClassName="odd:bg-muted/40 hover:bg-accent hover:text-accent-foreground transition-colors"
        />
      </div>

      {/* View Movement Drawer */}
      <MovementViewDrawer
        open={viewDrawerOpen}
        onOpenChange={setViewDrawerOpen}
        movement={selectedMovement}
        onEdit={(movement) => {
          setViewDrawerOpen(false);
          handleEditMovement(movement);
        }}
      />

      {/* Edit Movement Form */}
      <MovementEditForm
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        movement={selectedMovement}
        onSubmit={handleEditSubmit}
        loading={editLoading}
      />
    </div>
  );
}
