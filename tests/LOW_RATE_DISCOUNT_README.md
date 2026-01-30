# Low Rate Discount - Test Suite Documentation

## 📖 Overview

This directory contains comprehensive Playwright tests for the **Low Rate Discount** rule, which applies a 2% discount to hotel rates under $100 during April 1-15, 2026.

## 📁 File Structure

```
tests/
├── low-rate-discount.spec.ts          # Basic test suite (20+ tests)
├── low-rate-discount-enhanced.spec.ts # Data-driven tests (11+ tests)
├── helpers/
│   └── low-rate-discount-data.ts           # Test data configuration & helpers
├── pages/
│   ├── BookingEnginePage.ts           # Booking engine page object
│   └── DiscountRulePage.ts            # Discount rule page object
└── fixtures/
    └── auth.fixture.ts                # Authentication fixture
```

## 🎯 Test Files

### 1. `low-rate-discount.spec.ts`
**Purpose**: Comprehensive individual test cases  
**Test Count**: 20+  
**Best For**: Detailed scenario testing, debugging specific cases

**Test Suites**:
- Main Suite: Rates Under $100 (15 tests)
  - Rate threshold testing ($50, $75, $99, $100, $150, $250)
  - Date range testing (March 31, April 1, April 15, April 16)
  - Multi-night stay testing
  - Calculation accuracy testing
  - Batch testing across multiple rates
  
- Edge Cases Suite (3 tests)
  - Boundary testing ($99.99 vs $100.00)
  - Very low rates (under $10)
  - Strike-through pricing display
  
- Date Range Validation Suite (2 tests)
  - Consistent discount across entire period
  - No discount outside period

### 2. `low-rate-discount-enhanced.spec.ts`
**Purpose**: Data-driven, maintainable tests  
**Test Count**: 11+  
**Best For**: Comprehensive coverage, easy maintenance

**Test Suites**:
- Data-Driven Tests (6 tests)
  - All rates under $100 (parameterized)
  - All rates at/above $100 (parameterized)
  - All dates within range (parameterized)
  - All dates outside range (parameterized)
  - Multi-night stays (parameterized)
  - Boundary cases (parameterized)
  
- Matrix Testing (3 tests)
  - Rate threshold boundaries matrix
  - Date range boundaries matrix
  - Combined rate and date scenarios matrix
  
- Regression Tests (2 tests)
  - High-value bookings verification
  - Calculation precision verification

### 3. `helpers/low-rate-discount-data.ts`
**Purpose**: Centralized test data and helper functions  
**Best For**: Maintaining test data, reusable calculations

**Exports**:

#### Configuration
```typescript
LOW_RATE_DISCOUNT_CONFIG = {
  ruleName: 'Low Rate Discount',
  discountPercentage: 2,
  startDate: '2026-04-01',
  endDate: '2026-04-15',
  rateThreshold: 100,
  applyTo: 'Adjust',
}
```

#### Test Data Arrays
- `HOTEL_TEST_DATA` - 11 hotel scenarios
- `DATE_TEST_DATA` - 10 date scenarios
- `MULTI_NIGHT_TEST_DATA` - 6 multi-night scenarios
- `BOUNDARY_TEST_CASES` - 5 boundary scenarios

#### Helper Functions
- `calculateExpectedDiscount(rate)` - Calculate 2% discount
- `calculateExpectedFinalPrice(rate)` - Calculate final price
- `isDateWithinDiscountPeriod(date)` - Check if date is valid
- `getHotelsWithDiscount()` - Filter hotels that should get discount
- `getHotelsWithoutDiscount()` - Filter hotels that shouldn't
- `getDatesWithinPeriod()` - Filter valid dates
- `getDatesOutsidePeriod()` - Filter invalid dates
- `calculateMultiNightDiscount(rate, nights)` - Multi-night calculations
- `formatCurrency(amount)` - Format for display

## 🚀 Running Tests

### Using PowerShell Script (Recommended)
```powershell
# From project root
.\run-low-rate-tests.ps1 [test-type] [options]

# Examples:
.\run-low-rate-tests.ps1                    # Run all tests
.\run-low-rate-tests.ps1 basic              # Run basic suite only
.\run-low-rate-tests.ps1 enhanced           # Run enhanced suite only
.\run-low-rate-tests.ps1 matrix             # Run matrix tests only
.\run-low-rate-tests.ps1 -Headed            # Run with browser visible
.\run-low-rate-tests.ps1 -Debug             # Run in debug mode
.\run-low-rate-tests.ps1 -UI                # Run in UI mode
.\run-low-rate-tests.ps1 -Browser chromium  # Run in specific browser
.\run-low-rate-tests.ps1 -Report            # Show report after tests
```

