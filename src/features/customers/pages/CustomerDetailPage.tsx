import React from 'react';
import { Link, useParams, Navigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Edit,
} from 'lucide-react';
import { Button } from '@/lib/shadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/lib/shadcn/components/ui/card';
import { Badge } from '@/lib/shadcn/components/ui/badge';
import { Separator } from '@/lib/shadcn/components/ui/separator';
import { getCustomerById } from '../mocks';

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export const CustomerDetailPage: React.FC = () => {
  const params = useParams({ strict: false });
  const id = params.id as string;
  const customer = getCustomerById(id);

  if (!customer) {
    return <Navigate to="/customers" replace />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatShortDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[customer.status]}>
            {customer.status}
          </Badge>
          <Button asChild>
            <Link to={`/customers/${customer.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Customer Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>
              Basic details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {customer.firstName[0]}
                {customer.lastName[0]}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {customer.firstName} {customer.lastName}
                </h3>
                <p className="text-muted-foreground">{customer.company}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {formatShortDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {customer.address && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <div className="text-sm text-muted-foreground">
                        <p>{customer.address.street}</p>
                        <p>
                          {customer.address.city}, {customer.address.state}{' '}
                          {customer.address.zipCode}
                        </p>
                        <p>{customer.address.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customer.totalOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {customer.lastOrderDate
                  ? `Last order: ${formatShortDate(customer.lastOrderDate)}`
                  : 'No orders yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(customer.totalSpent || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {customer.totalOrders && customer.totalOrders > 0
                  ? `Avg: ${formatCurrency((customer.totalSpent || 0) / customer.totalOrders)} per order`
                  : 'No purchases yet'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Customer profile updated</p>
                <p className="text-xs text-muted-foreground">
                  Updated on {formatDate(customer.updatedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Customer account created</p>
                <p className="text-xs text-muted-foreground">
                  Created on {formatDate(customer.createdAt)}
                </p>
              </div>
            </div>
            {customer.lastOrderDate && (
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Last order placed</p>
                  <p className="text-xs text-muted-foreground">
                    Ordered on {formatDate(customer.lastOrderDate)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
