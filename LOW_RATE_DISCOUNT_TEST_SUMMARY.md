# Low Rate Discount - Test Suite Summary

## Overview
Comprehensive Playwright test suite for the **Low Rate Discount** rule that applies a 2% discount to hotel rates under $100 during April 1-15, 2026.

## Rule Configuration
| Property | Value |
|----------|-------|
| **Rule Name** | Low Rate Discount |
| **Discount Type** | Dynamic |
| **Discount Value** | 2% |
| **Date Range** | April 1, 2026 - April 15, 2026 |
| **Condition** | Rates under $100 |
| **Apply To** | Adjust |

## Test Files Created

### 1. `low-rate-discount.spec.ts` (Basic Test Suite)
Comprehensive test coverage with 20+ individual test cases.

**Test Suites:**
- Main Test Suite: Rates Under $100 (15 tests)
- Edge Cases Suite (3 tests)
- Date Range Validation Suite (2 tests)

**Key Features:**
- Individual test cases for each scenario
- Detailed assertions and validations
- Screenshot capture for documentation
- Console logging for debugging

### 2. `low-rate-discount-enhanced.spec.ts` (Data-Driven Tests)
Advanced data-driven tests using helper functions for maintainability.

**Test Suites:**
- Data-Driven Tests (6 tests)
- Matrix Testing (3 tests)
- Regression Tests (2 tests)

**Key Features:**
- Uses test data helpers
- Parameterized testing
- Matrix testing for comprehensive coverage
- Regression test suite

### 3. `tests/helpers/low-rate-discount-data.ts` (Test Data Helper)
Centralized test data configuration and helper functions.

**Exports:**
- `LOW_RATE_DISCOUNT_CONFIG` - Rule configuration
- `HOTEL_TEST_DATA` - Hotel test data array
- `DATE_TEST_DATA` - Date test data array
- `MULTI_NIGHT_TEST_DATA` - Multi-night stay scenarios
- `BOUNDARY_TEST_CASES` - Boundary test scenarios
- Helper functions for calculations and data filtering

### 4. `RUN_LOW_RATE_DISCOUNT_TESTS.md` (Execution Guide)
Complete guide for running the tests with examples and troubleshooting.

### 5. `run-low-rate-tests.ps1` (PowerShell Script)
Convenient script for running different test suites with options.

## Test Coverage Matrix

### Rate Threshold Testing
| Rate | Within Date Range | Expected Result |
|------|------------------|-----------------|
| $5 | ✓ | 2% discount applied |
| $25 | ✓ | 2% discount applied |
| $50 | ✓ | 2% discount applied |
| $75 | ✓ | 2% discount applied |
| $99 | ✓ | 2% discount applied |
| $99.99 | ✓ | 2% discount applied |
| $100 | ✓ | NO discount (at threshold) |
| $150 | ✓ | NO discount (above threshold) |
| $200 | ✓ | NO discount (above threshold) |
| $250 | ✓ | NO discount (above threshold) |
| $300 | ✓ | NO discount (above threshold) |

### Date Range Testing
| Date | Rate Under $100 | Expected Result |
|------|----------------|-----------------|
| March 31, 2026 | ✓ | NO discount (before range) |
| April 1, 2026 | ✓ | 2% discount applied (first day) |
| April 5, 2026 | ✓ | 2% discount applied |
| April 10, 2026 | ✓ | 2% discount applied |
| April 15, 2026 | ✓ | 2% discount applied (last day) |
| April 16, 2026 | ✓ | NO discount (after range) |

### Combined Scenarios Matrix
| Rate | Date | Expected Result |
|------|------|-----------------|
| Under $100 | Within Range | ✓ Discount Applied |
| Under $100 | Before Range | ✗ No Discount |
| Under $100 | After Range | ✗ No Discount |
| At/Above $100 | Within Range | ✗ No Discount |
| At/Above $100 | Before Range | ✗ No Discount |
| At/Above $100 | After Range | ✗ No Discount |

## Test Execution Examples

### Quick Start
```powershell
# Run all tests
.\run-low-rate-tests.ps1

# Run basic tests only
.\run-low-rate-tests.ps1 basic

# Run with browser visible
.\run-low-rate-tests.ps1 -Headed

# Run in debug mode
.\run-low-rate-tests.ps1 -Debug

# Run specific browser
.\run-low-rate-tests.ps1 -Browser chromium
```

