import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { getFlag } from '../featureFlags.utils';
import { FeatureFlags } from '../../models/featureFlags.model';

describe('featureFlags.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getFlag', () => {
    const mockFlags: FeatureFlags = {
      auth: {
        enabled: true,
        features: {
          login: true,
          register: false,
          passwordReset: true
        }
      }
    };

    it('should get auth module enabled flag', () => {
      expect(getFlag(mockFlags, 'auth.enabled')).toBe(true);
    });

    it('should get auth feature flags', () => {
      expect(getFlag(mockFlags, 'auth.features.login')).toBe(true);
      expect(getFlag(mockFlags, 'auth.features.register')).toBe(false);
      expect(getFlag(mockFlags, 'auth.features.passwordReset')).toBe(true);
    });

    it('should return false and warn for non-existent flags', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getFlag(mockFlags, 'nonExistent');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Feature flag not found: nonExistent');
      
      consoleSpy.mockRestore();
    });

    it('should return false and warn for non-existent nested flags', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getFlag(mockFlags, 'auth.features.nonExistent');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Feature flag not found: auth.features.nonExistent');
      
      consoleSpy.mockRestore();
    });

    it('should return correct types based on generic parameter', () => {
      const booleanFlag = getFlag<boolean>(mockFlags, 'auth.enabled');
      const nestedBooleanFlag = getFlag<boolean>(mockFlags, 'auth.features.login');
      
      expect(typeof booleanFlag).toBe('boolean');
      expect(typeof nestedBooleanFlag).toBe('boolean');
      expect(booleanFlag).toBe(true);
      expect(nestedBooleanFlag).toBe(true);
    });

    it('should handle undefined intermediate paths gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getFlag(mockFlags, 'nonExistent.nested.path');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Feature flag not found: nonExistent.nested.path');
      
      consoleSpy.mockRestore();
    });
  });
});
