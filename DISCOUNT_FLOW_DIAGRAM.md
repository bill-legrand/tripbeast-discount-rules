# 🔗 Discount Rules & JWT Token Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ADMIN PANEL (admin.rezmatestage.com)                │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ Admin creates discount rules
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DISCOUNT RULES                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Rule Name: Discount Voyag (Low Rate Discount)                      │   │
│  │ Customer: Skyline Voyages                                           │   │
│  │ Channel: Voyager Travel Platform                                    │   │
│  │ Discount Key: 07883db1-759d-4589-8f13-8a008c081ae8  ◄───────────┐  │   │
│  │                                                                   │  │   │
│  │ Configuration:                                                    │  │   │
│  │   • Discount: 2%                                                  │  │   │
│  │   • Applies to: Rates under $100                                  │  │   │
│  │   • Date Range: April 1-15, 2026                                  │  │   │
│  │   • Products: Hotels                                              │  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Rule Name: Bill Discount                                            │   │
│  │ Discount Key: f73356ed-4b76-4649-9ef4-f97abab1ab5a                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Rule Name: Ancii Stage DR                                           │   │
│  │ Discount Key: eb511fff-19b8-4a27-91d5-dd8e69f31809                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                     ┌─────────────────┴──────────────────┐
                     │ Copy Discount Key from Admin Panel │
                     └─────────────────┬──────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         JWT TOKEN GENERATION                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Distribution Channel → JWT Secret Key                               │   │
│  │ Secret: voyager_travel  ◄───────────────────────────────────────┐  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ JWT Payload:                                                        │   │
│  │ {                                                                   │   │
│  │   "partnerName": "ExplorePro",                                      │   │
│  │   "userEmail": "skyline.cus@yopmail.com",                           │   │
│  │   "pricingRuleId": "3de108d0-...",  ← Markup Rule                  │   │
│  │   "businessRuleId": "d5228803-...",  ← Business Rule               │   │
│  │   "discountRuleId": "07883db1-759d-4589-8f13-8a008c081ae8", ◄─┐   │   │
│  │   ...                                      ▲                    │   │   │
│  │ }                                          │                    │   │   │
│  │                              This is the Discount Key from above│   │   │
│  │                                            │                        │   │
│  └────────────────────────────────────────────┼────────────────────────┘   │
│                                               │                            │
│  ┌────────────────────────────────────────────┼────────────────────────┐   │
│  │ Sign with HS256 using secret: voyager_travel                       │   │
│  │                                                                     │   │
│  │ Result: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZS... │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ Pass JWT in URL
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   BOOKING ENGINE (bookings.tripbeast.com)                   │
│                                                                             │
│  URL: https://bookings.tripbeast.com?jwt=[token]                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Booking engine receives request with JWT token                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                       │                                     │
│                                       ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 2. Decode JWT and extract discountRuleId                            │   │
│  │    → discountRuleId: "07883db1-759d-4589-8f13-8a008c081ae8"        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                       │                                     │
│                                       ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 3. Query discount rule from database using this UUID                │   │
│  │    → Finds: "Discount Voyag" (Low Rate Discount)                    │   │
│  │    → Configuration: 2% on rates < $100, April 1-15, 2026            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                       │                                     │
│                                       ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 4. User searches for hotels (April 5, 2026, Las Vegas)              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                       │                                     │
│                                       ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 5. For each hotel result, check discount conditions:                │   │
│  │                                                                      │   │
│  │    Hotel A: $95/night                                               │   │
│  │    ✓ Rate < $100                                                    │   │
│  │    ✓ Date is April 5 (within April 1-15)                            │   │
│  │    → APPLY 2% DISCOUNT: $95 - $1.90 = $93.10                        │   │
│  │                                                                      │   │
│  │    Hotel B: $150/night                                              │   │
│  │    ✗ Rate >= $100 (doesn't meet condition)                          │   │
│  │    → NO DISCOUNT: $150.00                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                       │                                     │
│                                       ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 6. Display results with discounted prices                           │   │
│  │                                                                      │   │
│  │    ┌───────────────────────────────────────┐                        │   │
│  │    │ Hotel A: Luxor Hotel & Casino         │                        │   │
│  │    │ $95.00  →  $93.10  (2% off)           │                        │   │
│  │    │ ✓ Discount applied                    │                        │   │
│  │    └───────────────────────────────────────┘                        │   │
│  │                                                                      │   │
│  │    ┌───────────────────────────────────────┐                        │   │
│  │    │ Hotel B: Bellagio                     │                        │   │
│  │    │ $150.00                               │                        │   │
│  │    │ (No discount - rate too high)         │                        │   │
│  │    └───────────────────────────────────────┘                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ API Response includes discount info
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API RESPONSE (JSON)                               │
│                                                                             │
│  {                                                                          │
│    "hotel": {                                                               │
│      "name": "Luxor Hotel & Casino",                                        │
│      "originalPrice": 95.00,                                                │
│      "discountedPrice": 93.10,                                              │
│      "discount": {                                                          │
│        "ruleId": "07883db1-759d-4589-8f13-8a008c081ae8",  ◄────┐           │
│        "ruleName": "Discount Voyag",                            │           │
│        "percentage": 2,                                         │           │
│        "amount": 1.90                                           │           │
│      }                                                          │           │
│    }                                                            │           │
│  }                                                              │           │
│                                                                 │           │
│  This confirms the correct discount rule was applied ──────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════

KEY TAKEAWAYS:

1. ✅ Discount Key (UUID) from Admin Panel = discountRuleId in JWT Token
2. ✅ JWT Secret Key from Distribution Channel is used to sign the token
3. ✅ Booking Engine decodes JWT and applies the matching discount rule
4. ✅ Dynamic conditions (e.g., "rate < $100") are evaluated at search time
5. ✅ API responses include the discount rule ID for verification

═══════════════════════════════════════════════════════════════════════════════

TOOLS PROVIDED:

• generate-jwt.js - Script to generate JWT tokens with discount rule IDs
• DISCOUNT_RULES_JWT_SOLUTION.md - Complete documentation
• DISCOUNT_JWT_CORRELATION.md - Detailed technical reference

═══════════════════════════════════════════════════════════════════════════════
