# Car Rental Discount Tests - Quick Start Guide

**Get started testing car rental discounts in 3 simple steps!**

---

## 🚀 Quick Start (3 Steps)

### Step 1: Update Car Parameters

Before running tests, you need actual car rental IDs from the booking engine.

1. **Navigate to the booking engine:**
   ```
   https://bookings.tripbeast.com/?jwt=YOUR_JWT&page=car
   ```

2. **Search for a car:**
   - Pickup Location: Las Vegas Strip
   - Pickup Date: 03/01/2026
   - Dropoff Date: 03/02/2026
   - Pickup Time: 10:00 AM
   - Dropoff Time: 10:00 AM
   - Renter Age: 30

3. **Capture the booking URL parameters** from the search results

4. **Update the test files** with the actual parameters:
   
   Edit these files:
   - `tests/car-1day-discount.spec.ts`
   - `tests/car-2day-discount.spec.ts`
   - `tests/car-7day-discount.spec.ts`
   
   Update the `TEST_CAR_PARAMS` object:
   ```typescript
   const TEST_CAR_PARAMS = {
     pickup_location: 'Las Vegas Strip',
     dropoff_location: 'Las Vegas Strip',
     pickup_time: '10:00',
     dropoff_time: '10:00',
     renter_age: '30',
     // ADD these from your search:
     car_id: 'ACTUAL_CAR_ID',
     location_id: 'ACTUAL_LOCATION_ID',
     vehicle_type: 'ACTUAL_VEHICLE_TYPE'
   };
   ```

### Step 2: Run the Tests

Run all 84 tests at once:

```powershell
.\run-car-tests.ps1
```

Or run specific test suites:

```powershell
# 1-day rentals only (31 tests)
.\run-car-tests.ps1 -OneDay

# 2-day rentals only (29 tests)
.\run-car-tests.ps1 -TwoDay

# 7-day rentals only (24 tests)
.\run-car-tests.ps1 -SevenDay
```

### Step 3: Review the Results

After tests complete, review the generated reports:

1. **Markdown Reports:**
   - `CAR_1DAY_DISCOUNT_REPORT.md`
   - `CAR_2DAY_DISCOUNT_REPORT.md`
   - `CAR_7DAY_DISCOUNT_REPORT.md`

2. **Screenshots:**
   - `test-results/car-screenshots/1-day/`
   - `test-results/car-screenshots/2-day/`
   - `test-results/car-screenshots/7-day/`

3. **HTML Report (optional):**
   ```powershell
   .\run-car-tests.ps1 -Report
   ```

---

## 📋 What Gets Tested

### Test Coverage Summary

| Test Suite | Tests | Dates | Expected Discounts |
|------------|-------|-------|-------------------|
| **1-Day Rentals** | 31 | Mar 1-31 | 0%, 12%, 22%, 5-35% (DOW) |
| **2-Day Rentals** | 29 | Mar 1-29 | Blended averages |
| **7-Day Rentals** | 24 | Mar 1-24 | Blended averages |
| **TOTAL** | **84** | — | — |

### Discount Periods

| Period | Dates | Discount |
|--------|-------|----------|
| Period 1 | Mar 1-7 | 12% fixed |
| Period 2 | Mar 8-14 | 22% fixed |
| Period 3 | Mar 15-28 | 5-35% (Day of Week) |
| No Discount | Mar 29-31 | 0% |

### Period 3: Day of Week Discounts

| Day | Discount |
|-----|----------|
| Monday | 15% |
| Tuesday | 20% |
| Wednesday | 25% |
| Thursday | 30% |
| Friday | 35% |
| Saturday | 5% |
| Sunday | 10% |

---

## 🎯 Example Test Scenarios

### 1-Day Rentals
- **Mar 1 (Sat):** 12% discount (Period 1)
- **Mar 8 (Sun):** 22% discount (Period 2)
- **Mar 17 (Mon):** 15% discount (Period 3 DOW)
- **Mar 29 (Sat):** 0% discount (No discount period)

### 2-Day Rentals
- **Mar 1-2:** 12% (both days in Period 1)
- **Mar 7-8:** 17% (Period 1→2 transition: 12%+22%/2)
- **Mar 17-18 (Mon+Tue):** 17.5% (15%+20%/2)
- **Mar 28-29:** 17.5% (Period 3→No discount: 35%+0%/2)

### 7-Day Rentals
- **Mar 1-7:** 12% (all days in Period 1)
- **Mar 8-14:** 22% (all days in Period 2)
- **Mar 15-21:** 20% (full DOW cycle average)
- **Mar 5-11:** 17.7% (Period 1+2 blend)

---

## 🛠️ Advanced Usage

### Run with Browser Visible

See tests execute in real-time:

```powershell
.\run-car-tests.ps1 -Headed
```

### Interactive UI Mode

Debug and run tests individually:

```powershell
.\run-car-tests.ps1 -UI
```

### Run Specific Tests

Run individual test files directly:

```powershell
# 1-day rentals
npx playwright test tests/car-1day-discount.spec.ts --project=chromium

# 2-day rentals
npx playwright test tests/car-2day-discount.spec.ts --project=chromium

# 7-day rentals
npx playwright test tests/car-7day-discount.spec.ts --project=chromium
```

