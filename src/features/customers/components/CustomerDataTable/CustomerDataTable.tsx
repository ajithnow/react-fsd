import { useMemo, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/lib/shadcn/components/ui/badge';
import {
  DataTable,
  DataTableColumn,
  PaginationInfo,
  SortConfig,
  FilterValues,
  ActionsDropdown,
} from '../../../../shared/components';
import { Customer } from '../../models/customer.model';

// Extend Customer to satisfy DataTable constraints
type CustomerRecord = Customer & Record<string, unknown>;

interface CustomerDataTableProps {
  customers: Customer[];
  loading: boolean;
  pagination: PaginationInfo;
  currentFilters: FilterValues;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: SortConfig | null) => void;
  onFilterChange: (filters: FilterValues) => void;
}

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

function StatusBadge({ status }: { status: Customer['status'] }) {
  return <Badge className={statusColors[status]}>{status}</Badge>;
}

export function CustomerDataTable({
  customers,
  loading,
  pagination,
  currentFilters,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
}: Readonly<CustomerDataTableProps>) {
  const navigate = useNavigate();

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  }, []);

  // Customer name cell renderer
  const renderCustomerCell = (customer: Customer) => (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
        {customer.firstName[0]}
        {customer.lastName[0]}
      </div>
      <div>
        <div className="font-medium">
          {customer.firstName} {customer.lastName}
        </div>
        <div className="text-sm text-muted-foreground">{customer.email}</div>
      </div>
    </div>
  );

  // Actions cell renderer
  const renderActionsCell = useCallback(
    (customer: Customer) => {
      const handleAction = (action: string) => {
        switch (action) {
          case 'view':
            // Navigate to customer detail page
            navigate({ to: '/customers/$id', params: { id: customer.id } });
            break;
          case 'edit':
            // Navigate to customer edit page
            navigate({
              to: '/customers/$id/edit',
              params: { id: customer.id },
            });
            break;
          case 'delete':
            if (
              confirm(
                `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`
              )
            ) {
              alert(
                `Delete customer: ${customer.firstName} ${customer.lastName}`
              );
            }
            break;
          default:
            break;
        }
      };

      const actions = [
        {
          id: 'view',
          label: 'View Details',
          icon: <Eye size={16} />,
          onClick: () => handleAction('view'),
        },
        {
          id: 'edit',
          label: 'Edit Customer',
          icon: <Edit size={16} />,
          onClick: () => handleAction('edit'),
        },
        {
          id: 'delete',
          label: 'Delete Customer',
          icon: <Trash2 size={16} />,
          variant: 'destructive' as const,
          separator: true,
          onClick: () => handleAction('delete'),
        },
      ];

      return (
        <ActionsDropdown
          actions={actions}
          aria-label={`Actions for ${customer.firstName} ${customer.lastName}`}
        />
      );
    },
    [navigate]
  );

  // Status cell renderer
  const renderStatusCell = (customer: Customer) => (
    <StatusBadge status={customer.status} />
  );

  // Define table columns
  const columns: DataTableColumn<CustomerRecord>[] = useMemo(
    () => [
      {
        id: 'customer',
        header: 'Customer',
        cell: renderCustomerCell,
        sortable: true,
        filterable: true,
        accessor: customer => `${customer.firstName} ${customer.lastName}`,
      },
      {
        id: 'company',
        header: 'Company',
        accessor: 'company',
        sortable: true,
        filterable: true,
      },
      {
        id: 'status',
        header: 'Status',
        cell: renderStatusCell,
        sortable: true,
        filterable: true,
        accessor: 'status',
      },
      {
        id: 'totalOrders',
        header: 'Orders',
        accessor: customer => customer.totalOrders || 0,
        sortable: true,
      },
      {
        id: 'totalSpent',
        header: 'Total Spent',
        accessor: customer => formatCurrency(customer.totalSpent || 0),
        sortable: true,
      },
      {
        id: 'lastOrderDate',
        header: 'Last Order',
        accessor: customer =>
          customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never',
        sortable: true,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: renderActionsCell,
        width: '120px',
      },
    ],
    [formatCurrency, formatDate, renderActionsCell]
  );

  // Define filter definitions
  const filterDefs = useMemo(
    () => [
      {
        id: 'search',
        label: 'Search',
        type: 'text' as const,
        placeholder: 'Search customers...',
      },
      {
        id: 'status',
        label: 'Status',
        type: 'select' as const,
        options: [
          { label: 'All Statuses', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Pending', value: 'pending' },
        ],
        placeholder: 'Filter by status',
      },
      {
        id: 'company',
        label: 'Company',
        type: 'text' as const,
        placeholder: 'Filter by company...',
      },
    ],
    []
  );

  return (
    <div data-testid="customer-data-table">
      <DataTable<CustomerRecord>
        data={customers as CustomerRecord[]}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
        filters={filterDefs}
        initialFilters={currentFilters}
        showPagination={true}
        showFilters={true}
        emptyMessage="No customers found"
        pageSizeOptions={[5, 10, 20, 50]}
        className="bg-white"
      />
    </div>
  );
}

export default CustomerDataTable;
