# @rn-monorepo/hooks

Custom React hooks for common patterns in React Native applications.

## 📦 Installation

```bash
yarn add @rn-monorepo/hooks
```

## 🎣 Hooks

### useAsync

Handle async operations with automatic status tracking (idle, pending, success, error).

```tsx
import { useAsync } from '@rn-monorepo/hooks';
import { apiClient } from '@rn-monorepo/api';

export const UserProfile = () => {
  const { status, data, error, execute } = useAsync(
    () => apiClient.get('/profile'),
    true, // immediate execution
  );

  if (status === 'pending') return <Text>Loading...</Text>;
  if (status === 'error') return <Text>Error: {error?.message}</Text>;
  if (status === 'success') return <Text>Hello {data?.name}</Text>;

  return <Button title="Load Profile" onPress={execute} />;
};
```

**State:**
- `status: 'idle' | 'pending' | 'success' | 'error'` - Current state
- `data: T | null` - Success response data
- `error: Error | null` - Error object if failed
- `execute: () => Promise<T>` - Manual trigger function

**Parameters:**
- `asyncFunction: () => Promise<T>` - Async function to execute
- `immediate: boolean` - Execute immediately on mount (default: true)

### useDebounce

Debounce a value for handling rapid input changes.

```tsx
import { useDebounce } from '@rn-monorepo/hooks';
import { TextInput } from 'react-native';

export const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search API call
      search(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <TextInput
      placeholder="Search..."
      value={searchTerm}
      onChangeText={setSearchTerm}
    />
  );
};
```

**Parameters:**
- `value: T` - Value to debounce
- `delay: number` - Debounce delay in milliseconds (default: 500)

**Returns:**
- `debouncedValue: T` - Debounced value

## 💡 Common Patterns

### Fetch Data on Mount

```tsx
const { status, data } = useAsync(() => apiClient.get('/items'), true);
```

### Lazy Execution

```tsx
const { status, data, execute } = useAsync(
  () => apiClient.post('/action', payload),
  false, // Don't execute immediately
);

return <Button title="Submit" onPress={execute} />;
```

### Search with Debounce

```tsx
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
  if (debouncedQuery) {
    search(debouncedQuery);
  }
}, [debouncedQuery]);
```

## 🧪 Testing

```bash
yarn workspace @rn-monorepo/hooks test
yarn workspace @rn-monorepo/hooks test:watch
```

## 📝 TypeScript

All hooks are fully typed:

```tsx
interface SearchResult {
  id: string;
  title: string;
}

const { data: results } = useAsync<SearchResult[]>(
  () => apiClient.get('/search'),
);
```

## 🔧 Build

```bash
yarn workspace @rn-monorepo/hooks build
```
