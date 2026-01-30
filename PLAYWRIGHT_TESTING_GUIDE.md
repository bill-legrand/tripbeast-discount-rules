# Playwright UI Testing Guide
## Tripbeast Discount Rules

---

## Overview

This directory contains Playwright end-to-end (E2E) tests for the Tripbeast Discount Rules feature. The tests cover UI interactions, price calculations, strike-through display logic, and discount rule management.

**Base URL**: https://admin.rezmatestage.com

---

## 📁 Project Structure

```
├── tests/
│   ├── fixtures/
│   │   └── auth.fixture.ts          # Authentication fixtures
│   ├── pages/
│   │   ├── DiscountRulePage.ts      # Page Object for Discount Rules
│   │   └── BookingEnginePage.ts     # Page Object for Booking Engine
│   ├── discount-rule-creation.spec.ts    # TC-001 to TC-005, TC-036
│   ├── strike-through-display.spec.ts    # TC-025 to TC-030, TC-043 to TC-045
│   └── discount-calculation.spec.ts      # TC-017 to TC-024, TC-034, TC-037
├── screenshots/                      # Test screenshots
├── test-results/                     # Test results and artifacts
├── playwright-report/                # HTML test reports
├── playwright.config.ts              # Playwright configuration
├── package.json                      # Dependencies
└── env.example                       # Environment variables template

```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Access to Rezmate staging environment
- Test user credentials

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Install Playwright browsers**:
```bash
npx playwright install
```

3. **Set up environment variables**:
```bash
# Copy the example file
cp env.example .env

# Edit .env with your credentials
nano .env
```

4. **Configure your `.env` file**:
```env
BASE_URL=https://admin.rezmatestage.com
ADMIN_USERNAME=your_admin_email@example.com
ADMIN_PASSWORD=your_password
CUG_USERNAME=your_cug_email@example.com
CUG_PASSWORD=your_password
TEST_CUSTOMER_ID=8676edcb-76c2-4352-b973-bedd7152f332
```

---

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Tests with UI Mode (Interactive)
```bash
npm run test:ui
```

### Run Specific Test File
```bash
npx playwright test tests/discount-rule-creation.spec.ts
```

### Run Specific Test by Name
```bash
npx playwright test -g "TC-001"
```

### Run Tests on Specific Browser
```bash
npm run test:chrome    # Chrome only
npm run test:firefox   # Firefox only
npm run test:safari    # Safari only
```

### Run Mobile Tests
```bash
npm run test:mobile
```

---

## 📊 Test Reports

### View HTML Report
```bash
npm run test:report
```

The report will open in your browser showing:
- Test results
- Screenshots
- Videos (for failed tests)
- Traces
- Execution time

