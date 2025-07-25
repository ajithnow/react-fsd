import { FeatureFlags } from '../models/featureFlags.model';
import defaultFlags from '../../config/featureFlags.json';

// Environment variable getter that works in both Vite and Jest
const getViteEnvVar = (key: string): string | undefined => {
  // In Jest/Node environment, use process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // In Vite/browser environment, try to access import.meta.env
  // This will be replaced by a mock in test environment
  if (typeof window !== 'undefined' && 'import' in globalThis) {
    try {
      // @ts-expect-error - We know this might not exist in all environments
      return globalThis.import.meta.env[key];
    } catch {
      return undefined;
    }
  }
  
  return undefined;
};

export const loadFeatureFlags = (): FeatureFlags => {
  try {
    let flags = JSON.parse(JSON.stringify(defaultFlags)) as FeatureFlags;
    const envFlags = getViteEnvVar('VITE_FEATURE_FLAGS');
    if (envFlags) {
      const parsedEnvFlags = JSON.parse(envFlags);
      flags = { ...flags, ...parsedEnvFlags } as FeatureFlags;
    }

    console.log('Feature flags loaded:', flags);
    return flags;
  } catch (error) {
    console.warn('Failed to load feature flags from environment, using defaults:', error);
    return defaultFlags as FeatureFlags;
  }
};

export const getFlag = <T = boolean>(flags: FeatureFlags, path: string): T => {
  const keys = path.split('.');
  let current: unknown = flags;
  
  for (const key of keys) {
    current = (current as Record<string, unknown>)?.[key];
    if (current === undefined) {
      console.warn(`Feature flag not found: ${path}`);
      return false as T;
    }
  }
  
  return current as T;
};
