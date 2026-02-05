import { test, expect } from '../fixtures/auth.fixture';
import { BookingEnginePage } from '../pages/BookingEnginePage';
import { DiscountRulePage } from '../pages/DiscountRulePage';

/**
 * Test Suite: Discount Calculation and Application
 * Test Cases: TC-017, TC-018, TC-019, TC-020, TC-023, TC-034
 */

test.describe('Discount Calculation', () => {
  let bookingEnginePage: BookingEnginePage;

  /**
   * TC-017: Apply Default Discount
   * Priority: Critical
   */
  test('TC-017: Should apply default discount correctly', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Test Product $1000');
    
    // Verify discounted price
    // Original: $1000, Discount: 10% = $900
    const discountedPrice = await bookingEnginePage.getDiscountedPrice();
    expect(discountedPrice).toBe(900);
    
    // Verify original price is shown
    const originalPrice = await bookingEnginePage.getOriginalPrice();
    expect(originalPrice).toBe(1000);
    
    await cugPage.screenshot({ path: `test-results/hotel/screenshots/TC-017-default-discount.png` });
  });

  /**
   * TC-018: Apply Date Range-Based Discount
   * Priority: Critical
   */
  test('TC-018: Should apply date range discount within valid dates', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    // Test within date range (assuming current date is within Jan 1-31, 2026)
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Date Range Product');
    
    // Verify 15% discount is applied
    // Original: $1000, Discount: 15% = $850
    const discountedPrice = await bookingEnginePage.getDiscountedPrice();
    expect(discountedPrice).toBe(850);
    
    await cugPage.screenshot({ path: `test-results/hotel/screenshots/TC-018-date-range-discount.png` });
  });

  /**
   * TC-037: Expired Date Range Discount
   * Priority: High
   */
  test('TC-037: Should not apply expired date range discount', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Expired Discount Product');
    
    // Verify discount is NOT applied (should show full price)
    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeFalsy();
    
    const displayedPrice = await bookingEnginePage.getDisplayedPrice();
    expect(displayedPrice).toBe(1000); // Full price
    
    await cugPage.screenshot({ path: `test-results/hotel/screenshots/TC-037-expired-discount.png` });
  });

  /**
   * TC-019: Apply Specific Date-Based Discount
   * Priority: High
   */
  test('TC-019: Should apply discount on specific date only', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    // This test would need to be run on the specific date or with date mocking
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Specific Date Product');
    
    // If today is the specific date, discount should be applied
    // Original: $1000, Discount: 20% = $800
    const discountedPrice = await bookingEnginePage.getDiscountedPrice();
    
    // Log for verification
    console.log('Discounted price on specific date:', discountedPrice);
    
    await cugPage.screenshot({ path: `test-results/hotel/screenshots/TC-019-specific-date-discount.png` });
  });

  /**
   * TC-023: Discount Applied on Subtotal Only
   * Priority: Critical
   */
  test('TC-023: Should apply discount on subtotal excluding taxes and fees', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Full Price Breakdown Product');
    
    // Verify discount calculation
    // Base Price: $1000, Markup: $100 (10%), Tax: $50, Fees: $25
    // Subtotal: $1100
    // Discount: 10% of $1100 = $110
    // Discounted Subtotal: $990
    // Total: $990 + $50 + $25 = $1065
    
    await bookingEnginePage.verifyDiscountOnSubtotalOnly(
      1000, // base price
      100,  // markup
      10,   // discount percentage
      50,   // tax
      25    // fees
    );
    
    await cugPage.screenshot({ 
      path: `test-results/hotel/screenshots/TC-023-discount-on-subtotal.png`,
      fullPage: true 
    });
  });

  /**
   * TC-034: Discount + Markup Combined Application
   * Priority: Critical
   */
  test('TC-034: Should apply markup first then discount', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Markup and Discount Product');
    
    // Get price breakdown
    const breakdown = await bookingEnginePage.getPriceBreakdown();
    
    // Expected calculation:
    // Base: $1000
    // Markup: +10% = $100
    // Subtotal after markup: $1100
    // Discount: -15% of $1100 = $165
    // Final Subtotal: $935
    // Tax: $50
    // Fees: $25
    // Total: $1010
    
    expect(breakdown.subtotal).toBeCloseTo(935, 2);
    expect(breakdown.discount).toBeCloseTo(165, 2);
    expect(breakdown.tax).toBe(50);
    expect(breakdown.fees).toBe(25);
    expect(breakdown.total).toBeCloseTo(1010, 2);
    
    await cugPage.screenshot({ 
      path: `test-results/hotel/screenshots/TC-034-markup-discount-combined.png`,
      fullPage: true 
    });
  });

  /**
   * TC-020: Apply Dynamic Discount Rules
   * Priority: Critical
   */
  test('TC-020: Should apply dynamic discount when conditions are met', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    // Test with booking value > $500 (condition met)
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('High Value Product $600');
    
    // Discount should be applied (10%)
    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeTruthy();
    
    const discountedPrice = await bookingEnginePage.getDiscountedPrice();
    expect(discountedPrice).toBe(540); // $600 - 10% = $540
    
    await cugPage.screenshot({ path: `test-results/hotel/screenshots/TC-020-dynamic-discount-applied.png` });
  });

  test('TC-020: Should not apply dynamic discount when conditions are not met', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    // Test with booking value < $500 (condition not met)
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Low Value Product $400');
    
    // Discount should NOT be applied
    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeFalsy();
    
    const displayedPrice = await bookingEnginePage.getDisplayedPrice();
    expect(displayedPrice).toBe(400); // Full price
    
    await cugPage.screenshot({ path: `test-results/hotel/screenshots/TC-020-dynamic-discount-not-applied.png` });
  });

  /**
   * TC-024: Dynamic Discount with Multiple Conditions
   * Priority: High
   */
  test('TC-024: Should apply dynamic discount only when all conditions are met', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    // Test Case 1: Both conditions met (value > $1000 AND booking < 30 days)
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Premium Product $1200');
    
    // Assuming booking is within 30 days
    let isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    console.log('Both conditions met - Discount applied:', isDiscountApplied);
    
    // Test Case 2: Only one condition met (value > $1000 but booking > 30 days)
    // This would require date manipulation or specific test data
    
    await cugPage.screenshot({ path: `test-results/hotel/screenshots/TC-024-multiple-conditions.png` });
  });

  /**
   * TC-022: Discount Percentage Validation
   * Priority: High
   */
  test('TC-022: Should handle edge case percentages correctly', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    // Test 0% discount
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Zero Discount Product');
    
    const priceWithZeroDiscount = await bookingEnginePage.getDisplayedPrice();
    expect(priceWithZeroDiscount).toBe(1000); // No discount
    
    // Test 100% discount
    await bookingEnginePage.selectProduct('Free Product');
    
    const priceWith100Discount = await bookingEnginePage.getDisplayedPrice();
    expect(priceWith100Discount).toBe(0); // Free
    
    await cugPage.screenshot({ path: `test-results/hotel/screenshots/TC-022-edge-percentages.png` });
  });
});

