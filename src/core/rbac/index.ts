/**
 * Core RBAC barrel — re-exports the shared RBAC kit so feature code can
 * depend on `@/core` without importing across the shared boundary incorrectly.
 */
export * from '@/shared/lib/rbac';
