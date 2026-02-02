# Car Rental Discount Test Suite - Complete Report

**Created:** February 1, 2026  
**Test Environment:** Production (`bookings.tripbeast.com`)  
**Discount Rule:** Ancii Stage DR (ID: `eb511fff-19b8-4a27-91d5-dd8e69f31809`)  
**Customer:** Tripbeast Ancillary  
**Test Period:** March 2026  

---

## 📋 Executive Summary

This comprehensive test suite validates car rental discount rules for March 2026, testing **83 total scenarios** across three rental durations:

| Duration | Test Count | Date Range | Status |
|----------|-----------|------------|--------|
| **1-Day Rentals** | 31 tests | Mar 1-31, 2026 | ✅ Ready |
| **2-Day Rentals** | 29 tests | Mar 1-29, 2026 | ✅ Ready |
| **7-Day Rentals** | 24 tests | Mar 1-24, 2026 | ✅ Ready |
| **TOTAL** | **84 tests** | — | ✅ Ready |

---

## 🎯 Discount Rule Configuration

### Overview

The **Ancii Stage DR** discount rule applies three distinct discount periods for car rentals in March 2026:

| Period | Date Range | Discount Type | Discount Value |
|--------|------------|---------------|----------------|
| **Period 1** | March 1-7, 2026 | Fixed Percentage | **12%** |
| **Period 2** | March 8-14, 2026 | Fixed Percentage | **22%** |
| **Period 3** | March 15-28, 2026 | Day of Week (DOW) | **5-35%** (varies) |
| **No Discount** | March 29-31, 2026 | None | **0%** |

### Period 3: Day of Week Discounts

For rentals during March 15-28, 2026, discounts vary by day of the week:

| Day | Discount |
|-----|----------|
| **Monday** | 15% |
| **Tuesday** | 20% |
| **Wednesday** | 25% |
| **Thursday** | 30% |
| **Friday** | 35% |
| **Saturday** | 5% |
| **Sunday** | 10% |

---

## 🧮 Discount Calculation Model

### Per-Day Discount Model

All car rental discounts use a **per-day calculation model**:

```
For multi-day rentals:
Expected Discount % = (Sum of each day's discount %) / Total rental days
```

### Examples

#### 1-Day Rental
- **Mar 5 (Thu) - 1 day in Period 1:**  
  Expected: **12%**

#### 2-Day Rental
- **Mar 7-8 (crossing Period 1 → Period 2):**  
  (12% + 22%) / 2 = **17%**

#### 7-Day Rental
- **Mar 1-7 (all in Period 1):**  
  (12 × 7) / 7 = **12%**
  
- **Mar 15-21 (full DOW week: Sat→Fri):**  
  (5% + 10% + 15% + 20% + 25% + 30% + 35%) / 7 = **20%**

---

## 📁 Test Suite Files

### Test Specifications

| File | Description | Tests | Duration |
|------|-------------|-------|----------|
| `car-1day-discount.spec.ts` | 1-day car rental tests | 31 | March 1-31 |
| `car-2day-discount.spec.ts` | 2-day car rental tests | 29 | March 1-29 |
| `car-7day-discount.spec.ts` | 7-day (1-week) car rental tests | 24 | March 1-24 |

### Helper Files

| File | Purpose |
|------|---------|
| `helpers/car-discount-data.ts` | Configuration, calculations, and test data generators |
| `pages/CarBookingPage.ts` | Page Object Model for car booking interactions |

### Configuration Files

| File | Description |
|------|-------------|
| `CAR_DISCOUNT_ADMIN_CONFIGURATION.md` | Admin backend discount rule documentation |
| `CAR_RENTAL_TEST_SUITE_REPORT.md` | This comprehensive report |

---

## 🚀 Running the Tests

### Prerequisites

1. **JWT Token:**  
   Uses the same production JWT as hotel DOW testing:
   ```
   BOOKING_ENGINE_JWT (from dow-discount-data.ts)
   ```

