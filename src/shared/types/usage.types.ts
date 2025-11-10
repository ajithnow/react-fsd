
/**
 * UsageResponse
 * -------------
 * Returned by all usage-related data (daily, monthly, yearly).
 */
export type UsageResponse = {
    points?: Array<{ x: string; y: number | null }> | null;
    totalDayUsage?: number | null;
    totalMonthlyUsage?: number | null;
    totalYearUsage?: number | null;
  } | null;
  