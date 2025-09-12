'use client';

import * as React from 'react';
import { Branch } from '@/lib/types';
import { BranchFormData } from '@/lib/schemas';
import { useBranches } from '@/hooks/use-branches';
import { PageHeader } from '@/components/shared/page-header';
import { BranchesTable } from '@/components/tables/branches-table';
import { BranchForm } from '@/components/forms/branch-form';
import { ConfirmationDialogComponent } from '@/components/modals/confirmation-dialog';
import { Building2, Plus } from 'lucide-react';

export function BranchesPageClient() {
  const {
    paginatedBranches,
    loading,
    filters,
    createBranch,
    updateBranch,
    deleteBranch,
    updateFilters,
  } = useBranches();

  const [showForm, setShowForm] = React.useState(false);
  const [editingBranch, setEditingBranch] = React.useState<Branch | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [branchToDelete, setBranchToDelete] = React.useState<Branch | null>(null);
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
    setEditingBranch(null);
    setShowForm(true);
  }, []);

  const handleEditBranch = React.useCallback((branch: Branch) => {
    setEditingBranch(branch);
    setShowForm(true);
  }, []);

  const handleDeleteBranch = React.useCallback((branch: Branch) => {
    setBranchToDelete(branch);
    setShowDeleteDialog(true);
  }, []);

    const handleFormSubmit = React.useCallback(async (data: BranchFormData) => {
    setFormLoading(true);
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.id, data);
      } else {
        await createBranch(data);
      }
    } finally {
      setFormLoading(false);
    }
  }, [editingBranch, updateBranch, createBranch]);

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!branchToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteBranch(branchToDelete.id);
      setShowDeleteDialog(false);
      setBranchToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }, [branchToDelete, deleteBranch]);

  const handleDeleteCancel = React.useCallback(() => {
    setShowDeleteDialog(false);
    setBranchToDelete(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Item Branches"
        description="Organize your inventory items into departments for better management."
        searchPlaceholder="Search branches..."
        searchValue={filters.search || ''}
        onSearchChange={handleSearchChange}
        actionLabel={
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Branch</span>
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

      {/* Branches Table */}
      <div className="px-4 sm:px-6">
        <BranchesTable
          branches={paginatedBranches.data}
          pagination={paginatedBranches.pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortField={filters.sort_field}
          sortDirection={filters.sort_direction}
          onEdit={handleEditBranch}
          onDelete={handleDeleteBranch}
          loading={loading}
          className="rounded-xl border border-border shadow-sm overflow-hidden"
          rowClassName="odd:bg-muted/40 hover:bg-accent hover:text-accent-foreground transition-colors"
        />
      </div>
      <BranchForm
        open={showForm}
        onOpenChange={setShowForm}
        branch={editingBranch}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
      <ConfirmationDialogComponent
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Branch"
        description={
          branchToDelete
            ? <>Are you sure you want to delete <span className="text-primary font-semibold">&ldquo;{branchToDelete.name}&rdquo;</span>? This action cannot be undone and may affect inventory items in this branch.</>
            : 'Are you sure you want to delete this branch?'
        }
        confirmLabel="Delete Branch"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        variant="destructive"
      />
    </div>
  );
}
