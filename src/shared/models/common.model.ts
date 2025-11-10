import { AxiosError } from 'axios';
import React from 'react';
import { useAlertDialog } from '../components';

export interface GenerateResourcesOptions {
  modules: Record<string, LocaleStructure>;
  supportedLanguages: string[];
  features: string[];
}

export type LocaleStructure = {
  [key: string]: Record<string, string | Record<string, unknown>>;
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
export type UseAlertDialogReturn = ReturnType<typeof useAlertDialog>;

export interface UseUnsavedChangesBlockerProps {
  isDirty: boolean;
  confirmDialog: UseAlertDialogReturn;
}

export interface BackendResponse<T = unknown> {
  Data: T;
  Message: string;
  data: T;
  message: string;
}

export interface PdfPreviewProps {
  url: string;
  onClose?: () => void;
  translate: (key: string) => string; 
}

export type BackendErrorResponse = AxiosError<BackendResponse<unknown>>;
