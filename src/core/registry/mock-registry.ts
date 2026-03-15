import { createRegistry } from './create-registry'
import type { HttpHandler } from './types'

export const mockRegistry = createRegistry<HttpHandler>('MockRegistry')
