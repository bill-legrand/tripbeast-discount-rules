# Complete JWT & Discount Rules Summary

**Date:** January 31, 2026  
**Purpose:** Testing Discount Rules for Skyline Voyages

---

## 🔍 Key Findings

### JWT Secrets by Customer/Channel (Staging):

| Customer | Distribution Channel | JWT Secret | Environment |
|----------|---------------------|------------|-------------|
| **Skyline Voyages** | Voyager Travel Platform | `voyager_travel` | STAGING |
| TripBeast | Trip Beast Channel | `123456789` | STAGING |
| Tripbeast Ancillary | TripBeast | `LULX6HXY7L` | STAGING |

### Production Status:
- ⚠️ **Production** (`bookings.tripbeast.com`) does NOT include `discountRuleId` field in JWT
- The discount rules feature appears to be **staging-only** at this time
- Your working production JWT is valid but won't apply discount rules

---

## ✅ Available Discount Rules (Staging Admin)

**Customer:** Skyline Voyages  
**Distribution Channel:** Voyager Travel Platform

### Rule #1: Bill Discount
**ID:** `f73356ed-4b76-4649-9ef4-f97abab1ab5a`

**Hotels Configuration:**
- Default: 5%
- Date Range: Feb 1-14, 2026 → **10%**
- Specific Dates: Jan 31, Feb 1-7 with 5-10%

---

### Rule #2: Discount Voyag (Low Rate Discount)
**ID:** `07883db1-759d-4589-8f13-8a008c081ae8`

**Hotels Configuration:**
- Default: 5% only
- ⚠️ No date range discounts configured yet
- ⚠️ No dynamic rules (rates under $100) configured yet

---

## 🔧 Critical Fix Applied

**businessRuleId Correction:**
- ❌ OLD: `d5228803-c475-4972-81b5-04204431f1608`  
- ✅ NEW: `d5228803-c475-4972-81b5-0420431f1608` (missing the `4`)

This was causing "invalid signature" errors. The generate-jwt.js script has been updated.

---

## 🔑 Working JWTs for STAGING Testing

### JWT #1: Bill Discount (10% for Feb 1-14, 2026)

**Test on Staging:**
```
https://bookings.rezmatestage.com/?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsImRpc2NvdW50UnVsZUlkIjoiZjczMzU2ZWQtNGI3Ni00NjQ5LTllZjQtZjk3YWJhYjFhYjVhIiwic3BlbmRpbmdMaW1pdCI6IjEwODc1LjAiLCJwYXlDeWNsZXNQZXJZZWFyIjoxMiwiY2xpZW50TG9nb1VybCI6IiIsInJldHVyblVybCI6Imh0dHBzOi8vcGFydG5lci1hcHAucmV6bWF0ZS5jb20iLCJjYXJ0UGF5bG9hZFVybCI6Imh0dHBzOi8vcGFydG5lci1hcHAucmV6bWF0ZS5jb20vYXBpL3BhcnRuZXIiLCJwYXJ0bmVyQ2FydFVybCI6Imh0dHBzOi8vcGFydG5lci1hcHAucmV6bWF0ZS5jb20iLCJyZXR1cm5BdXRoIjoiM2ZiODhkNjktMWQzZS0zNDE4LWE5NzAtNTMxNDI1NWMxMGEyIiwiaWF0IjoxNzY5ODk0ODM0fQ.Ok4-1zO-rv0bR6p_ltfnVQaJIM4zoR0YD3-V2wz7gSM&page=hotel&check_in=2026-02-05&check_out=2026-02-06&city=Las%20Vegas
```

**Expected Result:** 10% discount on hotel rates (Feb 5 is within Feb 1-14 range)

---

### JWT #2: Discount Voyag (5% Default)

**Test on Staging:**
```
https://bookings.rezmatestage.com/?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsImRpc2NvdW50UnVsZUlkIjoiMDc4ODNkYjEtNzU5ZC00NTg5LThmMTMtOGEwMDhjMDgxYWU4Iiwic3BlbmRpbmdMaW1pdCI6IjEwODc1LjAiLCJwYXlDeWNsZXNQZXJZZWFyIjoxMiwiY2xpZW50TG9nb1VybCI6IiIsInJldHVyblVybCI6Imh0dHBzOi8vcGFydG5lci1hcHAucmV6bWF0ZS5jb20iLCJjYXJ0UGF5bG9hZFVybCI6Imh0dHBzOi8vcGFydG5lci1hcHAucmV6bWF0ZS5jb20vYXBpL3BhcnRuZXIiLCJwYXJ0bmVyQ2FydFVybCI6Imh0dHBzOi8vcGFydG5lci1hcHAucmV6bWF0ZS5jb20iLCJyZXR1cm5BdXRoIjoiM2ZiODhkNjktMWQzZS0zNDE4LWE5NzAtNTMxNDI1NWMxMGEyIiwiaWF0IjoxNzY5ODk0NjA1fQ.2Kyw3yOVTTZjWSBAjktocl6JuNu1DY8bWETUUS_5zzI&page=hotel&check_in=2026-02-05&check_out=2026-02-06&city=Las%20Vegas
```

