import { useMemo } from 'react';
import { DataTable, DataTableColumn, PaginationInfo, SortConfig, FilterValues, ActionsDropdown } from '../../../../shared/components';
import { PERMISSIONS } from '../../../../shared/utils/rbac.utils';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';

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
function ActionsDropdownForUser({ user }: { user: User }) {
  const handleAction = (action: string) => {
    switch (action) {
      case 'edit':
        alert(`Edit user: ${user.name}`);
        break;
      case 'delete':
        alert(`Delete user: ${user.name}`);
        break;
      case 'view':
        alert(`View user details: ${user.name}`);
        break;
      default:
        break;
    }
  };

  const actions = [
    {
      id: 'view',
      label: 'View',
      icon: <IconEye size={16} />,
      onClick: () => handleAction('view'),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <IconEdit size={16} />,
      permission: PERMISSIONS.USERS_UPDATE,
      onClick: () => handleAction('edit'),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <IconTrash size={16} />,
      permission: PERMISSIONS.USERS_DELETE,
      variant: 'destructive' as const,
      separator: true,
      onClick: () => handleAction('delete'),
    },
  ];

  return <ActionsDropdown actions={actions} aria-label={`Actions for ${user.name}`} />;
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
  // Actions cell renderer with RBAC dropdown
  const renderActionsCell = (user: User) => <ActionsDropdownForUser user={user} />;

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
    {
      id: 'actions',
      header: 'Actions',
      cell: renderActionsCell,
      width: '150px',
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
