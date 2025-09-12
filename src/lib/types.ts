// Utility types for better type safety
export type TransactionType = 'IN' | 'OUT' | 'WASTE' | 'TRANSFER';
export type PaymentMethod = 'Cash' | 'COD' | 'Bank Transfer' | 'Credit';
export type DocumentCategory = 'contract' | 'certificate' | 'invoice';

// Branch types
export interface Branch {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  // Optional relations
  departments?: Department[];
}



export interface Department {
  branch_id: string;
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  // Relations
  branch?: Branch;
  units?: Unit[];
  inventory_item_categories?: InventoryItemCategory[];
}

export interface Unit {
  branch_id: string;
  id: string;
  name: string;
  symbol: string;
  department_id: string;
  created_at: string;
  updated_at: string;
  // Relations
  branch?: Branch;
  department?: Department;
}

export interface InventoryItemCategory {
  branch_id: string;
  id: string;
  name: string;
  // description?: string; // Temporarily hidden from UI to save space, but kept in data model
  department_id: string;
  created_at: string;
  updated_at: string;
  // Relations
  branch?: Branch;
  department?: Department;
}

export interface Supplier {
  branch_id: string;
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  // Relations
  branch?: Branch;
  additional_info?: SupplierAdditionalInfo;
}

export interface SupplierAdditionalInfo {
  finance?: Finance;
  payment?: Payment;
  contacts?: Contact[];
  operations?: Operations;
  documents?: DocumentWithUrl[];
  tax?: Tax;
}

// Subtypes for supplier

export interface Finance {
  account_number?: string;  // Bank account/IBAN
  bank_name?: string;
  currency?: string;        // e.g., TND, USD, EUR
}

export interface Payment {
  preferred_method: PaymentMethod; // enum
  terms?: string;           // e.g., Net 30, COD terms
}

export interface Contact {
  name: string;
  role?: string;
  phone?: string;
  email?: string;
}

export interface Operations {
  lead_time_days?: number;
  minimum_order_quantity?: number;
  delivery_terms?: string; // Free text for custom delivery arrangements
  delivery_address?: string;
  active?: boolean;
}

export interface Document {
  name: string;
  file: File;                       // uploaded file
  type?: string;                    // pdf, image, etc.
  category?: DocumentCategory;
}

// Document with URL (after upload)
export interface DocumentWithUrl {
  name: string;
  url: string;
  type?: string;
  category?: DocumentCategory;
}

export interface Tax {
  tax_id?: string;         // VAT/Tax number
  tax_rate?: number;
}


export interface InventoryItem {
  branch_id: string;
  id: string;
  name: string;
  inventory_item_category_id: string;
  unit_id: string;
  department_id: string;
  threshold_quantity: number;
  // preferred_supplier_id: string; // Removed - suppliers belong to transactions, not product definitions
  reorder_quantity: number;
  created_at: string;
  updated_at: string;
  // Relations
  branch?: Branch;
  category?: InventoryItemCategory;
  unit?: Unit;
  department?: Department;
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
  branch?: Branch;
  inventory_item?: InventoryItem;
}

export interface InventoryMovement {
  id: string;
  inventory_item_id: string;
  branch_id: string;
  transaction_type: TransactionType;
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
  branch?: Branch;
  inventory_item?: InventoryItem;
  supplier?: Supplier;
  destination_branch?: Branch;
}

// Form types for create/edit operations
export interface CreateBranchData extends Record<string, unknown> {
  name: string;
  description?: string;
}

export interface CreateDepartmentData extends Record<string, unknown> {
  branch_id: string;
  name: string;
  description?: string;
}

export interface CreateUnitData extends Record<string, unknown> {
  branch_id: string;
  name: string;
  symbol: string;
  department_id: string;
}

export interface CreateInventoryItemCategoryData extends Record<string, unknown> {
  branch_id: string;
  name: string;
  department_id: string;
  // description?: string; // Temporarily hidden from UI to save space
}

export interface CreateSupplierData extends Record<string, unknown> {
  branch_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
}

export interface CreateInventoryItemData extends Record<string, unknown> {
  branch_id: string;
  name: string;
  inventory_item_category_id: string;
  unit_id: string;
  department_id: string;
  threshold_quantity: number;
  // preferred_supplier_id: string; // Removed - suppliers belong to transactions, not product definitions
  reorder_quantity: number;
  // unit_purchase_price: number; // Removed - prices belong to transactions, not product definitions
}

export interface CreateStockEntryData extends Record<string, unknown> {
  branch_id: string;
  inventory_item_id: string;
  transaction_type: TransactionType;
  quantity: number;
  unit_purchase_price?: number;
  supplier_id?: string;
  destination_branch_id?: string;
  destination_department_id?: string;
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
  branch_id?: string;
  search?: string;
  page?: number;
  per_page?: number;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
  department_id?: string;
}

export interface InventoryMovementFilters extends BaseFilters {
  branch_id: string;
  department_id?: string;
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


// Branch statistics
export interface BranchStats {
  totalDepartments: number;
  totalInventoryItems: number;
  totalSuppliers: number;
  totalStockValue: number;
  lowStockItems: number;
  recentMovements: number;
}
