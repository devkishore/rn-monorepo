# GitHub Actions Workflows Guide

Complete documentation for automated quality checks in React Native projects.

**Jump to section:** [Quick Start](#-quick-start) | [What Runs](#-what-runs) | [Use in Project](#-use-in-your-project) | [Migrate to Other Repos](#-migrate-to-other-projects) | [Branch Protection](#-branch-protection) | [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Unified Workflow System

**One version, multiple uses:**
- `checks-high.yml` - Runs on all PRs (all branches) & can be called from other projects
- `checks-medium.yml` - Runs on schedule (main/develop only) & can be called from other projects
- `checks-low.yml` - Runs on schedule (main/develop only) & can be called from other projects

### For this project

Just push code - workflows run automatically! ✅

---

## 📋 What Runs?

Every push/PR triggers these checks:

| Check           | What                    | Pass/Fail   |
| --------------- | ----------------------- | ----------- |
| 🔍 **Lint**     | ESLint code quality     | ✅ Required |
| 📝 **Format**   | Prettier code style     | ✅ Required |
| 🏗️ **Build**    | TypeScript compilation  | ✅ Required |
| ✅ **Tests**    | Jest (90% coverage min) | ✅ Required |
| 🔐 **Security** | Dependency audit        | ⚠️ Warning  |

**Execution time:** ~15-20 minutes on first run, ~5-10 min cached

---

## 🌐 For Other Projects

Before proceeding, ensure your project meets all the requirements below:

### ✅ Prerequisites & Requirements

Your project must meet these requirements before using workflows:

#### 1. System Requirements

- ✔️ **Node.js**: 18.x or higher
- ✔️ **Yarn**: 1.22.22 or higher (use `yarn --version` to check)
- ✔️ **Git**: Initialized repository with remote configured

#### 2. Installation

```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Install/Update Yarn globally
npm install -g yarn@1.22.22

# Verify Yarn
yarn --version  # Should be >= 1.22.22

# Install project dependencies
yarn install
```

#### 3. Package.json Configuration

Your `package.json` must include these sections:

##### Scripts

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "build": "tsc",
    "test": "jest",
    "fix": "eslint . --ext .ts,.tsx --fix && prettier --write ."
  }
}
```

##### DevDependencies

Ensure your `package.json` includes these required packages:

```json
{
  "devDependencies": {
    "@types/jest": "^29.5.13",
    "@types/react": "^19.2.0",
    "@types/react-test-renderer": "^19.1.0",
    "eslint": "^8.19.0",
    "eslint-plugin-prettier": "^5.5.5",
    "jest": "^29.6.3",
    "prettier": "^2.8.8",
    "ts-jest": "^29.1.5",
    "typescript": "^5.8.3"
  }
}
```

##### Engine Requirements

Set minimum versions in `package.json`:

```json
{
  "engines": {
    "node": ">= 18.0.0",
    "yarn": ">= 1.22.0"
  }
}
```

**Important:** Always run `yarn install` after updating `package.json` to ensure all dependencies are installed.

#### 4. Git Attributes for Line Endings

Create a `.gitattributes` file in your project root to prevent line ending conflicts between Windows (CRLF) and Linux/Mac (LF):

```
# Auto detect text files and normalize line endings to LF
* text=auto eol=lf

# Source code
*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.jsx text eol=lf
*.json text eol=lf
*.md text eol=lf

# Config files
.eslintrc text eol=lf
.prettierrc text eol=lf
tsconfig.json text eol=lf
jest.config.js text eol=lf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
```

**Why this matters:** CI runs on Linux (LF line endings), but Windows uses CRLF. Without `.gitattributes`, Prettier will format files differently in CI than locally, causing unexpected failures.

#### 5. Configuration Files

Your project must have these configuration files:

- ✔️ [`.eslintrc.json`](https://eslint.org/docs/latest/use/configure/) - ESLint rules for code quality  
  ([Example](https://github.com/devkishore/rn-monorepo/blob/main/.eslintrc.json))

- ✔️ [`.prettierrc`](https://prettier.io/docs/en/configuration.html) - Prettier formatting rules  
  ([Example](https://github.com/devkishore/rn-monorepo/blob/main/.prettierrc))

- ✔️ [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) - TypeScript compiler settings  
  ([Example](https://github.com/devkishore/rn-monorepo/blob/main/apps/comify/tsconfig.json))

- ✔️ [`jest.config.js`](https://jestjs.io/docs/configuration) - Jest test configuration  
  ([Example](https://github.com/devkishore/rn-monorepo/blob/main/packages/api/jest.config.js))

---

### Setup Options

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  pull_request:  # Run on PRs to any branch
  schedule:
    - cron: '0 2 * * 0'  # Weekly Sunday 2 AM UTC

jobs:
  high:
    if: github.event_name == 'pull_request'
    uses: devkishore/rn-monorepo/.github/workflows/checks-high.yml@main
  
  medium:
    if: github.event_name == 'schedule'
    uses: devkishore/rn-monorepo/.github/workflows/checks-medium.yml@main
  
  low:
    if: github.event_name == 'schedule'
    uses: devkishore/rn-monorepo/.github/workflows/checks-low.yml@main
```

