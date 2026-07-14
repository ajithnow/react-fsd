import {
  localeRegistry,
  constantsRegistry,
  guardsRegistry,
  sidebarRegistry,
} from './index';
import type { FeatureConfig } from './types';
import type { AnyRoute } from '@tanstack/react-router';
import { mergeRolePermissions } from '@/shared/lib/rbac/rolePermissions';

export function bootstrapFeatures(modules: Record<string, { default: FeatureConfig }>) {
  const featureRoutes: AnyRoute[] = [];

  Object.entries(modules).forEach(([path, module]) => {
    const config = module.default;

    if (!config) return;

    try {
      if (config.routes?.length) featureRoutes.push(...config.routes);
      if (config.locales) localeRegistry.register(config.locales);
      if (config.constants) constantsRegistry.register(config.constants);
      if (config.guards) guardsRegistry.register(config.guards);
      if (config.sidebar) sidebarRegistry.register(config.sidebar);
      if (config.rolePermissions) {
        mergeRolePermissions(config.rolePermissions);
      }
    } catch (e) {
      console.error(`[FeatureRegistry] Failed to register feature from ${path}`, e);
    }
  });

  return featureRoutes;
}
