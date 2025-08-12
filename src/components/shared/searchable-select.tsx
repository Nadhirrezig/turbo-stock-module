'use client';

import * as React from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { SearchableSelectOption } from '@/lib/types';

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  displayField?: string;
  subField?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

const SearchableSelect = React.forwardRef<HTMLDivElement, SearchableSelectProps>(
  ({
    options,
    value,
    onValueChange,
    placeholder = 'Select an option...',
    displayField = 'name',
    subField,
    className,
    disabled = false,
    error,
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [selectedOption, setSelectedOption] = React.useState<SearchableSelectOption | null>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Merge the forwarded ref with our internal ref
    React.useImperativeHandle(ref, () => containerRef.current!, []);

    // Find selected option when value changes
    React.useEffect(() => {
      if (value) {
        const option = options.find(opt => opt.id === value);
        setSelectedOption(option || null);
        setSearch(option ? String(option[displayField] || '') : '');
      } else {
        setSelectedOption(null);
        setSearch('');
      }
    }, [value, options, displayField]);

    // Filter options based on search
    const filteredOptions = React.useMemo(() => {
      if (!search.trim()) return options.slice(0, 5);
      
      const searchLower = search.toLowerCase();
      return options.filter(option => {
        const mainFieldValue = option[displayField];
        const mainField = typeof mainFieldValue === 'string' ? mainFieldValue.toLowerCase() : '';
        const subFieldValue = subField ? option[subField] : '';
        const subFieldString = typeof subFieldValue === 'string' ? subFieldValue.toLowerCase() : '';
        return mainField.includes(searchLower) || subFieldString.includes(searchLower);
      }).slice(0, 5);
    }, [options, search, displayField, subField]);

    // Handle option selection
    const handleSelectOption = (option: SearchableSelectOption) => {
      setSelectedOption(option);
      setSearch(String(option[displayField] || ''));
      setIsOpen(false);
      onValueChange?.(option.id);
    };

    // Handle clear selection
    const handleClearSelection = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedOption(null);
      setSearch('');
      setIsOpen(false);
      onValueChange?.('');
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearch = e.target.value;
      setSearch(newSearch);
      setIsOpen(true);
      
      // If search doesn't match selected option, clear selection
      if (selectedOption) {
        const selectedFieldValue = selectedOption[displayField];
        const selectedFieldString = typeof selectedFieldValue === 'string' ? selectedFieldValue : '';
        if (!selectedFieldString.toLowerCase().includes(newSearch.toLowerCase())) {
          setSelectedOption(null);
          onValueChange?.('');
        }
      }
    };

    // Handle click outside to close dropdown
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'Tab') {
        setIsOpen(false);
      }
    };

    return (
      <div ref={containerRef} className={cn('relative', className)}>
        <div className="relative">
          <Input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'pr-10',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {selectedOption ? (
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-muted-foreground hover:text-foreground"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg">
            <div className="py-1 max-h-60 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    onClick={() => handleSelectOption(option)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        {String(option[displayField] || '')}
                      </span>
                      {subField && option[subField] ? (
                        <span className="text-xs text-muted-foreground">
                          {String(option[subField])}
                        </span>
                      ) : null}
                      {selectedOption?.id === option.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchableSelect.displayName = 'SearchableSelect';

export { SearchableSelect };
