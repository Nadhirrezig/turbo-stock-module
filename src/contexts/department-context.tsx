'use client';

import * as React from 'react';
import { Department } from '@/lib/types';
import { useDepartments } from '@/hooks/use-departments';
import { useBranchContext } from '@/contexts/branch-context';

interface DepartmentContextType {
  selectedDepartmentId: string | null;
  selectedDepartment: Department | null;
  setSelectedDepartmentId: (departmentId: string | null) => void;
  allDepartments: Department[];
  loading: boolean;
  // Department switching utilities
  switchToDepartment: (departmentId: string) => void;
  isDepartmentSelected: (departmentId: string) => boolean;
  // Branch integration
  currentBranchId: string | null;
}

const DepartmentContext = React.createContext<DepartmentContextType | undefined>(undefined);

interface DepartmentProviderProps {
  children: React.ReactNode;
}

export function DepartmentProvider({ children }: DepartmentProviderProps) {
  const { selectedBranchId } = useBranchContext();
  const { allDepartments, loading } = useDepartments();
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState<string | null>(null);

  // Set default department when departments are loaded
  React.useEffect(() => {
    if (allDepartments.length > 0 && !selectedDepartmentId) {
      setSelectedDepartmentId(allDepartments[0].id);
    }
  }, [allDepartments, selectedDepartmentId]);

  // Reset department selection when branch changes
  React.useEffect(() => {
    if (selectedBranchId) {
      // Reset to first department of the new branch
      if (allDepartments.length > 0) {
        setSelectedDepartmentId(allDepartments[0].id);
      } else {
        setSelectedDepartmentId(null);
      }
    }
  }, [selectedBranchId, allDepartments]);

  const selectedDepartment = allDepartments.find(d => d.id === selectedDepartmentId) || null;

  // Department switching utility
  const switchToDepartment = React.useCallback((departmentId: string) => {
    setSelectedDepartmentId(departmentId);
  }, []);

  // Check if a department is currently selected
  const isDepartmentSelected = React.useCallback((departmentId: string) => {
    return selectedDepartmentId === departmentId;
  }, [selectedDepartmentId]);

  const value = React.useMemo((): DepartmentContextType => ({
    selectedDepartmentId,
    selectedDepartment,
    setSelectedDepartmentId,
    allDepartments,
    loading,
    switchToDepartment,
    isDepartmentSelected,
    currentBranchId: selectedBranchId,
  }), [selectedDepartmentId, selectedDepartment, allDepartments, loading, switchToDepartment, isDepartmentSelected, selectedBranchId]);

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartmentContext() {
  const context = React.useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartmentContext must be used within a DepartmentProvider');
  }
  return context;
}
