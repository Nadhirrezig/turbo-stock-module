'use client';

import * as React from 'react';
import { InventoryItem, TableColumn } from '@/lib/types';
import { DataTable } from './data-table';
import { formatDateTime, formatNumber } from '@/lib/utils';

interface InventoryItemsTableProps {
  inventoryItems: InventoryItem[];
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
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
  loading?: boolean;
  className?: string;
  rowClassName?: string;
}

const InventoryItemsTable = React.forwardRef<HTMLDivElement, InventoryItemsTableProps>(
  ({
    inventoryItems,
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
    const columns: TableColumn<InventoryItem>[] = [
      {
        key: 'name',
        label: 'Item Name',
        sortable: true,
        render: (value: unknown, item: InventoryItem) => {
          const name = value as string;
          return (
            <div>
              <div className="font-medium text-foreground">
                {name}
              </div>
              {item.category && (
                <div className="text-xs text-muted-foreground">
                  {item.category.name}
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: 'unit',
        label: 'Unit',
        sortable: false,
        render: (_value: unknown, item: InventoryItem) => (
          <div className="text-sm">
            {item.unit ? (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {item.unit.symbol}
              </div>
            ) : (
              <span className="text-muted-foreground italic">No unit</span>
            )}
          </div>
        ),
      },
      {
        key: 'threshold_quantity',
        label: 'Threshold Qty',
        sortable: true,
        render: (value: unknown) => {
          const quantity = value as number;
          return (
            <div className="text-sm text-muted-foreground">
              {formatNumber(quantity)}
            </div>
          );
        },
      },
      {
        key: 'reorder_quantity',
        label: 'Reorder Qty',
        sortable: true,
        render: (value: unknown) => {
          const quantity = value as number;
          return (
            <div className="text-sm text-muted-foreground">
              {formatNumber(quantity)}
            </div>
          );
        },
      },
      // Preferred supplier column removed - suppliers belong to transactions, not product definitions
      // {
      //   key: 'preferred_supplier',
      //   label: 'Preferred Supplier',
      //   sortable: false,
      //   render: (_value: unknown, item: InventoryItem) => (
      //     <div className="text-sm">
      //       {item.preferred_supplier ? (
      //         <div>
      //           <div className="font-medium text-foreground">
      //             {item.preferred_supplier.name}
      //           </div>
      //           {item.preferred_supplier.email && (
      //             <div className="text-xs text-muted-foreground">
      //               {item.preferred_supplier.email}
      //             </div>
      //           )}
      //         </div>
      //       ) : (
      //         <span className="text-muted-foreground italic">No supplier</span>
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
    ];

    return (
      <div ref={ref} className={className}>
        <DataTable
          data={inventoryItems}
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
          emptyMessage="No inventory items found. Create your first inventory item to get started."
        />
      </div>
    );
  }
);

InventoryItemsTable.displayName = 'InventoryItemsTable';

export { InventoryItemsTable };
