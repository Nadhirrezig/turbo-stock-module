'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Supplier } from '@/lib/types';
import { supplierSchema, SupplierFormData,} from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingButton } from '@/components/shared/loading-button';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/shared/file-upload';
import { UnsavedChangesDialogComponent } from '@/components/modals/unsaved-changes-dialog';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerTitle,
  RightDrawerBody,
  RightDrawerFooter,
  RightDrawerCloseButton,
} from '@/components/modals/right-drawer';

interface SupplierFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier | null;
  onSubmit: (data: SupplierFormData) => Promise<void>;
  loading?: boolean;
}

const SupplierForm = React.forwardRef<HTMLDivElement, SupplierFormProps>(
  ({ open, onOpenChange, supplier, onSubmit, loading = false }, ref) => {
    const isEditing = Boolean(supplier);
    const [showAdvancedDetails, setShowAdvancedDetails] = React.useState(false);
    
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isDirty },
      reset,
      setValue,
      watch,
      control,
    } = useForm<SupplierFormData>({
      resolver: zodResolver(supplierSchema),
      defaultValues: {
        name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        additional_info: undefined, // Start with no additional info
      },
    });

    const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
      control,
      name: 'additional_info.contacts',
    });

    const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({
      control,
      name: 'additional_info.documents',
    });

    // Tax is a single object, not an array like contacts and documents

    // Watch payment method to show/hide finance fields
    const paymentMethod = watch('additional_info.payment.preferred_method');
    const deliveryTerms = watch('additional_info.operations.delivery_terms');

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

    // Reset form when supplier changes or modal opens/closes
    React.useEffect(() => {
      if (open) {
        if (supplier) {
          setValue('name', supplier.name);
          setValue('email', supplier.email || '');
          setValue('phone', supplier.phone || '');
          setValue('address', supplier.address || '');
          setValue('description', supplier.description || '');
          
          // Set additional info if it exists
          if (supplier.additional_info) {
            // Convert DocumentWithUrl to Document for form
            const formAdditionalInfo = {
              ...supplier.additional_info,
              documents: supplier.additional_info.documents?.map(doc => ({
                name: doc.name,
                file: new File([], doc.name), // Create empty file for existing documents
                type: doc.type,
                category: doc.category,
              })) || []
            };
            setValue('additional_info', formAdditionalInfo);
            setShowAdvancedDetails(true);
          } else {
            setShowAdvancedDetails(false);
          }
        } else {
          reset({
            name: '',
            email: '',
            phone: '',
            address: '',
            description: '',
            additional_info: undefined, // Start with no additional info
          });
          setShowAdvancedDetails(false);
        }
      }
    }, [open, supplier, setValue, reset]);

    // Handle form submission
    const handleFormSubmit = async (data: SupplierFormData) => {
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
          <RightDrawerContent ref={ref} maxWidth="lg">
            <RightDrawerHeader>
              <RightDrawerTitle>
                {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
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
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Supplier Name */}
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="name">
                          Supplier Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="e.g., Coffee Beans Co., Fresh Dairy Ltd."
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

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="supplier@example.com"
                          {...register('email')}
                          className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                          disabled={isLoading}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1-555-0123"
                          {...register('phone')}
                          className={errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
                          disabled={isLoading}
                        />
                        {errors.phone && (
                          <p className="text-sm text-destructive">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">
                      Address Information
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Address */}
                      <div className="space-y-2">
                        <Label htmlFor="address">
                          Address
                        </Label>
                        <textarea
                          id="address"
                          rows={3}
                          placeholder="Street address, city, state, postal code"
                          {...register('address')}
                          className={`flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none ${
                            errors.address ? 'border-destructive focus-visible:ring-destructive' : ''
                          }`}
                          disabled={isLoading}
                        />
                        {errors.address && (
                          <p className="text-sm text-destructive">
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Brand/Description Section */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">
                      Brand Information
                    </h3>

                    <div className="space-y-4">
                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Description
                        </Label>
                        <textarea
                          id="description"
                          rows={3}
                          placeholder="Brief description of this supplier/brand..."
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

                  {/* Advanced Details Toggle */}
                  <div className="border-t pt-6">
                    <motion.div
                      whileHover={{ 
                        scale: 1.02,
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative"
                    >
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 opacity-0"
                        animate={{ 
                          opacity: showAdvancedDetails ? 0.3 : 0,
                          scale: showAdvancedDetails ? 1.05 : 1
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          if (!showAdvancedDetails && !watch('additional_info')) {
                            // Initialize additional_info when first opening advanced details
                            setValue('additional_info', {
                              finance: {
                                account_number: '',
                                bank_name: '',
                                currency: '',
                              },
                              payment: {
                                preferred_method: 'Cash',
                                terms: '',
                              },
                              contacts: [],
                              operations: {
                                lead_time_days: undefined,
                                minimum_order_quantity: undefined,
                                delivery_terms: '',
                                delivery_address: '',
                                active: true,
                              },
                              documents: [],
                              tax: {
                                tax_id: '',
                                tax_rate: undefined,
                              },
                            });
                          }
                          setShowAdvancedDetails(!showAdvancedDetails);
                        }}
                        className="relative flex items-center gap-2 p-3 h-auto font-medium text-foreground hover:text-primary rounded-lg border border-transparent hover:border-primary/20 transition-all duration-300"
                      >
                        <motion.div
                          animate={{ 
                            rotate: showAdvancedDetails ? 90 : 0,
                            scale: showAdvancedDetails ? 1.1 : 1
                          }}
                          transition={{ 
                            duration: 0.3, 
                            ease: "easeInOut",
                            scale: { type: "spring", stiffness: 400, damping: 17 }
                          }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showAdvancedDetails ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </motion.div>
                        Advanced Details
                        <span className="text-sm text-muted-foreground ml-2">
                          (Payment, Finance, Operations, Documents)
                        </span>
                      </Button>
                    </motion.div>
                  </div>

                  {/* Advanced Details Section */}
                  <AnimatePresence>
                    {showAdvancedDetails && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 25,
                          duration: 0.4
                        }}
                        className="space-y-6"
                      >
                      {/* Payment Information */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-foreground mb-4">
                          Payment Information
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Payment Method */}
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="payment_method">
                              Preferred Payment Method <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={paymentMethod || 'Cash'}
                              onValueChange={(value) => setValue('additional_info.payment.preferred_method', value as 'Cash' | 'COD' | 'Bank Transfer' | 'Credit')}
                            >
                              <SelectTrigger className="transition-colors border border-input bg-background hover:bg-accent hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer">
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Credit">Credit</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.additional_info?.payment?.preferred_method && (
                              <p className="text-sm text-destructive">
                                {errors.additional_info.payment.preferred_method.message}
                              </p>
                            )}
                          </div>

                          {/* Payment Terms */}
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="payment_terms">
                              Payment Terms
                            </Label>
                            <Input
                              id="payment_terms"
                              type="text"
                              placeholder="e.g., Net 30, COD terms"
                              {...register('additional_info.payment.terms')}
                              className={errors.additional_info?.payment?.terms ? 'border-destructive focus-visible:ring-destructive' : ''}
                              disabled={isLoading}
                            />
                            {errors.additional_info?.payment?.terms && (
                              <p className="text-sm text-destructive">
                                {errors.additional_info.payment.terms.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Finance Information - Only show for Bank Transfer */}
                      <AnimatePresence>
                        {paymentMethod === 'Bank Transfer' && (
                          <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                              duration: 0.3
                            }}
                          >
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h3 className="text-sm font-medium text-foreground mb-4">
                                Finance Information
                              </h3>
                              
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Account Number */}
                                <div className="space-y-2">
                                  <Label htmlFor="account_number">
                                    Account Number <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    id="account_number"
                                    type="text"
                                    placeholder="Bank account number or IBAN"
                                    {...register('additional_info.finance.account_number')}
                                    className={errors.additional_info?.finance?.account_number ? 'border-destructive focus-visible:ring-destructive' : ''}
                                    disabled={isLoading}
                                  />
                                  {errors.additional_info?.finance?.account_number && (
                                    <p className="text-sm text-destructive">
                                      {errors.additional_info.finance.account_number.message}
                                    </p>
                                  )}
                                </div>

                                {/* Bank Name */}
                                <div className="space-y-2">
                                  <Label htmlFor="bank_name">
                                    Bank Name <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    id="bank_name"
                                    type="text"
                                    placeholder="Bank name"
                                    {...register('additional_info.finance.bank_name')}
                                    className={errors.additional_info?.finance?.bank_name ? 'border-destructive focus-visible:ring-destructive' : ''}
                                    disabled={isLoading}
                                  />
                                  {errors.additional_info?.finance?.bank_name && (
                                    <p className="text-sm text-destructive">
                                      {errors.additional_info.finance.bank_name.message}
                                    </p>
                                  )}
                                </div>

                                {/* Currency */}
                                <div className="space-y-2 sm:col-span-2">
                                  <Label htmlFor="currency">
                                    Currency
                                  </Label>
                                  <Input
                                    id="currency"
                                    type="text"
                                    placeholder="e.g., TND, USD, EUR"
                                    {...register('additional_info.finance.currency')}
                                    className={errors.additional_info?.finance?.currency ? 'border-destructive focus-visible:ring-destructive' : ''}
                                    disabled={isLoading}
                                  />
                                  {errors.additional_info?.finance?.currency && (
                                    <p className="text-sm text-destructive">
                                      {errors.additional_info.finance.currency.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>


                      {/* Operations Information */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-foreground mb-4">
                          Operations Information
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Lead Time */}
                          <div className="space-y-2">
                            <Label htmlFor="lead_time">
                              Lead Time (Days)
                            </Label>
                            <Input
                              id="lead_time"
                              type="number"
                              min="0"
                              placeholder="e.g., 7"
                              {...register('additional_info.operations.lead_time_days', { valueAsNumber: true })}
                              className={errors.additional_info?.operations?.lead_time_days ? 'border-destructive focus-visible:ring-destructive' : ''}
                              disabled={isLoading}
                            />
                            {errors.additional_info?.operations?.lead_time_days && (
                              <p className="text-sm text-destructive">
                                {errors.additional_info.operations.lead_time_days.message}
                              </p>
                            )}
                          </div>

                          {/* Minimum Order Quantity */}
                          <div className="space-y-2">
                            <Label htmlFor="min_order_qty">
                              Minimum Order Quantity
                            </Label>
                            <Input
                              id="min_order_qty"
                              type="number"
                              min="0"
                              placeholder="e.g., 100"
                              {...register('additional_info.operations.minimum_order_quantity', { valueAsNumber: true })}
                              className={errors.additional_info?.operations?.minimum_order_quantity ? 'border-destructive focus-visible:ring-destructive' : ''}
                              disabled={isLoading}
                            />
                            {errors.additional_info?.operations?.minimum_order_quantity && (
                              <p className="text-sm text-destructive">
                                {errors.additional_info.operations.minimum_order_quantity.message}
                              </p>
                            )}
                          </div>

                          {/* Delivery Terms */}
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="delivery_terms">
                              Delivery Terms
                            </Label>
                            <Input
                              id="delivery_terms"
                              placeholder="e.g., Supplier delivers to our warehouse, We pickup from supplier location, Third-party courier service..."
                              value={deliveryTerms || ''}
                              onChange={(e) => setValue('additional_info.operations.delivery_terms', e.target.value)}
                              disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                              Describe the delivery arrangement between you and this supplier
                            </p>
                            {errors.additional_info?.operations?.delivery_terms && (
                              <p className="text-sm text-destructive">
                                {errors.additional_info.operations.delivery_terms.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contacts */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-foreground">
                            Contact Persons
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendContact({ name: '', role: '', phone: '', email: '' })}
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Contact
                          </Button>
                        </div>
                        
                        {contactFields.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic">
                            No contacts added. Click &quot;Add Contact&quot; to add contact persons.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            <AnimatePresence>
                              {contactFields.map((field, index) => (
                                <motion.div
                                  key={field.id}
                                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                  transition={{ 
                                    type: "spring", 
                                    stiffness: 300, 
                                    damping: 25,
                                    duration: 0.3
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  className="border border-input rounded-lg p-4"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-foreground">
                                      Contact {index + 1}
                                    </h4>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeContact(index)}
                                        disabled={isLoading}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  </div>
                                
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                  {/* Contact Name */}
                                  <div className="space-y-2">
                                    <Label htmlFor={`contact_name_${index}`}>
                                      Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                      id={`contact_name_${index}`}
                                      type="text"
                                      placeholder="Contact person name"
                                      {...register(`additional_info.contacts.${index}.name`, {
                                        required: 'Contact name is required',
                                        minLength: { value: 1, message: 'Contact name is required' }
                                      })}
                                      className={errors.additional_info?.contacts?.[index]?.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                                      disabled={isLoading}
                                    />
                                    {errors.additional_info?.contacts?.[index]?.name && (
                                      <p className="text-sm text-destructive">
                                        {errors.additional_info.contacts[index]?.name?.message}
                                      </p>
                                    )}
                                  </div>

                                  {/* Contact Role */}
                                  <div className="space-y-2">
                                    <Label htmlFor={`contact_role_${index}`}>
                                      Role
                                    </Label>
                                    <Input
                                      id={`contact_role_${index}`}
                                      type="text"
                                      placeholder="e.g., Sales Manager, Account Manager"
                                      {...register(`additional_info.contacts.${index}.role`)}
                                      disabled={isLoading}
                                    />
                                  </div>

                                  {/* Contact Phone */}
                                  <div className="space-y-2">
                                    <Label htmlFor={`contact_phone_${index}`}>
                                      Phone
                                    </Label>
                                    <Input
                                      id={`contact_phone_${index}`}
                                      type="tel"
                                      placeholder="+1-555-0123"
                                      {...register(`additional_info.contacts.${index}.phone`)}
                                      className={errors.additional_info?.contacts?.[index]?.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
                                      disabled={isLoading}
                                    />
                                    {errors.additional_info?.contacts?.[index]?.phone && (
                                      <p className="text-sm text-destructive">
                                        {errors.additional_info.contacts[index]?.phone?.message}
                                      </p>
                                    )}
                                  </div>

                                  {/* Contact Email */}
                                  <div className="space-y-2">
                                    <Label htmlFor={`contact_email_${index}`}>
                                      Email
                                    </Label>
                                    <Input
                                      id={`contact_email_${index}`}
                                      type="email"
                                      placeholder="contact@example.com"
                                      {...register(`additional_info.contacts.${index}.email`, {
                                        pattern: {
                                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                          message: 'Invalid email address'
                                        }
                                      })}
                                      className={errors.additional_info?.contacts?.[index]?.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                                      disabled={isLoading}
                                    />
                                    {errors.additional_info?.contacts?.[index]?.email && (
                                      <p className="text-sm text-destructive">
                                        {errors.additional_info.contacts[index]?.email?.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Documents */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-foreground">
                            Documents
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendDocument({ name: '', file: new File([], ''), type: '', category: 'contract' })}
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Document
                          </Button>
                        </div>
                        
                        {documentFields.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic">
                            No documents added. Click &quot;Add Document&quot; to upload files.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            <AnimatePresence>
                              {documentFields.map((field, index) => (
                                <motion.div
                                  key={field.id}
                                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                  transition={{ 
                                    type: "spring", 
                                    stiffness: 300, 
                                    damping: 25,
                                    duration: 0.3
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  className="border border-input rounded-lg p-4"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-foreground">
                                      Document {index + 1}
                                    </h4>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeDocument(index)}
                                        disabled={isLoading}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  </div>
                                
                                <div className="space-y-4">
                                  {/* Document Name */}
                                  <div className="space-y-2">
                                    <Label htmlFor={`document_name_${index}`}>
                                      Document Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                      id={`document_name_${index}`}
                                      type="text"
                                      placeholder="e.g., Contract Agreement, Certificate"
                                      {...register(`additional_info.documents.${index}.name`, {
                                        required: 'Document name is required',
                                        minLength: { value: 1, message: 'Document name is required' }
                                      })}
                                      className={errors.additional_info?.documents?.[index]?.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                                      disabled={isLoading}
                                    />
                                    {errors.additional_info?.documents?.[index]?.name && (
                                      <p className="text-sm text-destructive">
                                        {errors.additional_info.documents[index]?.name?.message}
                                      </p>
                                    )}
                                  </div>

                                  {/* Document Category */}
                                  <div className="space-y-2">
                                    <Label htmlFor={`document_category_${index}`}>
                                      Category
                                    </Label>
                                    <Select
                                      value={watch(`additional_info.documents.${index}.category`) || 'contract'}
                                      onValueChange={(value) => setValue(`additional_info.documents.${index}.category`, value as 'contract' | 'certificate' | 'invoice')}
                                    >
                                      <SelectTrigger className="transition-colors border border-input bg-background hover:bg-accent hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer">
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="certificate">Certificate</SelectItem>
                                        <SelectItem value="invoice">Invoice</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* File Upload */}
                                  <div className="space-y-2">
                                    <Label>
                                      File <span className="text-destructive">*</span>
                                    </Label>
                                    <FileUpload
                                      onFileSelect={(file) => setValue(`additional_info.documents.${index}.file`, file)}
                                      onFileRemove={() => setValue(`additional_info.documents.${index}.file`, new File([], ''))}
                                      selectedFile={watch(`additional_info.documents.${index}.file`)}
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                      maxSize={10}
                                      disabled={isLoading}
                                    />
                                    {errors.additional_info?.documents?.[index]?.file && (
                                      <p className="text-sm text-destructive">
                                        {errors.additional_info.documents[index]?.file?.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Tax Information */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-foreground mb-4">
                          Tax Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Tax ID */}
                          <div className="space-y-2">
                            <Label htmlFor="tax_id">
                              Tax ID / VAT Number
                            </Label>
                            <Input
                              id="tax_id"
                              type="text"
                              placeholder="Tax identification number"
                              {...register('additional_info.tax.tax_id')}
                              disabled={isLoading}
                            />
                            {errors.additional_info?.tax?.tax_id && (
                              <p className="text-sm text-destructive">
                                {errors.additional_info.tax.tax_id.message}
                              </p>
                            )}
                          </div>

                          {/* Tax Rate */}
                          <div className="space-y-2">
                            <Label htmlFor="tax_rate">
                              Tax Rate (%)
                            </Label>
                            <Input
                              id="tax_rate"
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              placeholder="e.g., 19.00"
                              {...register('additional_info.tax.tax_rate', { valueAsNumber: true })}
                              className={errors.additional_info?.tax?.tax_rate ? 'border-destructive focus-visible:ring-destructive' : ''}
                              disabled={isLoading}
                            />
                            {errors.additional_info?.tax?.tax_rate && (
                              <p className="text-sm text-destructive">
                                {errors.additional_info.tax.tax_rate.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                          Supplier Guidelines
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Provide accurate contact information for ordering</li>
                            <li>Email and phone are optional but recommended</li>
                            <li>Suppliers can be assigned as preferred for inventory items</li>
                            <li>Advanced details are optional - use for complex supplier relationships</li>
                            <li>Bank Transfer requires account number and bank name</li>
                            <li>Delivery address is required when delivery terms is &quot;Delivery&quot;</li>
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
                  {isEditing ? 'Update Supplier' : 'Create Supplier'}
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

SupplierForm.displayName = 'SupplierForm';

export { SupplierForm };
