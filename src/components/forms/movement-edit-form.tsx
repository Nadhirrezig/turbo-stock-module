'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InventoryMovement } from '@/lib/types';

// Custom type for the form to handle number inputs properly
type MovementEditFormData = {
  inventory_item_id: string;
  transaction_type: 'IN' | 'OUT' | 'WASTE' | 'TRANSFER';
  quantity: number;
  unit_purchase_price?: number;
  supplier_id?: string;
  destination_branch_id?: string;
  waste_reason?: string;
  notes?: string;
  expiration_date?: string;
};
import { mockSuppliers } from '@/lib/mock-data';
import { SearchableSelectOption, Supplier } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/shared/loading-button';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/shared/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import { getTransactionTypeLabel, getTransactionTypeColor } from '@/lib/utils';
import { ArrowDown, ArrowUp, Trash2, ArrowRightLeft } from 'lucide-react';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerTitle,
  RightDrawerBody,
  RightDrawerFooter,
  RightDrawerCloseButton,
} from '@/components/modals/right-drawer';

// Adapter function to convert supplier to SearchableSelectOption
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

interface MovementEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement: InventoryMovement | null;
  onSubmit: (data: MovementEditFormData) => Promise<void>;
  loading?: boolean;
}

const MovementEditForm = React.forwardRef<HTMLDivElement, MovementEditFormProps>(
  ({ open, onOpenChange, movement, onSubmit, loading = false }, ref) => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors, isSubmitting },
      reset,
    } = useForm<MovementEditFormData>({
      // Note: Using basic validation instead of zodResolver due to type conflicts
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

    const transactionType = movement?.transaction_type;

    const getTransactionIcon = (type: string) => {
      switch (type) {
        case 'IN':
          return <ArrowDown className="h-4 w-4" />;
        case 'OUT':
          return <ArrowUp className="h-4 w-4" />;
        case 'WASTE':
          return <Trash2 className="h-4 w-4" />;
        case 'TRANSFER':
          return <ArrowRightLeft className="h-4 w-4" />;
        default:
          return null;
      }
    };

    // Reset form when modal opens/closes or movement changes
    React.useEffect(() => {
      if (open && movement) {
        reset({
          inventory_item_id: movement.inventory_item_id,
          transaction_type: movement.transaction_type,
          quantity: movement.quantity,
          unit_purchase_price: movement.unit_purchase_price || 0,
          supplier_id: movement.supplier_id || '',
          destination_branch_id: movement.destination_branch_id || '',
          waste_reason: movement.waste_reason || '',
          notes: movement.notes || '',
          expiration_date: movement.expiration_date || '',
        });
      }
    }, [open, movement, reset]);

    const handleFormSubmit = async (data: MovementEditFormData) => {
      try {
        await onSubmit(data);
        onOpenChange(false);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    };

    const handleClose = () => {
      onOpenChange(false);
    };

    const isLoading = loading || isSubmitting;

    if (!movement) {
      return null;
    }

    return (
      <RightDrawer open={open} onOpenChange={onOpenChange}>
        <RightDrawerContent ref={ref} maxWidth="lg">
          <RightDrawerHeader>
            <RightDrawerTitle>
              Edit Movement
            </RightDrawerTitle>
            <RightDrawerCloseButton />
          </RightDrawerHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <RightDrawerBody>
              <div className="space-y-6">
                {/* Read-only Item Information */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Item Information (Read-only)
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Item Name
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {movement.inventory_item?.name || 'Unknown Item'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Category
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {movement.inventory_item?.category?.name || 'N/A'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Transaction Type
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(movement.transaction_type)}`}>
                        {getTransactionIcon(movement.transaction_type)}
                        <span className="ml-1">{getTransactionTypeLabel(movement.transaction_type)} (Cannot be changed)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editable Transaction Details */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Editable Fields
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Quantity - Editable for all transaction types */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity">
                        Quantity <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="quantity"
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          {...register('quantity', { valueAsNumber: true })}
                          className={errors.quantity ? 'border-destructive focus-visible:ring-destructive' : ''}
                          disabled={isLoading}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-sm text-muted-foreground">
                            {movement.inventory_item?.unit?.symbol || ''}
                          </span>
                        </div>
                      </div>
                      {errors.quantity && (
                        <p className="text-sm text-destructive">
                          {errors.quantity.message}
                        </p>
                      )}
                    </div>

                    {/* Supplier - Only editable for IN transactions */}
                    {transactionType === 'IN' && (
                      <div className="space-y-2">
                        <Label htmlFor="supplier_id">
                          Supplier
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

                    {/* Destination Branch - Only editable for TRANSFER transactions */}
                    {transactionType === 'TRANSFER' && (
                      <div className="space-y-2">
                        <Label htmlFor="destination_branch_id">
                          Destination Branch
                        </Label>
                        <Input
                          id="destination_branch_id"
                          type="text"
                          placeholder="Enter destination branch"
                          {...register('destination_branch_id')}
                          className={errors.destination_branch_id ? 'border-destructive focus-visible:ring-destructive' : ''}
                          disabled={isLoading}
                        />
                        {errors.destination_branch_id && (
                          <p className="text-sm text-destructive">
                            {errors.destination_branch_id.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Waste Reason - Only editable for WASTE transactions */}
                    {transactionType === 'WASTE' && (
                      <div className="space-y-2">
                        <Label htmlFor="waste_reason">
                          Waste Reason
                        </Label>
                        <Input
                          id="waste_reason"
                          type="text"
                          placeholder="Reason for waste (e.g., expired, damaged)"
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

                    {/* Notes - Editable for all transaction types */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="notes">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes about this transaction..."
                        rows={3}
                        {...register('notes')}
                        className={errors.notes ? 'border-destructive focus-visible:ring-destructive' : ''}
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

                {/* Field Restrictions Info */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Edit Restrictions
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <ul className="list-disc list-inside space-y-1">
                          <li><strong>Stock IN:</strong> Can edit quantity and supplier information</li>
                          <li><strong>Stock OUT:</strong> Can edit quantity only</li>
                          <li><strong>Transfer:</strong> Can edit quantity and destination branch</li>
                          <li><strong>Waste:</strong> Can edit quantity and waste reason</li>
                          <li>Item name, category, transaction type, and date cannot be changed</li>
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
                disabled={isLoading}
              >
                Update Movement
              </LoadingButton>
            </RightDrawerFooter>
          </form>
        </RightDrawerContent>
      </RightDrawer>
    );
  }
);

MovementEditForm.displayName = 'MovementEditForm';

export { MovementEditForm };
