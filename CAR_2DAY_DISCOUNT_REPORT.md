# Car Rental 2-Day Discount Test Report

**Date:** February 1, 2026
**Test Suite:** 2-Day Car Rentals
**Total Tests:** 29

---

## Test Configuration

**Discount Rule:** Ancii Stage DR
**Discount Rule ID:** eb511fff-19b8-4a27-91d5-dd8e69f31809
**Customer:** Tripbeast Ancillary
**Booking Engine:** https://bookings.tripbeast.com
**Location:** Las Vegas Strip
**Tolerance:** ±2%

---

## Discount Calculation Method

For 2-day rentals, the discount is calculated as the **average of both days**:

```
Expected Discount % = (Day 1 Discount % + Day 2 Discount %) / 2
```

**Examples:**
- Mar 1-2 (both in Period 1): (12% + 12%) / 2 = **12%**
- Mar 7-8 (Period 1 → Period 2): (12% + 22%) / 2 = **17%**
- Mar 14-15 (Period 2 → Period 3): (22% + 5% Sat) / 2 = **13.5%**

---

## Test Results

### 2026-03-25 to 2026-03-27

**Status:** ❌ FAIL
**Rental Days:** 2
**Daily Breakdown:** Wednesday 25% + Thursday 30%
**Expected Discount:** 27.5%
**Actual Discount:** 0%
**Difference:** 27.5%
**Gross Price:** $0.00
**Discount Amount:** $0.00
**Net Price:** $0.00

![Screenshot](car-screenshots/2-day/2day-2026-03-25-to-2026-03-27.png)

---


## Summary

**Total Tests:** 29
**Test Date:** 2/1/2026, 10:51:07 PM

---

## Key Test Scenarios

### Single Period Rentals
- **Mar 1-2, Mar 2-3, ..., Mar 6-7:** All days in Period 1 (12%) → **12% average**
- **Mar 8-9, Mar 9-10, ..., Mar 13-14:** All days in Period 2 (22%) → **22% average**
- **Mar 15-16, Mar 16-17, ..., Mar 27-28:** All days in Period 3 (DOW) → **Varies by days**

### Cross-Period Rentals
- **Mar 7-8:** Period 1 (12%) → Period 2 (22%) = **17% average**
- **Mar 14-15:** Period 2 (22%) → Period 3 (5% Sat) = **13.5% average**
- **Mar 28-29:** Period 3 (35% Fri) → No discount (0%) = **17.5% average**

### DOW Period Rentals (Period 3)
Examples of DOW-based 2-day averages:
- **Mar 15-16 (Sat+Sun):** (5% + 10%) / 2 = **7.5%**
- **Mar 17-18 (Mon+Tue):** (15% + 20%) / 2 = **17.5%**
- **Mar 19-20 (Wed+Thu):** (25% + 30%) / 2 = **27.5%**
- **Mar 21-22 (Fri+Sat):** (35% + 5%) / 2 = **20%**

---

## Notes

- This test suite validates 2-day car rentals starting from Mar 1 through Mar 29, 2026
- Expected discounts use per-day model: average of both rental days
- Tolerance: ±2% (higher than 1-day due to rounding in multi-day calculations)
- Cross-period rentals blend discounts from both periods
- DOW period rentals vary based on specific days of the week
