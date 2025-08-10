'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { LoadingButton } from './loading-button';

interface PageHeaderProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actionLabel?: string;
  onActionClick?: () => void;
  actionLoading?: boolean;
  showAction?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({
    title,
    description,
    searchPlaceholder = 'Search...',
    searchValue = '',
    onSearchChange,
    actionLabel = 'Add New',
    onActionClick,
    actionLoading = false,
    showAction = true,
    className,
    children,
  }, ref) => {
    const [searchTerm, setSearchTerm] = React.useState(searchValue);

    // Debounce search input
    React.useEffect(() => {
      const timer = setTimeout(() => {
        onSearchChange?.(searchTerm);
      }, 500);

      return () => clearTimeout(timer);
    }, [searchTerm, onSearchChange]);

    // Update local state when external value changes
    React.useEffect(() => {
      setSearchTerm(searchValue);
    }, [searchValue]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-background border-b px-4 py-4 sm:px-6 sm:py-6',
          className
        )}
      >
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {/* Title and Description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {/* Search and Action */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            {/* Search Input */}
            {onSearchChange && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 w-full sm:w-64 xl:w-96"
                />
              </div>
            )}

            {/* Action Button */}
            {showAction && onActionClick && (
              <LoadingButton
                onClick={onActionClick}
                loading={actionLoading}
                className="w-full sm:w-auto"
              >
                {actionLabel}
              </LoadingButton>
            )}

            {/* Custom children */}
            {children}
          </div>
        </div>
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export { PageHeader };
