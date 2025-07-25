import React from 'react';

// Base guard props interface
export interface BaseGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Auth-specific guard props
export interface AuthGuardProps extends BaseGuardProps {
  redirectTo?: string; // Where to redirect when not authenticated
}

// Guest-specific guard props (for login/register pages)
export interface GuestGuardProps extends BaseGuardProps {
  redirectTo?: string; // Where to redirect when authenticated
}
