import { useQuery } from '@tanstack/react-query';
import {
  customersService,
  GetCustomersParams,
  GetCustomersResponse,
} from '../services/customers.service';

export type CustomersQueryParams = GetCustomersParams;
export type CustomersResponse = GetCustomersResponse;

export const useCustomersQuery = (params: CustomersQueryParams) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersService.getCustomers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

export const useCustomerStatsQuery = () => {
  return useQuery({
    queryKey: ['customers', 'stats'],
    queryFn: () => customersService.getCustomerStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCustomerQuery = (id: string) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersService.getCustomer(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};
