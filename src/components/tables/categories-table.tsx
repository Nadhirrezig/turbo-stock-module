'use client';

import * as React from 'react';
import { InventoryItemCategory, TableColumn } from '@/lib/types';
import { DataTable } from './data-table';
import { formatDateTime } from '@/lib/utils';
// import { truncateText } from '@/lib/utils'; // Temporarily unused - for description column

interface CategoriesTableProps {
  categories: InventoryItemCategory[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  onPageChange?: (page: number) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onEdit?: (category: InventoryItemCategory) => void;
  onDelete?: (category: InventoryItemCategory) => void;
  loading?: boolean;
  className?: string;
}

const CategoriesTable = React.forwardRef<HTMLDivElement, CategoriesTableProps>(
  ({
    categories,
    pagination,
    onPageChange,
    onSort,
    sortField,
    sortDirection,
    onEdit,
    onDelete,
    loading = false,
    className,
  }, ref) => {
    const columns: TableColumn<InventoryItemCategory>[] = [
      {
        key: 'name',
        label: 'Category Name',
        sortable: true,
        render: (value: unknown) => {
          const name = value as string;
          return (
            <div className="font-medium text-foreground">
              {name}
            </div>
          );
        },
      },
      // Description column temporarily hidden to save UI space
      // {
      //   key: 'description',
      //   label: 'Description',
      //   sortable: false,
      //   render: (value: string | undefined) => (
      //     <div className="text-sm text-muted-foreground">
      //       {value ? truncateText(value, 60) : (
      //         <span className="italic">No description</span>
      //       )}
      //     </div>
      //   ),
      // },
      {
        key: 'created_at',
        label: 'Created',
        sortable: true,
        render: (value: unknown) => {
          const dateString = value as string;
          return (
            <div className="text-sm text-muted-foreground">
              {formatDateTime(dateString)}
            </div>
          );
        },
      },
      {
        key: 'updated_at',
        label: 'Last Updated',
        sortable: true,
        render: (value: unknown) => {
          const dateString = value as string;
          return (
            <div className="text-sm text-muted-foreground">
              {formatDateTime(dateString)}
            </div>
          );
        },
      },
    ];

    return (
      <div ref={ref} className={className}>
        <DataTable
          data={categories}
          columns={columns}
          pagination={pagination}
          onPageChange={onPageChange}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
          emptyMessage="No categories found. Create your first category to organize inventory items."
        />
      </div>
    );
  }
);

CategoriesTable.displayName = 'CategoriesTable';

export { CategoriesTable };
