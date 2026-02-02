# Day of Week (DOW) Discount Test Plan – Full Description for Enhancement

**Purpose:** Provide complete context for ChatGPT (or similar) to enhance the DOW discount test plan.

---

## 1. Executive Summary

We have a Playwright-based test suite that validates **Day of Week (DOW) discount rules** on a hotel booking engine. The system applies different discount percentages based on the day of the week for stays within a configured date range (March 2–8, 2026). Tests run against `bookings.tripbeast.com` using a production JWT. The **per-night model** has been confirmed: each night receives its own DOW discount, and the effective discount for multi-night stays is the blended average. Several discrepancies exist (shoulder dates, some multi-night scenarios, property-specific behavior) and should be addressed or documented.

---

## 2. System Under Test

| Item | Value |
|------|-------|
| **Booking Engine** | https://bookings.tripbeast.com (CUG / production) |
| **Test Framework** | Playwright (TypeScript) |
| **Page Object** | `BookingEnginePage` in `tests/pages/BookingEnginePage.ts` |
| **Flow** | Direct navigation to hotel booking URL with JWT, check-in/check-out, adults. No search form used. |

### Navigation Flow

1. Navigate to `https://bookings.tripbeast.com/?jwt={JWT}` to authenticate.
2. Navigate to `https://bookings.tripbeast.com/hotel/hotel-booking?checkin={date}&checkout={date}&hotel_id=...&property_id=...&room_id=...&adults=1&...`.
3. Wait for page content (e.g., "Item Price", "Total", dollar amounts).
4. Extract price breakdown from "Summary of Charges" via regex on page text.

### Price Extraction

The page displays a "Summary of Charges" with:
- **Item Price** – gross before discount
- **Discount** – discount amount (e.g., -$15.00)
- **Tax**, **Fees**, **Total**

`getPriceBreakdown()` uses:
- `Item Price` → gross (before discount)
- `Discount` → discount amount (absolute value used)
- `subtotal` in return = Item Price − Discount

**Effective discount %** formula:
```
effectiveDiscountPct = (discountAmount / gross) × 100
```
where `gross = subtotal + discount` (i.e., Item Price before discount).

---

## 3. DOW Discount Configuration

### Defined Range
- **Start:** 2026-03-02 (Monday)
- **End:** 2026-03-08 (Sunday)

### Per-Day Discounts (config in `dow-discount-data.ts`)

| Day | Date (example) | Discount |
|-----|----------------|----------|
| Monday | Mar 2 | 15% |
| Tuesday | Mar 3 | 20% |
| Wednesday | Mar 4 | 25% |
| Thursday | Mar 5 | 30% |
| Friday | Mar 6 | 35% |
| Saturday | Mar 7 | 40% |
| Sunday | Mar 8 | 10% |

### Shoulder Dates (Outside Range)
- **Mar 1** (Sunday, day before range): Expected **0%** by strict config; observed **10%** (possible fallback or calendar DOW).
- **Mar 9** (Monday, day after range): Expected **0%**; observed **10%** (likely fallback, not calendar DOW).

---

## 4. Discount Models (Hypotheses Tested)

### Model A: Arrival-Date
Use the discount of the **check-in day** for the entire stay.
- Example: 2-night Mon–Tue → 15% on entire stay.

### Model B: Per-Night (CONFIRMED)
Each night gets its own DOW discount. Effective discount is the average.
- Example: 2-night Mon–Tue → (15% + 20%) / 2 = **17.5%**.

**Conclusion:** Model B (per-night) matches observed behavior for most scenarios.

---

## 5. Test Suites and Their Purpose

### 5.1 `multi-night-discount-logic.spec.ts`
- **Purpose:** Determine whether Model A or Model B is used.
- **Scenarios:** 2-night and 3-night stays (Mon–Tue, Thu–Fri, Tue–Thu, Wed–Fri).
- **Output:** Compares actual % to both models and reports which matches.

### 5.2 `dow-comprehensive-accuracy.spec.ts`
- **Purpose:** Validate per-night accuracy across single-night, shoulder, and multi-night stays.
- **Groups:**
  - Single-night (Mar 2–8): each day
  - Shoulder dates: Mar 1, Mar 9
  - Multi-night: 2N, 3N, 4N, 7N within range
  - Shoulder-span: stays that cross before/during/after range
