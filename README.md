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
- Yarn >= 1.22.0

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
yarn clean
```

## 🧹 Code Quality & Testing

### Linting

```bash
# Check for linting issues
yarn lint

# Auto-fix linting issues
yarn lint:fix
```

### Testing

```bash
# Run tests in all workspaces
yarn test

# Run tests in specific workspace
yarn workspace comify run test
```

### Building

```bash
# Build all packages
yarn build

# Build specific package
yarn workspace common run build
```

## ✅ Continuous Integration

This project uses GitHub Actions for automated code quality checks and testing.

### Workflow: CI Pipeline

The workflow automatically runs on:

- **Push** to `main` or `develop` branches
- **Pull requests** to `main` or `develop` branches

#### Jobs:

1. **Setup** - Determines Node.js versions to test
2. **Lint** - Runs ESLint on all TypeScript/TSX files
3. **Build & Test** - Compiles code and runs unit tests

#### Features:

- ✅ Parallel job execution for speed
- ✅ Automatic code formatting with Prettier
- ✅ TypeScript compilation check
- ✅ Jest unit test execution
- ✅ Configurable Node.js versions (default: 20.x, optional: 18.x + 20.x)
- ✅ Native Yarn dependency caching

#### Configuration:

- Lint rules: [.eslintrc.json](.eslintrc.json)
- Code formatting: [.prettierrc](.prettierrc)
- Workflow definition: [.github/workflows/ci.yml](.github/workflows/ci.yml)

### Using as a Reusable Workflow

This workflow can be used in other projects:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    uses: your-org/rn-monorepo/.github/workflows/ci.yml@main
```

See [.github/WORKFLOW_USAGE.md](.github/WORKFLOW_USAGE.md) for detailed documentation.

## � Packages

### common

Shared components, utilities, and types for React Native applications.

**Contents:**

- **Components** - Reusable UI components (Button, etc.)
- **Utilities** - Helper functions and common logic
- **Types** - Shared TypeScript type definitions

### comify

React Native application demonstrating usage of the common package.

## 🔗 Monorepo Benefits

- **Shared Dependencies** - Manage dependencies across multiple apps in one place
- **Code Reusability** - Share components, utilities, and types across apps
- **Simplified Development** - Run all apps with a single command
- **Consistent Code Quality** - Unified linting and formatting rules

## 📝 Adding New Packages

To add a new shared package to the monorepo:

```bash
mkdir packages/new-package
cp -r packages/common/src packages/new-package/
cp packages/common/package.json packages/new-package/
# Update package.json name and description
```

Then external apps can consume it via: `@rn-monorepo/new-package`
