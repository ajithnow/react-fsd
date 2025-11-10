import { UseQueryResult } from '@tanstack/react-query';
import { UsageResponse } from '@/shared/types/usage.types';

export const getUsageQueryAndResponse = (
  usageMode: string,
  dailyUsageQuery: UseQueryResult<UsageResponse>,
  monthlyUsageQuery: UseQueryResult<UsageResponse>,
  yearlyUsageQuery: UseQueryResult<UsageResponse>
) => {
  const usageQuery =
    usageMode === 'day'
      ? dailyUsageQuery
      : usageMode === 'month'
      ? monthlyUsageQuery
      : yearlyUsageQuery;

  const usageResp = usageQuery?.data ?? null;

  return { usageQuery, usageResp };
};
