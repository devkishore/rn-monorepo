# @rn-monorepo/api

HTTP client and API utilities for React Native applications using axios.

## 📦 Installation

```bash
yarn add @rn-monorepo/api
```

## 🚀 Quick Start

### Using the Default Client

```tsx
import { apiClient } from '@rn-monorepo/api';

// GET request
const users = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// With authorization
apiClient.setAuthToken('your-jwt-token');
const profile = await apiClient.get('/profile');
```

### Creating a Custom HttpClient

```tsx
import { HttpClient } from '@rn-monorepo/api';

const apiClient = new HttpClient('https://api.example.com', {
  timeout: 15000,
  headers: {
    'X-Custom-Header': 'value',
  },
});

const data = await apiClient.get('/endpoint');
```

## 📡 API Methods

### GET

```tsx
const data = await apiClient.get<User>('/users/1');
```

### POST

```tsx
const response = await apiClient.post<User>('/users', {
  name: 'Jane Doe',
  email: 'jane@example.com',
});
```

### PUT

```tsx
const updated = await apiClient.put<User>('/users/1', {
  name: 'Jane Updated',
});
```

### DELETE

```tsx
await apiClient.delete('/users/1');
```

## 🔐 Authentication

```tsx
// Set authorization token
apiClient.setAuthToken('eyJhbGciOiJIUzI1NiIs...');

// All subsequent requests will include the token
const data = await apiClient.get('/protected-endpoint');
```

## 🔧 Advanced Usage

Access the underlying axios instance for advanced configurations:

```tsx
const axiosInstance = apiClient.getInstance();

// Add interceptors
axiosInstance.interceptors.request.use((config) => {
  // Modify request config
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error
    return Promise.reject(error);
  },
);
```

## 🧪 Testing

```bash
yarn workspace @rn-monorepo/api test
yarn workspace @rn-monorepo/api test:watch
```

## 📝 TypeScript

Fully typed API calls:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const user = await apiClient.get<User>('/users/1');
// user is typed as User
```

## 🔧 Build

```bash
yarn workspace @rn-monorepo/api build
```

## 📚 Dependencies

- `axios: ^1.6.0` - HTTP client library
