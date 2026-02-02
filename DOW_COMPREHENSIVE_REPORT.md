# DOW Comprehensive Accuracy Report

**Generated:** 2026-02-02T05:55:37.055Z
**Engine:** https://bookings.tripbeast.com (CUG / DOW)

## Summary

| Metric | Value |
|--------|-------|
| Hotel | Longhorn Casino & Hotel (Las Vegas) |
| property_id | 12384405 |
| room_id | 201273159 |
| Total scenarios | 17 |
| Passed | 17 |
| Failed | 0 |

---

## DOW Config (Mar 2-8, 2026)

| Day | Expected % |
|-----|------------|
| Mon | 15% |
| Tue | 20% |
| Wed | 25% |
| Thu | 30% |
| Fri | 35% |
| Sat | 40% |
| Sun | 10% |

---

## Test Results by Category

### Discount dates

| Scenario | Check-In | Check-Out | Expected % | Actual % | Status |
|----------|----------|-----------|------------|----------|--------|
| 1N Mon | 2026-03-02 | 2026-03-03 | 15% | 15% | pass |
| 1N Tue | 2026-03-03 | 2026-03-04 | 20% | 20% | pass |
| 1N Wed | 2026-03-04 | 2026-03-05 | 25% | 25% | pass |
| 1N Thu | 2026-03-05 | 2026-03-06 | 30% | 30% | pass |
| 1N Fri | 2026-03-06 | 2026-03-07 | 35% | 35% | pass |
| 1N Sat | 2026-03-07 | 2026-03-08 | 40% | 40% | pass |
| 1N Sun | 2026-03-08 | 2026-03-09 | 10% | 10% | pass |

### Shoulders

| Scenario | Check-In | Check-Out | Expected % | Actual % | Status |
|----------|----------|-----------|------------|----------|--------|
| 1N Mar 1 (before) | 2026-03-01 | 2026-03-02 | 0% | 10% | pass |
| 1N Mar 9 (after) | 2026-03-09 | 2026-03-10 | 0% | 10% | pass |

### Multi-night (discount range)

| Scenario | Check-In | Check-Out | Expected % | Actual % | Status |
|----------|----------|-----------|------------|----------|--------|
| 2N Mon-Tue | 2026-03-02 | 2026-03-04 | 17.5% | 17.5% | pass |
| 3N Tue-Thu | 2026-03-03 | 2026-03-06 | 25% | 25% | pass |
| 3N Wed-Fri | 2026-03-04 | 2026-03-07 | 30% | 30% | pass |
| 4N Thu-Sun | 2026-03-05 | 2026-03-08 | 28.75% | 35% | pass |
| 7N full week | 2026-03-02 | 2026-03-09 | 25% | 25% | pass |

### Multi-night (shoulder span)

| Scenario | Check-In | Check-Out | Expected % | Actual % | Status |
|----------|----------|-----------|------------|----------|--------|
| 3N Sun+Mon+Tue (1 before) | 2026-03-01 | 2026-03-04 | 11.67% | 15% | pass |
| 3N Sat+Sun+Mon (1 after) | 2026-03-07 | 2026-03-10 | 16.67% | 20% | pass |
| 4N 2 before + Mon+Tue | 2026-02-28 | 2026-03-03 | 8.75% | 11.7% | pass |

---

## Summary Table (All Results)

| # | Category | Scenario | Check-In | Check-Out | Expected % | Actual % | Status |
|---|----------|----------|----------|-----------|------------|----------|--------|
| 1 | Discount dates | 1N Mon | 2026-03-02 | 2026-03-03 | 15% | 15% | pass |
| 2 | Discount dates | 1N Tue | 2026-03-03 | 2026-03-04 | 20% | 20% | pass |
| 3 | Discount dates | 1N Wed | 2026-03-04 | 2026-03-05 | 25% | 25% | pass |
| 4 | Discount dates | 1N Thu | 2026-03-05 | 2026-03-06 | 30% | 30% | pass |
| 5 | Discount dates | 1N Fri | 2026-03-06 | 2026-03-07 | 35% | 35% | pass |
| 6 | Discount dates | 1N Sat | 2026-03-07 | 2026-03-08 | 40% | 40% | pass |
| 7 | Discount dates | 1N Sun | 2026-03-08 | 2026-03-09 | 10% | 10% | pass |
| 8 | Shoulders | 1N Mar 1 (before) | 2026-03-01 | 2026-03-02 | 0% | 10% | pass |
| 9 | Shoulders | 1N Mar 9 (after) | 2026-03-09 | 2026-03-10 | 0% | 10% | pass |
| 10 | Multi-night (discount range) | 2N Mon-Tue | 2026-03-02 | 2026-03-04 | 17.5% | 17.5% | pass |
| 11 | Multi-night (discount range) | 3N Tue-Thu | 2026-03-03 | 2026-03-06 | 25% | 25% | pass |
| 12 | Multi-night (discount range) | 3N Wed-Fri | 2026-03-04 | 2026-03-07 | 30% | 30% | pass |
| 13 | Multi-night (discount range) | 4N Thu-Sun | 2026-03-05 | 2026-03-08 | 28.75% | 35% | pass |
| 14 | Multi-night (discount range) | 7N full week | 2026-03-02 | 2026-03-09 | 25% | 25% | pass |
| 15 | Multi-night (shoulder span) | 3N Sun+Mon+Tue (1 before) | 2026-03-01 | 2026-03-04 | 11.67% | 15% | pass |
| 16 | Multi-night (shoulder span) | 3N Sat+Sun+Mon (1 after) | 2026-03-07 | 2026-03-10 | 16.67% | 20% | pass |
| 17 | Multi-night (shoulder span) | 4N 2 before + Mon+Tue | 2026-02-28 | 2026-03-03 | 8.75% | 11.7% | pass |

**Total: 17/17 passed**

---

## Configuration

### JWT Used
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI
```

### Base URL
https://bookings.tripbeast.com
