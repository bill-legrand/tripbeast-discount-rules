# Running Customer Discount Tests

## Quick Start

Based on the actual UI flow you demonstrated, here are the tests ready to run:

### 1. Run the Exact Flow You Demonstrated

```powershell
.\run-tests.ps1 -TestFile "tests/customer-discount-test.spec.ts" -TestName "Should add date range discount for Skyline Voyages customer" -Headed
```

This will:
- Log in to admin panel
- Navigate to Management → Customers
- Select "Skyline Voyages" customer
- Open Distribution Channel
- Select "Voyager Travel Platform"
- Open Discount configuration
- Select Hotels tab
- Add date range discount: Jan 29 - Feb 14, 2026 at 25%

### 2. Run All Customer Discount Tests

```powershell
.\run-tests.ps1 -TestFile "tests/customer-discount-test.spec.ts" -Headed
```

### 3. Run in Interactive UI Mode

```powershell
.\run-tests.ps1 -UI
```

Then select `customer-discount-test.spec.ts` from the list.

## Available Tests

### ✅ Main Tests

1. **Add Date Range Discount** - Exact flow you demonstrated
2. **Add Date Range Discount (Helper Method)** - Same flow using simplified method
3. **Add Default Discount** - Discount for all dates
4. **Add Discounts for Multiple Products** - Hotels + Flights
5. **Verify Discount Display** - Check percentage format
6. **Navigate All Product Tabs** - Hotels, Flights, Cars, Activities

### ✅ Edge Case Tests

1. **100% Discount** - Maximum discount
2. **0% Discount** - Minimum discount
3. **Decimal Discount** - Test 25.5%

### ✅ Validation Tests

1. **Date Range Validation** - End date must be after start date

## Test Data Used

- **Customer**: Skyline Voyages
- **Platform**: Voyager Travel Platform
- **Product Types**: Hotels, Flights, Cars, Activities
- **Date Range**: January 29, 2026 - February 14, 2026
- **Discount**: 25%

## What the Tests Verify

✅ Navigation flow works correctly  
✅ Customer selection works  
✅ Distribution Channel accordion opens  
✅ Platform selection works  
✅ Discount configuration opens  
✅ Product tabs switch correctly  
✅ Date picker works  
✅ Discount percentage can be entered  
✅ Save button works  
✅ Success message appears  

## Screenshots

Tests automatically capture screenshots in:
- `test-results/customer-discount-added.png`
- `test-results/default-discount-added.png`
- `test-results/product-tab-hotels.png`
- `test-results/product-tab-flights.png`
- `test-results/product-tab-cars.png`
- `test-results/product-tab-activities.png`

## Page Object Model

The new `CustomerDiscountPage` class provides methods for:

```typescript
// Navigation
navigateToCustomers()
selectCustomer(customerName)
openDistributionChannel()
selectPlatform(platformName)
openDiscountConfiguration()

// Product Selection
selectProductTab('Hotels' | 'Flights' | 'Cars' | 'Activities')

// Discount Management
addDateRangeDiscount(startDate, endDate, percentage)
addDefaultDiscount(percentage)
selectDate(dateText)

// Verification
verifyDiscountSaved()
verifyDiscountPercentage(percentage)
getDiscountValue()

// Complete Workflow
addDateRangeDiscountForCustomer(
  customerName,
  platformName,
  productType,
  startDate,
  endDate,
  percentage
)
```

## Run Specific Test Scenarios

### Test: Add 25% Discount for Hotels (Jan 29 - Feb 14)
```powershell
.\run-tests.ps1 -TestName "Should add date range discount for Skyline Voyages" -Headed
```

### Test: Add Default 15% Discount
```powershell
.\run-tests.ps1 -TestName "Should add default discount" -Headed
```

### Test: Add Discounts for Hotels and Flights
```powershell
.\run-tests.ps1 -TestName "Should add discounts for Hotels and Flights" -Headed
```

### Test: Navigate All Product Tabs
```powershell
.\run-tests.ps1 -TestName "Should navigate through all product tabs" -Headed
```

### Test: 100% Discount Edge Case
```powershell
.\run-tests.ps1 -TestName "Should allow 100% discount" -Headed
```

## Debug Mode

To debug any test step-by-step:

```powershell
.\run-tests.ps1 -TestFile "tests/customer-discount-test.spec.ts" -Debug
```

## Comparison with Original Test Plan

These tests cover:

- ✅ **TC-011**: Mark Discount Rule as Default for Channel
- ✅ **TC-012**: Configure Stakeholder-Wise Discount
- ✅ **TC-013**: Apply Discount Rule to Active Products
- ✅ **TC-014**: Apply Discount to Specific Products Only
- ✅ **TC-017**: Apply Default Discount
- ✅ **TC-018**: Apply Date Range-Based Discount
- ✅ **TC-022**: Discount Percentage Validation (0%, 100%, decimals)

## Next Steps

1. ✅ Run the tests to verify they work with your system
2. ⏳ Add more customers to test data
3. ⏳ Test with different platforms
4. ⏳ Add tests for editing/deleting discounts
5. ⏳ Add tests for discount priority when multiple rules exist

## Notes

- Tests use the actual selectors from your UI
- Date picker navigation is handled automatically
- Tests wait for animations and page loads
- All actions are logged to console
- Screenshots are captured for verification

---

**Ready to test! Run the commands above to see your discount management in action.** 🎯
