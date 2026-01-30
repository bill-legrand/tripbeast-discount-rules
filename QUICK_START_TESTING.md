# Quick Start Guide - Running Discount Rules Tests

## Prerequisites

✅ Node.js and npm installed  
✅ Playwright installed (`npm install`)  
✅ Playwright browsers installed (`npx playwright install chromium`)  
✅ Valid login credentials  

## Quick Test Execution

### 1. Run Quick Login Test (Verify Setup)

```powershell
.\run-tests.ps1 -Headed
```

This will:
- Open a browser window
- Log in to the admin panel
- Navigate to the customer page
- Display the page for 5 seconds

### 2. Run Specific Test Suites

#### Discount Rule Creation Tests
```powershell
.\run-tests.ps1 -TestFile "tests/discount-rule-creation.spec.ts" -Headed
```

#### Discount Calculation Tests
```powershell
.\run-tests.ps1 -TestFile "tests/discount-calculation.spec.ts" -Headed
```

#### Strike-Through Display Tests
```powershell
.\run-tests.ps1 -TestFile "tests/strike-through-display.spec.ts" -Headed
```

#### Day of Week Discount Tests
```powershell
.\run-tests.ps1 -DOWTests -Headed
```

### 3. Run Specific Test by Name

```powershell
.\run-tests.ps1 -TestName "TC-001" -Headed
```

### 4. Run All Tests

```powershell
.\run-tests.ps1 -AllTests
```

### 5. Open Playwright UI Mode (Interactive)

```powershell
.\run-tests.ps1 -UI
```

This opens an interactive UI where you can:
- See all test files
- Run tests one by one
- Watch tests execute in real-time
- Debug failures
- View test traces

### 6. Debug Mode

```powershell
.\run-tests.ps1 -TestFile "tests/discount-rule-creation.spec.ts" -Debug
```

## Test Execution Options

| Option | Description | Example |
|--------|-------------|---------|
| `-TestFile` | Run specific test file | `-TestFile "tests/discount-rule-creation.spec.ts"` |
| `-TestName` | Run tests matching name | `-TestName "TC-001"` |
| `-Headed` | Show browser window | `-Headed` |
| `-Debug` | Debug mode with inspector | `-Debug` |
| `-UI` | Open Playwright UI | `-UI` |
| `-Browser` | Choose browser | `-Browser firefox` |
| `-AllTests` | Run all test suites | `-AllTests` |
| `-DOWTests` | Run Day of Week discount tests | `-DOWTests` |

## Manual Test Execution (Without Script)

### Run with environment variables:

```powershell
$env:ADMIN_USERNAME="bill.legrand@gmail.com"
$env:ADMIN_PASSWORD="@fHRnam2Au7VYsS"
npx playwright test tests/quick-login-test.spec.ts --headed --project=chromium
```

### Run all tests:

```powershell
npx playwright test
```

### Run specific test file:

```powershell
npx playwright test tests/discount-rule-creation.spec.ts
```

### Run tests in UI mode:

```powershell
npx playwright test --ui
```

### Run tests in debug mode:

```powershell
npx playwright test --debug
```

### Run tests in headed mode (see browser):

```powershell
npx playwright test --headed
```

## Test File Structure

```
tests/
├── discount-rule-creation.spec.ts    # TC-001 to TC-005, TC-036
├── discount-calculation.spec.ts      # TC-017 to TC-024, TC-034
├── strike-through-display.spec.ts    # TC-025 to TC-030, TC-043 to TC-045
├── customer-discount-test.spec.ts    # Customer discount management
├── dow-discount-verification.spec.ts # Day of Week discount tests
├── quick-login-test.spec.ts          # Quick verification test
├── fixtures/
│   └── auth.fixture.ts               # Authentication helper
├── pages/
│   ├── DiscountRulePage.ts           # Page Object for Discount Rules
│   ├── BookingEnginePage.ts          # Page Object for Booking Engine
│   └── CustomerDiscountPage.ts       # Page Object for Customer Discounts
└── helpers/
    └── dow-discount-data.ts          # DOW discount test data
```

## Test Categories

### ✅ Implemented Tests

1. **Discount Rule Creation** (TC-001 to TC-005)
   - Create rule with manual name
   - System-generated ID verification
   - Special characters handling
   - Empty name validation
   - Duplicate name handling

2. **Discount Calculation** (TC-017 to TC-024)
   - Default discount application
   - Date range-based discounts
   - Specific date discounts
   - Dynamic discount rules
   - Subtotal-only calculation
   - Multiple discount priority

