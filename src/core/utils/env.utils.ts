// Utility to handle environment variables across different environments
// For Jest tests, this will use process.env
// For Vite builds, Vite will replace `process.env.*` variables with static values.

export const ENV = {
  get API_BASE_URL() {
    const url = process.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return url;
  },

  get NODE_ENV() {
    return process.env.NODE_ENV || 'development';
  },

  get MODE() {
    return process.env.MODE || process.env.NODE_ENV || 'development';
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
    return process.env.VITE_I18N_DEBUG || 'false';
  },

  /** When false, all RBAC permission/role checks allow access. Default: true. */
  get RBAC_ENABLED() {
    const value = process.env.VITE_RBAC_ENABLED;
    if (value === undefined || value === '') return true;
    return value !== 'false' && value !== '0';
  },
};
