'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Department } from '@/lib/types';
import { departmentSchema, DepartmentFormData } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface DepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
  onSubmit: (data: DepartmentFormData) => Promise<void>;
  loading?: boolean;
}

const DepartmentForm = React.forwardRef<HTMLDivElement, DepartmentFormProps>(
  ({ open, onOpenChange, department, onSubmit, loading = false }, ref) => {
    const isEditing = Boolean(department);
    
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isDirty },
      reset,
      setValue,
    } = useForm<DepartmentFormData>({
      resolver: zodResolver(departmentSchema),
      defaultValues: {
        name: '',
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

    // Reset form when department changes or modal opens/closes
    React.useEffect(() => {
      if (open) {
        if (department) {
          setValue('name', department.name);
          setValue('description', department.description || '');
        } else {
          reset({
            name: '',
            description: '',
          });
        }
      }
    }, [open, department, setValue, reset]);

    // Handle form submission
    const handleFormSubmit = async (data: DepartmentFormData) => {
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
                {isEditing ? 'Edit Department' : 'Add New Department'}
              </RightDrawerTitle>
              <RightDrawerCloseButton onClick={handleClose} />
            </RightDrawerHeader>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <RightDrawerBody>
                <div className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">
                      Department Information
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Department Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Department Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="e.g., Main Restaurant, Bar & Beverages, Kitchen"
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

                      {/* Department Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of the department's purpose and operations..."
                          rows={3}
                          {...register('description')}
                          className={errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}
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
                          Department Guidelines
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Departments help organize your inventory by operational areas</li>
                            <li>Each department can have its own units, categories, and items</li>
                            <li>Examples: Main Restaurant, Bar & Beverages, Kitchen, etc.</li>
                            <li>Create departments first, then add units and categories within them</li>
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
                  {isEditing ? 'Update Department' : 'Create Department'}
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

DepartmentForm.displayName = 'DepartmentForm';

export { DepartmentForm };
