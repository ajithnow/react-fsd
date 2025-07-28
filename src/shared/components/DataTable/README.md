# DataTable Component

A comprehensive, reusable data table component built on top of shadcn/ui that supports:

- ✅ Server-side pagination
- ✅ Sorting (ascending/descending/none)
- ✅ Advanced filtering (text, select, multiselect, number, date, dateRange)
- ✅ URL-based filter persistence (filters survive page refresh)
- ✅ Loading states
- ✅ Custom cell rendering
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Comprehensive test coverage

## Basic Usage

````tsx
import { useState, useEffect, useCallback } from 'react';
import { DataTable, DataTableColumn, PaginationInfo, SortConfig, FilterValues } from '@/shared/components/DataTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {status}
    </span>
  );
}

export function UserDataTable() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const columns: DataTableColumn<User>[] = [
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
      cell: (user) => <StatusBadge status={user.status} />,
      sortable: true,
      filterable: true,
    },
  ];

  // Filter definitions with multiselect support
  const filters = [
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
| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Filter identifier (matches column id) |
| `label` | `string` | Filter label |
| `type` | `'select' \| 'text' \| 'date' \| 'dateRange' \| 'multiselect' \| 'number'` | Filter input type |
| `options` | `{label: string, value: string}[]` | Options for select/multiselect filter |
| `placeholder` | `string` | Input placeholder text |
      label: 'Name',
      type: 'text' as const,
      placeholder: 'Search by name...',
    },
  ];

  const handlePageChange = useCallback((page: number) => {
    // Handle page change
  }, []);

  const handleFilterChange = useCallback((filters: FilterValues) => {
    // Handle filter change
## Server-Side Integration

The component is designed to work with server-side data operations and includes URL-based filter persistence:

```tsx
import { useState, useEffect, useCallback, useRef } from 'react';

export function UserDataTableExample() {
  // Initialize filters from URL parameters for persistence across page refreshes
  const [requestState, setRequestState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters: FilterValues = {};

    // Parse URL parameters
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

  // Sync URL when filters change
  const filtersMounted = useRef(false);
  const currentFilters = requestState.filters;

  useEffect(() => {
    // Skip initial mount to avoid clearing URL on first load
    if (!filtersMounted.current) {
      filtersMounted.current = true;
      return;
    }

    const params = new URLSearchParams();
    if (currentFilters.role) {
      params.set('role', Array.isArray(currentFilters.role)
        ? currentFilters.role.join(',')
        : String(currentFilters.role)
      );
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

  const handlePageChange = async (page: number) => {
    setRequestState(prev => ({ ...prev, page }));
  };

  const handleFilterChange = async (filters: FilterValues) => {
    setRequestState(prev => ({ ...prev, page: 1, filters }));
  };

  const handleSortChange = async (sort: SortConfig | null) => {
    setRequestState(prev => ({
      ...prev,
      sortField: sort?.field,
      sortDirection: sort?.direction,
    }));
  };

  // Fetch data when request parameters change
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

      setData(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [requestState]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DataTable<User>
      data={data}
      columns={columns}
      loading={loading}
      pagination={pagination}
      onPageChange={handlePageChange}
      onFilterChange={handleFilterChange}
      onSortChange={handleSortChange}
      filters={filterDefs}
      initialFilters={requestState.filters} // Pass initial filters from URL
      showPagination={true}
      showFilters={true}
    />
  );
}
```columns` | `DataTableColumn<T>[]` | Required | Column definitions |
| `loading` | `boolean` | `false` | Shows loading state |
| `pagination` | `PaginationInfo` | Optional | Pagination configuration |
| `onPageChange` | `(page: number) => void` | Optional | Page change handler |
| `onPageSizeChange` | `(pageSize: number) => void` | Optional | Page size change handler |
| `onSortChange` | `(sort: SortConfig \| null) => void` | Optional | Sort change handler |
| `onFilterChange` | `(filters: FilterValues) => void` | Optional | Filter change handler |
| `filters` | `FilterConfig[]` | `[]` | Filter definitions |
| `initialFilters` | `FilterValues` | `{}` | Initial filter values |
| `initialSort` | `SortConfig` | Optional | Initial sort configuration |
| `showPagination` | `boolean` | `true` | Show pagination controls |
| `showFilters` | `boolean` | `true` | Show filter controls |
| `className` | `string` | Optional | Additional CSS classes |
| `emptyMessage` | `string` | `"No data available"` | Message when no data |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Page size dropdown options |

### DataTableColumn<T>

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique column identifier |
| `header` | `string` | Column header text |
| `accessor` | `keyof T \| (item: T) => unknown` | How to access cell data |
| `cell` | `(item: T) => ReactNode` | Custom cell renderer |
| `sortable` | `boolean` | Enable sorting for this column |
| `filterable` | `boolean` | Enable filtering for this column |
| `width` | `string` | Column width (CSS value) |
| `align` | `'left' \| 'center' \| 'right'` | Text alignment |

### FilterConfig

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Filter identifier (matches column id) |
| `label` | `string` | Filter label |
| `type` | `'select' \| 'text' \| 'date' \| 'dateRange'` | Filter input type |
| `options` | `{label: string, value: string}[]` | Options for select filter |
| `placeholder` | `string` | Input placeholder text |

### PaginationInfo

| Prop | Type | Description |
|------|------|-------------|
| `page` | `number` | Current page (1-based) |
| `pageSize` | `number` | Items per page |
| `total` | `number` | Total number of items |
| `totalPages` | `number` | Total number of pages |

## Server-Side Integration

The component is designed to work with server-side data operations:

```tsx
const handlePageChange = async (page: number) => {
  const response = await api.getUsers({
    page,
    pageSize: pagination.pageSize,
    sort: currentSort,
    filters: currentFilters,
  });

  setData(response.data);
  setPagination(response.pagination);
};

const handleSortChange = async (sort: SortConfig | null) => {
  setCurrentSort(sort);
  const response = await api.getUsers({
    page: 1, // Reset to first page
    pageSize: pagination.pageSize,
    sort,
    filters: currentFilters,
  });

  setData(response.data);
  setPagination(response.pagination);
};
````

## Advanced Features

### Multi-Select Filters

The component supports multi-select filters for complex filtering scenarios:

```tsx
const filters = [
  {
    id: 'role',
    label: 'Role',
    type: 'multiselect',
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
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    id: 'age',
    label: 'Age',
    type: 'number',
    placeholder: 'Enter age...',
  },
];
```

### URL-Based Filter Persistence

Filters are automatically synchronized with the URL, allowing users to:

- Bookmark filtered views
- Share filtered URLs with colleagues
- Retain filters across page refreshes
- Navigate back/forward with filter state preserved

The URL sync is implemented using `URLSearchParams` and `window.history.replaceState()` for seamless user experience.

### Custom Cell Rendering

```tsx
{
  id: 'actions',
  header: 'Actions',
  cell: (user) => (
    <div className="flex space-x-2">
      <Button size="sm" onClick={() => editUser(user.id)}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>
        Delete
      </Button>
    </div>
  ),
}
```

### Complex Filters

```tsx
const filters = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'All Statuses', value: '' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    id: 'createdAt',
    label: 'Created Date',
    type: 'date',
  },
  {
    id: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search users...',
  },
];
```

## Testing

The DataTable component includes comprehensive test coverage:

```tsx
// Example test structure
describe('DataTable', () => {
  it('renders data correctly', () => {
    // Test data rendering
  });

  it('handles pagination', () => {
    // Test pagination functionality
  });

  it('handles sorting', () => {
    // Test sorting functionality
  });

  it('handles filtering', () => {
    // Test filter functionality
  });

  it('handles multi-select filters', () => {
    // Test multi-select filter functionality
  });
});
```

Tests are located in the `__tests__` directory and use Jest + React Testing Library.

## Styling

The component uses Tailwind CSS classes and follows shadcn/ui design patterns. You can customize the appearance by:

1. Passing additional classes via the `className` prop
2. Modifying the default Tailwind styles
3. Customizing individual column alignment and width

## Accessibility

- Full keyboard navigation support
- Screen reader friendly
- ARIA labels and roles
- Focus management

## Dependencies

- React 18+
- shadcn/ui components (table, button, select, input, badge, multiselect)
- Lucide React icons
- Tailwind CSS
- class-variance-authority (via shadcn/ui)
- Jest & React Testing Library (for testing)

## Features Summary

### Implemented ✅

- Server-side pagination with configurable page sizes
- Multi-column sorting (asc/desc/none)
- Advanced filtering: text, select, multiselect, number, date, dateRange
- URL-based filter persistence (survives page refresh, bookmarkable)
- Loading states and empty states
- Custom cell rendering with TypeScript support
- Responsive design with Tailwind CSS
- Comprehensive test coverage (Jest + RTL)
- Full keyboard navigation and accessibility

### Architecture

- Built on shadcn/ui design system
- TypeScript-first with strict type safety
- Modular component structure
- Hook-based state management
- URL sync for filter persistence
- Server-side data integration ready

## File Structure

```text
src/shared/components/DataTable/
├── DataTable.tsx               # Main component
├── DataTableFilters.tsx        # Filter controls with multiselect support
├── DataTablePagination.tsx     # Pagination controls
├── types.ts                    # TypeScript definitions
├── dataTable.demo.tsx          # Complete demo with URL sync
├── index.ts                    # Exports
├── README.md                   # This file
└── __tests__/                  # Test files
    ├── DataTable.test.tsx
    ├── DataTableFilters.test.tsx
    └── DataTablePagination.test.tsx
```
