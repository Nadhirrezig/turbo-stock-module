import { z } from 'zod';

// Document validation schema
export const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  file: z.instanceof(File, { message: 'File is required' }),
  type: z.string().optional(),
  category: z.enum(['contract', 'certificate', 'invoice']).optional(),
});

// Finance validation schema
export const financeSchema = z.object({
  account_number: z.string().optional(),
  bank_name: z.string().optional(),
  currency: z.string().optional(),
});

// Payment validation schema
export const paymentSchema = z.object({
  preferred_method: z.enum(['Cash', 'COD', 'Bank Transfer', 'Credit']),
  terms: z.string().optional(),
});

// Contact validation schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  role: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
}).refine((data) => data.phone || data.email, {
  message: 'Contact must have either phone or email',
  path: ['phone'],
});

// Operations validation schema
export const operationsSchema = z.object({
  lead_time_days: z.number().min(0).optional(),
  minimum_order_quantity: z.number().min(0).optional(),
  delivery_terms: z.enum(['Pickup', 'Delivered']).optional(),
  delivery_address: z.string().optional(),
  active: z.boolean().optional(),
}).refine((data) => {
  if (data.delivery_terms === 'Delivered' && !data.delivery_address) {
    return false;
  }
  return true;
}, {
  message: 'Delivery address is required when delivery terms is "Delivered"',
  path: ['delivery_address'],
});

// Tax validation schema
export const taxSchema = z.object({
  tax_id: z.string().optional(),
  tax_rate: z.number().min(0).max(100).optional(),
});

// Supplier Additional Info validation schema with constraints
export const supplierAdditionalInfoSchema = z.object({
  finance: financeSchema.optional(),
  payment: paymentSchema.optional(),
  contacts: z.array(contactSchema).optional(),
  operations: operationsSchema.optional(),
  documents: z.array(documentSchema).optional(),
  tax: taxSchema.optional(),
}).refine((data) => {
  // If payment method is Cash or COD, finance should be empty
  if (data.payment?.preferred_method === 'Cash' || data.payment?.preferred_method === 'COD') {
    return !data.finance?.account_number && !data.finance?.bank_name;
  }
  return true;
}, {
  message: 'Finance details are not allowed for Cash or COD payment methods',
  path: ['finance'],
}).refine((data) => {
  // If payment method is Bank Transfer, require finance details
  if (data.payment?.preferred_method === 'Bank Transfer') {
    return data.finance?.account_number && data.finance?.bank_name;
  }
  return true;
}, {
  message: 'Account number and bank name are required for Bank Transfer',
  path: ['finance'],
});

    





// Department validation schema
export const departmentSchema = z.object({
  name: z.string()
    .min(1, 'Department name is required')
    .max(255, 'Department name must not exceed 255 characters'),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

// Unit validation schema - matches Laravel validation rules
export const unitSchema = z.object({
  name: z.string()
    .min(1, 'Unit name is required')
    .max(255, 'Unit name must not exceed 255 characters'),
  symbol: z.string()
    .min(1, 'Unit symbol is required')
    .max(10, 'Unit symbol must not exceed 10 characters'),
  department_id: z.string()
    .min(1, 'Department is required'),
});

// Inventory Item Category validation schema
export const inventoryItemCategorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(255, 'Category name must not exceed 255 characters'),
  department_id: z.string()
    .min(1, 'Department is required'),
  // Description field temporarily hidden to save UI space
  // description: z.string()
  //   .max(500, 'Description must not exceed 500 characters')
  //   .optional(),
});

// Supplier validation schema
export const supplierSchema = z.object({
  name: z.string()
    .min(1, 'Supplier name is required')
    .max(255, 'Supplier name must not exceed 255 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .max(20, 'Phone number must not exceed 20 characters')
    .optional(),
  address: z.string()
    .max(500, 'Address must not exceed 500 characters')
    .optional(),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  additional_info: supplierAdditionalInfoSchema.optional(),
});

// Inventory Item validation schema -
export const inventoryItemSchema = z.object({
  name: z.string()
    .min(1, 'Item name is required')
    .max(255, 'Item name must not exceed 255 characters'),
  inventory_item_category_id: z.string()
    .min(1, 'Category is required'),
  unit_id: z.string()
    .min(1, 'Unit is required'),
  department_id: z.string()
    .min(1, 'Department is required'),
  threshold_quantity: z.number().min(0, 'Threshold quantity must be 0 or greater'),
  // Preferred supplier removed - suppliers belong to transactions, not product definitions
  // preferred_supplier_id: z.string()
  //   .min(1, 'Preferred supplier is required'),
  reorder_quantity: z.number().min(0, 'Reorder quantity must be 0 or greater'),
});

// Stock Entry validation schema
export const stockEntrySchema = z.object({
  inventory_item_id: z.string()
    .min(1, 'Inventory item is required'),
  transaction_type: z.enum(['IN', 'OUT', 'WASTE', 'TRANSFER'], {
    message: 'Transaction type is required',
  }),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unit_purchase_price: z.number().min(0, 'Unit purchase price must be 0 or greater').optional(),
  supplier_id: z.string().optional(),
  destination_branch_id: z.string().optional(),
  waste_reason: z.string()
    .max(255, 'Waste reason must not exceed 255 characters')
    .optional(),
  notes: z.string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),
  expiration_date: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      return !isNaN(Date.parse(date));
    }, 'Please enter a valid date'),
}).refine((data) => {
  // Conditional validation based on transaction type
  if (data.transaction_type === 'IN' && !data.supplier_id) {
    return false;
  }
  if (data.transaction_type === 'WASTE' && !data.waste_reason) {
    return false;
  }
  if (data.transaction_type === 'TRANSFER' && !data.destination_branch_id) {
    return false;
  }
  if (data.transaction_type === 'IN' && !data.unit_purchase_price) {
    return false;
  }
  return true;
}, {
  message: 'Please fill in all required fields for this transaction type',
});

// Search and filter schemas
export const baseFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
  sort_field: z.string().optional(),
  sort_direction: z.enum(['asc', 'desc']).optional(),
  department_id: z.string().optional(),
});

export const inventoryMovementFiltersSchema = baseFiltersSchema.extend({
  transaction_type: z.string().optional(),
  category: z.string().optional(),
  date_range: z.string().optional(),
});

// Type exports for form data
export type DepartmentFormData = z.infer<typeof departmentSchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
export type InventoryItemCategoryFormData = z.infer<typeof inventoryItemCategorySchema>;
export type SupplierFormData = z.infer<typeof supplierSchema>;
export type SupplierAdditionalInfoFormData = z.infer<typeof supplierAdditionalInfoSchema>;
export type DocumentFormData = z.infer<typeof documentSchema>;
export type FinanceFormData = z.infer<typeof financeSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type OperationsFormData = z.infer<typeof operationsSchema>;
export type TaxFormData = z.infer<typeof taxSchema>;
export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
export type StockEntryFormData = z.infer<typeof stockEntrySchema>;
export type BaseFiltersData = z.infer<typeof baseFiltersSchema>;
export type InventoryMovementFiltersData = z.infer<typeof inventoryMovementFiltersSchema>;
