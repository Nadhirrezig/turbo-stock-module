'use client';

import * as React from 'react';
import { useBranches } from '@/hooks/use-branches';
import { Button } from '@/components/ui/button';
import { ChevronDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BranchSelectorProps {
  selectedBranchId?: string;
  onBranchChange: (branchId: string) => void;
  className?: string;
}

export function BranchSelector({ 
  selectedBranchId, 
  onBranchChange, 
  className 
}: BranchSelectorProps) {
  const { allBranches, loading } = useBranches();
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedBranch = allBranches.find(b => b.id === selectedBranchId);
  const defaultBranch = allBranches[0]; 

  const handleBranchSelect = (branchId: string) => {
    onBranchChange(branchId);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading branches...</span>
      </div>
    );
  }

  if (allBranches.length === 0) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No branches available</span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between space-x-2",
          "w-32 sm:w-full", // w-32 for mobile, w-full for desktop
          "truncate"
        )}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium truncate max-w-[80px] sm:max-w-none">
            {selectedBranch?.name || defaultBranch?.name || 'Select Branch'}
          </span>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform shrink-0", isOpen && "rotate-180")}
        />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-32 sm:w-full bg-background border border-border rounded-xl shadow-md z-20 overflow-hidden">
            <div className="py-1">
              {allBranches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => handleBranchSelect(branch.id)}
                  className={cn(
                    "w-full px-3 py-2 sm:py-2.5 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                    selectedBranchId === branch.id && "bg-accent text-accent-foreground border-l-2 border-primary"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate">{branch.name}</span>
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
