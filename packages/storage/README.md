# @rn-monorepo/storage

Type-safe persistent storage utilities for React Native using AsyncStorage.

## 📦 Installation

```bash
yarn add @rn-monorepo/storage
```

## 💾 AsyncStorageManager

Type-safe wrapper around React Native's AsyncStorage.

### Basic Usage

```tsx
import { AsyncStorageManager } from '@rn-monorepo/storage';

interface UserData {
  id: string;
  name: string;
  email: string;
}

// Store data
const user: UserData = { id: '1', name: 'John', email: 'john@example.com' };
await AsyncStorageManager.setItem('user', user);

// Retrieve data
const storedUser = await AsyncStorageManager.getItem<UserData>('user');
console.log(storedUser?.name); // 'John'

// Remove data
await AsyncStorageManager.removeItem('user');

// Clear all storage
await AsyncStorageManager.clear();
```

## 🔧 API Methods

### setItem

Store a value with automatic JSON serialization.

```tsx
await AsyncStorageManager.setItem('key', value);
```

### getItem

Retrieve a value with automatic JSON deserialization.

```tsx
const value = await AsyncStorageManager.getItem<T>('key');
```

### removeItem

Remove a single item.

```tsx
await AsyncStorageManager.removeItem('key');
```

### clear

Remove all stored items.

```tsx
await AsyncStorageManager.clear();
```

### getAllKeys

Get all stored keys.

```tsx
const keys = await AsyncStorageManager.getAllKeys();
```

### multiGet

Get multiple items at once.

```tsx
interface StoredData {
  user?: UserData;
  settings?: SettingsData;
}

const data = await AsyncStorageManager.multiGet<StoredData>([
  'user',
  'settings',
]);

console.log(data.user);
console.log(data.settings);
```

## 💡 Common Patterns

### User Session Storage

```tsx
interface Session {
  token: string;
  userId: string;
  expiresAt: number;
}

// Save session
const session: Session = { ... };
await AsyncStorageManager.setItem('session', session);

// Load session
const savedSession = await AsyncStorageManager.getItem<Session>('session');

// Logout
await AsyncStorageManager.removeItem('session');
```

### App Preferences

```tsx
interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

// Save settings
await AsyncStorageManager.setItem('settings', settings);

// Load settings with defaults
const settings = await AsyncStorageManager.getItem<AppSettings>('settings') || {
  theme: 'light',
  language: 'en',
  notifications: true,
};
```

### Cache Management

```tsx
// Save API response to cache
const data = await apiClient.get('/expensive-endpoint');
await AsyncStorageManager.setItem('api_cache_key', {
  data,
  timestamp: Date.now(),
});

// Retrieve cached data
const cached = await AsyncStorageManager.getItem('api_cache_key');
if (cached && Date.now() - cached.timestamp < 3600000) {
  // Cache is less than 1 hour old
  return cached.data;
}
```

## ⚠️ Error Handling

All methods include error handling and logging:

```tsx
try {
  const data = await AsyncStorageManager.getItem('key');
} catch (error) {
  console.error('Storage error:', error);
}
```

## 🧪 Testing

```bash
yarn workspace @rn-monorepo/storage test
yarn workspace @rn-monorepo/storage test:watch
```

## 📝 TypeScript

Full TypeScript support with generics:

```tsx
interface CacheData {
  id: string;
  content: string;
}

const data = await AsyncStorageManager.getItem<CacheData>('cache');
// data is typed as CacheData | null
```

## 🔧 Build

```bash
yarn workspace @rn-monorepo/storage build
```

## 📚 Dependencies

- `@react-native-async-storage/async-storage: ^1.21.0` - React Native storage
