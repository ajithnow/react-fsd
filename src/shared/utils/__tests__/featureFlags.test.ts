import { renderHook } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useFeatureFlags, useFeatureFlag, getFeatureFlag } from '../featureFlags';

// Mock the core feature flags
jest.mock('../../../core/featureFlags', () => ({
  useFeatureFlags: jest.fn(() => ({
    getFeatureFlag: jest.fn((path: string) => {
      const mockFlags = {
        auth: {
          enabled: true,
          features: {
            login: true,
            register: false,
            passwordReset: true
          }
        }
      };
      const keys = path.split('.');
      let current: unknown = mockFlags;
      for (const key of keys) {
        current = (current as Record<string, unknown>)?.[key];
      }
      return current;
    }),
    isEnabled: jest.fn((path: string) => path === 'auth.enabled' || path === 'auth.features.login'),
    getAllFlags: jest.fn(() => ({
      auth: {
        enabled: true,
        features: {
          login: true,
          register: false,
          passwordReset: true
        }
      }
    })),
    flags: {
      auth: {
        enabled: true,
        features: {
          login: true,
          register: false,
          passwordReset: true
        }
      }
    }
  })),
  getFeatureFlagValue: jest.fn((path: string) => {
    const mockFlags = {
      auth: {
        enabled: true,
        features: {
          login: true,
          register: false,
          passwordReset: true
        }
      }
    };
    const keys = path.split('.');
    let current: unknown = mockFlags;
    for (const key of keys) {
      current = (current as Record<string, unknown>)?.[key];
    }
    return current;
  })
}));

import { 
  useFeatureFlags as useCoreFeatureFlags, 
  getFeatureFlagValue 
} from '../../../core/featureFlags';

const mockUseCoreFeatureFlags = useCoreFeatureFlags as jest.MockedFunction<typeof useCoreFeatureFlags>;
const mockGetFeatureFlagValue = getFeatureFlagValue as jest.MockedFunction<typeof getFeatureFlagValue>;

describe('shared/utils/featureFlags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useFeatureFlags (re-export)', () => {
    it('should re-export the core useFeatureFlags hook', () => {
      const { result } = renderHook(() => useFeatureFlags());
      
      expect(mockUseCoreFeatureFlags).toHaveBeenCalledTimes(1);
      expect(result.current).toHaveProperty('getFeatureFlag');
      expect(result.current).toHaveProperty('isEnabled');
      expect(result.current).toHaveProperty('getAllFlags');
      expect(result.current).toHaveProperty('flags');
    });
  });

  describe('useFeatureFlag', () => {
    it('should return a specific feature flag value', () => {
      const { result } = renderHook(() => useFeatureFlag('auth.enabled'));
      
      expect(result.current).toBe(true);
      expect(mockUseCoreFeatureFlags).toHaveBeenCalledTimes(1);
    });

    it('should return typed feature flag values', () => {
      const { result: authResult } = renderHook(() => useFeatureFlag<boolean>('auth.enabled'));
      const { result: loginResult } = renderHook(() => useFeatureFlag<boolean>('auth.features.login'));
      
      expect(typeof authResult.current).toBe('boolean');
      expect(typeof loginResult.current).toBe('boolean');
      expect(authResult.current).toBe(true);
      expect(loginResult.current).toBe(true);
    });

    it('should handle nested flag paths', () => {
      const { result } = renderHook(() => useFeatureFlag<boolean>('auth.features.passwordReset'));
      
      expect(result.current).toBe(true);
    });

    it('should work with different flag types', () => {
      const { result: authResult } = renderHook(() => useFeatureFlag<boolean>('auth.enabled'));
      const { result: loginResult } = renderHook(() => useFeatureFlag<boolean>('auth.features.login'));
      const { result: registerResult } = renderHook(() => useFeatureFlag<boolean>('auth.features.register'));
      
      expect(authResult.current).toBe(true);
      expect(loginResult.current).toBe(true);
      expect(registerResult.current).toBe(false);
    });

    it('should use the core hook internally', () => {
      renderHook(() => useFeatureFlag('auth.enabled'));
      
      expect(mockUseCoreFeatureFlags).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFeatureFlag (non-hook)', () => {
    it('should return feature flag value without React context', () => {
      const value = getFeatureFlag('auth.enabled');
      
      expect(value).toBe(true);
      expect(mockGetFeatureFlagValue).toHaveBeenCalledWith('auth.enabled');
    });

    it('should handle typed values', () => {
      const authValue = getFeatureFlag<boolean>('auth.enabled');
      const loginValue = getFeatureFlag<boolean>('auth.features.login');
      
      expect(typeof authValue).toBe('boolean');
      expect(typeof loginValue).toBe('boolean');
      expect(authValue).toBe(true);
      expect(loginValue).toBe(true);
    });

    it('should work with nested paths', () => {
      const passwordResetValue = getFeatureFlag<boolean>('auth.features.passwordReset');
      
      expect(passwordResetValue).toBe(true);
      expect(mockGetFeatureFlagValue).toHaveBeenCalledWith('auth.features.passwordReset');
    });

    it('should be callable multiple times', () => {
      getFeatureFlag('auth.enabled');
      getFeatureFlag('auth.features.login');
      getFeatureFlag('auth.features.register');
      
      expect(mockGetFeatureFlagValue).toHaveBeenCalledTimes(3);
      expect(mockGetFeatureFlagValue).toHaveBeenNthCalledWith(1, 'auth.enabled');
      expect(mockGetFeatureFlagValue).toHaveBeenNthCalledWith(2, 'auth.features.login');
      expect(mockGetFeatureFlagValue).toHaveBeenNthCalledWith(3, 'auth.features.register');
    });
  });

  describe('integration with core', () => {
    it('should maintain API compatibility with core hooks', () => {
      // Test that shared wrapper maintains same API as core
      const { result: sharedResult } = renderHook(() => useFeatureFlags());
      
      // Should have all the same methods as core
      expect(sharedResult.current).toHaveProperty('getFeatureFlag');
      expect(sharedResult.current).toHaveProperty('isEnabled');
      expect(sharedResult.current).toHaveProperty('getAllFlags');
      expect(sharedResult.current).toHaveProperty('flags');
      
      // Methods should work
      expect(typeof sharedResult.current.getFeatureFlag).toBe('function');
      expect(typeof sharedResult.current.isEnabled).toBe('function');
      expect(typeof sharedResult.current.getAllFlags).toBe('function');
    });

    it('should provide both hook and non-hook access patterns', () => {
      // Hook pattern
      const { result } = renderHook(() => useFeatureFlag('auth.enabled'));
      expect(result.current).toBe(true);
      
      // Non-hook pattern
      const nonHookValue = getFeatureFlag('auth.enabled');
      expect(nonHookValue).toBe(true);
    });
  });
});
