import React from 'react';
import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/lib/shadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/lib/shadcn/components/ui/card';
import { FilterValues } from '@/shared/components';
import { useCustomersManager } from '../managers';
import { CustomerDataTable } from '../components/CustomerDataTable';
import { useCustomerStatsQuery } from '../queries/customers.query';

export const CustomersListPage: React.FC = () => {
  const { t } = useTranslation('customers');

  // Initialize filters from URL
  const getInitialFilters = (): FilterValues => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters: FilterValues = {};
    const searchParam = params.get('search');
    if (searchParam) initialFilters.search = searchParam;
    const statusParam = params.get('status');
    if (statusParam) initialFilters.status = statusParam;
    const companyParam = params.get('company');
    if (companyParam) initialFilters.company = companyParam;
    return initialFilters;
  };

  // Use the customers manager hook at page level
  const {
    customers,
    pagination,
    loading,
    currentFilters,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleFilterChange,
  } = useCustomersManager(getInitialFilters());

  // Get customer statistics
  const { data: stats, isLoading: statsLoading } = useCustomerStatsQuery();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('customers.list.title', 'Customers')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'customers.list.subtitle',
              'Manage your customer relationships and track their activity.'
            )}
          </p>
        </div>
        <Button asChild>
          <Link to="/customers/create">
            <Plus className="mr-2 h-4 w-4" />
            {t('customers.list.createCustomer', 'Add Customer')}
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('customers.list.totalCustomers', 'Total Customers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats?.totalCustomers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor((stats?.totalCustomers || 0) * 0.1)} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('customers.list.activeCustomers', 'Active Customers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats?.activeCustomers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalCustomers
                ? Math.round(
                    (stats.activeCustomers / stats.totalCustomers) * 100
                  )
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : formatCurrency(stats?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats?.totalOrders || 0} orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading
                ? '...'
                : formatCurrency(stats?.averageOrderValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per order across all customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            View, filter, and manage your customers with advanced data table
            features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerDataTable
            customers={customers}
            loading={loading}
            pagination={pagination}
            currentFilters={currentFilters}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