3. **Strike-Through Display** (TC-025 to TC-030)
   - Case 1: Both strike-throughs ON
   - Case 2: Hotel OFF, Discount ON
   - Case 3: Hotel ON, Discount strike-through OFF
   - Case 4: Both OFF
   - Toggle functionality
   - Multiple discounts display

4. **Customer Discount Management**
   - Navigate to customer discounts
   - Add date range discounts
   - Add default discounts
   - Configure by platform/channel
   - Product-specific discounts (Hotels, Flights, Cars, Activities)

5. **Day of Week Discount Verification** (NEW!)
   - Monday: 15% discount
   - Tuesday: 20% discount
   - Wednesday: 25% discount
   - Thursday: 30% discount
   - Friday: 35% discount
   - Saturday: 40% discount (highest)
   - Sunday: 10% discount (lowest)
   - Edge cases (before/after range)
   - Price breakdown verification

6. **Negative Tests** (TC-036, TC-037)
   - Invalid percentage input
   - Expired date range discounts
   - Percentage > 100%
   - Negative percentages

7. **UI/UX Tests** (TC-043 to TC-045)
   - Strike-through readability
   - Discount information display
   - Responsive design testing

### 📋 To Be Implemented

- JWT Token Integration (TC-006 to TC-010)
- Channel Configuration (TC-011 to TC-016)
- Upload User Functionality (TC-031 to TC-032)
- Integration Tests (TC-033 to TC-035)
- Performance Tests (TC-041 to TC-042)
- Security Tests (TC-046 to TC-049)
- Regression Tests (TC-050)

## Understanding Test Results

### ✅ Passed Test
```
✓ TC-001: Should create discount rule with manual name (2.5s)
```

### ❌ Failed Test
```
✗ TC-001: Should create discount rule with manual name (2.5s)
  Error: Expected "DR-12345" but got "undefined"
```

### Test Artifacts

After test execution, check these folders:

- `test-results/` - Screenshots, videos, traces
- `screenshots/` - Test-specific screenshots
- `playwright-report/` - HTML test report

### View HTML Report

```powershell
npx playwright show-report
```

## Troubleshooting

### Issue: Tests fail with "Cannot find module"
**Solution**: Run `npm install`

### Issue: Browser not found
**Solution**: Run `npx playwright install chromium`

### Issue: Login fails
**Solution**: Verify credentials in `run-tests.ps1` or set environment variables

### Issue: Tests timeout
**Solution**: Increase timeout in `playwright.config.ts` or check network connection

### Issue: Strike-through not visible
**Solution**: Ensure test data includes products with strike-through pricing

## Best Practices

1. **Run tests in headed mode first** to see what's happening
2. **Use UI mode** for debugging and exploring tests
3. **Check screenshots** in `test-results/` folder after failures
4. **Run specific tests** during development, full suite before commit
5. **Clear test data** between runs if tests modify database
6. **Use debug mode** to step through test execution
7. **Check console logs** for API errors or warnings

## Test Data Requirements

### For Discount Rule Creation Tests:
- Access to discount rule management page
- Permission to create/edit rules
- Valid channel IDs

### For Discount Calculation Tests:
- Test products with known prices
- Configured discount rules
- Access to CUG/Ancillary booking engines

### For Strike-Through Tests:
- Products with supplier strike-through (e.g., Expedia hotels)
- Discount rules with strike-through toggle
- Access to booking engine frontend

## Next Steps

1. ✅ Run quick login test to verify setup
2. ✅ Run discount rule creation tests
3. ✅ Run discount calculation tests
4. ✅ Run strike-through display tests
5. ⏳ Implement JWT token integration tests
6. ⏳ Implement channel configuration tests
7. ⏳ Implement remaining test categories

## Support

For issues or questions:
- Check `TEST_PLAN.md` for detailed test case descriptions
- Review `README.md` for feature documentation
- Check Playwright documentation: https://playwright.dev

## Quick Commands Reference

```powershell
# Quick verification
.\run-tests.ps1 -Headed

# Run specific suite
.\run-tests.ps1 -TestFile "tests/discount-rule-creation.spec.ts" -Headed

# Run Day of Week discount tests
.\run-tests.ps1 -DOWTests -Headed

# Interactive mode
.\run-tests.ps1 -UI

# Debug specific test
.\run-tests.ps1 -TestName "TC-001" -Debug

# Run all tests (headless)
.\run-tests.ps1 -AllTests

# View test report
npx playwright show-report
```

---

**Happy Testing! 🎭**
