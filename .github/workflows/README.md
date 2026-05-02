# CI/CD Workflows Documentation

This directory contains GitHub Actions workflows organized by priority level. Each workflow runs different types of checks to ensure code quality, performance, and security.

## 📋 Workflow Overview

### 🔴 [High Priority Checks](./checks-high.yml)

**Trigger:** On every push and pull request to `main` and `develop`

**Purpose:** Critical checks that prevent production issues. These must pass before merging.

**Jobs:**

1. **Setup** - Initialize Node versions for matrix testing
2. **TypeScript Type Checking** - Validate all type definitions
   - Command: `yarn workspaces run tsc --noEmit`
   - Detects: Type errors, missing types, incompatible assignments

3. **ESLint Code Quality** - Check code style and best practices
   - Command: `yarn lint`
   - Detects: Syntax errors, unused variables, anti-patterns, React violations

4. **Prettier Code Formatting** - Verify consistent formatting
   - Command: `yarn format --check`
   - Detects: Formatting inconsistencies, style violations

5. **Build & Compile** - Ensure code builds successfully
   - Command: `yarn build`
   - Detects: Compilation errors, broken imports

6. **Unit Tests** - Run all Jest tests
   - Command: `yarn test`
   - Detects: Logic errors, broken functionality
   - Enforces: 70%+ branch coverage, 80%+ function/line/statement coverage

7. **Security Audit** - Check for vulnerable dependencies
   - Command: `yarn audit --audit-level moderate`
   - Detects: Known CVEs in dependencies
   - Non-blocking: Continues even if vulnerabilities found (needs review)

**Status Badge:** 🟢 All must pass

---

### 🟡 [Medium Priority Checks](./checks-medium.yml)

**Trigger:** Weekly on Sunday + on every push/PR (can be configured)

**Purpose:** Important checks for code quality and maintainability. These should pass but aren't production blockers.

**Jobs:**

1. **Test Coverage Analysis** - Monitor test coverage metrics
   - Runs: `yarn test -- --coverage`
   - Generates coverage reports as artifacts
   - Comments on PRs with coverage info
   - Detects: Untested code paths

2. **Dependency Checks** - Monitor package health
   - Checks for outdated packages
   - Detects duplicate dependencies
   - Runs: `yarn outdated` and dependency analysis
   - Detects: Security updates needed, bloat

3. **Integration Tests** - Validate component interactions
   - Runs tests matching `integration` pattern
   - Detects: Components working incorrectly together
   - Non-blocking: Continues on error

4. **Performance Check** - Monitor build performance
   - Measures bundle sizes after build
   - Tracks: Distribution size per package
   - Detects: Unexpected size increases

5. **Documentation Check** - Verify documentation exists
   - Validates: README files present
   - Checks: Documentation completeness
   - Detects: Missing documentation

**Status Badge:** 🟡 Should pass

---

### 🟢 [Low Priority Checks](./checks-low.yml)

**Trigger:** Weekly on Sunday at 3 AM UTC + manual dispatch

**Purpose:** Optional insights and best practices. Run less frequently.

**Jobs:**

1. **E2E Tests** - End-to-end user workflow testing
   - Runs: `yarn test:e2e` (if configured)
   - Detects: Full user journey failures
   - Status: Not configured by default

2. **Accessibility Audit** - Check accessibility compliance
   - Recommendations for:
     - Screen reader compatibility
     - Touch target sizes (44x44 points minimum)
     - Color contrast ratios
     - Semantic component usage

3. **Secrets Detection** - Scan for hardcoded secrets
   - Tool: TruffleHog
   - Detects: API keys, tokens, credentials in code
   - Status: Non-blocking

4. **Bundle Size Analysis** - Monitor application size
   - Analyzes compiled bundle sizes
   - Tracks: Size per package
   - Detects: Unexpected bloat
   - Non-blocking: For awareness

5. **Unused Dependencies** - Identify unused packages
   - Tool: depcheck
   - Detects: Packages installed but not used
   - Non-blocking: Code cleanup suggestion

6. **Deprecated APIs Check** - Scan for old React patterns
   - Finds: componentWillMount, UNSAFE\_ methods
   - Detects: Deprecated React/RN APIs
   - Non-blocking: Migration guide

7. **License Compliance** - Verify package licenses
   - Runs: `yarn licenses list`
   - Detects: Incompatible licenses
   - Non-blocking: License review

8. **Code Metrics** - Generate code statistics
   - Counts: TypeScript files, tests, lines of code
   - Reports: Project metrics
   - Non-blocking: Informational

9. **Health Report** - Summary of all checks
   - Final summary of workflow status
   - Links to detailed logs

**Status Badge:** 🟢 Informational only

---

## 📊 Execution Timeline

