// Core entity types based on Laravel Blade analysis
export interface Unit {
  id: string;
  name: string;
  symbol: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItemCategory {
  id: string;
  name: string;
  // description?: string; // Temporarily hidden from UI to save space, but kept in data model
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  inventory_item_category_id: string;
  unit_id: string;
  threshold_quantity: number;
  // preferred_supplier_id: string; // Removed - suppliers belong to transactions, not product definitions
  reorder_quantity: number;
  created_at: string;
  updated_at: string;
  // Relations
  category?: InventoryItemCategory;
  unit?: Unit;
  // preferred_supplier?: Supplier; // Removed - suppliers belong to transactions, not product definitions
}

export interface InventoryStock {
  id: string;
  inventory_item_id: string;
  branch_id: string;
  quantity: number;
  unit_purchase_price: number;
  expiration_date?: string;
  created_at: string;
  updated_at: string;
  // Relations
  inventory_item?: InventoryItem;
}

export interface InventoryMovement {
  id: string;
  inventory_item_id: string;
  branch_id: string;
  transaction_type: 'IN' | 'OUT' | 'WASTE' | 'TRANSFER';
  quantity: number;
  unit_purchase_price?: number;
  supplier_id?: string;
  destination_branch_id?: string;
  waste_reason?: string;
  notes?: string;
  expiration_date?: string;
  created_at: string;
  updated_at: string;
  // Relations
  inventory_item?: InventoryItem;
  supplier?: Supplier;
}

// Form types for create/edit operations
export interface CreateUnitData extends Record<string, unknown> {
  name: string;
  symbol: string;
}

export interface CreateInventoryItemCategoryData extends Record<string, unknown> {
  name: string;
  // description?: string; // Temporarily hidden from UI to save space
}

export interface CreateSupplierData extends Record<string, unknown> {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
}

export interface CreateInventoryItemData extends Record<string, unknown> {
  name: string;
  inventory_item_category_id: string;
  unit_id: string;
  threshold_quantity: number;
  // preferred_supplier_id: string; // Removed - suppliers belong to transactions, not product definitions
  reorder_quantity: number;
  // unit_purchase_price: number; // Removed - prices belong to transactions, not product definitions
}

export interface CreateStockEntryData extends Record<string, unknown> {
  inventory_item_id: string;
  transaction_type: 'IN' | 'OUT' | 'WASTE' | 'TRANSFER';
  quantity: number;
  unit_purchase_price?: number;
  supplier_id?: string;
  destination_branch_id?: string;
  waste_reason?: string;
  notes?: string;
  expiration_date?: string;
}

// Enhanced conditional typing system for table columns
export type TableColumnKey<T> = keyof T | 'actions';

// Advanced conditional type that maps column keys to their expected value types
export type ColumnValueType<T, K extends TableColumnKey<T>> =
  K extends 'actions'
    ? T  // For actions column, pass the entire item
    : K extends keyof T
      ? T[K]  // For entity properties, use the actual property type
      : never;



// Consolidated TableColumn interface with conditional typing
export interface TableColumn<T, K extends TableColumnKey<T> = TableColumnKey<T>> {
  key: K;
  label: string;
  sortable?: boolean;
  render?: K extends 'actions'
    ? (value: T, item: T) => React.ReactNode
    : K extends keyof T
      ? (value: T[K], item: T) => React.ReactNode
      : never;
}

// Type-safe column array for table definitions
export type TableColumns<T> = Array<TableColumn<T, keyof T | 'actions'>>;

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface SearchableSelectOption {
  id: string;
  name: string;
  [key: string]: unknown;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Filter and search types
export interface BaseFilters {
  search?: string;
  page?: number;
  per_page?: number;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface InventoryMovementFilters extends BaseFilters {
  transaction_type?: string;
  category?: string;
  date_range?: string;
}

// Statistics types
export interface MovementStats {
  totalStockIn: number;
  totalStockOut: number;
  totalWaste: number;
  totalTransfers: number;
  totalMovements: number;
}

export interface StockStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
}
