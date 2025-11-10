import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getDashboardAnalytics } from '@/features/dashboard/services/analytics.service';
import { DashboardAnalyticsResponse } from '@/features/dashboard/models';

export const useDashboardManager = () => {
  const queryClient = useQueryClient();

  const [tab, setTab] = React.useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [selectedDate, setSelectedDate] = React.useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [month, setMonth] = React.useState<number | undefined>(undefined);
  const [year, setYear] = React.useState<number | undefined>(undefined);

  const [analyticsDataState, setAnalyticsDataState] = React.useState<
    DashboardAnalyticsResponse | null
  >(null);
  const [analyticsLoading, setAnalyticsLoading] = React.useState(false);
  const [lastFetched, setLastFetched] = React.useState<number | null>(null);

  const computeGrowth = React.useCallback((prev: number, curr: number) => {
    if (prev === 0) return curr === 0 ? 0 : 100;
    const pct = ((curr - prev) / prev) * 100;
    return Math.round(pct * 10) / 10;
  }, []);

  const fetchAnalytics = React.useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await queryClient.fetchQuery({
        queryKey: ['dashboard', 'analytics'],
        queryFn: () => getDashboardAnalytics(),
      });
      setAnalyticsDataState(res ?? null);
      setLastFetched(Date.now());
      return res;
    } finally {
      setAnalyticsLoading(false);
    }
  }, [queryClient]);

  const analyticsData = React.useMemo(() => {
    const d = analyticsDataState as DashboardAnalyticsResponse | Record<string, unknown> | null;
    if (!d) return null;

    const readNum = (keys: string[]) => {
      for (const k of keys) {
        const val = (d as Record<string, unknown>)[k];
        if (val === undefined || val === null) continue;
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
          const n = Number(val);
          if (!Number.isNaN(n)) return n;
        }
      }
      return 0;
    };

    return {
      total: readNum(['TotalCustomers', 'totalCustomers']),
      connectedDevices: readNum(['CustomersWithDevice', 'connectedDevices']),
      unconnectedDevices: readNum(['CustomersWithoutDevice', 'unconnectedDevices']),
      activeSubscriptions: readNum(['ActiveSubCustomers', 'activeSubscriptions']),
      cancelledSubscriptions: readNum(['CancelledSubCustomers', 'cancelledSubscriptions']),
      previousMonthUsers: readNum(['NewCustomersPreviousMonth', 'previousMonthUsers']),
      currentMonthUsers: readNum(['NewCustomersCurrentMonth', 'currentMonthUsers']),
    };
  }, [analyticsDataState]);

  const growthRate = React.useMemo(() => {
    return computeGrowth(
      analyticsData?.previousMonthUsers ?? 0,
      analyticsData?.currentMonthUsers ?? 0
    );
  }, [analyticsData, computeGrowth]);

  return {
    // control state used by EnergyBalanceCard
    tab,
    setTab,
    selectedDate,
    setSelectedDate,
    month,
    setMonth,
    year,
    setYear,
    // analytics
    fetchAnalytics,
    analyticsData,
    analyticsLoading,
    lastFetched,
    growthRate,
  } as const;
};

export default useDashboardManager;
