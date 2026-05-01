# React Native Monorepo

A monorepo structure for React Native projects using Yarn Workspaces.

## 📁 Project Structure

```
frontend/
├── packages/
│   └── common/              # Shared components and utilities
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── utils/       # Helper functions
│       │   ├── types/       # Shared TypeScript types
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json             # Root workspace configuration
├── .yarnrc.yml
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- Yarn >= 4.0.0

### Installation

```bash
cd frontend
yarn install
```

### Development

```bash
# Start development for all workspaces
yarn dev

# Build all packages
yarn build

# Clean all builds
yarn cleancommon package
yarn dev

# Build common package
yarn build

# Clean builds
yarn clean button component with primary/secondary variants
- **Helpers** - Utility functions (formatString, getInitials, delay)
- **Types** - Common TypeScript types (User, AppConfig)

### comify
React Native application demonstrating usage of the common package.

## 🔗 Monorepo Benefits

- **Shared Dependencies** - Manage dependencies across multiple apps in one place
- **Code Reusability** - Share components, utilities, and types across apps
This package is consumed by separate React Native apps (like comify) as an external dependency
- **Simplified Development** - Run all apps with a single command

## 📝 Adding New Apps or Packages

### Add a new app:
```bash
mkdir apps/new-app
cp -r apps/comify/src apps/new-app/
cp apps/comify/package.json apps/new-app/
# Update package.json name
```

### Add a new package:
```bash
mkdir packages/new-package
cp -r packages/common/src packages/new-package/
cp packages/commoPackages

To add a new shared package to the monorepo:

```bash
mkdir packages/new-package
cp -r packages/common/src packages/new-package/
cp packages/common/package.json packages/new-package/
# Update package.json name and description
```

Then external apps can consume it via: `@rn-monorepo/new-package