'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InventoryItem, SearchableSelectOption, InventoryItemCategory, Unit } from '@/lib/types';
import { inventoryItemSchema, InventoryItemFormData } from '@/lib/schemas';
import { useCategories } from '@/hooks/use-categories';
import { useUnits } from '@/hooks/use-units';
// import { mockSuppliers } from '@/lib/mock-data'; // Removed - suppliers belong to transactions, not product definitions
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/shared/loading-button';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/shared/searchable-select';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerTitle,
  RightDrawerBody,
  RightDrawerFooter,
  RightDrawerCloseButton,
} from '@/components/modals/right-drawer';

// Adapter functions to convert entity types to SearchableSelectOption
const categoryToOption = (category: InventoryItemCategory): SearchableSelectOption => ({
  id: category.id,
  name: category.name,
  created_at: category.created_at,
  updated_at: category.updated_at,
});

const unitToOption = (unit: Unit): SearchableSelectOption => ({
  id: unit.id,
  name: unit.name,
  symbol: unit.symbol,
  created_at: unit.created_at,
  updated_at: unit.updated_at,
});

interface InventoryItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryItem?: InventoryItem | null;
  onSubmit: (data: InventoryItemFormData) => Promise<void>;
  loading?: boolean;
}

const InventoryItemForm = React.forwardRef<HTMLDivElement, InventoryItemFormProps>(
  ({ open, onOpenChange, inventoryItem, onSubmit, loading = false }, ref) => {
    const isEditing = Boolean(inventoryItem);

    // Fetch categories and units from API
    const { allCategories, loading: categoriesLoading } = useCategories();
    const { allUnits, loading: unitsLoading } = useUnits();

    const {
      register,
      handleSubmit,
      control,
      formState: { errors, isSubmitting },
      reset,
      setValue,
    } = useForm<InventoryItemFormData>({
      resolver: zodResolver(inventoryItemSchema),
      defaultValues: {
        name: '',
        inventory_item_category_id: '',
        unit_id: '',
        threshold_quantity: 0,
        // preferred_supplier_id: '', // Removed - suppliers belong to transactions, not product definitions
        reorder_quantity: 0,
      },
    });

    // Reset form when inventory item changes or modal opens/closes
    React.useEffect(() => {
      if (open) {
        if (inventoryItem) {
          setValue('name', inventoryItem.name);
          setValue('inventory_item_category_id', inventoryItem.inventory_item_category_id);
          setValue('unit_id', inventoryItem.unit_id);
          setValue('threshold_quantity', inventoryItem.threshold_quantity);
          // setValue('preferred_supplier_id', inventoryItem.preferred_supplier_id); // Removed - suppliers belong to transactions, not product definitions
          setValue('reorder_quantity', inventoryItem.reorder_quantity);
        } else {
          reset({
            name: '',
            inventory_item_category_id: '',
            unit_id: '',
            threshold_quantity: 0,
            // preferred_supplier_id: '', // Removed - suppliers belong to transactions, not product definitions
            reorder_quantity: 0,
          });
        }
      }
    }, [open, inventoryItem, setValue, reset]);

    const handleFormSubmit = async (data: InventoryItemFormData) => {
      try {
        await onSubmit(data);
        onOpenChange(false);
        reset();
      } catch (error) {
        console.error('Form submission error:', error);
      }
    };

    const handleClose = () => {
      onOpenChange(false);
      reset();
    };

    const isLoading = loading || isSubmitting;

    return (
      <RightDrawer open={open} onOpenChange={onOpenChange}>
        <RightDrawerContent ref={ref} maxWidth="lg">
          <RightDrawerHeader>
            <RightDrawerTitle>
              {isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </RightDrawerTitle>
            <RightDrawerCloseButton />
          </RightDrawerHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <RightDrawerBody>
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Item Name */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="name">
                        Item Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g., Arabica Coffee Beans, Whole Milk"
                        {...register('name')}
                        className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="inventory_item_category_id"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={allCategories.map(categoryToOption)}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder={categoriesLoading ? "Loading categories..." : "Select category..."}
                            displayField="name"
                            // subField="description" // Temporarily hidden to save UI space
                            disabled={isLoading || categoriesLoading}
                            error={errors.inventory_item_category_id?.message}
                          />
                        )}
                      />
                    </div>

                    {/* Unit */}
                    <div className="space-y-2">
                      <Label htmlFor="unit">
                        Unit <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="unit_id"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={allUnits.map(unitToOption)}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder={unitsLoading ? "Loading units..." : "Select unit..."}
                            displayField="name"
                            subField="symbol"
                            disabled={isLoading || unitsLoading}
                            error={errors.unit_id?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory Settings Section */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Inventory Settings
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Threshold Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="threshold_quantity">
                        Threshold Quantity <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="threshold_quantity"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        {...register('threshold_quantity', { valueAsNumber: true })}
                        className={errors.threshold_quantity ? 'border-destructive focus-visible:ring-destructive' : ''}
                        disabled={isLoading}
                      />
                      {errors.threshold_quantity && (
                        <p className="text-sm text-destructive">
                          {errors.threshold_quantity.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Minimum stock level before reordering
                      </p>
                    </div>

                    {/* Reorder Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="reorder_quantity">
                        Reorder Quantity <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="reorder_quantity"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        {...register('reorder_quantity', { valueAsNumber: true })}
                        className={errors.reorder_quantity ? 'border-destructive focus-visible:ring-destructive' : ''}
                        disabled={isLoading}
                      />
                      {errors.reorder_quantity && (
                        <p className="text-sm text-destructive">
                          {errors.reorder_quantity.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Quantity to order when restocking
                      </p>
                    </div>

                    {/* Unit Purchase Price */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="unit_purchase_price">
                        Unit Purchase Price <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="unit_purchase_price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...register('unit_purchase_price', { valueAsNumber: true })}
                        className={errors.unit_purchase_price ? 'border-destructive focus-visible:ring-destructive' : ''}
                        disabled={isLoading}
                      />
                      {errors.unit_purchase_price && (
                        <p className="text-sm text-destructive">
                          {errors.unit_purchase_price.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Cost per unit from supplier
                      </p>
                    </div> */}

                    {/* Preferred Supplier - Removed: suppliers belong to transactions, not product definitions */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="supplier">
                        Preferred Supplier <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="preferred_supplier_id"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={mockSuppliers}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select supplier..."
                            displayField="name"
                            subField="email"
                            disabled={isLoading}
                            error={errors.preferred_supplier_id?.message}
                          />
                        )}
                      />
                    </div> */}
                  </div>
                </div>

                {/* Help Text */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Inventory Item Guidelines
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Set appropriate threshold quantities to avoid stockouts</li>
                          <li>Reorder quantities should consider lead times and usage patterns</li>
                          {/* <li>Unit purchase prices help calculate inventory values</li> */}
                          {/* <li>Preferred suppliers streamline the ordering process</li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RightDrawerBody>

            <RightDrawerFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                loading={isLoading}
                loadingText={isEditing ? 'Updating...' : 'Creating...'}
              >
                {isEditing ? 'Update Item' : 'Create Item'}
              </LoadingButton>
            </RightDrawerFooter>
          </form>
        </RightDrawerContent>
      </RightDrawer>
    );
  }
);

InventoryItemForm.displayName = 'InventoryItemForm';

export { InventoryItemForm };
