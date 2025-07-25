// Auth token management utilities
export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';

export const authStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      // Handle localStorage errors silently
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // Handle localStorage errors silently
    }
  },

  getUser: <T = unknown>(): T | null => {
    try {
      const user = localStorage.getItem(AUTH_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser: <T = unknown>(user: T): void => {
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch {
      // Handle localStorage errors silently
    }
  },
};

export const isAuthenticated = (): boolean => {
  const token = authStorage.getToken();
  if (!token) return false;
  
  // Add token validation logic here if needed
  // For example, check if token is expired
  try {
    // Basic token presence check
    return token.length > 0;
  } catch {
    return false;
  }
};
