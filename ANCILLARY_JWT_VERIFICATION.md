# Ancillary JWT Verification (travel.tripbeast.com)

## Are we sure we have the correct JWT?

**Short answer:** Both of these are **valid** JWTs (correct secret `LULX6HXY7L`). They differ in **what we send**, not in correctness.

| JWT | Signature | Payload | Use case |
|-----|-----------|---------|----------|
| **Your working JWT** | ✅ Valid | Minimal: no `businessRuleId`, no `discountRuleId` | You confirmed this loads on travel.tripbeast.com |
| **Our test JWT** | ✅ Valid | Includes `businessRuleId` + `discountRuleId` for "Ancii Stage DR" | Intended to trigger the 10% date-range discount |

---

## 1. Your working JWT (minimal)

- **Signature:** Valid with `LULX6HXY7L`.
- **Payload:**  
  `partnerName: "tripBeast"`, empty `businessRuleId`, **no** `discountRuleId`.
- **Use:** This is the one you said works on travel.tripbeast.com. The engine may apply discounts by **channel/customer** when no rule IDs are in the JWT.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiIiLCJjbGllbnRMb2dvVXJsIjoiIiwibWVtYmVyc2hpcCI6ZmFsc2UsImlhdCI6MTc2ODg5NDQwMn0.MpE_ewPTnBTDW3bGyo0U7hiMcvIWLV0V5I_EPOQIBkg
```

---

## 2. Our test JWT (with discount rule)

- **Signature:** Valid with `LULX6HXY7L`.
- **Payload:**  
  Same base as above, plus:
  - `businessRuleId: "aa4c786b-6516-4cf8-be1c-29e458dcf1f6"`
  - `discountRuleId: "eb511fff-19b8-4a27-91d5-dd8e69f31809"` (Ancii Stage DR).
- **Use:** We use this in tests to **explicitly** request the discount rule (10% for Feb 1–2, 2026). If the engine uses `discountRuleId` from the JWT, this is the “correct” JWT for that behavior.

Generated with:

```bash
node generate-jwt-ancillary.js
```

---

## What could still be wrong?

1. **Engine ignores `discountRuleId`**  
   Backend might only use channel/customer and never read `discountRuleId`. Then your **working** JWT is the right one to use, and we need to confirm the 10% rule is the default or only rule for that channel for Feb 1–2.

2. **Engine requires our format**  
   Backend might **only** apply the 10% date-range rule when `discountRuleId` (and maybe `businessRuleId`) is in the JWT. Then **our** JWT is the correct one, and the missing discount would be a backend or config issue (e.g. rule not applied for that product/date).

3. **Wrong rule IDs**  
   Less likely since we took them from admin (Ancii Stage BR / Ancii Stage DR for Tripbeast Ancillary), but if the engine has different IDs in another env, that could explain no discount.

---

## How to verify

1. **Run the verification script:**
   ```bash
   node verify-ancillary-jwt.js
   ```
   Confirms both JWTs verify with `LULX6HXY7L` and shows exact payloads.

2. **Test with your working JWT (Feb 1–2, Las Vegas):**  
   If the 10% discount **appears**, the engine is likely applying rules by channel/customer and our “correct” JWT for discount testing is effectively the same as yours (minimal payload).

3. **Test with our JWT (same search):**  
   If the 10% discount **appears** only with this JWT, then we do have the correct JWT for discount-rule testing and the issue was using the minimal one.

4. **If neither shows 10%:**  
   Then the problem is likely backend (rule not applied), config (wrong product/date), or caching; the JWT we use is still **correct** (valid signature and intended payload).

---

## Summary

- **Yes:** We have a **correct** JWT in the sense of valid signature and correct secret (`LULX6HXY7L`).
- **Two valid options:**  
  - Your working JWT = minimal payload.  
  - Our JWT = same secret + `businessRuleId` + `discountRuleId` for the 10% rule.
- **“Correct” for discount testing** depends on whether the booking engine uses `discountRuleId` from the JWT or only channel/customer; the verification steps above tell you which JWT is correct for the behavior you see.
