# Car Rental 7-Day (1-Week) Discount Test Report

**Date:** February 1, 2026
**Test Suite:** 7-Day (1-Week) Car Rentals
**Total Tests:** 24

---

## Test Configuration

**Discount Rule:** Ancii Stage DR
**Discount Rule ID:** eb511fff-19b8-4a27-91d5-dd8e69f31809
**Customer:** Tripbeast Ancillary
**Booking Engine:** https://bookings.tripbeast.com
**Location:** Las Vegas Strip
**Rental Duration:** 7 days (1 week)
**Tolerance:** ±2%

---

## Discount Calculation Method

For 7-day rentals, the discount is calculated as the **average of all 7 days**:

```
Expected Discount % = (Sum of 7 daily discounts) / 7
```

**Examples:**
- **Mar 1-7 (all Period 1):** (12×7) / 7 = **12%**
- **Mar 8-14 (all Period 2):** (22×7) / 7 = **22%**
- **Mar 15-21 (all Period 3 DOW):** (5+10+15+20+25+30+35) / 7 = **20%**
- **Mar 5-11 (Period 1+2 mix):** (12+12+12+22+22+22+22) / 7 = **17.7%**

---

## Test Results

### 2026-03-24 to 2026-03-31

**Status:** ❌ FAIL
**Rental Days:** 7
**Daily Breakdown:**
```
2026-03-24 Tuesday 20%, 2026-03-25 Wednesday 25%, 2026-03-26 Thursday 30%, 2026-03-27 Friday 35%, 2026-03-28 Saturday 5%, 2026-03-29 Sunday 0%, 2026-03-30 Monday 0%
```
**Expected Discount:** 16.4%
**Actual Discount:** 0%
**Difference:** 16.4%
**Gross Price:** $0.00
**Discount Amount:** $0.00
**Net Price:** $0.00

![Screenshot](car-screenshots/7-day/7day-2026-03-24-to-2026-03-31.png)

---


## Summary

**Total Tests:** 24
**Test Date:** 2/1/2026, 10:52:51 PM

---

## Key Test Scenarios

### Single Period Weeks
- **Mar 1-7:** All 7 days in Period 1 (12%) → **12% average**
- **Mar 8-14:** All 7 days in Period 2 (22%) → **22% average**
- **Mar 15-21:** Full week in Period 3 (DOW: Sat→Fri) → **20% average**
  - Sat 5%, Sun 10%, Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%
  - Average: (5+10+15+20+25+30+35) / 7 = 20%

### Cross-Period Weeks
- **Mar 5-11:** 3 days Period 1 (12%) + 4 days Period 2 (22%)
  - (12+12+12+22+22+22+22) / 7 = **17.7% average**
- **Mar 12-18:** 3 days Period 2 (22%) + 4 days Period 3 (DOW)
  - Period 2: 22%, 22%, 22%
  - Period 3: Sat 5%, Sun 10%, Mon 15%, Tue 20%
  - Average calculated from all 7 days

### Weeks Ending in No-Discount Period
- **Mar 24-30:** 5 days Period 3 (DOW) + 2 days No Discount (0%)
  - Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, No discount 0%, 0%
  - Average: (15+20+25+30+35+0+0) / 7 = **17.9% average**

---

## Discount Period Summary

| Period | Date Range | Discount | Full Week Average |
|--------|------------|----------|-------------------|
| Period 1 | Mar 1-7 | 12% fixed | 12% |
| Period 2 | Mar 8-14 | 22% fixed | 22% |
| Period 3 | Mar 15-28 | DOW-based (5-35%) | 20% (full DOW week) |
| No Discount | Mar 29-31 | 0% | 0% |

---

## Notes

- This test suite validates 7-day car rentals starting from Mar 1 through Mar 24, 2026
- Expected discounts use per-day model: average of all 7 rental days
- Tolerance: ±2% (higher than 1-day due to rounding in multi-day calculations)
- Cross-period rentals blend discounts from all periods touched
- DOW period weeks have interesting patterns based on which days are included
- A full DOW week (Sat-Fri) averages to 20%
- Weeks ending in no-discount period will have lower averages
