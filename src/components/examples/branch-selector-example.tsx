'use client';

import React from 'react';
import { useBranchSelection } from '@/hooks/use-branch-selection';
import { useBranchContext } from '@/contexts/branch-context';

/**
 * Example component demonstrating branch selection and data coordination
 * This shows how the complete data context shift works when switching branches
 */
export function BranchSelectorExample() {
  const { 
    selectedBranchId, 
    selectedBranch, 
    allBranches, 
    switchBranch,
    currentBranchStatus,
    dataCounts,
    isAnyDataLoading 
  } = useBranchSelection();

  const handleBranchChange = async (branchId: string) => {
    console.log(`Switching from ${selectedBranchId} to ${branchId}`);
    await switchBranch(branchId);
    console.log('Branch switch completed - all data refreshed');
  };

  if (isAnyDataLoading) {
    return (
      <div className="p-4 border rounded-lg bg-blue-50">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
        <p className="text-blue-600 mt-2">Loading branch data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Branch Selection System Demo</h2>
      
      {/* Current Branch Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Current Branch</h3>
        <p className="text-lg">{selectedBranch?.name || 'No branch selected'}</p>
        <p className="text-sm text-gray-600">{selectedBranch?.description}</p>
        <p className="text-sm text-gray-600">ID: {selectedBranchId}</p>
      </div>

      {/* Branch Status */}
      {currentBranchStatus && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Branch Status</h3>
          <p className="text-sm">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              currentBranchStatus.hasData ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {currentBranchStatus.description}
          </p>
        </div>
      )}

      {/* Data Counts */}
      {dataCounts && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-2">Data Counts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Departments:</span>
              <span className="ml-1 text-blue-600">{dataCounts.departments}</span>
            </div>
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
            <div>
              <span className="font-medium">Suppliers:</span>
              <span className="ml-1 text-blue-600">{dataCounts.suppliers}</span>
            </div>
            <div>
              <span className="font-medium">Stock:</span>
              <span className="ml-1 text-blue-600">{dataCounts.stockEntries}</span>
            </div>
            <div>
              <span className="font-medium">Movements:</span>
              <span className="ml-1 text-blue-600">{dataCounts.movements}</span>
            </div>
          </div>
        </div>
      )}

      {/* Branch Selector */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Switch Branch</h3>
        <select 
          value={selectedBranchId || ''} 
          onChange={(e) => handleBranchChange(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a branch...</option>
          {allBranches.map(branch => (
            <option key={branch.id} value={branch.id}>
              {branch.name} - {branch.id === 'branch-1' ? 'Has Data' : 'No Data'}
            </option>
          ))}
        </select>
      </div>

      {/* Expected Behavior Info */}
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-2">Expected Behavior</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Branch 1 (Main Restaurant):</strong> Shows 3 departments, 4 units, 4 categories, 4 items</li>
          <li>• <strong>Branch 2 (Downtown):</strong> Shows 0 departments, 0 units, 0 categories, 0 items</li>
          <li>• <strong>Branch 3 (Mall):</strong> Shows 0 departments, 0 units, 0 categories, 0 items</li>
          <li>• <strong>Switching branches:</strong> Triggers complete data refresh across all components</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Simple branch context usage example
 */
export function SimpleBranchInfo() {
  const { selectedBranch, allBranches } = useBranchContext();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Simple Branch Info</h3>
      <p>Selected: {selectedBranch?.name || 'None'}</p>
      <p>Available branches: {allBranches.length}</p>
    </div>
  );
}