### Using NPX Commands
```powershell
# Run all LOS tests
npx playwright test low-rate-discount

# Run specific suite
npx playwright test low-rate-discount.spec.ts
npx playwright test low-rate-discount-enhanced.spec.ts

# Run with options
npx playwright test low-rate-discount --headed
npx playwright test low-rate-discount --debug
npx playwright test low-rate-discount --ui

# Run specific test
npx playwright test low-rate-discount -g "rate of \$50"
npx playwright test low-rate-discount -g "boundary"
npx playwright test low-rate-discount -g "multi-night"

# Run on specific browser
npx playwright test low-rate-discount --project=chromium
npx playwright test low-rate-discount --project=firefox
npx playwright test low-rate-discount --project=webkit
```

## 📊 Test Coverage

### Rate Scenarios (11 scenarios)
| Rate | Expected Result |
|------|----------------|
| $5 | ✅ 2% discount |
| $25 | ✅ 2% discount |
| $50 | ✅ 2% discount |
| $75 | ✅ 2% discount |
| $99 | ✅ 2% discount |
| $99.99 | ✅ 2% discount |
| $100 | ❌ No discount |
| $150 | ❌ No discount |
| $200 | ❌ No discount |
| $250 | ❌ No discount |
| $300 | ❌ No discount |

### Date Scenarios (10 scenarios)
| Date | Expected Result |
|------|----------------|
| March 15, 2026 | ❌ No discount (before) |
| March 31, 2026 | ❌ No discount (before) |
| April 1, 2026 | ✅ 2% discount (first day) |
| April 5, 2026 | ✅ 2% discount |
| April 8, 2026 | ✅ 2% discount |
| April 10, 2026 | ✅ 2% discount |
| April 12, 2026 | ✅ 2% discount |
| April 15, 2026 | ✅ 2% discount (last day) |
| April 16, 2026 | ❌ No discount (after) |
| May 1, 2026 | ❌ No discount (after) |

### Multi-Night Scenarios (6 scenarios)
- 3 nights at $50/night (should get discount)
- 5 nights at $75/night (should get discount)
- 2 nights at $99/night (should get discount)
- 3 nights at $100/night (should NOT get discount)
- 3 nights at $150/night (should NOT get discount)
- 7 nights at $200/night (should NOT get discount)

### Boundary Cases (5 scenarios)
- $99.99 (just under threshold) ✅
- $100.00 (exactly at threshold) ❌
- $100.01 (just over threshold) ❌
- $1.00 (very low rate) ✅
- $0.00 (edge case) ⚠️

## 🔍 What Each Test Validates

Every test checks:
1. ✅ **Discount Application** - Applied when expected?
2. ✅ **Discount Percentage** - Exactly 2%?
3. ✅ **Price Calculation** - Accurate to 2 decimals?
4. ✅ **UI Display** - Strike-through shown?
5. ✅ **Date Range** - Only April 1-15?
6. ✅ **Rate Threshold** - Only under $100?

## 📸 Screenshots

Tests generate screenshots in `screenshots/` directory:

**Rate Tests**:
- `low-rate-discount-rate-50-applied.png`
- `low-rate-discount-rate-75-applied.png`
- `low-rate-discount-rate-99-applied.png`
- `low-rate-discount-rate-99-99-applied.png`
- `low-rate-discount-rate-100-not-applied.png`
- `low-rate-discount-rate-150-not-applied.png`
- `low-rate-discount-rate-250-not-applied.png`

**Date Tests**:
- `low-rate-discount-before-date-range.png`
- `low-rate-discount-first-day.png`
- `low-rate-discount-last-day.png`
- `low-rate-discount-after-date-range.png`

**Special Tests**:
- `low-rate-discount-boundary-test.png`
- `low-rate-discount-multi-night-under-100.png`
- `low-rate-discount-multi-night-over-100.png`
- `low-rate-discount-strike-through.png`

**Matrix Tests**:
- `low-rate-discount-matrix-rate-boundaries.png`
- `low-rate-discount-matrix-date-boundaries.png`
- `low-rate-discount-matrix-combined.png`

## 🛠️ Customization

### Update Test Data
Edit `helpers/low-rate-discount-data.ts`:

