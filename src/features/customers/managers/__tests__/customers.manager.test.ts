import { renderHook } from '@testing-library/react';
import { useCustomersManager } from '../customers.manager';

// Mock window.history and window.location
const mockReplaceState = jest.fn();

Object.defineProperty(window, 'history', {
  value: {
    replaceState: mockReplaceState,
  },
  writable: true,
});

const mockCustomersQuery = jest.fn();

jest.mock('../../queries/customers.query', () => ({
  useCustomersQuery: jest.fn(() => mockCustomersQuery()),
}));

describe('useCustomersManager', () => {
  const mockCustomersData = {
    data: [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        phone: '1234567890',
        company: 'Acme',
        status: 'active',
        avatar: '',
        address: '123 Main St',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        totalOrders: 5,
        totalSpent: 1000,
        lastOrderDate: '2023-01-03',
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phone: '0987654321',
        company: 'Beta Corp',
        status: 'inactive',
        avatar: '',
        address: '456 Oak Ave',
        createdAt: '2023-02-01',
        updatedAt: '2023-02-02',
        totalOrders: 3,
        totalSpent: 500,
        lastOrderDate: '2023-02-03',
      },
    ],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 2,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCustomersQuery.mockReturnValue({
      data: mockCustomersData,
      isLoading: false,
      error: null,
    });
  });

  it('returns customers and pagination info', () => {
    const { result } = renderHook(() => useCustomersManager());

    expect(result.current.customers).toHaveLength(2);
    expect(result.current.customers[0].firstName).toBe('Alice');
    expect(result.current.customers[1].firstName).toBe('Bob');
    expect(result.current.pagination.page).toBe(1);
    expect(result.current.pagination.total).toBe(2);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles loading state', () => {
    mockCustomersQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useCustomersManager());

    expect(result.current.customers).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.pagination).toEqual({
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    });
  });

  it('handles error state', () => {
    const mockError = new Error('Failed to fetch customers');
    mockCustomersQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(() => useCustomersManager());

    expect(result.current.customers).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError);
  });

  it('does not update URL on initial mount', () => {
    // Clear previous calls
    mockReplaceState.mockClear();

    renderHook(() => useCustomersManager({ search: 'initial' }));

    // Should not call replaceState on initial mount
    expect(mockReplaceState).not.toHaveBeenCalled();
  });

  it('transforms customer data correctly', () => {
    const { result } = renderHook(() => useCustomersManager());

    const customer = result.current.customers[0];
    expect(customer).toEqual({
      id: '1',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phone: '1234567890',
      company: 'Acme',
      status: 'active',
      avatar: '',
      address: '123 Main St',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-02',
      totalOrders: 5,
      totalSpent: 1000,
      lastOrderDate: '2023-01-03',
    });
  });

  it('handles empty data response', () => {
    mockCustomersQuery.mockReturnValue({
      data: {
        data: [],
        pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
      },
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useCustomersManager());

    expect(result.current.customers).toEqual([]);
    expect(result.current.pagination.total).toBe(0);
  });
});
