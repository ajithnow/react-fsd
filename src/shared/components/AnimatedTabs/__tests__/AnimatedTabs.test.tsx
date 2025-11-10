import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../AnimatedTabs';
import { useState } from 'react';

describe('AnimatedTabs', () => {
  it('renders nothing if no value matches', () => {
    render(
      <Tabs value="tab3" onValueChange={() => {}}>
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('renders disabled tab and does not switch on click', async () => {
    const user = userEvent.setup();
    function TestTabs() {
      const [value, setValue] = useState('tab1');
      return (
        <Tabs value={value} onValueChange={val => setValue(val)}>
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
    }
    render(<TestTabs />);
    await act(async () => {
      await user.click(screen.getByText('Tab 2'));
    });
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation between tabs', async () => {
    const user = userEvent.setup();
    function TestTabs() {
      const [value, setValue] = useState('tab1');
      return (
        <Tabs value={value} onValueChange={val => setValue(val)}>
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
    }
    render(<TestTabs />);
    const tab1 = screen.getByText('Tab 1');
    await act(async () => {
      tab1.focus();
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{Enter}');
    });
    await act(async () => {
      const content = await screen.findByText('Content 2');
      expect(content).toBeVisible();
    });
  });

  it('applies custom className and style to TabsList', () => {
    render(
      <Tabs value="tab1" onValueChange={() => {}}>
        <TabsList
          data-testid="tabs-list"
          className="custom-class"
          style={{ background: 'red' }}
        >
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    const tabsList = screen.getByTestId('tabs-list');
    expect(tabsList).toHaveClass('custom-class');
    expect(tabsList).toHaveStyle('background: red');
  });
  it('renders tabs and triggers', () => {
    render(
      <Tabs value="tab1" onValueChange={() => {}}>
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('shows correct content for selected tab', () => {
    render(
      <Tabs value="tab2" onValueChange={() => {}}>
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeVisible();
  });

  it('calls onValueChange when tab is clicked', async () => {
    const user = userEvent.setup();
    function TestTabs() {
      const [value, setValue] = useState('tab1');
      return (
        <Tabs value={value} onValueChange={val => setValue(val)}>
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
    }
    render(<TestTabs />);
    await act(async () => {
      await user.click(screen.getByText('Tab 2'));
    });
    await act(async () => {
      const content = await screen.findByText('Content 2');
      expect(content).toBeVisible();
    });
  });

  it('renders indicator for active tab', () => {
    render(
      <Tabs value="tab1" onValueChange={() => {}}>
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    // The indicator is a div with absolute positioning
    const indicator = screen
      .getByTestId('tabs-list')
      .parentElement?.querySelector('div.absolute');
    expect(indicator).toBeInTheDocument();
  });
});
