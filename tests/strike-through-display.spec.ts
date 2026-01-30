import { test, expect } from './fixtures/auth.fixture';
import { BookingEnginePage } from './pages/BookingEnginePage';
import { DiscountRulePage } from './pages/DiscountRulePage';

/**
 * Test Suite: Strike-Through Price Display
 * Test Cases: TC-025 to TC-030
 * Priority: Critical
 */

test.describe('Strike-Through Price Display', () => {
  let bookingEnginePage: BookingEnginePage;
  let discountRulePage: DiscountRulePage;

  /**
   * TC-025: Case 1 - Both Strike-Throughs ON
   * Hotel strike-through: ON + Discount strike-through: ON
   * Expected: ~~$1200~~ ~~$1000~~ $900
   */
  test('TC-025: Should display combined strike-through when both are enabled', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    // Navigate to booking engine
    await bookingEnginePage.goto('cug');
    
    // Select a hotel product with Expedia strike-through
    // This would be a real hotel product in your system
    await bookingEnginePage.selectProduct('Expedia Hotel Test');
    
    // Verify strike-through display: ~~$1200~~ ~~$1000~~ $900
    await bookingEnginePage.verifyStrikeThroughCase1(1200, 1000, 900);
    
    // Take screenshot
    await cugPage.screenshot({ 
      path: `screenshots/TC-025-case1-both-on.png`,
      fullPage: true 
    });
  });

  /**
   * TC-026: Case 2 - Hotel OFF, Discount ON with Strike-Through
   * Hotel strike-through: OFF + Discount strike-through: ON
   * Expected: ~~$1000~~ $900
   */
  test('TC-026: Should display only discount strike-through when hotel strike-through is off', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    
    // Select a product without hotel strike-through but with discount
    await bookingEnginePage.selectProduct('Standard Hotel');
    
    // Verify strike-through display: ~~$1000~~ $900
    await bookingEnginePage.verifyStrikeThroughCase2(1000, 900);
    
    await cugPage.screenshot({ 
      path: `screenshots/TC-026-case2-hotel-off.png`,
      fullPage: true 
    });
  });

  /**
   * TC-027: Case 3 - Hotel ON, Discount ON, Discount Strike-Through OFF
   * Hotel strike-through: ON + Discount strike-through: OFF
   * Expected: $900 (no strike-through visible)
   */
  test('TC-027: Should display final price only when discount strike-through is off', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Expedia Hotel No Strike');
    
    // Verify no strike-through, only final price: $900
    await bookingEnginePage.verifyStrikeThroughCase3(900);
    
    await cugPage.screenshot({ 
      path: `screenshots/TC-027-case3-discount-strike-off.png`,
      fullPage: true 
    });
  });

  /**
   * TC-028: Case 4 - Both Strike-Throughs OFF
   * Hotel strike-through: OFF + Discount strike-through: OFF
   * Expected: $900 (discounted value only, no strike-through)
   */
  test('TC-028: Should display discounted price only when both strike-throughs are off', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Standard Hotel No Strike');
    
    // Verify no strike-through, only final price: $900
    await bookingEnginePage.verifyStrikeThroughCase4(900);
    
    await cugPage.screenshot({ 
      path: `screenshots/TC-028-case4-both-off.png`,
      fullPage: true 
    });
  });

  /**
   * TC-029: Toggle Strike-Through Display Setting
   * Priority: Medium
   */
  test('TC-029: Should toggle strike-through display on and off', async ({ authenticatedPage, cugPage }) => {
    discountRulePage = new DiscountRulePage(authenticatedPage);
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    const ruleName = `Toggle_Test_${Date.now()}`;
    
    // Create discount rule with strike-through ON
    await discountRulePage.goto();
    await discountRulePage.clickCreateNew();
    await discountRulePage.ruleNameInput.fill(ruleName);
    await discountRulePage.discountTypeDropdown.selectOption('default');
    await discountRulePage.discountPercentageInput.fill('10');
    await discountRulePage.channelSelect.selectOption('Channel_A');
    await discountRulePage.enableStrikeThrough();
    await discountRulePage.saveButton.click();
    await discountRulePage.verifySuccessMessage();
    
    // View in booking engine - should see strike-through
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Test Product');
    
    let hasStrikeThrough = await bookingEnginePage.strikeThroughPrice.isVisible();
    expect(hasStrikeThrough).toBeTruthy();
    
    await cugPage.screenshot({ path: `screenshots/TC-029-strike-through-on.png` });
    
    // Toggle strike-through OFF
    await discountRulePage.goto();
    await discountRulePage.searchRule(ruleName);
    await discountRulePage.clickRuleByName(ruleName);
    await discountRulePage.editRule();
    await discountRulePage.disableStrikeThrough();
    await discountRulePage.saveButton.click();
    
    // Refresh booking engine - should NOT see strike-through
    await cugPage.reload();
    await bookingEnginePage.selectProduct('Test Product');
    
    hasStrikeThrough = await bookingEnginePage.strikeThroughPrice.isVisible();
    expect(hasStrikeThrough).toBeFalsy();
    
    await cugPage.screenshot({ path: `screenshots/TC-029-strike-through-off.png` });
  });

  /**
   * TC-030: Strike-Through with Multiple Discounts
   * Priority: Medium
   */
  test('TC-030: Should display correct strike-through with multiple discounts', async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
    
    // This test assumes multiple discount rules are stacked
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Multi Discount Product');
    
    // Get all strike-through prices
    const strikeThroughPrices = await bookingEnginePage.getStrikeThroughPrices();
    
    // Verify we have strike-through prices
    expect(strikeThroughPrices.length).toBeGreaterThan(0);
    
    // Verify prices are in descending order (highest to lowest)
    for (let i = 0; i < strikeThroughPrices.length - 1; i++) {
      expect(strikeThroughPrices[i]).toBeGreaterThan(strikeThroughPrices[i + 1]);
    }
    
    // Get final price
    const finalPrice = await bookingEnginePage.getDiscountedPrice();
    
    // Final price should be less than all strike-through prices
    strikeThroughPrices.forEach(price => {
      expect(finalPrice).toBeLessThan(price);
    });
    
    await cugPage.screenshot({ 
      path: `screenshots/TC-030-multiple-discounts.png`,
      fullPage: true 
    });
  });
});

