# Low Rate Discount Tests - Execution Guide

## Overview
This guide covers the execution of Playwright tests for the **Low Rate Discount** rule that applies a 2% discount to rates under $100 during the period of April 1-15, 2026.

## Test Rule Details
- **Rule Name**: Low Rate Discount
- **Discount**: 2%
- **Date Range**: April 1, 2026 - April 15, 2026
- **Condition**: Apply only to rates under $100
- **Apply To**: Adjust

## Prerequisites

### 1. Environment Setup
Ensure you have the following environment variables configured in your `.env` file:

```env
# JWT Token for booking engine authentication
JWT_TOKEN=your_jwt_token_here

# User credentials (if needed)
CUG_USERNAME=your_cug_username
CUG_PASSWORD=your_cug_password

# Booking engine URL
CUG_BE_URL=https://bookings.tripbeast.com
```

### 2. Test Data Requirements
The tests require hotels with specific rate configurations:

| Hotel ID | Nightly Rate | Expected Behavior |
|----------|-------------|-------------------|
| test-hotel-5 | $5 | Discount applied (2%) |
| test-hotel-25 | $25 | Discount applied (2%) |
| test-hotel-50 | $50 | Discount applied (2%) |
| test-hotel-75 | $75 | Discount applied (2%) |
| test-hotel-99 | $99 | Discount applied (2%) |
| test-hotel-99-99 | $99.99 | Discount applied (2%) |
| test-hotel-100 | $100 | NO discount (at threshold) |
| test-hotel-150 | $150 | NO discount (above threshold) |
| test-hotel-200 | $200 | NO discount (above threshold) |
| test-hotel-250 | $250 | NO discount (above threshold) |
| test-hotel-300 | $300 | NO discount (above threshold) |

**Note**: Replace these hotel IDs with actual hotel IDs from your system that match the rate requirements.

### 3. Install Dependencies
```powershell
npm install
```

## Running the Tests

### Run All Low Rate Discount Tests
```powershell
npx playwright test low-rate-discount.spec.ts
```

### Run Tests in Headed Mode (See Browser)
```powershell
npx playwright test low-rate-discount.spec.ts --headed
```

### Run Tests in UI Mode (Interactive)
```powershell
npx playwright test low-rate-discount.spec.ts --ui
```

### Run Tests in Debug Mode
```powershell
npx playwright test low-rate-discount.spec.ts --debug
```

### Run Specific Test Suite
```powershell
# Run only the main discount tests
npx playwright test low-rate-discount.spec.ts -g "Low Rate Discount - Rates Under \$100"

# Run only edge case tests
npx playwright test low-rate-discount.spec.ts -g "Edge Cases"

# Run only date range validation tests
npx playwright test low-rate-discount.spec.ts -g "Date Range Validation"
```

### Run Specific Test Case
```powershell
# Test rate of $50
npx playwright test low-rate-discount.spec.ts -g "rate of \$50"

# Test boundary case
npx playwright test low-rate-discount.spec.ts -g "boundary case"

# Test multi-night stay
npx playwright test low-rate-discount.spec.ts -g "multi-night"
```

### Run Tests on Specific Browser
```powershell
# Chrome only
npx playwright test low-rate-discount.spec.ts --project=chromium

# Firefox only
npx playwright test low-rate-discount.spec.ts --project=firefox

# Safari only
npx playwright test low-rate-discount.spec.ts --project=webkit
```

## Test Coverage

### Main Test Suite (20 Test Cases)

#### Rate Threshold Testing (6 tests)
1. ✅ Rate $50 - Discount applied
2. ✅ Rate $75 - Discount applied
3. ✅ Rate $99 - Discount applied (edge case)
4. ✅ Rate $100 - NO discount (at threshold)
5. ✅ Rate $150 - NO discount (above threshold)
6. ✅ Rate $250 - NO discount (well above threshold)

#### Date Range Testing (6 tests)
7. ✅ March 31 - NO discount (before range)
8. ✅ April 1 - Discount applied (first day)
9. ✅ April 15 - Discount applied (last day)
10. ✅ April 16 - NO discount (after range)
11. ✅ Multiple dates within range - Consistent discount
12. ✅ Multiple dates outside range - No discount

#### Multi-Night Stay Testing (2 tests)
13. ✅ 3-night stay at $50/night - Discount applied
14. ✅ 3-night stay at $150/night - NO discount

