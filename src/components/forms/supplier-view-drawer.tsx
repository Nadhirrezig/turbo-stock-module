'use client';

import * as React from 'react';
import { Supplier } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { Building2, Mail, Phone, MapPin, FileText, Calendar, Edit, User } from 'lucide-react';
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

interface SupplierViewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onEdit?: (supplier: Supplier) => void;
}

const SupplierViewDrawer = React.forwardRef<HTMLDivElement, SupplierViewDrawerProps>(
  ({ open, onOpenChange, supplier, onEdit }, ref) => {
    const { handleClose } = useUnsavedChanges({
      isDirty: false,
      onReset: () => {},
      onOpenChange,
    });
    if (!supplier) {
      return null;
    }

    return (
      <RightDrawer open={open} onOpenChange={onOpenChange}>
        <RightDrawerContent ref={ref} maxWidth="lg">
          <RightDrawerHeader className="pb-4">
            <div className="flex items-start justify-between w-full pr-8">
              <div className="flex-1 min-w-0">
                <RightDrawerTitle className="text-lg font-semibold mb-3">
                  View Supplier
                </RightDrawerTitle>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(supplier)}
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
              {/* Basic Information Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  Supplier Information
                </h3>
                
                <div className="space-y-4">
                  {/* Supplier Name */}
                  <div>
                    <div className="text-lg font-semibold text-foreground">
                      {supplier.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Supplier ID: {supplier.id}
                    </div>
                  </div>

                  {/* Supplier Status Badge */}
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      <User className="h-4 w-4 mr-2" />
                      Active Supplier
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Email */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Email Address
                    </div>
                    <div className="text-sm">
                      {supplier.email ? (
                        <div className="flex items-center text-foreground">
                          <Mail className="h-4 w-4 mr-2" />
                          <a 
                            href={`mailto:${supplier.email}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {supplier.email}
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">No email provided</span>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Phone Number
                    </div>
                    <div className="text-sm">
                      {supplier.phone ? (
                        <div className="flex items-center text-foreground">
                          <Phone className="h-4 w-4 mr-2" />
                          <a 
                            href={`tel:${supplier.phone}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {supplier.phone}
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">No phone provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address Information
                </h3>
                
                <div className="space-y-4">
                  {/* Address */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Address
                    </div>
                    <div className="text-sm">
                      {supplier.address ? (
                        <div className="flex items-start">
                          <MapPin className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{supplier.address}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">No address provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              {supplier.description && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Additional Information
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Description */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Description
                      </div>
                      <div className="text-sm text-foreground">
                        {supplier.description}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Metadata
                </h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Created Date */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Created
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDateTime(supplier.created_at)}
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Last Updated
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDateTime(supplier.updated_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RightDrawerBody>
        </RightDrawerContent>
      </RightDrawer>
    );
  }
);

SupplierViewDrawer.displayName = 'SupplierViewDrawer';

export { SupplierViewDrawer };
