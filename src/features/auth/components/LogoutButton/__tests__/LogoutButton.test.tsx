import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LogoutButton } from '../LogoutButton';

// Mock LogOut icon from lucide-react
jest.mock('lucide-react', () => ({
  LogOut: () => <svg data-testid="logout-icon" />,
}));

// Mock Button component
jest.mock('../../../../../shared/components/Button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="logout-button"
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock logout manager
const mockLogoutUser = jest.fn();

jest.mock('../../../managers/logout.manager', () => ({
  useLogoutManager: jest.fn(() => ({
    logoutUser: mockLogoutUser,
    isPending: false,
    canLogout: true,
    quickLogout: jest.fn(),
    error: null,
  })),
}));

// Import the mocked function
import { useLogoutManager } from '../../../managers/logout.manager';
const mockUseLogoutManager = useLogoutManager as jest.MockedFunction<
  typeof useLogoutManager
>;

describe('LogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to default mock state
    mockUseLogoutManager.mockReturnValue({
      logoutUser: mockLogoutUser,
      isPending: false,
      canLogout: true,
      quickLogout: jest.fn(),
      error: null,
    });
  });

  it('should render with default props', () => {
    render(<LogoutButton />);

    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should render with custom props', () => {
    render(
      <LogoutButton
        variant="destructive"
        size="lg"
        showIcon={false}
        showText={false}
      />
    );

    const button = screen.getByTestId('logout-button');
    expect(button).toBeInTheDocument();
    expect(screen.queryByTestId('logout-icon')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('should call logout function when clicked', async () => {
    render(<LogoutButton />);

    const button = screen.getByTestId('logout-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLogoutUser).toHaveBeenCalled();
    });
  });

  it('should show loading state', () => {
    // Mock pending state
    mockUseLogoutManager.mockReturnValue({
      logoutUser: mockLogoutUser,
      isPending: true,
      canLogout: true,
      quickLogout: jest.fn(),
      error: null,
    });

    render(<LogoutButton />);

    expect(screen.getByText('Logging out...')).toBeInTheDocument();
  });

  it('should not render when user cannot logout', () => {
    mockUseLogoutManager.mockReturnValue({
      logoutUser: mockLogoutUser,
      isPending: false,
      canLogout: false,
      quickLogout: jest.fn(),
      error: null,
    });

    const { container } = render(<LogoutButton />);
    expect(container.firstChild).toBeNull();
  });

  it('should prevent logout when pending', async () => {
    mockUseLogoutManager.mockReturnValue({
      logoutUser: mockLogoutUser,
      isPending: true,
      canLogout: true,
      quickLogout: jest.fn(),
      error: null,
    });

    render(<LogoutButton />);

    const button = screen.getByTestId('logout-button');
    fireEvent.click(button);

    // Should not call logout when pending
    expect(mockLogoutUser).not.toHaveBeenCalled();
  });

  it('should handle logout error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockLogoutUser.mockRejectedValue(new Error('Logout failed'));

    render(<LogoutButton />);

    const button = screen.getByTestId('logout-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLogoutUser).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Logout failed:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
