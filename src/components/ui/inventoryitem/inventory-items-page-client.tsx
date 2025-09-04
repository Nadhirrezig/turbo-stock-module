'use client';

import * as React from 'react';
import { InventoryItem } from '@/lib/types';
import { InventoryItemFormData, DepartmentFormData } from '@/lib/schemas';
import { useInventoryItems } from '@/hooks/use-inventory-items';
import { useDepartments } from '@/hooks/use-departments';
import { PageHeader } from '@/components/shared/page-header';
import { InventoryItemsTable } from '@/components/tables/inventory-items-table';
import { InventoryItemForm } from '@/components/forms/inventory-item-form';
import { DepartmentForm } from '@/components/forms/department-form';
import { ConfirmationDialogComponent } from '@/components/modals/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

export function InventoryItemsPageClient() {
  const {
    inventoryItems,
    pagination,
    loading,
    filters,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateFilters,
  } = useInventoryItems();

  const {
    createDepartment,
  } = useDepartments();

  // Form state
  const [showForm, setShowForm] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<InventoryItem | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);

  // Department form state
  const [showDepartmentForm, setShowDepartmentForm] = React.useState(false);
  const [departmentFormLoading, setDepartmentFormLoading] = React.useState(false);

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<InventoryItem | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

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

  // Handle add item
  const handleAddItem = React.useCallback(() => {
    setEditingItem(null);
    setShowForm(true);
  }, []);

  // Handle add department
  const handleAddDepartment = React.useCallback(() => {
    setShowDepartmentForm(true);
  }, []);

  // Handle edit item
  const handleEditItem = React.useCallback((item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  }, []);

  // Handle delete item
  const handleDeleteItem = React.useCallback((item: InventoryItem) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  }, []);

  // Handle form submit
  const handleFormSubmit = React.useCallback(async (data: InventoryItemFormData) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        await updateInventoryItem(editingItem.id, data);
      } else {
        await createInventoryItem(data);
      }
    } finally {
      setFormLoading(false);
    }
  }, [editingItem, updateInventoryItem, createInventoryItem]);

  // Handle department form submit
  const handleDepartmentFormSubmit = React.useCallback(async (data: DepartmentFormData) => {
    setDepartmentFormLoading(true);
    try {
      await createDepartment(data);
    } finally {
      setDepartmentFormLoading(false);
    }
  }, [createDepartment]);

  // Handle delete confirmation
  const handleDeleteConfirm = React.useCallback(async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteInventoryItem(itemToDelete.id);
      setShowDeleteDialog(false);
      setItemToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }, [itemToDelete, deleteInventoryItem]);

  // Handle delete cancel
  const handleDeleteCancel = React.useCallback(() => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Inventory Items"
        description="Manage your inventory items with categories and units"
        searchPlaceholder="Search inventory items..."
        searchValue={filters.search || ''}
        onSearchChange={handleSearchChange}
        actionLabel="Add Item"
        onActionClick={handleAddItem}
        actionLoading={formLoading}
      />

      {/* Department Management Section */}
      <div className="px-4 sm:px-6">
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Department Management</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create departments to organize your inventory by operational areas
              </p>
            </div>
            <Button
              onClick={handleAddDepartment}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Building2 className="h-4 w-4" />
              <span>Create Department</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="px-4 sm:px-6">
        <InventoryItemsTable
          inventoryItems={inventoryItems}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortField={filters.sort_field}
          sortDirection={filters.sort_direction}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          loading={loading}
        />
      </div>

      {/* Inventory Item Form Modal */}
      <InventoryItemForm
        open={showForm}
        onOpenChange={setShowForm}
        inventoryItem={editingItem}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {/* Department Form Modal */}
      <DepartmentForm
        open={showDepartmentForm}
        onOpenChange={setShowDepartmentForm}
        onSubmit={handleDepartmentFormSubmit}
        loading={departmentFormLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialogComponent
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Inventory Item"
        description={
          itemToDelete
            ? `Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone and may affect stock records and movements.`
            : 'Are you sure you want to delete this inventory item?'
        }
        confirmLabel="Delete Item"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        variant="destructive"
      />
    </div>
  );
}
