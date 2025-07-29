import { useState, useCallback, useRef, useEffect } from 'react';
import { useUsersQuery, UsersQueryParams } from '../queries/users.query';
import { FilterValues, SortConfig, PaginationInfo } from '../../../shared/components/DataTable';

export interface UsersManagerState {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filters: FilterValues;
}

export const useUsersManager = (initialFilters: FilterValues = {}) => {
  // Consolidated state for all request parameters
  const [requestState, setRequestState] = useState<UsersManagerState>({
    page: 1,
    pageSize: 10,
    sortField: undefined,
    sortDirection: undefined,
    filters: initialFilters,
  });

  // Create query parameters from state
  const queryParams: UsersQueryParams = {
    page: requestState.page,
    pageSize: requestState.pageSize,
    sortField: requestState.sortField,
    sortDirection: requestState.sortDirection,
    role: requestState.filters?.role as string[],
    status: requestState.filters?.status as string,
    name: requestState.filters?.name as string,
  };

  // Use the users query
  const { data: response, isLoading, error } = useUsersQuery(queryParams);

  // Transform response data
  const users = response?.data.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  })) || [];

  const pagination: PaginationInfo = response?.pagination || {
    page: requestState.page,
    pageSize: requestState.pageSize,
    total: 0,
    totalPages: 0,
  };

  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setRequestState(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setRequestState(prev => ({ ...prev, page: 1, pageSize }));
  }, []);

  const handleSortChange = useCallback((sort: SortConfig | null) => {
    setRequestState(prev => ({
      ...prev,
      sortField: sort?.field,
      sortDirection: sort?.direction,
    }));
  }, []);

  const handleFilterChange = useCallback((filters: FilterValues) => {
    setRequestState(prev => ({ ...prev, page: 1, filters }));
  }, []);

  // URL sync for filters
  const filtersMounted = useRef(false);
  useEffect(() => {
    // Skip URL sync on initial mount to prevent unnecessary re-renders
    if (!filtersMounted.current) {
      filtersMounted.current = true;
      return;
    }

    const params = new URLSearchParams();
    if (requestState.filters.role) {
      params.set('role', Array.isArray(requestState.filters.role) ? requestState.filters.role.join(',') : String(requestState.filters.role));
    }
    if (requestState.filters.status) {
      params.set('status', String(requestState.filters.status));
    }
    if (requestState.filters.name) {
      params.set('name', String(requestState.filters.name));
    }
    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [requestState.filters]);

  return {
    // Data
    users,
    pagination,
    loading: isLoading,
    error,
    
    // Current state
    currentFilters: requestState.filters,
    
    // Handlers
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleFilterChange,
  };
};
