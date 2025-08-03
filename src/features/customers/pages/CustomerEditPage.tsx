import React, { useState } from 'react';
import { Link, useParams, Navigate, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/lib/shadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/lib/shadcn/components/ui/card';
import { CustomerForm, CustomerFormData } from '../components/CustomerForm';
import { getCustomerById } from '../mocks';

export const CustomerEditPage: React.FC = () => {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const id = params.id as string;
  const customer = getCustomerById(id);

  const handleSubmit = async (data: CustomerFormData) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log('Updating customer:', { id, data });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate back to customer detail page after successful update
      navigate({ to: '/customers/$id', params: { id } });
    } catch (error) {
      console.error('Error updating customer:', error);
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsLoading(false);
    }
  };

  if (!customer) {
    return <Navigate to="/customers" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/customers/$id" params={{ id }}>
            <ArrowLeft className="h-4 w-4" />
            Back to Customer Details
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit Customer: {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-muted-foreground">
            Update customer information and details.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>
            Update the customer details below. All changes will be saved when
            you submit the form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm
            mode="edit"
            initialData={customer}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};
