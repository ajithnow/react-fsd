import { http, HttpResponse } from 'msw';

// Mock user profile data
const mockProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Power User',
};

// Mock notification settings
const mockNotificationSettings = {
  type: 'all' as const,
  communicationEmails: true,
  marketingEmails: false,
  securityEmails: true,
};

export const settingsHandlers = [
  // Get profile
  http.get('/api/settings/profile', () => {
    return HttpResponse.json({ data: mockProfile });
  }),

  // Update profile
  http.put('/api/settings/profile', async ({ request }) => {
    const data = await request.json();
    const updatedProfile = {
      ...mockProfile,
      ...(typeof data === 'object' && data !== null ? data : {})
    };
    return HttpResponse.json({ data: updatedProfile });
  }),

  // Change password
  http.put('/api/settings/password', async ({ request }) => {
    const data = await request.json() as { currentPassword: string; newPassword: string };
    
    // Simulate password validation
    if (data.currentPassword !== 'current123') {
      return HttpResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    if (data.newPassword.length < 8) {
      return HttpResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    return HttpResponse.json({ message: 'Password updated successfully' });
  }),

  // Get notification settings
  http.get('/api/settings/notifications', () => {
    return HttpResponse.json({ data: mockNotificationSettings });
  }),

  // Update notification settings
  http.put('/api/settings/notifications', async ({ request }) => {
    const data = await request.json();
    const updatedSettings = {
      ...mockNotificationSettings,
      ...(typeof data === 'object' && data !== null ? data : {})
    };
    return HttpResponse.json({ data: updatedSettings });
  }),
];