### Using NPM Scripts
```powershell
# Run all LOS tests
npx playwright test low-rate-discount

# Run with UI mode
npx playwright test low-rate-discount --ui

# Run specific test
npx playwright test low-rate-discount -g "rate of \$50"

# View report
npx playwright show-report
```

## Test Scenarios Covered

### ✅ Positive Test Cases (Discount Applied)
1. Rate $50 within date range
2. Rate $75 within date range
3. Rate $99 within date range (edge case)
4. Rate $99.99 within date range (boundary)
5. Very low rates (under $10)
6. First day of discount period (April 1)
7. Last day of discount period (April 15)
8. Mid-range dates (April 5, 10, 12)
9. Multi-night stays with rates under $100
10. Various rates under threshold ($25, $50, $75, $99)

### ❌ Negative Test Cases (No Discount)
1. Rate $100 (exactly at threshold)
2. Rate $150 (above threshold)
3. Rate $250 (well above threshold)
4. Rates under $100 before date range (March 31)
5. Rates under $100 after date range (April 16)
6. Multi-night stays with rates at/above $100
7. High-value rates ($200, $300, $500, $1000)

### 🔍 Edge Cases & Boundary Testing
1. $99.99 vs $100.00 comparison
2. $100.00 vs $100.01 comparison
3. Very low rates (under $10)
4. First day vs day before (March 31 vs April 1)
5. Last day vs day after (April 15 vs April 16)
6. Decimal rate calculations
7. Multi-night stay calculations
8. Strike-through price display

### 🔄 Regression Testing
1. High-value bookings remain unaffected
2. Discount calculation precision (2 decimal places)
3. Consistent discount application across date range
4. No interference with other discount rules
5. Proper UI display (strike-through pricing)

## Expected Calculation Examples

### Single Night - Rate Under $100
```
Original Rate: $50.00
Discount: 2% of $50.00 = $1.00
Final Rate: $49.00
Display: ~~$50.00~~ $49.00
```

### Single Night - Rate At Threshold
```
Original Rate: $100.00
Discount: None (at threshold)
Final Rate: $100.00
Display: $100.00
```

### Multi-Night - Rate Under $100
```
Rate: $50.00/night
Nights: 3
Subtotal: $150.00
Discount: 2% of $150.00 = $3.00
Final: $147.00
```

### Boundary Case
```
Original Rate: $99.99
Discount: 2% of $99.99 = $2.00
Final Rate: $97.99
Display: ~~$99.99~~ $97.99
```

## Validation Points

Each test validates:
1. ✅ **Discount Application** - Is discount applied when expected?
2. ✅ **Discount Percentage** - Is it exactly 2%?
3. ✅ **Price Calculation** - Are prices calculated correctly?
4. ✅ **UI Display** - Is strike-through shown properly?
5. ✅ **Date Range** - Is discount only active April 1-15?
6. ✅ **Rate Threshold** - Is discount only for rates under $100?
7. ✅ **Decimal Precision** - Are amounts rounded to 2 decimal places?

## Screenshots Generated

All tests generate screenshots for documentation:
- `low-rate-discount-rate-50-applied.png`
- `low-rate-discount-rate-75-applied.png`
- `low-rate-discount-rate-99-applied.png`
- `low-rate-discount-rate-99-99-applied.png`
- `low-rate-discount-rate-100-not-applied.png`
- `low-rate-discount-rate-150-not-applied.png`
- `low-rate-discount-rate-250-not-applied.png`
- `low-rate-discount-before-date-range.png`
- `low-rate-discount-first-day.png`
- `low-rate-discount-last-day.png`
- `low-rate-discount-after-date-range.png`
- `low-rate-discount-multi-night-under-100.png`
- `low-rate-discount-multi-night-over-100.png`
- `low-rate-discount-boundary-test.png`
- `low-rate-discount-strike-through.png`
- And more...

## Test Results Artifacts