test.describe('Strike-Through Display - Responsive Design', () => {
  /**
   * TC-045: Responsive Design - Strike-Through Display
   * Priority: Medium
   */
  test('TC-045: Should display strike-through correctly on desktop', async ({ cugPage }) => {
    const bookingEnginePage = new BookingEnginePage(cugPage);
    
    // Set desktop viewport
    await cugPage.setViewportSize({ width: 1920, height: 1080 });
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Test Product');
    
    // Verify strike-through is visible and readable
    const strikeThroughVisible = await bookingEnginePage.strikeThroughPrice.isVisible();
    expect(strikeThroughVisible).toBeTruthy();
    
    await cugPage.screenshot({ path: `screenshots/TC-045-desktop-1920x1080.png` });
  });

  test('TC-045: Should display strike-through correctly on tablet', async ({ cugPage }) => {
    const bookingEnginePage = new BookingEnginePage(cugPage);
    
    // Set tablet viewport
    await cugPage.setViewportSize({ width: 768, height: 1024 });
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Test Product');
    
    // Verify strike-through is visible and readable
    const strikeThroughVisible = await bookingEnginePage.strikeThroughPrice.isVisible();
    expect(strikeThroughVisible).toBeTruthy();
    
    await cugPage.screenshot({ path: `screenshots/TC-045-tablet-768x1024.png` });
  });

  test('TC-045: Should display strike-through correctly on mobile', async ({ cugPage }) => {
    const bookingEnginePage = new BookingEnginePage(cugPage);
    
    // Set mobile viewport
    await cugPage.setViewportSize({ width: 375, height: 667 });
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Test Product');
    
    // Verify strike-through is visible and readable
    const strikeThroughVisible = await bookingEnginePage.strikeThroughPrice.isVisible();
    expect(strikeThroughVisible).toBeTruthy();
    
    // Verify no layout issues
    const productCard = bookingEnginePage.productCard.first();
    const boundingBox = await productCard.boundingBox();
    
    // Card should fit within viewport width
    expect(boundingBox?.width).toBeLessThanOrEqual(375);
    
    await cugPage.screenshot({ path: `screenshots/TC-045-mobile-375x667.png` });
  });
});

test.describe('Strike-Through Display - UI/UX', () => {
  /**
   * TC-043: Strike-Through Price Readability
   * Priority: Medium
   */
  test('TC-043: Should have readable strike-through styling', async ({ cugPage }) => {
    const bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Test Product');
    
    // Get strike-through element
    const strikeThroughElement = bookingEnginePage.strikeThroughPrice.first();
    
    // Verify element is visible
    await expect(strikeThroughElement).toBeVisible();
    
    // Check CSS styling
    const textDecoration = await strikeThroughElement.evaluate(el => 
      window.getComputedStyle(el).textDecoration
    );
    
    expect(textDecoration).toContain('line-through');
    
    // Check color contrast (strike-through should be distinguishable)
    const color = await strikeThroughElement.evaluate(el => 
      window.getComputedStyle(el).color
    );
    
    console.log('Strike-through color:', color);
    
    // Take screenshot for visual verification
    await strikeThroughElement.screenshot({ 
      path: `screenshots/TC-043-strike-through-styling.png` 
    });
  });

  /**
   * TC-044: Discount Information Display
   * Priority: Medium
   */
  test('TC-044: Should display discount information clearly', async ({ cugPage }) => {
    const bookingEnginePage = new BookingEnginePage(cugPage);
    
    await bookingEnginePage.goto('cug');
    await bookingEnginePage.selectProduct('Test Product');
    
    // Verify discount badge is displayed
    await bookingEnginePage.verifyDiscountBadge(15);
    
    // Verify savings amount is displayed
    await bookingEnginePage.verifySavingsAmount(150);
    
    // Verify discount percentage is displayed
    await bookingEnginePage.verifyDiscountPercentageDisplayed(15);
    
    await cugPage.screenshot({ 
      path: `screenshots/TC-044-discount-info-display.png`,
      fullPage: true 
    });
  });
});
