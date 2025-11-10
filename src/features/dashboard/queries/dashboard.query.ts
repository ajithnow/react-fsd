/**
* For fetching usage data (daily, monthly, yearly)
 * used across both Dashboard and Customer modules.
 *
 * Shared TanStack Query hooks for fetching usage data (daily, monthly, yearly)
 * used by both Dashboard and Customer modules.
 * 
 * - If an "id" is passed  fetches usage data for that specific customer.
 * - If "id" is omitted  fetches aggregated "Total Power Usage" data across all customers (Dashboard/Home screen).
 *
 * Refer to the `queries` folders inside the Shared module for further details.
 */


import { useQuery } from '@tanstack/react-query';
import { getTotalEnergyBalance, EnergyBalanceResponse } from '../services/dashboard.service';

import { getMsUntilNextQuarterHour } from '@/shared/utils/time.utils';

export const useGetTotalEnergyBalance = (
  params?: Record<string, string | number | boolean>
) => {
  const key = ['dashboard', 'totalEnergyBalance', params];
  const enabled = params ? Object.keys(params).length > 0 : false;

  // Refresh every 15 mins if realtime feed
  const isRealtimeFeed = params?.['is-realtime-feed'] === true || params?.['is-realtime-feed'] === 'true';
  const refetchInterval = isRealtimeFeed ? getMsUntilNextQuarterHour() : undefined;
  const staleTime = isRealtimeFeed ? getMsUntilNextQuarterHour() : 1000 * 60;

  return useQuery<EnergyBalanceResponse>({
    queryKey: key,
    queryFn: () => getTotalEnergyBalance(params),
    enabled,
    staleTime,
    refetchInterval,
    refetchIntervalInBackground: true,
  });
};
