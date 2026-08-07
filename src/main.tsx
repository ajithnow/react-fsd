import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './styles/globals.css'
import App from './App.tsx'
import { initializeI18n } from './core/i18n'
import { localeRegistry, sidebarRegistry, type FeatureConfig } from '@/core/registry'
import { bootstrapFeatures } from '@/core/registry/bootstrap'
import { assembleRoutes } from '@/core/router/assembly'
import { shellSidebar } from '@/core/shell/sidebar'
import sharedLocales from '@/shared/locales'
import {
  applyPresetTokens,
  MODE_STORAGE_KEY,
  PRESET_STORAGE_KEY,
  resolveMode,
  type Mode,
  type PresetName,
} from '@/core/theme'
import { storageService } from '@/shared/utils/storage.service'

registerSW({ immediate: true })

/**
 * Apply the persisted theme before the first paint so there's nothing to
 * flash — this runs synchronously, before render() is ever called below.
 */
function initializeTheme() {
  const preset = storageService.getItem<PresetName>(PRESET_STORAGE_KEY) ?? 'modern';
  const mode = storageService.getItem<Mode>(MODE_STORAGE_KEY) ?? 'system';
  applyPresetTokens(preset, resolveMode(mode));
}

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

/**
 * Starts the MSW mock service worker in dev when VITE_MSW_ENABLED=true, so
 * the app can be used without a real backend. No-op in production builds.
 */
async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_MSW_ENABLED !== 'true') {
    return;
  }

  const { worker } = await import('@/core/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

initializeFeatures();
initializeTheme();

void enableMocking().then(() => initializeI18n()).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
