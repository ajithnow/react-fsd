/**
* For fetching usage data (daily, monthly, yearly)
 * used across both Dashboard and Customer modules.
 *
 * This service dynamically adjusts API calls based on whether a customer ID is provided:
 * - If an "id" is passed  fetches usage data for that specific customer.
 * - If "id" is omitted  fetches aggregated "Total Power Usage" data across all customers (Dashboard/Home screen).
 *
 * Refer to the `services` folder inside the Shared module for further details.
 */

import { createApiClient } from '@/core/api';

export type EnergyBalanceResponse = {
  totalEnergyBalance?: number | null;
  daily?: number | null;
  monthly?: number | null;
  yearly?: number | null;
};

const client = createApiClient();

export const getTotalEnergyBalance = async (params?: Record<string, string | number | boolean>) => {
  const query = new URLSearchParams();
  if (params) {
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null) {
        query.set(k, String(params[k]));
      }
    });
  }
  const url = `/api/portal-admin/dashboard/total-energy-balance${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await client.get(url);
  return res.data as EnergyBalanceResponse;
};
