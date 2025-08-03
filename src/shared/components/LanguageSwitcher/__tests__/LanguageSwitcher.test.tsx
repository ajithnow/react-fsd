// Mock must be hoisted before any imports
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  })),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '../LanguageSwitcher';

const { useTranslation: useTranslationMock } =
  jest.requireMock('react-i18next');

jest.mock('@/lib/shadcn/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div tabIndex={0} role="menuitem" onClick={onClick}>
      {children}
    </div>
  ),
}));

import type React from 'react';
jest.mock('@/lib/shadcn/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

describe('LanguageSwitcher', () => {
  it('shows all language options when opened', async () => {
    render(<LanguageSwitcher />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
    expect(screen.getByText('🇩🇪')).toBeInTheDocument();
  });

  it('calls changeLanguage when a language is selected', async () => {
    const changeLanguage = jest.fn();
    useTranslationMock.mockReturnValue({
      i18n: {
        language: 'en',
        changeLanguage,
      },
    });
    render(<LanguageSwitcher />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Deutsch'));
    expect(changeLanguage).toHaveBeenCalledWith('de');
  });
});
