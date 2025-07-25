import { renderHook } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { useFeatureFlags, getFeatureFlagValue } from '../index';

// Mock the utils
jest.mock('../../utils/featureFlags.utils', () => ({
  loadFeatureFlags: jest.fn(() => ({
    auth: {
      enabled: true,
      features: {
        login: true,
        register: false,
        passwordReset: true
      }
    }
  })),
  getFlag: jest.fn((flags, path: string) => {
    const keys = path.split('.');
    let current: unknown = flags;
    
    for (const key of keys) {
      current = (current as Record<string, unknown>)?.[key];
      if (current === undefined) {
        return false;
      }
    }
    
    return current;
  })
}));

import { loadFeatureFlags, getFlag } from '../../utils/featureFlags.utils';

const mockLoadFeatureFlags = loadFeatureFlags as jest.MockedFunction<typeof loadFeatureFlags>;
const mockGetFlag = getFlag as jest.MockedFunction<typeof getFlag>;

describe('featureFlags.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('useFeatureFlags', () => {
    it('should load feature flags on mount', () => {
      renderHook(() => useFeatureFlags());
      
      expect(mockLoadFeatureFlags).toHaveBeenCalledTimes(1);
    });

    it('should memoize flags to prevent unnecessary reloads', () => {
      const { rerender } = renderHook(() => useFeatureFlags());
      
      // Rerender the hook
      rerender();
      
      // Should still only be called once due to useMemo
      expect(mockLoadFeatureFlags).toHaveBeenCalledTimes(1);
    });

    it('should return correct feature flag methods', () => {
      const { result } = renderHook(() => useFeatureFlags());
      
      expect(result.current).toHaveProperty('getFeatureFlag');
      expect(result.current).toHaveProperty('isEnabled');
      expect(result.current).toHaveProperty('getAllFlags');
      expect(result.current).toHaveProperty('flags');
      
      expect(typeof result.current.getFeatureFlag).toBe('function');
      expect(typeof result.current.isEnabled).toBe('function');
      expect(typeof result.current.getAllFlags).toBe('function');
      expect(typeof result.current.flags).toBe('object');
    });

    it('should return all flags via getAllFlags', () => {
      const { result } = renderHook(() => useFeatureFlags());
      
      const allFlags = result.current.getAllFlags();
      
      expect(allFlags).toEqual({
        auth: {
          enabled: true,
          features: {
            login: true,
            register: false,
            passwordReset: true
          }
        }
      });
    });

    it('should get individual flags via getFeatureFlag', () => {
      const { result } = renderHook(() => useFeatureFlags());
      
      const authEnabledFlag = result.current.getFeatureFlag('auth.enabled');
      const loginFlag = result.current.getFeatureFlag('auth.features.login');
      
      expect(authEnabledFlag).toBe(true);
      expect(loginFlag).toBe(true);
      expect(mockGetFlag).toHaveBeenCalledWith(expect.any(Object), 'auth.enabled');
      expect(mockGetFlag).toHaveBeenCalledWith(expect.any(Object), 'auth.features.login');
    });

    it('should check if flags are enabled via isEnabled', () => {
      const { result } = renderHook(() => useFeatureFlags());
      
      const isAuthEnabled = result.current.isEnabled('auth.enabled');
      const isRegisterEnabled = result.current.isEnabled('auth.features.register');
      
      expect(isAuthEnabled).toBe(true);
      expect(isRegisterEnabled).toBe(false);
      expect(mockGetFlag).toHaveBeenCalledWith(expect.any(Object), 'auth.enabled');
      expect(mockGetFlag).toHaveBeenCalledWith(expect.any(Object), 'auth.features.register');
    });
  });

  describe('getFeatureFlagValue', () => {
    it('should get feature flag value without React context', () => {
      const value = getFeatureFlagValue('auth.enabled');
      
      expect(value).toBe(true);
      expect(mockLoadFeatureFlags).toHaveBeenCalledTimes(1);
      expect(mockGetFlag).toHaveBeenCalledWith(expect.any(Object), 'auth.enabled');
    });

    it('should get typed feature flag values', () => {
      const authEnabledValue = getFeatureFlagValue<boolean>('auth.enabled');
      const loginValue = getFeatureFlagValue<boolean>('auth.features.login');
      
      expect(typeof authEnabledValue).toBe('boolean');
      expect(typeof loginValue).toBe('boolean');
      expect(authEnabledValue).toBe(true);
      expect(loginValue).toBe(true);
    });
  });
});
