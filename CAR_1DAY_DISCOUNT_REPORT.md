# Car Rental 1-Day Discount Test Report

**Date:** February 4, 2026
**Test Suite:** 1-Day Car Rentals
**Total Tests:** 31

---

## Test Configuration

**Discount Rule:** Ancii Stage DR
**Discount Rule ID:** eb511fff-19b8-4a27-91d5-dd8e69f31809
**Customer:** Tripbeast Ancillary
**Booking Engine:** https://travel.tripbeast.com
**JWT:** Tripbeast Ancillary (same as working hotel tests)
**Location:** Las Vegas Strip
**Tolerance:** ±1%

---

## Discount Periods

| Period | Date Range | Discount Type | Discount |
|--------|------------|---------------|----------|
| Period 1 | Mar 1-7, 2026 | Fixed | 12% |
| Period 2 | Mar 8-14, 2026 | Fixed | 22% |
| Period 3 | Mar 15-28, 2026 | DOW-Based | 5-35% (varies) |
| No Discount | Mar 29-31, 2026 | None | 0% |

---

## Test Results


## Summary

**Total Tests:** 31
**Test Date:** 2/4/2026, 7:43:25 PM

---

## Notes

- This test suite validates 1-day car rentals for all dates in March 2026
- Expected discounts are based on the Ancii Stage DR discount rule configuration
- Period 1 (Mar 1-7): 12% fixed discount
- Period 2 (Mar 8-14): 22% fixed discount
- Period 3 (Mar 15-28): Day-of-week based discounts (5-35%)
- No discount period (Mar 29-31): 0% discount
- Tolerance: ±1%
