// Utility to handle environment variables across different environments
// For Jest tests, this will use process.env
// For Vite builds, Vite will transform import.meta.env to process.env

export function getEnvVar(key: string, fallback?: string): string {
  // Always use process.env - Vite will transform import.meta.env references to this
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback || '';
  }
  
  return fallback || '';
}

// Common environment variable getters
export const ENV = {
  get API_BASE_URL() {
    return getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api');
  },
  
  get NODE_ENV() {
    return getEnvVar('NODE_ENV', 'development');
  },
  
  get MODE() {
    // In Vite, use MODE, in Jest use NODE_ENV
    return getEnvVar('MODE') || getEnvVar('NODE_ENV', 'development');
  },
  
  get IS_DEV() {
    return this.MODE === 'development';
  },
  
  get IS_PROD() {
    return this.MODE === 'production';
  },
  
  get IS_TEST() {
    return this.NODE_ENV === 'test';
  },
  
  get I18N_DEBUG() {
    return getEnvVar('VITE_I18N_DEBUG', 'false');
  },
  
  get MSW_ENABLED() {
    return getEnvVar('VITE_MSW_ENABLED', 'false');
  }
};
