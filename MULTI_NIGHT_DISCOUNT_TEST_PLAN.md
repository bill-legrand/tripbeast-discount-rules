# Multi-Night Discount Logic Test Plan

## Purpose
Confirm or refute which multi-night discount model the booking engine uses:
- **Model A (Arrival-Date)**: Use the discount on the arrival date and apply it to the entire stay
- **Model B (Per-Night)**: Use the discount assigned to each night for that night's rate

## Background
DOW_MULTI_NIGHT_TEST_RESULTS.md showed that all multi-night DOW stays received a flat 15% regardless of nights or days—suggesting neither model may be implemented. This plan tests both hypotheses systematically.

## Discount Configuration Used
**DOW (March 2-8) - bookings.tripbeast.com**
| Date | Day | Discount |
|------|-----|----------|
| Mar 2 | Mon | 15% |
| Mar 3 | Tue | 20% |
| Mar 4 | Wed | 25% |
| Mar 5 | Thu | 30% |
| Mar 6 | Fri | 35% |
| Mar 7 | Sat | 40% |
| Mar 8 | Sun | 10% |

## Expected Outcomes by Model

### Model A: Arrival-Date
- **2-night Mar 2-4** (Mon 15%, Tue 20%): 15% on entire stay (arrival = Mon)
- **2-night Mar 5-7** (Thu 30%, Fri 35%): 30% on entire stay (arrival = Thu)
- **3-night Mar 3-6** (Tue 20%, Wed 25%, Thu 30%): 20% on entire stay (arrival = Tue)
- **3-night Mar 4-7** (Wed 25%, Thu 30%, Fri 35%): 25% on entire stay (arrival = Wed)

### Model B: Per-Night
- **2-night Mar 2-4** (Mon 15%, Tue 20%): blended (15+20)/2 = 17.5% effective
- **2-night Mar 5-7** (Thu 30%, Fri 35%): blended (30+35)/2 = 32.5% effective
- **3-night Mar 3-6** (Tue 20%, Wed 25%, Thu 30%): blended 25% effective
- **3-night Mar 4-7** (Wed 25%, Thu 30%, Fri 35%): blended 30% effective

## Test Scenarios

| # | Stay | Check-In | Check-Out | Nights | Arrival % (A) | Per-Night Avg % (B) |
|---|------|----------|-----------|--------|---------------|---------------------|
| 1 | Mon-Tue | Mar 2 | Mar 4 | 2 | 15% | 17.5% |
| 2 | Thu-Fri | Mar 5 | Mar 7 | 2 | 30% | 32.5% |
| 3 | Tue-Thu | Mar 3 | Mar 6 | 3 | 20% | 25% |
| 4 | Wed-Fri | Mar 4 | Mar 7 | 3 | 25% | 30% |

## Pass/Fail Criteria

For each scenario, extract **actual effective discount %** from the booking summary:
- `effective % = discountAmount / (itemPrice + discountAmount) × 100`

| Actual % | Interpretation |
|----------|----------------|
| Matches Model A (±1%) | **CONFIRMED: Arrival-Date model** |
| Matches Model B (±1%) | **CONFIRMED: Per-Night model** |
| Neither | **REFUTED: Neither model** (e.g. flat rate, different logic) |

## Test Execution

```powershell
# Multi-night logic (arrival vs per-night)
npx playwright test multi-night-discount-logic.spec.ts --project=chromium

# Comprehensive accuracy (all dates + shoulders)
npx playwright test dow-comprehensive-accuracy.spec.ts --project=chromium
```

## Test Results (January 31, 2026)

| Scenario | Actual % | Model A | Model B | Verdict |
|----------|----------|---------|---------|---------|
| 2-night Mon-Tue | 17.5% | 15% | 17.5% | **Per-night** ✓ |
| 2-night Thu-Fri | 32.5% | 30% | 32.5% | **Per-night** ✓ |
| 3-night Tue-Thu | 25% | 20% | 25% | **Per-night** ✓ |
| 3-night Wed-Fri | 30% | 25% | 30% | **Per-night** ✓ |

### Conclusion: **CONFIRMED - Per-Night Model**

The booking engine uses **Model B: the discount assigned to each night is applied to that night's rate**. The effective discount for a multi-night stay is the blended average of the per-night discounts.

This differs from DOW_MULTI_NIGHT_TEST_RESULTS.md (which reported flat 15%)—likely due to different JWT/config or backend state at that time. Current behavior: per-night model.

## Test Implementation
- Uses DOW booking flow (bookings.tripbeast.com) with direct hotel params
- Extracts Item Price and Discount from Summary of Charges
- Compares actual effective % to expected for both models
