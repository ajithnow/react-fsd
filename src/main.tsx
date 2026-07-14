import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { initializeI18n } from './core/i18n'
import { localeRegistry, sidebarRegistry, type FeatureConfig } from '@/core/registry'
import { bootstrapFeatures } from '@/core/registry/bootstrap'
import { assembleRoutes } from '@/core/router/assembly'
import { shellSidebar } from '@/core/shell/sidebar'
import sharedLocales from '@/shared/locales'

/**
 * INITIALIZE FEATURES
 * Discovers and registers all features during application bootstrap.
 */
function initializeFeatures() {
  localeRegistry.register([{ ns: 'common', resources: sharedLocales }]);
  localeRegistry.register([{ ns: 'shared', resources: sharedLocales }]);
  sidebarRegistry.register(shellSidebar);

  const modules = import.meta.glob<{ default: FeatureConfig }>(
    './features/*/config.ts',
    { eager: true }
  );

  const featureRoutes = bootstrapFeatures(modules);
  assembleRoutes(featureRoutes);
}

initializeFeatures();

initializeI18n().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
