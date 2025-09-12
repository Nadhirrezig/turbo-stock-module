'use client';

import React from 'react';
import { useDepartmentSelection } from '@/hooks/use-department-selection';
import { useDepartmentContext } from '@/contexts/department-context';

/**
 * Example component demonstrating department selection and data coordination
 * This shows how the complete data context shift works when switching departments
 */
export function DepartmentSelectorExample() {
  const { 
    selectedDepartmentId, 
    selectedDepartment, 
    allDepartments,
    currentBranchDepartments,
    switchDepartment,
    currentDepartmentStatus,
    dataCounts,
    isAnyDataLoading,
    currentBranchId 
  } = useDepartmentSelection();

  const handleDepartmentChange = async (departmentId: string) => {
    console.log(`Switching from ${selectedDepartmentId} to ${departmentId}`);
    await switchDepartment(departmentId);
    console.log('Department switch completed - all data refreshed');
  };

  if (isAnyDataLoading) {
    return (
      <div className="p-4 border rounded-lg bg-blue-50">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
        <p className="text-blue-600 mt-2">Loading department data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Department Selection System Demo</h2>
      
      {/* Current Branch Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Current Branch</h3>
        <p className="text-lg">Branch ID: {currentBranchId || 'None'}</p>
        <p className="text-sm text-gray-600">Total departments in branch: {currentBranchDepartments.length}</p>
      </div>

      {/* Current Department Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Current Department</h3>
        <p className="text-lg">{selectedDepartment?.name || 'No department selected'}</p>
        <p className="text-sm text-gray-600">ID: {selectedDepartmentId}</p>
        <p className="text-sm text-gray-600">Branch: {selectedDepartment?.branch_id}</p>
      </div>

      {/* Department Status */}
      {currentDepartmentStatus && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Department Status</h3>
          <p className="text-sm">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              currentDepartmentStatus.hasData ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {currentDepartmentStatus.description}
          </p>
        </div>
      )}

      {/* Data Counts */}
      {dataCounts && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-2">Data Counts</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Categories:</span>
              <span className="ml-1 text-blue-600">{dataCounts.categories}</span>
            </div>
            <div>
              <span className="font-medium">Units:</span>
              <span className="ml-1 text-blue-600">{dataCounts.units}</span>
            </div>
            <div>
              <span className="font-medium">Items:</span>
              <span className="ml-1 text-blue-600">{dataCounts.inventoryItems}</span>
            </div>
          </div>
        </div>
      )}

      {/* Department Selector */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Switch Department</h3>
        <select 
          value={selectedDepartmentId || ''} 
          onChange={(e) => handleDepartmentChange(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a department...</option>
          {currentBranchDepartments.map(department => (
            <option key={department.id} value={department.id}>
              {department.name} - {department.id === '2' ? 'Has Data' : 'No Data'}
            </option>
          ))}
        </select>
      </div>

      {/* All Departments (for reference) */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">All Departments (by Branch)</h3>
        <div className="space-y-2">
          {allDepartments.map(department => (
            <div key={department.id} className="p-2 border rounded text-sm">
              <span className="font-medium">{department.name}</span>
              <span className="text-gray-500 ml-2">(Branch: {department.branch_id})</span>
              {department.id === selectedDepartmentId && (
                <span className="ml-2 text-blue-600 font-medium">← Current</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Expected Behavior Info */}
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-2">Expected Behavior</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Kitchen Department (ID: 2):</strong> Shows 4 categories, 4 units, 4 items</li>
          <li>• <strong>Bar Department (ID: 1):</strong> Shows 0 categories, 0 units, 0 items</li>
          <li>• <strong>Smoke Department (ID: 3):</strong> Shows 0 categories, 0 units, 0 items</li>
          <li>• <strong>Switching departments:</strong> Triggers complete data refresh across all components</li>
          <li>• <strong>Branch changes:</strong> Resets to first department of new branch</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Simple department context usage example
 */
export function SimpleDepartmentInfo() {
  const { selectedDepartment, allDepartments, currentBranchId } = useDepartmentContext();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Simple Department Info</h3>
      <p>Selected: {selectedDepartment?.name || 'None'}</p>
      <p>Available departments: {allDepartments.length}</p>
      <p>Current branch: {currentBranchId || 'None'}</p>
    </div>
  );
}
