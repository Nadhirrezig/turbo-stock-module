'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/loading-button';

const ConfirmationDialog = DialogPrimitive.Root;

const ConfirmationDialogTrigger = DialogPrimitive.Trigger;

const ConfirmationDialogPortal = DialogPrimitive.Portal;


const ConfirmationDialogOverlay = React.forwardRef<
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
ConfirmationDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ConfirmationDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ConfirmationDialogPortal>
    <ConfirmationDialogOverlay />
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
  </ConfirmationDialogPortal>
));
ConfirmationDialogContent.displayName = DialogPrimitive.Content.displayName;

interface ConfirmationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  variant?: 'default' | 'destructive';
}

const ConfirmationDialogComponent = React.forwardRef<
  HTMLDivElement,
  ConfirmationDialogProps
>(({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'default',
}, ref) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <ConfirmationDialog open={open} onOpenChange={onOpenChange}>
      <ConfirmationDialogContent ref={ref}>
        <div className="flex items-start space-x-4">
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            variant === 'destructive' 
              ? 'bg-destructive/10 text-destructive' 
              : 'bg-primary/10 text-primary'
          )}>
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
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          
          <LoadingButton
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmLabel}
          </LoadingButton>
        </div>
      </ConfirmationDialogContent>
    </ConfirmationDialog>
  );
});

ConfirmationDialogComponent.displayName = 'ConfirmationDialogComponent';

export {
  ConfirmationDialog,
  ConfirmationDialogTrigger,
  ConfirmationDialogContent,
  ConfirmationDialogComponent,
};
