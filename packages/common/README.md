# @rn-monorepo/common

Shared components, utilities, and design tokens for React Native applications.

## 📦  Installation

```bash
yarn add @rn-monorepo/common
```

## 🎨 Components

### Button

Reusable button component with variant support.

```tsx
import { Button } from '@rn-monorepo/common';

export const MyScreen = () => (
  <Button title="Press me" onPress={() => console.log('Pressed!')} variant="primary" />
);
```

**Props:**

- `title: string` - Button label
- `onPress: () => void` - Callback when pressed
- `variant?: 'primary' | 'secondary'` - Button style
- `style?: StyleProp<ViewStyle>` - Custom styles
- `textStyle?: StyleProp<TextStyle>` - Custom text styles

## 🎨 Theme

### Colors

Centralized color palette for consistent theming and dark mode support.

```tsx
import { COLORS } from '@rn-monorepo/common';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.white,
  },
});
```

**Available Colors:**

- `primary` - Primary brand color
- `primaryLight` - Light variant of primary
- `white` - White
- `black` - Black
- `darkGray` - Dark gray
- `mediumGray` - Medium gray
- `lightGray` - Light gray

## 🛠️ Utilities

### formatString

Trims whitespace and converts string to lowercase.

```tsx
import { formatString } from '@rn-monorepo/common';

formatString('  HELLO WORLD  '); // Returns: 'hello world'
```

### getInitials

Extracts initials from a name string.

```tsx
import { getInitials } from '@rn-monorepo/common';

getInitials('John Doe'); // Returns: 'JD'
getInitials('John Michael Doe'); // Returns: 'JMD'
```

### delay

Promise-based delay utility for async operations.

```tsx
import { delay } from '@rn-monorepo/common';

async function waitThenAction() {
  await delay(1000); // Wait 1 second
  console.log('Done!');
}
```

## 🧪 Testing

```bash
yarn workspace @rn-monorepo/common test
yarn workspace @rn-monorepo/common test:watch
```

## 📝 TypeScript

All components and utilities are fully typed:

```tsx
import type { Button } from '@rn-monorepo/common';
```

## 🔧 Build

```bash
yarn workspace @rn-monorepo/common build
```
