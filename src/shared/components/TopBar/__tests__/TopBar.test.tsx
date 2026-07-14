import { render, screen } from '@testing-library/react';
import { TopBar } from '../TopBar';

// Mock child components
vi.mock('@/lib/shadcn/components/ui/sidebar', () => ({
  SidebarTrigger: () => <button data-testid="sidebar-trigger">Toggle Sidebar</button>,
}));

vi.mock('../../LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

describe('TopBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all main elements', () => {
    render(<TopBar />);

    expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });
});