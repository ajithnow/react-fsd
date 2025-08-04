import { renderHook, act } from '@testing-library/react';
import { useAlertDialog } from '../useAlertDialog';

describe('useAlertDialog', () => {
  it('initializes with closed state', () => {
    const { result } = renderHook(() => useAlertDialog());
    
    expect(result.current.isOpen).toBe(false);
  });

  it('opens dialog when showAlert is called', () => {
    const { result } = renderHook(() => useAlertDialog());
    
    act(() => {
      result.current.showAlert();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('closes dialog when hideAlert is called', () => {
    const { result } = renderHook(() => useAlertDialog());
    
    // First open the dialog
    act(() => {
      result.current.showAlert();
    });
    
    expect(result.current.isOpen).toBe(true);
    
    // Then close it
    act(() => {
      result.current.hideAlert();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('sets dialog state directly with setIsOpen', () => {
    const { result } = renderHook(() => useAlertDialog());
    
    act(() => {
      result.current.setIsOpen(true);
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.setIsOpen(false);
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('provides stable function references', () => {
    const { result, rerender } = renderHook(() => useAlertDialog());
    
    const initialShowAlert = result.current.showAlert;
    const initialHideAlert = result.current.hideAlert;
    
    // Trigger a re-render
    rerender();
    
    // Function references should remain stable
    expect(result.current.showAlert).toBe(initialShowAlert);
    expect(result.current.hideAlert).toBe(initialHideAlert);
  });

  it('handles multiple state changes correctly', () => {
    const { result } = renderHook(() => useAlertDialog());
    
    // Start closed
    expect(result.current.isOpen).toBe(false);
    
    // Open
    act(() => {
      result.current.showAlert();
    });
    expect(result.current.isOpen).toBe(true);
    
    // Close
    act(() => {
      result.current.hideAlert();
    });
    expect(result.current.isOpen).toBe(false);
    
    // Open again
    act(() => {
      result.current.showAlert();
    });
    expect(result.current.isOpen).toBe(true);
    
    // Close with setIsOpen
    act(() => {
      result.current.setIsOpen(false);
    });
    expect(result.current.isOpen).toBe(false);
  });
});
