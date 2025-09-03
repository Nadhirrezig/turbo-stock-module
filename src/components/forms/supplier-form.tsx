'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Supplier } from '@/lib/types';
import { supplierSchema, SupplierFormData } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/shared/loading-button';
import { Button } from '@/components/ui/button';
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

interface SupplierFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier | null;
  onSubmit: (data: SupplierFormData) => Promise<void>;
  loading?: boolean;
}

const SupplierForm = React.forwardRef<HTMLDivElement, SupplierFormProps>(
  ({ open, onOpenChange, supplier, onSubmit, loading = false }, ref) => {
    const isEditing = Boolean(supplier);
    
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isDirty },
      reset,
      setValue,
    } = useForm<SupplierFormData>({
      resolver: zodResolver(supplierSchema),
      defaultValues: {
        name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
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

    // Reset form when supplier changes or modal opens/closes
    React.useEffect(() => {
      if (open) {
        if (supplier) {
          setValue('name', supplier.name);
          setValue('email', supplier.email || '');
          setValue('phone', supplier.phone || '');
          setValue('address', supplier.address || '');
          setValue('description', supplier.description || '');
        } else {
          reset({
            name: '',
            email: '',
            phone: '',
            address: '',
            description: '',
          });
        }
      }
    }, [open, supplier, setValue, reset]);

    // Handle form submission
    const handleFormSubmit = async (data: SupplierFormData) => {
      try {
        await onSubmit(data);
        onOpenChange(false);
        reset();
      } catch (error) {
        console.error('Form submission error:', error);
      }
    };

    const isLoading = loading || isSubmitting;

    return (
      <>
        <RightDrawer open={open} onOpenChange={handleOpenChange}>
          <RightDrawerContent ref={ref} maxWidth="lg">
            <RightDrawerHeader>
              <RightDrawerTitle>
                {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
              </RightDrawerTitle>
              <RightDrawerCloseButton onClick={handleClose} />
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
                      {/* Supplier Name */}
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="name">
                          Supplier Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="e.g., Coffee Beans Co., Fresh Dairy Ltd."
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

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="supplier@example.com"
                          {...register('email')}
                          className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                          disabled={isLoading}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1-555-0123"
                          {...register('phone')}
                          className={errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
                          disabled={isLoading}
                        />
                        {errors.phone && (
                          <p className="text-sm text-destructive">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">
                      Address Information
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Address */}
                      <div className="space-y-2">
                        <Label htmlFor="address">
                          Address
                        </Label>
                        <textarea
                          id="address"
                          rows={3}
                          placeholder="Street address, city, state, postal code"
                          {...register('address')}
                          className={`flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none ${
                            errors.address ? 'border-destructive focus-visible:ring-destructive' : ''
                          }`}
                          disabled={isLoading}
                        />
                        {errors.address && (
                          <p className="text-sm text-destructive">
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Brand/Description Section */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">
                      Brand Information
                    </h3>

                    <div className="space-y-4">
                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Description
                        </Label>
                        <textarea
                          id="description"
                          rows={3}
                          placeholder="Brief description of this supplier/brand..."
                          {...register('description')}
                          className={`flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none ${
                            errors.description ? 'border-destructive focus-visible:ring-destructive' : ''
                          }`}
                          disabled={isLoading}
                        />
                        {errors.description && (
                          <p className="text-sm text-destructive">
                            {errors.description.message}
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
                          Supplier Guidelines
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Provide accurate contact information for ordering</li>
                            <li>Email and phone are optional but recommended</li>
                            <li>Suppliers can be assigned as preferred for inventory items</li>
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
                  {isEditing ? 'Update Supplier' : 'Create Supplier'}
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

SupplierForm.displayName = 'SupplierForm';

export { SupplierForm };
