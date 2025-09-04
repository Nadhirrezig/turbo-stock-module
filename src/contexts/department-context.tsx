'use client';

import * as React from 'react';
import { Department } from '@/lib/types';
import { useDepartments } from '@/hooks/use-departments';

interface DepartmentContextType {
  selectedDepartmentId: string | null;
  selectedDepartment: Department | null;
  setSelectedDepartmentId: (departmentId: string | null) => void;
  allDepartments: Department[];
  loading: boolean;
}

const DepartmentContext = React.createContext<DepartmentContextType | undefined>(undefined);

interface DepartmentProviderProps {
  children: React.ReactNode;
}

export function DepartmentProvider({ children }: DepartmentProviderProps) {
  const { allDepartments, loading } = useDepartments();
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState<string | null>(null);

  // Set default department when departments are loaded
  React.useEffect(() => {
    if (allDepartments.length > 0 && !selectedDepartmentId) {
      setSelectedDepartmentId(allDepartments[0].id);
    }
  }, [allDepartments, selectedDepartmentId]);

  const selectedDepartment = allDepartments.find(d => d.id === selectedDepartmentId) || null;

  const value = React.useMemo((): DepartmentContextType => ({
    selectedDepartmentId,
    selectedDepartment,
    setSelectedDepartmentId,
    allDepartments,
    loading,
  }), [selectedDepartmentId, selectedDepartment, allDepartments, loading]);

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