### Generate HTML Report

```powershell
.\run-car-tests.ps1 -Report

# Or manually after any test run:
npx playwright show-report
```

---

## 📊 Understanding Test Results

### Test Output Format

```
✅ PASS Mar 1 (Sat): 12.0% (expected 12%, diff: 0.0%)
❌ FAIL Mar 15 (Sat): 8.0% (expected 5%, diff: 3.0%)
```

### Report Sections

Each generated report includes:

1. **Test Configuration**
   - Discount rule details
   - Date ranges
   - Tolerance levels

2. **Individual Test Results**
   - Status (✅ PASS / ❌ FAIL)
   - Expected vs Actual discount %
   - Price breakdown (Gross, Discount, Net)
   - Screenshot reference

3. **Summary Statistics**
   - Total tests
   - Pass/Fail counts
   - Test execution date

### Screenshot Examples

Each test captures a full-page screenshot showing:
- Rental details (dates, location)
- Price breakdown
- Applied discount
- Total price

---

## ⚠️ Troubleshooting

### "Cannot find car" Error

**Problem:** Tests can't locate car rental on booking engine

**Solution:**
1. Verify `TEST_CAR_PARAMS` has valid car IDs from actual search
2. Check JWT authentication is working
3. Ensure pickup/dropoff locations exist

### Discount Percentage Mismatch

**Problem:** Actual discount doesn't match expected

**Solution:**
1. Verify admin discount rule configuration
2. Check discount rule is active and assigned to JWT
3. Confirm test dates fall within configured periods
4. Review tolerance levels (±1-2%)

### Tests Time Out

**Problem:** Tests hang or timeout

**Solution:**
1. Increase timeout in `playwright.config.ts`
2. Check network connectivity
3. Verify booking engine is accessible
4. Run with `-Headed` to see what's happening

### Screenshots Not Saved

**Problem:** Screenshot directories empty

**Solution:**
1. Ensure directories exist: `test-results/car-screenshots/`
2. Check file system permissions
3. Verify disk space

---

## 📁 Project Structure

```
Tripbeast Discount Rules/
├── tests/
│   ├── car-1day-discount.spec.ts      # 1-day rental tests
│   ├── car-2day-discount.spec.ts      # 2-day rental tests
│   ├── car-7day-discount.spec.ts      # 7-day rental tests
│   ├── helpers/
│   │   └── car-discount-data.ts       # Calculations & test data
│   └── pages/
│       └── CarBookingPage.ts          # Page object model
├── test-results/
│   └── car-screenshots/               # Auto-generated screenshots
│       ├── 1-day/
│       ├── 2-day/
│       └── 7-day/
├── CAR_RENTAL_TEST_SUITE_REPORT.md    # Comprehensive documentation
├── CAR_DISCOUNT_ADMIN_CONFIGURATION.md # Admin rules documentation
├── run-car-tests.ps1                  # Quick run script
└── CAR_1DAY_DISCOUNT_REPORT.md        # Auto-generated after tests
    CAR_2DAY_DISCOUNT_REPORT.md
    CAR_7DAY_DISCOUNT_REPORT.md
```

---

## 🔗 Related Documentation

| Document | Purpose |
|----------|---------|
| **CAR_RENTAL_TEST_SUITE_REPORT.md** | Full documentation (you are here) |
| **CAR_DISCOUNT_ADMIN_CONFIGURATION.md** | Admin discount rule configuration |
| **DOW_TEST_PLAN_FULL_DESCRIPTION.md** | Hotel DOW testing (reference) |
| **COMPLETE_JWT_DISCOUNT_SUMMARY.md** | JWT and discount rules overview |

---

## 💡 Tips for Success

1. **Always update car parameters first** - Tests will fail without valid car IDs

2. **Run small batches first** - Test with `-OneDay` before running all 84 tests

3. **Use headed mode for debugging** - `-Headed` flag shows what's happening

4. **Review screenshots** - Visual proof is invaluable for reporting

5. **Check reports** - Markdown reports have detailed breakdowns

6. **Keep JWT current** - Expired JWTs will cause authentication failures

7. **Match admin dates** - Ensure test dates align with admin configuration

---

## ✅ Pre-Flight Checklist

Before running tests:

- [ ] Car parameters updated with valid IDs
- [ ] JWT token configured (same as hotel DOW tests)
- [ ] Admin discount rules verified (Mar 1-31, 2026)
- [ ] Playwright installed (`npx playwright install chromium`)
- [ ] Dependencies installed (`npm install`)
- [ ] Booking engine accessible (`bookings.tripbeast.com`)

---

## 🎉 You're Ready!

Run your first test:

```powershell
.\run-car-tests.ps1 -OneDay -Headed
```

This will:
✅ Run 31 tests for 1-day rentals  
✅ Show browser while testing  
✅ Generate `CAR_1DAY_DISCOUNT_REPORT.md`  
✅ Save 31 screenshots  
✅ Display pass/fail results  

---

**Questions? Issues?**  
See `CAR_RENTAL_TEST_SUITE_REPORT.md` for detailed documentation.

**Happy Testing! 🚗💨**
