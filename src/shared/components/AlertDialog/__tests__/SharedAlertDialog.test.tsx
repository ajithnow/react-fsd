import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SharedAlertDialog } from '../SharedAlertDialog';
import type { SharedAlertDialogProps } from '../SharedAlertDialog';

// Mock the shadcn components to avoid setup complexity
jest.mock('../../../../lib/shadcn/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => 
    open ? <div data-testid="alert-dialog">{children}</div> : null,
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="alert-dialog-content">{children}</div>,
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="alert-dialog-header">{children}</div>,
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => 
    <h2 data-testid="alert-dialog-title">{children}</h2>,
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => 
    <p data-testid="alert-dialog-description">{children}</p>,
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="alert-dialog-footer">{children}</div>,
  AlertDialogAction: ({ children, onClick, className }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    className?: string 
  }) => (
    <button 
      data-testid="alert-dialog-action" 
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
  AlertDialogCancel: ({ children, onClick }: { 
    children: React.ReactNode; 
    onClick?: () => void 
  }) => (
    <button data-testid="alert-dialog-cancel" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('SharedAlertDialog', () => {
  const defaultProps: SharedAlertDialogProps = {
    open: true,
    onOpenChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders when open is true', () => {
      render(<SharedAlertDialog {...defaultProps} />);
      
      expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('alert-dialog-content')).toBeInTheDocument();
    });

    it('does not render when open is false', () => {
      render(<SharedAlertDialog {...defaultProps} open={false} />);
      
      expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
    });

    it('renders with default title when no title provided', () => {
      render(<SharedAlertDialog {...defaultProps} />);
      
      expect(screen.getByTestId('alert-dialog-title')).toHaveTextContent('Are you sure?');
    });

    it('renders with custom title when provided', () => {
      render(<SharedAlertDialog {...defaultProps} title="Custom Title" />);
      
      expect(screen.getByTestId('alert-dialog-title')).toHaveTextContent('Custom Title');
    });

    it('renders description when provided', () => {
      const description = 'This is a test description';
      render(<SharedAlertDialog {...defaultProps} description={description} />);
      
      expect(screen.getByTestId('alert-dialog-description')).toHaveTextContent(description);
    });

    it('does not render description when not provided', () => {
      render(<SharedAlertDialog {...defaultProps} />);
      
      expect(screen.queryByTestId('alert-dialog-description')).not.toBeInTheDocument();
    });

    it('renders default button texts when not provided', () => {
      render(<SharedAlertDialog {...defaultProps} />);
      
      expect(screen.getByTestId('alert-dialog-cancel')).toHaveTextContent('Cancel');
      expect(screen.getByTestId('alert-dialog-action')).toHaveTextContent('Continue');
    });

    it('renders custom button texts when provided', () => {
      render(
        <SharedAlertDialog 
          {...defaultProps} 
          confirmText="Confirm Action"
          cancelText="Go Back"
        />
      );
      
      expect(screen.getByTestId('alert-dialog-cancel')).toHaveTextContent('Go Back');
      expect(screen.getByTestId('alert-dialog-action')).toHaveTextContent('Confirm Action');
    });

    it('renders children content when provided', () => {
      const childContent = <div data-testid="custom-content">Custom content</div>;
      render(<SharedAlertDialog {...defaultProps}>{childContent}</SharedAlertDialog>);
      
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByTestId('custom-content')).toHaveTextContent('Custom content');
    });

    it('does not render children wrapper when no children provided', () => {
      render(<SharedAlertDialog {...defaultProps} />);
      
      // The children wrapper has py-4 class, so we check it's not there
      const content = screen.getByTestId('alert-dialog-content');
      expect(content.querySelector('.py-4')).not.toBeInTheDocument();
    });
  });

  describe('Variant Styling', () => {
    it('applies default styling when variant is default', () => {
      render(<SharedAlertDialog {...defaultProps} variant="default" />);
      
      const actionButton = screen.getByTestId('alert-dialog-action');
      expect(actionButton).not.toHaveClass('bg-destructive');
    });

    it('applies destructive styling when variant is destructive', () => {
      render(<SharedAlertDialog {...defaultProps} variant="destructive" />);
      
      const actionButton = screen.getByTestId('alert-dialog-action');
      expect(actionButton).toHaveClass('bg-destructive');
      expect(actionButton).toHaveClass('text-destructive-foreground');
      expect(actionButton).toHaveClass('hover:bg-destructive/90');
    });

    it('uses default variant when no variant provided', () => {
      render(<SharedAlertDialog {...defaultProps} />);
      
      const actionButton = screen.getByTestId('alert-dialog-action');
      expect(actionButton).not.toHaveClass('bg-destructive');
    });
  });

  describe('Event Handling', () => {
    it('calls onConfirm and onOpenChange when confirm button is clicked', async () => {
      const onConfirm = jest.fn();
      const onOpenChange = jest.fn();
      
      render(
        <SharedAlertDialog 
          {...defaultProps} 
          onConfirm={onConfirm}
          onOpenChange={onOpenChange}
        />
      );
      
      fireEvent.click(screen.getByTestId('alert-dialog-action'));
      
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onCancel and onOpenChange when cancel button is clicked', async () => {
      const onCancel = jest.fn();
      const onOpenChange = jest.fn();
      
      render(
        <SharedAlertDialog 
          {...defaultProps} 
          onCancel={onCancel}
          onOpenChange={onOpenChange}
        />
      );
      
      fireEvent.click(screen.getByTestId('alert-dialog-cancel'));
      
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('only calls onOpenChange when onConfirm is not provided', () => {
      const onOpenChange = jest.fn();
      
      render(
        <SharedAlertDialog 
          {...defaultProps} 
          onOpenChange={onOpenChange}
        />
      );
      
      fireEvent.click(screen.getByTestId('alert-dialog-action'));
      
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('only calls onOpenChange when onCancel is not provided', () => {
      const onOpenChange = jest.fn();
      
      render(
        <SharedAlertDialog 
          {...defaultProps} 
          onOpenChange={onOpenChange}
        />
      );
      
      fireEvent.click(screen.getByTestId('alert-dialog-cancel'));
      
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Integration Scenarios', () => {
    it('renders complete dialog with all props', () => {
      const onConfirm = jest.fn();
      const onCancel = jest.fn();
      const onOpenChange = jest.fn();
      
      render(
        <SharedAlertDialog
          open={true}
          onOpenChange={onOpenChange}
          title="Delete Item"
          description="This action cannot be undone. Are you sure you want to delete this item?"
          confirmText="Delete"
          cancelText="Keep"
          onConfirm={onConfirm}
          onCancel={onCancel}
          variant="destructive"
        >
          <div data-testid="warning-message">
            Warning: This will permanently delete the item.
          </div>
        </SharedAlertDialog>
      );
      
      // Check all elements are rendered
      expect(screen.getByTestId('alert-dialog-title')).toHaveTextContent('Delete Item');
      expect(screen.getByTestId('alert-dialog-description')).toHaveTextContent(
        'This action cannot be undone. Are you sure you want to delete this item?'
      );
      expect(screen.getByTestId('alert-dialog-cancel')).toHaveTextContent('Keep');
      expect(screen.getByTestId('alert-dialog-action')).toHaveTextContent('Delete');
      expect(screen.getByTestId('warning-message')).toHaveTextContent(
        'Warning: This will permanently delete the item.'
      );
      
      // Check destructive styling
      expect(screen.getByTestId('alert-dialog-action')).toHaveClass('bg-destructive');
    });

    it('handles multiple button clicks correctly', () => {
      const onConfirm = jest.fn();
      const onCancel = jest.fn();
      const onOpenChange = jest.fn();
      
      render(
        <SharedAlertDialog
          {...defaultProps}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onOpenChange={onOpenChange}
        />
      );
      
      // Click cancel first
      fireEvent.click(screen.getByTestId('alert-dialog-cancel'));
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      
      // Click confirm
      fireEvent.click(screen.getByTestId('alert-dialog-action'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('renders title with proper heading structure', () => {
      render(<SharedAlertDialog {...defaultProps} title="Accessible Title" />);
      
      const title = screen.getByTestId('alert-dialog-title');
      expect(title.tagName).toBe('H2');
      expect(title).toHaveTextContent('Accessible Title');
    });

    it('renders description with proper paragraph structure', () => {
      render(<SharedAlertDialog {...defaultProps} description="Accessible description" />);
      
      const description = screen.getByTestId('alert-dialog-description');
      expect(description.tagName).toBe('P');
      expect(description).toHaveTextContent('Accessible description');
    });

    it('renders buttons with proper button elements', () => {
      render(<SharedAlertDialog {...defaultProps} />);
      
      const cancelButton = screen.getByTestId('alert-dialog-cancel');
      const actionButton = screen.getByTestId('alert-dialog-action');
      
      expect(cancelButton.tagName).toBe('BUTTON');
      expect(actionButton.tagName).toBe('BUTTON');
    });
  });
});
