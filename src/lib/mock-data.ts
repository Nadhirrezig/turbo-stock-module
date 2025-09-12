import { 
  Branch,
  Department,
  Unit, 
  InventoryItemCategory, 
  Supplier, 
  InventoryItem, 
  InventoryStock, 
  InventoryMovement 
} from './types';

// ========================================
// MOCK DATABASE STRUCTURE
// ========================================
// This file simulates a database with multiple tables/arrays
// - 3 branches exist in the system (like database records)
// - Only 1 branch is active/used (branch-1)
// - Active branch has 3 departments
// - Only 1 department (Kitchen) has operational data
// ========================================

// Mock Branches data - Database-like structure with 3 branches
export const mockBranches: Branch[] = [
  {
    id: 'branch-1',
    name: 'Main Restaurant',
    description: 'Primary restaurant location with multiple departments',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-01T08:00:00Z',
  },
  {
    id: 'branch-2',
    name: 'Downtown Branch',
    description: 'Downtown location with modern facilities',
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-01T09:00:00Z',
  },
  {
    id: 'branch-3',
    name: 'Mall Location',
    description: 'Shopping mall location with high foot traffic',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
];


// Mock Departments data - Only for active branch (branch-1), 3 departments, only Kitchen has data
export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Bar',
    description: 'Bar operations and beverage service',
    branch_id: 'branch-1', // Only belongs to active branch
    created_at: '2024-01-01T08:01:00Z',
    updated_at: '2024-01-01T08:01:00Z',
    branch: mockBranches[0],
  },
  {
    id: '2',
    name: 'Kitchen',
    description: 'Food preparation and cooking operations',
    branch_id: 'branch-1', // Only belongs to active branch
    created_at: '2024-01-01T08:02:00Z',
    updated_at: '2024-01-01T08:02:00Z',
    branch: mockBranches[0],
  },
  {
    id: '3',
    name: 'Smoke',
    description: 'Smoking and specialty food preparation',
    branch_id: 'branch-1', // Only belongs to active branch
    created_at: '2024-01-01T08:03:00Z',
    updated_at: '2024-01-01T08:03:00Z',
    branch: mockBranches[0],
  },
];

// Mock Units data - Only Kitchen department (id: '2') has units
export const mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Kilogram',
    symbol: 'kg',
    branch_id: 'branch-1',
    department_id: '2', // Kitchen department
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    branch: mockBranches[0],
    department: mockDepartments[1], // Kitchen
  },
  {
    id: '2',
    name: 'Gram',
    symbol: 'g',
    branch_id: 'branch-1',
    department_id: '2', // Kitchen department
    created_at: '2024-01-15T10:31:00Z',
    updated_at: '2024-01-15T10:31:00Z',
    branch: mockBranches[0],
    department: mockDepartments[1], // Kitchen
  },
  {
    id: '3',
    name: 'Liter',
    symbol: 'L',
    branch_id: 'branch-1',
    department_id: '2', // Kitchen department
    created_at: '2024-01-15T10:32:00Z',
    updated_at: '2024-01-15T10:32:00Z',
    branch: mockBranches[0],
    department: mockDepartments[1], // Kitchen
  },
  {
    id: '4',
    name: 'Piece',
    symbol: 'pcs',
    branch_id: 'branch-1',
    department_id: '2', // Kitchen department
    created_at: '2024-01-15T10:33:00Z',
    updated_at: '2024-01-15T10:33:00Z',
    branch: mockBranches[0],
    department: mockDepartments[1], // Kitchen
  },
];

// Mock Categories data - Only Kitchen department (id: '2') has categories
export const mockCategories: InventoryItemCategory[] = [
  {
    id: '1',
    name: 'Dairy Products',
    department_id: '2', // Kitchen department
    branch_id: 'branch-1',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z',
    branch: mockBranches[0],
    department: mockDepartments[1], // Kitchen
  },
  {
    id: '2',
    name: 'Bakery Items',
    department_id: '2', // Kitchen department
    branch_id: 'branch-1',
    created_at: '2024-01-15T09:01:00Z',
    updated_at: '2024-01-15T09:01:00Z',
    branch: mockBranches[0],
    department: mockDepartments[1], // Kitchen
  },
  {
    id: '3',
    name: 'Ingredients',
    department_id: '2', // Kitchen department
    branch_id: 'branch-1',
    created_at: '2024-01-15T09:02:00Z',
    updated_at: '2024-01-15T09:02:00Z',
    branch: mockBranches[0],
    department: mockDepartments[1], // Kitchen
  },
  {
    id: '4',
    name: 'Packaging',
    department_id: '2', // Kitchen department
    branch_id: 'branch-1',
    created_at: '2024-01-15T09:03:00Z',
    updated_at: '2024-01-15T09:03:00Z',
    branch: mockBranches[0],
    department: mockDepartments[1], // Kitchen
  },
];

