export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
}

export interface CustomerFilters {
  search?: string;
  status?: Customer['status'];
  company?: string;
}

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: Customer['status'];
  sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'totalSpent';
  sortOrder?: 'asc' | 'desc';
}
