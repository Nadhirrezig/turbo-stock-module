'use client';

import * as React from 'react';
import { InventoryMovement } from '@/lib/types';
import { formatDateTime, formatCurrency, formatNumber, getTransactionTypeLabel, getTransactionTypeColor } from '@/lib/utils';
import { ArrowDown, ArrowUp, Trash2, ArrowRightLeft, Package, Calendar, Building, FileText, AlertTriangle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerTitle,
  RightDrawerBody,
  RightDrawerCloseButton,
} from '@/components/modals/right-drawer';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';

interface MovementViewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement: InventoryMovement | null;
  onEdit?: (movement: InventoryMovement) => void;
}

const MovementViewDrawer = React.forwardRef<HTMLDivElement, MovementViewDrawerProps>(
  ({ open, onOpenChange, movement, onEdit }, ref) => {
    const { handleClose } = useUnsavedChanges({
      onOpenChange,
      isDirty: false,
      onReset: () => {},
    });
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

    if (!movement) {
      return null;
    }

    return (
      <RightDrawer open={open} onOpenChange={onOpenChange}>
        <RightDrawerContent ref={ref} maxWidth="lg">
          <RightDrawerHeader className="pb-4">
            <div className="flex items-start justify-between w-full pr-8">
              <div className="flex-1 min-w-0">
                <RightDrawerTitle className="text-lg font-semibold mb-3">
                  View Movement
                </RightDrawerTitle>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(movement)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Update
                  </Button>
                )}
              </div>
            </div>
            <RightDrawerCloseButton onClick={handleClose} />
          </RightDrawerHeader>

          <RightDrawerBody>
            <div className="space-y-6">
              {/* Item Information Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Item Information
                </h3>
                
                <div className="space-y-4">
                  {/* Item Name */}
                  <div>
                    <div className="text-lg font-semibold text-foreground">
                      {movement.inventory_item?.name || 'Unknown Item'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {movement.inventory_item?.category?.name || 'No Category'}
                    </div>
                  </div>

                  {/* Transaction Status Badge */}
                  <div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTransactionTypeColor(movement.transaction_type)}`}>
                      {getTransactionIcon(movement.transaction_type)}
                      <span className="ml-2">{getTransactionTypeLabel(movement.transaction_type)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Details Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Transaction Details
                </h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Quantity */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Quantity
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {movement.transaction_type === 'OUT' || movement.transaction_type === 'WASTE' ? '-' : '+'}
                      {formatNumber(movement.quantity)} {movement.inventory_item?.unit?.symbol || ''}
                    </div>
                  </div>

                  {/* Unit Purchase Price */}
                  {movement.unit_purchase_price !== undefined && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Unit Purchase Price
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {movement.unit_purchase_price ? formatCurrency(movement.unit_purchase_price) : '0.00'} USD / {movement.inventory_item?.unit?.symbol || 'unit'}
                      </div>
                    </div>
                  )}

                  {/* Date & Time */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Date & Time
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDateTime(movement.created_at)}
                    </div>
                  </div>

                  {/* Added By */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Added By
                    </div>
                    <div className="text-sm text-muted-foreground">
                      John Doe {/* This would come from user data in real implementation */}
                    </div>
                  </div>

                  {/* Source Branch */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Source Branch
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Bechtelarfurt {/* This would come from branch data in real implementation */}
                    </div>
                  </div>

                  {/* Supplier (for IN transactions) */}
                  {movement.supplier && movement.transaction_type === 'IN' && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Supplier
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-foreground flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          {movement.supplier.name}
                        </div>
                        {movement.supplier.email && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {movement.supplier.email}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Destination Branch (for TRANSFER transactions) */}
                  {movement.destination_branch_id && movement.transaction_type === 'TRANSFER' && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Destination Branch
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        {movement.destination_branch_id}
                      </div>
                    </div>
                  )}

                  {/* Expiration Date */}
                  {movement.expiration_date && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Expiration Date
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(movement.expiration_date)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information Section */}
              {(movement.waste_reason || movement.notes) && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Additional Information
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Waste Reason (for WASTE transactions) */}
                    {movement.waste_reason && movement.transaction_type === 'WASTE' && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1 text-destructive" />
                          Waste Reason
                        </div>
                        <div className="text-sm text-destructive font-medium">
                          {movement.waste_reason}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {movement.notes && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Notes
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {movement.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </RightDrawerBody>
        </RightDrawerContent>
      </RightDrawer>
    );
  }
);

MovementViewDrawer.displayName = 'MovementViewDrawer';

export { MovementViewDrawer };
