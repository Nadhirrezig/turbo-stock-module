'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockEntrySchema, StockEntryFormData } from '@/lib/schemas';


import { mockInventoryItems, mockSuppliers } from '@/lib/mock-data';
import { SearchableSelectOption, InventoryItem, Supplier } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/shared/loading-button';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/shared/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDown, ArrowUp, Trash2, ArrowRightLeft } from 'lucide-react';
import { UnsavedChangesDialogComponent } from '@/components/modals/unsaved-changes-dialog';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
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
const inventoryItemToOption = (item: InventoryItem): SearchableSelectOption => ({
  id: item.id,
  name: item.name,
  category: item.category,
  unit: item.unit,
  threshold_quantity: item.threshold_quantity,
  reorder_quantity: item.reorder_quantity,
  created_at: item.created_at,
  updated_at: item.updated_at,
});

const supplierToOption = (supplier: Supplier): SearchableSelectOption => ({
  id: supplier.id,
  name: supplier.name,
  email: supplier.email,
  phone: supplier.phone,
  address: supplier.address,
  description: supplier.description,
  created_at: supplier.created_at,
  updated_at: supplier.updated_at,
});

interface StockEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StockEntryFormData) => Promise<void>;
  loading?: boolean;
}

const StockEntryForm = React.forwardRef<HTMLDivElement, StockEntryFormProps>(
  ({ open, onOpenChange, onSubmit, loading = false }, ref) => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors, isSubmitting, isDirty },
      reset,
      watch,
    } = useForm<StockEntryFormData>({
      resolver: zodResolver(stockEntrySchema),
      defaultValues: {
        inventory_item_id: '',
        transaction_type: 'IN',
        quantity: 0,
        unit_purchase_price: 0,
        supplier_id: '',
        destination_branch_id: '',
        waste_reason: '',
        notes: '',
        expiration_date: '',
      },
    });

    // Use the reusable unsaved changes hook
    const {
      showUnsavedDialog,
      handleClose,
      handleDiscardChanges,
      handleContinueEditing,
      handleOpenChange,
      setShowUnsavedDialog,
    } = useUnsavedChanges({
      isDirty,
      onOpenChange,
      onReset: reset,
    });

    const transactionType = watch('transaction_type');

    // Reset form when modal opens/closes
    React.useEffect(() => {
      if (open) {
        reset({
          inventory_item_id: '',
          transaction_type: 'IN',
          quantity: 0,
          unit_purchase_price: 0,
          supplier_id: '',
          destination_branch_id: '',
          waste_reason: '',
          notes: '',
          expiration_date: '',
        });
      }
    }, [open, reset]);

    // Handle form submission
    const handleFormSubmit = async (data: StockEntryFormData) => {
      try {
        await onSubmit(data);
        onOpenChange(false);
        reset();
      } catch (error) {
        console.error('Form submission error:', error);
      }
    };

    const isLoading = loading || isSubmitting;

    // Transaction type options with icons and colors
    const transactionTypeOptions = [
      {
        id: 'IN',
        name: 'Stock In',
        description: 'Add inventory from supplier',
        icon: ArrowDown,
        colorClass: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/70'
      },
      {
        id: 'OUT',
        name: 'Stock Out',
        description: 'Remove inventory for use',
        icon: ArrowUp,
        colorClass: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/70'
      },
      {
        id: 'WASTE',
        name: 'Waste',
        description: 'Remove damaged/expired items',
        icon: Trash2,
        colorClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-900/70'
      },
      {
        id: 'TRANSFER',
        name: 'Transfer',
        description: 'Move to another location',
        icon: ArrowRightLeft,
        colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/70'
      },
    ];

    return (
      <>
        <RightDrawer open={open} onOpenChange={handleOpenChange}>
          <RightDrawerContent ref={ref} maxWidth="2xl">
            <RightDrawerHeader>
              <RightDrawerTitle>
                Add Stock Entry
              </RightDrawerTitle>
              <RightDrawerCloseButton onClick={handleClose} />
            </RightDrawerHeader>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <RightDrawerBody>
                <div className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">
                      Transaction Details
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                      {/* Inventory Item */}
                      <div className="space-y-3">
                        <Label htmlFor="inventory_item">
                          Inventory Item <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="inventory_item_id"
                          control={control}
                          render={({ field }) => (
                            <SearchableSelect
                              options={mockInventoryItems.map(inventoryItemToOption)}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Select inventory item..."
                              displayField="name"
                              subField="category.name"
                              disabled={isLoading}
                              error={errors.inventory_item_id?.message}
                            />
                          )}
                        />
                      </div>

                      {/* Transaction Type - Icon-based buttons */}
                      <div className="space-y-3 sm:col-span-2">
                        <Label htmlFor="transaction_type">
                          Transaction Type <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="transaction_type"
                          control={control}
                          render={({ field }) => (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                              {transactionTypeOptions.map((option) => {
                                const IconComponent = option.icon;
                                const isSelected = field.value === option.id;
                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => field.onChange(option.id)}
                                    disabled={isLoading}
                                    className={`
                                      relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                                      ${isSelected
                                        ? option.colorClass + ' border-current shadow-md'
                                        : 'border-border bg-background hover:bg-muted/50'
                                      }
                                    `}
                                  >
                                    <IconComponent className={`w-6 h-6 mb-2 ${isSelected ? 'text-current' : 'text-muted-foreground'}`} />
                                    <span className={`text-sm font-medium ${isSelected ? 'text-current' : 'text-foreground'}`}>
                                      {option.name}
                                    </span>
                                    <span className={`text-xs mt-1 text-center leading-tight ${isSelected ? 'text-current opacity-80' : 'text-muted-foreground'}`}>
                                      {option.description}
                                    </span>
                                    {isSelected && (
                                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-current rounded-full" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        />
                        {errors.transaction_type && (
                          <p className="text-sm text-destructive">
                            {errors.transaction_type.message}
                          </p>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="space-y-3">
                        <Label htmlFor="quantity">
                          Quantity <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Enter quantity"
                          {...register('quantity', { valueAsNumber: true })}
                          className={`text-lg ${errors.quantity ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                          disabled={isLoading}
                        />
                        {errors.quantity && (
                          <p className="text-sm text-destructive">
                            {errors.quantity.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Conditional Fields Section */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">
                      Additional Information
                    </h3>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Unit Purchase Price - Required for IN transactions */}
                      {transactionType === 'IN' && (
                        <div className="space-y-3">
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
                            className={`text-lg ${errors.unit_purchase_price ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            disabled={isLoading}
                          />
                          {errors.unit_purchase_price && (
                            <p className="text-sm text-destructive">
                              {errors.unit_purchase_price.message}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Supplier - Required for IN transactions */}
                      {transactionType === 'IN' && (
                        <div className="space-y-3">
                          <Label htmlFor="supplier">
                            Supplier <span className="text-destructive">*</span>
                          </Label>
                          <Controller
                            name="supplier_id"
                            control={control}
                            render={({ field }) => (
                              <SearchableSelect
                                options={mockSuppliers.map(supplierToOption)}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Select supplier..."
                                displayField="name"
                                subField="email"
                                disabled={isLoading}
                                error={errors.supplier_id?.message}
                              />
                            )}
                          />
                        </div>
                      )}

                      {/* Waste Reason - Required for WASTE transactions */}
                      {transactionType === 'WASTE' && (
                        <div className="space-y-3 lg:col-span-2">
                          <Label htmlFor="waste_reason">
                            Waste Reason <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="waste_reason"
                            type="text"
                            placeholder="e.g., Expired, Damaged, Contaminated"
                            {...register('waste_reason')}
                            className={`text-lg ${errors.waste_reason ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            disabled={isLoading}
                          />
                          {errors.waste_reason && (
                            <p className="text-sm text-destructive">
                              {errors.waste_reason.message}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Destination Branch - Required for TRANSFER transactions */}
                      {transactionType === 'TRANSFER' && (
                        <div className="space-y-3 lg:col-span-2">
                          <Label htmlFor="destination_branch_id">
                            Destination Branch <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="destination_branch_id"
                            type="text"
                            placeholder="e.g., Warehouse 1, Downtown Branch"
                            {...register('destination_branch_id')}
                            className={`text-lg ${errors.destination_branch_id ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            disabled={isLoading}
                          />
                          {errors.destination_branch_id && (
                            <p className="text-sm text-destructive">
                              {errors.destination_branch_id.message}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Expiration Date - Optional for IN transactions */}
                      {transactionType === 'IN' && (
                        <div className="space-y-3">
                          <Label htmlFor="expiration_date">
                            Expiration Date
                          </Label>
                          <Input
                            id="expiration_date"
                            type="date"
                            {...register('expiration_date')}
                            className={`text-lg ${errors.expiration_date ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            disabled={isLoading}
                          />
                          {errors.expiration_date && (
                            <p className="text-sm text-destructive">
                              {errors.expiration_date.message}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      <div className="space-y-3 lg:col-span-2">
                        <Label htmlFor="notes">
                          Notes
                        </Label>
                        <Textarea
                          id="notes"
                          rows={4}
                          placeholder="Additional notes about this transaction..."
                          {...register('notes')}
                          className={`text-base ${errors.notes ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                          disabled={isLoading}
                        />
                        {errors.notes && (
                          <p className="text-sm text-destructive">
                            {errors.notes.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Help Text - Enhanced with transaction type colors */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-3">
                          Transaction Guidelines
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <ArrowDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-blue-700 dark:text-blue-300">
                              <strong className="text-green-700 dark:text-green-300">Stock In:</strong> Requires supplier and purchase price
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-blue-700 dark:text-blue-300">
                              <strong className="text-red-700 dark:text-red-300">Stock Out:</strong> Records usage or sales
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-blue-700 dark:text-blue-300">
                              <strong className="text-yellow-700 dark:text-yellow-300">Waste:</strong> Requires reason for disposal
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRightLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-blue-700 dark:text-blue-300">
                              <strong className="text-blue-700 dark:text-blue-300">Transfer:</strong> Moves stock between locations
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RightDrawerBody>

              <RightDrawerFooter className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  loading={isLoading}
                  loadingText="Processing..."
                  className="flex-1 sm:flex-none"
                >
                  Add Stock Entry
                </LoadingButton>
              </RightDrawerFooter>
            </form>
          </RightDrawerContent>
        </RightDrawer>

        {/* Unsaved Changes Warning Dialog */}
        <UnsavedChangesDialogComponent
          open={showUnsavedDialog}
          onOpenChange={setShowUnsavedDialog}
          title="Unsaved Changes"
          description="You have unsaved changes. Are you sure you want to close without saving?"
          discardLabel="Discard Changes"
          cancelLabel="Continue Editing"
          onDiscard={handleDiscardChanges}
          onCancel={handleContinueEditing}
        />
      </>
    );
  }
);

StockEntryForm.displayName = 'StockEntryForm';

export { StockEntryForm };