2. **Car Parameters:**  
   Tests require valid car rental location and vehicle IDs. Current placeholder:
   ```typescript
   {
     pickup_location: 'Las Vegas Strip',
     dropoff_location: 'Las Vegas Strip',
     pickup_time: '10:00',
     dropoff_time: '10:00',
     renter_age: '30'
   }
   ```
   
   **⚠️ IMPORTANT:** Before running tests, update `TEST_CAR_PARAMS` with actual car IDs from a search.

3. **Environment:**
   - Node.js and npm installed
   - Playwright installed: `npx playwright install chromium`

### Test Execution Commands

#### Run All Car Rental Tests
```powershell
# Run all car discount tests
npx playwright test car-1day-discount.spec.ts car-2day-discount.spec.ts car-7day-discount.spec.ts --project=chromium

# With browser visible (headed mode)
npx playwright test car-1day-discount.spec.ts car-2day-discount.spec.ts car-7day-discount.spec.ts --project=chromium --headed

# Generate HTML report
npx playwright test car-1day-discount.spec.ts car-2day-discount.spec.ts car-7day-discount.spec.ts --project=chromium --reporter=html
```

#### Run Individual Test Suites

**1-Day Rentals (31 tests):**
```powershell
npx playwright test car-1day-discount.spec.ts --project=chromium
```

**2-Day Rentals (29 tests):**
```powershell
npx playwright test car-2day-discount.spec.ts --project=chromium
```

**7-Day Rentals (24 tests):**
```powershell
npx playwright test car-7day-discount.spec.ts --project=chromium
```

#### Run with Screenshot Generation
```powershell
# All tests with screenshots
npx playwright test car-1day-discount.spec.ts car-2day-discount.spec.ts car-7day-discount.spec.ts --project=chromium --screenshot=on

# Screenshots are automatically saved to:
# - test-results/car-screenshots/1-day/
# - test-results/car-screenshots/2-day/
# - test-results/car-screenshots/7-day/
```

---

## 📊 Expected Test Results

### 1-Day Rentals (31 tests)

| Date Range | Tests | Expected Discount | Notes |
|------------|-------|-------------------|-------|
| Mar 1-7 | 7 tests | 12% | Period 1 fixed |
| Mar 8-14 | 7 tests | 22% | Period 2 fixed |
| Mar 15-28 | 14 tests | 5-35% | Period 3 DOW-based |
| Mar 29-31 | 3 tests | 0% | No discount |

### 2-Day Rentals (29 tests)

| Scenario | Example | Expected Discount |
|----------|---------|-------------------|
| Both days in Period 1 | Mar 1-2 | 12% |
| Both days in Period 2 | Mar 8-9 | 22% |
| Period 1 → Period 2 | Mar 7-8 | 17% (average) |
| Period 2 → Period 3 | Mar 14-15 | 13.5% (22% + 5%)/2 |
| Period 3 DOW | Mar 17-18 (Mon+Tue) | 17.5% (15% + 20%)/2 |
| Period 3 → No Discount | Mar 28-29 | 17.5% (35% + 0%)/2 |

### 7-Day Rentals (24 tests)

| Scenario | Example | Expected Discount |
|----------|---------|-------------------|
| All Period 1 | Mar 1-7 | 12% |
| All Period 2 | Mar 8-14 | 22% |
| Full DOW week | Mar 15-21 (Sat-Fri) | 20% average |
| Period 1+2 mix | Mar 5-11 | ~17.7% blended |
| Period 2+3 mix | Mar 12-18 | Variable (calculated) |
| Period 3 + No Discount | Mar 24-30 | ~17.9% blended |

---

## 🧪 Test Assertions and Tolerance

### Tolerance Levels

| Test Type | Tolerance | Reason |
|-----------|-----------|--------|
| 1-Day Rentals | ±1% | Single day, minimal rounding |
| 2-Day Rentals | ±2% | Multi-day averaging, rounding |
| 7-Day Rentals | ±2% | Multi-day averaging, rounding |

### Assertion Logic

