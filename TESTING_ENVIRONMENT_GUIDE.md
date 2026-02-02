# Tripbeast Discount Rules - Testing Environment Guide

**Date:** January 31, 2026  
**Status:** ✅ Ready for Testing

---

## 🎯 Your Testing Environments

### Environment 1: Ancillary (`travel.tripbeast.com`)
**JWT Secret:** `LULX6HXY7L` ✅ VERIFIED  
**Customer:** Tripbeast Ancillary  
**Admin Panel:** `admin.rezmatestage.com` → Tripbeast Ancillary customer  

**Default JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiIiLCJjbGllbnRMb2dvVXJsIjoiIiwibWVtYmVyc2hpcCI6ZmFsc2UsImlhdCI6MTc2ODg5NDQwMn0.MpE_ewPTnBTDW3bGyo0U7hiMcvIWLV0V5I_EPOQIBkg
```

**Payload Structure:**
```json
{
  "partnerName": "tripBeast",
  "userFirstName": "",
  "userLastName": "",
  "userEmail": "",
  "pricingRuleId": "",
  "businessRuleId": "",
  "clientLogoUrl": "",
  "membership": false,
  "iat": 1768894402
}
```

**Note:** No `discountRuleId` field in default JWT

---

### Environment 2: CUG / Skyline Voyages (`bookings.tripbeast.com`)
**JWT Secret:** ❌ UNKNOWN (not in `admin.rezmatestage.com`)  
**Customer:** Skyline Voyages  
**Admin Panel:** ❓ Unknown location

**Default JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI
```

**Payload Structure:**
```json
{
  "partnerName": "ExplorePro",
  "userFirstName": "Skyline",
  "userLastName": "Voyages",
  "userEmail": "skyline.cus@yopmail.com",
  "pricingRuleId": "3de108d0-7994-4957-a9bd-dc2a7c056186",
  "businessRuleId": "d5228803-c475-4972-81b5-0420431f1608",
  "spendingLimit": "10875.0",
  "payCyclesPerYear": 12,
  "clientLogoUrl": "",
  "returnUrl": "https://partner-app.rezmate.com",
  "cartPayloadUrl": "https://partner-app.rezmate.com/api/partner",
  "partnerCartUrl": "https://partner-app.rezmate.com",
  "returnAuth": "3fb88d69-1d3e-3418-a970-5314255c10a2",
  "iat": 1729494262
}
```

**Note:** No `discountRuleId` field in default JWT

---

## 🔍 Investigation Results

### What We Tested:
I verified the JWT secrets from `admin.rezmatestage.com` against your working JWTs:

| Secret | Ancillary JWT | CUG JWT |
|--------|--------------|---------|
| `voyager_travel` | ❌ No match | ❌ No match |
| `123456789` | ❌ No match | ❌ No match |
| `LULX6HXY7L` | ✅ **MATCH** | ❌ No match |

### Conclusion:
- **Ancillary** (`travel.tripbeast.com`) is managed by the "Tripbeast Ancillary" customer in `admin.rezmatestage.com`
- **CUG** (`bookings.tripbeast.com`) is managed by a DIFFERENT admin panel (not `admin.rezmatestage.com`)
- The CUG JWT secret is unknown and needs to be obtained from your team or a different admin panel

---

## 🚀 What We CAN Do Now

### Option 1: Test Discount Rules on Ancillary (`travel.tripbeast.com`)
✅ We have the JWT secret: `LULX6HXY7L`  
✅ We can generate new JWTs with `discountRuleId`  
✅ We can test discount rules immediately  

**Steps:**
1. Create discount rules in `admin.rezmatestage.com` for Tripbeast Ancillary customer
2. Generate JWT with `discountRuleId` using secret `LULX6HXY7L`
3. Test on `https://travel.tripbeast.com`

### Option 2: Find CUG JWT Secret
❌ We need the JWT secret for `bookings.tripbeast.com`  
❓ Check with your team for:
- Production admin panel URL
- Environment variables/config files
- DevOps team

---

## 📋 Discount Rules Found in Admin Panel

From `admin.rezmatestage.com` → Skyline Voyages customer:

### Rule #1: Bill Discount
**ID:** `f73356ed-4b76-4649-9ef4-f97abab1ab5a`  
**Hotels:**
- Default: 5%
- Date Range: Feb 1-14, 2026 → 10%

### Rule #2: Discount Voyag  
**ID:** `07883db1-759d-4589-8f13-8a008c081ae8`  
**Hotels:**
- Default: 5%

**⚠️ Important:** These discount rules are in the Skyline Voyages customer, but we don't have the JWT secret for `bookings.tripbeast.com` yet, so we can't test them there.

---

## 🔧 Next Steps

### Immediate Actions:
1. **Find the JWT secret for `bookings.tripbeast.com` (CUG/Skyline)**
   - Ask your DevOps team
   - Check environment variables
   - Look for production admin panel URL

2. **OR Create discount rules for Ancillary**
   - Go to `admin.rezmatestage.com`
   - Navigate to Tripbeast Ancillary customer
   - Create discount rules
   - Generate JWTs using secret `LULX6HXY7L`
   - Test on `travel.tripbeast.com`

### Once We Have the CUG Secret:
1. Update `generate-jwt.js` with the correct secret
2. Generate JWTs with discount rule IDs
3. Test on `bookings.tripbeast.com`
4. Verify discount calculations
5. Check strike-through pricing display

---

## 📁 Files Created

1. ✅ `test-jwt-secrets.js` - Script to verify JWT signatures
2. ✅ `generate-jwt.js` - JWT generator (needs CUG secret update)
3. ✅ `generate-jwt-production.js` - Production JWT generator (needs CUG secret)
4. ✅ This guide

---

## ❓ Questions for Your Team

1. **Where is the admin panel for `bookings.tripbeast.com`?**
   - Is there a production admin panel?
   - Different URL than `admin.rezmatestage.com`?

2. **What is the JWT secret for the CUG/Skyline Voyages booking engine?**
   - Environment variable name?
   - Configuration file location?

3. **Are discount rules already configured for `bookings.tripbeast.com`?**
   - If yes, what are the discount rule IDs?
   - If no, should we create them in the admin panel first?

---

## 🎯 Current Status

| Task | Status |
|------|--------|
| Decode JWTs | ✅ Complete |
| Find Ancillary JWT secret | ✅ Complete (`LULX6HXY7L`) |
| Find CUG JWT secret | ❌ Blocked |
| Create discount rules | ⏳ Pending (need to know which environment) |
| Test discount rules | ⏳ Pending (need JWT secret) |

---

## 💡 Recommendation

**Option A (Fastest):**  
If you can get the CUG JWT secret from your team quickly, I can immediately:
1. Update the JWT generation scripts
2. Generate JWTs with discount rule IDs
3. Test discount rules on `bookings.tripbeast.com`

**Option B (Alternative):**  
If the CUG secret is hard to find, we can:
1. Create discount rules for Tripbeast Ancillary in the admin panel
2. Generate JWTs with `LULX6HXY7L` secret
3. Test discount rules on `travel.tripbeast.com` right now

Which would you like to proceed with?
