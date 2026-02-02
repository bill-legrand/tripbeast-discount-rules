# March 10% Discount Investigation

**Question:** Are there other defined discounts that would set March dates to 10% when using the BOOKING_ENGINE_JWT?

**JWT in use:** `BOOKING_ENGINE_JWT` from `dow-discount-data.ts`  
**Payload:** `pricingRuleId`: `3de108d0-7994-4957-a9bd-dc2a7c056186`, `businessRuleId`: `d5228803-c475-4972-81b5-0420431f1608`  
**Note:** This JWT has **no `discountRuleId`** — the backend resolves discounts from `businessRuleId` / channel.

---

## Observed Behavior

| Date   | Day    | Expected (DOW range) | Actual | Possible explanation   |
|--------|--------|----------------------|--------|------------------------|
| Mar 1  | Sunday | 0% (shoulder)        | 10%    | Sunday DOW = 10%       |
| Mar 9  | Monday | 0% (shoulder)        | 10%    | Fallback 10%, not DOW  |

---

## Discount Rules Found (from codebase/docs)

### 1. Staging Admin (admin.rezmatestage.com) – not used by this JWT

- **Bill Discount** (`f73356ed-4b76-4649-9ef4-f97abab1ab5a`): 5% default, **10% Feb 1–14**
- **Discount Voyag** (`07883db1-759d-4589-8f13-8a008c081ae8`): 5% default only

These use `discountRuleId` in staging JWTs. Production JWT does **not** include `discountRuleId`, and Bill Discount’s 10% range ends Feb 14, so it does **not** apply to March.

### 2. DOW config (Mar 2–8, 2026)

- Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, Sat 40%, **Sun 10%**
- Shoulders (Mar 1, Mar 9): expected **0%**

### 3. march-april-date-range-test.spec.ts

- Expects **Mar 9–22: 14.5%**. That is a test expectation, not something we can confirm from the codebase. Observed Mar 9 is 10%, not 14.5%, so either:
  - Mar 9–22 rule is not configured in production, or
  - Another rule wins (e.g. a 10% default or fallback)

### 4. Ancillary (travel.tripbeast.com)

- Feb 1–2: 10%, Feb 15–21: 12%, Feb 22–28: DOW
- Different engine and JWT; not used for `bookings.tripbeast.com`.

---

## Possible Causes of 10% on Mar 1 & Mar 9

1. **Calendar DOW for dates outside Mar 2–8**
   - Mar 1 (Sun) → 10% ✓
   - Mar 9 (Mon) → would be 15%, not 10%, so this does **not** fully explain Mar 9.

2. **Fallback/default 10% for dates outside DOW range**
   - Backend rule: “outside Mar 2–8 → use 10%.”
   - Would explain both Mar 1 and Mar 9.

3. **Channel / business rule with 10% default**
   - Production rules tied to `businessRuleId` `d5228803-c475-4972-81b5-0420431f1608` may define a 10% default or fallback.
   - Configuration lives in production admin, not in this repo.

---

## Conclusion

In this repo we **cannot** find a defined discount that clearly sets March dates to 10%.

What is documented:

- Staging rules (Bill Discount, Discount Voyag) are tied to different JWTs or date ranges and do not apply here.
- DOW config gives Sun 10%, but only for Mar 2–8.
- No explicit “outside range = 10%” rule is defined in code or docs.

Most plausible explanation for **both** Mar 1 and Mar 9 showing 10%:

- The backend applies a **10% fallback** for dates outside the Mar 2–8 DOW window, or
- The `businessRuleId` `d5228803-c475-4972-81b5-0420431f1608` is linked to a rule with a 10% default for dates without a specific match.

To confirm, you’d need to:

1. Inspect production admin for rules tied to `businessRuleId` `d5228803-c475-4972-81b5-0420431f1608`.
2. Check for any date-range rules covering March and their fallback logic.
3. Verify whether “outside DOW range” is treated as “use 10%” or “use calendar DOW.”