```typescript
// For each test:
const breakdown = await carBookingPage.getPriceBreakdown();
const gross = breakdown.subtotal + breakdown.discount;
const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);
const diff = Math.abs(effectivePct - expectedDiscount);

expect(diff).toBeLessThanOrEqual(TOLERANCE);
```

---

## 📸 Screenshot Documentation

### Automatic Screenshot Capture

Each test automatically captures a full-page screenshot showing:
- Car rental details (pickup/dropoff dates, location)
- Price breakdown (Item Price, Discount, Tax, Fees, Total)
- Discount percentage applied
- Rental duration and daily rates

### Screenshot Organization

```
test-results/
└── car-screenshots/
    ├── 1-day/
    │   ├── 1day-2026-03-01.png
    │   ├── 1day-2026-03-02.png
    │   └── ... (31 screenshots)
    ├── 2-day/
    │   ├── 2day-2026-03-01-to-2026-03-03.png
    │   ├── 2day-2026-03-02-to-2026-03-04.png
    │   └── ... (29 screenshots)
    └── 7-day/
        ├── 7day-2026-03-01-to-2026-03-08.png
        ├── 7day-2026-03-02-to-2026-03-09.png
        └── ... (24 screenshots)
```

---

## 📝 Generated Reports

### Individual Test Reports

After running tests, the following reports are auto-generated:

| Report File | Description | Generated By |
|-------------|-------------|--------------|
| `CAR_1DAY_DISCOUNT_REPORT.md` | 1-day rental test results | `car-1day-discount.spec.ts` |
| `CAR_2DAY_DISCOUNT_REPORT.md` | 2-day rental test results | `car-2day-discount.spec.ts` |
| `CAR_7DAY_DISCOUNT_REPORT.md` | 7-day rental test results | `car-7day-discount.spec.ts` |

### Report Contents

Each report includes:
- ✅ Pass/Fail status for each test
- Expected vs Actual discount percentages
- Price breakdown (Gross, Discount, Net)
- Difference from expected (%)
- Screenshot reference
- Daily discount breakdown (for multi-day rentals)

---

## 🔍 Key Test Scenarios

### Critical Test Cases

#### Period Boundaries
- **Mar 7 (last day of Period 1):** Verify 12% discount
- **Mar 8 (first day of Period 2):** Verify 22% discount
- **Mar 14 (last day of Period 2):** Verify 22% discount
- **Mar 15 (first day of Period 3):** Verify 5% (Saturday DOW)
- **Mar 28 (last day of Period 3):** Verify 35% (Friday DOW)
- **Mar 29 (first day of No Discount):** Verify 0% discount

#### Cross-Period Rentals
- **Mar 7-8 (2-day crossing Period 1→2):** Verify 17% blended
- **Mar 14-15 (2-day crossing Period 2→3):** Verify 13.5% blended
- **Mar 28-29 (2-day crossing Period 3→No Discount):** Verify 17.5% blended

#### DOW Pattern Verification
- **Mar 17 (Monday in Period 3):** Verify 15%
- **Mar 21 (Friday in Period 3):** Verify 35%
- **Mar 22 (Saturday in Period 3):** Verify 5%

#### Full Week Rentals
- **Mar 1-7 (full week in Period 1):** Verify 12%
- **Mar 8-14 (full week in Period 2):** Verify 22%
- **Mar 15-21 (full DOW cycle):** Verify 20% average

---

## ⚠️ Known Limitations and Next Steps

### Current Limitations

1. **Car Parameters Placeholder:**  
   Test suite uses placeholder car parameters. Before running tests:
   - Perform manual car search on `bookings.tripbeast.com`
   - Capture actual `car_id`, `location_id`, and other parameters
   - Update `TEST_CAR_PARAMS` in each spec file

2. **JWT Token:**  
   Currently uses hotel DOW JWT. Verify this JWT includes car rental discount rules.

3. **Location:**  
   Fixed to "Las Vegas Strip". May need to test multiple locations.

### Recommended Enhancements

