import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { ActionsDropdown } from '..';
import { ActionItem } from '../actionDropdown.model';


describe('ActionsDropdown', () => {
  const mockActions: ActionItem[] = [
    {
      id: 'view',
      label: 'View',
      icon: <IconEye size={16} data-testid="view-icon" />,
      onClick: jest.fn(),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <IconEdit size={16} data-testid="edit-icon" />,
      onClick: jest.fn(),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <IconTrash size={16} data-testid="delete-icon" />,
      variant: 'destructive',
      separator: true,
      onClick: jest.fn(),
    },
  ];

  it('renders the trigger button', () => {
    render(<ActionsDropdown actions={mockActions} />);
    
    const triggerButton = screen.getByRole('button', { name: /open actions menu/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<ActionsDropdown actions={mockActions} />);
    
    const triggerButton = screen.getByRole('button', { name: /open actions menu/i });
    await user.click(triggerButton);
    
    // Wait for dropdown items to be visible
    await waitFor(() => {
      expect(screen.getByText('View')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onClick handler when action is clicked', async () => {
    const user = userEvent.setup();
    const mockAction = jest.fn();
    const actions: ActionItem[] = [
      {
        id: 'test',
        label: 'Test Action',
        onClick: mockAction,
      },
    ];

    render(<ActionsDropdown actions={actions} />);
    
    const triggerButton = screen.getByRole('button', { name: /open actions menu/i });
    await user.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Action')).toBeInTheDocument();
    });
    
    const actionItem = screen.getByText('Test Action');
    await user.click(actionItem);
    
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('renders icons when provided', async () => {
    const user = userEvent.setup();
    render(<ActionsDropdown actions={mockActions} />);
    
    const triggerButton = screen.getByRole('button', { name: /open actions menu/i });
    await user.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('view-icon')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  it('applies destructive styling to destructive actions', async () => {
    const user = userEvent.setup();
    // Create a test action that won't be filtered by permissions
    const destructiveActions: ActionItem[] = [
      {
        id: 'destructive-test',
        label: 'Destructive Action',
        variant: 'destructive',
        onClick: jest.fn(),
      },
    ];
    
    render(<ActionsDropdown actions={destructiveActions} />);
    
    const triggerButton = screen.getByRole('button', { name: /open actions menu/i });
    await user.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Destructive Action')).toBeInTheDocument();
    });
    
    const destructiveItem = screen.getByText('Destructive Action').closest('[role="menuitem"]');
    expect(destructiveItem).toHaveClass('text-red-600');
  });

  it('renders with custom trigger icon', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>;
    render(<ActionsDropdown actions={mockActions} triggerIcon={customIcon} />);
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<ActionsDropdown actions={mockActions} disabled />);
    
    const triggerButton = screen.getByRole('button', { name: /open actions menu/i });
    expect(triggerButton).toBeDisabled();
  });

  it('renders with custom aria-label', () => {
    render(<ActionsDropdown actions={mockActions} aria-label="Custom menu" />);
    
    const triggerButton = screen.getByRole('button', { name: /custom menu/i });
    expect(triggerButton).toBeInTheDocument();
  });





  it('renders separators when specified', async () => {
    const user = userEvent.setup();
    const actionsWithSeparator: ActionItem[] = [
      {
        id: 'first',
        label: 'First Action',
        onClick: jest.fn(),
      },
      {
        id: 'second',
        label: 'Second Action',
        separator: true,
        onClick: jest.fn(),
      },
    ];
    
    render(<ActionsDropdown actions={actionsWithSeparator} />);
    
    const triggerButton = screen.getByRole('button', { name: /open actions menu/i });
    await user.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('First Action')).toBeInTheDocument();
    });
    
    // Check that a separator is rendered
    const separators = document.querySelectorAll('[role="separator"]');
    expect(separators.length).toBeGreaterThan(0);
  });
});
