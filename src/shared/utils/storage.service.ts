/**
 * Centralized service for interacting with browser storage (localStorage, sessionStorage).
 * Provides a clean API with type safety and automatic JSON serialization.
 */

import { StorageType } from './storage.models';

class StorageService {
  private getStorage(type: StorageType): Storage {
    return type === StorageType.LOCAL ? window.localStorage : window.sessionStorage;
  }

  /**
   * Sets an item in storage.
   * @param key The key to store the data under.
   * @param value The value to store (will be JSON stringified).
   * @param type The storage type (LOCAL or SESSION). Defaults to LOCAL.
   */
  setItem<T>(key: string, value: T, type: StorageType = StorageType.LOCAL): void {
    try {
      const storage = this.getStorage(type);
      const serializedValue = JSON.stringify(value);
      storage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item in ${type} storage:`, error);
    }
  }

  /**
   * Gets an item from storage.
   * @param key The key of the item to retrieve.
   * @param type The storage type (LOCAL or SESSION). Defaults to LOCAL.
   * @returns The parsed value, or null if the key doesn't exist or an error occurs.
   */
  getItem<T>(key: string, type: StorageType = StorageType.LOCAL): T | null {
    try {
      const storage = this.getStorage(type);
      const value = storage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting item from ${type} storage:`, error);
      return null;
    }
  }

  /**
   * Removes an item from storage.
   * @param key The key of the item to remove.
   * @param type The storage type (LOCAL or SESSION). Defaults to LOCAL.
   */
  removeItem(key: string, type: StorageType = StorageType.LOCAL): void {
    try {
      const storage = this.getStorage(type);
      storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from ${type} storage:`, error);
    }
  }

  /**
   * Clears all items from the specified storage type.
   * @param type The storage type (LOCAL or SESSION). Defaults to LOCAL.
   */
  clear(type: StorageType = StorageType.LOCAL): void {
    try {
      const storage = this.getStorage(type);
      storage.clear();
    } catch (error) {
      console.error(`Error clearing ${type} storage:`, error);
    }
  }
}

export const storageService = new StorageService();
