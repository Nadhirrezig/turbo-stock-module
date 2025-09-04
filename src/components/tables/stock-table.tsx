'use client';

import * as React from 'react';
import { InventoryStock, TableColumn } from '@/lib/types';
import { DataTable } from './data-table';
import { formatDateTime, formatCurrency, formatNumber } from '@/lib/utils';
import { AlertTriangle, Package } from 'lucide-react';

interface StockTableProps {
  inventoryStock: InventoryStock[];
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
  rowClassName?: string;
}

const StockTable = React.forwardRef<HTMLDivElement, StockTableProps>(
  ({
    inventoryStock,
    pagination,
    onPageChange,
    onSort,
    sortField,
    sortDirection,
    loading = false,
    className,
    rowClassName,
  }, ref) => {
    const columns: TableColumn<InventoryStock>[] = [
      {
        key: 'inventory_item',
        label: 'Item',
        sortable: false,
        render: (_value: unknown, stock: InventoryStock) => (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium text-foreground">
                {stock.inventory_item?.name || 'Unknown Item'}
              </div>
              {stock.inventory_item?.category && (
                <div className="text-xs text-muted-foreground">
                  {stock.inventory_item.category.name}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        key: 'quantity',
        label: 'Current Stock',
        sortable: true,
        render: (quantity: number, stock: InventoryStock) => {
          const isLowStock = stock.inventory_item && quantity <= stock.inventory_item.threshold_quantity;
          const isOutOfStock = quantity <= 0;
          
          return (
            <div className="flex items-center space-x-2">
              {(isLowStock || isOutOfStock) && (
                <AlertTriangle className={`h-4 w-4 ${isOutOfStock ? 'text-destructive' : 'text-yellow-500'}`} />
              )}
              <div>
                <div className={`font-medium ${isOutOfStock ? 'text-destructive' : isLowStock ? 'text-yellow-600' : 'text-foreground'}`}>
                  {formatNumber(quantity)} {stock.inventory_item?.unit?.symbol || ''}
                </div>
                {stock.inventory_item?.threshold_quantity && (
                  <div className="text-xs text-muted-foreground">
                    Threshold: {formatNumber(stock.inventory_item.threshold_quantity)}
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        key: 'unit_purchase_price',
        label: 'Unit Price',
        sortable: true,
        render: (price: number) => (
          <div className="text-sm font-medium text-foreground">
            {formatCurrency(price)}
          </div>
        ),
      },
      {
        key: 'actions',
        label: 'Total Value',
        sortable: false,
        render: (stock: InventoryStock) => (
          <div className="text-sm font-medium text-foreground">
            {formatCurrency(stock.quantity * stock.unit_purchase_price)}
          </div>
        ),
      },
      {
        key: 'expiration_date',
        label: 'Expiration',
        sortable: true,
        render: (dateValue: string | undefined) => {
          if (!dateValue) {
            return (
              <span className="text-sm text-muted-foreground italic">
                No expiration
              </span>
            );
          }
          
          const expirationDate = new Date(dateValue);
          const today = new Date();
          const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          let textColor = 'text-foreground';
          if (daysUntilExpiration < 0) {
            textColor = 'text-destructive';
          } else if (daysUntilExpiration <= 7) {
            textColor = 'text-yellow-600';
          }
          
          return (
            <div className={`text-sm ${textColor}`}>
              {expirationDate.toLocaleDateString()}
              {daysUntilExpiration < 0 && (
                <div className="text-xs text-destructive">Expired</div>
              )}
              {daysUntilExpiration >= 0 && daysUntilExpiration <= 7 && (
                <div className="text-xs text-yellow-600">
                  {daysUntilExpiration === 0 ? 'Expires today' : `${daysUntilExpiration} days left`}
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: 'updated_at',
        label: 'Last Updated',
        sortable: true,
        render: (dateString: string) => (
          <div className="text-sm text-muted-foreground">
            {formatDateTime(dateString)}
          </div>
        ),
      },
    ];

    return (
      <div ref={ref} className={className}>
        <DataTable
          data={inventoryStock}
          columns={columns}
          pagination={pagination}
          onPageChange={onPageChange}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          loading={loading}
          rowClassName={rowClassName}
          emptyMessage="No stock records found. Add stock entries to track inventory levels."
        />
      </div>
    );
  }
);

StockTable.displayName = 'StockTable';

export { StockTable };