// Mock Suppliers data - All suppliers belong to the main branch
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Fresh Dairy Ltd.',
    email: 'supply@freshdairy.com',
    phone: '+1-555-0102',
    address: '456 Milk Avenue, Dairy Town, DT 67890',
    description: 'Farm-fresh dairy products and ingredients',
    branch_id: 'branch-1',
    created_at: '2024-01-10T08:01:00Z',
    updated_at: '2024-01-10T08:01:00Z',
    branch: mockBranches[0],
  },
  {
    id: '2',
    name: 'Bakery Supplies Inc.',
    email: 'info@bakerysupplies.com',
    phone: '+1-555-0103',
    address: '789 Flour Road, Bakery City, BC 11111',
    description: 'Professional bakery ingredients and supplies',
    branch_id: 'branch-1',
    created_at: '2024-01-10T08:02:00Z',
    updated_at: '2024-01-10T08:02:00Z',
    branch: mockBranches[0],
  },
  {
    id: '3',
    name: 'Packaging Solutions',
    email: 'sales@packagingsolutions.com',
    phone: '+1-555-0104',
    address: '321 Package Lane, Supply Town, ST 22222',
    description: 'Eco-friendly packaging and container solutions',
    branch_id: 'branch-1',
    created_at: '2024-01-10T08:03:00Z',
    updated_at: '2024-01-10T08:03:00Z',
    branch: mockBranches[0],
  },
  {
    id: '4',
    name: 'Organic Ingredients',
    email: 'orders@organicingredients.com',
    phone: '+1-555-0105',
    address: '654 Organic Way, Green Valley, GV 33333',
    description: 'Certified organic ingredients and specialty products',
    branch_id: 'branch-1',
    created_at: '2024-01-10T08:04:00Z',
    updated_at: '2024-01-10T08:04:00Z',
    branch: mockBranches[0],
  },
];

// Mock Inventory Items data - Only Kitchen department (id: '2') has items
export const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Whole Milk',
    inventory_item_category_id: '1', // Dairy Products
    unit_id: '3', // Liter
    department_id: '2', // Kitchen department
    threshold_quantity: 10,
    reorder_quantity: 50,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    branch_id: 'branch-1',
    branch: mockBranches[0],
    category: mockCategories[0], // Dairy Products
    unit: mockUnits[2], // Liter
    department: mockDepartments[1], // Kitchen
  },
  {
    id: '2',
    name: 'Croissants',
    inventory_item_category_id: '2', // Bakery Items
    unit_id: '4', // Piece
    department_id: '2', // Kitchen department
    threshold_quantity: 20,
    reorder_quantity: 100,
    created_at: '2024-01-20T10:01:00Z',
    updated_at: '2024-01-20T10:01:00Z',
    branch_id: 'branch-1',
    branch: mockBranches[0],
    category: mockCategories[1], // Bakery Items
    unit: mockUnits[3], // Piece
    department: mockDepartments[1], // Kitchen
  },
  {
    id: '3',
    name: 'Sugar',
    inventory_item_category_id: '3', // Ingredients
    unit_id: '1', // Kilogram
    department_id: '2', // Kitchen department
    threshold_quantity: 2,
    reorder_quantity: 10,
    created_at: '2024-01-20T10:02:00Z',
    updated_at: '2024-01-20T10:02:00Z',
    branch_id: 'branch-1',
    branch: mockBranches[0],
    category: mockCategories[2], // Ingredients
    unit: mockUnits[0], // Kilogram
    department: mockDepartments[1], // Kitchen
  },
  {
    id: '4',
    name: 'Paper Cups (12oz)',
    inventory_item_category_id: '4', // Packaging
    unit_id: '4', // Piece
    department_id: '2', // Kitchen department
    threshold_quantity: 100,
    reorder_quantity: 500,
    created_at: '2024-01-20T10:03:00Z',
    updated_at: '2024-01-20T10:03:00Z',
    branch_id: 'branch-1',
    branch: mockBranches[0],
    category: mockCategories[3], // Packaging
    unit: mockUnits[3], // Piece
    department: mockDepartments[1], // Kitchen
  },
];

