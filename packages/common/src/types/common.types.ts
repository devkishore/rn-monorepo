/**
 * Common types shared across the monorepo
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
}
