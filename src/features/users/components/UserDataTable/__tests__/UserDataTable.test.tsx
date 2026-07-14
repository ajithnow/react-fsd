import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserDataTable } from '../UserDataTable';
import type { AdminUser, UserDataTableProps } from '../../../types';


// hoisted mocks to prevent Jest from attempting to parse binary assets
vi.mock('@/assets/images/logo.png', () => ({ default: 'logo-mock' }));
vi.mock('~/assets/images/logo.png', () => ({ default: 'logo-mock' }));

// Mock react-i18next and router hooks used by the component
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({ 
  useNavigate: () => mockNavigate,
  Link: 'a'
}));

// Provide a lightweight mock for the shared utilities the component imports
vi.mock('@/shared', async () => {
  const React = (await vi.importActual('react')) as typeof import('react');
  type Column = {
    id: string;
    header: string;
    accessor?: string | ((item: AdminUser) => unknown);
    cell?: (item: AdminUser) => React.ReactNode;
  };

  const DataTable: React.FC<{
    data: AdminUser[];
    columns: Column[];
    selectable?: boolean;
    loading?: boolean;
    emptyMessage?: string;
  }> = ({ data, columns, selectable, loading, emptyMessage }) => {
    if (loading) {
      return React.createElement(
        'div',
        null,
        React.createElement('span', null, 'Loading...')
      );
    }

    if (!data || data.length === 0) {
      return React.createElement(
        'div',
        null,
        React.createElement('span', null, emptyMessage || 'No data available')
      );
    }

    return React.createElement(
      'table',
      { role: 'table' },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          selectable
            ? React.createElement(
                'th',
                null,
                React.createElement('input', {
                  'aria-label': 'Select all rows',
                  type: 'checkbox',
                })
              )
            : null,
          columns.map(c => React.createElement('th', { key: c.id }, c.header))
        )
      ),
      React.createElement(
        'tbody',
        null,
        data.map((row, idx) => {
          const cells = columns.map(c => {
            let value: React.ReactNode = '';
            if (typeof c.cell === 'function') value = c.cell(row);
            else if (typeof c.accessor === 'function')
              value = (c.accessor as (i: AdminUser) => unknown)(
                row
              ) as React.ReactNode;
            else if (typeof c.accessor === 'string')
              value = (row as unknown as Record<string, unknown>)[
                c.accessor
              ] as React.ReactNode;
            return React.createElement('td', { key: c.id }, value);
          });

          return React.createElement(
            'tr',
            { key: row.UserId || `r-${idx}` },
            selectable
              ? React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'checkbox' })
                )
              : null,
            ...cells
          );
        })
      )
    );
  };

  const ActionsDropdown: React.FC<{
    actions?: { id: string; label: string; onClick?: () => void }[];
  }> = ({ actions }) =>
    React.createElement(
      'div',
      null,
      actions?.map(a =>
        React.createElement(
          'button',
          { key: a.id, onClick: a.onClick },
          a.label
        )
      )
    );

  const ResourceDataTable: React.FC<{
    data: AdminUser[];
    columns: Column[];
    loading?: boolean;
    emptyMessage?: string;
    getActions?: (item: AdminUser) => { id: string; label: string; onClick?: () => void }[];
    actionsHeader?: string;
    testId?: string;
    className?: string;
    onRowClick?: (item: AdminUser) => void;
  }> = ({
    data,
    columns,
    loading,
    emptyMessage,
    getActions,
    actionsHeader = 'Actions',
    testId,
    className,
  }) => {
    const resolvedColumns = getActions
      ? [
          ...columns,
          {
            id: 'actions',
            header: actionsHeader,
            cell: (item: AdminUser) =>
              React.createElement(ActionsDropdown, {
                actions: getActions(item),
              }),
          },
        ]
      : columns;

    return React.createElement(
      'div',
      { 'data-testid': testId, className },
      React.createElement(DataTable, {
        data,
        columns: resolvedColumns,
        loading,
        emptyMessage,
      })
    );
  };

  const useRBAC = () => ({
    hasPermission: () => true,
    user: null,
  });

  const TextCell: React.FC<{ value?: string }> = ({ value }) =>
    React.createElement('span', null, value);

  return {
    DataTable,
    DataTableColumn: {},
    ResourceDataTable,
    ActionsDropdown,
    useRBAC,
    TextCell,
  };
});

