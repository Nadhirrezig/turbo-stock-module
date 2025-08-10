'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InventoryItemCategory } from '@/lib/types';
import { inventoryItemCategorySchema, InventoryItemCategoryFormData } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/shared/loading-button';
import { Button } from '@/components/ui/button';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerTitle,
  RightDrawerBody,
  RightDrawerFooter,
  RightDrawerCloseButton,
} from '@/components/modals/right-drawer';

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: InventoryItemCategory | null;
  onSubmit: (data: InventoryItemCategoryFormData) => Promise<void>;
  loading?: boolean;
}

const CategoryForm = React.forwardRef<HTMLDivElement, CategoryFormProps>(
  ({ open, onOpenChange, category, onSubmit, loading = false }, ref) => {
    const isEditing = Boolean(category);
    
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
      setValue,
    } = useForm<InventoryItemCategoryFormData>({
      resolver: zodResolver(inventoryItemCategorySchema),
      defaultValues: {
        name: '',
        description: '',
      },
    });

    // Reset form when category changes or modal opens/closes
    React.useEffect(() => {
      if (open) {
        if (category) {
          setValue('name', category.name);
          setValue('description', category.description || '');
        } else {
          reset({
            name: '',
            description: '',
          });
        }
      }
    }, [open, category, setValue, reset]);

    const handleFormSubmit = async (data: InventoryItemCategoryFormData) => {
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
        <RightDrawerContent ref={ref} maxWidth="md">
          <RightDrawerHeader>
            <RightDrawerTitle>
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </RightDrawerTitle>
            <RightDrawerCloseButton />
          </RightDrawerHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <RightDrawerBody>
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Category Information
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Category Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Category Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g., Beverages, Dairy Products, Bakery Items"
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

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description
                      </Label>
                      <textarea
                        id="description"
                        rows={3}
                        placeholder="Brief description of this category..."
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
                        Category Guidelines
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Use clear, descriptive names for categories</li>
                          <li>Categories help organize and filter inventory items</li>
                          <li>Add descriptions to clarify what items belong in each category</li>
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
                {isEditing ? 'Update Category' : 'Create Category'}
              </LoadingButton>
            </RightDrawerFooter>
          </form>
        </RightDrawerContent>
      </RightDrawer>
    );
  }
);

CategoryForm.displayName = 'CategoryForm';

export { CategoryForm };