Then push:
```bash
git add .github/workflows/ci.yml
git commit -m "ci: add reusable workflows from rn-monorepo"
git push
```

**How it works:**
- ✅ On **PR**: Only HIGH CI runs (blocks merge if fails)
- ✅ On **Schedule (Sunday 2 AM UTC)**: Only MEDIUM & LOW run (informational)

**Benefits:** Always stays in sync - no need to update when workflows change!

---

**Option B: Copy workflows locally (If you need customization)**

1. Copy workflow files:

```bash
cp .github/workflows/checks-{high,medium,low}.yml your-project/.github/workflows/
```

2. Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  pull_request:  # Run on PRs to any branch
  schedule:
    - cron: '0 2 * * 0'  # Weekly Sunday 2 AM UTC

jobs:
  high:
    if: github.event_name == 'pull_request'
    uses: ./.github/workflows/checks-high.yml
  
  medium:
    if: github.event_name == 'schedule' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop')
    uses: ./.github/workflows/checks-medium.yml
  
  low:
    if: github.event_name == 'schedule' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop')
    uses: ./.github/workflows/checks-low.yml
```

3. Push it:

```bash
git add .github/workflows/
git commit -m "ci: add checks"
git push
```

---

## 📋 What Runs?

Every push/PR triggers these checks:

| Check           | What                    | Pass/Fail   |
| --------------- | ----------------------- | ----------- |
| 🔍 **Lint**     | ESLint code quality     | ✅ Required |
| 📝 **Format**   | Prettier code style     | ✅ Required |
| 🏗️ **Build**    | TypeScript compilation  | ✅ Required |
| ✅ **Tests**    | Jest (90% coverage min) | ✅ Required |
| 🔐 **Security** | Dependency audit        | ⚠️ Warning  |

**Execution time:** ~15-20 minutes on first run, ~5-10 min cached

---

## ✅ Prerequisites & Requirements

Before using workflows, ensure your project meets all these requirements:

### 1. System Requirements

- ✔️ **Node.js**: 18.x or higher
- ✔️ **Yarn**: 1.22.22 or higher (use `yarn --version` to check)
- ✔️ **Git**: Initialized repository with remote configured

### 2. Installation

```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Install/Update Yarn globally
npm install -g yarn@1.22.22

# Verify Yarn
yarn --version  # Should be >= 1.22.22

# Install project dependencies
yarn install
```

### 3. Package.json Scripts

Your `package.json` must include these scripts:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "build": "tsc",
    "test": "jest",
    "fix": "eslint . --ext .ts,.tsx --fix && prettier --write ."
  }
}
```

### 4. DevDependencies

Ensure your `package.json` includes these required packages:

```json
{
  "devDependencies": {
    "@types/jest": "^29.5.13",
    "@types/react": "^19.2.0",
    "@types/react-test-renderer": "^19.1.0",
    "eslint": "^8.19.0",
    "eslint-plugin-prettier": "^5.5.5",
    "jest": "^29.6.3",
    "prettier": "^2.8.8",
    "ts-jest": "^29.1.5",
    "typescript": "^5.8.3"
  }
}
```

**Important:** Always run `yarn install` after updating `package.json` to ensure all dependencies are installed.

### 5. Configuration Files

Your project must have these configuration files:

- ✔️ `.eslintrc.json` - ESLint rules for code quality
- ✔️ `.prettierrc` - Prettier formatting rules
- ✔️ `tsconfig.json` - TypeScript compiler settings
- ✔️ `jest.config.js` - Jest test configuration

### 6. Jest Coverage Configuration

Your `jest.config.js` should include coverage thresholds (minimum 70% recommended for CI):

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### 7. Engine Requirements

Set minimum versions in `package.json`:

```json
{
  "engines": {
    "node": ">= 18.0.0",
    "yarn": ">= 1.22.0"
  }
}
```

### 8. Git Attributes for Line Endings

Create a `.gitattributes` file in your project root to prevent line ending conflicts between Windows (CRLF) and Linux/Mac (LF):

```
# Auto detect text files and normalize line endings to LF
* text=auto eol=lf

# Source code
*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.jsx text eol=lf
*.json text eol=lf
*.md text eol=lf

# Config files
.eslintrc text eol=lf
.prettierrc text eol=lf
tsconfig.json text eol=lf
jest.config.js text eol=lf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
```

