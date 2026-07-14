// Utility to handle environment variables across different environments
// For Jest tests, this will use process.env
// For Vite builds, Vite will replace `process.env.*` variables with static values.

export const ENV = {
  get API_BASE_URL() {
    const url = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
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
};