#### Calculation Accuracy (2 tests)
15. ✅ Rate $99.99 - Exact 2% calculation
16. ✅ Multiple rate points - Correct discount calculation

#### Batch Testing (2 tests)
17. ✅ Various rates under $100 - All get discount
18. ✅ Various rates over $100 - None get discount

### Edge Cases Suite (3 tests)
19. ✅ Boundary test: $99.99 vs $100.00
20. ✅ Very low rates (under $10)
21. ✅ Strike-through pricing display

## Expected Results

### Rates Under $100 (Within Date Range)
- **Original Rate**: $50.00
- **Discount**: $1.00 (2%)
- **Final Rate**: $49.00
- **Display**: ~~$50.00~~ $49.00

### Rates At or Above $100 (Within Date Range)
- **Original Rate**: $100.00
- **Discount**: None
- **Final Rate**: $100.00
- **Display**: $100.00 (no strike-through)

### Any Rate Outside Date Range
- **Discount**: None
- **Display**: Original rate (no strike-through)

## Viewing Test Results

### HTML Report
After test execution, view the HTML report:
```powershell
npx playwright show-report
```

### Screenshots
Test screenshots are saved in the `screenshots/` directory:
- `low-rate-discount-rate-50-applied.png`
- `low-rate-discount-rate-99-applied.png`
- `low-rate-discount-rate-100-not-applied.png`
- `low-rate-discount-boundary-test.png`
- And more...

### Test Results Files
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`

## Troubleshooting

### Issue: JWT Token Expired
**Solution**: Update the `JWT_TOKEN` in your `.env` file with a fresh token.

### Issue: Hotel IDs Not Found
**Solution**: Update the hotel IDs in the test file to match actual hotels in your system with the appropriate rates.

### Issue: Tests Timing Out
**Solution**: Increase timeout in `playwright.config.ts`:
```typescript
timeout: 120 * 1000, // 2 minutes
```

### Issue: Discount Not Detected
**Solution**: 
1. Verify the discount rule is active in the admin panel
2. Check that the date range matches (April 1-15, 2026)
3. Confirm the rate threshold is set to "under $100"
4. Ensure the "Apply To" is set to "Adjust"

### Issue: Price Calculation Mismatch
**Solution**: Check if there are:
- Additional taxes or fees being applied
- Other discount rules conflicting
- Currency conversion issues

## Test Maintenance

### Updating Test Data
To use different hotels or rates, update the `hotel_id` parameter in each test:
```typescript
await bookingEnginePage.gotoHotelBookingWithDates(
  checkInDate,
  checkOutDate,
  jwtToken,
  {
    hotel_id: 'your-actual-hotel-id', // Update this
  }
);
```

### Extending Date Range
If the discount rule date range changes, update the test dates:
```typescript
const checkInDate = '2026-04-05'; // Update to new date range
```

### Changing Discount Percentage
If the discount percentage changes from 2%, update:
```typescript
const discountPercentage = 2; // Update this value
const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
expect(appliedDiscount).toBe(2); // Update expected value
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Low Rate Discount Tests

on:
  schedule:
    - cron: '0 0 * * *' # Daily
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test low-rate-discount.spec.ts
        env:
          JWT_TOKEN: ${{ secrets.JWT_TOKEN }}
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Run tests before the discount period** to ensure everything is configured correctly
2. **Run tests on the first day** of the discount period (April 1) to verify activation
3. **Run tests on the last day** of the discount period (April 15) to verify it's still active
4. **Run tests after the period ends** (April 16) to verify deactivation
5. **Monitor test results** and investigate any failures immediately
6. **Update test data** if hotel rates or IDs change in the system

## Support

For issues or questions:
1. Check the main `PLAYWRIGHT_TESTING_GUIDE.md`
2. Review `TEST_PLAN.md` for overall testing strategy
3. Consult `QUICK_START_TESTING.md` for general Playwright guidance

## Summary

This test suite provides comprehensive coverage of the Low Rate Discount rule, including:
- ✅ Rate threshold validation (under $100 vs at/above $100)
- ✅ Date range validation (April 1-15, 2026)
- ✅ Boundary testing ($99.99 vs $100.00)
- ✅ Multi-night stay calculations
- ✅ Discount calculation accuracy
- ✅ UI display verification (strike-through pricing)
- ✅ Edge cases and error scenarios

Total: **20+ test cases** covering all aspects of the discount rule.