**Why this matters:** CI runs on Linux (LF line endings), but Windows uses CRLF. Without `.gitattributes`, Prettier will format files differently in CI than locally, causing unexpected failures.

---

## 💡 Using in Your Project

### Local Setup: Copy Workflows

If you want to customize or modify locally:

1. Copy workflow files to your project
2. Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:  # Run on PRs to any branch
  schedule:
    - cron: '0 2 * * 0'  # Weekly Sunday 2 AM UTC

jobs:
  high:
    if: github.event_name == 'pull_request'
    uses: ./.github/workflows/checks-high.yml
  
  medium:
    if: github.event_name == 'schedule'
    uses: ./.github/workflows/checks-medium.yml
  
  low:
    if: github.event_name == 'schedule'
    uses: ./.github/workflows/checks-low.yml
```

### Multi-Version Testing

Test against multiple Node versions:

```yaml
jobs:
  quality-checks:
    uses: ./.github/workflows/checks-high-reusable.yml
    with:
      node-versions: '["16.x", "18.x", "20.x"]'
```

### Different Operating Systems

```yaml
jobs:
  linux:
    uses: ./.github/workflows/checks-high-reusable.yml
    with:
      runs-on: 'ubuntu-latest'

  mac:
    uses: ./.github/workflows/checks-high-reusable.yml
    with:
      runs-on: 'macos-latest'

  windows:
    uses: ./.github/workflows/checks-high-reusable.yml
    with:
      runs-on: 'windows-latest'
```

### Add Additional Checks

Schedule weekly quality reports:

```yaml
jobs:
  quality-checks:
    uses: ./.github/workflows/checks-high.yml

  coverage-report:
    needs: quality-checks
    if: success()
    uses: ./.github/workflows/checks-medium.yml
    with:
      runs-on: 'ubuntu-latest'
```

---

## 🔄 Migrate to Other Projects

### Step 1: Prerequisites

Ensure the target project has all requirements from the [Prerequisites](#-prerequisites) section:

- ✔️ System requirements (Node.js 18+, Yarn 1.22.22+)
- ✔️ All required scripts in `package.json`
- ✔️ All required devDependencies installed
- ✔️ Configuration files: `.eslintrc.json`, `.prettierrc`, `tsconfig.json`, `jest.config.js`
- ✔️ Engine requirements set in `package.json`
- ✔️ Yarn workspaces configured (for monorepos only)

### Step 2: Copy Workflows

```bash
# Copy the workflow file
mkdir -p your-project/.github/workflows
cp .github/workflows/checks-high.yml your-project/.github/workflows/

# Optional: copy templates for advanced setup
cp -r .github/workflow-templates your-project/.github/
```

### Step 3: Create Caller Workflow

In your project, create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:  # Run on PRs to any branch
  schedule:
    - cron: '0 2 * * 0'  # Weekly Sunday 2 AM UTC

jobs:
  high-priority:
    if: github.event_name == 'pull_request'
    uses: ./.github/workflows/checks-high.yml

  medium-priority:
    if: github.event_name == 'schedule' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop')
    uses: ./.github/workflows/checks-medium.yml

  low-priority:
    if: github.event_name == 'schedule' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop')
    uses: ./.github/workflows/checks-low.yml
```

### Step 4: Install Dependencies

Run installation to ensure all required packages are present:

```bash
cd your-project
yarn install

# Verify all tools work
yarn lint --version     # Should show ESLint version
yarn format --check     # Should check formatting
yarn build              # Should compile TypeScript
yarn test               # Should run Jest tests
```

### Step 5: Customize Scripts (Optional)

If your commands differ from standard setup, update your `package.json` scripts:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "build": "tsc",
    "test": "jest --coverage"
    "test": "yarn workspaces run test"
  }
}
```

### Step 5: Test Locally First

```bash
cd your-project
yarn install
yarn lint
yarn format --check
yarn build
yarn test
```

### Step 6: Push and Monitor

```bash
git add .github/workflows/
git commit -m "ci: add quality workflows"
git push origin feature-branch
```

Then check GitHub Actions tab for results.

---

## 🔐 Branch Protection

### Enable Required Checks

1. Go to GitHub repo → Settings → Branches
2. Click "Add rule" and enter branch name (e.g., `main`)
3. Enable:
   - ✅ "Require status checks to pass before merging"
   - ✅ Select "TypeScript Type Checking"
   - ✅ Select "ESLint Code Quality"
   - ✅ Select "Unit Tests"
   - ✅ Select "Build & Compile"

### Result

- Only code passing ALL checks can merge
- Failed tests = blocked PR 🚫
- Accidental mistakes prevented

### Optional: Require Manual Reviews

Also enable:

- ✅ "Require pull request reviews before merging"
- ✅ "Require code reviews from code owners"

---

## 🐛 Troubleshooting

### Tests Fail

```bash
# 1. Run locally
yarn test

