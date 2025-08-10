'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockEntrySchema, StockEntryFormData } from '@/lib/schemas';
import { mockInventoryItems, mockSuppliers } from '@/lib/mock-data';
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
      formState: { errors, isSubmitting },
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

    const handleFormSubmit = async (data: StockEntryFormData) => {
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

    const transactionTypeOptions = [
      { id: 'IN', name: 'Stock In', description: 'Add inventory from supplier' },
      { id: 'OUT', name: 'Stock Out', description: 'Remove inventory for use' },
      { id: 'WASTE', name: 'Waste', description: 'Remove damaged/expired items' },
      { id: 'TRANSFER', name: 'Transfer', description: 'Move to another location' },
    ];

    return (
      <RightDrawer open={open} onOpenChange={onOpenChange}>
        <RightDrawerContent ref={ref} maxWidth="lg">
          <RightDrawerHeader>
            <RightDrawerTitle>
              Add Stock Entry
            </RightDrawerTitle>
            <RightDrawerCloseButton />
          </RightDrawerHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <RightDrawerBody>
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Transaction Details
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Inventory Item */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="inventory_item">
                        Inventory Item <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="inventory_item_id"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={mockInventoryItems}
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

                    {/* Transaction Type */}
                    <div className="space-y-2">
                      <Label htmlFor="transaction_type">
                        Transaction Type <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="transaction_type"
                        control={control}
                        render={({ field }) => (
                          <SearchableSelect
                            options={transactionTypeOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select transaction type..."
                            displayField="name"
                            subField="description"
                            disabled={isLoading}
                            error={errors.transaction_type?.message}
                          />
                        )}
                      />
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity">
                        Quantity <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0"
                        {...register('quantity', { valueAsNumber: true })}
                        className={errors.quantity ? 'border-destructive focus-visible:ring-destructive' : ''}
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Unit Purchase Price - Required for IN transactions */}
                    {transactionType === 'IN' && (
                      <div className="space-y-2">
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
                      </div>
                    )}

                    {/* Supplier - Required for IN transactions */}
                    {transactionType === 'IN' && (
                      <div className="space-y-2">
                        <Label htmlFor="supplier">
                          Supplier <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="supplier_id"
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
                              error={errors.supplier_id?.message}
                            />
                          )}
                        />
                      </div>
                    )}

                    {/* Waste Reason - Required for WASTE transactions */}
                    {transactionType === 'WASTE' && (
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="waste_reason">
                          Waste Reason <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="waste_reason"
                          type="text"
                          placeholder="e.g., Expired, Damaged, Contaminated"
                          {...register('waste_reason')}
                          className={errors.waste_reason ? 'border-destructive focus-visible:ring-destructive' : ''}
                          disabled={isLoading}
                        />
                        {errors.waste_reason && (
                          <p className="text-sm text-destructive">
                            {errors.waste_reason.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Expiration Date - Optional for IN transactions */}
                    {transactionType === 'IN' && (
                      <div className="space-y-2">
                        <Label htmlFor="expiration_date">
                          Expiration Date
                        </Label>
                        <Input
                          id="expiration_date"
                          type="date"
                          {...register('expiration_date')}
                          className={errors.expiration_date ? 'border-destructive focus-visible:ring-destructive' : ''}
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
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="notes">
                        Notes
                      </Label>
                      <textarea
                        id="notes"
                        rows={3}
                        placeholder="Additional notes about this transaction..."
                        {...register('notes')}
                        className={`flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none ${
                          errors.notes ? 'border-destructive focus-visible:ring-destructive' : ''
                        }`}
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
                        Transaction Guidelines
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <ul className="list-disc list-inside space-y-1">
                          <li><strong>Stock In:</strong> Requires supplier and purchase price</li>
                          <li><strong>Stock Out:</strong> Records usage or sales</li>
                          <li><strong>Waste:</strong> Requires reason for disposal</li>
                          <li><strong>Transfer:</strong> Moves stock between locations</li>
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
                loadingText="Processing..."
              >
                Add Stock Entry
              </LoadingButton>
            </RightDrawerFooter>
          </form>
        </RightDrawerContent>
      </RightDrawer>
    );
  }
);

StockEntryForm.displayName = 'StockEntryForm';

export { StockEntryForm };
