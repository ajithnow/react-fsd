import { setupWorker } from 'msw/browser';
import type { RequestHandler } from 'msw';

/**
 * Each feature owns its own mocks at `features/<name>/mocks/handlers.ts`,
 * exporting a `handlers` array — add one there to mock a new feature's
 * endpoints, no changes needed here.
 */
const featureMockModules = import.meta.glob<{ handlers: RequestHandler[] }>(
  '../../features/*/mocks/handlers.ts',
  { eager: true }
);

const handlers = Object.values(featureMockModules).flatMap(
  module => module.handlers ?? []
);

export const worker = setupWorker(...handlers);
