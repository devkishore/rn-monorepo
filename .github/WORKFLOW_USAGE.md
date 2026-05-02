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

### For other projects

**Option A: Reference from this repo (Recommended - No copying)**

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
    uses: fooliscool/rn-monorepo/.github/workflows/checks-high.yml@main
  
  medium:
    if: github.event_name == 'schedule'
    uses: fooliscool/rn-monorepo/.github/workflows/checks-medium.yml@main
  
  low:
    if: github.event_name == 'schedule'
    uses: fooliscool/rn-monorepo/.github/workflows/checks-low.yml@main
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

## ✅ Requirements

Before using workflows, ensure you have:

- ✔️ Node.js 18+ installed
- ✔️ Yarn 1.22.22+ as package manager
- ✔️ `package.json` with scripts:
  ```json
  {
    "scripts": {
      "lint": "eslint . --ext .ts,.tsx",
      "format": "prettier --write '**/*.{ts,tsx,json,md}'",
      "build": "tsc",
      "test": "jest"
    }
  }
  ```
- ✔️ Configuration files:
  - `.eslintrc.json` - Linting rules
  - `.prettierrc` - Code formatting
  - `tsconfig.json` - TypeScript settings
  - `jest.config.js` - Test setup with 90%+ coverage threshold

**Jest coverage example:**

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

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

Ensure the target project has:

- Yarn workspaces (for monorepos)
- Same script structure in `package.json`
- ESLint, Prettier, TypeScript configs

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

### Step 4: Customize Scripts

Update your `package.json` if commands differ:

```json
{
  "scripts": {
    "lint": "eslint packages/*/src --ext .ts,.tsx",
    "format": "prettier --write '**/*.{ts,tsx,json,md}'",
    "build": "yarn workspaces run build",
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
