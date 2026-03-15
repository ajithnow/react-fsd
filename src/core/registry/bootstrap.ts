import {
  localeRegistry,
  mockRegistry,
  permissionRegistry,
  constantsRegistry,
  guardsRegistry,
} from './index';
import type { FeatureConfig } from './types';
import type { AnyRoute } from '@tanstack/react-router';

export function bootstrapFeatures(modules: Record<string, { default: FeatureConfig }>) {
  const featureRoutes: AnyRoute[] = [];

  // Register shared/common locales first (if any provided in the future, or handled separately)
  
  Object.entries(modules).forEach(([path, module]) => {
    const config = module.default;

    if (!config) return;

    try {
      if (config.routes?.length) featureRoutes.push(...config.routes);
      if (config.locales) localeRegistry.register(config.locales);
      if (config.handlers?.length) mockRegistry.register(config.handlers);
      if (config.permissions) permissionRegistry.register(config.permissions);
      if (config.constants) constantsRegistry.register(config.constants);
      if (config.guards) guardsRegistry.register(config.guards);
    } catch (e) {
      console.error(`[FeatureRegistry] Failed to register feature from ${path}`, e);
    }
  });

  return featureRoutes;
}