- **Tolerance:** ±1% for most; ±5–8 for shoulder-span and 4N Thu–Sun.

### 5.3 `dow-discrepancy-report.spec.ts`
- **Purpose:** Find and document discrepancies with screenshots.
- **Tolerance:** >1% off expected = discrepancy.
- **Output:** `DISCREPANCY_REPORT.md`, screenshots in `test-results/discrepancy-screenshots/`.
- **Scope:** Runs against first 2 hotels in `LAS_VEGAS_HOTELS`.

### 5.4 `dow-discount-verification.spec.ts`
- **Purpose:** Broader DOW verification (single-night, multi-night, edge cases).
- **Uses:** Same `BookingEnginePage`, `TEST_HOTEL_PARAMS`.

---

## 6. Test Scenarios (Full List)

### Single-Night (Mar 2–8)
| Check-In | Check-Out | Day | Expected % |
|----------|-----------|-----|------------|
| 2026-03-02 | 2026-03-03 | Mon | 15 |
| 2026-03-03 | 2026-03-04 | Tue | 20 |
| 2026-03-04 | 2026-03-05 | Wed | 25 |
| 2026-03-05 | 2026-03-06 | Thu | 30 |
| 2026-03-06 | 2026-03-07 | Fri | 35 |
| 2026-03-07 | 2026-03-08 | Sat | 40 |
| 2026-03-08 | 2026-03-09 | Sun | 10 |

### Shoulder Dates
| Check-In | Check-Out | Label | Expected % (strict) | Observed |
|----------|-----------|-------|---------------------|----------|
| 2026-03-01 | 2026-03-02 | Before range | 0 | 10 |
| 2026-03-09 | 2026-03-10 | After range | 0 | 10 |

### Multi-Night (Per-Night Model)
| Check-In | Check-Out | Nights | Nights (DOW) | Expected Avg % |
|----------|-----------|--------|--------------|----------------|
| 2026-03-02 | 2026-03-04 | 2 | Mon, Tue | 17.5 |
| 2026-03-03 | 2026-03-06 | 3 | Tue, Wed, Thu | 25 |
| 2026-03-04 | 2026-03-07 | 3 | Wed, Thu, Fri | 30 |
| 2026-03-05 | 2026-03-08 | 4 | Thu, Fri, Sat, Sun | 28.75 |
| 2026-03-02 | 2026-03-09 | 7 | Full week | 25 |

### Shoulder-Span (Partial Range)
| Check-In | Check-Out | Description | Expected Avg % | Observed (Longhorn) |
|----------|-----------|-------------|----------------|---------------------|
| 2026-03-01 | 2026-03-04 | 1 before + Mon + Tue | 11.67 | ~15 |
| 2026-03-07 | 2026-03-10 | Sat + Sun + 1 after | 16.67 | ~20 |
| 2026-02-28 | 2026-03-03 | 2 before + Mon + Tue | 8.75 | ~11.7 |

---

## 7. Known Discrepancies (Latest Run)

### Longhorn Casino & Hotel (hotel_id 2008)
- **Shoulders:** Mar 1, Mar 9 → 10% (expected 0%).
- **4N Thu–Sun:** 35% (expected 28.75%).
- **3N Sun+Mon+Tue:** 15% (expected 11.67%).
- **3N Sat+Sun+Mon:** 20% (expected 16.67%).
- **4N 2before+Mon+Tue:** 11.7% (expected 8.75%).

### Hotel 2007 (hotel_id 2007)
- **All scenarios:** 0% discount (no DOW applied; likely different config or rates).

---

## 8. Configuration and Environment

### JWT
- **Env var:** `BOOKING_ENGINE_JWT`
- **Use:** `bookings.tripbeast.com` (CUG)
- **Payload:** `pricingRuleId`, `businessRuleId` (no `discountRuleId`)
- **Source:** `tests/helpers/dow-discount-data.ts`

### Test Hotels
```javascript
// Primary (working)
{ hotel_id: '2008', property_id: '12384405', room_id: '201273159', name: 'Longhorn Casino & Hotel' }

// Secondary (often 0% discount)
{ hotel_id: '2007', property_id: '12384404', room_id: '201273158', name: 'Hotel 2007' }
```

