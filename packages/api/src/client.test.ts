import axios from 'axios';
import { HttpClient, apiClient } from './client';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a client with base URL', () => {
      const mockCreate = jest.fn().mockReturnValue({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        defaults: { headers: { common: {} } },
      });

      (mockedAxios.create as any) = mockCreate;

      const client = new HttpClient('https://api.example.com');
      expect(client).toBeInstanceOf(HttpClient);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.example.com',
          timeout: 10000,
        })
      );
    });

    it('should create a client with custom config', () => {
      const mockCreate = jest.fn().mockReturnValue({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        defaults: { headers: { common: {} } },
      });

      (mockedAxios.create as any) = mockCreate;

      const config = { timeout: 5000 };
      const client = new HttpClient('https://api.example.com', config);
      expect(client).toBeInstanceOf(HttpClient);
    });
  });

  describe('API Methods', () => {
    let mockInstance: any;

    beforeEach(() => {
      mockInstance = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        defaults: { headers: { common: {} } },
      };
      (mockedAxios.create as any) = jest.fn().mockReturnValue(mockInstance);
    });

    it('should make a GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockInstance.get.mockResolvedValue({ data: mockData });

      const client = new HttpClient('https://api.example.com');
      const result = await client.get('/test');

      expect(result).toEqual(mockData);
      expect(mockInstance.get).toHaveBeenCalledWith('/test', undefined);
    });

    it('should make a POST request', async () => {
      const mockData = { id: 1, name: 'Created' };
      mockInstance.post.mockResolvedValue({ data: mockData });

      const client = new HttpClient('https://api.example.com');
      const payload = { name: 'Test' };
      const result = await client.post('/test', payload);

      expect(result).toEqual(mockData);
      expect(mockInstance.post).toHaveBeenCalledWith('/test', payload, undefined);
    });

    it('should make a PUT request', async () => {
      const mockData = { id: 1, name: 'Updated' };
      mockInstance.put.mockResolvedValue({ data: mockData });

      const client = new HttpClient('https://api.example.com');
      const payload = { name: 'Updated' };
      const result = await client.put('/test/1', payload);

      expect(result).toEqual(mockData);
    });

    it('should make a DELETE request', async () => {
      mockInstance.delete.mockResolvedValue({ data: { success: true } });

      const client = new HttpClient('https://api.example.com');
      const result = await client.delete('/test/1');

      expect(result).toEqual({ success: true });
    });

    it('should handle GET request errors', async () => {
      const mockError = new Error('Network error');
      mockInstance.get.mockRejectedValue(mockError);

      const client = new HttpClient('https://api.example.com');

      await expect(client.get('/test')).rejects.toThrow('Network error');
    });

    it('should set authorization header', async () => {
      const client = new HttpClient('https://api.example.com');
      const token = 'test-token-123';
      client.setAuthToken(token);

      expect(mockInstance.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`);
    });

    it('should return the axios instance', () => {
      const client = new HttpClient('https://api.example.com');
      const instance = client.getInstance();

      expect(instance).toBe(mockInstance);
    });
  });

  describe('apiClient singleton', () => {
    it('should be an instance of HttpClient', () => {
      expect(apiClient).toBeInstanceOf(HttpClient);
    });
  });
});
