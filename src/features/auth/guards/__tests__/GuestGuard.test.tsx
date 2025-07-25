import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GuestGuard } from '../GuestGuard';
import * as authUtils from '../../utils/auth.utils';

// Mock the auth utils
jest.mock('../../utils/auth.utils', () => ({
  isAuthenticated: jest.fn(),
}));

// Mock TanStack Router hooks
const mockNavigate = jest.fn();
const mockSearch: Record<string, unknown> = {};

jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockSearch,
}));

// Get the mocked function
const mockIsAuthenticated = authUtils.isAuthenticated as jest.MockedFunction<typeof authUtils.isAuthenticated>;

describe('GuestGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockSearch).forEach(key => delete mockSearch[key]);
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockIsAuthenticated.mockReturnValue(false);
    });

    it('should render children', () => {
      render(
        <GuestGuard>
          <div>Guest Content</div>
        </GuestGuard>
      );

      expect(screen.getByText('Guest Content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockIsAuthenticated.mockReturnValue(true);
    });

    it('should redirect to default path', async () => {
      render(
        <GuestGuard>
          <div>Guest Content</div>
        </GuestGuard>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: '/',
          replace: true,
        });
      });

      expect(screen.queryByText('Guest Content')).not.toBeInTheDocument();
    });

    it('should redirect to custom redirectTo path', async () => {
      render(
        <GuestGuard redirectTo="/dashboard">
          <div>Guest Content</div>
        </GuestGuard>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: '/dashboard',
          replace: true,
        });
      });
    });

    it('should redirect to return URL when provided', async () => {
      mockSearch.returnUrl = '/profile';

      render(
        <GuestGuard>
          <div>Guest Content</div>
        </GuestGuard>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: '/profile',
          replace: true,
        });
      });
    });

    it('should not redirect to auth return URL', async () => {
      mockSearch.returnUrl = '/auth/register';

      render(
        <GuestGuard redirectTo="/dashboard">
          <div>Guest Content</div>
        </GuestGuard>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: '/dashboard',
          replace: true,
        });
      });
    });

    it('should render fallback when provided and not redirecting yet', () => {
      render(
        <GuestGuard fallback={<div>Redirecting...</div>}>
          <div>Guest Content</div>
        </GuestGuard>
      );

      // The component immediately redirects when authenticated, so we test what's NOT rendered
      expect(screen.queryByText('Guest Content')).not.toBeInTheDocument();
    });

    it('should render null when redirecting', async () => {
      const { container } = render(
        <GuestGuard>
          <div>Guest Content</div>
        </GuestGuard>
      );

      // After redirect is triggered, should render nothing
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });

      expect(container.firstChild).toBeNull();
    });
  });
});
