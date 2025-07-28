import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DataTable, DataTableColumn, PaginationInfo, SortConfig, FilterValues } from './index';
import { usersService } from '../../../features/home/services/users.service';

interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
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

// Example usage of the DataTable component
export function UserDataTableExample() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  
  // Consolidated state for all request parameters, initializing filters from URL
  const [requestState, setRequestState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters: FilterValues = {};
    const roleParam = params.get('role');
    if (roleParam) initialFilters.role = roleParam.split(',');
    const statusParam = params.get('status');
    if (statusParam) initialFilters.status = statusParam;
    const nameParam = params.get('name');
    if (nameParam) initialFilters.name = nameParam;
    return {
      page: 1,
      pageSize: 10,
      sortField: undefined as string | undefined,
      sortDirection: undefined as 'asc' | 'desc' | undefined,
      filters: initialFilters,
    };
  });


  // Status cell renderer
  const renderStatusCell = (user: User) => <StatusBadge status={user.status} />;

  // Define table columns
  const columns: DataTableColumn<User>[] = [
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
  ];

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

  // Handle pagination change
  const handlePageChange = useCallback((page: number) => {
    setRequestState(prev => ({ ...prev, page }));
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setRequestState(prev => ({ ...prev, page: 1, pageSize }));
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sort: SortConfig | null) => {
    setRequestState(prev => ({
      ...prev,
      sortField: sort?.field,
      sortDirection: sort?.direction,
    }));
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filters: FilterValues) => {
    setRequestState(prev => ({ ...prev, page: 1, filters }));
  }, []);
  // Sync URL when filters change
  const filtersMounted = useRef(false);
  const currentFilters = requestState.filters;
  useEffect(() => {
    if (!filtersMounted.current) {
      filtersMounted.current = true;
      return;
    }
    const params = new URLSearchParams();
    if (currentFilters.role) {
      params.set('role', Array.isArray(currentFilters.role) ? currentFilters.role.join(',') : String(currentFilters.role));
    }
    if (currentFilters.status) {
      params.set('status', String(currentFilters.status));
    }
    if (currentFilters.name) {
      params.set('name', String(currentFilters.name));
    }
    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [currentFilters]);

  // Effect to fetch data when request parameters change
  const loadData = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await usersService.getUsers({
        page: requestState.page,
        pageSize: requestState.pageSize,
        sortField: requestState.sortField,
        sortDirection: requestState.sortDirection,
        role: requestState.filters?.role as string[],
        status: requestState.filters?.status as string,
        name: requestState.filters?.name as string,
      });

      // Convert UserData to User format
      const users: User[] = response.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      }));

      setData(users);
      setPagination({
        page: response.pagination.page,
        pageSize: response.pagination.pageSize,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setData([]);
      setPagination({
        page: requestState.page,
        pageSize: requestState.pageSize,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [requestState]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <DataTable<User>
        data={data}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        filters={filterDefs}
        initialFilters={requestState.filters}
        showPagination={true}
        showFilters={true}
        emptyMessage="No users found"
        pageSizeOptions={[5, 10, 20, 50]}
        className="bg-white"
      />
    </div>
  );
}

export default UserDataTableExample;
