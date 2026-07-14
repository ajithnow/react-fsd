import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import apiClient from '@/core/api';
import useProfileService from '../profile.service';
import { ENDPOINTS } from '../../constants';

vi.mock('@/core/api');
const mockApiClient = apiClient as Mocked<typeof apiClient>;

describe('Profile Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProfile maps the me endpoint response to a session user', async () => {
    mockApiClient.get.mockResolvedValue({
      data: {
        data: {
          id: '42',
          firstName: 'Ada',
          lastName: 'Admin',
          email: 'ada@example.com',
          role: 'admin',
        },
      },
    });

    const { getProfile } = useProfileService();
    const user = await getProfile();

    expect(mockApiClient.get).toHaveBeenCalledWith(ENDPOINTS.ME);
    expect(user.email).toBe('ada@example.com');
    expect(user.role).toBe('admin');
    expect(user.permissions).toEqual([]);
  });

  it('keeps permissions returned by /me', async () => {
    mockApiClient.get.mockResolvedValue({
      data: {
        data: {
          id: '42',
          email: 'ada@example.com',
          role: 'admin',
          permissions: ['admin:dashboard'],
        },
      },
    });

    const { getProfile } = useProfileService();
    const user = await getProfile();

    expect(user.permissions).toEqual(['admin:dashboard']);
  });
});
