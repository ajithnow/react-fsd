import { createApiClient } from '@/core/api';
import { DashboardAnalyticsResponse } from '@/features/dashboard/models';

export const getDashboardAnalytics = async (): Promise<DashboardAnalyticsResponse> => {
  const client = createApiClient();
  const url = '/api/portal-admin/dashboard/dashboard-analytics';
  const res = await client.get(url);
  return res.data;
};