# 2. Check coverage
yarn test -- --coverage

# 3. If coverage low (< 90%)
# Add more tests to critical files
```

### Lint Fails

```bash
# 1. Show all issues
yarn lint

# 2. Auto-fix what you can
yarn lint -- --fix

# 3. Check config
cat .eslintrc.json
```

### Format Fails

```bash
# 1. Auto-format
yarn format

# 2. Check config
cat .prettierrc
```

### Build Fails

```bash
# 1. Clean and rebuild
rm -rf dist node_modules
yarn install
yarn build

# 2. Check TypeScript
yarn tsc --noEmit
```

### "Workflow not found" Error

**Cause:** File path or branch name wrong

**Fix:**

- Check file exists: `ls .github/workflows/checks-high.yml`
- Check branch: Workflows must be on branch you're pushing to
- Correct syntax: `uses: ./.github/workflows/checks-high.yml`

### GitHub Actions Tab Shows Nothing

**Cause:** No workflow triggered

**Fix:**

- Push to correct branch (main, develop, etc.)
- Check `on:` trigger in CI file
- Wait 30 seconds for GitHub to index

---

## 🏗️ System Architecture

### Three-Tier Approach

| Tier       | Priority    | Trigger                  | Purpose               |
| ---------- | ----------- | ------------------------ | --------------------- |
| **High**   | 🔴 Critical | Every PR (all branches)  | Block merges if fail  |
| **Medium** | 🟡 Info     | Weekly (main/develop)    | Monitor quality trend |
| **Low**    | 🟢 Optional | Weekly (main/develop)    | Deep analysis         |

### Jobs in Each Tier

**High Priority (Required):**

- TypeScript type checking
- ESLint linting
- Prettier formatting
- Build verification
- Unit tests (90%+ coverage)
- Security audit

**Medium Priority (Informational):**

- Coverage analysis
- Dependency checks
- Performance profiling
- Documentation validation

**Low Priority (Insights):**

- E2E tests
- Accessibility audit
- Secrets scanning
- Bundle analysis
- Code metrics

---

## 📂 File Structure

After setup, your `.github/` should look like:

```
.github/
├── workflows/
│   ├── ci.yml                          ← Your caller (required)
│   ├── checks-high.yml                 ← Copy from template
│   ├── checks-medium.yml               ← Optional
│   └── checks-low.yml                  ← Optional
├── workflow-templates/
│   ├── checks-high-reusable.yml        ← Reusable template
│   ├── checks-medium-reusable.yml
│   ├── checks-low-reusable.yml
│   └── README.md                       ← Template reference
├── BRANCH_PROTECTION.md                ← Protection setup guide
└── MIGRATION_GUIDE.md                  ← Adoption guide
```

---

## 💡 Best Practices

✅ **Commit small** - Easier to find issues  
✅ **Test locally first** - Save CI time  
✅ **Fix lint immediately** - Don't let it pile up  
✅ **Aim for 90%+ coverage** - Minimum required  
✅ **Write meaningful tests** - Not just line hits  
✅ **Review workflow logs** - Learn from failures  
✅ **Use branch protection** - Enforce quality gates  
✅ **Cache dependencies** - Speed up CI runs

---

## 🆘 Common Issues

| Issue              | Cause                      | Solution                     |
| ------------------ | -------------------------- | ---------------------------- |
| `Lint failed`      | Code style violation       | `yarn lint --fix`            |
| `Format failed`    | Inconsistent formatting    | `yarn format`                |
| `Build failed`     | TypeScript errors          | `yarn build` / check errors  |
| `Test failed`      | Test assertion error       | `yarn test` / debug locally  |
| `Coverage low`     | Tests don't cover all code | Add tests (need 90%+)        |
| `Yarn not found`   | Not installed or cached    | Check Node setup in workflow |
| `Module not found` | Dependencies missing       | Run `yarn install`           |

---

## 📞 Support

- 📖 [GitHub Actions Docs](https://docs.github.com/en/actions)
- 🔍 Check workflow logs in GitHub Actions tab
- 💬 Review `.eslintrc.json` and `jest.config.js` for configs
- 🐛 Run commands locally to debug: `yarn lint`, `yarn test`, `yarn build`

---

**Last Updated:** May 2, 2026  
**Workflows Version:** 1.0  
**Minimum Coverage:** 90%
