'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Unit } from '@/lib/types';
import { unitSchema, UnitFormData } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/shared/loading-button';
import { Button } from '@/components/ui/button';
import { UnsavedChangesDialogComponent } from '@/components/modals/unsaved-changes-dialog';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { useDepartmentContext } from '@/contexts/department-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerTitle,
  RightDrawerBody,
  RightDrawerFooter,
  RightDrawerCloseButton,
} from '@/components/modals/right-drawer';

interface UnitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit?: Unit | null;
  onSubmit: (data: UnitFormData) => Promise<void>;
  loading?: boolean;
}

const UnitForm = React.forwardRef<HTMLDivElement, UnitFormProps>(
  ({ open, onOpenChange, unit, onSubmit, loading = false }, ref) => {
    const isEditing = Boolean(unit);
    const { allDepartments, selectedDepartmentId } = useDepartmentContext();
    
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isDirty },
      reset,
      setValue,
      watch,
    } = useForm<UnitFormData>({
      resolver: zodResolver(unitSchema),
      defaultValues: {
        name: '',
        symbol: '',
        department_id: selectedDepartmentId || '',
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

    // Reset form when unit changes or modal opens/closes
    React.useEffect(() => {
      if (open) {
        if (unit) {
          setValue('name', unit.name);
          setValue('symbol', unit.symbol);
          setValue('department_id', unit.department_id);
        } else {
          reset({
            name: '',
            symbol: '',
            department_id: selectedDepartmentId || '',
          });
        }
      }
    }, [open, unit, setValue, reset, selectedDepartmentId]);

    // Handle form submission
    const handleFormSubmit = async (data: UnitFormData) => {
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
          <RightDrawerContent ref={ref} maxWidth="md">
            <RightDrawerHeader>
              <RightDrawerTitle>
                {isEditing ? 'Edit Unit' : 'Add New Unit'}
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
                    
                    <div className="space-y-4">
                      {/* Department Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="department_id">
                          Department <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={watch('department_id')}
                          onValueChange={(value) => setValue('department_id', value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger className={errors.department_id ? 'border-destructive focus-visible:ring-destructive' : ''}>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                          <SelectContent>
                            {allDepartments.map((department) => (
                              <SelectItem key={department.id} value={department.id}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.department_id && (
                          <p className="text-sm text-destructive">
                            {errors.department_id.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Unit Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Unit Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="e.g., Kilogram, Liter, Piece"
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

                        {/* Unit Symbol */}
                        <div className="space-y-2">
                          <Label htmlFor="symbol">
                            Unit Symbol <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="symbol"
                            type="text"
                            placeholder="e.g., kg, L, pcs"
                            {...register('symbol')}
                            className={errors.symbol ? 'border-destructive focus-visible:ring-destructive' : ''}
                            disabled={isLoading}
                          />
                          {errors.symbol && (
                            <p className="text-sm text-destructive">
                              {errors.symbol.message}
                            </p>
                          )}
                        </div>
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
                          Unit Guidelines
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Use clear, descriptive names for units</li>
                            <li>Keep symbols short and standardized (e.g., kg, L, pcs)</li>
                            <li>Units will be used for inventory items and stock calculations</li>
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
                  {isEditing ? 'Update Unit' : 'Create Unit'}
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

UnitForm.displayName = 'UnitForm';

export { UnitForm };
