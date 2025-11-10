import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopBar } from '../TopBar';

// Mock image imports
jest.mock('@/assets/images/logo.png', () => 'test-logo.png');

jest.mock('../../LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>
}));

jest.mock('../NotificationSheet.tsx', () => ({
  NotificationSheet: () => <div data-testid="notification-sheet">Notifications</div>
}));

jest.mock('@/lib/shadcn/components/ui/sidebar', () => ({
  SidebarTrigger: () => <button data-testid="sidebar-trigger">Toggle Sidebar</button>
}));

describe('TopBar', () => {
  it('should render all main elements', () => {
    render(<TopBar />);

    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('notification-sheet')).toBeInTheDocument();

    // Find settings button by its SVG icon
    const buttons = screen.getAllByRole('button');
    const settingsButton = buttons.find(button =>
      button.querySelector('svg.lucide-settings')
    );
    expect(settingsButton).toBeInTheDocument();
  });

  it('should render sidebar trigger', () => {
    render(<TopBar />);
    
    const sidebarTrigger = screen.getByTestId('sidebar-trigger');
    expect(sidebarTrigger).toBeInTheDocument();
  });

  it('should render user dropdown menu items when clicked', async () => {
    const user = userEvent.setup();
    render(<TopBar />);
    
    // Find user button by its SVG icon
    const buttons = screen.getAllByRole('button');
    const userButton = buttons.find(button => 
      button.querySelector('svg.lucide-user')
    );
    expect(userButton).toBeDefined();
    await user.click(userButton!);
    
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('should render settings button', () => {
    render(<TopBar />);
    
    // Find settings button by its SVG icon
    const buttons = screen.getAllByRole('button');
    const settingsButton = buttons.find(button => 
      button.querySelector('svg.lucide-settings')
    );
    expect(settingsButton).toBeInTheDocument();
  });
});