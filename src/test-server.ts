// MSW test utilities
// This file provides utilities to setup MSW for specific tests
// Import this file only in tests that need MSW mocking

import { setupServer } from 'msw/node';
import mocks from './features/mocks';

// Create the server instance
export const server = setupServer(...mocks);

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
