import { authHandlers } from '@/features/auth/mocks'
import { setupWorker } from 'msw/browser'

const handlers = [
  ...authHandlers,
  // Add other handlers here if needed`
] 

export const worker = setupWorker(...handlers)

// Expose worker globally for debugging (optional)
if (process.env.NODE_ENV === 'development') {
  (window as unknown as { mswWorker: typeof worker }).mswWorker = worker
}