# Quality Tools & Code Standards Guide

## Overview

This project now includes comprehensive quality assurance, security scanning, and code standards tools to ensure high code quality and security.

## Tools Installed

### 1. ESLint - JavaScript/React Linting ✅
**What it does:** Analyzes code for potential errors, enforces coding standards, and identifies problematic patterns.

**Configuration:** `eslint.config.js`

**Features:**
- React 18+ support (no need for React import)
- React Hooks rules
- Accessibility checks (jsx-a11y)
- Best practices enforcement
- Separate rules for frontend (src/) and backend (server/)

**Usage:**
```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

**Common Issues Fixed:**
- Missing prop-types
- Unused variables
- React Hook dependencies
- Accessibility issues
- Code style inconsistencies

---

### 2. npm audit - Dependency Vulnerability Scanning ✅
**What it does:** Scans npm dependencies for known security vulnerabilities.

**Current Status:** 16 vulnerabilities detected (see docs/SECURITY_AUDIT.md for details)

**Usage:**
```bash
# Check for vulnerabilities
npm run audit:security
npm audit

# Attempt to fix vulnerabilities automatically
npm run audit:fix
npm audit fix

# Force fix with breaking changes (use with caution)
npm audit fix --force
```

**Key Findings:**
- 2 Critical (form-data, request)
- 11 High (WalletConnect v1, Web3 dependencies)
- 3 Moderate (extend, tough-cookie, request)

**Recommendations:**
- Upgrade to WalletConnect v2
- Replace deprecated `request` package with axios
- See docs/SECURITY_AUDIT.md for full details

---

### 3. Vitest - Testing Framework with Coverage ✅
**What it does:** Fast unit testing framework compatible with Vite, with coverage reporting.

**Configuration:** `vitest.config.js`

**Coverage Thresholds:**
- Lines: 60%
- Functions: 60%
- Branches: 60%
- Statements: 60%

**Usage:**
```bash
# Run tests in watch mode
npm test
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

**Test Files:**
- Location: `**/*.{test,spec}.{js,jsx}`
- Example: `server/controllers/notesController.test.js`
- Setup: `src/test/setup.js`

**Coverage Reports:**
- Text output in terminal
- HTML report: `coverage/index.html`
- JSON report: `coverage/coverage.json`
- LCOV report: `coverage/lcov.info`

**Writing Tests:**
```javascript
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

---

### 4. depcheck - Unused Dependencies Detection ✅
**What it does:** Identifies unused npm dependencies to reduce bundle size and maintenance overhead.

**Usage:**
```bash
# Check all dependencies
npm run deps:check

# Check with common dev dependencies ignored
npm run deps:unused
```

**Ignores:**
- Testing libraries (@testing-library/*)
- Build tools (@vitejs/*, @vitest/*)
- ESLint plugins
- Development tools (husky, lint-staged)

**What to do with results:**
- Review unused dependencies
- Remove if truly unused
- Keep if used in ways depcheck can't detect
- Document exceptions

---

### 5. madge - Circular Dependency Detection ✅
**What it does:** Detects circular dependencies that can cause runtime errors and maintenance issues.

**Usage:**
```bash
# Check for circular dependencies
npm run circular:check

# Generate visual dependency graph
npm run circular:image
# Creates: deps-graph.svg
```

**Why Circular Dependencies Are Bad:**
- Can cause initialization issues
- Make code harder to understand
- Increase bundle size
- May cause runtime errors

**How to Fix:**
1. Refactor shared code into separate modules
2. Use dependency injection
3. Create intermediate abstraction layers

---

### 6. Snyk - Advanced Security Scanning ✅
**What it does:** Deep security scanning for vulnerabilities, license issues, and code problems.

**Setup Required:**
```bash
# First time setup
snyk auth

# Or use API token
snyk test --auth-token=YOUR_TOKEN
```

**Usage:**
```bash
# Test for vulnerabilities
npm run snyk:test
snyk test

# Monitor project (requires authentication)
npm run snyk:monitor
snyk monitor
```

**Features:**
- More comprehensive than npm audit
- License compliance checking
- Container scanning support
- Open source vulnerability database
- Fix recommendations

**Snyk vs npm audit:**
- Snyk: More comprehensive, requires account
- npm audit: Built-in, immediate results
- Use both for best coverage

---

### 7. Husky & lint-staged - Pre-commit Hooks ✅
**What it does:** Automatically runs quality checks before each git commit.

**Configuration:**
- `package.json` → `lint-staged` section
- `.husky/` folder (to be created)

**Setup (if not initialized):**
```bash
# Initialize husky
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

**What Runs on Commit:**
For each staged `.js` or `.jsx` file:
1. ESLint auto-fix
2. Run related tests

**Benefits:**
- Catches issues before they reach the repo
- Ensures consistent code quality
- Prevents committing broken code
- Automatic formatting

**Bypass (emergency only):**
```bash
git commit --no-verify -m "message"
```

---

## Combined Quality Checks

### Quick Quality Check
```bash
npm run quality:check
```

