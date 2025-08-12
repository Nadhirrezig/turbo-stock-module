import { 
  Unit, 
  InventoryItemCategory, 
  Supplier, 
  InventoryItem, 
  InventoryStock, 
  InventoryMovement 
} from './types';

// Mock Units data
export const mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Kilogram',
    symbol: 'kg',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Liter',
    symbol: 'L',
    created_at: '2024-01-15T10:31:00Z',
    updated_at: '2024-01-15T10:31:00Z',
  },
  {
    id: '3',
    name: 'Piece',
    symbol: 'pcs',
    created_at: '2024-01-15T10:32:00Z',
    updated_at: '2024-01-15T10:32:00Z',
  },
  {
    id: '4',
    name: 'Gram',
    symbol: 'g',
    created_at: '2024-01-15T10:33:00Z',
    updated_at: '2024-01-15T10:33:00Z',
  },
  {
    id: '5',
    name: 'Milliliter',
    symbol: 'ml',
    created_at: '2024-01-15T10:34:00Z',
    updated_at: '2024-01-15T10:34:00Z',
  },
];

// Mock Categories data
// Note: Description fields are temporarily hidden from UI to save space, but preserved in data
export const mockCategories: InventoryItemCategory[] = [
  {
    id: '1',
    name: 'Beverages',
    branch_id: 'branch-1',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z',
  },
  {
    id: '2',
    name: 'Dairy Products',
    branch_id: 'branch-1',
    created_at: '2024-01-15T09:01:00Z',
    updated_at: '2024-01-15T09:01:00Z',
  },
  {
    id: '3',
    name: 'Bakery Items',
    branch_id: 'branch-1',
    created_at: '2024-01-15T09:02:00Z',
    updated_at: '2024-01-15T09:02:00Z',
  },
  {
    id: '4',
    name: 'Ingredients',
    branch_id: 'branch-1',
    created_at: '2024-01-15T09:03:00Z',
    updated_at: '2024-01-15T09:03:00Z',
  },
  {
    id: '5',
    name: 'Packaging',
    branch_id: 'branch-1',
    created_at: '2024-01-15T09:04:00Z',
    updated_at: '2024-01-15T09:04:00Z',
  },
];

// Mock Suppliers data
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Coffee Beans Co.',
    email: 'orders@coffeebeans.com',
    phone: '+1-555-0101',
    address: '123 Coffee Street, Bean City, BC 12345',
    description: 'Premium coffee beans from sustainable farms worldwide',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z',
  },
  {
    id: '2',
    name: 'Fresh Dairy Ltd.',
    email: 'supply@freshdairy.com',
    phone: '+1-555-0102',
    address: '456 Milk Avenue, Dairy Town, DT 67890',
    description: 'Farm-fresh dairy products and ingredients',
    created_at: '2024-01-10T08:01:00Z',
    updated_at: '2024-01-10T08:01:00Z',
  },
  {
    id: '3',
    name: 'Bakery Supplies Inc.',
    email: 'info@bakerysupplies.com',
    phone: '+1-555-0103',
    address: '789 Flour Road, Bakery City, BC 11111',
    description: 'Professional bakery ingredients and supplies',
    created_at: '2024-01-10T08:02:00Z',
    updated_at: '2024-01-10T08:02:00Z',
  },
  {
    id: '4',
    name: 'Packaging Solutions',
    email: 'sales@packagingsolutions.com',
    phone: '+1-555-0104',
    address: '321 Package Lane, Supply Town, ST 22222',
    description: 'Eco-friendly packaging and container solutions',
    created_at: '2024-01-10T08:03:00Z',
    updated_at: '2024-01-10T08:03:00Z',
  },
  {
    id: '5',
    name: 'Organic Ingredients',
    email: 'orders@organicingredients.com',
    phone: '+1-555-0105',
    address: '654 Organic Way, Green Valley, GV 33333',
    description: 'Certified organic ingredients and specialty products',
    created_at: '2024-01-10T08:04:00Z',
    updated_at: '2024-01-10T08:04:00Z',
  },
];