// Generate more mock data for pagination testing - TODO: Remove in production
export const generateMockUnits = (count: number): Unit[] => {
  const additionalUnits = [];
  for (let i = mockUnits.length + 1; i <= mockUnits.length + count; i++) {
    additionalUnits.push({
      id: i.toString(),
      name: `Unit ${i}`,
      symbol: `U${i}`,
      branch_id: 'branch-1',
      department_id: '2', // Default to Kitchen department
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  return [...mockUnits, ...additionalUnits];
};

// Utility functions for mock API simulation
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Mock Inventory Stock data - Only Kitchen department items
export const mockInventoryStock: InventoryStock[] = [
  {
    id: '1',
    inventory_item_id: '1', // Whole Milk
    branch_id: 'branch-1',
    quantity: 25.0,
    unit_purchase_price: 3.25,
    expiration_date: '2024-03-15',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-02-10T09:15:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[0],
  },
  {
    id: '2',
    inventory_item_id: '2', // Croissants
    branch_id: 'branch-1',
    quantity: 45,
    unit_purchase_price: 1.75,
    created_at: '2024-01-20T10:01:00Z',
    updated_at: '2024-02-14T16:45:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[1],
  },
  {
    id: '3',
    inventory_item_id: '3', // Sugar
    branch_id: 'branch-1',
    quantity: 8.2,
    unit_purchase_price: 2.80,
    created_at: '2024-01-20T10:02:00Z',
    updated_at: '2024-02-12T11:20:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[2],
  },
  {
    id: '4',
    inventory_item_id: '4', // Paper Cups
    branch_id: 'branch-1',
    quantity: 250,
    unit_purchase_price: 0.15,
    created_at: '2024-01-20T10:03:00Z',
    updated_at: '2024-02-13T13:10:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[3],
  },
];

// Mock Inventory Movements data - Only Kitchen department items
export const mockInventoryMovements: InventoryMovement[] = [
  {
    id: '1',
    inventory_item_id: '1', // Whole Milk
    branch_id: 'branch-1',
    transaction_type: 'IN',
    quantity: 30,
    unit_purchase_price: 3.25,
    supplier_id: '1',
    notes: 'Weekly milk delivery',
    expiration_date: '2024-03-15',
    created_at: '2024-02-08T08:00:00Z',
    updated_at: '2024-02-08T08:00:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[0],
    supplier: mockSuppliers[0],
  },
  {
    id: '2',
    inventory_item_id: '1', // Whole Milk
    branch_id: 'branch-1',
    transaction_type: 'OUT',
    quantity: 5,
    notes: 'Daily usage',
    created_at: '2024-02-10T09:15:00Z',
    updated_at: '2024-02-10T09:15:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[0],
  },
  {
    id: '3',
    inventory_item_id: '2', // Croissants
    branch_id: 'branch-1',
    transaction_type: 'IN',
    quantity: 50,
    unit_purchase_price: 1.75,
    supplier_id: '2',
    notes: 'Daily bakery delivery',
    created_at: '2024-02-14T06:00:00Z',
    updated_at: '2024-02-14T06:00:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[1],
    supplier: mockSuppliers[1],
  },
  {
    id: '4',
    inventory_item_id: '2', // Croissants
    branch_id: 'branch-1',
    transaction_type: 'WASTE',
    quantity: 5,
    waste_reason: 'Expired items',
    notes: 'Past expiration date',
    created_at: '2024-02-14T16:45:00Z',
    updated_at: '2024-02-14T16:45:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[1],
  },
  {
    id: '5',
    inventory_item_id: '3', // Sugar
    branch_id: 'branch-1',
    transaction_type: 'IN',
    quantity: 10,
    unit_purchase_price: 2.80,
    supplier_id: '4',
    notes: 'Monthly sugar order',
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[2],
    supplier: mockSuppliers[3],
  },
  {
    id: '6',
    inventory_item_id: '3', // Sugar
    branch_id: 'branch-1',
    transaction_type: 'OUT',
    quantity: 1.8,
    notes: 'Baking supplies',
    created_at: '2024-02-12T11:20:00Z',
    updated_at: '2024-02-12T11:20:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[2],
  },
  {
    id: '7',
    inventory_item_id: '4', // Paper Cups
    branch_id: 'branch-1',
    transaction_type: 'IN',
    quantity: 500,
    unit_purchase_price: 0.15,
    supplier_id: '3',
    notes: 'Bulk cup order',
    created_at: '2024-01-25T14:00:00Z',
    updated_at: '2024-01-25T14:00:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[3],
    supplier: mockSuppliers[2],
  },
  {
    id: '8',
    inventory_item_id: '4', // Paper Cups
    branch_id: 'branch-1',
    transaction_type: 'OUT',
    quantity: 250,
    notes: 'Daily service usage',
    created_at: '2024-02-13T13:10:00Z',
    updated_at: '2024-02-13T13:10:00Z',
    branch: mockBranches[0],
    inventory_item: mockInventoryItems[3],
  },
];

