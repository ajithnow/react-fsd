import { http, HttpResponse } from 'msw';
import type {
  LoginRequest,
  RegisterRequest,
  User,
  AuthResponse,
  ApiResponse,
  RefreshTokenRequest,
  LogoutRequest,
} from '../models/mock.model'; // Assuming these types are defined in common.model

// Mock users database
const users: (User & { password: string })[] = [
  {
    id: 1,
    name: 'John Doe',
    username: 'john@example.com',
    password: 'password123',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    username: 'jane@example.com',
    password: 'password123',
    role: 'user',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

// Mock token storage
const validTokens = new Set<string>();
const validRefreshTokens = new Set<string>();

// Helper functions
const generateToken = (): string => {
  return (
    'mock_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
  );
};

const generateTokens = (): { accessToken: string; refreshToken: string } => {
  const accessToken = generateToken();
  const refreshToken = generateToken();
  validTokens.add(accessToken);
  validRefreshTokens.add(refreshToken);
  return { accessToken, refreshToken };
};

const isValidToken = (token: string): boolean => {
  return validTokens.has(token);
};

const getUserFromToken = (token: string): User | null => {
  if (!isValidToken(token)) return null;
  // In a real application, you would decode the JWT to get user information.
  // For this mock, we'll return the first user as a placeholder.
  // This assumes that any valid token corresponds to a known user in this mock setup.
  if (users.length > 0) {
    const { ...userWithoutPassword } = users[0];
    return userWithoutPassword;
  }
  return null;
};

export const authHandler = [
  // Login
  http.post<never, ApiResponse<AuthResponse> | ApiResponse<null>>(
    '/api/auth/login',
    async ({ request }) => {
      let body: LoginRequest;
      try {
        body = (await request.json()) as unknown as LoginRequest;
      } catch (error) {
        // Handle cases where the request body is not valid JSON or is empty
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Invalid request body format';
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: errorMessage,
            success: false,
          },
          { status: 400 }
        );
      }

      // Validate essential fields are present
      if (
        !body ||
        typeof body.username !== 'string' ||
        typeof body.password !== 'string'
      ) {
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: 'username and password are required',
            success: false,
          },
          { status: 400 }
        );
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user by username
      const user = users.find(u => u.username === body.username);

      if (!user || user.password !== body.password) {
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: 'Invalid username or password',
            success: false,
          },
          { status: 401 }
        );
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens();

      // Remove password from response for security
      const { ...userWithoutPassword } = user;

      return HttpResponse.json<ApiResponse<AuthResponse>>({
        data: {
          user: userWithoutPassword,
          accessToken,
          refreshToken,
          expiresIn: 3600, // 1 hour expiration for access token
        },
        message: 'Login successful',
        success: true,
      });
    }
  ),

  // Register
  http.post<never, ApiResponse<AuthResponse> | ApiResponse<null>>(
    '/api/auth/register',
    async ({ request }) => {
      let body: RegisterRequest;
      try {
        body = (await request.json()) as unknown as RegisterRequest;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Invalid request body format';
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: errorMessage,
            success: false,
          },
          { status: 400 }
        );
      }

      // Validate essential fields are present
      if (
        !body ||
        typeof body.name !== 'string' ||
        typeof body.username !== 'string' ||
        typeof body.password !== 'string'
      ) {
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message:
              'Name, username, and password are required for registration',
            success: false,
          },
          { status: 400 }
        );
      }

      // Check if user already exists with the given username
      const existingUser = users.find(u => u.username === body.username);
      if (existingUser) {
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: 'User with this username already exists',
            success: false,
          },
          { status: 409 } // Conflict status code
        );
      }

      // Create new user with a unique ID
      const newUser: User & { password: string } = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1, // Ensure ID is unique and starts from 1 if users array is empty
        name: body.name,
        username: body.username,
        password: body.password,
        role: 'user', // Default role for new registrations
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);

      // Generate tokens for the newly registered user
      const { accessToken, refreshToken } = generateTokens();

      // Remove password from response for security
      const { ...userWithoutPassword } = newUser;

      return HttpResponse.json<ApiResponse<AuthResponse>>(
        {
          data: {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
            expiresIn: 3600, // 1 hour expiration
          },
          message: 'Registration successful',
          success: true,
        },
        { status: 201 }
      ); // Created status code
    }
  ),

  // Get current user (protected route)
  http.get<never, ApiResponse<User> | ApiResponse<null>>(
    '/api/auth/me',
    ({ request }) => {
      const authHeader = request.headers.get('Authorization');
      // Extract token, ensuring it's a string and removing 'Bearer ' prefix
      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.replace('Bearer ', '')
        : null;

      if (!token || !isValidToken(token)) {
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: 'Unauthorized: No valid token provided',
            success: false,
          },
          { status: 401 }
        );
      }

      const user = getUserFromToken(token);
      if (!user) {
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: 'User not found or token invalid',
            success: false,
          },
          { status: 404 }
        );
      }

      return HttpResponse.json<ApiResponse<User>>({
        data: user,
        message: 'User data retrieved successfully',
        success: true,
      });
    }
  ),

  // Refresh token
  http.post<
    never,
    | ApiResponse<{ accessToken: string; refreshToken: string }>
    | ApiResponse<null>
  >('/api/auth/refresh', async ({ request }) => {
    let body: RefreshTokenRequest;
    try {
      body = (await request.json()) as unknown as RefreshTokenRequest;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid request body format';
      return HttpResponse.json<ApiResponse<null>>(
        {
          data: null,
          message: errorMessage,
          success: false,
        },
        { status: 400 }
      );
    }

    // Validate refresh token is present
    if (!body || typeof body.refreshToken !== 'string') {
      return HttpResponse.json<ApiResponse<null>>(
        {
          data: null,
          message: 'Refresh token is required',
          success: false,
        },
        { status: 400 }
      );
    }

    if (!validRefreshTokens.has(body.refreshToken)) {
      return HttpResponse.json<ApiResponse<null>>(
        {
          data: null,
          message: 'Invalid refresh token',
          success: false,
        },
        { status: 401 }
      );
    }

    // Remove old refresh token to invalidate it after use (one-time use refresh tokens)
    validRefreshTokens.delete(body.refreshToken);

    // Generate new access and refresh tokens
    const { accessToken, refreshToken } = generateTokens();

    return HttpResponse.json<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >({
      data: {
        accessToken,
        refreshToken,
      },
      message: 'Token refreshed successfully',
      success: true,
    });
  }),

  // Logout
  http.post<never, ApiResponse<null>>(
    '/api/auth/logout',
    async ({ request }) => {
      const authHeader = request.headers.get('Authorization');
      // Extract token, ensuring it's a string and removing 'Bearer ' prefix
      const accessToken = authHeader?.startsWith('Bearer ')
        ? authHeader.replace('Bearer ', '')
        : null;

      let body: LogoutRequest;
      try {
        body = (await request.json()) as unknown as LogoutRequest;
      } catch (error) {
        // If body is malformed, proceed with access token invalidation if present
        console.error('Failed to parse logout request body:', error);
        body = { refreshToken: '' }; // Default to empty refreshToken if parsing fails
      }

      // Remove tokens from valid sets if they exist
      if (accessToken && validTokens.has(accessToken)) {
        validTokens.delete(accessToken);
      }
      if (body.refreshToken && validRefreshTokens.has(body.refreshToken)) {
        validRefreshTokens.delete(body.refreshToken);
      }

      return HttpResponse.json<ApiResponse<null>>({
        data: null,
        message: 'Logged out successfully',
        success: true,
      });
    }
  ),

  // Change password (protected)
  http.put<never, ApiResponse<null>>(
    '/api/auth/change-password',
    async ({ request }) => {
      const authHeader = request.headers.get('Authorization');
      // Extract token, ensuring it's a string and removing 'Bearer ' prefix
      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.replace('Bearer ', '')
        : null;

      if (!token || !isValidToken(token)) {
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: 'Unauthorized: No valid token provided',
            success: false,
          },
          { status: 401 }
        );
      }

      let body: { currentPassword?: string; newPassword?: string };
      try {
        body = (await request.json()) as unknown as {
          currentPassword: string;
          newPassword: string;
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Invalid request body format';
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: errorMessage,
            success: false,
          },
          { status: 400 }
        );
      }

      // Validate essential fields are present
      if (
        typeof body.currentPassword !== 'string' ||
        typeof body.newPassword !== 'string'
      ) {
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: 'Current password and new password are required',
            success: false,
          },
          { status: 400 }
        );
      }

      // In a real application, you'd get the user associated with the token.
      // For this mock, we'll assume the change password request is for 'john@example.com'.
      // This is a simplification for the mock and should be replaced with actual token-based user lookup.
      const user = users.find(u => u.username === 'john@example.com');

      if (!user) {
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: 'User not found', // This case should ideally be covered by token validation
            success: false,
          },
          { status: 404 }
        );
      }

      if (user.password !== body.currentPassword) {
        return HttpResponse.json<ApiResponse<null>>(
          {
            data: null,
            message: 'Current password is incorrect',
            success: false,
          },
          { status: 400 }
        );
      }

      // Update password
      user.password = body.newPassword;

      return HttpResponse.json<ApiResponse<null>>({
        data: null,
        message: 'Password changed successfully',
        success: true,
      });
    }
  ),
];
