import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage wrapper for type-safe storage operations
 */
export class AsyncStorageManager {
  /**
   * Set a value in storage
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a value from storage
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove an item from storage
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all items from storage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get all keys from storage
   */
  static async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return Array.from(keys);
    } catch (error) {
      console.error('Error getting all keys:', error);
      throw error;
    }
  }

  /**
   * Get multiple items at once
   */
  static async multiGet<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const items = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};
      items.forEach(([key, value]) => {
        result[key] = value ? JSON.parse(value) : null;
      });
      return result;
    } catch (error) {
      console.error('Error getting multiple items:', error);
      throw error;
    }
  }
}
