# Caps Lock Test Automation

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.58-green.svg)](https://playwright.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-9.39-purple.svg)](https://eslint.org/)

End-to-end test automation framework for Caps Lock walk-in bath application using Playwright and TypeScript.

## Prerequisites

- **Node.js**: v20.12+ (LTS recommended)
- **Package Manager**: Yarn v1.22.22+ (required)
- **TypeScript**: v5.9+ (included in devDependencies)

> **Note:** This project uses Yarn exclusively. Do not use npm.

## Quick Start

1. **Clone the repository**

```sh
git clone https://github.com/JivkoKostadinov/caps_lock.git
cd caps_lock
```

2. **Install dependencies**

```sh
yarn install
```

3. **Install Playwright browsers**

```sh
npx playwright install
```

4. **Create environment file**

Create a `.env.vault` file in the project root:

```bash
PROD_WEB_URL="https://test-qa.capslock.global"
CI=false  # Set to true for headless mode in CI
```

5. **Run tests**

```sh
yarn tests:web
```

## Testing Principles

### Core Philosophy

- **Test Independence**: Each test is self-contained and can run in isolation
- **Code Over Configuration**: Use Playwright's built-in features over custom solutions
- **Parallel Execution**: Tests designed to run concurrently for faster feedback
- **Page Object Pattern**: Separate test logic from page interaction details
- **Bug-Driven Testing**: Automate bugs once found to prevent regression
- **Dynamic Test Data**: Favor fresh, disposable data over static fixtures

### Test Pattern (AAA)

- **Arrange**: Set up test data and navigate to page
- **Act**: Perform actions on the page
- **Assert**: Verify expected outcomes

### Key Principles

- **Hermetic Tests**: Every test should be completely independent and self-sufficient
- **Abstractions Over Details**: Invest in abstractions that survive implementation changes
- **Convention Over Configuration**: Utilize Playwright's built-in configuration support
- **Concurrency Optimization**: Always consider parallel execution and CI server constraints
- **Single Source of Truth**: Keep all hardcoded data centralized

> **Important:** When adding dependencies, always use `yarn add` and ensure they're listed in `package.json`

## Technical Stack

| Technology     | Version | Purpose                              |
| -------------- | ------- | ------------------------------------ |
| **Playwright** | 1.58+   | E2E testing framework                |
| **TypeScript** | 5.9+    | Type-safe test code                  |
| **ESLint**     | 9.39+   | Code quality & linting (flat config) |
| **Prettier**   | 3.8+    | Code formatting                      |
| **log4js**     | 6.9+    | Logging framework                    |
| **env-cmd**    | 10.1+   | Environment variable management      |

### Key Technical Decisions

- **ES Modules**: Using `"type": "module"` for modern JavaScript
- **Instance-Based Architecture**: Moving away from static methods for better testability
- **Semantic Locators**: Migrating from XPath to Playwright's recommended locator strategies
- **Flat Config**: ESLint 9 with new flat configuration format

## Project Structure

```
caps_lock/
├── configs/                      # Playwright test configurations
│   ├── playwright.default.config.ts   # Base configuration
│   └── playwright.web.config.ts       # Web-specific configuration
├── core/                         # Core framework functionality
│   └── web/                      # Web testing components
│       ├── dom_actions.ts            # Base class with common DOM actions
│       ├── dashboard.ts              # Dashboard page object
│       ├── thank_you.ts              # Thank you page object
│       └── web.ts                    # Web entry point
├── data/                         # Test data and locators
│   ├── element_vault.json            # UI element selectors
│   └── routes.json                   # Application routes
├── tests/                        # Test suites
│   └── web/
│       └── dashboard/
│           └── dashboard.spec.ts     # Dashboard test cases
├── types/                        # TypeScript interfaces
│   └── interfaces.ts                 # Type definitions
├── utils/                        # Utility functions
│   ├── static_data_loader.ts         # JSON data loader with caching
│   └── test_scope.ts                 # Test scope wrapper
├── .env.vault                    # Environment variables (not committed)
├── eslint.config.js              # ESLint 9 flat configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies and scripts
```

### Architecture Overview

**`core/web/`** - Web testing framework components:

- `dom_actions.ts` - Base class providing common DOM interaction methods (getElement, fillElement, click, etc.)
- `dashboard.ts` - Page object for dashboard interactions with multi-step form handling
- `thank_you.ts` - Page object for thank you page
- `web.ts` - Entry point that initializes all page objects

**`data/`** - Static test data:

- `element_vault.json` - UI locators organized by page (currently XPath, migrating to semantic locators)
- `routes.json` - Application route definitions

**`tests/`** - Test specifications following AAA pattern

**`types/`** - TypeScript interfaces for type safety

**`utils/`** - Helper utilities:

- `static_data_loader.ts` - Loads and caches JSON data with O(n+m) optimized lookups
- `test_scope.ts` - Wraps test context with logger and page objects

## Available Scripts

### Testing

```sh
# Run all web tests (headless)
yarn tests:web

# Run tests in headed mode (with browser UI)
yarn tests:web:headed

# Run tests in debug mode with Playwright Inspector
yarn tests:web:debug

# Run tests with Playwright UI mode
yarn tests:web:ui

# Run specific test file
yarn test:file tests/web/dashboard/dashboard.spec.ts

# Show test report
yarn report
```

### Code Quality

```sh
# Run ESLint
yarn lint

# Fix auto-fixable ESLint issues
yarn lint:fix

# Format code with Prettier
yarn prettier

# Check formatting without writing
yarn prettier:check

# TypeScript type checking
yarn type-check
```

## Writing Tests

### Basic Test Example

```typescript
import { test, expect } from '@playwright/test';
import { TestScope } from '../../../utils/test_scope';

test.describe('Dashboard tests', () => {
  let testScope: TestScope;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    testScope = new TestScope(page);
  });

  test('Submit walk-in bath request successfully', async () => {
    // Arrange
    const testData = {
      zip: '68901',
      interestedTub: 'firstFormSafetyTub',
      tubForProperty: 'firstFormHouseCondoTub',
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '(223)456-7890',
    };

    // Act
    await testScope.Web.DashboardPage.requestWalkInBathForm(testData);

    // Assert
    const url = testScope.Web.ThankYouPage.getCurrentUrl();
    expect(url).toContain('/thankyou');
  });
});
```

### Page Object Pattern

```typescript
// Create new page objects in core/web/
export class NewPage {
  logger: Logger;
  page: Page;

  constructor(logger: Logger, page: Page) {
    this.logger = logger;
    this.page = page;
  }

  public async performAction(): Promise<void> {
    this.logger.info('Performing action');
    await this.page.getByRole('button', { name: /submit/i }).click();
  }
}
```

## Environment Variables

Configure the `.env.vault` file with the following variables:

| Variable       | Description                  | Example                           |
| -------------- | ---------------------------- | --------------------------------- |
| `PROD_WEB_URL` | Base URL for the application | `https://test-qa.capslock.global` |
| `CI`           | Enable headless mode for CI  | `true` or `false`                 |

> **Security:** Never commit `.env.vault` to version control. Add it to `.gitignore`.

## Troubleshooting

### Tests fail with "module not found"

- Ensure you're using `yarn` not `npm`
- Run `yarn install` to reinstall dependencies
- Check that `"type": "module"` is in `package.json`

### Browser doesn't launch

- Install Playwright browsers: `npx playwright install`
- Check `CI` flag in `.env.vault` (set to `false` for headed mode)
- Verify system meets Playwright's requirements

### TypeScript errors

- Run `yarn type-check` to see full type errors
- Ensure `tsconfig.json` is properly configured
- Check that all imports use `.js` extensions (TypeScript requirement for ES modules)

### ESLint errors

- Run `yarn lint:fix` to auto-fix issues
- Check `eslint.config.js` for configuration
- Ensure ESLint 9 flat config format is used

### Import errors with JSON files

- Use import assertions: `import data from './data.json' with { type: 'json' }`
- Ensure TypeScript allows JSON imports in `tsconfig.json`

### log4js import issues

- Use: `import log4js from 'log4js'` (default import)
- Not: `import * as log4js from 'log4js'`

## CI/CD Integration

Tests are CI-ready and run in headless mode when `CI=true` is set.

### GitHub Actions Example

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: yarn install
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: yarn tests:web
        env:
          CI: true
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Contributing

1. Create a feature branch from `main`
2. Write tests following the AAA pattern
3. Ensure all tests pass: `yarn tests:web`
4. Run linter: `yarn lint`
5. Format code: `yarn prettier`
6. Run type check: `yarn type-check`
7. Create a pull request with clear description

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## License

ISC
