import type React from 'react';

export type GuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
};

export type BaseGuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};