### Helper Functions (`dow-discount-data.ts`)
- `getDOWTestDates()` – dates with expected discounts
- `formatDateForInput(date)` – YYYY-MM-DD
- `getDayOfWeekDiscount(date)` – Sun=10, Mon=15, ..., Sat=40
- `isWithinDOWRange(date)` – true if Mar 2–8
- `getCheckoutDate(checkIn)` – check-in + 1 day

---

## 9. Important Technical Notes

### Date/Timezone
- Use **YYYY-MM-DD strings** for check-in/check-out. Avoid `new Date('YYYY-MM-DD')` for assertions; it can shift by timezone.

### Gross vs Net
- **Gross** = Item Price (before discount).
- **Effective %** = discount / gross × 100.
- Ensure regex captures "Item Price" and "Discount" from the Summary of Charges.

### Property Differences
- Hotel 2008 (Longhorn): DOW discounts apply.
- Hotel 2007: Often no discount (0%)—may need different rules or channel config.

---

## 10. Gaps and Enhancement Opportunities

1. **Shoulder behavior:** Define expected behavior for dates outside Mar 2–8 (0%, fallback %, or calendar DOW).
2. **4N Thu–Sun:** Backend shows 35% vs expected 28.75%. Clarify logic or adjust expectations.
3. **Shoulder-span stays:** Backend may use different rules for nights outside range; document or parameterize expectations.
4. **Multi-hotel:** Only Longhorn (2008) shows DOW; expand or document which properties support DOW.
5. **Tolerance:** Make tolerance configurable (e.g., 1%, 5%) per scenario or per scenario type.
6. **Reporting:** Add JSON/HTML report; Slack-friendly summary; trend over time.
7. **Parallelization:** Run scenarios in parallel where possible without overloading the engine.
8. **Retries:** Add retries for flaky scenarios (e.g., timeouts, load).
9. **Date range flexibility:** Make DOW range configurable (start/end, percentages) for future campaigns.
10. **Regression:** Add explicit regression suite comparing current run to baseline.
11. **Backend alignment:** Document linkage between JWT `businessRuleId` and discount rules in admin.

---

## 11. Run Commands

```powershell
# Full DOW comprehensive
npx playwright test dow-comprehensive-accuracy.spec.ts --project=chromium

# Discrepancy report (screenshots)
npx playwright test dow-discrepancy-report.spec.ts --project=chromium --timeout=300000

# Multi-night logic
npx playwright test multi-night-discount-logic.spec.ts --project=chromium

# All DOW
npx playwright test dow-discount-verification.spec.ts --project=chromium
```

---

## 12. File Reference

| File | Purpose |
|------|---------|
| `tests/helpers/dow-discount-data.ts` | Config, JWT, hotel params, helpers |
| `tests/pages/BookingEnginePage.ts` | Page object, `gotoHotelBookingWithDates`, `getPriceBreakdown` |
| `tests/dow-comprehensive-accuracy.spec.ts` | Accuracy tests |
| `tests/dow-discrepancy-report.spec.ts` | Discrepancy detection and screenshots |
| `tests/multi-night-discount-logic.spec.ts` | Model A vs B determination |
| `tests/dow-discount-verification.spec.ts` | Broader DOW verification |
| `MULTI_NIGHT_DISCOUNT_TEST_PLAN.md` | Original plan and results |
| `DOW_MULTI_NIGHT_TEST_RESULTS.md` | Historical results (flat 15% era) |
| `DISCREPANCY_REPORT.md` | Latest discrepancy output |
| `MARCH_10_PERCENT_DISCOUNT_INVESTIGATION.md` | Shoulder 10% investigation |

---

## 13. Enhancement Request for ChatGPT

Using this description, please:

1. Propose an enhanced test plan structure (e.g., suites, scenarios, tags).
2. Suggest specific new test cases to cover gaps and edge cases.
3. Recommend improvements to assertions, tolerances, and reporting.
4. Propose configuration options (date range, tolerances, hotels) without hardcoding.
5. Suggest refactoring for maintainability (shared helpers, data-driven scenarios).
6. Address property-specific behavior and shoulder-date logic.
7. Propose a regression/baseline strategy.
8. Recommend any test infrastructure changes (fixtures, hooks, parallelization).
