// MSW test utilities
// This file provides utilities to setup MSW for specific tests
// Import this file only in tests that need MSW mocking

import { setupServer } from 'msw/node';
import { mockRegistry } from '@/core/registry';

// Create the server instance
// We use a getter or a proxy if we want it to be dynamic, 
// but for tests, we typically register mocks before setting up the server.
export const server = setupServer();

/**
 * Updates the server with all currently registered mocks.
 * Should be called after features are bootstrapped in tests.
 */
export const updateTestServerHandlers = () => {
  server.use(...mockRegistry.getAll());
};

// Helper function to setup MSW for a test suite
export const setupMSW = () => {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error',
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });
};
