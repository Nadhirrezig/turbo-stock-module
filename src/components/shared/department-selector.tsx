'use client';

import * as React from 'react';
import { useDepartmentSelection } from '@/hooks/use-department-selection';
import { Button } from '@/components/ui/button';
import { ChevronDown, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Department } from '@/lib/types';

interface DepartmentSelectorProps {
  className?: string;
}

export function DepartmentSelector({ className }: DepartmentSelectorProps) {
  const { 
    selectedDepartmentId, 
    selectedDepartment, 
    currentBranchDepartments,
    switchDepartment,
    isAnyDataLoading,
    currentBranchId 
  } = useDepartmentSelection();
  
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDepartmentSelect = (departmentId: string) => {
    switchDepartment(departmentId);
    setIsOpen(false);
  };

  if (isAnyDataLoading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading departments...</span>
      </div>
    );
  }

  if (!currentBranchId) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Select a branch first</span>
      </div>
    );
  }

  if (currentBranchDepartments.length === 0) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No departments available</span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 min-w-[200px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4" />
          <span className="text-sm font-medium">
            {selectedDepartment?.name || 'Select Department'}
          </span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border rounded-xl shadow-md z-20 overflow-hidden">
            <div className="py-1">
              {currentBranchDepartments.map((department: Department) => {
                // Check if department has data (Kitchen = ID '2')
                const hasData = department.id === '2';
                
                return (
                  <button
                    key={department.id}
                    onClick={() => handleDepartmentSelect(department.id)}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                      selectedDepartmentId === department.id && "bg-accent text-accent-foreground border-l-2 border-primary"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{department.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          hasData 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" 
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        )}>
                          {hasData ? 'Has Data' : 'No Data'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}