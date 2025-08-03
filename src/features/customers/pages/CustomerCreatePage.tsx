import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
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

export const CustomerCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CustomerFormData) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log('Creating customer:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate back to customers list after successful creation
      navigate({ to: '/customers' });
    } catch (error) {
      console.error('Error creating customer:', error);
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/customers">
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Customer
          </h1>
          <p className="text-muted-foreground">
            Add a new customer to your database.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new customer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm
            mode="create"
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};
