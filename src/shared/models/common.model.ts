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

