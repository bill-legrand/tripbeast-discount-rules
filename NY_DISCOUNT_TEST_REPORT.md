# New York Discount Test Report

**Generated:** 2026-02-01T22:53:51.539Z
**Engine:** https://travel.tripbeast.com (Ancillary)

## Summary

| Metric | Value |
|--------|-------|
| Properties tested | 2 (Interfaith Retreats, The Gallivant Times Square) |
| Scenarios per property | 12 (single-night, shoulder, multi-night) |
| Total scenarios | 24 |
| Discount observed | 0% (Ancillary discount rule may not apply to NY/March dates) |
| Interfaith Retreats | All 12 scenarios OK – prices extracted successfully |
| The Gallivant Times Square | Partial – some scenarios returned $0 (availability/timing) |

---

## Configuration

### JWT Used
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzY5OTg2MTcyfQ.WMDETf4k3whx376_KEAWRSn2_rEHKBbhHqnNtX7Eh9s
```

### Base URL
https://travel.tripbeast.com

### Auth URL (JWT in query)
https://travel.tripbeast.com/?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyT...

### Properties Tested

- **Interfaith Retreats**
  - hotel_id: `2621`
  - property_id: `82501881`
  - room_id: `327618641`
  - search_query: New York

- **The Gallivant Times Square**
  - hotel_id: `2621`
  - property_id: `5086`
  - room_id: `201726301`
  - search_query: New York

---

## Test Results

| Hotel | Scenario | Check-In | Item Price | Discount | Total | Effective % | Status |
|-------|----------|----------|------------|----------|-------|-------------|--------|
| Interfaith Retreats | 1N Mon | 2026-03-02 | $131.67 | $0.00 | $131.67 | 0% | OK |
| Interfaith Retreats | 1N Tue | 2026-03-03 | $134.44 | $0.00 | $134.44 | 0% | OK |
| Interfaith Retreats | 1N Wed | 2026-03-04 | $135.83 | $0.00 | $135.83 | 0% | OK |
| Interfaith Retreats | 1N Thu | 2026-03-05 | $133.06 | $0.00 | $133.06 | 0% | OK |
| Interfaith Retreats | 1N Fri | 2026-03-06 | $145.53 | $0.00 | $145.53 | 0% | OK |
| Interfaith Retreats | 1N Sat | 2026-03-07 | $141.37 | $0.00 | $141.37 | 0% | OK |
| Interfaith Retreats | 1N Sun | 2026-03-08 | $130.28 | $0.00 | $130.28 | 0% | OK |
| Interfaith Retreats | 1N Mar 1 (shoulder) | 2026-03-01 | $130.28 | $0.00 | $130.28 | 0% | OK |
| Interfaith Retreats | 1N Mar 9 (shoulder) | 2026-03-09 | $127.51 | $0.00 | $127.51 | 0% | OK |
| Interfaith Retreats | 2N Mon-Tue | 2026-03-02 | $266.11 | $0.00 | $266.11 | 0% | OK |
| Interfaith Retreats | 3N Tue-Thu | 2026-03-03 | $403.33 | $0.00 | $403.33 | 0% | OK |
| Interfaith Retreats | 7N full week | 2026-03-02 | $952.18 | $0.00 | $952.18 | 0% | OK |
| The Gallivant Times Square | 1N Mon | 2026-03-02 | $0.00 | $0.00 | $0.00 | 0% | OK |
| The Gallivant Times Square | 1N Tue | 2026-03-03 | $139.43 | $0.00 | $161.62 | 0% | OK |
| The Gallivant Times Square | 1N Wed | 2026-03-04 | $0.00 | $0.00 | $0.00 | 0% | OK |
| The Gallivant Times Square | 1N Thu | 2026-03-05 | $131.18 | $0.00 | $152.27 | 0% | OK |
| The Gallivant Times Square | 1N Fri | 2026-03-06 | $188.93 | $0.00 | $217.77 | 0% | OK |
| The Gallivant Times Square | 1N Sat | 2026-03-07 | $0.00 | $0.00 | $0.00 | 0% | OK |
| The Gallivant Times Square | 1N Sun | 2026-03-08 | $98.18 | $0.00 | $114.83 | 0% | OK |
| The Gallivant Times Square | 1N Mar 1 (shoulder) | 2026-03-01 | $0.00 | $0.00 | $0.00 | 0% | OK |
| The Gallivant Times Square | 1N Mar 9 (shoulder) | 2026-03-09 | $131.18 | $0.00 | $152.26 | 0% | OK |
| The Gallivant Times Square | 2N Mon-Tue | 2026-03-02 | $0.00 | $0.00 | $0.00 | 0% | OK |
| The Gallivant Times Square | 3N Tue-Thu | 2026-03-03 | $0.00 | $0.00 | $0.00 | 0% | OK |
| The Gallivant Times Square | 7N full week | 2026-03-02 | $0.00 | $0.00 | $0.00 | 0% | OK |

---

## Sample Booking URLs

### Full URL Format
Authenticate first: `https://travel.tripbeast.com/?jwt=<JWT>`
Then navigate to booking, or append JWT: `https://travel.tripbeast.com/hotel/hotel-booking?jwt=<JWT>&...params...`

### Interfaith Retreats (property_id 82501881)
```
https://travel.tripbeast.com/hotel/hotel-booking?search_query=New+York&hotel_id=2621&checkin=2026-03-02&checkout=2026-03-03&adults=1&children=&property_id=82501881&room_id=327618641&mobile_promotion=false&longitude=-74.005966&latitude=40.712843&type=id&gds=expedia&jwt=<JWT>
```

### The Gallivant Times Square (property_id 5086)
```
https://travel.tripbeast.com/hotel/hotel-booking?search_query=New+York&hotel_id=2621&checkin=2026-03-02&checkout=2026-03-03&adults=1&children=&property_id=5086&room_id=201726301&mobile_promotion=false&longitude=-74.005966&latitude=40.712843&type=id&gds=expedia&jwt=<JWT>
```

> Replace `<JWT>` with the token from Configuration section above.
