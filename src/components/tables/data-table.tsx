'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TableColumn, PaginationInfo } from '@/lib/types';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string;
}

function DataTable<T extends { id: string }>({
  data,
  columns,
  pagination,
  onPageChange,
  onSort,
  sortField,
  sortDirection,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'No data found',
  className,
  rowClassName,
}: DataTableProps<T>) {
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !onSort) return;
    
    const field = column.key as string;
    const newDirection = 
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    
    onSort(field, newDirection);
  };

  const renderSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;
    
    const field = column.key as string;
    if (sortField !== field) {
      return <ChevronDown className="ml-1 h-4 w-4 opacity-50" />;
    }
    
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.render) {
      if (column.key === 'actions') {
        // For actions column, pass the entire item
        // Type assertion is safe here because we know the conditional type resolves to T for 'actions'
        return (column.render as (value: T, item: T) => React.ReactNode)(item, item);
      } else {
        // For entity properties, pass the specific property value
        const value = item[column.key as keyof T];
        // Type assertion is safe here because we know the conditional type resolves to T[K] for property keys
        return (column.render as (value: unknown, item: T) => React.ReactNode)(value, item);
      }
    }

    return item[column.key as keyof T] as React.ReactNode;
  };

  const renderPagination = () => {
    if (!pagination || !onPageChange) return null;

    const { current_page, last_page, total } = pagination;
    const pages = [];
    
    // Calculate page range to show
    const maxPages = 5;
    let startPage = Math.max(1, current_page - Math.floor(maxPages / 2));
    const endPage = Math.min(last_page, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {((current_page - 1) * pagination.per_page) + 1} to{' '}
          {Math.min(current_page * pagination.per_page, total)} of {total} results
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(current_page - 1)}
            disabled={current_page <= 1}
          >
            Previous
          </Button>
          
          {pages.map((page) => (
            <Button
              key={page}
              variant={page === current_page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(current_page + 1)}
            disabled={current_page >= last_page}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('bg-background rounded-lg border shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-muted/70'
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              (data || []).map((item) => (
                <tr key={item.id} className={cn("hover:bg-muted/50", rowClassName)}>
                  {columns.map((column, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-sm">
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="cursor-pointer hover:bg-primary/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(item)}
                            className="text-destructive hover:text-destructive cursor-pointer hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {renderPagination()}
    </div>
  );
}

export { DataTable };