// Mock Inventory Items data
// Note: Preferred supplier fields removed - suppliers belong to transactions, not product definitions
export const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Arabica Coffee Beans',
    inventory_item_category_id: '1',
    unit_id: '1',
    threshold_quantity: 5,
    // preferred_supplier_id: '1', // Removed - suppliers belong to transactions, not product definitions
    reorder_quantity: 20,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    category: mockCategories[0],
    unit: mockUnits[0],
    // preferred_supplier: mockSuppliers[0], // Removed - suppliers belong to transactions, not product definitions
  },
  {
    id: '2',
    name: 'Whole Milk',
    inventory_item_category_id: '2',
    unit_id: '2',
    threshold_quantity: 10,
    // preferred_supplier_id: '2', // Removed - suppliers belong to transactions, not product definitions
    reorder_quantity: 50,
    created_at: '2024-01-20T10:01:00Z',
    updated_at: '2024-01-20T10:01:00Z',
    category: mockCategories[1],
    unit: mockUnits[1],
    // preferred_supplier: mockSuppliers[1], // Removed - suppliers belong to transactions, not product definitions
  },
  {
    id: '3',
    name: 'Croissants',
    inventory_item_category_id: '3',
    unit_id: '3',
    threshold_quantity: 20,
    // preferred_supplier_id: '3', // Removed - suppliers belong to transactions, not product definitions
    reorder_quantity: 100,
    created_at: '2024-01-20T10:02:00Z',
    updated_at: '2024-01-20T10:02:00Z',
    category: mockCategories[2],
    unit: mockUnits[2],
    // preferred_supplier: mockSuppliers[2], // Removed - suppliers belong to transactions, not product definitions
  },
  {
    id: '4',
    name: 'Sugar',
    inventory_item_category_id: '4',
    unit_id: '1',
    threshold_quantity: 2,
    // preferred_supplier_id: '5', // Removed - suppliers belong to transactions, not product definitions
    reorder_quantity: 10,
    created_at: '2024-01-20T10:03:00Z',
    updated_at: '2024-01-20T10:03:00Z',
    category: mockCategories[3],
    unit: mockUnits[0],
    // preferred_supplier: mockSuppliers[4], // Removed - suppliers belong to transactions, not product definitions
  },
  {
    id: '5',
    name: 'Paper Cups (12oz)',
    inventory_item_category_id: '5',
    unit_id: '3',
    threshold_quantity: 100,
    // preferred_supplier_id: '4', // Removed - suppliers belong to transactions, not product definitions
    reorder_quantity: 500,
    created_at: '2024-01-20T10:04:00Z',
    updated_at: '2024-01-20T10:04:00Z',
    category: mockCategories[4],
    unit: mockUnits[2],
    // preferred_supplier: mockSuppliers[3], // Removed - suppliers belong to transactions, not product definitions
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

// Mock Inventory Stock data
export const mockInventoryStock: InventoryStock[] = [
  {
    id: '1',
    inventory_item_id: '1',
    branch_id: 'branch-1',
    quantity: 15.5,
    unit_purchase_price: 12.50,
    expiration_date: '2024-12-31',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-02-15T14:30:00Z',
    inventory_item: mockInventoryItems[0],
  },
  {
    id: '2',
    inventory_item_id: '2',
    branch_id: 'branch-1',
    quantity: 25.0,
    unit_purchase_price: 3.25,
    expiration_date: '2024-03-15',
    created_at: '2024-01-20T10:01:00Z',
    updated_at: '2024-02-10T09:15:00Z',
    inventory_item: mockInventoryItems[1],
  },
  {
    id: '3',
    inventory_item_id: '3',
    branch_id: 'branch-1',
    quantity: 45,
    unit_purchase_price: 1.75,
    created_at: '2024-01-20T10:02:00Z',
    updated_at: '2024-02-14T16:45:00Z',
    inventory_item: mockInventoryItems[2],
  },
  {
    id: '4',
    inventory_item_id: '4',
    branch_id: 'branch-1',
    quantity: 8.2,
    unit_purchase_price: 2.80,
    created_at: '2024-01-20T10:03:00Z',
    updated_at: '2024-02-12T11:20:00Z',
    inventory_item: mockInventoryItems[3],
  },
  {
    id: '5',
    inventory_item_id: '5',
    branch_id: 'branch-1',
    quantity: 250,
    unit_purchase_price: 0.15,
    created_at: '2024-01-20T10:04:00Z',
    updated_at: '2024-02-13T13:10:00Z',
    inventory_item: mockInventoryItems[4],
  },
];

// Mock Inventory Movements data
export const mockInventoryMovements: InventoryMovement[] = [
  {
    id: '1',
    inventory_item_id: '1',
    branch_id: 'branch-1',
    transaction_type: 'IN',
    quantity: 20,
    unit_purchase_price: 12.50,
    supplier_id: '1',
    notes: 'Initial stock purchase',
    expiration_date: '2024-12-31',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    inventory_item: mockInventoryItems[0],
    supplier: mockSuppliers[0],
  },
  {
    id: '2',
    inventory_item_id: '1',
    branch_id: 'branch-1',
    transaction_type: 'OUT',
    quantity: 4.5,
    notes: 'Used for daily operations',
    created_at: '2024-02-15T14:30:00Z',
    updated_at: '2024-02-15T14:30:00Z',
    inventory_item: mockInventoryItems[0],
  },
  {
    id: '3',
    inventory_item_id: '2',
    branch_id: 'branch-1',
    transaction_type: 'IN',
    quantity: 30,
    unit_purchase_price: 3.25,
    supplier_id: '2',
    notes: 'Weekly milk delivery',
    expiration_date: '2024-03-15',
    created_at: '2024-02-08T08:00:00Z',
    updated_at: '2024-02-08T08:00:00Z',
    inventory_item: mockInventoryItems[1],
    supplier: mockSuppliers[1],
  },
  {
    id: '4',
    inventory_item_id: '2',
    branch_id: 'branch-1',
    transaction_type: 'OUT',
    quantity: 5,
    notes: 'Daily usage',
    created_at: '2024-02-10T09:15:00Z',
    updated_at: '2024-02-10T09:15:00Z',
    inventory_item: mockInventoryItems[1],
  },
  {
    id: '5',
    inventory_item_id: '3',
    branch_id: 'branch-1',
    transaction_type: 'WASTE',
    quantity: 5,
    waste_reason: 'Expired items',
    notes: 'Past expiration date',
    created_at: '2024-02-14T16:45:00Z',
    updated_at: '2024-02-14T16:45:00Z',
    inventory_item: mockInventoryItems[2],
  },
  {
    id: '6',
    inventory_item_id: '4',
    branch_id: 'branch-1',
    transaction_type: 'IN',
    quantity: 10,
    unit_purchase_price: 2.80,
    supplier_id: '5',
    notes: 'Monthly sugar order',
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
    inventory_item: mockInventoryItems[3],
    supplier: mockSuppliers[4],
  },
  {
    id: '7',
    inventory_item_id: '4',
    branch_id: 'branch-1',
    transaction_type: 'OUT',
    quantity: 1.8,
    notes: 'Baking supplies',
    created_at: '2024-02-12T11:20:00Z',
    updated_at: '2024-02-12T11:20:00Z',
    inventory_item: mockInventoryItems[3],
  },
  {
    id: '8',
    inventory_item_id: '5',
    branch_id: 'branch-1',
    transaction_type: 'IN',
    quantity: 500,
    unit_purchase_price: 0.15,
    supplier_id: '4',
    notes: 'Bulk cup order',
    created_at: '2024-01-25T14:00:00Z',
    updated_at: '2024-01-25T14:00:00Z',
    inventory_item: mockInventoryItems[4],
    supplier: mockSuppliers[3],
  },
  {
    id: '9',
    inventory_item_id: '5',
    branch_id: 'branch-1',
    transaction_type: 'OUT',
    quantity: 250,
    notes: 'Daily service usage',
    created_at: '2024-02-13T13:10:00Z',
    updated_at: '2024-02-13T13:10:00Z',
    inventory_item: mockInventoryItems[4],
  },
];

