'use client';

import * as React from 'react';
import { Supplier, TableColumn } from '@/lib/types';
import { DataTable } from './data-table';
import { formatDateTime, truncateText } from '@/lib/utils';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';

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
        key: 'actions',
        label: 'Type',
        sortable: false,
        render: () => (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
            <Building2 className="w-5 h-5 text-muted-foreground" />
          </div>
        ),
      },
      {
        key: 'name',
        label: 'Supplier Name',
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
        key: 'email',
        label: 'Contact Information',
        sortable: false,
        render: (_value: unknown, supplier: Supplier) => (
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
        render: (value: unknown) => {
          const address = value as string | undefined;
          return (
            <div className="text-sm text-muted-foreground">
              {address ? (
                <div className="flex items-start">
                  <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{truncateText(address, 50)}</span>
                </div>
              ) : (
                <span className="italic">No address</span>
              )}
            </div>
          );
        },
      },
      {
        key: 'description',
        label: 'Description',
        sortable: false,
        render: (value: unknown) => {
          const description = value as string | undefined;
          return (
            <div className="text-sm text-muted-foreground max-w-xs">
              {description ? (
                <span className="line-clamp-2">{description}</span>
              ) : (
                <span className="italic">No description</span>
              )}
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
