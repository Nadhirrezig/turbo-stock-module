'use client';

import * as React from 'react';
import { Branch } from '@/lib/types';
import { useBranches } from '@/hooks/use-branches';

interface BranchContextType {
  selectedBranchId: string | null;
  selectedBranch: Branch | null;
  setSelectedBranchId: (branchId: string | null) => void;
  allBranches: Branch[];
  loading: boolean;
  // Branch switching utilities
  switchToBranch: (branchId: string) => void;
  isBranchSelected: (branchId: string) => boolean;
}

const BranchContext = React.createContext<BranchContextType | undefined>(undefined);

interface BranchProviderProps {
  children: React.ReactNode;
}

export function BranchProvider({ children }: BranchProviderProps) {
  const { allBranches, loading } = useBranches();
  const [selectedBranchId, setSelectedBranchId] = React.useState<string | null>(null);

  // Set default branch when branches are loaded
  React.useEffect(() => {
    if (allBranches.length > 0 && !selectedBranchId) {
      // Default to the first branch (which has data in our mock setup)
      setSelectedBranchId(allBranches[0].id);
    }
  }, [allBranches, selectedBranchId]);

  const selectedBranch = allBranches.find(b => b.id === selectedBranchId) || null;

  // Branch switching utility
  const switchToBranch = React.useCallback((branchId: string) => {
    setSelectedBranchId(branchId);
  }, []);

  // Check if a branch is currently selected
  const isBranchSelected = React.useCallback((branchId: string) => {
    return selectedBranchId === branchId;
  }, [selectedBranchId]);

  const value = React.useMemo((): BranchContextType => ({
    selectedBranchId,
    selectedBranch,
    setSelectedBranchId,
    allBranches,
    loading,
    switchToBranch,
    isBranchSelected,
  }), [selectedBranchId, selectedBranch, allBranches, loading, switchToBranch, isBranchSelected]);

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranchContext() {
  const context = React.useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranchContext must be used within a BranchProvider');
  }
  return context;
}
