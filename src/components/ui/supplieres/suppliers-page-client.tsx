'use client';

import * as React from 'react';
import { Supplier } from '@/lib/types';
import { SupplierFormData } from '@/lib/schemas';
import { useSuppliers } from '@/hooks/use-suppliers';
import { PageHeader } from '@/components/shared/page-header';
import { SuppliersTable } from '@/components/tables/suppliers-table';
import { SupplierForm } from '@/components/forms/supplier-form';
import { ConfirmationDialogComponent } from '@/components/modals/confirmation-dialog';

export function SuppliersPageClient() {
  const {
    suppliers,
    pagination,
    loading,
    filters,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    updateFilters,
  } = useSuppliers();

  // Form state
  const [showForm, setShowForm] = React.useState(false);
  const [editingSupplier, setEditingSupplier] = React.useState<Supplier | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [supplierToDelete, setSupplierToDelete] = React.useState<Supplier | null>(null);
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

  // Handle add supplier
  const handleAddSupplier = React.useCallback(() => {
    setEditingSupplier(null);
    setShowForm(true);
  }, []);

  // Handle edit supplier
  const handleEditSupplier = React.useCallback((supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  }, []);

  // Handle delete supplier
  const handleDeleteSupplier = React.useCallback((supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteDialog(true);
  }, []);

  // Handle form submit
  const handleFormSubmit = React.useCallback(async (data: SupplierFormData) => {
    setFormLoading(true);
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, data);
      } else {
        await createSupplier(data);
      }
    } finally {
      setFormLoading(false);
    }
  }, [editingSupplier, updateSupplier, createSupplier]);

  // Handle delete confirmation
  const handleDeleteConfirm = React.useCallback(async () => {
    if (!supplierToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteSupplier(supplierToDelete.id);
      setShowDeleteDialog(false);
      setSupplierToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }, [supplierToDelete, deleteSupplier]);

  // Handle delete cancel
  const handleDeleteCancel = React.useCallback(() => {
    setShowDeleteDialog(false);
    setSupplierToDelete(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Suppliers"
        description="Manage your inventory suppliers and their contact information"
        searchPlaceholder="Search suppliers..."
        searchValue={filters.search || ''}
        onSearchChange={handleSearchChange}
        actionLabel="Add Supplier"
        onActionClick={handleAddSupplier}
        actionLoading={formLoading}
      />

      {/* Suppliers Table */}
      <div className="px-4 sm:px-6">
        <SuppliersTable
          suppliers={suppliers}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortField={filters.sort_field}
          sortDirection={filters.sort_direction}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
          loading={loading}
        />
      </div>

      {/* Supplier Form Modal */}
      <SupplierForm
        open={showForm}
        onOpenChange={setShowForm}
        supplier={editingSupplier}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialogComponent
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Supplier"
        description={
          supplierToDelete
            ? `Are you sure you want to delete "${supplierToDelete.name}"? This action cannot be undone and may affect inventory items using this supplier.`
            : 'Are you sure you want to delete this supplier?'
        }
        confirmLabel="Delete Supplier"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        variant="destructive"
      />
    </div>
  );
}
