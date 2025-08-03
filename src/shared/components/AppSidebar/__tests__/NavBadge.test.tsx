import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NavBadge } from '../NavBadge';

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: (string | undefined)[]) => args.filter(Boolean).join(' '),
}));

describe('NavBadge', () => {
  it('should render badge with children', () => {
    render(<NavBadge>5</NavBadge>);

    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
    expect(badge).toBeInstanceOf(HTMLSpanElement);
  });

  it('should render badge with text content', () => {
    render(<NavBadge>New</NavBadge>);

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should render badge with number content', () => {
    render(<NavBadge>{42}</NavBadge>);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(<NavBadge>Test</NavBadge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('ml-auto');
    expect(badge).toHaveClass('flex');
    expect(badge).toHaveClass('h-5');
    expect(badge).toHaveClass('min-w-5');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('justify-center');
    expect(badge).toHaveClass('rounded-md');
    expect(badge).toHaveClass('bg-sidebar-accent');
    expect(badge).toHaveClass('px-1');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('font-medium');
    expect(badge).toHaveClass('text-sidebar-accent-foreground');
  });

  it('should apply custom className when provided', () => {
    render(<NavBadge className="custom-class">Test</NavBadge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('custom-class');
    // Should also include default classes
    expect(badge).toHaveClass('ml-auto');
    expect(badge).toHaveClass('flex');
    expect(badge).toHaveClass('h-5');
  });

  it('should merge custom className with default classes', () => {
    render(<NavBadge className="bg-red-500 text-white">Alert</NavBadge>);

    const badge = screen.getByText('Alert');
    expect(badge).toHaveClass('bg-red-500');
    expect(badge).toHaveClass('text-white');
    expect(badge).toHaveClass('ml-auto');
    expect(badge).toHaveClass('flex');
    expect(badge).toHaveClass('h-5');
  });

  it('should handle empty children', () => {
    const { container } = render(<NavBadge>{''}</NavBadge>);

    // Should render an empty span
    const badge = container.firstChild;
    expect(badge).toBeInTheDocument();
    expect(badge).toBeEmptyDOMElement();
  });

  it('should handle React node children', () => {
    render(
      <NavBadge>
        <span data-testid="inner-content">Icon + Text</span>
      </NavBadge>
    );

    expect(screen.getByTestId('inner-content')).toBeInTheDocument();
    expect(screen.getByText('Icon + Text')).toBeInTheDocument();
  });

  it('should handle zero as children', () => {
    render(<NavBadge>{0}</NavBadge>);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should handle boolean false as children', () => {
    const { container } = render(<NavBadge>{false}</NavBadge>);

    // false should not render anything
    const badge = container.firstChild;
    expect(badge).toBeEmptyDOMElement();
  });

  it('should handle null as children', () => {
    const { container } = render(<NavBadge>{null}</NavBadge>);

    const badge = container.firstChild;
    expect(badge).toBeEmptyDOMElement();
  });

  it('should handle undefined as children', () => {
    const { container } = render(<NavBadge>{undefined}</NavBadge>);

    const badge = container.firstChild;
    expect(badge).toBeEmptyDOMElement();
  });

  it('should work without className prop', () => {
    render(<NavBadge>Default</NavBadge>);

    const badge = screen.getByText('Default');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ml-auto');
  });
});
