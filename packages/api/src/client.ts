import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * HTTP Client factory for API requests
 */
export class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string = '', config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      ...config,
    });
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Get axios instance for advanced usage
   */
  getInstance() {
    return this.client;
  }
}

/**
 * Default singleton HTTP client
 */
export const apiClient = new HttpClient();
