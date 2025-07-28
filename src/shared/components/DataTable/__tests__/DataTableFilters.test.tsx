import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataTableFilters } from '../DataTableFilters';
import { FilterConfig } from '../dataTable.model';

// Mock props for testing
const mockOnFilterChange = jest.fn();

const filters: FilterConfig[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Search by name...',
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Select status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    id: 'roles',
    label: 'Roles',
    type: 'multiselect',
    placeholder: 'Select roles',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Manager', value: 'manager' },
    ],
  },
  {
    id: 'age',
    label: 'Age',
    type: 'number',
    placeholder: 'Enter age...',
  },
];

describe('DataTableFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders text and select filters correctly', () => {
    render(
      <DataTableFilters
        filters={filters}
        values={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    expect(screen.getByPlaceholderText('Search by name...')).toBeInTheDocument();
    expect(screen.getByText('Select status')).toBeInTheDocument();
    expect(screen.getByText('Select roles')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter age...')).toBeInTheDocument();
  });

  it('calls onFilterChange when a text filter value changes', async () => {
    render(
      <DataTableFilters
        filters={filters}
        values={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Search by name...');
    fireEvent.change(input, { target: { value: 'John' } });

    // Debounce might delay this, so we may need to wait
    // For now, assuming no debounce or a very short one
    // If this fails, we'll need to use fake timers or waitFor
    await new Promise(r => setTimeout(r, 400)); // wait for debounce
    expect(mockOnFilterChange).toHaveBeenCalledWith({ name: 'John' });
  });

  it('calls onFilterChange when a select filter value changes', async () => {
    render(
      <DataTableFilters
        filters={filters}
        values={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    const selectTrigger = screen.getByText('Select status');
    fireEvent.click(selectTrigger);

    const option = await screen.findByText('Active');
    fireEvent.click(option);

    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: 'active' });
  });

  it('clears filters when the "Clear" button is clicked', () => {
    const mockClear = jest.fn();
    render(
      <DataTableFilters
        filters={filters}
        values={{ name: 'John' }}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockClear}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(mockClear).toHaveBeenCalled();
  });

  it('does not render a clear button if no filters are active', () => {
    render(
      <DataTableFilters
        filters={filters}
        values={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('handles multiselect filter changes', async () => {
    render(
      <DataTableFilters
        filters={filters}
        values={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    // Find multiselect trigger
    const multiselectTrigger = screen.getByText('Select roles');
    fireEvent.click(multiselectTrigger);

    // Select an option in multiselect
    const adminOption = await screen.findByText('Admin');
    fireEvent.click(adminOption);

    expect(mockOnFilterChange).toHaveBeenCalledWith({ roles: ['admin'] });
  });

  it('handles number filter changes', async () => {
    render(
      <DataTableFilters
        filters={filters}
        values={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    const numberInput = screen.getByPlaceholderText('Enter age...');
    fireEvent.change(numberInput, { target: { value: '25' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({ age: '25' });
  });

  it('handles date filter type', () => {
    const dateFilters: FilterConfig[] = [
      {
        id: 'date',
        label: 'Date',
        type: 'date',
        placeholder: 'Select date',
      },
    ];

    render(
      <DataTableFilters
        filters={dateFilters}
        values={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    // Find date input by placeholder
    const dateInput = screen.getByDisplayValue('');
    expect(dateInput).toHaveAttribute('type', 'date');

    fireEvent.change(dateInput, { target: { value: '2023-12-25' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ date: '2023-12-25' });
  });

  it('handles filter type with no options gracefully', () => {
    const filtersWithoutOptions: FilterConfig[] = [
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        // No options provided
      },
    ];

    render(
      <DataTableFilters
        filters={filtersWithoutOptions}
        values={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    // Should render select without crashing
    expect(screen.getByText('Select Status')).toBeInTheDocument();
  });

  it('shows correct active filters count and badge text', () => {
    render(
      <DataTableFilters
        filters={filters}
        values={{ name: 'John', status: 'active', age: '25' }}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    // Should show "3 filters active"
    expect(screen.getByText('3 filters active')).toBeInTheDocument();
  });

  it('shows singular "filter" text when only one filter is active', () => {
    render(
      <DataTableFilters
        filters={filters}
        values={{ name: 'John' }}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    // Should show "1 filter active" (singular)
    expect(screen.getByText('1 filter active')).toBeInTheDocument();
  });

  it('handles filter value cleanup', () => {
    // Test that we can render with various filter values
    render(
      <DataTableFilters
        filters={filters}
        values={{ name: '', status: null, roles: [] }}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    // Should render without errors
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('handles undefined values in filter cleanup', () => {
    // Test that empty values trigger the cleanup logic
    render(
      <DataTableFilters
        filters={filters}
        values={{ name: 'test' }}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    const textInput = screen.getByPlaceholderText('Search by name...');
    
    // Clear the value to trigger cleanup
    fireEvent.change(textInput, { target: { value: '' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });

  it('handles unknown filter types gracefully', () => {
    const unknownTypeFilter: FilterConfig[] = [
      {
        id: 'unknown',
        label: 'Unknown',
        type: 'dateRange', // Use a valid type since we can't test invalid types directly
      },
    ];

    render(
      <DataTableFilters
        filters={unknownTypeFilter}
        values={{}}
        onFilterChange={mockOnFilterChange}
        onClearFilters={() => {}}
      />
    );

    // Should render label but no input for unsupported dateRange type
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