### Test Results Location
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`
- **Screenshots**: `screenshots/`
- **Videos**: `test-results/`

---

## 📝 Test Coverage

### Test Cases Implemented

#### Discount Rule Creation (TC-001 to TC-005)
- ✅ TC-001: Create rule with manual name and system-generated ID
- ✅ TC-002: Verify unique ID generation for multiple rules
- ✅ TC-003: Handle special characters in rule name
- ✅ TC-004: Validation error for empty rule name
- ✅ TC-005: Handle duplicate rule names
- ✅ TC-036: Invalid discount percentage validation

#### Strike-Through Display (TC-025 to TC-030)
- ✅ TC-025: Case 1 - Both strike-throughs ON
- ✅ TC-026: Case 2 - Hotel OFF, Discount ON
- ✅ TC-027: Case 3 - Hotel ON, Discount OFF
- ✅ TC-028: Case 4 - Both OFF
- ✅ TC-029: Toggle strike-through display
- ✅ TC-030: Multiple discounts strike-through

#### UI/UX Tests (TC-043 to TC-045)
- ✅ TC-043: Strike-through readability
- ✅ TC-044: Discount information display
- ✅ TC-045: Responsive design (desktop, tablet, mobile)

#### Discount Calculation (TC-017 to TC-024)
- ✅ TC-017: Default discount application
- ✅ TC-018: Date range-based discount
- ✅ TC-019: Specific date-based discount
- ✅ TC-020: Dynamic discount rules
- ✅ TC-021: Multiple discount types priority
- ✅ TC-022: Discount percentage validation
- ✅ TC-023: Discount on subtotal only
- ✅ TC-024: Dynamic discount with multiple conditions

#### Integration Tests
- ✅ TC-034: Discount + Markup combined application
- ✅ TC-037: Expired date range discount

---

## 🏗️ Page Object Model

### DiscountRulePage

Located in `tests/pages/DiscountRulePage.ts`

**Methods**:
- `goto()` - Navigate to discount rules page
- `clickCreateNew()` - Click create new rule button
- `createDefaultRule(name, percentage, channel)` - Create default discount rule
- `createDateRangeRule(name, percentage, startDate, endDate, channel)` - Create date range rule
- `createSpecificDateRule(name, percentage, date, channel)` - Create specific date rule
- `setAsDefault()` - Mark rule as default
- `enableStrikeThrough()` - Enable strike-through display
- `disableStrikeThrough()` - Disable strike-through display
- `searchRule(searchTerm)` - Search for a rule
- `getRuleId()` - Get system-generated rule ID
- `verifySuccessMessage()` - Verify success message
- `verifyErrorMessage()` - Verify error message
- `verifyRuleExists(ruleName)` - Verify rule exists in table

### BookingEnginePage

Located in `tests/pages/BookingEnginePage.ts`

**Methods**:
- `goto(engineType)` - Navigate to booking engine (ancillary/cug/b2c)
- `searchProduct(searchTerm)` - Search for a product
- `selectProduct(productName)` - Select a product
- `getDisplayedPrice()` - Get displayed price
- `getOriginalPrice()` - Get original price
- `getDiscountedPrice()` - Get discounted price
- `getStrikeThroughPrices()` - Get all strike-through prices
- `verifyStrikeThroughCase1/2/3/4()` - Verify strike-through display cases
- `verifyDiscountBadge(percentage)` - Verify discount badge
- `verifySavingsAmount(amount)` - Verify savings amount
- `getPriceBreakdown()` - Get full price breakdown
- `verifyDiscountOnSubtotalOnly()` - Verify discount calculation
- `isDiscountApplied()` - Check if discount is applied

---

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

**Key Settings**:
- **Base URL**: `https://admin.rezmatestage.com`
- **Timeout**: 60 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Reporters**: HTML, JSON, JUnit, List
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

