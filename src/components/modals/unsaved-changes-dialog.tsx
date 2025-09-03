'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const UnsavedChangesDialog = DialogPrimitive.Root;
const UnsavedChangesDialogTrigger = DialogPrimitive.Trigger;
const UnsavedChangesDialogPortal = DialogPrimitive.Portal;

const UnsavedChangesDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
UnsavedChangesDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const UnsavedChangesDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <UnsavedChangesDialogPortal>
    <UnsavedChangesDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </UnsavedChangesDialogPortal>
));
UnsavedChangesDialogContent.displayName = DialogPrimitive.Content.displayName;

interface UnsavedChangesDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  discardLabel?: string;
  cancelLabel?: string;
  onDiscard: () => void;
  onCancel?: () => void;
}

const UnsavedChangesDialogComponent = React.forwardRef<
  HTMLDivElement,
  UnsavedChangesDialogProps
>(({
  open,
  onOpenChange,
  title = 'Unsaved Changes',
  description = 'You have unsaved changes. Are you sure you want to close without saving?',
  discardLabel = 'Discard Changes',
  cancelLabel = 'Continue Editing',
  onDiscard,
  onCancel,
}, ref) => {
  const handleDiscard = () => {
    onDiscard();
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <UnsavedChangesDialog open={open} onOpenChange={onOpenChange}>
      <UnsavedChangesDialogContent ref={ref}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
              {title}
            </DialogPrimitive.Title>
            
            <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleDiscard}
          >
            {discardLabel}
          </Button>
        </div>
      </UnsavedChangesDialogContent>
    </UnsavedChangesDialog>
  );
});

UnsavedChangesDialogComponent.displayName = 'UnsavedChangesDialogComponent';

export {
  UnsavedChangesDialog,
  UnsavedChangesDialogTrigger,
  UnsavedChangesDialogContent,
  UnsavedChangesDialogComponent,
};
