import {
  authStorage,
  isAuthenticated,
  AUTH_TOKEN_KEY,
} from '../auth.utils';

// Mock localStorage — storageService JSON-serializes values
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('authStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify('test-token'));

      const result = authStorage.getToken();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
      expect(result).toBe('test-token');
    });

    it('should return null when no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = authStorage.getToken();

      expect(result).toBeNull();
    });

    it('should return null when localStorage throws error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = authStorage.getToken();

      expect(result).toBeNull();
    });
  });

  describe('setToken', () => {
    it('should set token in localStorage', () => {
      authStorage.setToken('new-token');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN_KEY,
        JSON.stringify('new-token')
      );
    });

    it('should handle localStorage errors silently', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => authStorage.setToken('token')).not.toThrow();
    });
  });

  describe('removeToken', () => {
    it('should remove token and legacy auth_user from localStorage', () => {
      authStorage.removeToken();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth_user');
    });

    it('should handle localStorage errors silently', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => authStorage.removeToken()).not.toThrow();
    });
  });

  describe('purgeLegacyUser', () => {
    it('should remove legacy auth_user key', () => {
      authStorage.purgeLegacyUser();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth_user');
    });
  });
});

describe('isAuthenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when token exists and is valid', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('valid-token'));

    const result = isAuthenticated();

    expect(result).toBe(true);
  });

  it('should return false when no token exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const result = isAuthenticated();

    expect(result).toBe(false);
  });

  it('should return false when token is empty string', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(''));

    const result = isAuthenticated();

    expect(result).toBe(false);
  });

  it('should return false when localStorage throws error', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const result = isAuthenticated();

    expect(result).toBe(false);
  });
});
