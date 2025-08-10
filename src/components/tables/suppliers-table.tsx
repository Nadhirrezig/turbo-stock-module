'use client';

import * as React from 'react';
import { Supplier, TableColumn } from '@/lib/types';
import { DataTable } from './data-table';
import { formatDateTime, truncateText } from '@/lib/utils';
import { Mail, Phone, MapPin } from 'lucide-react';

interface SuppliersTableProps {
  suppliers: Supplier[];
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
  onEdit?: (supplier: Supplier) => void;
  onDelete?: (supplier: Supplier) => void;
  loading?: boolean;
  className?: string;
}

const SuppliersTable = React.forwardRef<HTMLDivElement, SuppliersTableProps>(
  ({
    suppliers,
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
    const columns: TableColumn<Supplier>[] = [
      {
        key: 'name',
        label: 'Supplier Name',
        sortable: true,
        render: (value: string) => (
          <div className="font-medium text-foreground">
            {value}
          </div>
        ),
      },
      {
        key: 'email',
        label: 'Contact Information',
        sortable: false,
        render: (value: string | undefined, supplier: Supplier) => (
          <div className="space-y-1">
            {supplier.email && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-3 w-3 mr-1" />
                {supplier.email}
              </div>
            )}
            {supplier.phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-3 w-3 mr-1" />
                {supplier.phone}
              </div>
            )}
            {!supplier.email && !supplier.phone && (
              <span className="text-sm text-muted-foreground italic">
                No contact info
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'address',
        label: 'Address',
        sortable: false,
        render: (value: string | undefined) => (
          <div className="text-sm text-muted-foreground">
            {value ? (
              <div className="flex items-start">
                <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>{truncateText(value, 50)}</span>
              </div>
            ) : (
              <span className="italic">No address</span>
            )}
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
          data={suppliers}
          columns={columns}
          pagination={pagination}
          onPageChange={onPageChange}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
          emptyMessage="No suppliers found. Add suppliers to manage your inventory procurement."
        />
      </div>
    );
  }
);

SuppliersTable.displayName = 'SuppliersTable';

export { SuppliersTable };
