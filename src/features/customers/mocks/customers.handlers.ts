import { http, HttpResponse } from 'msw';
import { mockCustomers } from '../mocks/customers.mock';
import { Customer } from '../models/customer.model';
import { PaginationInfo } from '../../../shared/components/DataTable';

export const customersHandlers = [
  // Get customer statistics
  http.get('/api/customers/stats', () => {
    const totalCustomers = mockCustomers.length;
    const activeCustomers = mockCustomers.filter(
      c => c.status === 'active'
    ).length;
    const totalRevenue = mockCustomers.reduce(
      (sum, c) => sum + (c.totalSpent || 0),
      0
    );
    const totalOrders = mockCustomers.reduce(
      (sum, c) => sum + (c.totalOrders || 0),
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return HttpResponse.json({
      totalCustomers,
      activeCustomers,
      totalRevenue,
      totalOrders,
      averageOrderValue,
    });
  }),

  // Get customers with pagination, filtering, and sorting
  http.get('/api/customers', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');
    const company = url.searchParams.get('company');
    const sortField = url.searchParams.get('sortField');
    const sortDirection = url.searchParams.get('sortDirection') as
      | 'asc'
      | 'desc';

    let filtered = [...mockCustomers];

    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(
        customer =>
          customer.firstName.toLowerCase().includes(searchTerm) ||
          customer.lastName.toLowerCase().includes(searchTerm) ||
          customer.email.toLowerCase().includes(searchTerm) ||
          customer.company?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (status && status !== 'all') {
      filtered = filtered.filter(customer => customer.status === status);
    }

    // Apply company filter
    if (company) {
      const companyFilter = company.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.company?.toLowerCase().includes(companyFilter)
      );
    }

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aValue = a[sortField as keyof Customer] as string | number;
        let bValue = b[sortField as keyof Customer] as string | number;

        // Handle special cases
        if (sortField === 'customer') {
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedData = filtered.slice(startIndex, endIndex);

    const pagination: PaginationInfo = {
      page,
      pageSize,
      total,
      totalPages,
    };

    return HttpResponse.json({
      data: paginatedData,
      pagination,
    });
  }),

  // Get single customer
  http.get('/api/customers/:id', ({ params }) => {
    const { id } = params;
    const customer = mockCustomers.find(c => c.id === id);

    if (!customer) {
      return HttpResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(customer);
  }),

  // Create customer
  http.post('/api/customers', async ({ request }) => {
    const newCustomer = (await request.json()) as Omit<
      Customer,
      'id' | 'createdAt' | 'updatedAt'
    >;

    const customer: Customer = {
      ...newCustomer,
      id: `customer-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, you'd save to database
    mockCustomers.push(customer);

    return HttpResponse.json(customer, { status: 201 });
  }),

  // Update customer
  http.put('/api/customers/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Partial<Customer>;

    const customerIndex = mockCustomers.findIndex(c => c.id === id);

    if (customerIndex === -1) {
      return HttpResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const updatedCustomer = {
      ...mockCustomers[customerIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockCustomers[customerIndex] = updatedCustomer;

    return HttpResponse.json(updatedCustomer);
  }),

  // Delete customer
  http.delete('/api/customers/:id', ({ params }) => {
    const { id } = params;
    const customerIndex = mockCustomers.findIndex(c => c.id === id);

    if (customerIndex === -1) {
      return HttpResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    mockCustomers.splice(customerIndex, 1);

    return HttpResponse.json(null, { status: 204 });
  }),
];
