'use client';

import * as React from 'react';
import { Branch, TableColumn } from '@/lib/types';
import { DataTable } from './data-table';
import { formatDateTime } from '@/lib/utils';

interface BranchesTableProps {
  branches: Branch[];
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
  onEdit?: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
  loading?: boolean;
  className?: string;
  rowClassName?: string;
}

const BranchesTable = React.forwardRef<HTMLDivElement, BranchesTableProps>(
  ({
    branches,
    pagination,
    onPageChange,
    onSort,
    sortField,
    sortDirection,
    onEdit,
    onDelete,
    loading = false,
    className,
    rowClassName,
  }, ref) => {
    const columns: TableColumn<Branch>[] = [
      {
        key: 'name',
        label: 'Branch Name',
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
          data={branches}
          columns={columns}
          pagination={pagination}
          onPageChange={onPageChange}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
          rowClassName={rowClassName}
          emptyMessage="No branches found. Create your first branch to organize inventory items."
        />
      </div>
    );
  }
);

BranchesTable.displayName = 'BranchesTable';

export { BranchesTable };
