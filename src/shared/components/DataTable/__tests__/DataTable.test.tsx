import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataTable } from '../DataTable';
import { DataTableColumn } from '../dataTable.model';

interface TestData extends Record<string, unknown> {
  id: number;
  name: string;
  value: number;
}

const mockData: TestData[] = [
  { id: 1, name: 'Item 1', value: 100 },
  { id: 2, name: 'Item 2', value: 200 },
];

const mockColumns: DataTableColumn<TestData>[] = [
  { id: 'id', header: 'ID', accessor: 'id' },
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'value', header: 'Value', accessor: 'value' },
];

describe('DataTable', () => {
  it('renders a table with data and columns', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('displays a loading indicator when loading', () => {
    render(<DataTable data={[]} columns={mockColumns} loading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays an empty message when there is no data', () => {
    render(<DataTable data={[]} columns={mockColumns} emptyMessage="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('handles sorting when a sortable header is clicked', () => {
    const mockOnSortChange = jest.fn();
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onSortChange={mockOnSortChange}
      />
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalledWith({ field: 'name', direction: 'asc' });

    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalledWith({ field: 'name', direction: 'desc' });
  });

  it('does not sort when a non-sortable header is clicked', () => {
    const mockOnSortChange = jest.fn();
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onSortChange={mockOnSortChange}
      />
    );

    const idHeader = screen.getByText('ID');
    fireEvent.click(idHeader);
    expect(mockOnSortChange).not.toHaveBeenCalled();
  });

  it('renders pagination when showPagination is true', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        showPagination={true}
        pagination={{ page: 1, pageSize: 10, total: 2, totalPages: 1 }}
      />
    );
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
  });

  it('renders filters when showFilters is true', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        showFilters={true}
        filters={[{ id: 'name', label: 'Name', type: 'text' }]}
      />
    );
    expect(screen.getByPlaceholderText(/filter name/i)).toBeInTheDocument();
  });

  it('handles sorting with multiple clicks (asc -> desc -> clear)', () => {
    const mockOnSortChange = jest.fn();
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onSortChange={mockOnSortChange}
      />
    );

    const nameHeader = screen.getByText('Name');
    
    // First click: asc
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalledWith({ field: 'name', direction: 'asc' });

    // Second click: desc
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalledWith({ field: 'name', direction: 'desc' });

    // Third click: clear sort
    fireEvent.click(nameHeader);
    expect(mockOnSortChange).toHaveBeenCalledWith(null);
  });

  it('handles columns with function accessors', () => {
    const columnsWithFunction: DataTableColumn<TestData>[] = [
      { 
        id: 'computed', 
        header: 'Computed', 
        accessor: (item: TestData) => `${item.name}-${item.value}` 
      },
    ];

    render(<DataTable data={mockData} columns={columnsWithFunction} />);
    
    expect(screen.getByText('Item 1-100')).toBeInTheDocument();
    expect(screen.getByText('Item 2-200')).toBeInTheDocument();
  });

  it('handles columns with custom cell renderers', () => {
    const columnsWithCell: DataTableColumn<TestData>[] = [
      { 
        id: 'custom', 
        header: 'Custom', 
        cell: (item: TestData) => <span data-testid="custom-cell">{item.name.toUpperCase()}</span>
      },
    ];

    render(<DataTable data={mockData} columns={columnsWithCell} />);
    
    expect(screen.getByText('ITEM 1')).toBeInTheDocument();
    expect(screen.getByText('ITEM 2')).toBeInTheDocument();
  });

  it('handles columns without accessor or cell (fallback to empty)', () => {
    const columnsWithoutAccessor: DataTableColumn<TestData>[] = [
      { id: 'empty', header: 'Empty' }, // No accessor or cell
    ];

    render(<DataTable data={mockData} columns={columnsWithoutAccessor} />);
    
    // Should render empty cells
    const cells = screen.getAllByRole('cell');
    const emptyCells = cells.filter(cell => cell.textContent === '');
    expect(emptyCells.length).toBeGreaterThan(0);
  });

  it('calls onFilterChange when filters change', () => {
    const mockOnFilterChange = jest.fn();
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        showFilters={true}
        filters={[{ id: 'name', label: 'Name', type: 'text' }]}
        onFilterChange={mockOnFilterChange}
      />
    );

    const input = screen.getByPlaceholderText(/filter name/i);
    fireEvent.change(input, { target: { value: 'test' } });

    // Should call onFilterChange
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('handles clear filters functionality', () => {
    const mockOnFilterChange = jest.fn();
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        showFilters={true}
        filters={[{ id: 'name', label: 'Name', type: 'text' }]}
        initialFilters={{ name: 'test' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Find and click clear button
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    // Should call onFilterChange with empty filters
    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });

  it('generates unique keys for items with id property', () => {
    const dataWithIds = [
      { id: 1, name: 'Item 1', value: 100 }, // Using number id
      { id: 2, name: 'Item 2', value: 200 },
    ];

    render(<DataTable data={dataWithIds} columns={mockColumns} />);
    
    // Should render without errors (keys are handled internally)
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('generates unique keys for items with key property', () => {
    interface DataWithKey extends Record<string, unknown> {
      key: string;
      name: string;
      value: number;
    }
    
    const dataWithKeys: DataWithKey[] = [
      { key: 'key-1', name: 'Item 1', value: 100 },
      { key: 'key-2', name: 'Item 2', value: 200 },
    ];

    const columnsForKeyData: DataTableColumn<DataWithKey>[] = [
      { id: 'name', header: 'Name', accessor: 'name' },
      { id: 'value', header: 'Value', accessor: 'value' },
    ];

    render(<DataTable data={dataWithKeys} columns={columnsForKeyData} />);
    
    // Should render without errors (keys are handled internally)
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('generates fallback keys for items without id or key', () => {
    interface DataWithoutId extends Record<string, unknown> {
      name: string;
      value: number;
    }
    
    const dataWithoutKeys: DataWithoutId[] = [
      { name: 'Item 1', value: 100 },
      { name: 'Item 2', value: 200 },
    ];

    const columnsForNoIdData: DataTableColumn<DataWithoutId>[] = [
      { id: 'name', header: 'Name', accessor: 'name' },
      { id: 'value', header: 'Value', accessor: 'value' },
    ];

    render(<DataTable data={dataWithoutKeys} columns={columnsForNoIdData} />);
    
    // Should render without errors (fallback keys are generated)
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('does not call onFilterChange when not provided', () => {
    // This test ensures the optional onFilterChange doesn't cause errors
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        showFilters={true}
        filters={[{ id: 'name', label: 'Name', type: 'text' }]}
        // No onFilterChange provided
      />
    );

    const input = screen.getByPlaceholderText(/filter name/i);
    fireEvent.change(input, { target: { value: 'test' } });

    // Should not throw error
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('syncs with initialFilters prop changes', () => {
    const { rerender } = render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        showFilters={true}
        filters={[{ id: 'name', label: 'Name', type: 'text' }]}
        initialFilters={{ name: 'initial' }}
      />
    );

    expect(screen.getByDisplayValue('initial')).toBeInTheDocument();

    // Change initialFilters prop
    rerender(
      <DataTable
        data={mockData}
        columns={mockColumns}
        showFilters={true}
        filters={[{ id: 'name', label: 'Name', type: 'text' }]}
        initialFilters={{ name: 'updated' }}
      />
    );

    expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
  });
});
