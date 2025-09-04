'use client';

import * as React from 'react';
import { Department, TableColumn } from '@/lib/types';
import { DataTable } from './data-table';
import { formatDateTime } from '@/lib/utils';
// import { truncateText } from '@/lib/utils'; // Temporarily unused - for description column

interface DepartmentsTableProps {
  departments: Department[];
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
  onEdit?: (department: Department) => void;
  onDelete?: (department: Department) => void;
  loading?: boolean;
  className?: string;
  rowClassName?: string;
}

const DepartmentsTable = React.forwardRef<HTMLDivElement, DepartmentsTableProps>(
  ({
    departments,
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
    const columns: TableColumn<Department>[] = [
      {
        key: 'name',
        label: 'Department Name',
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
          data={departments}
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
          emptyMessage="No departments found. Create your first department to organize inventory items."
        />
      </div>
    );
  }
);

DepartmentsTable.displayName = 'DepartmentsTable';

export { DepartmentsTable };