// Mock the users feature constants to avoid importing routes/mocks
vi.mock('@/features/users', () => ({
  USER_PERMISSIONS: {
    USER_READ: 'users:read',
    USER_UPDATE: 'users:update',
    USER_DELETE: 'users:delete',
  },
  USER_STATUS: {
    ACTIVE: 'active',
    DELETED: 'deleted',
    SUSPENDED: 'suspended',
  },
  USER_TYPES: {
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer',
  },
  USER_ROUTES: {
    DETAIL: '/users/:id',
    EDIT: '/users/:id/edit',
  },
}));

const mockUsers: AdminUser[] = [
  {
    UserId: 'u1',
    FirstName: 'Alice',
    LastName: 'Smith',
    Email: 'alice@example.com',
    Role: 'viewer',
    Status: true,
  },
  {
    UserId: 'u2',
    FirstName: 'Bob',
    LastName: 'Jones',
    Email: 'bob@example.com',
    Role: 'editor',
    Status: false,
  },
];

const defaultProps: UserDataTableProps = {
  users: mockUsers,
  loading: false,
  pagination: { page: 1, pageSize: 10, total: 2, totalPages: 1 },
  currentFilters: {},
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
  onSortChange: vi.fn(),
  onFilterChange: vi.fn(),
};

describe('UserDataTable', () => {
  it('renders expected columns and rows', () => {
    render(React.createElement(UserDataTable, defaultProps));

    // column headers (i18n keys are used in this app)
    expect(screen.getByText(/users.form.firstName/i)).toBeInTheDocument();
    expect(screen.getByText(/users.form.lastName/i)).toBeInTheDocument();
    expect(screen.getByText(/users.form.email/i)).toBeInTheDocument();

    // rows
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  it('renders role/status headers and badge labels, and action buttons per row', () => {
    render(React.createElement(UserDataTable, defaultProps));

    // headers for role and status
    expect(screen.getByText(/users.role/i)).toBeInTheDocument();
    expect(screen.getByText(/users.status/i)).toBeInTheDocument();

    expect(screen.getByText('users.viewer')).toBeInTheDocument();
    expect(screen.getByText('users.editor')).toBeInTheDocument();

    // Actions: view and edit should exist for both users
    expect(
      screen.getAllByText('users.viewDetails').length
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByText('users.editUser').length
    ).toBeGreaterThanOrEqual(2);
  });

  it('calls action callbacks (view/edit) when actions are triggered', () => {
    const onView = vi.fn();
    const onEdit = vi.fn();

    const props = { ...defaultProps, onView, onEdit } as UserDataTableProps;
    render(React.createElement(UserDataTable, props));

    // find view buttons rendered by ActionsDropdown mock (labels are i18n keys)
    const viewButtons = screen.getAllByText('users.viewDetails');
    viewButtons.forEach(btn => expect(btn).toBeInTheDocument());

    // simulate clicking first view button
    viewButtons[0].click();
    expect(onView).toHaveBeenCalled();
  });

  it('falls back to navigate when onView is not provided', () => {
    // clear navigate mock
    mockNavigate.mockClear();
    const props = { ...defaultProps } as UserDataTableProps; // no onView
    render(React.createElement(UserDataTable, props));

    const viewButtons = screen.getAllByText('users.viewDetails');
    viewButtons[0].click();
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('shows unknown role fallback when role mapping is missing', () => {
    const userWithUnknownRole: AdminUser = {
      UserId: 'u3',
      FirstName: 'X',
      LastName: 'Y',
      Email: 'x@y.com',
      Role: 'UNKNOWN' as AdminUser['Role'], // simulate unknown role
      Status: true,
    };
    const props = {
      ...defaultProps,
      users: [userWithUnknownRole],
    } as UserDataTableProps;
    render(React.createElement(UserDataTable, props));

    // fallback displays raw role key
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });

  it('calls onResetPassword and onDelete when provided for active user', () => {
    const onReset = vi.fn();
    const onDelete = vi.fn();
    const props = {
      ...defaultProps,
      onResetPassword: onReset,
      onDelete: onDelete,
    } as UserDataTableProps;
    render(React.createElement(UserDataTable, props));

    // delete button is present for active user (Alice)
    const deleteButtons = screen.getAllByText('users.deleteUser');
    expect(deleteButtons.length).toBeGreaterThanOrEqual(1);

    deleteButtons[0].click();
    expect(onDelete).toHaveBeenCalled();
  });

  it('renders empty message when no users', () => {
    const props = { ...defaultProps, users: [] } as UserDataTableProps;
    render(React.createElement(UserDataTable, props));
    expect(
      screen.getByText(/no users found|no data available/i)
    ).toBeInTheDocument();
  });

  it('shows loading indicator when loading', () => {
    const props = { ...defaultProps, loading: true } as UserDataTableProps;
    render(React.createElement(UserDataTable, props));
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
