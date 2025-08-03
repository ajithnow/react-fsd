import React from 'react';
import { NavigationProgress } from '@/shared/components';
import type { GlobalLayoutProps } from '../models';

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  // TODO: Add global providers and services here:
  // - Analytics tracking
  // - Error boundaries
  // - Theme providers
  // - Toast/notification providers
  // - Global state providers
  // - Performance monitoring

  return (
    <>
      <NavigationProgress color="#3b82f6" height={4} shadow={true} />
      {children}
    </>
  );
};