**Expected Result:** 5% discount on all hotel rates

---

## 🚀 How to Generate New JWTs

### For Staging (WITH discountRuleId):

```bash
# Bill Discount (10% for Feb 1-14)
node generate-jwt.js f73356ed-4b76-4649-9ef4-f97abab1ab5a

# Discount Voyag (5% default)
node generate-jwt.js 07883db1-759d-4589-8f13-8a008c081ae8
```

### For Production (WITHOUT discountRuleId):

```bash
node generate-jwt-production.js
```

**Note:** Production tokens won't apply discount rules since the feature isn't deployed there yet.

---

## 📝 JWT Payload Structure

### Staging (WITH Discount Rules):
```json
{
  "partnerName": "ExplorePro",
  "userFirstName": "Skyline",
  "userLastName": "Voyages",
  "userEmail": "skyline.cus@yopmail.com",
  "pricingRuleId": "3de108d0-7994-4957-a9bd-dc2a7c056186",
  "businessRuleId": "d5228803-c475-4972-81b5-0420431f1608",
  "discountRuleId": "f73356ed-4b76-4649-9ef4-f97abab1ab5a",  // ← THIS FIELD
  "spendingLimit": "10875.0",
  "payCyclesPerYear": 12,
  "clientLogoUrl": "",
  "returnUrl": "https://partner-app.rezmate.com",
  "cartPayloadUrl": "https://partner-app.rezmate.com/api/partner",
  "partnerCartUrl": "https://partner-app.rezmate.com",
  "returnAuth": "3fb88d69-1d3e-3418-a970-5314255c10a2",
  "iat": 1769894834
}
```

### Production (NO Discount Rules):
```json
{
  "partnerName": "ExplorePro",
  "userFirstName": "Skyline",
  "userLastName": "Voyages",
  "userEmail": "skyline.cus@yopmail.com",
  "pricingRuleId": "3de108d0-7994-4957-a9bd-dc2a7c056186",
  "businessRuleId": "d5228803-c475-4972-81b5-0420431f1608",
  // NO discountRuleId field
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

---

## ⚠️ Important Notes

1. **Staging vs Production:**
   - Staging: `bookings.rezmatestage.com` - Supports discount rules ✅
   - Production: `bookings.tripbeast.com` - Does NOT support discount rules yet ❌

2. **Admin Panel Access:**
   - Staging Admin: `https://admin.rezmatestage.com`
   - Navigate to: Management → Customers → Skyline Voyages → Distribution Channel → Voyager Travel Platform

3. **Testing Recommendation:**
   - Use **Staging** environment for all discount rule testing
   - Test dates in February 2026 to validate the 10% discount (Feb 1-14 range)
   - Production testing won't show discounts until the feature is deployed there

4. **Next Steps to Enable Your Test Data:**
   - Update "Discount Voyag" rule in admin panel to add:
     - Date Range: April 1-15, 2026 with 2% discount
     - Dynamic Rule: Apply only to rates under $100

---

## 📚 Files Created/Modified

1. ✅ `generate-jwt.js` - Fixed `businessRuleId` (staging, with discountRuleId)
2. ✅ `generate-jwt-production.js` - New file (production, without discountRuleId)
3. ✅ `JWT_TESTING_GUIDE.md` - Previous version (outdated)
4. ✅ This file - Complete summary with all findings

---

## 🎯 Quick Test Commands

```bash
# Generate JWT for Bill Discount (10% Feb 1-14)
node generate-jwt.js f73356ed-4b76-4649-9ef4-f97abab1ab5a

# Test in browser (Staging only - copy the JWT from output)
# https://bookings.rezmatestage.com/?jwt=YOUR_JWT_HERE&page=hotel&check_in=2026-02-05&check_out=2026-02-06&city=Las%20Vegas
```
