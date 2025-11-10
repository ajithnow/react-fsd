
/**
 * USAGE_ENDPOINTS

 * Shared API endpoint  used by both Dashboard and Customer modules
 * to fetch usage data (daily, monthly, yearly).
 
 * These endpoints are dynamic — they handle both individual customer data
 * and overall customer power usage.
 *
 * - If "id" is provided then fetch usage for that individual customer.
 * - If "id" is omitted  then fetch total usage of all customers.
 *
 */


  export const USAGE_ENDPOINTS = {
    GLOBAL: {
      DAILY: (date: string) => `api/portal-admin/usage/daily/${date}`,
      MONTHLY: (year: number, month: number) =>
        `api/portal-admin/usage/monthly/${year}/${month}`,
      YEARLY: (year: number) => `api/portal-admin/usage/yearly/${year}`,
    },
  
    CUSTOMER: {
      DAILY: (id: string, date: string) =>
        `api/portal-admin/usage/${id}/daily/${date}`,
      MONTHLY: (id: string, year: number, month: number) =>
        `api/portal-admin/usage/${id}/monthly/${year}/${month}`,
      YEARLY: (id: string, year: number) =>
        `api/portal-admin/usage/${id}/yearly/${year}`,
    },
  };
  