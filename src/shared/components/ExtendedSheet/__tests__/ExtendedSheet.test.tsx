import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExtendedSheet } from '../ExtendedSheet';
import { Button } from '@/lib/shadcn/components/ui/button';

describe('ExtendedSheet', () => {
  it('should render trigger and open sheet on click', async () => {
    const user = userEvent.setup();
    
    render(
      <ExtendedSheet
        trigger={<Button>Open Sheet</Button>}
        title="Test Sheet"
      >
        <div>Sheet Content</div>
      </ExtendedSheet>
    );

    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);
    
    expect(screen.getByText('Test Sheet')).toBeInTheDocument();
    expect(screen.getByText('Sheet Content')).toBeInTheDocument();
  });
});