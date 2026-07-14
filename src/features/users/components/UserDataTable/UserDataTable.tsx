import React, { useMemo, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Eye, Pencil, Trash2, PauseCircle, Play } from 'lucide-react';
import {
  ResourceDataTable,
  DataTableColumn,
  useRBAC,
  TextCell,
} from '@/shared';
import type { ActionItem } from '@/shared/components/ActionsDropdown/actionDropdown.types';
import type { AdminUser, UserDataTableProps, UserRecord } from '../../types';
import { USER_PERMISSIONS, USER_STATUS, USER_ROUTES } from '@/features/users';
import { Badge } from '@/lib/shadcn/components/ui/badge';
import useRoleLabels from '@/shared/hooks/useRoleLabels';

function FirstNameCell({ user }: { user: AdminUser }) {
  return (
    <TextCell
      value={user.FirstName}
      truncate
      link={`/users/${user.UserId}`}
    />
  );
}

function LastNameCell({ user }: { user: AdminUser }) {
  return (
    <TextCell value={user.LastName} truncate link={`/users/${user.UserId}`} />
  );
}

function EmailCell({ user }: { user: AdminUser }) {
  return <TextCell value={user.Email} truncate tooltip copyable />;
}

function RoleCell({
  user,
  typeData,
}: {
  user: AdminUser;
  typeData: ReturnType<typeof useRoleLabels>['typeData'];
}) {
  const roleKey = user.Role as keyof typeof typeData;
  const info = typeData[roleKey];
  return (
    <Badge className={info?.className}>{info?.label ?? user.Role}</Badge>
  );
}

function StatusCell({
  user,
  statusData,
  activeLabel,
  suspendedLabel,
}: {
  user: AdminUser;
  statusData: ReturnType<typeof useRoleLabels>['statusData'];
  activeLabel: string;
  suspendedLabel: string;
}) {
  const statusKey = user.Status ? 'active' : 'suspended';
  const info = statusData[statusKey as keyof typeof statusData];
  return (
    <Badge className={info?.className}>
      {info?.label ?? (user.Status ? activeLabel : suspendedLabel)}
    </Badge>
  );
}

/**
 * Users feature table — domain columns/actions over shared ResourceDataTable.
 */
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
  const { hasPermission, user: sessionUser } = useRBAC();
  const { typeData, statusData } = useRoleLabels();

  const isSessionUser = useCallback(
    (email: string) => sessionUser?.email === email,
    [sessionUser]
  );

  const columns: DataTableColumn<UserRecord>[] = useMemo(
    () => [
      {
        id: 'FirstName',
        header: t('users.form.firstName'),
        cell: user => <FirstNameCell user={user} />,
        sortable: true,
        filterable: true,
        accessor: 'FirstName',
      },
      {
        id: 'LastName',
        header: t('users.form.lastName'),
        cell: user => <LastNameCell user={user} />,
        sortable: true,
        filterable: true,
        accessor: 'LastName',
      },
      {
        id: 'Email',
        header: t('users.form.email'),
        cell: user => <EmailCell user={user} />,
        sortable: true,
        filterable: true,
        accessor: 'Email',
      },
      {
        id: 'Role',
        header: t('users.role'),
        cell: user => <RoleCell user={user} typeData={typeData} />,
        sortable: true,
        filterable: true,
        accessor: 'Role',
      },
      {
        id: 'Status',
        header: t('users.status'),
        cell: user => (
          <StatusCell
            user={user}
            statusData={statusData}
            activeLabel={t('users.active')}
            suspendedLabel={t('users.suspended')}
          />
        ),
        sortable: true,
        filterable: true,
        accessor: 'Status',
      },
    ],
    [t, typeData, statusData]
  );

  const getActions = useCallback(
    (user: AdminUser): ActionItem[] => {
      const sameUser = isSessionUser(user.Email);

      const run = (action: string) => {
        switch (action) {
          case 'view':
            if (onView) onView(user);
            else
              void navigate({
                to: USER_ROUTES.DETAIL,
                params: { id: user.UserId },
              });
            break;
          case 'edit':
            if (onEdit) onEdit(user);
            else
              void navigate({
                to: USER_ROUTES.EDIT,
                params: { id: user.UserId },
              });
            break;
          case 'reset-password':
            onResetPassword?.(user);
            break;
          case 'suspend':
            onSuspend?.(user);
            break;
          case 'delete':
            onDelete?.(user);
            break;
          default:
            break;
        }
      };

      const actions: (ActionItem & { permission?: string })[] = [
        {
          id: 'view',
          label: t('users.viewDetails'),
          icon: <Eye size={16} />,
          onClick: () => run('view'),
          permission: USER_PERMISSIONS.USER_READ,
        },
      ];

      if (!sameUser) {
        actions.push(
          {
            id: 'delete',
            label: t('users.deleteUser'),
            icon: <Trash2 size={16} />,
            onClick: () => run('delete'),
            permission: USER_PERMISSIONS.USER_DELETE,
          },
          {
            id: 'edit',
            label: t('users.editUser'),
            icon: <Pencil size={16} />,
            onClick: () => run('edit'),
            permission: USER_PERMISSIONS.USER_UPDATE,
          }
        );

        if (user.Status) {
          actions.push({
            id: 'suspend',
            label: t('users.suspendUser'),
            icon: <PauseCircle size={16} />,
            onClick: () => run('suspend'),
            permission: USER_PERMISSIONS.USER_UPDATE,
          });
        } else {
          actions.push({
            id: 'unsuspend',
            label: t('users.unsuspendUser'),
            icon: <Play size={16} />,
            onClick: () => run('suspend'),
            permission: USER_PERMISSIONS.USER_UPDATE,
          });
        }
      }

      return actions
        .filter(
          action => !action.permission || hasPermission(action.permission)
        )
        .map(({ permission: _permission, ...action }) => action);
    },
    [
      isSessionUser,
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

  const filters = useMemo(
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
    <ResourceDataTable<UserRecord>
      data={users as UserRecord[]}
      columns={columns}
      loading={loading}
      pagination={pagination}
      currentFilters={currentFilters}
      filters={filters}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onSortChange={onSortChange}
      onFilterChange={onFilterChange}
      onRowClick={onClickUser}
      getActions={getActions}
      actionsHeader={t('users.actions')}
      emptyMessage="No users found"
      className={className}
      testId="user-data-table"
    />
  );
};
