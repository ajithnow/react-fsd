// Customers feature permissions

export const CUSTOMERS_PERMISSIONS = {
  // Customer management
  CUSTOMERS_READ: 'customers:read',
  CUSTOMERS_CREATE: 'customers:create',
  CUSTOMERS_UPDATE: 'customers:update',
  CUSTOMERS_DELETE: 'customers:delete',
  CUSTOMERS_EXPORT: 'customers:export',

  // Customer reports
  CUSTOMERS_REPORTS_VIEW: 'customers:reports_view',
  CUSTOMERS_REPORTS_EXPORT: 'customers:reports_export',
} as const;
