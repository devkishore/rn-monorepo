# Shared CI Workflow

This repository contains a reusable GitHub Actions workflow for Yarn-based monorepo projects.

## Overview

The workflow (`ci.yml`) performs:

- Linting with ESLint
- TypeScript compilation/build
- Unit tests with Jest
- Multi-Node.js version testing (18.x, 20.x)
- Dependency caching for faster CI runs

## Prerequisites

Your project must have:

- `yarn@4.0.0` configured as package manager
- Same ESLint and Prettier configs as this repo
- `.eslintrc.json` for linting
- `.prettierrc` for code formatting
- `package.json` with scripts: `lint`, `build`, `test`

## Usage

### For Other Projects

1. **Copy the config files to your repo:**

   ```bash
   # From this repo, copy these files:
   - .eslintrc.json
   - .prettierrc
   - .prettierignore
   ```

2. **Create your workflow file:**
   Create `.github/workflows/ci.yml` in your repo with:

   ```yaml
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

   Replace `your-org` with your GitHub organization/username.

   **The workflow will auto-detect:**
   - Monorepos: Uses `yarn workspace <workspace> run test`
   - Regular projects: Uses `yarn test`

3. **Optional: Override auto-detection**

   If you need a custom test command:

   ```yaml
   jobs:
     build-and-test:
       uses: your-org/rn-monorepo/.github/workflows/ci.yml@main
       with:
         test-command: 'yarn test:e2e'
   ```

## Configuration

The reusable workflow automatically detects your project structure:

- **Monorepos with workspaces:** Automatically uses `yarn workspace <workspace> run test`
- **Regular projects:** Automatically uses `yarn test`
- **Custom:** Pass `test-command` input to override auto-detection

| Input          | Description                         | Default                         |
| -------------- | ----------------------------------- | ------------------------------- |
| `test-command` | Override auto-detected test command | Auto-detect based on workspaces |

## What Gets Checked

✅ Code formatting with Prettier  
✅ Linting with ESLint  
✅ TypeScript compilation  
✅ Unit tests execution  
✅ Multiple Node versions

## Troubleshooting

### Workflow not found error

- Ensure the workflow file is on the `main` branch
- Check organization name is correct
- Wait a few minutes for GitHub to index the workflow

### Lint/Build/Test failures

- Ensure your project has same config files
- Run `yarn lint`, `yarn build`, `yarn test` locally first
- Check ESLint rules in `.eslintrc.json`

## Maintenance

To update the shared workflow:

1. Modify `.github/workflows/ci.yml` in this repo
2. Tag a new release
3. Other repos can update by changing the ref: `@main` → `@v1.0.0`