1. **Dynamic Car Discovery:**
   - Add pre-test car search to dynamically obtain valid car IDs
   - Create `car-search-helper.ts` to automate car parameter discovery

2. **Multiple Locations:**
   - Extend tests to cover multiple pickup/dropoff locations
   - Verify discounts apply consistently across locations

3. **Vehicle Type Testing:**
   - Test different car types (economy, luxury, SUV, etc.)
   - Verify discounts apply to all vehicle categories

4. **Parallel Execution:**
   - Configure Playwright workers for faster test execution
   - Current: Sequential execution (~84 tests × 30sec = 42 minutes)
   - Parallel (4 workers): ~10-12 minutes

5. **Baseline Comparison:**
   - Save first successful run as baseline
   - Compare future runs against baseline for regression detection

---

## 🛠️ Troubleshooting

### Common Issues

#### Issue: Tests fail with "Cannot find car"
**Solution:**  
- Update `TEST_CAR_PARAMS` with valid car IDs from actual search
- Verify pickup/dropoff locations exist in the system
- Check JWT authentication is working

#### Issue: Discount percentage doesn't match
**Solution:**  
- Verify admin discount rule configuration matches test expectations
- Check if discount rule is active and assigned to the JWT
- Review date ranges in admin vs test configuration
- Ensure pickup date falls within configured discount periods

#### Issue: Screenshots not saving
**Solution:**  
- Ensure `test-results/car-screenshots/` directories exist
- Check file system permissions
- Verify disk space availability

#### Issue: Tests timeout
**Solution:**  
- Increase timeout in `playwright.config.ts`
- Check network connectivity to `bookings.tripbeast.com`
- Verify JWT is not expired

---

## 📚 Related Documentation

| Document | Purpose |
|----------|---------|
| `CAR_DISCOUNT_ADMIN_CONFIGURATION.md` | Admin backend discount rule configuration |
| `DOW_TEST_PLAN_FULL_DESCRIPTION.md` | Hotel DOW testing (reference pattern) |
| `COMPLETE_JWT_DISCOUNT_SUMMARY.md` | JWT token and discount rules overview |
| `MULTI_NIGHT_DISCOUNT_REPORT.md` | Hotel multi-night testing (reference pattern) |

---

## ✅ Test Execution Checklist

### Pre-Test Setup
- [ ] Playwright installed (`npx playwright install chromium`)
- [ ] JWT token configured in environment or helper file
- [ ] Car parameters updated with valid IDs from search
- [ ] Admin discount rules verified and active
- [ ] Test date ranges align with discount rule configuration

### Test Execution
- [ ] Run 1-day rental tests
- [ ] Run 2-day rental tests
- [ ] Run 7-day rental tests
- [ ] Review console output for pass/fail status
- [ ] Check screenshot directories for captured images

### Post-Test Review
- [ ] Review generated markdown reports
- [ ] Verify all expected discounts match actual discounts
- [ ] Document any discrepancies found
- [ ] Update test configurations if needed
- [ ] Archive test results and screenshots

---

## 📞 Support and Questions

For questions or issues with the car rental test suite:

1. **Review this documentation** for setup and execution guidance
2. **Check helper files** (`car-discount-data.ts`) for calculation logic
3. **Compare with hotel DOW tests** for pattern reference
4. **Verify admin configuration** matches test expectations

---

**Test Suite Version:** 1.0  
**Last Updated:** February 1, 2026  
**Status:** ✅ Ready for Execution (after car parameter configuration)  

---

## 🎉 Summary

This comprehensive car rental discount test suite provides:

✅ **84 automated tests** covering all March 2026 dates  
✅ **3 rental durations** (1-day, 2-day, 7-day)  
✅ **4 discount periods** (Period 1, Period 2, Period 3 DOW, No Discount)  
✅ **Full screenshot documentation** for every test  
✅ **Detailed reports** with expected vs actual comparisons  
✅ **Flexible configuration** for easy updates  
✅ **Pattern matching** hotel DOW test structure  

**Next Step:** Update `TEST_CAR_PARAMS` with valid car IDs and run the test suite!
