import { useMemo } from 'react';
import { FeatureFlags } from '../models/featureFlags.model';
import { loadFeatureFlags, getFlag } from '../utils/featureFlags.utils';

export const useFeatureFlags = () => {
  const flags = useMemo(() => loadFeatureFlags(), []);

  const getFeatureFlag = <T = boolean>(path: string): T => {
    return getFlag<T>(flags, path);
  };

  const isEnabled = (flagName: string): boolean => {
    return getFlag<boolean>(flags, flagName);
  };

  const getAllFlags = (): FeatureFlags => {
    return { ...flags };
  };

  return {
    getFeatureFlag,
    isEnabled,
    getAllFlags,
    flags,
  };
};

export const getFeatureFlagValue = <T = boolean>(path: string): T => {
  const flags = loadFeatureFlags();
  return getFlag<T>(flags, path);
};
