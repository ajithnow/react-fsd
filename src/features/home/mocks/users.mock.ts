import { http, HttpResponse } from 'msw';

// User interface for the mock API
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  createdAt: string;
}

// API request/response types
export interface UsersQueryParams {
  page?: string;
  pageSize?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  role?: string | string[];
  status?: string;
  name?: string;
}

export interface UsersApiResponse {
  data: UserData[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message: string;
}

// Generate mock users data
const generateMockUsers = (): UserData[] => {
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const domains = ['example.com', 'test.com', 'demo.org', 'sample.net'];
  const roles: ('admin' | 'user' | 'manager')[] = ['admin', 'user', 'manager'];

  return Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[Math.floor(i / firstNames.length) % lastNames.length].toLowerCase()}${i > 50 ? i : ''}@${domains[i % domains.length]}`,
    role: roles[i % 3],
    status: i % 5 === 0 ? 'inactive' : 'active',
    createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Random date within last year
  }));
};

// Mock users database
const mockUsers = generateMockUsers();

// Helper function to apply filters
const applyFilters = (users: UserData[], params: UsersQueryParams): UserData[] => {
  let filtered = [...users];

  if (params.role) {
    const roles = Array.isArray(params.role) ? params.role : [params.role];
    if (roles.length > 0) {
      filtered = filtered.filter(user => roles.includes(user.role));
    }
  }

  if (params.status) {
    filtered = filtered.filter(user => user.status === params.status);
  }

  if (params.name) {
    const searchTerm = params.name.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
};

// Helper function to apply sorting
const applySorting = (users: UserData[], params: UsersQueryParams): UserData[] => {
  if (!params.sortField) return users;

  const sorted = [...users].sort((a, b) => {
    const aValue = a[params.sortField as keyof UserData];
    const bValue = b[params.sortField as keyof UserData];

    let comparison = 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return params.sortDirection === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

// Helper function to apply pagination
const applyPagination = (users: UserData[], page: number, pageSize: number) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: users.slice(startIndex, endIndex),
    total: users.length,
    totalPages: Math.ceil(users.length / pageSize),
  };
};

// Users API handlers
export const usersHandler = [
  // Get users with pagination, sorting, and filtering
  http.get('/api/users', async ({ request }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const url = new URL(request.url);
    const params: UsersQueryParams = {
      page: url.searchParams.get('page') || '1',
      pageSize: url.searchParams.get('pageSize') || '10',
      sortField: url.searchParams.get('sortField') || undefined,
      sortDirection: (url.searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc',
      role: url.searchParams.get('role')?.split(',') || undefined,
      status: url.searchParams.get('status') || undefined,
      name: url.searchParams.get('name') || undefined,
    };

    try {
      const page = parseInt(params.page || '1');
      const pageSize = parseInt(params.pageSize || '10');

      // Validate pagination parameters
      if (page < 1 || pageSize < 1 || pageSize > 100) {
        return HttpResponse.json<UsersApiResponse>(
          {
            data: [],
            pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
            success: false,
            message: 'Invalid pagination parameters',
          },
          { status: 400 }
        );
      }

      // Apply filters
      let filteredUsers = applyFilters(mockUsers, params);

      // Apply sorting
      filteredUsers = applySorting(filteredUsers, params);

      // Apply pagination
      const paginationResult = applyPagination(filteredUsers, page, pageSize);

      return HttpResponse.json<UsersApiResponse>({
        data: paginationResult.data,
        pagination: {
          page,
          pageSize,
          total: paginationResult.total,
          totalPages: paginationResult.totalPages,
        },
        success: true,
        message: 'Users retrieved successfully',
      });

    } catch {
      return HttpResponse.json<UsersApiResponse>(
        {
          data: [],
          pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
          success: false,
          message: 'Internal server error',
        },
        { status: 500 }
      );
    }
  }),

  // Get single user by ID
  http.get('/api/users/:id', async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const userId = parseInt(params.id as string);
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return HttpResponse.json(
        {
          data: null,
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: user,
      success: true,
      message: 'User retrieved successfully',
    });
  }),
];
