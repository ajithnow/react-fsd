import React, { useMemo, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  Pencil,
  Trash2,
  // KeyRound,
  PauseCircle,
  Play,
} from 'lucide-react';
import { DataTable, DataTableColumn, ActionsDropdown, useRBAC } from '@/shared';
import type { AdminUser, UserDataTableProps } from '../../models';
import { USER_PERMISSIONS, USER_STATUS, USER_ROUTES } from '@/features/users';
import { UserRecord } from '../../models/user.model';
import { Badge } from '@/lib/shadcn/components/ui/badge';
import { TextCell } from '@/shared/components/TextCell/TextCell';
import useRoleLabels from '@/shared/hooks/useRoleLabels';
import { authStorage } from '@/features/auth/utils';

export const UserDataTable: React.FC<UserDataTableProps> = ({
  users,
  onClickUser,
  loading = false,
  pagination,
  currentFilters,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  onView,
  onEdit,
  onDelete,
  onResetPassword,
  onSuspend,
  className,
}) => {
  const navigate = useNavigate();

  const { t } = useTranslation('users');
  const { hasPermission } = useRBAC();
  const { typeData, statusData } = useRoleLabels();

  const checkSameUser = useCallback((email: string) => {
    const user = authStorage.getUser() as { Email?: string } | undefined;
    return user?.Email === email;
  }, []);

  const renderRole = useCallback(
    (user: AdminUser) => {
      const roleKey = user.Role as keyof typeof typeData;
      const info = typeData[roleKey];
      return (
        <Badge className={info?.className}>{info?.label ?? user.Role}</Badge>
      );
    },
    [typeData]
  );

  const renderStatus = useCallback(
    (user: AdminUser) => {
      const statusKey = user.Status ? 'active' : 'suspended';
      const info = statusData[statusKey as keyof typeof statusData];
      return (
        <Badge className={info?.className}>
          {info?.label ??
            (user.Status ? t('users.active') : t('users.suspended'))}
        </Badge>
      );
    },
    [statusData, t]
  );

  const renderFirstName = (user: AdminUser) => (
    <TextCell value={user.FirstName} truncate link={`/users/${user.UserId}`} />
  );

  const renderLastName = (user: AdminUser) => (
    <TextCell value={user.LastName} truncate link={`/users/${user.UserId}`} />
  );

  const renderEmail = (user: AdminUser) => (
    <TextCell value={user.Email} truncate tooltip copyable />
  );

  const renderActionsCell = useCallback(
    (user: AdminUser) => {
      const isSameUser = checkSameUser(user.Email);
      const handleAction = (action: string) => {
        switch (action) {
          case 'view':
            if (onView) onView(user);
            else
              navigate({ to: USER_ROUTES.DETAIL, params: { id: user.UserId } });
            break;
          case 'edit':
            if (onEdit) onEdit(user);
            else
              navigate({ to: USER_ROUTES.EDIT, params: { id: user.UserId } });
            break;
          case 'reset-password':
            if (onResetPassword) onResetPassword(user);
            break;
          case 'suspend':
            if (onSuspend) onSuspend(user);
            break;
          case 'delete':
            if (onDelete) onDelete(user);
            break;
          default:
            break;
        }
      };

      const actions: {
        id: string;
        label: string;
        icon: React.ReactNode;
        onClick: () => void;
        permission?: string;
      }[] = [
        {
          id: 'view',
          label: t('users.viewDetails'),
          icon: <Eye size={16} />,
          onClick: () => handleAction('view'),
          permission: USER_PERMISSIONS.USER_READ,
        },
        // {
        //   id: 'reset-password',
        //   label: t('users.resetPassword'),
        //   icon: <KeyRound size={16} />,
        //   onClick: () => handleAction('reset-password'),
        //   permission: USER_PERMISSIONS.USER_UPDATE,
        // },
      ];

      if (!isSameUser) {
        actions.push(
          {
            id: 'delete',
            label: t('users.deleteUser'),
            icon: <Trash2 size={16} />,
            onClick: () => handleAction('delete'),
            permission: USER_PERMISSIONS.USER_DELETE,
          },
          {
            id: 'edit',
            label: t('users.editUser'),
            icon: <Pencil size={16} />,
            onClick: () => handleAction('edit'),
            permission: USER_PERMISSIONS.USER_UPDATE,
          }
        );
      }

      if (user.Status) {
        // active -> can suspend
        if (!isSameUser) {
          actions.push({
            id: 'suspend',
            label: t('users.suspendUser'),
            icon: <PauseCircle size={16} />,
            onClick: () => handleAction('suspend'),
            permission: USER_PERMISSIONS.USER_UPDATE,
          });
        }
      } else if (!isSameUser) {
        // suspended/deleted -> allow unsuspend if suspended
        actions.push({
          id: 'unsuspend',
          label: t('users.unsuspendUser'),
          icon: <Play size={16} />,
          onClick: () => handleAction('suspend'),
          permission: USER_PERMISSIONS.USER_UPDATE,
        });
      }

      return (
        <ActionsDropdown
          actions={actions.filter(
            action => !action.permission || hasPermission(action.permission)
          )}
          className='hover:cursor-pointer'
        />
      );
    },
    [
      checkSameUser,
      t,
      onView,
      navigate,
      onEdit,
      onResetPassword,
      onSuspend,
      onDelete,
      hasPermission,
    ]
  );

  const columns: DataTableColumn<UserRecord>[] = useMemo(
    () => [
      {
        id: 'FirstName',
        header: t('users.form.firstName'),
        cell: renderFirstName,
        sortable: true,
        filterable: true,
        accessor: 'FirstName',
      },
      {
        id: 'LastName',
        header: t('users.form.lastName'),
        cell: renderLastName,
        sortable: true,
        filterable: true,
        accessor: 'LastName',
      },
      {
        id: 'Email',
        header: t('users.form.email'),
        cell: renderEmail,
        sortable: true,
        filterable: true,
        accessor: 'Email',
      },
      {
        id: 'Role',
        header: t('users.role'),
        cell: renderRole,
        sortable: true,
        filterable: true,
        accessor: 'Role',
      },
      {
        id: 'Status',
        header: t('users.status'),
        cell: renderStatus,
        sortable: true,
        filterable: true,
        accessor: 'Status',
      },
      {
        id: 'actions',
        header: t('users.actions'),
        cell: renderActionsCell,
        width: '120px',
        
      },
    ],
    [renderActionsCell, t, renderRole, renderStatus]
  );

  const filterDefs = useMemo(
    () => [
      {
        id: 'search',
        label: t('users.search'),
        type: 'text' as const,
        placeholder: 'Search users...',
      },
      {
        id: 'status',
        label: t('users.status'),
        type: 'select' as const,
        options: [
          { label: t('users.allStatus'), value: 'all' },
          { label: t('users.active'), value: USER_STATUS.ACTIVE },
          { label: t('users.suspended'), value: USER_STATUS.SUSPENDED },
        ],
        placeholder: t('users.filterStatus'),
      },
    ],
    [t]
  );

  return (
    <div data-testid="user-data-table" className={className}>
      <DataTable<UserRecord>
        data={users as UserRecord[]}
        onRowClick={onClickUser ? (item) => onClickUser(item) : undefined}
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
};
