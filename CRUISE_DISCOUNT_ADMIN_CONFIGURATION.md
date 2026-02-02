# Cruise Discount Admin Configuration

## Discount Rule Details

| Field | Value |
|-------|-------|
| **Discount Rule Name** | Ancii Stage DR |
| **Rule ID** | eb511fff-19b8-4a27-91d5-dd8e69f31809 |
| **Channel Name** | TripBeast |
| **Customer Name** | Tripbeast Ancillary |
| **Product Type** | Cruises |

## Discount Configuration

### Default Discount
- **No Data Found** (No default discount configured)

### Discount By Date Range

| Date Range | Discount Type | Value |
|------------|---------------|-------|
| 2026-03-01 - 2026-03-07 | Fixed | 22% |
| 2026-03-08 - 2026-03-14 | DOW (Day of Week) | See below |
| 2026-03-15 - 2026-03-21 | Fixed | 21% |

### DOW Discounts for Period 2 (March 8-14, 2026)

| Day | Discount |
|-----|----------|
| Monday | +36% |
| Tuesday | +48% |
| Wednesday | +60% |
| Thursday | +72% |
| Friday | +84% |
| Saturday | +12% |
| Sunday | +24% |

## Expected Discount Calculations

### 1-Day Cruise Examples

| Start Date | Day of Week | Expected Discount |
|------------|-------------|-------------------|
| Mar 1 | Sunday | 22% (Period 1 Fixed) |
| Mar 8 | Sunday | 24% (Period 2 DOW) |
| Mar 9 | Monday | 36% (Period 2 DOW) |
| Mar 10 | Tuesday | 48% (Period 2 DOW) |
| Mar 11 | Wednesday | 60% (Period 2 DOW) |
| Mar 12 | Thursday | 72% (Period 2 DOW) |
| Mar 13 | Friday | 84% (Period 2 DOW) |
| Mar 14 | Saturday | 12% (Period 2 DOW) |
| Mar 15 | Sunday | 21% (Period 3 Fixed) |
| Mar 22 | Sunday | 0% (No Config) |

### Multi-Day Cruise Examples

For multi-day cruises, the expected discount is the **average** of each day's discount.

#### 3-Day Cruise: Mar 8-11 (Sun-Wed)
- Day 1 (Mar 8, Sun): 24%
- Day 2 (Mar 9, Mon): 36%
- Day 3 (Mar 10, Tue): 48%
- **Average: (24 + 36 + 48) / 3 = 36%**

#### 7-Day Cruise: Mar 8-15 (Full Week DOW)
- Mar 8 (Sun): 24%
- Mar 9 (Mon): 36%
- Mar 10 (Tue): 48%
- Mar 11 (Wed): 60%
- Mar 12 (Thu): 72%
- Mar 13 (Fri): 84%
- Mar 14 (Sat): 12%
- **Average: (24+36+48+60+72+84+12) / 7 = 48%**

## JWT Configuration

The cruise tests use the **Ancillary JWT** which includes:
- `discountRuleId`: eb511fff-19b8-4a27-91d5-dd8e69f31809
- `businessRuleId`: aa4c786b-6516-4cf8-be1c-29e458dcf1f6
- `partnerName`: tripBeast

## Booking Engine

- **URL**: https://travel.tripbeast.com
- **Page Parameter**: ?page=cruise

## Admin Access

- **Admin URL**: https://admin.rezmatestage.com
- **Path**: Customers → Tripbeast Ancillary → Discount Rules → Ancii Stage DR → Cruises

---
*Configuration documented from admin panel on Feb 1, 2026*
