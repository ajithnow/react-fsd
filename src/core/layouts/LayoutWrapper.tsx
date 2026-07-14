import React from 'react';
import { GlobalLayout } from './GlobalLayout';
import type { LayoutWrapperProps } from '../types';

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return <GlobalLayout>{children}</GlobalLayout>;
};
