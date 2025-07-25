import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LayoutWrapper } from '../LayoutWrapper';

// Mock the GlobalLayout to isolate LayoutWrapper testing
jest.mock('../GlobalLayout', () => ({
  GlobalLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mocked-global-layout">{children}</div>
  ),
}));

describe('LayoutWrapper', () => {
  it('should render children through GlobalLayout', () => {
    render(
      <LayoutWrapper>
        <div data-testid="test-content">Test Content</div>
      </LayoutWrapper>
    );

    expect(screen.getByTestId('mocked-global-layout')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should pass children to GlobalLayout correctly', () => {
    render(
      <LayoutWrapper>
        <header>Header Content</header>
        <main>Main Content</main>
        <footer>Footer Content</footer>
      </LayoutWrapper>
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();

    // All should be wrapped by the mocked GlobalLayout
    const globalLayout = screen.getByTestId('mocked-global-layout');
    expect(globalLayout).toContainElement(screen.getByText('Header Content'));
    expect(globalLayout).toContainElement(screen.getByText('Main Content'));
    expect(globalLayout).toContainElement(screen.getByText('Footer Content'));
  });

  it('should handle null children', () => {
    render(
      <LayoutWrapper>
        {null}
      </LayoutWrapper>
    );

    const globalLayout = screen.getByTestId('mocked-global-layout');
    expect(globalLayout).toBeInTheDocument();
    expect(globalLayout).toBeEmptyDOMElement();
  });

  it('should handle undefined children', () => {
    render(
      <LayoutWrapper>
        {undefined}
      </LayoutWrapper>
    );

    const globalLayout = screen.getByTestId('mocked-global-layout');
    expect(globalLayout).toBeInTheDocument();
    expect(globalLayout).toBeEmptyDOMElement();
  });

  it('should handle complex nested children', () => {
    render(
      <LayoutWrapper>
        <div className="app">
          <nav className="navigation">
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
          <main className="content">
            <h1>Page Title</h1>
            <p>Page content goes here</p>
          </main>
        </div>
      </LayoutWrapper>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Page Title')).toBeInTheDocument();
    expect(screen.getByText('Page content goes here')).toBeInTheDocument();

    // Verify all content is within the GlobalLayout
    const globalLayout = screen.getByTestId('mocked-global-layout');
    expect(globalLayout).toContainElement(screen.getByText('Page Title'));
  });

  it('should act as a simple wrapper around GlobalLayout', () => {
    const { container } = render(
      <LayoutWrapper>
        <div data-testid="wrapped-content">Wrapped Content</div>
      </LayoutWrapper>
    );

    // LayoutWrapper should not add any additional DOM structure
    // beyond what GlobalLayout provides (which is mocked as a div)
    expect(container.children).toHaveLength(1);
    expect(container.firstChild).toHaveAttribute('data-testid', 'mocked-global-layout');
  });

  it('should maintain the component hierarchy', () => {
    render(
      <LayoutWrapper>
        <div data-testid="child-component">
          <span>Nested content</span>
        </div>
      </LayoutWrapper>
    );

    const childComponent = screen.getByTestId('child-component');
    const nestedContent = screen.getByText('Nested content');
    
    // Verify proper nesting
    expect(childComponent).toContainElement(nestedContent);
    expect(screen.getByTestId('mocked-global-layout')).toContainElement(childComponent);
  });

  it('should handle functional components as children', () => {
    const TestComponent = () => <div data-testid="functional-component">Functional Component</div>;
    
    render(
      <LayoutWrapper>
        <TestComponent />
      </LayoutWrapper>
    );

    expect(screen.getByTestId('functional-component')).toBeInTheDocument();
    expect(screen.getByText('Functional Component')).toBeInTheDocument();
  });

  it('should support fragments as children', () => {
    render(
      <LayoutWrapper>
        <>
          <h1>Fragment Title</h1>
          <p>Fragment paragraph</p>
        </>
      </LayoutWrapper>
    );

    expect(screen.getByText('Fragment Title')).toBeInTheDocument();
    expect(screen.getByText('Fragment paragraph')).toBeInTheDocument();
  });
});
