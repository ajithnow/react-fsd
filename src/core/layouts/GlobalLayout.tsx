import React from 'react';
import { NavigationProgress, UnsavedChangesGuard } from '@/shared/components';
import type { GlobalLayoutProps } from '../types';
import { Toaster } from '@/lib/shadcn/components/ui/sonner';
import { ThemeProvider } from '@/core/theme';

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  // TODO: Add global providers and services here:
  // - Analytics tracking
  // - Error boundaries
  // - Toast/notification providers
  // - Global state providers
  // - Performance monitoring

  return (
    <ThemeProvider>
      <NavigationProgress color="#3b82f6" height={4} shadow={true} />
      <Toaster />
      <UnsavedChangesGuard />
      {children}
    </ThemeProvider>
  );
};
