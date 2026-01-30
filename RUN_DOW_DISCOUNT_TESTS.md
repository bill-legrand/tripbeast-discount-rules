# Running Day of Week Discount Tests

## Overview

These tests verify that the Day of Week (DOW) discount pattern is correctly applied when booking hotels during the configured date range (March 2-8, 2026).

## DOW Discount Pattern

| Day | Date | Discount |
|-----|------|----------|
| Monday | 2026-03-02 | 15% |
| Tuesday | 2026-03-03 | 20% |
| Wednesday | 2026-03-04 | 25% |
| Thursday | 2026-03-05 | 30% |
| Friday | 2026-03-06 | 35% |
| Saturday | 2026-03-07 | 40% (HIGHEST) |
| Sunday | 2026-03-08 | 10% (LOWEST) |

## Quick Start

### Run All DOW Discount Tests

```powershell
.\run-tests.ps1 -DOWTests -Headed
```

### Run Specific Day Test

```powershell
# Monday test
.\run-tests.ps1 -TestName "Monday (2026-03-02)" -Headed

# Saturday test (highest discount)
.\run-tests.ps1 -TestName "Saturday (2026-03-07)" -Headed

# Sunday test (lowest discount)
.\run-tests.ps1 -TestName "Sunday (2026-03-08)" -Headed
```

### Run All DOW Tests in UI Mode

```powershell
.\run-tests.ps1 -UI
# Then select: dow-discount-verification.spec.ts
```

### Run Complete Test File

```powershell
.\run-tests.ps1 -TestFile "tests/dow-discount-verification.spec.ts" -Headed
```

## Test Suites

### 1. Day of Week Discount Verification (Individual Days)

Tests each day of the week individually:
- ✅ Monday: 15% discount
- ✅ Tuesday: 20% discount
- ✅ Wednesday: 25% discount
- ✅ Thursday: 30% discount
- ✅ Friday: 35% discount
- ✅ Saturday: 40% discount (highest)
- ✅ Sunday: 10% discount (lowest)

```powershell
# Run individual day test
.\run-tests.ps1 -TestName "Monday (2026-03-02)" -Headed
```

### 2. Comprehensive Testing

- **All days data-driven test**: Loops through all days and verifies discounts
- **Weekend vs Weekday**: Compares Saturday (40%) vs Monday (15%)

```powershell
# Run comprehensive tests
.\run-tests.ps1 -TestName "Should apply correct discount for all days" -Headed
```

### 3. Edge Cases

- **First day of range** (Monday 3/2): Verify discount applies
- **Last day of range** (Sunday 3/8): Verify discount applies
- **Before range** (2026-03-01): Verify DOW discount does NOT apply
- **After range** (2026-03-09): Verify DOW discount does NOT apply

```powershell
# Run edge case tests
.\run-tests.ps1 -TestName "First day of DOW range" -Headed
.\run-tests.ps1 -TestName "Date before DOW range" -Headed
```

### 4. Price Verification

- **Subtotal discount**: Verify discount applied on subtotal only (excluding taxes/fees)
- **Strike-through display**: Verify original price shown with strike-through

```powershell
# Run price verification tests
.\run-tests.ps1 -TestName "DOW discount should be applied on subtotal" -Headed
.\run-tests.ps1 -TestName "Should display strike-through price" -Headed
```

## What the Tests Do

### For Each Day:
1. Navigate to hotel booking page: `https://bookings.tripbeast.com/?page=hotel`
2. Search hotels with check-in date set to the test day
3. Set check-out date to day after check-in
4. Verify the correct discount percentage is displayed
5. Capture screenshot for verification
6. Log results to console

### Price Breakdown Verification:
1. Select a hotel from search results
2. Get detailed price breakdown
3. Verify discount is calculated on subtotal (Price + Markups)
4. Verify taxes and fees are NOT included in discount calculation
5. Verify total = (Subtotal - Discount) + Taxes + Fees

## Test Results Location

After running tests, check these locations:

