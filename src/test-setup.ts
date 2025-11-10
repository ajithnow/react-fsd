// Test setup file for Jest
// Mock import.meta for Vite compatibility

// Mock environment variables for Jest
process.env.VITE_FEATURE_FLAGS = undefined;

// Import jest-dom matchers for all tests
import '@testing-library/jest-dom';

// Mock scrollIntoView for Radix UI components
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock ResizeObserver for Radix UI components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia for all tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Additional test utilities can go here
export {};