```
┌─ PUSH/PR ──────────────────────────────────┐
│                                            │
│  HIGH PRIORITY (Immediate)                 │
│  ├─ TypeScript Check          ~30s         │
│  ├─ ESLint                    ~20s         │
│  ├─ Prettier Format           ~10s         │
│  ├─ Build                     ~40s         │
│  ├─ Unit Tests                ~60s         │
│  └─ Security Audit            ~20s         │
│                                            │
│  ⏱️  Total: ~2-3 minutes                   │
│  🚫 Blocks merge if any fail               │
│                                            │
└────────────────────────────────────────────┘

┌─ WEEKLY (Sunday) ──────────────────────────┐
│                                            │
│  MEDIUM PRIORITY (2 AM UTC)                │
│  ├─ Coverage Analysis         ~90s         │
│  ├─ Dependency Checks         ~30s         │
│  ├─ Integration Tests         ~60s         │
│  ├─ Performance Check         ~45s         │
│  └─ Documentation             ~10s         │
│                                            │
│  ⏱️  Total: ~4-5 minutes                   │
│  ℹ️  Informational, non-blocking            │
│                                            │
└────────────────────────────────────────────┘

┌─ WEEKLY (Sunday 3 AM) ──────────────────────┐
│                                             │
│  LOW PRIORITY                              │
│  ├─ E2E Tests                ~120s         │
│  ├─ Accessibility Audit      ~15s          │
│  ├─ Secrets Scan             ~60s          │
│  ├─ Bundle Analysis          ~45s          │
│  ├─ Unused Dependencies      ~30s          │
│  ├─ Deprecated APIs          ~10s          │
│  ├─ License Check            ~20s          │
│  └─ Code Metrics             ~10s          │
│                                             │
│  ⏱️  Total: ~5-10 minutes                   │
│  ℹ️  Manual trigger or weekly schedule      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Usage Guide

### Running High Priority Checks Locally

```bash
# Type checking
yarn workspaces run tsc --noEmit

# Linting
yarn lint

# Format checking
yarn format --check

# Build
yarn build

# Tests
yarn test
```

### Running Medium Priority Checks Locally

```bash
# Coverage
yarn test -- --coverage

# Check outdated packages
yarn outdated

# Bundle size
yarn build
du -sh packages/*/dist
```

### Running Low Priority Checks Locally

```bash
# Scan for secrets (install trufflehog first)
trufflehog filesystem ./

# Check unused dependencies
depcheck

# Deprecated APIs
grep -r "componentWillMount\|UNSAFE_" packages/*/src
```

---

## 📈 Status Badges

You can add status badges to your README:

```markdown
![High Priority](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/checks-high.yml/badge.svg)
![Medium Priority](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/checks-medium.yml/badge.svg)
![Low Priority](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/checks-low.yml/badge.svg)
```

---

## 🔧 Customization

### Modify High Priority Schedule

Edit `.github/workflows/checks-high.yml`:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

### Modify Medium Priority Schedule

Edit `.github/workflows/checks-medium.yml`:

```yaml
on:
  schedule:
    - cron: '0 2 * * 0' # Change this line
```

### Modify Low Priority Schedule

Edit `.github/workflows/checks-low.yml`:

```yaml
on:
  schedule:
    - cron: '0 3 * * 0' # Change this line
  workflow_dispatch: # Allow manual trigger
```

---

## 📋 Check Details

### High Priority Checks

| Check      | Purpose       | Failure Impact | Fix                  |
| ---------- | ------------- | -------------- | -------------------- |
| TypeScript | Type safety   | Hard error     | Fix type errors      |
| ESLint     | Code quality  | Blocks merge   | `yarn lint:fix`      |
| Prettier   | Formatting    | Blocks merge   | `yarn format`        |
| Build      | Compilation   | Hard error     | Fix build errors     |
| Tests      | Functionality | Blocks merge   | Update tests or code |
| Security   | Vulnerability | Warning only   | Update packages      |

### Medium Priority Checks

| Check         | Purpose               | Frequency | Warning            |
| ------------- | --------------------- | --------- | ------------------ |
| Coverage      | Code quality          | Weekly    | Low coverage       |
| Dependencies  | Package health        | Weekly    | Outdated packages  |
| Integration   | Component interaction | Weekly    | Broken integration |
| Performance   | Bundle size           | Weekly    | Size increase      |
| Documentation | Completeness          | Weekly    | Missing docs       |

### Low Priority Checks

| Check           | Purpose         | Frequency | Action                 |
| --------------- | --------------- | --------- | ---------------------- |
| E2E Tests       | User workflows  | Weekly    | Investigate failures   |
| Accessibility   | A11y compliance | Weekly    | Review recommendations |
| Secrets         | Security        | Weekly    | Remove exposed secrets |
| Bundle Size     | Performance     | Weekly    | Optimize if needed     |
| Unused Deps     | Cleanup         | Weekly    | Remove unused packages |
| Deprecated APIs | Modernization   | Weekly    | Update patterns        |
| Licenses        | Compliance      | Weekly    | Review licenses        |
| Metrics         | Analytics       | Weekly    | Track trends           |

---

## 🚨 Troubleshooting

### High Priority Workflow Failing

1. **TypeScript errors**

   ```bash
   yarn workspaces run tsc --noEmit
   ```

2. **ESLint errors**

   ```bash
   yarn lint:fix
   ```

3. **Format errors**

   ```bash
   yarn format
   ```

4. **Build errors**

   ```bash
   yarn build
   ```

5. **Test failures**
   ```bash
   yarn test
   ```

### View Workflow Logs

1. Go to: **Actions** tab in GitHub
2. Click the workflow name
3. Click the failed run
4. View logs for specific job

### Disable Failing Check Temporarily

⚠️ **Not recommended**, but for emergency merges:

Edit workflow YAML and add `continue-on-error: true` to the step.

---

## 📚 Related Documentation

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [ESLint Documentation](https://eslint.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/)
- [Prettier Docs](https://prettier.io/docs/)

---

## 💡 Best Practices

1. **Always fix High Priority checks** before merging
2. **Monitor Medium Priority** weekly trends
3. **Review Low Priority** insights monthly
4. **Update dependencies** regularly (Medium checks)
5. **Keep tests passing** and coverage high
6. **Document changes** in commit messages
7. **Enable branch protection** requiring High Priority passes

---

## 📞 Support

For workflow issues:

1. Check GitHub Actions logs
2. Review error messages carefully
3. Run local commands to reproduce
4. Update dependencies if outdated
5. Contact DevOps team if blocked
