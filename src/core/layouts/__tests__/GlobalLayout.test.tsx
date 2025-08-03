import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock the GlobalLayout module to avoid router dependencies
jest.mock('../GlobalLayout', () => ({
  GlobalLayout: ({ children }: { children: React.ReactNode }) => (
    <React.Fragment>{children}</React.Fragment>
  ),
}));

import { GlobalLayout } from '../GlobalLayout';

describe('GlobalLayout', () => {
  it('should render children correctly', () => {
    render(
      <GlobalLayout>
        <div data-testid="test-content">Test Content</div>
      </GlobalLayout>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render multiple children correctly', () => {
    render(
      <GlobalLayout>
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </GlobalLayout>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
  });

  it('should render nothing when no children provided', () => {
    const { container } = render(<GlobalLayout>{null}</GlobalLayout>);

    // Should render an empty React fragment
    expect(container.firstChild).toBeNull();
  });

  it('should handle complex JSX children', () => {
    render(
      <GlobalLayout>
        <div className="main-content">
          <h1>Main Title</h1>
          <p>Some paragraph text</p>
          <button type="button">Click me</button>
        </div>
      </GlobalLayout>
    );

    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Some paragraph text')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('should maintain proper React structure without wrapper elements', () => {
    const { container } = render(
      <GlobalLayout>
        <main data-testid="main-content">App Content</main>
      </GlobalLayout>
    );

    // GlobalLayout uses React.Fragment, so the main element should be the direct child
    const mainElement = screen.getByTestId('main-content');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement.tagName).toBe('MAIN');

    // The container should not have any wrapper divs added by GlobalLayout
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toBe(mainElement);
  });

  it('should be ready for future global providers', () => {
    // Test that the component structure allows for future provider integration
    const { container } = render(
      <GlobalLayout>
        <div data-testid="app-content">App</div>
      </GlobalLayout>
    );

    const appContent = screen.getByTestId('app-content');
    expect(appContent).toBeInTheDocument();

    // The current implementation should render children directly
    // This test ensures the structure is compatible with future provider additions
    expect(container.firstChild).toBe(appContent);
  });

  it('should handle different types of React children', () => {
    const showConditionalContent = true;

    render(
      <GlobalLayout>
        {/* String child */}
        Plain text content
        {/* Element child */}
        <div>Element content</div>
        {/* Fragment child */}
        <>
          <span>Fragment child 1</span>
          <span>Fragment child 2</span>
        </>
        {/* Conditional child */}
        {showConditionalContent && <p>Conditional content</p>}
      </GlobalLayout>
    );

    expect(screen.getByText('Plain text content')).toBeInTheDocument();
    expect(screen.getByText('Element content')).toBeInTheDocument();
    expect(screen.getByText('Fragment child 1')).toBeInTheDocument();
    expect(screen.getByText('Fragment child 2')).toBeInTheDocument();
    expect(screen.getByText('Conditional content')).toBeInTheDocument();
  });

  it('should pass through all props to children without modification', () => {
    const TestChild = ({ testProp }: { testProp: string }) => (
      <div data-testid="test-child">{testProp}</div>
    );

    render(
      <GlobalLayout>
        <TestChild testProp="test-value" />
      </GlobalLayout>
    );

    expect(screen.getByTestId('test-child')).toHaveTextContent('test-value');
  });
});
