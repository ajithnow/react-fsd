import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import apiClient from '../../../../core/api';
import useLogoutService from '../logout.service';
import { authStorage } from '../../utils';

// Mock the API client
jest.mock('../../../../core/api');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Mock auth storage
jest.mock('../../utils', () => ({
  authStorage: {
    getToken: jest.fn(),
    clearStorage: jest.fn(),
  },
}));

const mockAuthStorage = authStorage as jest.Mocked<typeof authStorage>;

describe('Logout Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call logout API with refresh token', async () => {
    const mockToken = 'mock-token';
    const mockRefreshToken = 'mock-refresh-token';
    const mockResponse = { data: { success: true } };

    mockAuthStorage.getToken.mockReturnValue(mockToken);
    mockApiClient.post.mockResolvedValue(mockResponse);

    const service = useLogoutService();
    const result = await service.logout(mockRefreshToken);

    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/auth/logout',
      { refreshToken: mockRefreshToken },
      {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );
    expect(result).toEqual({ success: true });
  });

  it('should call logout API without token when not available', async () => {
    const mockRefreshToken = 'mock-refresh-token';
    const mockResponse = { data: { success: true } };

    mockAuthStorage.getToken.mockReturnValue(null);
    mockApiClient.post.mockResolvedValue(mockResponse);

    const service = useLogoutService();
    await service.logout(mockRefreshToken);

    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/auth/logout',
      { refreshToken: mockRefreshToken },
      {
        headers: {},
      }
    );
  });

  it('should handle API errors', async () => {
    const error = new Error('Network error');
    const mockRefreshToken = 'mock-refresh-token';

    mockAuthStorage.getToken.mockReturnValue('token');
    mockApiClient.post.mockRejectedValue(error);

    const service = useLogoutService();

    await expect(service.logout(mockRefreshToken)).rejects.toThrow(
      'Network error'
    );
  });

  it('should use empty string as default refresh token', async () => {
    const mockToken = 'mock-token';
    const mockResponse = { data: { success: true } };

    mockAuthStorage.getToken.mockReturnValue(mockToken);
    mockApiClient.post.mockResolvedValue(mockResponse);

    const service = useLogoutService();
    await service.logout();

    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/auth/logout',
      { refreshToken: '' },
      {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );
  });
});
