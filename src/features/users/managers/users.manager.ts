import { useCallback, useMemo, useState, useEffect } from 'react';
import { useUserMutations } from '../queries/users.query';
import { useNavigate } from '@tanstack/react-router';
import type { AdminUser } from '../models';
import type {
  PaginationInfo,
  SortConfig,
  FilterValues,
} from '@/shared/components';

export const useUserTableLogic = () => {
  const [mounted, setMounted] = useState(false);

  const [currentFilters, setCurrentFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      ...(params.get('search') ? { search: params.get('search')! } : {}),
      ...(params.get('status') && params.get('status') !== 'all'
        ? { status: params.get('status')! }
        : {}),
    };
  });
  const [pageState, setPageState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      page: parseInt(params.get('page') || '1'),
      pageSize: parseInt(params.get('pageSize') || '10'),
    };
  });
  const [sortConfig, setSortConfig] = useState<
    (SortConfig & { field: keyof AdminUser }) | null
  >(null);

  const { updateUser, deleteUser, resetPassword, useListUsersQuery } =
    useUserMutations();
  const { data: usersData, isLoading, error } = useListUsersQuery();

  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams();

    if (currentFilters.search) {
      params.set('search', String(currentFilters.search));
    }
    if (currentFilters.status && currentFilters.status !== 'all') {
      params.set('status', String(currentFilters.status));
    }
    params.set('page', String(pageState.page));
    params.set('pageSize', String(pageState.pageSize));

    const queryString = params.toString();
    window.history.replaceState(
      {},
      '',
      window.location.pathname + (queryString ? '?' + queryString : '')
    );
  }, [mounted, currentFilters, pageState]);

  // Filtering & Sorting
  const filteredAndSortedUsers = useMemo(() => {
    let filteredUsers = usersData?.data?.users || [];

    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        user =>
          user.FirstName.toLowerCase().includes(searchTerm) ||
          user.Email.toLowerCase().includes(searchTerm) || user.LastName.toLowerCase().includes(searchTerm)
      );
    }
    if (currentFilters.status && currentFilters.status !== 'all') {
      const statusBoolean = currentFilters.status === 'active';
      filteredUsers = filteredUsers.filter(
        user => user.Status === statusBoolean
      );
    }
    if (sortConfig?.field) {
      const { field, direction } = sortConfig;
      filteredUsers = [...filteredUsers].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (aVal == null || bVal == null) return 0;
    
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
          const aLabel = aVal ? 'Active' : 'Suspended';
          const bLabel = bVal ? 'Active' : 'Suspended';
          return direction === 'asc'
            ? aLabel.localeCompare(bLabel)
            : bLabel.localeCompare(aLabel);
        }
    
        return 0;
      });
    }
    
    return filteredUsers;
  }, [usersData?.data?.users, currentFilters, sortConfig]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const start = (pageState.page - 1) * pageState.pageSize;
    return filteredAndSortedUsers.slice(start, start + pageState.pageSize);
  }, [filteredAndSortedUsers, pageState]);

  const pagination: PaginationInfo = useMemo(() => {
    const total = filteredAndSortedUsers.length;
    return {
      page: pageState.page,
      pageSize: pageState.pageSize,
      total,
      totalPages: Math.ceil(total / pageState.pageSize),
    };
  }, [filteredAndSortedUsers.length, pageState]);

  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setPageState(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPageState({ page: 1, pageSize });
  }, []);

  const handleSortChange = useCallback((sort: SortConfig | null) => {
    if (sort) {
      setSortConfig({
        ...sort,
        field: sort.field as keyof AdminUser,
      });
    } else {
      setSortConfig(null);
    }
  }, []);

  const handleFilterChange = useCallback(

    (filters: FilterValues) => {
      setCurrentFilters(prevFilters => {
        // Check if filters actually changed
        const filtersChanged =
          JSON.stringify(prevFilters) !== JSON.stringify(filters);
        if (filtersChanged && mounted) {
          setPageState(prev => ({ ...prev, page: 1 }));
        }
        return filters;
      });
    },
    
    [mounted]
    
  );

  const handleDeleteUser = useCallback(
    async (user: AdminUser) => {
      try {
        await deleteUser.mutateAsync(user.UserId);
      } catch (err) {
        console.error('Delete user error:', err);
      }
    },
    [deleteUser]
  );

  const handleResetPassword = useCallback(
    async (user: AdminUser) => {
      try {
        const result = await resetPassword.mutateAsync(user.UserId);
        // Show a simple alert for now; callers can override UI as needed
        alert(
          `Password reset successful. Temporary password: ${result.temporaryPassword}`
        );
      } catch (err) {
        console.error('Reset password error:', err);
        alert('Failed to reset password');
      }
    },
    [resetPassword]
  );

  // Navigation & actions that were previously on the page
  const handleCreate = useCallback(() => {
    navigate({ to: '/users/create' });
  }, [navigate]);

  const handleView = useCallback(
    (user: AdminUser) => {
      navigate({ to: '/users/$id', params: { id: user.UserId } });
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (user: AdminUser) => {
      navigate({ to: '/users/$id/edit', params: { id: user.UserId } });
    },
    [navigate]
  );

  const handleSuspend = useCallback(
    async (user: AdminUser) => {
      try {
        const payload = {
          userId: user.UserId,
          status: !user.Status,
        } as unknown as Parameters<typeof updateUser.mutateAsync>[0];
        await updateUser.mutateAsync(payload);
      } catch (err) {
        console.error('Failed to toggle suspend from list:', err);
      }
    },
    [updateUser]
  );

  const handleUpdate = useCallback(
    async (user: AdminUser) => {
      try {
        const payload = {
          userId: user.UserId,
          status: !user.Status,
        } as unknown as Parameters<typeof updateUser.mutateAsync>[0];
        await updateUser.mutateAsync(payload);
      } catch (err) {
        console.error('Failed to update user:', err);
      }
    },
    [updateUser]
  );

  return {
    users: paginatedUsers,
    loading: isLoading,
    error,
    pagination,
    currentFilters,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    onSortChange: handleSortChange,
    onFilterChange: handleFilterChange,
    onDelete: handleDeleteUser,
    onResetPassword: handleResetPassword,
    onSuspend: handleSuspend,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onView: handleView,
    onEdit: handleEdit,
  };
};