After running tests, you'll find:
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`
- **Screenshots**: `screenshots/*.png`
- **Videos** (on failure): `test-results/*.webm`
- **Traces** (on failure): `test-results/*.zip`

## Maintenance & Updates

### Updating Test Data
To modify test data, edit `tests/helpers/low-rate-discount-data.ts`:

```typescript
// Update discount configuration
export const LOW_RATE_DISCOUNT_CONFIG = {
  discountPercentage: 2, // Change discount %
  startDate: '2026-04-01', // Change start date
  endDate: '2026-04-15', // Change end date
  rateThreshold: 100, // Change rate threshold
};

// Update hotel test data
export const HOTEL_TEST_DATA: HotelTestData[] = [
  {
    hotelId: 'your-actual-hotel-id', // Update with real hotel IDs
    rate: 50,
    shouldGetDiscount: true,
    description: 'Budget hotel - $50/night',
  },
  // ... more hotels
];
```

### Adding New Test Cases
To add new test cases:

1. **Add to basic suite** (`low-rate-discount.spec.ts`):
```typescript
test('Should handle new scenario', async ({ cugPage }) => {
  // Your test logic
});
```

2. **Add to data helper** (`low-rate-discount-data.ts`):
```typescript
export const NEW_TEST_DATA = [
  // Your test data
];
```

3. **Add to enhanced suite** (`low-rate-discount-enhanced.spec.ts`):
```typescript
test('Should handle new data-driven scenario', async ({ cugPage }) => {
  const testData = NEW_TEST_DATA;
  // Your test logic
});
```

## Troubleshooting

### Common Issues

**Issue**: JWT Token Expired
```
Solution: Update JWT_TOKEN in .env file
```

**Issue**: Hotel IDs Not Found
```
Solution: Replace test hotel IDs with actual hotel IDs from your system
```

**Issue**: Tests Timing Out
```
Solution: Increase timeout in playwright.config.ts or add more wait time
```

**Issue**: Discount Not Detected
```
Solution: 
1. Verify rule is active in admin panel
2. Check date range matches
3. Confirm rate threshold is correct
4. Ensure "Apply To" is set to "Adjust"
```

**Issue**: Price Calculation Mismatch
```
Solution: Check for:
- Additional taxes/fees
- Other discount rules
- Currency conversion
- Rounding differences
```

## CI/CD Integration

### Recommended Schedule
- **Daily**: Run full test suite
- **Before discount period**: Run all tests
- **First day of period**: Run validation tests
- **Last day of period**: Run validation tests
- **After period ends**: Verify deactivation

### GitHub Actions Example
```yaml
- name: Run Low Rate Discount Tests
  run: npx playwright test low-rate-discount
  env:
    JWT_TOKEN: ${{ secrets.JWT_TOKEN }}
```

## Performance Metrics

### Test Execution Time (Estimated)
- **Basic Suite**: ~5-10 minutes (20 tests)
- **Enhanced Suite**: ~3-7 minutes (11 tests)
- **Full Suite**: ~8-17 minutes (31 tests)

*Times vary based on network speed and system performance*

### Resource Requirements
- **Browser**: Chromium, Firefox, or WebKit
- **Memory**: ~500MB per browser instance
- **Disk**: ~100MB for test artifacts
- **Network**: Stable internet connection required

## Best Practices

1. ✅ Run tests before discount period starts
2. ✅ Run tests on first and last day of period
3. ✅ Monitor test results daily during discount period
4. ✅ Update hotel IDs with real data
5. ✅ Review screenshots for visual verification
6. ✅ Keep test data helper updated
7. ✅ Archive test results for compliance
8. ✅ Investigate failures immediately
9. ✅ Update tests when rule changes
10. ✅ Document any test modifications

## Success Criteria

Tests are considered successful when:
- ✅ All tests pass (green)
- ✅ Discount applied correctly to rates under $100
- ✅ No discount applied to rates at/above $100
- ✅ Discount only active within date range
- ✅ Calculations accurate to 2 decimal places
- ✅ UI displays strike-through pricing correctly
- ✅ No false positives or false negatives
- ✅ Screenshots show expected behavior

## Support & Documentation

- **Main Guide**: `RUN_LOW_RATE_DISCOUNT_TESTS.md`
- **Test Plan**: `TEST_PLAN.md`
- **Playwright Guide**: `PLAYWRIGHT_TESTING_GUIDE.md`
- **Quick Start**: `QUICK_START_TESTING.md`

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Test Files** | 2 (basic + enhanced) |
| **Total Test Cases** | 31+ |
| **Test Suites** | 8 |
| **Rate Scenarios** | 11 |
| **Date Scenarios** | 10 |
| **Boundary Cases** | 5 |
| **Multi-Night Tests** | 6 |
| **Matrix Tests** | 3 |
| **Regression Tests** | 2 |
| **Helper Functions** | 15+ |
| **Screenshots** | 20+ |

---

**Created**: January 29, 2026  
**Rule Period**: April 1-15, 2026  
**Discount**: 2% on rates under $100  
**Status**: Ready for execution ✅


