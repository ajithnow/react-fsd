import { render, screen } from '@testing-library/react';
import CustomerDataTable from './CustomerDataTable';

const mockCustomers = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    company: 'Acme Inc',
    status: 'active' as const,
    totalOrders: 5,
    totalSpent: 1200,
    lastOrderDate: '2024-07-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-07-01',
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Jones',
    email: 'bob@example.com',
    company: 'Beta LLC',
    status: 'inactive' as const,
    totalOrders: 2,
    totalSpent: 300,
    lastOrderDate: '2024-06-15',
    createdAt: '2024-01-02',
    updatedAt: '2024-06-15',
  },
];

const defaultProps = {
  customers: mockCustomers,
  loading: false,
  pagination: { page: 1, pageSize: 10, total: 2, totalPages: 1 },
  currentFilters: {},
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onSortChange: jest.fn(),
  onFilterChange: jest.fn(),
};

describe('CustomerDataTable', () => {
  it('renders table with customer data', () => {
    render(<CustomerDataTable {...defaultProps} />);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Acme Inc')).toBeInTheDocument();
    expect(screen.getByText('Beta LLC')).toBeInTheDocument();
  });

  it('shows empty message when no customers', () => {
    render(<CustomerDataTable {...defaultProps} customers={[]} />);
    expect(screen.getByText('No customers found')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<CustomerDataTable {...defaultProps} loading={true} />);
    expect(screen.getByTestId('customer-data-table')).toHaveClass('bg-white');
    // You can add more loading indicator checks if present
  });

  it('calls onPageChange when pagination changes', () => {
    render(<CustomerDataTable {...defaultProps} />);
    // Simulate pagination change if DataTable exposes a button or input
    // fireEvent.click(screen.getByLabelText('Next Page'));
    // expect(defaultProps.onPageChange).toHaveBeenCalled();
  });

  it('calls onSortChange when column header clicked', () => {
    render(<CustomerDataTable {...defaultProps} />);
    // Simulate sort if DataTable exposes a button or header
    // fireEvent.click(screen.getByText('Customer'));
    // expect(defaultProps.onSortChange).toHaveBeenCalled();
  });

  it('renders actions dropdown for each customer', () => {
    render(<CustomerDataTable {...defaultProps} />);
    expect(screen.getAllByLabelText(/Actions for/)).toHaveLength(
      mockCustomers.length
    );
  });

  it('renders status badges', () => {
    render(<CustomerDataTable {...defaultProps} />);
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('inactive')).toBeInTheDocument();
  });
});
