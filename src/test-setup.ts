// Test setup file for Jest
// Mock import.meta for Vite compatibility

// Mock environment variables for Jest
process.env.VITE_FEATURE_FLAGS = undefined;

// Import jest-dom matchers for all tests
import '@testing-library/jest-dom';

// Additional test utilities can go here
export {};
