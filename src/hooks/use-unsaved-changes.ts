import { useState, useCallback } from 'react';

interface UseUnsavedChangesOptions {
  isDirty: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

interface UseUnsavedChangesReturn {
  showUnsavedDialog: boolean;
  pendingClose: boolean;
  handleClose: () => void;
  handleDiscardChanges: () => void;
  handleContinueEditing: () => void;
  handleOpenChange: (newOpen: boolean) => void;
  setShowUnsavedDialog: (show: boolean) => void;
}

/**
 * Custom hook for handling unsaved changes in forms
 * Provides consistent behavior across all form components
 */
export function useUnsavedChanges({
  isDirty,
  onOpenChange,
  onReset,
}: UseUnsavedChangesOptions): UseUnsavedChangesReturn {
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);

  // Handle close with unsaved changes check
  const handleClose = useCallback(() => {
    if (isDirty) {
      setShowUnsavedDialog(true);
      setPendingClose(true);
    } else {
      onOpenChange(false);
      onReset();
    }
  }, [isDirty, onOpenChange, onReset]);

  // Handle unsaved changes dialog actions
  const handleDiscardChanges = useCallback(() => {
    setShowUnsavedDialog(false);
    setPendingClose(false);
    onOpenChange(false);
    onReset();
  }, [onOpenChange, onReset]);

  const handleContinueEditing = useCallback(() => {
    setShowUnsavedDialog(false);
    setPendingClose(false);
  }, []);

  // Override onOpenChange to check for unsaved changes
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen && isDirty) {
      setShowUnsavedDialog(true);
      setPendingClose(true);
    } else if (newOpen) {
      setPendingClose(false);
      onOpenChange(newOpen);
    }
  }, [isDirty, onOpenChange]);

  return {
    showUnsavedDialog,
    pendingClose,
    handleClose,
    handleDiscardChanges,
    handleContinueEditing,
    handleOpenChange,
    setShowUnsavedDialog,
  };
}
