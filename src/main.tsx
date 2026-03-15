import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { initializeI18n } from './core/i18n'
import { ENV } from './core/utils/env.utils'
import { localeRegistry, type FeatureConfig } from '@/core/registry'
import { bootstrapFeatures } from '@/core/registry/bootstrap'
import { assembleRoutes } from '@/core/router/assembly'
import sharedLocales from '@/shared/locales'

/**
 * INITIALIZE FEATURES
 * Discovers and registers all features during application bootstrap.
 */
function initializeFeatures() {
  // Step 1: Register shared/common locales
  localeRegistry.register([{ ns: 'common', resources: sharedLocales }]);

  // Step 2: Eagerly discover all feature configs
  const modules = import.meta.glob<{ default: FeatureConfig }>(
    './features/*/config.ts',
    { eager: true }
  );

  // Step 3: Bootstrap features and assemble routes
  const featureRoutes = bootstrapFeatures(modules);
  assembleRoutes(featureRoutes);
}

// Function to enable mocking in development
async function enableMocking() {
  if (!ENV.MSW_ENABLED) {
    return;
  }
  const { worker } = await import('./core/mock/browser.ts')
  
  return worker.start({
    onUnhandledRequest: 'warn',
    quiet: false, 
  })
}

// Initialize and start the app
initializeFeatures();

enableMocking().then(async () => {
  await initializeI18n();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})