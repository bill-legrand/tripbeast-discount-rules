# Cruise Discount Test Report

## Executive Summary

- **Discount Rule**: Ancii Stage DR
- **Rule ID**: eb511fff-19b8-4a27-91d5-dd8e69f31809
- **Customer**: Tripbeast Ancillary
- **Channel**: TripBeast
- **Test Date**: 2026-02-02

### Results Overview

| Metric | Value |
|--------|-------|
| Total Tests | 5 |
| Passed | 0 |
| Failed | 5 |
| Pass Rate | 0.0% |

## Discount Configuration

### Cruise Discount Rules (March 2026)

| Period | Date Range | Discount Type | Value |
|--------|------------|---------------|-------|
| Period 1 | Mar 1-7 | Fixed | 22% |
| Period 2 | Mar 8-14 | DOW | Mon: 36%, Tue: 48%, Wed: 60%, Thu: 72%, Fri: 84%, Sat: 12%, Sun: 24% |
| Period 3 | Mar 15-21 | Fixed | 21% |
| No Config | Mar 22-31 | None | 0% |

## Test Results

### 1-Day Cruise Tests

| Test | Date | Day | Expected | Actual | Status | Notes |
|------|------|-----|----------|--------|--------|-------|

### 3-Day Cruise Tests

| Test | Dates | Expected Avg | Actual | Status | Daily Breakdown |
|------|-------|--------------|--------|--------|-----------------|
| 3-Day Cruise Mar 8 | 2026-03-08 → 2026-03-11 | 36% | 0% | ❌ | Period 2 (DOW) only | Sun: 24%, Mon: 36%, Tue: 48% |
| 3-Day Cruise Mar 12 | 2026-03-12 → 2026-03-15 | 56% | 0% | ❌ | Period 2 → Period 3 transition | Thu: 72%, Fri: 84%, Sat: 12% |
| 3-Day Cruise Mar 15 | 2026-03-15 → 2026-03-18 | 21% | 0% | ❌ | Period 3 only | Sun: 21%, Mon: 21%, Tue: 21% |
| 3-Day Cruise Mar 19 | 2026-03-19 → 2026-03-22 | 21% | 0% | ❌ | Period 3 → No Discount transition | Thu: 21%, Fri: 21%, Sat: 21% |

### 7-Day Cruise Tests

| Test | Dates | Expected Avg | Actual | Status | Notes |
|------|-------|--------------|--------|--------|-------|
| 7-Day Cruise Mar 1 | 2026-03-01 → 2026-03-08 | 22% | 0% | ❌ | Starts Period 1, ends Period 2 |

## Failed Tests Analysis

| Test | Expected | Actual | Variance | Screenshot |
|------|----------|--------|----------|------------|
| 3-Day Cruise Mar 8 | 36% | 0% | 36.0% | [View](test-results/cruise-screenshots/3day-mar8.png) |
| 3-Day Cruise Mar 12 | 56% | 0% | 56.0% | [View](test-results/cruise-screenshots/3day-mar12.png) |
| 3-Day Cruise Mar 15 | 21% | 0% | 21.0% | [View](test-results/cruise-screenshots/3day-mar15.png) |
| 3-Day Cruise Mar 19 | 21% | 0% | 21.0% | [View](test-results/cruise-screenshots/3day-mar19.png) |
| 7-Day Cruise Mar 1 | 22% | 0% | 22.0% | [View](test-results/cruise-screenshots/7day-mar1.png) |

## Screenshots

All test screenshots are saved in `test-results/cruise-screenshots/`

## Technical Details

### JWT Used
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyT...
```

### Booking Engine
- URL: https://travel.tripbeast.com
- Page: cruise

### Test Framework
- Playwright
- TypeScript

---
*Report generated automatically by cruise-discount.spec.ts*