**Runs:**
1. ✅ Lint (ESLint)
2. ✅ Tests (Vitest - no coverage)
3. ✅ Unused dependencies
4. ✅ Circular dependencies
5. ✅ Security audit

**Time:** ~30 seconds
**When:** Before push, during development

---

### Full Quality Check
```bash
npm run quality:full
```

**Runs:**
1. ✅ Lint (ESLint)
2. ✅ Tests with coverage (Vitest)
3. ✅ Unused dependencies
4. ✅ Circular dependencies
5. ✅ Snyk security scan

**Time:** ~2-3 minutes
**When:** Before PR, before release

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Quality Checks

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Check unused dependencies
        run: npm run deps:unused

      - name: Check circular dependencies
        run: npm run circular:check

      - name: Security audit
        run: npm run audit:security

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Development Workflow

### Daily Development
```bash
# Start development
npm start

# Run tests in watch mode (different terminal)
npm test
```

### Before Committing
```bash
# Fix linting issues
npm run lint:fix

# Run tests
npm run test:run

# Or let pre-commit hooks handle it
git add .
git commit -m "your message"
```

### Before Pull Request
```bash
# Run full quality check
npm run quality:full

# Review coverage report
open coverage/index.html

# Check for circular dependencies
npm run circular:check
```

### Weekly Maintenance
```bash
# Check for security updates
npm run audit:security

# Update dependencies
npm outdated
npm update

# Re-run tests
npm run test:coverage
```

---

## Troubleshooting

### ESLint Errors

**Issue:** Too many errors
```bash
# Fix automatically
npm run lint:fix

# Then fix remaining manually
```

**Issue:** False positives
- Add exceptions to `eslint.config.js`
- Use inline comments: `// eslint-disable-next-line rule-name`

### Test Failures

**Issue:** Tests fail
```bash
# Run specific test
npx vitest path/to/test.js

# Run with verbose output
npx vitest --reporter=verbose
```

**Issue:** Coverage below threshold
- Write more tests
- Remove untestable code
- Adjust thresholds in `vitest.config.js` (temporarily)

### Circular Dependencies

**Issue:** Circular dependency detected
1. Review dependency graph: `npm run circular:image`
2. Refactor shared code
3. Use dependency injection
4. Create abstraction layer

### Security Vulnerabilities

**Issue:** High/Critical vulnerabilities
1. Check docs/SECURITY_AUDIT.md for details
2. Try `npm audit fix`
3. Check for package updates
4. Consider replacing deprecated packages

---

## Configuration Files

### Project Structure
```
backend_test/
├── eslint.config.js          # ESLint configuration
├── vitest.config.js          # Vitest configuration
├── docs/SECURITY_AUDIT.md         # Security audit report
├── QUALITY_TOOLS_GUIDE.md    # This file
├── .husky/                   # Git hooks (to be created)
├── src/
│   └── test/
│       └── setup.js          # Test setup
├── server/
│   └── controllers/
│       └── *.test.js         # Backend tests
└── coverage/                 # Coverage reports (generated)
```

---

## Best Practices

### Code Quality
✅ Fix linting errors before committing
✅ Write tests for new features
✅ Maintain test coverage above 60%
✅ Review security audit regularly
✅ Keep dependencies up to date

### Security
✅ Run `npm audit` weekly
✅ Address critical/high vulnerabilities immediately
✅ Update to latest stable versions
✅ Review docs/SECURITY_AUDIT.md monthly
✅ Use Snyk for deeper scanning

### Testing
✅ Write tests for all new features
✅ Test edge cases and error handling
✅ Aim for 80%+ coverage on critical paths
✅ Run tests before committing
✅ Review coverage reports

### Dependencies
✅ Remove unused dependencies
✅ Keep dependencies minimal
✅ Prefer well-maintained packages
✅ Review dependency licenses
✅ Document why dependencies are needed

---

## Quick Reference

### Essential Commands
```bash
# Development
npm start                    # Start dev servers
npm test                     # Run tests (watch)

# Quality Checks
npm run lint                 # Check linting
npm run lint:fix             # Fix linting
npm run test:coverage        # Test with coverage
npm run quality:check        # Quick quality check
npm run quality:full         # Full quality check

# Security
npm run audit:security       # Check vulnerabilities
npm run snyk:test           # Deep security scan

# Dependencies
npm run deps:unused          # Find unused deps
npm run circular:check       # Find circular deps
```

### Coverage Thresholds
- **Minimum:** 60% (enforced)
- **Target:** 80%
- **Excellent:** 90%+

### When to Run What
- **On save:** ESLint (via IDE)
- **On commit:** lint-staged hooks
- **Before push:** `quality:check`
- **Before PR:** `quality:full`
- **Weekly:** Security audit
- **Monthly:** Dependency updates

---

## Resources

- [ESLint Documentation](https://eslint.org/)
- [Vitest Documentation](https://vitest.dev/)
- [npm audit Documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk Documentation](https://docs.snyk.io/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [depcheck Documentation](https://github.com/depcheck/depcheck)
- [madge Documentation](https://github.com/pahen/madge)

---

**Last Updated:** November 6, 2025
**Maintainer:** Development Team
**Next Review:** Weekly
