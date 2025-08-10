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
  description?: string;
  branch_id: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  inventory_item_category_id: string;
  unit_id: string;
  threshold_quantity: number;
  preferred_supplier_id: string;
  reorder_quantity: number;
  unit_purchase_price: number;
  created_at: string;
  updated_at: string;
  // Relations
  category?: InventoryItemCategory;
  unit?: Unit;
  preferred_supplier?: Supplier;
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
export interface CreateUnitData {
  name: string;
  symbol: string;
}

export interface CreateInventoryItemCategoryData {
  name: string;
  description?: string;
}

export interface CreateSupplierData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CreateInventoryItemData {
  name: string;
  inventory_item_category_id: string;
  unit_id: string;
  threshold_quantity: number;
  preferred_supplier_id: string;
  reorder_quantity: number;
  unit_purchase_price: number;
}

export interface CreateStockEntryData {
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

// UI component types
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface SearchableSelectOption {
  id: string;
  name: string;
  [key: string]: any;
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
