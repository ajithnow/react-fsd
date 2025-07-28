import React from 'react';

export interface GuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export interface BaseGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}