**Browsers Configured**:
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit/Safari (Desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Tablet (iPad Pro)

---

## 🔐 Authentication

### Auth Fixture (`tests/fixtures/auth.fixture.ts`)

Provides authenticated page contexts:

```typescript
test('My test', async ({ authenticatedPage }) => {
  // Page is already logged in as admin
});

test('Admin test', async ({ adminPage }) => {
  // Page is logged in as admin user
});

test('CUG test', async ({ cugPage }) => {
  // Page is logged in as CUG user
});

test('Ancillary test', async ({ ancillaryPage }) => {
  // Page is logged in as ancillary user
});
```

---

## 📸 Screenshots and Videos

### Automatic Capture
- Screenshots are automatically taken on test failure
- Videos are recorded for failed tests
- Traces are captured on first retry

### Manual Screenshots
```typescript
await page.screenshot({ path: 'screenshots/my-test.png' });
await page.screenshot({ path: 'screenshots/my-test.png', fullPage: true });
```

### Screenshot Naming Convention
Use descriptive names:
- `TC-001-rule-created.png`
- `TC-025-case1-both-on.png`
- `TC-043-strike-through-styling.png`

---

## 🐛 Debugging

### Debug Mode
```bash
npm run test:debug
```

This opens Playwright Inspector where you can:
- Step through tests
- Inspect elements
- View console logs
- See network requests

### Headed Mode
```bash
npm run test:headed
```

Watch tests run in real browsers.

### Slow Motion
Add to your test:
```typescript
test.use({ launchOptions: { slowMo: 1000 } });
```

### Console Logs
```typescript
page.on('console', msg => console.log(msg.text()));
```

### Network Logs
```typescript
page.on('request', request => console.log('>>', request.method(), request.url()));
page.on('response', response => console.log('<<', response.status(), response.url()));
```

---

## 📋 Best Practices

### 1. Use Page Objects
Always use page objects instead of direct selectors in tests:

```typescript
// ❌ Bad
await page.click('button:has-text("Save")');

// ✅ Good
await discountRulePage.saveButton.click();
```

### 2. Wait for Network Idle
```typescript
await page.waitForLoadState('networkidle');
```

### 3. Use Meaningful Test Names
```typescript
test('TC-001: Should create discount rule with manual name and system-generated ID', async () => {
  // Test code
});
```

### 4. Take Screenshots on Important Steps
```typescript
await page.screenshot({ path: `screenshots/TC-001-step-${stepNumber}.png` });
```

### 5. Use Assertions
```typescript
await expect(element).toBeVisible();
await expect(element).toHaveText('Expected Text');
expect(value).toBe(expectedValue);
```

### 6. Clean Up Test Data
```typescript
test.afterEach(async () => {
  // Delete test rules created during test
});
```

---

## 🔍 Troubleshooting

### Tests Timing Out
- Increase timeout in `playwright.config.ts`
- Check network connectivity
- Verify environment is accessible

### Authentication Failing
- Verify credentials in `.env` file
- Check login selectors in `auth.fixture.ts`
- Verify login URL is correct

### Elements Not Found
- Use Playwright Inspector to find correct selectors
- Add multiple selector options in page objects
- Use `data-testid` attributes when possible

### Screenshots Not Saving
- Ensure `screenshots/` directory exists
- Check file permissions
- Verify path in screenshot command

### Tests Failing on CI
- Check CI environment variables
- Verify browser installation
- Review CI logs for specific errors

---

## 🚦 CI/CD Integration

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
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          ADMIN_USERNAME: ${{ secrets.ADMIN_USERNAME }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📚 Additional Resources

### Playwright Documentation
- [Playwright Docs](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

### Test Plan Reference
- See `TEST_PLAN.md` for detailed test cases
- See `TEST_EXECUTION_CHECKLIST.md` for execution steps
- See `README.md` for project overview

---

## 🤝 Contributing

### Adding New Tests

1. **Create test file** in `tests/` directory
2. **Use auth fixture** for authenticated tests
3. **Use page objects** for element interactions
4. **Follow naming convention**: `feature-name.spec.ts`
5. **Add test case ID** in test name: `TC-XXX:`
6. **Take screenshots** for visual verification
7. **Update this README** with new test coverage

### Adding New Page Objects

1. **Create file** in `tests/pages/` directory
2. **Export class** with descriptive name
3. **Define locators** in constructor
4. **Add helper methods** for common actions
5. **Add verification methods** for assertions
6. **Document methods** with JSDoc comments

---

## 📞 Support

### For Test Issues
**Contact**: Test Lead  
**Email**: [Test Lead Email]

### For Environment Issues
**Contact**: DevOps Team  
**Email**: devops@tripbeast.com

### For Playwright Questions
**Slack**: #playwright-testing  
**Documentation**: https://playwright.dev/

---

## 📊 Test Metrics

### Current Status
- **Total Tests**: 25+
- **Test Coverage**: 30+ test cases
- **Browsers**: 6 configurations
- **Average Execution Time**: ~5 minutes

### Success Criteria
- ✅ All critical tests passing
- ✅ No flaky tests
- ✅ < 5 minute execution time
- ✅ Screenshots captured for all visual tests
- ✅ 100% of TC-025 to TC-030 passing (strike-through)

---

## 🎯 Quick Commands Reference

```bash
# Install
npm install
npx playwright install

# Run tests
npm test                    # All tests
npm run test:headed         # With browser UI
npm run test:debug          # Debug mode
npm run test:ui             # Interactive UI mode

# Specific tests
npx playwright test tests/discount-rule-creation.spec.ts
npx playwright test -g "TC-001"

# Reports
npm run test:report         # View HTML report

# Code generation
npm run test:codegen        # Generate test code
```

---

**Version**: 1.0  
**Last Updated**: January 30, 2026  
**Maintained By**: Test Team
