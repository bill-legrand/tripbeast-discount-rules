# JWT Testing Guide - Skyline Voyages Discount Rules

**Generated:** January 31, 2026  
**Customer:** Skyline Voyages  
**Distribution Channel:** Voyager Travel Platform  
**Partner:** ExplorePro Partners  
**JWT Secret:** `voyager_travel`

---

## 📋 Available Discount Rules (Verified in Admin Panel)

### **Option 1: Bill Discount** ✅ ACTIVE NOW
**Discount Rule ID:** `f73356ed-4b76-4649-9ef4-f97abab1ab5a`

**Hotels Configuration:**
- **Default Discount:** 5%
- **Date Range Discount:** Feb 1-14, 2026 → **10%**
- **Specific Date Discounts:** Jan 31, Feb 1-7 with 5-10%

**Best for Testing:** Use dates in **February 1-14, 2026** to test the 10% discount

---

### **Option 2: Discount Voyag** (Low Rate Discount)
**Discount Rule ID:** `07883db1-759d-4589-8f13-8a008c081ae8`

**Hotels Configuration:**
- **Default Discount:** 5%
- **No Date Range Discounts**
- **No Dynamic Rules configured yet**

**⚠️ NOTE:** This rule currently only has a 5% default discount. Your test data expects 2% discount on rates under $100 for April 1-15, but those rules are NOT configured in the admin panel yet.

---

## 🔑 JWT Tokens for Testing

### **JWT #1: Bill Discount (10% for Feb 1-14)**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0NDMxZjE2MDgiLCJkaXNjb3VudFJ1bGVJZCI6ImY3MzM1NmVkLTRiNzYtNDY0OS05ZWY0LWY5N2FiYWIxYWI1YSIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTc2OTg5NDU0N30.RwR_Q0UnD-5PA_3EqExsBzyq0iJuM9Qh63FtN27XrrU
```

---

### **JWT #2: Discount Voyag (5% Default)**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0NDMxZjE2MDgiLCJkaXNjb3VudFJ1bGVJZCI6IjA3ODgzZGIxLTc1OWQtNDU4OS04ZjEzLThhMDA4YzA4MWFlOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTc2OTg5NDYwNX0.2Kyw3yOVTTZjWSBAjktocl6JuNu1DY8bWETUUS_5zzI
```

---

## 🌐 Booking Engine Test URLs

### **Test Scenario 1: Bill Discount with 10% (Feb 5-6, 2026)**

**Staging:**
```
https://bookings.rezmatestage.com/?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0NDMxZjE2MDgiLCJkaXNjb3VudFJ1bGVJZCI6ImY3MzM1NmVkLTRiNzYtNDY0OS05ZWY0LWY5N2FiYWIxYWI1YSIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTc2OTg5NDU0N30.RwR_Q0UnD-5PA_3EqExsBzyq0iJuM9Qh63FtN27XrrU&page=hotel&check_in=2026-02-05&check_out=2026-02-06&city=Las%20Vegas
```

**Production:**
```
https://bookings.tripbeast.com/?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0NDMxZjE2MDgiLCJkaXNjb3VudFJ1bGVJZCI6ImY3MzM1NmVkLTRiNzYtNDY0OS05ZWY0LWY5N2FiYWIxYWI1YSIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTc2OTg5NDU0N30.RwR_Q0UnD-5PA_3EqExsBzyq0iJuM9Qh63FtN27XrrU&page=hotel&check_in=2026-02-05&check_out=2026-02-06&city=Las%20Vegas
```

**Expected Result:** 10% discount on hotel rates

---

### **Test Scenario 2: Discount Voyag with 5% Default**

**Staging:**
```
https://bookings.rezmatestage.com/?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0NDMxZjE2MDgiLCJkaXNjb3VudFJ1bGVJZCI6IjA3ODgzZGIxLTc1OWQtNDU4OS04ZjEzLThhMDA4YzA4MWFlOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTc2OTg5NDYwNX0.2Kyw3yOVTTZjWSBAjktocl6JuNu1DY8bWETUUS_5zzI&page=hotel&check_in=2026-02-05&check_out=2026-02-06&city=Las%20Vegas
```

**Expected Result:** 5% discount on all hotel rates

---

## ✅ How to Verify Discounts

### **Method 1: Visual Inspection**

1. Open the booking engine URL with JWT
2. Search for hotels (e.g., Las Vegas, Feb 5-6, 2026)
3. Look for:
   - **Discounted price displayed**
   - **Strike-through on original price** (if enabled)
   - **Discount percentage or amount shown**

### **Method 2: Calculate Manually**

For a hotel with rate **$100/night**:

- **Bill Discount (10% for Feb 1-14):**
  - Original: $100
  - Discount: $10
  - Final: $90

- **Discount Voyag (5% default):**
  - Original: $100
  - Discount: $5
  - Final: $95

### **Method 3: Browser DevTools Network Tab**

1. Open DevTools (F12)
2. Go to Network tab
3. Filter for XHR/Fetch requests
4. Look for hotel search API responses
5. Check for `discount`, `discountAmount`, or `discountPercentage` fields in JSON response

---

## 🔧 Regenerating JWTs

If you need to regenerate tokens with different discount rule IDs:

```bash
# Bill Discount (10% for Feb 1-14)
node generate-jwt.js f73356ed-4b76-4649-9ef4-f97abab1ab5a

# Discount Voyag (5% default)
node generate-jwt.js 07883db1-759d-4589-8f13-8a008c081ae8

# Custom discount rule ID
node generate-jwt.js YOUR-DISCOUNT-RULE-ID-HERE
```

---

## ⚠️ Known Issues & Notes

1. **Staging Environment:** Was experiencing 503/504 errors as of Jan 31, 2026. May need to retry.

2. **Discount Voyag Rule:** Currently only has 5% default configured. Your test data expects:
   - Date Range: April 1-15, 2026
   - Discount: 2%
   - Condition: Rates under $100
   - **These need to be configured in the admin panel**

3. **Dynamic Discount Rules:** Not yet configured in either discount rule. These would allow rate-based conditions (e.g., "discount applies only to rates under $100").

4. **Strike-Through Display:** May or may not be enabled. Check admin panel settings for each rule.

---

## 🚀 Next Steps

### **Immediate Testing:**
- ✅ Use JWT #1 (Bill Discount) to test 10% discount for Feb 1-14, 2026
- ✅ Use JWT #2 (Discount Voyag) to test 5% default discount

### **Future Configuration:**
- Add date range discount to "Discount Voyag": April 1-15, 2026 with 2%
- Add dynamic discount rules for "rates under $100"
- Enable strike-through price display if needed

---

## 📝 Admin Panel Access

**URL:** https://admin.rezmatestage.com  
**Navigate to:** Discount Rules → Select Rule → View/Edit

**Discount Rules:**
1. Bill Discount - `f73356ed-4b76-4649-9ef4-f97abab1ab5a`
2. Discount Voyag - `07883db1-759d-4589-8f13-8a008c081ae8`

---

## 📚 References

- **JWT Generator Script:** `generate-jwt.js`
- **Discount Correlation Doc:** `DISCOUNT_JWT_CORRELATION.md`
- **Rally User Story:** US747 - Discount Rules Implementation
- **Test Data:** `tests/helpers/low-rate-discount-data.ts`
