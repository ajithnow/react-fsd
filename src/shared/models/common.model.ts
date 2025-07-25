import React from 'react';

export interface GenerateResourcesOptions {
  modules: Record<string, LocaleStructure>;
  supportedLanguages: string[];
  features: string[];
}

export type LocaleStructure = {
  [key: string]: Record<string, Record<string, string>>;
};

export interface GenerateGuardsOptions {
  modules: Record<string, GuardStructure>;
  features: string[];
}

export type GuardStructure = {
  [key: string]: React.ComponentType<{
    children: React.ReactNode;
    [key: string]: unknown;
  }>;
};

// Guard component props interfaces
export interface GuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

// Auth-specific guard props
export interface AuthGuardProps extends GuardProps {
  redirectTo?: string; // Where to redirect when not authenticated
}

// Guest-specific guard props
export interface GuestGuardProps extends GuardProps {
  redirectTo?: string; // Where to redirect when authenticated
}
