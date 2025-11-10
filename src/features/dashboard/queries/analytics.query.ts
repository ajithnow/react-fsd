import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalytics } from '@/features/dashboard/services/analytics.service';
import { DashboardAnalyticsResponse } from '@/features/dashboard/models';

export const useGetDashboardAnalytics = () => {
  return useQuery<DashboardAnalyticsResponse>({
    queryKey: ['dashboard', 'analytics'],
    queryFn: () => getDashboardAnalytics(),
    staleTime: 1000 * 60 * 5,
  });
};
