'use client';

import * as React from 'react';
import { useDepartments } from '@/hooks/use-departments';
import { Button } from '@/components/ui/button';
import { ChevronDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DepartmentSelectorProps {
  selectedDepartmentId?: string;
  onDepartmentChange: (departmentId: string) => void;
  className?: string;
}

export function DepartmentSelector({ 
  selectedDepartmentId, 
  onDepartmentChange, 
  className 
}: DepartmentSelectorProps) {
  const { allDepartments, loading } = useDepartments();
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedDepartment = allDepartments.find(d => d.id === selectedDepartmentId);
  const defaultDepartment = allDepartments[0]; 

  const handleDepartmentSelect = (departmentId: string) => {
    onDepartmentChange(departmentId);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading departments...</span>
      </div>
    );
  }

  if (allDepartments.length === 0) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <MapPin className="h-4 w-4 text-muted-foreground" />
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
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">
            {selectedDepartment?.name || defaultDepartment?.name || 'Select Department'}
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
          <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border rounded-xl shadow-md z-20 overflow-hidden"          >
            <div className="py-1">
              {allDepartments.map((department) => (
                <button
                  key={department.id}
                  onClick={() => handleDepartmentSelect(department.id)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                    selectedDepartmentId === department.id && "bg-accent text-accent-foreground border-l-2 border-primary"
                  )}>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{department.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
