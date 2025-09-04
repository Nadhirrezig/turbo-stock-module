'use client';

import * as React from 'react';
import { InventoryMovement, InventoryItem, TableColumn } from '@/lib/types';
import { DataTable } from './data-table';
import { formatDateTime, formatCurrency, formatNumber, getTransactionTypeLabel, getTransactionTypeColor } from '@/lib/utils';
import { ArrowDown, ArrowUp, Trash2, ArrowRightLeft, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  onView?: (movement: InventoryMovement) => void;
  onEdit?: (movement: InventoryMovement) => void;
  loading?: boolean;
  className?: string;
  rowClassName?: string;
}

const MovementsTable = React.forwardRef<HTMLDivElement, MovementsTableProps>(
  ({
    inventoryMovements,
    pagination,
    onPageChange,
    onSort,
    sortField,
    sortDirection,
    onView,
    onEdit,
    loading = false,
    className,
    rowClassName,
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
        render: (inventoryItem: InventoryItem | undefined) => (
          <div>
            <div className="font-medium text-foreground">
              {inventoryItem?.name || 'Unknown Item'}
            </div>
            {inventoryItem?.category && (
              <div className="text-xs text-muted-foreground">
                {inventoryItem.category.name}
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'transaction_type',
        label: 'Type',
        sortable: true,
        render: (transactionType: 'IN' | 'OUT' | 'WASTE' | 'TRANSFER') => (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transactionType)}`}>
            {getTransactionIcon(transactionType)}
            <span className="ml-1">{getTransactionTypeLabel(transactionType)}</span>
          </div>
        ),
      },
      {
        key: 'quantity',
        label: 'Quantity',
        sortable: true,
        render: (quantity: number, movement: InventoryMovement) => (
          <div className="text-sm font-medium text-foreground">
            {movement.transaction_type === 'OUT' || movement.transaction_type === 'WASTE' ? '-' : '+'}
            {formatNumber(quantity)} {movement.inventory_item?.unit?.symbol || ''}
          </div>
        ),
      },
      {
        key: 'unit_purchase_price',
        label: 'Unit Price',
        sortable: true,
        render: (price: number | undefined) => (
          <div className="text-sm text-muted-foreground">
            {price ? formatCurrency(price) : 'N/A'}
          </div>
        ),
      },
      {
        key: 'supplier',
        label: 'Supplier',
        sortable: false,
        render: (_value: unknown, movement: InventoryMovement) => (
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
      // {
      //   key: 'notes',
      //   label: 'Notes',
      //   sortable: false,
      //   render: (value: string | undefined, movement: InventoryMovement) => (
      //     <div className="text-sm text-muted-foreground max-w-xs">
      //       {movement.waste_reason && (
      //         <div className="text-destructive font-medium mb-1">
      //           Reason: {movement.waste_reason}
      //         </div>
      //       )}
      //       {value ? (
      //         <div className="truncate" title={value}>
      //           {value}
      //         </div>
      //       ) : (
      //         <span className="italic">No notes</span>
      //       )}
      //     </div>
      //   ),
      // },
      {
        key: 'created_at',
        label: 'Date',
        sortable: true,
        render: (dateString: string) => (
          <div className="text-sm text-muted-foreground">
            {formatDateTime(dateString)}
          </div>
        ),
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        render: (movement: InventoryMovement) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView?.(movement)}
              title="View Details"
              className="cursor-pointer hover:bg-primary/10"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(movement)}
              title="Edit Movement"
              className="cursor-pointer hover:bg-primary/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
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
          rowClassName={rowClassName}
          emptyMessage="No inventory movements found. Stock transactions will appear here."
        />
      </div>
    );
  }
);

MovementsTable.displayName = 'MovementsTable';

export { MovementsTable };
