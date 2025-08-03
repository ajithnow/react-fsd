import { render, screen } from '@testing-library/react';
import { AppLayoutWrapper } from '../AppLayoutWrapper';

// Mock the router outlet
jest.mock('@tanstack/react-router', () => ({
  Outlet: () => <div data-testid="router-outlet">Router Outlet</div>,
}));

// Mock the AppLayout component
jest.mock('..', () => ({
  AppLayout: ({
    children,
    sidebarData,
  }: {
    children: React.ReactNode;
    sidebarData: unknown;
  }) => (
    <div data-testid="app-layout" data-sidebar={JSON.stringify(sidebarData)}>
      {children}
    </div>
  ),
}));

// Mock the useSidebarData hook
const mockSidebarData = {
  items: [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { id: 'users', label: 'Users', href: '/users' },
  ],
  loading: false,
};

jest.mock('../../../hooks/useSidebar', () => ({
  useSidebarData: jest.fn(() => mockSidebarData),
}));

describe('AppLayoutWrapper', () => {
  it('renders AppLayout with sidebar data', () => {
    render(<AppLayoutWrapper />);

    const appLayout = screen.getByTestId('app-layout');
    expect(appLayout).toBeInTheDocument();
    expect(appLayout).toHaveAttribute(
      'data-sidebar',
      JSON.stringify(mockSidebarData)
    );
  });

  it('renders router outlet inside AppLayout', () => {
    render(<AppLayoutWrapper />);

    expect(screen.getByTestId('router-outlet')).toBeInTheDocument();
    expect(screen.getByText('Router Outlet')).toBeInTheDocument();
  });

  it('passes sidebar data from hook to AppLayout', () => {
    const customSidebarData = {
      items: [{ id: 'custom', label: 'Custom', href: '/custom' }],
      loading: true,
    };

    const { useSidebarData } = jest.requireMock('../../../hooks/useSidebar');
    useSidebarData.mockReturnValue(customSidebarData);

    render(<AppLayoutWrapper />);

    const appLayout = screen.getByTestId('app-layout');
    expect(appLayout).toHaveAttribute(
      'data-sidebar',
      JSON.stringify(customSidebarData)
    );
  });

  it('handles loading state from sidebar hook', () => {
    const loadingSidebarData = {
      items: [],
      loading: true,
    };

    const { useSidebarData } = jest.requireMock('../../../hooks/useSidebar');
    useSidebarData.mockReturnValue(loadingSidebarData);

    render(<AppLayoutWrapper />);

    const appLayout = screen.getByTestId('app-layout');
    expect(appLayout).toHaveAttribute(
      'data-sidebar',
      JSON.stringify(loadingSidebarData)
    );
  });
});
