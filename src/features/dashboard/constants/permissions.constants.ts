// Dashboard feature permissions

export const DASHBOARD_PERMISSIONS = {
  // Dashboard access
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_EDIT: 'dashboard:edit',

  // Analytics
  DASHBOARD_ANALYTICS_VIEW: 'dashboard:analytics_view',
  DASHBOARD_SALES_VIEW: 'dashboard:sales_view',
  DASHBOARD_TRAFFIC_VIEW: 'dashboard:traffic_view',

  // Reports
  DASHBOARD_REPORTS_VIEW: 'dashboard:reports_view',
  DASHBOARD_REPORTS_EXPORT: 'dashboard:reports_export',
} as const;
