export interface DashboardAnalyticsResponse {
  TotalCustomers?: number;
  CustomersWithDevice?: number;
  CustomersWithoutDevice?: number;
  ActiveSubCustomers?: number;
  CancelledSubCustomers?: number;
  NewCustomersPreviousMonth?: number;
  NewCustomersCurrentMonth?: number;
  // legacy keys
  totalCustomers?: number;
  connectedDevices?: number;
  unconnectedDevices?: number;
  activeSubscriptions?: number;
  cancelledSubscriptions?: number;
  previousMonthUsers?: number;
  currentMonthUsers?: number;
}

export type AnalyticsParams = {
  date?: string; // YYYY-MM-DD
  month?: number; // 1-12
  year?: number;
};

export interface CustomerAnalyticsCardProps {
  totalCustomers: number;
  connectedDevices: number;
  unconnectedDevices: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  previousMonthUsers: number;
  currentMonthUsers: number;
  growthRate: number;
}

export type EnergyBalanceTab = 'daily' | 'monthly' | 'yearly';

export interface EnergyBalanceCardProps {
  tab?: EnergyBalanceTab;
  onTabChange?: (tab: EnergyBalanceTab) => void;
  selectedDate?: string;
  onSelectedDateChange?: (d: string) => void;
  month?: number | undefined;
  onMonthChange?: (m: number | undefined) => void;
  year?: number | undefined;
  onYearChange?: (y: number | undefined) => void;
}
