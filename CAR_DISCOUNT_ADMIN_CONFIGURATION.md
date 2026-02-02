# Car Discount Rules - Admin Configuration

**Date:** February 1, 2026  
**Admin URL:** https://admin.rezmatestage.com  
**Customer:** Tripbeast Ancillary  
**Discount Rule Name:** Ancii Stage DR  
**Discount Rule ID:** `eb511fff-19b8-4a27-91d5-dd8e69f31809`

---

## Configuration Overview

The car discount rules are configured under the **Tripbeast Ancillary** customer with discount rule "Ancii Stage DR". This rule applies date-based discounts for car rentals in March 2026 with three distinct periods.

---

## Default Discount

**Status:** No default discount configured  
**Value:** No Data Found

---

## Discount By Date Range

### Period 1: March 1-7, 2026
- **Discount:** 12%
- **Type:** Fixed percentage
- **Duration:** 7 days

### Period 2: March 8-14, 2026
- **Discount:** 22%
- **Type:** Fixed percentage
- **Duration:** 7 days

### Period 3: March 15-28, 2026
- **Type:** Day of Week (DOW) based discounts
- **Duration:** 14 days
- **Breakdown:**
  - **Monday:** 15%
  - **Tuesday:** 20%
  - **Wednesday:** 25%
  - **Thursday:** 30%
  - **Friday:** 35%
  - **Saturday:** 5%
  - **Sunday:** 10%

### Additional Period: February 15-21, 2026
- **Discount:** 12%
- **Type:** Fixed percentage
- **Duration:** 7 days
- **Note:** Outside March testing scope

---

## Summary Table

| Date Range | Discount Type | Discount Value |
|------------|---------------|----------------|
| 2026-02-15 to 2026-02-21 | Fixed | 12% |
| 2026-03-01 to 2026-03-07 | Fixed | 12% |
| 2026-03-08 to 2026-03-14 | Fixed | 22% |
| 2026-03-15 to 2026-03-28 | DOW-Based | 5-35% (varies by day) |
| 2026-03-29 to 2026-03-31 | None | 0% (outside configured ranges) |

---

## March 2026 Calendar with Discount Periods

```
March 2026
Su Mo Tu We Th Fr Sa
                   1  (Period 1: 12%)
 2  3  4  5  6  7  8  (Period 1: 12% → Period 2: 22%)
 9 10 11 12 13 14 15  (Period 2: 22% → Period 3: DOW starts)
16 17 18 19 20 21 22  (Period 3: DOW-based)
23 24 25 26 27 28 29  (Period 3: DOW-based → No discount)
30 31                 (No discount configured)
```

---

## Period 3 - Day of Week Discount Calendar

**March 15-28, 2026 (Days with DOW discounts):**

| Date | Day | Discount |
|------|-----|----------|
| Mar 15 | Sat | 5% |
| Mar 16 | Sun | 10% |
| Mar 17 | Mon | 15% |
| Mar 18 | Tue | 20% |
| Mar 19 | Wed | 25% |
| Mar 20 | Thu | 30% |
| Mar 21 | Fri | 35% |
| Mar 22 | Sat | 5% |
| Mar 23 | Sun | 10% |
| Mar 24 | Mon | 15% |
| Mar 25 | Tue | 20% |
| Mar 26 | Wed | 25% |
| Mar 27 | Thu | 30% |
| Mar 28 | Fri | 35% |

---

## Expected Test Scenarios

### 1-Day Rentals (30 tests)
- March 1-7 (7 tests): Expect 12% discount
- March 8-14 (7 tests): Expect 22% discount
- March 15-28 (14 tests): Expect DOW-specific discount (5-35%)
- March 29-30 (2 tests): Expect 0% discount (outside range)

### 2-Day Rentals (29 tests)
- Single period rentals: Use period discount
- Cross-period rentals: Calculate blended average
  - Example: Mar 7-8 (Period 1→2): (12% + 22%) / 2 = 17%
  - Example: Mar 14-15 (Period 2→3): (22% + 5% Sat) / 2 = 13.5%

### 7-Day (1-Week) Rentals (24 tests)
- Calculate average across all days in the rental period
- Example: Mar 1-7: All 12% → 12% average
- Example: Mar 8-14: All 22% → 22% average
- Example: Mar 15-21: DOW average = (5+10+15+20+25+30+35) / 7 = 20%

---

## Test Configuration

### JWT Token
Use the same JWT that works for hotel DOW testing:
```
BOOKING_ENGINE_JWT from dow-discount-data.ts
```

### Booking Engine
```
Base URL: https://bookings.tripbeast.com
Engine Type: CUG (Closed User Group)
```

### Authentication
1. Navigate to `https://bookings.tripbeast.com/?jwt={JWT_TOKEN}` to authenticate
2. Navigate to car booking page with dates and location parameters

---

## Notes

1. **Discount Application:** Discounts apply to the subtotal (Item Price) before taxes and fees
2. **Multi-Day Calculation:** For rentals spanning multiple discount periods, calculate the per-day discount and average
3. **DOW Logic:** For DOW-based periods (Mar 15-28), each day gets its specific DOW percentage
4. **Shoulder Dates:** March 29-31 have no configured discount (expect 0%)
5. **Blended Averages:** Cross-period rentals use weighted average of all days

---

## Validation Rules

### Fixed Period Discounts (Mar 1-7, Mar 8-14)
```
Expected Discount % = Period Discount %
Tolerance: ±1%
```

### DOW Period Discounts (Mar 15-28)
```
Expected Discount % = DOW Discount for that day
Tolerance: ±1%
```

### Cross-Period Rentals
```
Expected Discount % = Average of all daily discounts
Tolerance: ±1-2% (due to rounding)
```

### No Discount Period (Mar 29-31)
```
Expected Discount % = 0%
Tolerance: Exact (0%)
```

---

## Admin Configuration Status

✅ **Confirmed:** Rules visible in admin panel screenshot  
✅ **Rule ID:** eb511fff-19b8-4a27-91d5-dd8e69f31809  
✅ **Customer:** Tripbeast Ancillary  
✅ **Date Ranges:** Three periods configured for March 2026  
✅ **DOW Configuration:** All 7 days configured for Mar 15-28 period  

---

**Next Steps:**
1. Create helper functions for car discount calculation
2. Build car booking page object
3. Implement test suites for 1-day, 2-day, and 7-day rentals
4. Generate comprehensive test report with screenshots
