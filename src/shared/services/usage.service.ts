/**
 * usage.service.ts (Shared)
 
 * Shared service  for fetching usage data (daily, monthly, yearly)
 * used across both Dashboard and Customer modules.
 *
 * This service  adjusts API calls based on whether a customer ID is provided:
 * - If "id" is passed  then fetches usage data for that specific customer.
 * - If "id" is omitted then fetches "Total Power Usage" data for all customers (Home Screen).

 */

import { useCallback, useMemo } from 'react';
import { createApiClient } from '@/core/api';

import { USAGE_ENDPOINTS } from '../constants';

export const useCustomerService = () => {
  const clients = useMemo(
    () => ({
      real: createApiClient({ isMock: false }),
      mock: createApiClient({ isMock: true }),
    }),
    []
  );

  const getDailyUsage = useCallback(
    async (
        date: string,
        id?: string 
    ): Promise<{
      points: Array<{ x: string; y: number | null }>;
      totalDayUsage?: number | null;
    }> => {
      const MOCK_ENABLED = false;
      const apiClient = MOCK_ENABLED ? clients.mock : clients.real;  
      const endpoint = id 
      ? USAGE_ENDPOINTS.CUSTOMER.DAILY(id ,date) // for specific customer
      : USAGE_ENDPOINTS.GLOBAL.DAILY(date); // for global dashboard
      const response = await apiClient.get(endpoint);

      // Backend currently returns: { totalDayUsage: number|null, slots: Array<...> }
      // For day view, convert 15-min slots to hour values for charting:
      // x = label / 4 (0..23.75), y = value * 100
      // Note: Multiply by 100 to align Y-axis magnitude with the mobile app (8 symmetric ticks step ~ maxAbs/4)
      const payload = response.data ?? {};
      const slots = Array.isArray(payload.slots) ? payload.slots : [];

      const normalized = slots.map(
        (s: { label?: string | number; value?: number | null }) => {
          const rawLabel = s?.label ?? '';
          const numericLabel = typeof rawLabel === 'number' ? rawLabel : Number(rawLabel);
          const hour = Number.isFinite(numericLabel) ? numericLabel / 4 : NaN;
          const v = s?.value ?? null;
          return {
            x: Number.isFinite(hour) ? String(hour) : String(rawLabel),
            y: typeof v === 'number' ? v : null,
          };
        }
      );

      if (normalized.length === 1) {
        normalized.unshift({ x: '0', y: 0 });
      }

      return {
        points:!id ? payload.slots : normalized,
        totalDayUsage: payload.totalDayUsage ?? payload.totalDayUsage,
      };
    },
    [clients.mock, clients.real]
  );

  const getMonthlyUsage = useCallback(
    async (
     
      year: number,
      month: number,
      id?: string,
    ): Promise<{
      points: Array<{ x: string; y: number | null }>;
      totalMonthlyUsage?: number | null;
    }> => {
      const MOCK_ENABLED = false;
      const apiClient = MOCK_ENABLED ? clients.mock : clients.real;

      
      const endpoint = id
      ? USAGE_ENDPOINTS.CUSTOMER.MONTHLY(id,year, month) // for specific customer
      : USAGE_ENDPOINTS.GLOBAL.MONTHLY(year, month); // for global dashboard
      const response = await apiClient.get(endpoint);

      const payload = response.data ?? {};
      const slots = Array.isArray(payload.slots) ? payload.slots : [];

      const normalized = slots.map(
        (s: { label?: string | number; value?: number | null }) => ({
          x: String(s?.label ?? ''),
          y: s?.value ?? null,
        })
      );

      if (normalized.length === 1) {
        normalized.unshift({ x: '0', y: 0 });
      }

      return {
        points: !id ? payload.slots  :normalized,
        totalMonthlyUsage: payload.totalMonthUsage ?? payload.totalMonthUsage,
      };
    },
    [clients.mock, clients.real]
  );

  const getYearlyUsage = useCallback(
    async (
      
      year: number,id?: string,

    ): Promise<{
      points: Array<{ x: string; y: number | null }>;
      totalYearUsage?: number | null;
    }> => {
      const MOCK_ENABLED = false;
      const apiClient = MOCK_ENABLED ? clients.mock : clients.real;

      const endpoint = id
      ? USAGE_ENDPOINTS.CUSTOMER.YEARLY(id ,year) // for specific customer
      : USAGE_ENDPOINTS.GLOBAL.YEARLY(year); // for global dashboard
      const response = await apiClient.get(endpoint);


      const payload = response.data ?? {};
      const slots = Array.isArray(payload.slots) ? payload.slots : [];

      const normalized = slots.map(
        (s: { label?: string | number; value?: number | null }) => ({
          x: String(s?.label ?? ''),
          y: s?.value ?? null,
        })
      );

      // If backend returned a single slot, prepend a zero-valued initial point
      if (normalized.length === 1) {
        normalized.unshift({ x: '0', y: 0 });
      }

      return {
        points: !id ? payload.slots  :normalized,
        totalYearUsage: payload.totalYearUsage ?? payload.totalYearUsage,
      };
    },
    [clients.mock, clients.real]
  );

  return {
    getDailyUsage,
    getMonthlyUsage,
    getYearlyUsage,
  };
};

