import { useFeatureFlags as useCoreFeatureFlags, getFeatureFlagValue } from '../../core/featureFlags';


export const useFeatureFlags = useCoreFeatureFlags;


export const useFeatureFlag = <T = boolean>(path: string): T => {
  const { getFeatureFlag } = useFeatureFlags();
  return getFeatureFlag<T>(path);
};

export const getFeatureFlag = getFeatureFlagValue;