### Screenshots
- `test-results/dow-monday-15-percent.png`
- `test-results/dow-tuesday-20-percent.png`
- `test-results/dow-wednesday-25-percent.png`
- `test-results/dow-thursday-30-percent.png`
- `test-results/dow-friday-35-percent.png`
- `test-results/dow-saturday-40-percent-highest.png`
- `test-results/dow-sunday-10-percent-lowest.png`
- `test-results/dow-before-range.png`
- `test-results/dow-after-range.png`
- `test-results/dow-price-breakdown.png`
- `test-results/dow-strike-through-display.png`

### HTML Report
```powershell
npx playwright show-report
```

### Console Output
The tests log detailed information:
```
✓ Monday (3/2): 15% discount verified
✓ Tuesday (3/3): 20% discount verified
✓ Wednesday (3/4): 25% discount verified
...
✅ All DOW discounts verified successfully!
```

## Expected Behavior

### Within DOW Range (3/2 - 3/8)
- Each day applies its specific discount percentage
- Saturday has the highest discount (40%)
- Sunday has the lowest discount (10%)
- Discounts are applied on subtotal only

### Outside DOW Range
- Dates before 3/2: No DOW discount (may have other discounts)
- Dates after 3/8: No DOW discount (may have other discounts)

## Troubleshooting

### If Tests Fail

1. **Check date formats**: Ensure dates are in correct format (YYYY-MM-DD)
2. **Check booking engine URL**: Verify `https://bookings.tripbeast.com/?page=hotel` is accessible
3. **Check discount configuration**: Verify DOW pattern is configured in admin panel
4. **Check date range**: Verify 2026-03-02 to 2026-03-08 range is active
5. **Review screenshots**: Check captured screenshots in `test-results/` folder

### Common Issues

**Issue**: Discount not displayed
- **Solution**: Verify customer has DOW discount configured
- **Solution**: Check if date is within the configured range
- **Solution**: Verify the Voyager Travel Platform has Hotels enabled

**Issue**: Wrong discount percentage
- **Solution**: Check if multiple discount rules are configured
- **Solution**: Verify DOW pattern matches expected values
- **Solution**: Check discount priority/precedence

**Issue**: Tests timeout
- **Solution**: Increase wait time in test (currently 2000ms)
- **Solution**: Check network connection to booking engine
- **Solution**: Verify booking engine is not rate-limiting requests

## Test Coverage

These tests cover:
- ✅ **TC-018**: Date Range-Based Discount (with DOW pattern)
- ✅ **TC-020**: Dynamic Discount Rules (DOW is dynamic)
- ✅ **TC-023**: Discount Applied on Subtotal Only
- ✅ **TC-034**: Discount + Markup Combined Application
- ✅ All 7 days of the week with correct percentages
- ✅ Edge cases (first/last day, before/after range)
- ✅ Price breakdown verification
- ✅ Strike-through display

## Related Files

- **Test Suite**: `tests/dow-discount-verification.spec.ts`
- **Page Object**: `tests/pages/BookingEnginePage.ts`
- **Test Data Helper**: `tests/helpers/dow-discount-data.ts`
- **Run Script**: `run-tests.ps1`

## Integration with Existing Tests

The DOW discount tests integrate with:
- **Customer Discount Tests**: Admin panel configuration
- **Discount Calculation Tests**: Price calculation logic
- **Strike-Through Tests**: Display verification

## Next Steps After Running Tests

1. ✅ Review test results and screenshots
2. ✅ Verify all 7 days pass with correct discounts
3. ✅ Check edge cases (before/after range)
4. ✅ Verify price breakdown is correct
5. ✅ Document any discrepancies
6. ⏳ Add tests for multi-night stays spanning multiple days
7. ⏳ Add tests for different customer groups
8. ⏳ Add tests for different platforms/channels

## Command Reference

```powershell
# Quick test - all DOW days
.\run-tests.ps1 -DOWTests -Headed

# Specific day
.\run-tests.ps1 -TestName "Saturday" -Headed

# Debug mode
.\run-tests.ps1 -TestFile "tests/dow-discount-verification.spec.ts" -Debug

# Interactive UI
.\run-tests.ps1 -UI

# View report
npx playwright show-report

# All tests including DOW
.\run-tests.ps1 -AllTests
```

---

**Ready to verify DOW discounts! Run the tests to ensure correct discounts are applied for each day of the week.** 📅
