# Admin Backend Rules Search Report

**Source:** admin.rezmatestage.com (Staging Admin)  
**Date:** 2026-02-01  
**Purpose:** Find any discount rules that would set March dates to 10%

---

## Environment Note

**Tests run on:** bookings.tripbeast.com (Production or separate env)  
**Admin searched:** admin.rezmatestage.com (Staging)

The JWT's `businessRuleId` (`d5228803-c475-4972-81b5-0420431f1608`) is **not found** in staging admin. Production may use different rules/config.

---

## Discount Rules Found (3 total)

| # | Customer | Channel | Rule Name | Discount Key |
|---|----------|---------|-----------|--------------|
| 1 | Skyline Voyages | Voyager Travel Platform | Bill Discount | f73356ed-4b76-4649-9ef4-f97abab1ab5a |
| 2 | Tripbeast Ancillary | TripBeast | Ancii Stage DR | eb511fff-19b8-4a27-91d5-dd8e69f31809 |
| 3 | Skyline Voyages | Voyager Travel Platform | Discount Voyag | 07883db1-759d-4589-8f13-8a008c081ae8 |

---

## Bill Discount (Skyline Voyages / Voyager Travel Platform) – Hotels

| Type | Config |
|------|--------|
| Default | **5%** |
| Date Range | Feb 1–14, 2026 → **10%** |
| Specific Date | None |
| March dates | **5%** (default – outside Feb 1–14 range) |

**Conclusion:** Bill Discount does **not** set March to 10%. March uses the 5% default.

---

## Discount Voyag (Skyline Voyages / Voyager Travel Platform)

- Default: No Data Found (Attractions)
- Date Range: No Data Found
- Specific Date: No Data Found
- March: No discount configured

---

## Ancii Stage DR (Tripbeast Ancillary / TripBeast)

- Different customer/channel than the CUG JWT.
- Not used by `bookings.tripbeast.com` tests.

---

## Business Rules

| Customer | Channel | Rule Name | Key |
|----------|---------|-----------|-----|
| Tripbeast Ancillary | TripBeast | Anci Stage BR | aa4c786b-6516-4cf8-be1c-29e458dcf1f6 |
| Skyline Voyages | Voyager Travel Platform | Voyager Travel BR | 79ae3add-aa16-4c78-835d-634b5cedcf83 |
| Skyline Voyages | Bill Travel Platform | Business Rule 1 | 90c91546-6a08-4fef-b9cd-8613232e585e |
| Trip Beast | Trip Beast Channel | TripBeast BR | 9fb1187b-6c4e-4f62-ace4-8c9b3ba05620 |

**JWT businessRuleId:** `d5228803-c475-4972-81b5-0420431f1608`  
**Result:** Not present in staging admin (search returned no matches).

---

## Summary

1. **No rule in staging admin sets March to 10%.**
   - Bill Discount: Feb 1–14 = 10%; March = 5% (default).
   - Discount Voyag: No March config.
   - Ancii Stage DR: Different channel.

2. **JWT rule not in staging admin.**  
   `businessRuleId` `d5228803...` does not exist in staging business rules, so production likely uses a different admin/config.

3. **10% on Mar 1 & Mar 9 likely from:**
   - A production-only rule (not visible in staging).
   - Backend fallback: “outside DOW range → 10%”.
   - Calendar DOW for Mar 1 (Sunday = 10%); another rule for Mar 9.

**Next step:** Review production admin (or prod config) for businessRuleId `d5228803-c475-4972-81b5-0420431f1608` and its linked discount rules.
