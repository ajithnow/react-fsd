import type React from 'react';
import type { useAlertDialog } from '../components';

export type LocaleStructure = {
  [key: string]: Record<string, string | Record<string, unknown>>;
};

export type GenerateResourcesOptions = {
  modules: Record<string, LocaleStructure>;
  supportedLanguages: string[];
  features: string[];
};

export type GuardStructure = {
  [key: string]: React.ComponentType<{
    children: React.ReactNode;
    [key: string]: unknown;
  }>;
};

export type GenerateGuardsOptions = {
  modules: Record<string, GuardStructure>;
  features: string[];
};

export type UseAlertDialogReturn = ReturnType<typeof useAlertDialog>;

export type UseUnsavedChangesBlockerProps = {
  isDirty: boolean;
  confirmDialog: UseAlertDialogReturn;
};
