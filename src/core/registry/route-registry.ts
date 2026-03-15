import { createRegistry } from './create-registry'
import type { AnyRoute } from '@tanstack/react-router'

export const routeRegistry = createRegistry<AnyRoute>('RouteRegistry')
