import { Customer } from '../models/customer.model';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-12-01T14:22:00Z',
    totalOrders: 15,
    totalSpent: 2540.99,
    lastOrderDate: '2024-11-28T10:15:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techcorp.com',
    phone: '+1 (555) 987-6543',
    company: 'TechCorp Inc',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
    address: {
      street: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    },
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-11-30T16:45:00Z',
    totalOrders: 8,
    totalSpent: 1875.5,
    lastOrderDate: '2024-11-25T14:30:00Z',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'mike.johnson@startup.io',
    phone: '+1 (555) 456-7890',
    company: 'Startup Labs',
    status: 'pending',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Johnson',
    address: {
      street: '789 Pine St',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      country: 'USA',
    },
    createdAt: '2024-03-10T11:45:00Z',
    updatedAt: '2024-11-29T13:20:00Z',
    totalOrders: 3,
    totalSpent: 642.25,
    lastOrderDate: '2024-11-20T09:12:00Z',
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@design.com',
    phone: '+1 (555) 321-0987',
    company: 'Design Studio',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson',
    address: {
      street: '321 Elm St',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA',
    },
    createdAt: '2024-04-05T14:20:00Z',
    updatedAt: '2024-11-28T11:30:00Z',
    totalOrders: 22,
    totalSpent: 4892.75,
    lastOrderDate: '2024-11-27T16:45:00Z',
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@enterprise.com',
    phone: '+1 (555) 654-3210',
    company: 'Enterprise Solutions',
    status: 'inactive',
    avatar: 'https://ui-avatars.com/api/?name=David+Brown',
    address: {
      street: '654 Maple Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    createdAt: '2024-01-08T10:30:00Z',
    updatedAt: '2024-09-15T09:15:00Z',
    totalOrders: 5,
    totalSpent: 1234.8,
    lastOrderDate: '2024-08-12T13:22:00Z',
  },
  {
    id: '6',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@marketing.co',
    phone: '+1 (555) 789-0123',
    company: 'Marketing Pro',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Davis',
    address: {
      street: '987 Cedar Rd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA',
    },
    createdAt: '2024-05-12T15:45:00Z',
    updatedAt: '2024-11-30T10:20:00Z',
    totalOrders: 12,
    totalSpent: 3156.4,
    lastOrderDate: '2024-11-29T12:05:00Z',
  },
];

// Helper function to get customer by ID
export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.id === id);
};

// Helper function to filter customers
export const filterCustomers = (
  customers: Customer[],
  filters: { search?: string; status?: Customer['status'] }
): Customer[] => {
  return customers.filter(customer => {
    const matchesSearch =
      !filters.search ||
      customer.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      customer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      customer.company?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || customer.status === filters.status;

    return matchesSearch && matchesStatus;
  });
};