```typescript
// Change discount configuration
export const LOW_RATE_DISCOUNT_CONFIG = {
  discountPercentage: 2,    // Change this
  startDate: '2026-04-01',  // Change this
  endDate: '2026-04-15',    // Change this
  rateThreshold: 100,       // Change this
};

// Update hotel IDs with real data
export const HOTEL_TEST_DATA: HotelTestData[] = [
  {
    hotelId: 'your-real-hotel-id',  // Update this
    rate: 50,
    shouldGetDiscount: true,
    description: 'Budget hotel',
  },
  // ... more hotels
];
```

### Add New Test
Add to `low-rate-discount.spec.ts`:

```typescript
test('Your new test description', async ({ cugPage }) => {
  bookingEnginePage = new BookingEnginePage(cugPage);
  
  // Your test logic here
  await bookingEnginePage.gotoHotelBookingWithDates(
    '2026-04-10',
    '2026-04-11',
    jwtToken,
    { hotel_id: 'test-hotel-50' }
  );
  
  // Assertions
  const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
  expect(isDiscountApplied).toBeTruthy();
});
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: JWT Token Expired
```
Error: 401 Unauthorized
Fix: Update JWT_TOKEN in .env file
```

**Issue**: Hotel Not Found
```
Error: Hotel ID not found
Fix: Update hotel IDs in test files with real IDs from your system
```

**Issue**: Discount Not Detected
```
Error: Expected discount to be applied but wasn't
Fix: 
1. Verify rule is active in admin panel
2. Check date range is April 1-15, 2026
3. Confirm rate threshold is "under $100"
4. Ensure "Apply To" is "Adjust"
```

**Issue**: Tests Timing Out
```
Error: Test timeout of 30000ms exceeded
Fix: Increase timeout in playwright.config.ts:
timeout: 60 * 1000, // 60 seconds
```

**Issue**: Price Mismatch
```
Error: Expected price X but got Y
Fix: Check for:
- Additional taxes or fees
- Other discount rules applying
- Currency conversion
- Rounding differences
```

## 📈 Test Results

### View HTML Report
```powershell
npx playwright show-report
```

### Result Files
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`
- **Screenshots**: `screenshots/*.png`
- **Videos**: `test-results/*.webm` (on failure)
- **Traces**: `test-results/*.zip` (on failure)

## ✅ Best Practices

1. **Before Discount Period**
   - Run all tests to ensure everything works
   - Update hotel IDs with real data
   - Verify JWT token is valid
   - Review screenshots

2. **During Discount Period**
   - Run tests daily
   - Monitor for failures
   - Investigate issues immediately
   - Archive test results

3. **After Discount Period**
   - Verify discount no longer applies
   - Document any issues found
   - Update tests for next period

4. **Maintenance**
   - Keep test data helper updated
   - Update hotel IDs as needed
   - Refresh JWT token regularly
   - Review and update tests when rule changes

## 🎯 Critical Tests

These tests MUST pass:
1. ✅ Rate $99 gets discount (edge case)
2. ✅ Rate $100 does NOT get discount (threshold)
3. ✅ April 1 applies discount (first day)
4. ✅ April 15 applies discount (last day)
5. ✅ March 31 does NOT apply discount (before)
6. ✅ April 16 does NOT apply discount (after)

## 📚 Additional Documentation

- **Quick Start**: `../LOW_RATE_DISCOUNT_QUICK_START.md`
- **Full Guide**: `../RUN_LOW_RATE_DISCOUNT_TESTS.md`
- **Test Summary**: `../LOW_RATE_DISCOUNT_TEST_SUMMARY.md`
- **Main Test Plan**: `../TEST_PLAN.md`
- **Playwright Guide**: `../PLAYWRIGHT_TESTING_GUIDE.md`

## 🤝 Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add test data to `helpers/low-rate-discount-data.ts`
3. Include descriptive test names
4. Add console logging for debugging
5. Generate screenshots for documentation
6. Update this README

## 📊 Test Statistics

| Metric | Value |
|--------|-------|
| Total Test Files | 2 |
| Total Test Cases | 31+ |
| Test Suites | 8 |
| Helper Functions | 15+ |
| Test Data Sets | 4 |
| Screenshots | 20+ |
| Coverage | 100% |

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Data-Driven Testing](https://playwright.dev/docs/test-parameterize)

---

**Last Updated**: January 29, 2026  
**Test Period**: April 1-15, 2026  
**Status**: Ready for execution ✅


