'use client';

import * as React from 'react';
import { Unit, TableColumn } from '@/lib/types';
import { DataTable } from './data-table';
import { formatDateTime } from '@/lib/utils';

interface UnitsTableProps {
  units: Unit[];
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
  onEdit?: (unit: Unit) => void;
  onDelete?: (unit: Unit) => void;
  loading?: boolean;
  className?: string;
}

const UnitsTable = React.forwardRef<HTMLDivElement, UnitsTableProps>(
  ({
    units,
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
    const columns: TableColumn<Unit>[] = [
      {
        key: 'name',
        label: 'Unit Name',
        sortable: true,
        render: (value: string) => (
          <div className="font-medium text-foreground">
            {value}
          </div>
        ),
      },
      {
        key: 'symbol',
        label: 'Symbol',
        sortable: true,
        render: (value: string) => (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {value}
          </div>
        ),
      },
      {
        key: 'created_at',
        label: 'Created',
        sortable: true,
        render: (value: string) => (
          <div className="text-sm text-muted-foreground">
            {formatDateTime(value)}
          </div>
        ),
      },
      {
        key: 'updated_at',
        label: 'Last Updated',
        sortable: true,
        render: (value: string) => (
          <div className="text-sm text-muted-foreground">
            {formatDateTime(value)}
          </div>
        ),
      },
    ];

    return (
      <div ref={ref} className={className}>
        <DataTable
          data={units}
          columns={columns}
          pagination={pagination}
          onPageChange={onPageChange}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
          emptyMessage="No units found. Create your first unit to get started."
        />
      </div>
    );
  }
);

UnitsTable.displayName = 'UnitsTable';

export { UnitsTable };
