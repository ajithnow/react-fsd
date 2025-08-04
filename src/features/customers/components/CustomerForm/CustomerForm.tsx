import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/lib/shadcn/components/ui/button';
import { Input } from '@/lib/shadcn/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/shadcn/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/shadcn/components/ui/form';
import { SharedAlertDialog, useAlertDialog } from '@/shared/components';
import { CustomerFormProps, CustomerFormData } from '../../models';
import { customerFormSchema } from '../../schema';

export const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  mode,
}) => {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      company: initialData?.company || '',
      status: initialData?.status || 'active',
      address: {
        street: initialData?.address?.street || '',
        city: initialData?.address?.city || '',
        state: initialData?.address?.state || '',
        zipCode: initialData?.address?.zipCode || '',
        country: initialData?.address?.country || '',
      },
    },
  });

  const { isOpen: isAlertOpen, showAlert, hideAlert } = useAlertDialog();

  const handleSubmit = (data: CustomerFormData) => {
    // For edit mode, show confirmation dialog first
    if (mode === 'edit') {
      showAlert();
      return;
    }

    // For create mode, submit directly
    submitForm(data);
  };

  const submitForm = (data: CustomerFormData) => {
    // Clean up the data before submission
    const cleanedData = {
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
      company: data.company?.trim() || undefined,
      address:
        data.address && Object.values(data.address).some(val => val?.trim())
          ? {
              street: data.address.street?.trim() || undefined,
              city: data.address.city?.trim() || undefined,
              state: data.address.state?.trim() || undefined,
              zipCode: data.address.zipCode?.trim() || undefined,
              country: data.address.country?.trim() || undefined,
            }
          : undefined,
    };

    onSubmit(cleanedData);
  };

  const handleConfirmUpdate = () => {
    const formData = form.getValues();
    submitForm(formData);
    hideAlert();
  };

  const handleReset = () => {
    form.reset();
  };

  // Watch form state for better UX
  const isFormValid = form.formState.isValid;
  const isDirty = form.formState.isDirty;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      {...field}
                      type="tel"
                    />
                  </FormControl>
                  <FormDescription>
                    Include country code (e.g., +1 555-123-4567)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company */}
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The company or organization this customer represents
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Street */}
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ZIP Code */}
              <FormField
                control={form.control}
                name="address.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ZIP code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the full country name (e.g., United States, Canada,
                      etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : mode === 'create' ? (
                'Create Customer'
              ) : (
                'Update Customer'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading || !isDirty}
            >
              Reset Form
            </Button>
            {isDirty && (
              <p className="text-sm text-muted-foreground self-center">
                You have unsaved changes
              </p>
            )}
          </div>
        </form>
      </Form>

      {/* Update Confirmation Dialog */}
      <SharedAlertDialog
        open={isAlertOpen}
        onOpenChange={hideAlert}
        title="Update Customer"
        description="Are you sure you want to update this customer's information? This action will save all changes permanently."
        confirmText="Update Customer"
        cancelText="Cancel"
        onConfirm={handleConfirmUpdate}
        variant="default"
      />
    </>
  );
};
