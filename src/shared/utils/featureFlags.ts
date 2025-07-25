import { useFeatureFlags as useCoreFeatureFlags, getFeatureFlagValue } from '../../core/featureFlags';

// Re-export the core hook for convenience
export const useFeatureFlags = useCoreFeatureFlags;

// Simple hook for getting a single feature flag
export const useFeatureFlag = <T = boolean>(path: string): T => {
  const { getFeatureFlag } = useFeatureFlags();
  return getFeatureFlag<T>(path);
};

// Non-hook version for use outside React components
export const getFeatureFlag = getFeatureFlagValue;
