import axios from 'axios';
import { Customer } from '../models/customer.model';
import { PaginationInfo } from '../../../shared/components/DataTable';

export interface GetCustomersParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  status?: string;
  company?: string;
}

export interface GetCustomersResponse {
  data: Customer[];
  pagination: PaginationInfo;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export const customersService = {
  async getCustomers(
    params: GetCustomersParams
  ): Promise<GetCustomersResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize)
      searchParams.append('pageSize', params.pageSize.toString());
    if (params.sortField) searchParams.append('sortField', params.sortField);
    if (params.sortDirection)
      searchParams.append('sortDirection', params.sortDirection);
    if (params.search) searchParams.append('search', params.search);
    if (params.status && params.status !== 'all')
      searchParams.append('status', params.status);
    if (params.company) searchParams.append('company', params.company);

    const response = await axios.get(
      `/api/customers?${searchParams.toString()}`
    );
    return response.data;
  },

  async getCustomerStats(): Promise<CustomerStats> {
    const response = await axios.get('/api/customers/stats');
    return response.data;
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await axios.get(`/api/customers/${id}`);
    return response.data;
  },

  async createCustomer(
    customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Customer> {
    const response = await axios.post('/api/customers', customer);
    return response.data;
  },

  async updateCustomer(
    id: string,
    customer: Partial<Customer>
  ): Promise<Customer> {
    const response = await axios.put(`/api/customers/${id}`, customer);
    return response.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    await axios.delete(`/api/customers/${id}`);
  },
};
