/**
 * Generic registry factory to create typed singletons for different feature concerns.
 * Supports registration, retrieval, and freezing for application stability.
 */
export function createRegistry<T>(name: string) {
  let items: T[] = [];
  let isFrozen = false;

  return {
    /**
     * Registers new items into the registry.
     * Warns and aborts if the registry is already frozen.
     */
    register(newItems: T | T[]): void {
      if (isFrozen) {
        console.warn(`[${name}] Attempted to register items after registry was frozen.`);
        return;
      }
      
      const itemsToAdd = Array.isArray(newItems) ? newItems : [newItems];
      items.push(...itemsToAdd);
    },

    /**
     * Returns all registered items.
     */
    getAll(): T[] {
      return items;
    },

    /**
     * Freezes the registry to prevent further registration.
     */
    freeze(): void {
      isFrozen = true;
    },

    /**
     * Resets the registry. SHOULD ONLY BE USED IN TESTS.
     */
    _reset(): void {
      items = [];
      isFrozen = false;
    },
  };
}

/**
 * Generic map-based registry factory for key-value feature concerns.
 */
export function createMapRegistry<T>(name: string) {
  let items: Record<string, T> = {};
  let isFrozen = false;

  return {
    register(newItems: Record<string, T>): void {
      if (isFrozen) {
        console.warn(`[${name}] Attempted to register items after registry was frozen.`);
        return;
      }
      Object.assign(items, newItems);
    },

    getAll(): Record<string, T> {
      return items;
    },

    freeze(): void {
      isFrozen = true;
    },

    _reset(): void {
      items = {};
      isFrozen = false;
    },
  };
}
