import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserActionDialog } from '../UserActionDialogs';
// Mock translations used by the dialog so tests assert friendly text
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key.includes('deleteConfirm')) return 'Delete';
      if (key.includes('deleteTitle')) return 'Delete user';
      if (key.includes('resetConfirm')) return 'Reset';
      if (key.includes('resetTitle')) return 'Reset password';
      if (key.includes('suspendConfirm')) return 'Suspend';
      if (key.includes('suspendTitle')) return 'Suspend user';
      if (key.includes('unsuspendTitle')) return 'Unsuspend user';
      if (key === 'users.cancel') return 'Cancel';
      return key;
    },
  }),
}));

// Mock the underlying shadcn alert dialog components used by SharedAlertDialog
jest.mock('../../../../../lib/shadcn/components/ui/alert-dialog', () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-dialog-content">{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-dialog-header">{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="alert-dialog-title">{children}</h2>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="alert-dialog-description">{children}</p>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-dialog-footer">{children}</div>
  ),
  AlertDialogAction: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button
      data-testid="alert-dialog-action"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
  AlertDialogCancel: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button data-testid="alert-dialog-cancel" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('UserActionDialog', () => {
  const user = {
    UserId: '1',
    FirstName: 'John',
    LastName: 'Doe',
    Email: 'john@example.com',
    Role: 'NORMAL_USER' as const,
    Status: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders delete variant and handles confirm/cancel', () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <UserActionDialog
        type="delete"
        open={true}
        onOpenChange={onOpenChange}
        user={user}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByTestId('alert-dialog-title')).toBeInTheDocument();
    expect(screen.getByTestId('alert-dialog-action')).toHaveTextContent(
      'Delete'
    );

    fireEvent.click(screen.getByTestId('alert-dialog-action'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    fireEvent.click(screen.getByTestId('alert-dialog-cancel'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not render when open is false', () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <UserActionDialog
        type="delete"
        open={false}
        onOpenChange={onOpenChange}
        user={user}
        onConfirm={onConfirm}
      />
    );

    expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
  });

  it('renders user name and email inside dialog', () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <UserActionDialog
        type="delete"
        open={true}
        onOpenChange={onOpenChange}
        user={user}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders reset variant and calls confirm', () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <UserActionDialog
        type="reset"
        open={true}
        onOpenChange={onOpenChange}
        user={user}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByTestId('alert-dialog-title')).toBeInTheDocument();
    expect(screen.getByTestId('alert-dialog-action')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('alert-dialog-action'));
  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders suspend variant with unsuspend title when status is false', () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();
    const suspendedUser = { ...user, status: false };

    render(
      <UserActionDialog
        type="suspend"
        open={true}
        onOpenChange={onOpenChange}
        user={suspendedUser}
        onConfirm={onConfirm}
      />
    );

    // confirm button should exist and call handlers
    fireEvent.click(screen.getByTestId('alert-dialog-action'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('suspend variant for active user triggers confirm and close', () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <UserActionDialog
        type="suspend"
        open={true}
        onOpenChange={onOpenChange}
        user={user}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByTestId('alert-dialog-action'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
