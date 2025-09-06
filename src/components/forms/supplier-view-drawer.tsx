'use client';

import * as React from 'react';
import { Supplier } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { Building2, Mail, Phone, MapPin, FileText, Calendar, Edit, User, CreditCard, DollarSign, Truck, Users, File, Percent, Download } from 'lucide-react';
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
                        {supplier.description || 'No description provided'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Information
                </h3>
                
                {supplier.additional_info?.payment && 
                 (supplier.additional_info.payment.preferred_method || 
                  supplier.additional_info.payment.terms) ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Payment Method */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Preferred Method
                      </div>
                      <div className="text-sm text-foreground">
                        {supplier.additional_info.payment.preferred_method || 'No preferred method specified'}
                      </div>
                    </div>

                    {/* Payment Terms */}
                    {supplier.additional_info.payment.terms && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Terms
                        </div>
                        <div className="text-sm text-foreground">
                          {supplier.additional_info.payment.terms}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground italic">
                      Payment preferences have not been configured for this supplier
                    </p>
                  </div>
                )}
              </div>

              {/* Finance Information Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Finance Information
                </h3>
                
                {supplier.additional_info?.finance && 
                 (supplier.additional_info.finance.account_number || 
                  supplier.additional_info.finance.bank_name || 
                  supplier.additional_info.finance.currency) ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Account Number */}
                    {supplier.additional_info.finance.account_number && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Account Number
                        </div>
                        <div className="text-sm text-foreground font-mono">
                          {supplier.additional_info.finance.account_number}
                        </div>
                      </div>
                    )}

                    {/* Bank Name */}
                    {supplier.additional_info.finance.bank_name && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Bank Name
                        </div>
                        <div className="text-sm text-foreground">
                          {supplier.additional_info.finance.bank_name}
                        </div>
                      </div>
                    )}

                    {/* Currency */}
                    {supplier.additional_info.finance.currency && (
                      <div className="space-y-2 sm:col-span-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Currency
                        </div>
                        <div className="text-sm text-foreground">
                          {supplier.additional_info.finance.currency}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground italic">
                      Financial details have not been configured for this supplier
                    </p>
                  </div>
                )}
              </div>

              {/* Operations Information Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Operations Information
                </h3>
                
                {supplier.additional_info?.operations ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Lead Time */}
                    {supplier.additional_info.operations.lead_time_days && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Lead Time
                        </div>
                        <div className="text-sm text-foreground">
                          {supplier.additional_info.operations.lead_time_days} days
                        </div>
                      </div>
                    )}

                    {/* Minimum Order Quantity */}
                    {supplier.additional_info.operations.minimum_order_quantity && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Minimum Order Quantity
                        </div>
                        <div className="text-sm text-foreground">
                          {supplier.additional_info.operations.minimum_order_quantity}
                        </div>
                      </div>
                    )}

                    {/* Delivery Terms */}
                    {supplier.additional_info.operations.delivery_terms && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Delivery Terms
                        </div>
                        <div className="text-sm text-foreground">
                          {supplier.additional_info.operations.delivery_terms}
                        </div>
                      </div>
                    )}

                    {/* Delivery Address */}
                    {supplier.additional_info.operations.delivery_address && (
                      <div className="space-y-2 sm:col-span-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Delivery Address
                        </div>
                        <div className="text-sm text-foreground">
                          {supplier.additional_info.operations.delivery_address}
                        </div>
                      </div>
                    )}

                    {/* Active Status */}
                    <div className="space-y-2 sm:col-span-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Status
                      </div>
                      <div className="text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          supplier.additional_info.operations.active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                        }`}>
                          {supplier.additional_info.operations.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Truck className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground italic">
                      No operations information has been added by admin
                    </p>
                  </div>
                )}
              </div>

              {/* Contacts Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Contact Persons
                </h3>
                
                {supplier.additional_info?.contacts && supplier.additional_info.contacts.length > 0 ? (
                  <div className="space-y-4">
                    {supplier.additional_info.contacts.map((contact, index) => (
                      <div key={index} className="border border-input rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-foreground mb-2">
                              {contact.name || 'No name provided'}
                              {contact.role && (
                                <span className="text-sm text-muted-foreground ml-2">
                                  ({contact.role || 'No role specified'})
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              {contact.phone && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3 mr-2" />
                                  <a 
                                    href={`tel:${contact.phone}`}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    {contact.phone}
                                  </a>
                                </div>
                              )}
                              
                              {contact.email && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3 mr-2" />
                                  <a 
                                    href={`mailto:${contact.email}`}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    {contact.email}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground italic">
                      No contact persons have been added by admin
                    </p>
                  </div>
                )}
              </div>

              {/* Documents Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  Documents
                </h3>
                
                {supplier.additional_info?.documents && supplier.additional_info.documents.length > 0 ? (
                  <div className="space-y-3">
                    {supplier.additional_info.documents.map((document, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-input rounded-lg">
                        <div className="flex items-center space-x-3">
                          <File className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {document.name || 'No document name provided'}
                            </div>
                            {document.category && (
                              <div className="text-xs text-muted-foreground">
                                Category: {document.category || 'No category specified'}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.url && window.open(document.url, '_blank')}
                          className="flex items-center gap-2"
                          disabled={!document.url}
                        >
                          <Download className="h-4 w-4" />
                          Download {document.name || 'Document'}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <File className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground italic">
                      No documents have been uploaded by admin
                    </p>
                  </div>
                )}
              </div>

              {/* Tax Information Section */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
                  <Percent className="h-4 w-4 mr-2" />
                  Tax Information
                </h3>
                
                {supplier.additional_info?.tax ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Tax ID */}
                    {supplier.additional_info.tax.tax_id && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Tax ID / VAT Number
                        </div>
                        <div className="text-sm text-foreground font-mono">
                          {supplier.additional_info.tax.tax_id}
                        </div>
                      </div>
                    )}

                    {/* Tax Rate */}
                    {supplier.additional_info.tax.tax_rate && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Tax Rate
                        </div>
                        <div className="text-sm text-foreground">
                          {supplier.additional_info.tax.tax_rate}%
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Percent className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground italic">
                      No tax information has been added by admin
                    </p>
                  </div>
                )}
              </div>

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
