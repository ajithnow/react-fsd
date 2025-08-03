import { useState, useCallback, useRef, useEffect } from 'react';
import {
  useCustomersQuery,
  CustomersQueryParams,
} from '../queries/customers.query';
import {
  FilterValues,
  SortConfig,
  PaginationInfo,
} from '../../../shared/components/DataTable';

export interface CustomersManagerState {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filters: FilterValues;
}

export const useCustomersManager = (initialFilters: FilterValues = {}) => {
  // Consolidated state for all request parameters
  const [requestState, setRequestState] = useState<CustomersManagerState>({
    page: 1,
    pageSize: 10,
    sortField: undefined,
    sortDirection: undefined,
    filters: initialFilters,
  });

  // Create query parameters from state
  const queryParams: CustomersQueryParams = {
    page: requestState.page,
    pageSize: requestState.pageSize,
    sortField: requestState.sortField,
    sortDirection: requestState.sortDirection,
    search: requestState.filters?.search as string,
    status: requestState.filters?.status as string,
    company: requestState.filters?.company as string,
  };

  // Use the customers query
  const { data: response, isLoading, error } = useCustomersQuery(queryParams);

  // Transform response data
  const customers =
    response?.data.map(customer => ({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      status: customer.status,
      avatar: customer.avatar,
      address: customer.address,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,
      lastOrderDate: customer.lastOrderDate,
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
    if (requestState.filters.search)
      params.set('search', String(requestState.filters.search));
    if (requestState.filters.status && requestState.filters.status !== 'all') {
      params.set('status', String(requestState.filters.status));
    }
    if (requestState.filters.company)
      params.set('company', String(requestState.filters.company));

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [requestState.filters]);

  return {
    customers,
    pagination,
    loading: isLoading,
    error,
    currentFilters: requestState.filters,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleFilterChange,
  };
};
