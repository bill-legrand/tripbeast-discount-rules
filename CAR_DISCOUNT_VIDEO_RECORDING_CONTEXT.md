# Car Discount Testing - Video Recording Context

## Current Task
Create a video recording of the complete car discount flow: JWT connection → Login with MFA → Car search → View results with discounts

## What We've Done

### 1. JWT Configuration Summary
**Discount Rule:** Ancii Stage DR  
**Customer:** Tripbeast Ancillary  
**Channel:** TripBeast (partnerName: "tripBeast")

**IDs:**
- Discount Rule ID: `eb511fff-19b8-4a27-91d5-dd8e69f31809`
- Business Rule ID: `aa4c786b-6516-4cf8-be1c-29e458dcf1f6`
- JWT Secret: `LULX6HXY7L`

**Fresh JWT (Generated 2026-02-05):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzcwMjc0NTYwfQ.qYMaj4Qe2-D_9luxV-_YNWCIbvQk3p78tECxuwbtRBA
```

### 2. Test Login Credentials
- **Email:** bill.legrand.test@yopmail.com
- **Password:** Tester123123!
- **MFA:** Retrieved automatically from yopmail

### 3. Discount Schedule (March 15-28)
Period 3 uses DOW-based discounts:
- Sunday: 10%
- Monday: 15%
- Tuesday: 20%
- Wednesday: 25%
- Thursday: 30%
- Friday: 35%
- Saturday: 5%

**March 15-22 (7-day rental) Expected Average: 20%**

### 4. Completed Manual Test Flow (with screenshots)
Successfully captured 9 screenshots documenting:
1. JWT connection (URL shows JWT, "Login" visible)
2. Login page
3. Credentials entered
4. MFA prompt
5. Yopmail showing MFA code (475380)
6. MFA code entered
7. Successfully logged in ("My Bookings" + "LOGOUT" visible)
8. Car search initiated

### 5. Issue Discovered
**Las Vegas Strip Search (March 15-22):**
- **Not logged in:** 11 cars found, but message says "Become a member to access discounted rates"
- **Logged in:** **0 cars found** - "No results found"

This suggests an issue with authenticated car searches or inventory availability.

## Current Request
**Change location from Las Vegas Strip (LAS) to Phoenix Sky Harbor (PHX)** and record video of the complete flow.

## Files Created

### Video Recording Script
Location: `record-car-flow-phx.ts`

This Playwright script records the complete flow:
1. Navigate with JWT
2. Login
3. Retrieve MFA from yopmail
4. Complete authentication
5. Search cars at PHX for March 15-22
6. Scroll through results

**To run:**
```bash
npx ts-node record-car-flow-phx.ts
```

Video will be saved to `./videos/` directory.

## Search Parameters for PHX

**Pickup:** Phoenix Sky Harbor International Airport (PHX)  
**Dropoff:** Phoenix Sky Harbor International Airport (PHX)  
**Pickup Date:** March 15, 2026, 10:00 AM  
**Dropoff Date:** March 22, 2026, 10:00 AM  
**Renter Age:** 30  
**Duration:** 7 days

**Direct URL with PHX:**
```
https://travel.tripbeast.com/car?pickup_date=2026-03-15T10:00:00&pickup_time=2026-02-04T10:00&dropoff_date=2026-03-22T10:00:00&dropoff_time=2026-02-04T10:00&pickup_location_full_name=Phoenix%20Sky%20Harbor%20International%20Airport&dropoff_location_full_name=Phoenix%20Sky%20Harbor%20International%20Airport&pickup_code=PHX&dropoff_code=PHX&age=30&pickup_location_name=Phoenix%20Sky%20Harbor%20International%20Airport&dropoff_location_name=Phoenix%20Sky%20Harbor%20International%20Airport
```

## Key Questions to Answer in New Session

1. **Does PHX show car inventory when logged in?** (Unlike LAS which showed 0 results)
2. **Are discounts visible on car prices?** Look for strikethrough prices or discount indicators
3. **What's the actual price difference?** Compare to non-authenticated prices if available
4. **Does the "Become a member to access discounted rates" message disappear when logged in?**

## Next Steps

1. Run the video recording script with PHX
2. Analyze the results to see if:
   - Cars are available (unlike LAS)
   - Discounts are applied and visible
   - The 20% average discount matches expectations
3. If successful, document the working flow
4. If issues persist, investigate why authenticated car searches fail

## Related Files
- `tests/helpers/car-discount-data.ts` - JWT and discount configuration
- `generate-jwt-ancillary.js` - JWT generation script
- `tests/car/car-comprehensive-with-login.spec.ts` - Automated test with login

## Screenshots Location
Manual test screenshots saved in:
`C:\Users\billl\AppData\Local\Temp\cursor-browser-extension\1770274579371\`

Files: step1-jwt-connected.png through step9-car-search-no-results.png
