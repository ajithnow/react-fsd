import { render, screen } from '@testing-library/react';
import { useRoleLabels } from '../useRoleLabels';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => `i18n:${k}` }),
}));

function TestComponent() {
  const { typeData, statusData } = useRoleLabels();
  return (
    <div>
      <div data-testid="type-count">{Object.keys(typeData).length}</div>
      <div data-testid="status-count">{Object.keys(statusData).length}</div>
      <div data-testid="sample-label">{Object.values(typeData)[0].label}</div>
    </div>
  );
}

describe('useRoleLabels', () => {
  it('provides translated type and status data', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('type-count').textContent).toBeTruthy();
    expect(screen.getByTestId('status-count').textContent).toBeTruthy();
    expect(screen.getByTestId('sample-label').textContent?.startsWith('i18n:users.')).toBe(true);
  });
});
