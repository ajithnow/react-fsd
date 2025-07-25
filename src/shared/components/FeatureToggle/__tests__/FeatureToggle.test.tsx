import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { FeatureToggle } from '../FeatureToggle';

// Mock the feature flags hook
jest.mock('../../../utils/featureFlags', () => ({
  useFeatureFlag: jest.fn()
}));

import { useFeatureFlag } from '../../../utils/featureFlags';
const mockUseFeatureFlag = useFeatureFlag as jest.MockedFunction<typeof useFeatureFlag>;

describe('FeatureToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when feature is enabled', () => {
    mockUseFeatureFlag.mockReturnValue(true);
    
    render(
      <FeatureToggle feature="auth.enabled">
        <div data-testid="feature-content">Auth Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.getByTestId('feature-content')).toBeTruthy();
    expect(screen.getByTestId('feature-content').textContent).toBe('Auth Feature');
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('auth.enabled');
  });

  it('should not render children when feature is disabled', () => {
    mockUseFeatureFlag.mockReturnValue(false);
    
    render(
      <FeatureToggle feature="auth.features.register">
        <div data-testid="feature-content">Register Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.queryByTestId('feature-content')).toBeNull();
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('auth.features.register');
  });

  it('should render fallback when feature is disabled and fallback is provided', () => {
    mockUseFeatureFlag.mockReturnValue(false);
    
    render(
      <FeatureToggle 
        feature="auth.features.register" 
        fallback={<div data-testid="fallback-content">Registration Disabled</div>}
      >
        <div data-testid="feature-content">Register Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.queryByTestId('feature-content')).toBeNull();
    expect(screen.getByTestId('fallback-content')).toBeTruthy();
    expect(screen.getByTestId('fallback-content').textContent).toBe('Registration Disabled');
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('auth.features.register');
  });

  it('should not render fallback when feature is enabled', () => {
    mockUseFeatureFlag.mockReturnValue(true);
    
    render(
      <FeatureToggle 
        feature="auth.enabled" 
        fallback={<div data-testid="fallback-content">Auth Disabled</div>}
      >
        <div data-testid="feature-content">Auth Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.getByTestId('feature-content')).toBeTruthy();
    expect(screen.queryByTestId('fallback-content')).toBeNull();
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('auth.enabled');
  });

  it('should handle nested feature flags', () => {
    mockUseFeatureFlag.mockReturnValue(true);
    
    render(
      <FeatureToggle feature="auth.features.passwordReset">
        <div data-testid="nested-feature">Password Reset Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.getByTestId('nested-feature')).toBeTruthy();
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('auth.features.passwordReset');
  });

  it('should render multiple children when feature is enabled', () => {
    mockUseFeatureFlag.mockReturnValue(true);
    
    render(
      <FeatureToggle feature="auth.enabled">
        <div data-testid="child-1">Login</div>
        <div data-testid="child-2">Register</div>
        <span data-testid="child-3">Password Reset</span>
      </FeatureToggle>
    );
    
    expect(screen.getByTestId('child-1')).toBeTruthy();
    expect(screen.getByTestId('child-2')).toBeTruthy();
    expect(screen.getByTestId('child-3')).toBeTruthy();
    expect(screen.getByTestId('child-1').textContent).toBe('Login');
    expect(screen.getByTestId('child-2').textContent).toBe('Register');
    expect(screen.getByTestId('child-3').textContent).toBe('Password Reset');
  });

  it('should handle string children', () => {
    mockUseFeatureFlag.mockReturnValue(true);
    
    render(
      <FeatureToggle feature="newUI">
        This is a string child
      </FeatureToggle>
    );
    
    expect(screen.getByText('This is a string child')).toBeTruthy();
  });

  it('should handle fragment children', () => {
    mockUseFeatureFlag.mockReturnValue(true);
    
    render(
      <FeatureToggle feature="newUI">
        <>
          <div data-testid="fragment-child-1">Fragment Child 1</div>
          <div data-testid="fragment-child-2">Fragment Child 2</div>
        </>
      </FeatureToggle>
    );
    
    expect(screen.getByTestId('fragment-child-1')).toBeTruthy();
    expect(screen.getByTestId('fragment-child-2')).toBeTruthy();
  });

  it('should work with complex fallback content', () => {
    mockUseFeatureFlag.mockReturnValue(false);
    
    render(
      <FeatureToggle 
        feature="newUI"
        fallback={
          <div data-testid="complex-fallback">
            <h2>Feature not available</h2>
            <p>Please enable the feature in settings</p>
          </div>
        }
      >
        <div data-testid="feature-content">New UI Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.queryByTestId('feature-content')).toBeNull();
    expect(screen.getByTestId('complex-fallback')).toBeTruthy();
    expect(screen.getByText('Feature not available')).toBeTruthy();
    expect(screen.getByText('Please enable the feature in settings')).toBeTruthy();
  });

  it('should call useFeatureFlag only once per render', () => {
    mockUseFeatureFlag.mockReturnValue(true);
    
    const { rerender } = render(
      <FeatureToggle feature="newUI">
        <div>Content</div>
      </FeatureToggle>
    );
    
    expect(mockUseFeatureFlag).toHaveBeenCalledTimes(1);
    
    // Rerender with same props
    rerender(
      <FeatureToggle feature="newUI">
        <div>Content</div>
      </FeatureToggle>
    );
    
    expect(mockUseFeatureFlag).toHaveBeenCalledTimes(2);
  });

  it('should update when feature flag changes', () => {
    mockUseFeatureFlag.mockReturnValue(false);
    
    const { rerender } = render(
      <FeatureToggle feature="newUI">
        <div data-testid="feature-content">New UI Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.queryByTestId('feature-content')).toBeNull();
    
    // Change the mock to return true
    mockUseFeatureFlag.mockReturnValue(true);
    
    rerender(
      <FeatureToggle feature="newUI">
        <div data-testid="feature-content">New UI Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.getByTestId('feature-content')).toBeTruthy();
    expect(screen.getByTestId('feature-content').textContent).toBe('New UI Feature');
  });

  it('should handle boolean false feature flags correctly', () => {
    mockUseFeatureFlag.mockReturnValue(false);
    
    render(
      <FeatureToggle feature="analytics">
        <div data-testid="analytics-content">Analytics Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.queryByTestId('analytics-content')).toBeNull();
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('analytics');
  });

  it('should handle truthy values as enabled', () => {
    mockUseFeatureFlag.mockReturnValue('enabled');
    
    render(
      <FeatureToggle feature="experimental">
        <div data-testid="experimental-content">Experimental Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.getByTestId('experimental-content')).toBeTruthy();
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('experimental');
  });

  it('should handle empty string as disabled', () => {
    mockUseFeatureFlag.mockReturnValue('');
    
    render(
      <FeatureToggle feature="emptyFlag">
        <div data-testid="empty-content">Empty Flag Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.queryByTestId('empty-content')).toBeNull();
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('emptyFlag');
  });

  it('should handle null/undefined as disabled', () => {
    mockUseFeatureFlag.mockReturnValue(null);
    
    render(
      <FeatureToggle feature="nullFlag">
        <div data-testid="null-content">Null Flag Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.queryByTestId('null-content')).toBeNull();
    expect(mockUseFeatureFlag).toHaveBeenCalledWith('nullFlag');
  });

  it('should render nothing when feature is disabled and no fallback provided', () => {
    mockUseFeatureFlag.mockReturnValue(false);
    
    const { container } = render(
      <FeatureToggle feature="disabledFeature">
        <div data-testid="disabled-content">Disabled Feature</div>
      </FeatureToggle>
    );
    
    expect(screen.queryByTestId('disabled-content')).toBeNull();
    expect(container.firstChild).toBeNull();
  });
});
