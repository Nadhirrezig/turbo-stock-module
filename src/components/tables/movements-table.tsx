'use client';

import * as React from 'react';
import { InventoryMovement, TableColumn } from '@/lib/types';
import { DataTable } from './data-table';
import { formatDateTime, formatCurrency, formatNumber, getTransactionTypeLabel, getTransactionTypeColor } from '@/lib/utils';
import { ArrowDown, ArrowUp, Trash2, ArrowRightLeft } from 'lucide-react';

interface MovementsTableProps {
  inventoryMovements: InventoryMovement[];
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
  loading?: boolean;
  className?: string;
}

const MovementsTable = React.forwardRef<HTMLDivElement, MovementsTableProps>(
  ({
    inventoryMovements,
    pagination,
    onPageChange,
    onSort,
    sortField,
    sortDirection,
    loading = false,
    className,
  }, ref) => {
    const getTransactionIcon = (type: string) => {
      switch (type) {
        case 'IN':
          return <ArrowDown className="h-4 w-4" />;
        case 'OUT':
          return <ArrowUp className="h-4 w-4" />;
        case 'WASTE':
          return <Trash2 className="h-4 w-4" />;
        case 'TRANSFER':
          return <ArrowRightLeft className="h-4 w-4" />;
        default:
          return null;
      }
    };

    const columns: TableColumn<InventoryMovement>[] = [
      {
        key: 'inventory_item',
        label: 'Item',
        sortable: false,
        render: (value: any, movement: InventoryMovement) => (
          <div>
            <div className="font-medium text-foreground">
              {movement.inventory_item?.name || 'Unknown Item'}
            </div>
            {movement.inventory_item?.category && (
              <div className="text-xs text-muted-foreground">
                {movement.inventory_item.category.name}
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'transaction_type',
        label: 'Type',
        sortable: true,
        render: (value: string) => (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(value)}`}>
            {getTransactionIcon(value)}
            <span className="ml-1">{getTransactionTypeLabel(value)}</span>
          </div>
        ),
      },
      {
        key: 'quantity',
        label: 'Quantity',
        sortable: true,
        render: (value: number, movement: InventoryMovement) => (
          <div className="text-sm font-medium text-foreground">
            {movement.transaction_type === 'OUT' || movement.transaction_type === 'WASTE' ? '-' : '+'}
            {formatNumber(value)} {movement.inventory_item?.unit?.symbol || ''}
          </div>
        ),
      },
      {
        key: 'unit_purchase_price',
        label: 'Unit Price',
        sortable: true,
        render: (value: number | undefined) => (
          <div className="text-sm text-muted-foreground">
            {value ? formatCurrency(value) : 'N/A'}
          </div>
        ),
      },
      {
        key: 'supplier',
        label: 'Supplier',
        sortable: false,
        render: (value: any, movement: InventoryMovement) => (
          <div className="text-sm">
            {movement.supplier ? (
              <div>
                <div className="font-medium text-foreground">
                  {movement.supplier.name}
                </div>
                {movement.supplier.email && (
                  <div className="text-xs text-muted-foreground">
                    {movement.supplier.email}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground italic">N/A</span>
            )}
          </div>
        ),
      },
      {
        key: 'notes',
        label: 'Notes',
        sortable: false,
        render: (value: string | undefined, movement: InventoryMovement) => (
          <div className="text-sm text-muted-foreground max-w-xs">
            {movement.waste_reason && (
              <div className="text-destructive font-medium mb-1">
                Reason: {movement.waste_reason}
              </div>
            )}
            {value ? (
              <div className="truncate" title={value}>
                {value}
              </div>
            ) : (
              <span className="italic">No notes</span>
            )}
          </div>
        ),
      },
      {
        key: 'created_at',
        label: 'Date',
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
          data={inventoryMovements}
          columns={columns}
          pagination={pagination}
          onPageChange={onPageChange}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          loading={loading}
          emptyMessage="No inventory movements found. Stock transactions will appear here."
        />
      </div>
    );
  }
);

MovementsTable.displayName = 'MovementsTable';

export { MovementsTable };
