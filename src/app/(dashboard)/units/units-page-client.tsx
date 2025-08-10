'use client';

import * as React from 'react';
import { Unit } from '@/lib/types';
import { UnitFormData } from '@/lib/schemas';
import { useUnits } from '@/hooks/use-units';
import { PageHeader } from '@/components/shared/page-header';
import { UnitsTable } from '@/components/tables/units-table';
import { UnitForm } from '@/components/forms/unit-form';
import { ConfirmationDialogComponent } from '@/components/modals/confirmation-dialog';

export function UnitsPageClient() {
  const {
    units,
    pagination,
    loading,
    filters,
    createUnit,
    updateUnit,
    deleteUnit,
    updateFilters,
  } = useUnits();

  // Form state
  const [showForm, setShowForm] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState<Unit | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [unitToDelete, setUnitToDelete] = React.useState<Unit | null>(null);
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

  // Handle add unit
  const handleAddUnit = React.useCallback(() => {
    setEditingUnit(null);
    setShowForm(true);
  }, []);

  // Handle edit unit
  const handleEditUnit = React.useCallback((unit: Unit) => {
    setEditingUnit(unit);
    setShowForm(true);
  }, []);

  // Handle delete unit
  const handleDeleteUnit = React.useCallback((unit: Unit) => {
    setUnitToDelete(unit);
    setShowDeleteDialog(true);
  }, []);

  // Handle form submit
  const handleFormSubmit = React.useCallback(async (data: UnitFormData) => {
    setFormLoading(true);
    try {
      if (editingUnit) {
        await updateUnit(editingUnit.id, data);
      } else {
        await createUnit(data);
      }
    } finally {
      setFormLoading(false);
    }
  }, [editingUnit, updateUnit, createUnit]);

  // Handle delete confirmation
  const handleDeleteConfirm = React.useCallback(async () => {
    if (!unitToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteUnit(unitToDelete.id);
      setShowDeleteDialog(false);
      setUnitToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }, [unitToDelete, deleteUnit]);

  // Handle delete cancel
  const handleDeleteCancel = React.useCallback(() => {
    setShowDeleteDialog(false);
    setUnitToDelete(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Units"
        description="Manage measurement units for your inventory items"
        searchPlaceholder="Search units..."
        searchValue={filters.search || ''}
        onSearchChange={handleSearchChange}
        actionLabel="Add Unit"
        onActionClick={handleAddUnit}
        actionLoading={formLoading}
      />

      {/* Units Table */}
      <div className="px-4 sm:px-6">
        <UnitsTable
          units={units}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortField={filters.sort_field}
          sortDirection={filters.sort_direction}
          onEdit={handleEditUnit}
          onDelete={handleDeleteUnit}
          loading={loading}
        />
      </div>

      {/* Unit Form Modal */}
      <UnitForm
        open={showForm}
        onOpenChange={setShowForm}
        unit={editingUnit}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialogComponent
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Unit"
        description={
          unitToDelete
            ? `Are you sure you want to delete "${unitToDelete.name}"? This action cannot be undone and may affect inventory items using this unit.`
            : 'Are you sure you want to delete this unit?'
        }
        confirmLabel="Delete Unit"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        variant="destructive"
      />
    </div>
  );
}
