# Multi-Night Discount Test Report

**Generated:** 2026-02-02T05:10:44.577Z
**Engine:** https://bookings.tripbeast.com (CUG / DOW)
**Plan:** MULTI_NIGHT_DISCOUNT_TEST_PLAN.md

## Summary

| Metric | Value |
|--------|-------|
| Properties tested | Longhorn Casino & Hotel, Hotel 2007, Interfaith Retreats, The Gallivant Times Square, Paramount, Now Now Noho |
| Scenarios per property | 4 (multi-night) |
| Total scenarios | 24 |
| Pass (matches per-night model) | 14 |
| Fail | 0 |
| Inconclusive (zero rate) | 10 |

---

## Configuration

### JWT Used
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI
```

### Base URL
https://bookings.tripbeast.com

### Properties Tested

- **Longhorn Casino & Hotel** – property_id: `12384405`, room_id: `201273159`
- **Hotel 2007** – property_id: `12384404`, room_id: `201273158`
- **Interfaith Retreats** – property_id: `82501881`, room_id: `327618641`
- **The Gallivant Times Square** – property_id: `5086`, room_id: `201726301`
- **Paramount** – property_id: `24245`, room_id: `201967771`
- **Now Now Noho** – property_id: `109701641`, room_id: `327435609`

---

## Test Results

### Longhorn Casino & Hotel — 2-night Mon-Tue

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $100.92 | $17.66 | 17.5% | 17.5% | pass |

### Longhorn Casino & Hotel — 2-night Thu-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $144.42 | $46.94 | 32.5% | 32.5% | pass |

### Longhorn Casino & Hotel — 3-night Tue-Thu

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $151.38 | $37.84 | 25% | 25% | pass |

### Longhorn Casino & Hotel — 3-night Wed-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $194.88 | $58.46 | 30% | 30% | pass |

### Hotel 2007 — 2-night Mon-Tue

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $0.00 | $0.00 | 0% | 17.5% | inconclusive |

![Hotel 2007 - 2-night Mon-Tue (inconclusive)](multi-night-report-screenshots/hotel-2007_2-night-mon-tue.png)

### Hotel 2007 — 2-night Thu-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $0.00 | $0.00 | 0% | 32.5% | inconclusive |

![Hotel 2007 - 2-night Thu-Fri (inconclusive)](multi-night-report-screenshots/hotel-2007_2-night-thu-fri.png)

### Hotel 2007 — 3-night Tue-Thu

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $0.00 | $0.00 | 0% | 25% | inconclusive |

![Hotel 2007 - 3-night Tue-Thu (inconclusive)](multi-night-report-screenshots/hotel-2007_3-night-tue-thu.png)

### Hotel 2007 — 3-night Wed-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $0.00 | $0.00 | 0% | 30% | inconclusive |

![Hotel 2007 - 3-night Wed-Fri (inconclusive)](multi-night-report-screenshots/hotel-2007_3-night-wed-fri.png)

### Interfaith Retreats — 2-night Mon-Tue

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $240.66 | $42.12 | 17.5% | 17.5% | pass |

### Interfaith Retreats — 2-night Thu-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $252.00 | $81.90 | 32.5% | 32.5% | pass |

### Interfaith Retreats — 3-night Tue-Thu

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $370.44 | $92.61 | 25% | 25% | pass |

### Interfaith Retreats — 3-night Wed-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $380.52 | $114.16 | 30% | 30% | pass |

### The Gallivant Times Square — 2-night Mon-Tue

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $0.00 | $0.00 | 0% | 17.5% | inconclusive |

![The Gallivant Times Square - 2-night Mon-Tue (inconclusive)](multi-night-report-screenshots/the-gallivant-times-square_2-night-mon-tue.png)

### The Gallivant Times Square — 2-night Thu-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $271.60 | $88.27 | 32.5% | 32.5% | pass |

### The Gallivant Times Square — 3-night Tue-Thu

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $0.00 | $0.00 | 0% | 25% | inconclusive |

![The Gallivant Times Square - 3-night Tue-Thu (inconclusive)](multi-night-report-screenshots/the-gallivant-times-square_3-night-tue-thu.png)

### The Gallivant Times Square — 3-night Wed-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $0.00 | $0.00 | 0% | 30% | inconclusive |

![The Gallivant Times Square - 3-night Wed-Fri (inconclusive)](multi-night-report-screenshots/the-gallivant-times-square_3-night-wed-fri.png)

### Paramount — 2-night Mon-Tue

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $244.00 | $42.70 | 17.5% | 17.5% | pass |

### Paramount — 2-night Thu-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $271.00 | $88.07 | 32.5% | 32.5% | pass |

### Paramount — 3-night Tue-Thu

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $0.00 | $0.00 | 0% | 25% | inconclusive |

![Paramount - 3-night Tue-Thu (inconclusive)](multi-night-report-screenshots/paramount_3-night-tue-thu.png)

### Paramount — 3-night Wed-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $402.00 | $120.60 | 30% | 30% | pass |

### Now Now Noho — 2-night Mon-Tue

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $152.60 | $26.70 | 17.5% | 17.5% | pass |

### Now Now Noho — 2-night Thu-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $0.00 | $0.00 | 0% | 32.5% | inconclusive |

![Now Now Noho - 2-night Thu-Fri (inconclusive)](multi-night-report-screenshots/now-now-noho_2-night-thu-fri.png)

### Now Now Noho — 3-night Tue-Thu

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $242.90 | $60.73 | 25% | 25% | pass |

### Now Now Noho — 3-night Wed-Fri

| Item Price | Discount | Effective % | Expected % | Verdict |
|------------|----------|-------------|------------|---------|
| $0.00 | $0.00 | 0% | 30% | inconclusive |

![Now Now Noho - 3-night Wed-Fri (inconclusive)](multi-night-report-screenshots/now-now-noho_3-night-wed-fri.png)


---

## Pass/Fail Rules

- **Pass:** Effective % matches expected per-night blended average (±1%)
- **Fail:** Effective % does not match expected
- **Inconclusive:** Zero rate (no price returned)

---

## Sample Booking URL

```
https://bookings.tripbeast.com/?jwt=<JWT> then navigate to hotel-booking with params
https://bookings.tripbeast.com/hotel/hotel-booking?checkin=2026-03-02&checkout=2026-03-04&adults=1&children=&hotel_id=2008&property_id=12384405&room_id=201273159&search_query=Las+Vegas&mobile_promotion=false&longitude=-115.141376&latitude=36.17006&type=id&gds=expedia&jwt=<JWT>
```
