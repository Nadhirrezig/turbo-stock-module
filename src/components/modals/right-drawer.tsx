'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, HTMLMotionProps } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const RightDrawer = DialogPrimitive.Root;

const RightDrawerTrigger = DialogPrimitive.Trigger;

const RightDrawerPortal = DialogPrimitive.Portal;

const RightDrawerClose = DialogPrimitive.Close;

const RightDrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm',
      className
    )}
    asChild
    {...props}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    />
  </DialogPrimitive.Overlay>
));
RightDrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface RightDrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const RightDrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  RightDrawerContentProps
>(({ className, children, maxWidth = '2xl', ...props }, ref) => {
  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
  };

  return (
    <RightDrawerPortal>
      <RightDrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed right-0 top-0 z-50 h-screen w-full overflow-auto bg-background shadow-xl',
          maxWidthClasses[maxWidth],
          className
        )}
        asChild
        {...props}
      >
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
            duration: 0.4
          }}
          className="h-full w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            className="h-full flex flex-col"
          >
            {children}
          </motion.div>
        </motion.div>
      </DialogPrimitive.Content>
    </RightDrawerPortal>
  );
});
RightDrawerContent.displayName = DialogPrimitive.Content.displayName;

interface RightDrawerHeaderProps extends Omit<HTMLMotionProps<"div">, "children"> {
  className?: string;
  children?: React.ReactNode;
}

const RightDrawerHeader = ({
  className,
  children,
  ...props
}: RightDrawerHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
    className={cn(
      'flex items-center justify-between px-6 py-4 border-b',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);
RightDrawerHeader.displayName = 'RightDrawerHeader';

const RightDrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-foreground',
      className
    )}
    {...props}
  />
));
RightDrawerTitle.displayName = DialogPrimitive.Title.displayName;

const RightDrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
RightDrawerDescription.displayName = DialogPrimitive.Description.displayName;

interface RightDrawerBodyProps extends Omit<HTMLMotionProps<"div">, "children"> {
  className?: string;
  children?: React.ReactNode;
}

const RightDrawerBody = ({
  className,
  children,
  ...props
}: RightDrawerBodyProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
    className={cn('px-6 py-4 flex-1', className)}
    {...props}
  >
    {children}
  </motion.div>
);
RightDrawerBody.displayName = 'RightDrawerBody';

interface RightDrawerFooterProps extends Omit<HTMLMotionProps<"div">, "children"> {
  className?: string;
  children?: React.ReactNode;
}

const RightDrawerFooter = ({
  className,
  children,
  ...props
}: RightDrawerFooterProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
    className={cn(
      'flex items-center justify-end gap-2 px-6 py-4 border-t bg-muted/50',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);
RightDrawerFooter.displayName = 'RightDrawerFooter';

const RightDrawerCloseButton = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
));
RightDrawerCloseButton.displayName = 'RightDrawerCloseButton';

export {
  RightDrawer,
  RightDrawerPortal,
  RightDrawerOverlay,
  RightDrawerTrigger,
  RightDrawerClose,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerTitle,
  RightDrawerDescription,
  RightDrawerBody,
  RightDrawerFooter,
  RightDrawerCloseButton,
};
