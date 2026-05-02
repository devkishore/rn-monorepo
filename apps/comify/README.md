# Comify

Example React Native application demonstrating the usage of shared packages from the monorepo.

## 📱 About

Comify is a sample React Native app that showcases how to use packages from `@rn-monorepo`:

- Shared components from `@rn-monorepo/common`
- API utilities from `@rn-monorepo/api`
- Custom hooks from `@rn-monorepo/hooks`
- Storage utilities from `@rn-monorepo/storage`

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
yarn install

# Build shared packages
yarn build
```

### Development

```bash
# Watch mode for all packages
yarn dev

# Build TypeScript
yarn build

# Run linting
yarn lint
```

### Testing

```bash
# Run tests for entire monorepo
yarn test
```

## 📂 Project Structure

```
apps/comify/
├── src/
│   ├── App.tsx          # Main application component
│   └── index.ts         # Entry point
├── package.json
└── tsconfig.json
```

## 🎯 Features

### Using Common Components

```tsx
import { Button, COLORS } from '@rn-monorepo/common';

export const MyScreen = () => (
  <Button
    title="Press"
    onPress={() => console.log('Pressed!')}
    style={{ backgroundColor: COLORS.primary }}
  />
);
```

### Making API Calls

```tsx
import { apiClient } from '@rn-monorepo/api';

const data = await apiClient.get('/endpoint');
```

### Custom Hooks

```tsx
import { useAsync, useDebounce } from '@rn-monorepo/hooks';

const { status, data } = useAsync(() => apiClient.get('/data'), true);
const debouncedQuery = useDebounce(searchTerm, 500);
```

### Persistent Storage

```tsx
import { AsyncStorageManager } from '@rn-monorepo/storage';

await AsyncStorageManager.setItem('user', userData);
const user = await AsyncStorageManager.getItem('user');
```

## 🔧 Build

```bash
yarn workspace comify build
```

## 📝 Dependencies

- React Native: ^0.73.0
- React: ^18.2.0
- All shared packages from monorepo

## 📚 Resources

- [Common Package](../packages/common/README.md)
- [API Package](../packages/api/README.md)
- [Hooks Package](../packages/hooks/README.md)
- [Storage Package](../packages/storage/README.md)