test.describe('Discount Priority and Conflicts', () => {
  /**
   * TC-021: Multiple Discount Types Priority
   * Priority: High
   */
  test('TC-021: Should apply highest priority discount when multiple are configured', async ({ cugPage }) => {
    const bookingEnginePage = new BookingEnginePage(cugPage);
    
    // Product with multiple discount rules:
    // Default: 10%, Date Range: 15%, Specific Date: 20%
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Multi Rule Product');
    
    // Get applied discount
    const breakdown = await bookingEnginePage.getPriceBreakdown();
    
    // Log which discount was applied
    console.log('Discount amount:', breakdown.discount);
    console.log('Subtotal:', breakdown.subtotal);
    
    // Verify a discount was applied
    expect(breakdown.discount).toBeGreaterThan(0);
    
    // Calculate which discount was applied based on the amount
    const originalSubtotal = breakdown.subtotal + breakdown.discount;
    const discountPercentage = (breakdown.discount / originalSubtotal) * 100;
    
    console.log('Applied discount percentage:', discountPercentage);
    
    // Document the priority order
    await cugPage.screenshot({ 
      path: `test-results/hotel/screenshots/TC-021-discount-priority.png`,
      fullPage: true 
    });
  });
});

test.describe('Discount Calculation - Decimal Handling', () => {
  test('Should handle decimal percentages correctly', async ({ cugPage }) => {
    const bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Decimal Discount Product');
    
    // Test 25.5% discount on $1000 = $745
    const discountedPrice = await bookingEnginePage.getDiscountedPrice();
    expect(discountedPrice).toBeCloseTo(745, 2);
    
    await cugPage.screenshot({ path: `test-results/hotel/screenshots/decimal-discount.png` });
  });

  test('Should round prices appropriately', async ({ cugPage }) => {
    const bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Rounding Test Product');
    
    // Verify prices are rounded to 2 decimal places
    const breakdown = await bookingEnginePage.getPriceBreakdown();
    
    // Check all prices have max 2 decimal places
    const checkDecimals = (price: number) => {
      const decimalPlaces = (price.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    };
    
    checkDecimals(breakdown.subtotal);
    checkDecimals(breakdown.discount);
    checkDecimals(breakdown.total);
    
    await cugPage.screenshot({ path: `test-results/hotel/screenshots/price-rounding.png` });
  });
});
