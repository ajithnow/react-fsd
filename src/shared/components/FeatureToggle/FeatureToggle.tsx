import React from 'react';
import { useFeatureFlag } from '../../utils/featureFlags';

export interface FeatureToggleProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureToggle: React.FC<FeatureToggleProps> = ({ 
  feature, 
  children, 
  fallback = null 
}) => {
  const isEnabled = useFeatureFlag<boolean>(feature);
  
  return isEnabled ? <>{children}</> : <>{fallback}</>;
};

export default FeatureToggle;
