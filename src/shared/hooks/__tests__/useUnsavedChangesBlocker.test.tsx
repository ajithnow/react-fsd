import { renderHook, act } from '@testing-library/react';
import { useUnsavedChangesBlocker } from '../useUnsavedChangesBlocker';
import { useNavigate } from '@tanstack/react-router';
import { useAlertDialog } from '@/shared/components';

jest.mock('@tanstack/react-router', () => ({
  useNavigate: jest.fn(),
  useBlocker: jest.fn(),
}));

type UseAlertDialogReturn = ReturnType<typeof useAlertDialog>;

const createMockConfirmDialog = (): UseAlertDialogReturn => ({
  isOpen: false,
  setIsOpen: jest.fn(),
  showAlert: jest.fn(),
  hideAlert: jest.fn(),
});

describe('useUnsavedChangesBlocker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not attach beforeunload if not dirty', () => {
    const confirmDialog = createMockConfirmDialog();
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useUnsavedChangesBlocker({ isDirty: false, confirmDialog })
    );

    expect(addSpy).not.toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
    unmount();
    expect(removeSpy).not.toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
  });

  it('attaches beforeunload if dirty', () => {
    const confirmDialog = createMockConfirmDialog();
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useUnsavedChangesBlocker({ isDirty: true, confirmDialog })
    );

    expect(addSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
  });

  it('handleConfirmLeave should close dialog and navigate', () => {
    const confirmDialog = createMockConfirmDialog();
    const navigate = jest.fn();

    (useNavigate as jest.Mock).mockReturnValue(navigate);

    const { result } = renderHook(() =>
      useUnsavedChangesBlocker({ isDirty: true, confirmDialog })
    );

    act(() => {
      result.current.setPendingNextPath('/users'); 
      result.current.handleConfirmLeave();
    });

    expect(confirmDialog.setIsOpen).toHaveBeenCalledWith(false);
    expect(navigate).toHaveBeenCalledWith({ to: '/users' });
  });

  it('handleCancelLeave should just close dialog', () => {
    const confirmDialog = createMockConfirmDialog();

    const { result } = renderHook(() =>
      useUnsavedChangesBlocker({ isDirty: true, confirmDialog })
    );

    act(() => {
      result.current.handleCancelLeave();
    });

    expect(confirmDialog.setIsOpen).toHaveBeenCalledWith(false);
  });
});
