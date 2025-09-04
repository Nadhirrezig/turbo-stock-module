'use client';

import * as React from 'react';
import { InventoryItemCategory } from '@/lib/types';
import { InventoryItemCategoryFormData } from '@/lib/schemas';
import { useCategories } from '@/hooks/use-categories';
import { PageHeader } from '@/components/shared/page-header';
import { CategoriesTable } from '@/components/tables/categories-table';
import { CategoryForm } from '@/components/forms/category-form';
import { ConfirmationDialogComponent } from '@/components/modals/confirmation-dialog';
import { FolderOpen, Plus } from 'lucide-react';

export function CategoriesPageClient() {
  const {
    categories,
    pagination,
    loading,
    filters,
    createCategory,
    updateCategory,
    deleteCategory,
    updateFilters,
  } = useCategories();

  // Form state
  const [showForm, setShowForm] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<InventoryItemCategory | null>(null);
  const [formLoading, setFormLoading] = React.useState(false);

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<InventoryItemCategory | null>(null);
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

  // Handle add category
  const handleAddCategory = React.useCallback(() => {
    setEditingCategory(null);
    setShowForm(true);
  }, []);

  // Handle edit category
  const handleEditCategory = React.useCallback((category: InventoryItemCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  }, []);

  // Handle delete category
  const handleDeleteCategory = React.useCallback((category: InventoryItemCategory) => {
    setCategoryToDelete(category);
    setShowDeleteDialog(true);
  }, []);

  // Handle form submit
  const handleFormSubmit = React.useCallback(async (data: InventoryItemCategoryFormData) => {
    setFormLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await createCategory(data);
      }
    } finally {
      setFormLoading(false);
    }
  }, [editingCategory, updateCategory, createCategory]);

  // Handle delete confirmation
  const handleDeleteConfirm = React.useCallback(async () => {
    if (!categoryToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteCategory(categoryToDelete.id);
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }, [categoryToDelete, deleteCategory]);

  // Handle delete cancel
  const handleDeleteCancel = React.useCallback(() => {
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Item Categories"
        description="Organize your inventory items into categories for better management and tracking."
        searchPlaceholder="Search categories..."
        searchValue={filters.search || ''}
        onSearchChange={handleSearchChange}
        actionLabel={
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </div>
        }
        onActionClick={handleAddCategory}
        actionLoading={formLoading}
        actionButtonProps={{
          variant: "default",
          className: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md"
        }}
        icon={<FolderOpen className="w-6 h-6 text-primary" />}
      />

      {/* Categories Table */}
      <div className="px-4 sm:px-6">
        <CategoriesTable
          categories={categories}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortField={filters.sort_field}
          sortDirection={filters.sort_direction}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          loading={loading}
          className="rounded-xl border border-border shadow-sm overflow-hidden"
          rowClassName="odd:bg-muted/40 hover:bg-accent hover:text-accent-foreground transition-colors"
        />
      </div>

      {/* Category Form Modal */}
      <CategoryForm
        open={showForm}
        onOpenChange={setShowForm}
        category={editingCategory}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialogComponent
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Category"
        description={
          categoryToDelete
            ? <>Are you sure you want to delete <span className="text-primary font-semibold">&ldquo;{categoryToDelete.name}&rdquo;</span>? This action cannot be undone and may affect inventory items in this category.</>
            : 'Are you sure you want to delete this category?'
        }
        confirmLabel="Delete Category"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        variant="destructive"
      />
    </div>
  );
}
