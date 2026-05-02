import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageManager } from './AsyncStorageManager';

jest.mock('@react-native-async-storage/async-storage');
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('AsyncStorageManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should set a string value', async () => {
      mockedAsyncStorage.setItem.mockResolvedValue();

      await AsyncStorageManager.setItem('key', 'value');

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('key', '"value"');
    });

    it('should set an object value with JSON serialization', async () => {
      mockedAsyncStorage.setItem.mockResolvedValue();

      const obj = { id: 1, name: 'test' };
      await AsyncStorageManager.setItem('key', obj);

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        'key',
        JSON.stringify(obj),
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Storage error');
      mockedAsyncStorage.setItem.mockRejectedValue(error);

      await expect(
        AsyncStorageManager.setItem('key', 'value'),
      ).rejects.toThrow('Storage error');
    });
  });

  describe('getItem', () => {
    it('should get a string value', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue('"value"');

      const result = await AsyncStorageManager.getItem<string>('key');

      expect(result).toBe('value');
    });

    it('should get an object value', async () => {
      const obj = { id: 1, name: 'test' };
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(obj));

      const result = await AsyncStorageManager.getItem('key');

      expect(result).toEqual(obj);
    });

    it('should return null for missing key', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const result = await AsyncStorageManager.getItem('key');

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Storage error');
      mockedAsyncStorage.getItem.mockRejectedValue(error);

      await expect(AsyncStorageManager.getItem('key')).rejects.toThrow(
        'Storage error',
      );
    });
  });

  describe('removeItem', () => {
    it('should remove an item', async () => {
      mockedAsyncStorage.removeItem.mockResolvedValue();

      await AsyncStorageManager.removeItem('key');

      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('key');
    });

    it('should handle errors', async () => {
      const error = new Error('Storage error');
      mockedAsyncStorage.removeItem.mockRejectedValue(error);

      await expect(AsyncStorageManager.removeItem('key')).rejects.toThrow(
        'Storage error',
      );
    });
  });

  describe('clear', () => {
    it('should clear all storage', async () => {
      mockedAsyncStorage.clear.mockResolvedValue();

      await AsyncStorageManager.clear();

      expect(mockedAsyncStorage.clear).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Storage error');
      mockedAsyncStorage.clear.mockRejectedValue(error);

      await expect(AsyncStorageManager.clear()).rejects.toThrow(
        'Storage error',
      );
    });
  });

  describe('getAllKeys', () => {
    it('should get all keys', async () => {
      const keys = ['key1', 'key2', 'key3'];
      mockedAsyncStorage.getAllKeys.mockResolvedValue(keys);

      const result = await AsyncStorageManager.getAllKeys();

      expect(result).toEqual(keys);
    });

    it('should handle empty storage', async () => {
      mockedAsyncStorage.getAllKeys.mockResolvedValue([]);

      const result = await AsyncStorageManager.getAllKeys();

      expect(result).toEqual([]);
    });

    it('should handle errors', async () => {
      const error = new Error('Storage error');
      mockedAsyncStorage.getAllKeys.mockRejectedValue(error);

      await expect(AsyncStorageManager.getAllKeys()).rejects.toThrow(
        'Storage error',
      );
    });
  });

  describe('multiGet', () => {
    it('should get multiple items', async () => {
      const data = {
        user: { id: 1, name: 'John' },
        settings: { theme: 'dark' },
      };

      mockedAsyncStorage.multiGet.mockResolvedValue([
        ['user', JSON.stringify(data.user)],
        ['settings', JSON.stringify(data.settings)],
      ] as any);

      const result = await AsyncStorageManager.multiGet(['user', 'settings']);

      expect(result.user).toEqual(data.user);
      expect(result.settings).toEqual(data.settings);
    });

    it('should handle null values in multiGet', async () => {
      mockedAsyncStorage.multiGet.mockResolvedValue([
        ['key1', null],
        ['key2', '"value"'],
      ] as any);

      const result = await AsyncStorageManager.multiGet(['key1', 'key2']);

      expect(result.key1).toBeNull();
      expect(result.key2).toBe('value');
    });

    it('should handle errors', async () => {
      const error = new Error('Storage error');
      mockedAsyncStorage.multiGet.mockRejectedValue(error);

      await expect(
        AsyncStorageManager.multiGet(['key1', 'key2']),
      ).rejects.toThrow('Storage error');
    });
  });
});
