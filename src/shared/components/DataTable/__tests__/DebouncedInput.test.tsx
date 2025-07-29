import { render, screen, fireEvent } from '@testing-library/react';
import { DebouncedInput } from '../DebouncedInput';

// Mock timers for debounce testing
jest.useFakeTimers();

describe('DebouncedInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders with initial value', () => {
    render(
      <DebouncedInput
        value="initial value"
        onChange={mockOnChange}
        placeholder="Test placeholder"
      />
    );

    const input = screen.getByDisplayValue('initial value');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Test placeholder');
  });

  it('renders with empty value', () => {
    render(
      <DebouncedInput
        value=""
        onChange={mockOnChange}
        placeholder="Empty test"
      />
    );

    const input = screen.getByPlaceholderText('Empty test');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('applies custom className', () => {
    render(
      <DebouncedInput
        value=""
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('updates local value immediately on user input', () => {
    render(
      <DebouncedInput
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'new value' } });
    
    // Local value should update immediately
    expect(input).toHaveValue('new value');
    
    // But onChange should not be called yet
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('calls onChange after default debounce delay (500ms)', async () => {
    render(
      <DebouncedInput
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'debounced value' } });
    
    // Should not be called immediately
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Fast-forward time by 500ms
    jest.advanceTimersByTime(500);
    
    // Now it should be called
    expect(mockOnChange).toHaveBeenCalledWith('debounced value');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange after custom debounce delay', async () => {
    render(
      <DebouncedInput
        value=""
        onChange={mockOnChange}
        debounceMs={1000}
      />
    );

    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'custom delay' } });
    
    // Should not be called after 500ms
    jest.advanceTimersByTime(500);
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Should be called after 1000ms
    jest.advanceTimersByTime(500); // Total 1000ms
    expect(mockOnChange).toHaveBeenCalledWith('custom delay');
  });

  it('debounces multiple rapid changes', () => {
    render(
      <DebouncedInput
        value=""
        onChange={mockOnChange}
        debounceMs={300}
      />
    );

    const input = screen.getByRole('textbox');
    
    // Type multiple characters rapidly
    fireEvent.change(input, { target: { value: 'a' } });
    jest.advanceTimersByTime(100);
    
    fireEvent.change(input, { target: { value: 'ab' } });
    jest.advanceTimersByTime(100);
    
    fireEvent.change(input, { target: { value: 'abc' } });
    jest.advanceTimersByTime(100);
    
    // Still within debounce window, should not be called
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Complete the debounce delay
    jest.advanceTimersByTime(200); // Total 300ms from last change
    
    // Should only be called once with final value
    expect(mockOnChange).toHaveBeenCalledWith('abc');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('resets debounce timer on each new input', () => {
    render(
      <DebouncedInput
        value=""
        onChange={mockOnChange}
        debounceMs={500}
      />
    );

    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'first' } });
    jest.advanceTimersByTime(400);
    
    // Type again before debounce completes
    fireEvent.change(input, { target: { value: 'second' } });
    jest.advanceTimersByTime(400);
    
    // Still shouldn't be called
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Complete the second debounce
    jest.advanceTimersByTime(100);
    
    expect(mockOnChange).toHaveBeenCalledWith('second');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('updates local value when external value prop changes', () => {
    const { rerender } = render(
      <DebouncedInput
        value="initial"
        onChange={mockOnChange}
      />
    );

    let input = screen.getByDisplayValue('initial');
    expect(input).toHaveValue('initial');

    // Change the external value
    rerender(
      <DebouncedInput
        value="updated externally"
        onChange={mockOnChange}
      />
    );

    input = screen.getByDisplayValue('updated externally');
    expect(input).toHaveValue('updated externally');
  });

  it('does not call onChange if local value equals external value', () => {
    render(
      <DebouncedInput
        value="same value"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByDisplayValue('same value');
    
    // Set the same value
    fireEvent.change(input, { target: { value: 'same value' } });
    
    jest.advanceTimersByTime(500);
    
    // Should not call onChange since value didn't actually change
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('handles empty string values correctly', () => {
    render(
      <DebouncedInput
        value="initial"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByDisplayValue('initial');
    
    // Clear the input
    fireEvent.change(input, { target: { value: '' } });
    
    expect(input).toHaveValue('');
    
    jest.advanceTimersByTime(500);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = render(
      <DebouncedInput
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Unmount before debounce completes
    unmount();
    
    jest.advanceTimersByTime(500);
    
    // Should not be called after unmount
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('maintains focus and cursor position during typing', () => {
    render(
      <DebouncedInput
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    // Focus and set cursor position
    input.focus();
    fireEvent.change(input, { target: { value: 'hello' } });
    input.setSelectionRange(2, 2); // Cursor after "he"
    
    // Advance time but not enough to trigger debounce
    jest.advanceTimersByTime(100);
    
    // Input should still be focused and cursor position maintained
    expect(document.activeElement).toBe(input);
    expect(input).toHaveValue('hello');
  });

  it('works with special characters and unicode', () => {
    render(
      <DebouncedInput
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    const specialText = '特殊字符!@#$%^&*()_+{}[]|\\:";\'<>?,./ 🚀';
    
    fireEvent.change(input, { target: { value: specialText } });
    
    expect(input).toHaveValue(specialText);
    
    jest.advanceTimersByTime(500);
    
    expect(mockOnChange).toHaveBeenCalledWith(specialText);
  });
});
