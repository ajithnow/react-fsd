import { useMemo } from 'react';
import { DataTable, DataTableColumn, PaginationInfo, SortConfig, FilterValues } from '../../../../shared/components/DataTable';

interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface UserDataTableProps {
  users: User[];
  loading: boolean;
  pagination: PaginationInfo;
  currentFilters: FilterValues;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: SortConfig | null) => void;
  onFilterChange: (filters: FilterValues) => void;
}

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'active'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {status}
    </span>
  );
}

export function UserDataTable({
  users,
  loading,
  pagination,
  currentFilters,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
}: UserDataTableProps) {
  // Status cell renderer
  const renderStatusCell = (user: User) => <StatusBadge status={user.status} />;

  // Define table columns
  const columns: DataTableColumn<User>[] = useMemo(() => [
    {
      id: 'id',
      header: 'ID',
      accessor: 'id',
      sortable: true,
      width: '80px',
    },
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
    },
    {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
      filterable: true,
    },
    {
      id: 'role',
      header: 'Role',
      accessor: 'role',
      sortable: true,
      filterable: true,
    },
    {
      id: 'status',
      header: 'Status',
      cell: renderStatusCell,
      sortable: true,
      filterable: true,
    },
    {
      id: 'createdAt',
      header: 'Created At',
      accessor: (user) => new Date(user.createdAt).toLocaleDateString(),
      sortable: true,
    },
  ], []);

  // Define filter definitions
  const filterDefs = useMemo(() => [
    {
      id: 'role',
      label: 'Role',
      type: 'multiselect' as const,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Manager', value: 'manager' },
      ],
      placeholder: 'Select roles',
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      placeholder: 'Select status',
    },
    {
      id: 'name',
      label: 'Name',
      type: 'text' as const,
      placeholder: 'Search by name...',
    },
  ], []);

  return (
    <div data-testid="user-data-table">
      <DataTable<User>
        data={users}
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
        emptyMessage="No users found"
        pageSizeOptions={[5, 10, 20, 50]}
        className="bg-white"
      />
    </div>
  );
}

export default UserDataTable;
