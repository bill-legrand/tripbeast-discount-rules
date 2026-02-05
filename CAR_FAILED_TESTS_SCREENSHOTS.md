# Car Discount Test - Failure Screenshots

**Date:** February 3, 2026  
**Total Failed:** 10  
**Location:** `car-failed-screenshots/`

---

## Failure Summary

All 10 tests failed due to ** navigation/timeout** issues:
- **Tests 1–7:** Page lands on Hotels tab; Cars "Pick-up" combobox not found (Cars tab not selected)
- **Tests 8–10:** Cars tab not found (possible "Forbidden" or different page layout)

---

## Screenshots (Descriptive Names)

| # | Test | Expected | Screenshot |
|---|------|----------|------------|
| 1 | 2026-03-15 to 2026-03-22 (7d) | 20% | [fail-2026-03-15-7d-expect20pct.png](car-failed-screenshots/fail-2026-03-15-7d-expect20pct.png) |
| 2 | 2026-03-21 to 2026-03-22 (1d) | 5% | [fail-2026-03-21-1d-expect5pct.png](car-failed-screenshots/fail-2026-03-21-1d-expect5pct.png) |
| 3 | 2026-03-22 to 2026-03-27 (5d) | 20% | [fail-2026-03-22-5d-expect20pct.png](car-failed-screenshots/fail-2026-03-22-5d-expect20pct.png) |
| 4 | 2026-03-17 to 2026-03-19 (2d) | 22.5% | [fail-2026-03-17-2d-expect22.5pct.png](car-failed-screenshots/fail-2026-03-17-2d-expect22.5pct.png) |
| 5 | 2026-03-12 to 2026-03-17 (5d) | 18.2% | [fail-2026-03-12-5d-expect18.2pct.png](car-failed-screenshots/fail-2026-03-12-5d-expect18.2pct.png) |
| 6 | 2026-03-01 to 2026-03-05 (4d) | 12% | [fail-2026-03-01-4d-expect12pct.png](car-failed-screenshots/fail-2026-03-01-4d-expect12pct.png) |
| 7 | 2026-03-08 to 2026-03-09 (1d) | 22% | [fail-2026-03-08-1d-expect22pct.png](car-failed-screenshots/fail-2026-03-08-1d-expect22pct.png) |
| 8 | 2026-02-21 to 2026-02-23 (2d) | 6% | [fail-2026-02-21-2d-expect6pct.png](car-failed-screenshots/fail-2026-02-21-2d-expect6pct.png) |
| 9 | 2026-03-28 to 2026-03-29 (1d) | 5% | [fail-2026-03-28-1d-expect5pct.png](car-failed-screenshots/fail-2026-03-28-1d-expect5pct.png) |
| 10 | 2026-02-18 to 2026-02-21 (3d) | 12% | [fail-2026-02-18-3d-expect12pct.png](car-failed-screenshots/fail-2026-02-18-3d-expect12pct.png) |

---

## Playwright Artifacts

Full artifacts (screenshots, video, error context) are in:
- `test-results/car-comprehensive-discount-*-chromium/`
- Each folder contains: `test-failed-1.png`, `attachments/`, `video.webm`, `error-context.md`

---

## Root Cause

1. **Cars tab not auto-selected:** The page loads with Hotels tab selected; `?page=car` may not switch to Cars.
2. **Pick-up combobox:** On Hotels, the combobox is "Where are you going?" not "Pick-up" – Cars form uses different labels.
3. **Cars tab not found:** Some runs hit "Forbidden" or a different layout where the Cars tab is missing.
