import { z } from 'zod';

// Unit validation schema - matches Laravel validation rules
export const unitSchema = z.object({
  name: z.string()
    .min(1, 'Unit name is required')
    .max(255, 'Unit name must not exceed 255 characters'),
  symbol: z.string()
    .min(1, 'Unit symbol is required')
    .max(10, 'Unit symbol must not exceed 10 characters'),
});

// Inventory Item Category validation schema
export const inventoryItemCategorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(255, 'Category name must not exceed 255 characters'),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
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
});

// Inventory Item validation schema - matches Laravel validation rules
export const inventoryItemSchema = z.object({
  name: z.string()
    .min(1, 'Item name is required')
    .max(255, 'Item name must not exceed 255 characters'),
  inventory_item_category_id: z.string()
    .min(1, 'Category is required'),
  unit_id: z.string()
    .min(1, 'Unit is required'),
  threshold_quantity: z.number()
    .min(0, 'Threshold quantity must be 0 or greater')
    .or(z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0))),
  preferred_supplier_id: z.string()
    .min(1, 'Preferred supplier is required'),
  reorder_quantity: z.number()
    .min(0, 'Reorder quantity must be 0 or greater')
    .or(z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0))),
  unit_purchase_price: z.number()
    .min(0, 'Unit purchase price must be 0 or greater')
    .or(z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0))),
});

// Stock Entry validation schema
export const stockEntrySchema = z.object({
  inventory_item_id: z.string()
    .min(1, 'Inventory item is required'),
  transaction_type: z.enum(['IN', 'OUT', 'WASTE', 'TRANSFER'], {
    required_error: 'Transaction type is required',
  }),
  quantity: z.number()
    .min(0.01, 'Quantity must be greater than 0')
    .or(z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0.01))),
  unit_purchase_price: z.number()
    .min(0, 'Unit purchase price must be 0 or greater')
    .optional()
    .or(z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0)).optional()),
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
});

export const inventoryMovementFiltersSchema = baseFiltersSchema.extend({
  transaction_type: z.string().optional(),
  category: z.string().optional(),
  date_range: z.string().optional(),
});

// Type exports for form data
export type UnitFormData = z.infer<typeof unitSchema>;
export type InventoryItemCategoryFormData = z.infer<typeof inventoryItemCategorySchema>;
export type SupplierFormData = z.infer<typeof supplierSchema>;
export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
export type StockEntryFormData = z.infer<typeof stockEntrySchema>;
export type BaseFiltersData = z.infer<typeof baseFiltersSchema>;
export type InventoryMovementFiltersData = z.infer<typeof inventoryMovementFiltersSchema>;
