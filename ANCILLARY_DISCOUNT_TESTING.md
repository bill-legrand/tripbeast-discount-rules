# Tripbeast Ancillary - Discount Rules Testing Configuration

**Date:** January 31, 2026  
**Environment:** Ancillary (`travel.tripbeast.com`)

---

## ✅ Verified Configuration

### **Customer:** Tripbeast Ancillary
- **Customer ID:** `d42c8222-b4f8-430a-ba58-dde665bb6d8d`
- **Email:** sales@tripbeast.com
- **Admin Panel:** https://admin.rezmatestage.com

### **Distribution Channel:** TripBeast
- **Type:** Ancillary Travel Products Bookings (Hotel, VR)
- **Category:** Checkout on Travel Site
- **JWT Secret:** `LULX6HXY7L` ✅ VERIFIED
- **Booking Engine URL:** https://travel.tripbeast.com

---

## 🎯 Existing Discount Rule

### **Discount Rule Name:** Ancii Stage DR
**ID:** `eb511fff-19b8-4a27-91d5-dd8e69f31809`

**Configuration:**
- ✅ Set as Default
- ✅ Strikethrough Enabled

**Hotels Discount Schedule:**
- **Default Discount:** 0%
- **Date Range Discount:** None configured
- **Specific Date Discounts:** 
  - Jan 31, 2026: 0%
  - Feb 1-7, 2026: 0% (each day)

**Other Products:**
- Cars: No discount configured
- Theme Parks: Not checked
- Cruises: Not checked
- Attractions: Not checked
- Flights: Not checked
- Vacation Rentals: Not checked

**Dynamic Discount Rules:** None configured

---

## 🔧 Business Rule Configuration

### **Business Rule Name:** Anci Stage BR
- Set as Default ✅
- (Need to get ID by clicking on it)

---

## 📝 JWT Payload Requirements

Based on the existing Ancillary JWT structure, the new JWT with discount rule should include:

```json
{
  "partnerName": "tripBeast",
  "userFirstName": "",
  "userLastName": "",
  "userEmail": "",
  "pricingRuleId": "",
  "businessRuleId": "[TO_BE_DETERMINED]",
  "discountRuleId": "eb511fff-19b8-4a27-91d5-dd8e69f31809",
  "clientLogoUrl": "",
  "membership": false,
  "iat": [CURRENT_TIMESTAMP]
}
```

**JWT Secret:** `LULX6HXY7L`

---

## ⚠️ Current Issue with Discount Rule

The discount rule "Ancii Stage DR" is configured but **all discounts are set to 0%**. This means:
- Even with a valid JWT including the `discountRuleId`, no actual discount will be applied
- The discount rule exists and will be recognized, but won't reduce prices

### Options:
1. **Test with 0% discounts** - Verify that the discount rule is being applied (strikethrough should show, but no price change)
2. **Update discount values** - Edit the discount rule in admin to add actual discount percentages
3. **Create a new discount rule** - With meaningful discount values for testing

---

## 🚀 Next Steps

### Option 1: Test with Existing 0% Discount Rule
**Pros:** Quick test to verify discount rule is recognized  
**Cons:** Won't see actual price reductions

```bash
# Generate JWT with existing discount rule
node generate-jwt-ancillary.js eb511fff-19b8-4a27-91d5-dd8e69f31809
```

### Option 2: Update Existing Discount Rule
**Action needed:**
1. Go to admin panel
2. Edit "Ancii Stage DR" discount rule
3. Set Hotels → Default Discount to something like 5% or 10%
4. Add date range discount (e.g., Feb 1-14: 10%)
5. Save changes
6. Generate JWT and test

### Option 3: Create New Discount Rule
**Action needed:**
1. Click "Add New" in Discount Rules section
2. Configure hotels discount (e.g., 5% default, 10% for date range)
3. Enable strikethrough
4. Set as default (or keep existing as default)
5. Get new discount rule ID
6. Generate JWT with new ID

---

## 📋 Testing Checklist

Once discount percentages are configured:

1. **Generate JWT**
   - Include `discountRuleId`: `eb511fff-19b8-4a27-91d5-dd8e69f31809`
   - Include correct `businessRuleId` (need to get from admin)
   - Sign with secret: `LULX6HXY7L`

2. **Test on Booking Engine**
   - Navigate to: `https://travel.tripbeast.com/?jwt=[GENERATED_JWT]`
   - Search for hotels
   - Verify discount is applied
   - Check for strikethrough pricing display

3. **Verify Discount Calculation**
   - Original price shown with strikethrough
   - Discounted price displayed
   - Correct percentage applied

---

## 🔍 Information Still Needed

1. **Business Rule ID** for "Anci Stage BR"
   - Need to click on the business rule to see its ID
   - This ID should be included in the JWT

2. **Pricing Rule ID** (if any)
   - Check if there's a pricing rule configured
   - May be empty/optional for Ancillary

---

## 📁 Files to Create/Update

1. `generate-jwt-ancillary.js` - New JWT generator for Ancillary environment
   - Use secret: `LULX6HXY7L`
   - Include discount rule ID parameter
   - Match Ancillary JWT structure

2. `.env` - Update with Ancillary JWT
   ```
   ANCILLARY_JWT=[generated_jwt_with_discount]
   ANCILLARY_BE_URL=https://travel.tripbeast.com
   ```

3. Test specs - Update to use Ancillary environment
   - Change URLs to `travel.tripbeast.com`
   - Use Ancillary JWT from .env

---

## 💡 Recommendation

**Before generating JWT and testing:**
1. Get the Business Rule ID from "Anci Stage BR"
2. Decide whether to update existing discount rule or create new one
3. If updating, set meaningful discount percentages (e.g., 5-10%)
4. Then generate JWT and test

**Which would you like to do first?**
