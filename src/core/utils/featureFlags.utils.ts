import { FeatureFlags } from '../models/featureFlags.model';

const getViteEnvVar = (key: string): string | undefined => {
  // Node.js/Jest environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }

  // Browser/Vite environment - check if import.meta exists
  if (typeof window !== 'undefined' && typeof globalThis !== 'undefined') {
    try {
      // Use globalThis to access import.meta safely
      const globalWithImport = globalThis as typeof globalThis & {
        import?: { meta?: { env?: Record<string, string> } };
      };

      if (globalWithImport.import?.meta?.env) {
        return globalWithImport.import.meta.env[key];
      }

      // Fallback: try accessing via string key to avoid TypeScript issues
      const globalAny = globalThis as Record<string, unknown>;
      const importObj = globalAny['import'] as
        | { meta?: { env?: Record<string, string> } }
        | undefined;
      return importObj?.meta?.env?.[key];
    } catch {
      // Silent fail in case of any access errors
    }
  }

  return undefined;
};

export const loadFeatureFlags = (): FeatureFlags => {
  const envFlagsRaw = getViteEnvVar('VITE_FEATURE_FLAGS');
  return JSON.parse(envFlagsRaw ?? '{}') as FeatureFlags;
};

export const getFlag = <T = boolean>(flags: FeatureFlags, path: string): T => {
  const value = getNestedValue(flags, path);
  if (value === undefined) {
    console.warn(`Feature flag not found: ${path}`);
    return false as T;
  }
  return value as T;
};

const getNestedValue = (
  obj: Record<string, unknown>,
  path: string
): unknown => {
  return path.split('.').reduce((acc: unknown, key) => {
    return acc && typeof acc === 'object' && key in acc
      ? (acc as Record<string, unknown>)[key]
      : undefined;
  }, obj);
};
