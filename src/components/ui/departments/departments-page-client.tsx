'use client';

import * as React from 'react';
import { Department } from '@/lib/types';
import { DepartmentFormData } from '@/lib/schemas';
import { useDepartments } from '@/hooks/use-departments';
import { PageHeader } from '@/components/shared/page-header';
import { DepartmentsTable } from '@/components/tables/departmeent-table';
import { DepartmentForm } from '@/components/forms/department-form';
import { ConfirmationDialogComponent } from '@/components/modals/confirmation-dialog';
import { Building2, Plus } from 'lucide-react';

export function DepartmentsPageClient() {
  const {
    departments,
    pagination,
    loading,
    filters,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    updateFilters,
  } = useDepartments();

  const [showForm, setShowForm] = React.useState(false);
  const [editingDepartment, setEditingDepartment] = React.useState<Department | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [departmentToDelete, setDepartmentToDelete] = React.useState<Department | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const handleSearchChange = React.useCallback((search: string) => {
    updateFilters({ search, page: 1 });
  }, [updateFilters]);

  const handlePageChange = React.useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  const handleSort = React.useCallback((field: string, direction: 'asc' | 'desc') => {
    updateFilters({ sort_field: field, sort_direction: direction });
  }, [updateFilters]);

  const handleAddDepartment = React.useCallback(() => {
    setEditingDepartment(null);
    setShowForm(true);
  }, []);

  const handleEditDepartment = React.useCallback((department: Department) => {
    setEditingDepartment(department);
    setShowForm(true);
  }, []);

  const handleDeleteDepartment = React.useCallback((department: Department) => {
    setDepartmentToDelete(department);
    setShowDeleteDialog(true);
  }, []);

  const handleFormSubmit = React.useCallback(async (data: DepartmentFormData) => {
    setFormLoading(true);
    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, data);
      } else {
        await createDepartment(data);
      }
    } finally {
      setFormLoading(false);
    }
  }, [editingDepartment, updateDepartment, createDepartment]);

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!departmentToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteDepartment(departmentToDelete.id);
      setShowDeleteDialog(false);
      setDepartmentToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }, [departmentToDelete, deleteDepartment]);

  const handleDeleteCancel = React.useCallback(() => {
    setShowDeleteDialog(false);
    setDepartmentToDelete(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Item Departments"
        description="Organize your inventory items into departments for better management."
        searchPlaceholder="Search departments..."
        searchValue={filters.search || ''}
        onSearchChange={handleSearchChange}
        actionLabel={
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </div>
        }
        onActionClick={handleAddDepartment}
        actionLoading={formLoading}
        actionButtonProps={{
          variant: "default",
          className: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md"
        }}
        icon={<Building2 className="w-6 h-6 text-primary" />}
      />

      {/* Departments Table */}
      <div className="px-4 sm:px-6">
        <DepartmentsTable
          departments={departments}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortField={filters.sort_field}
          sortDirection={filters.sort_direction}
          onEdit={handleEditDepartment}
          onDelete={handleDeleteDepartment}
          loading={loading}
          className="rounded-xl border border-border shadow-sm overflow-hidden"
          rowClassName="odd:bg-muted/40 hover:bg-accent hover:text-accent-foreground transition-colors"
        />
      </div>

      {/* Department Form Modal */}
      <DepartmentForm
        open={showForm}
        onOpenChange={setShowForm}
        department={editingDepartment}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialogComponent
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Department"
        description={
          departmentToDelete
            ? <>Are you sure you want to delete <span className="text-primary font-semibold">&ldquo;{departmentToDelete.name}&rdquo;</span>? This action cannot be undone and may affect inventory items in this department.</>
            : 'Are you sure you want to delete this department?'
        }
        confirmLabel="Delete Department"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        variant="destructive"
      />
    </div>
  );
}
