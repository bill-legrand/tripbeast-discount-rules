import { test, expect } from '../fixtures/auth.fixture';
import { BookingEnginePage } from '../pages/BookingEnginePage';

/**
 * Test Suite: Low Rate Discount - Rates Under $100
 * Rule: "Low Rate Discount"
 * Discount: 2%
 * Date Range: 2026-04-01 to 2026-04-15
 * Condition: Apply only to rates under $100
 * Apply To: Adjust
 */

test.describe('Low Rate Discount - Rates Under $100', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
  });

  /**
   * Test Case 1: Verify 2% discount is applied to rates under $100 within date range
   */
  test('Should apply 2% discount to rate of $50 within date range (April 1-15, 2026)', async ({ cugPage }) => {
    // Test with a rate of $50 (well under $100 threshold)
    const checkInDate = '2026-04-05'; // Within discount date range
    const checkOutDate = '2026-04-06'; // 1 night stay
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-50', // Hotel with $50/night rate
      }
    );

    // Wait for prices to load
    await cugPage.waitForTimeout(3000);

    // Verify discount is applied
    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeTruthy();

    // Calculate expected prices
    const originalRate = 50;
    const discountPercentage = 2;
    const expectedDiscount = originalRate * (discountPercentage / 100);
    const expectedFinalPrice = originalRate - expectedDiscount;

    // Verify the discount percentage displayed
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(2);

    // Verify original and discounted prices
    const displayedOriginalPrice = await bookingEnginePage.getOriginalPrice();
    const displayedFinalPrice = await bookingEnginePage.getDiscountedPrice();

    expect(displayedOriginalPrice).toBeCloseTo(originalRate, 2);
    expect(displayedFinalPrice).toBeCloseTo(expectedFinalPrice, 2);

    // Take screenshot for documentation
    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-rate-50-applied.png',
      fullPage: true 
    });

    console.log(`✓ Rate $${originalRate}: Discount applied - $${expectedDiscount.toFixed(2)} (2%)`);
    console.log(`  Final price: $${expectedFinalPrice.toFixed(2)}`);
  });

  /**
   * Test Case 2: Verify 2% discount is applied to rate of $75
   */
  test('Should apply 2% discount to rate of $75 within date range', async ({ cugPage }) => {
    const checkInDate = '2026-04-10'; // Within discount date range
    const checkOutDate = '2026-04-11';
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-75', // Hotel with $75/night rate
      }
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeTruthy();

    const originalRate = 75;
    const expectedDiscount = 1.50; // 2% of $75
    const expectedFinalPrice = 73.50;

    const displayedFinalPrice = await bookingEnginePage.getDiscountedPrice();
    expect(displayedFinalPrice).toBeCloseTo(expectedFinalPrice, 2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-rate-75-applied.png',
      fullPage: true 
    });

    console.log(`✓ Rate $${originalRate}: Discount applied - $${expectedDiscount.toFixed(2)} (2%)`);
  });

  /**
   * Test Case 3: Verify 2% discount is applied to rate of $99 (edge case - just under threshold)
   */
  test('Should apply 2% discount to rate of $99 (edge case under $100)', async ({ cugPage }) => {
    const checkInDate = '2026-04-08';
    const checkOutDate = '2026-04-09';
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-99', // Hotel with $99/night rate
      }
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeTruthy();

    const originalRate = 99;
    const expectedDiscount = 1.98; // 2% of $99
    const expectedFinalPrice = 97.02;

    const displayedFinalPrice = await bookingEnginePage.getDiscountedPrice();
    expect(displayedFinalPrice).toBeCloseTo(expectedFinalPrice, 2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-rate-99-applied.png',
      fullPage: true 
    });

    console.log(`✓ Rate $${originalRate}: Discount applied - $${expectedDiscount.toFixed(2)} (2%)`);
  });

  /**
   * Test Case 4: Verify NO discount is applied to rate of $100 (exactly at threshold)
   */
  test('Should NOT apply discount to rate of $100 (at threshold)', async ({ cugPage }) => {
    const checkInDate = '2026-04-05';
    const checkOutDate = '2026-04-06';
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-100', // Hotel with $100/night rate
      }
    );

    await cugPage.waitForTimeout(3000);

    // Verify discount is NOT applied
    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeFalsy();

    const displayedPrice = await bookingEnginePage.getDisplayedPrice();
    expect(displayedPrice).toBeCloseTo(100, 2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-rate-100-not-applied.png',
      fullPage: true 
    });

    console.log(`✓ Rate $100: No discount applied (at threshold)`);
  });

  /**
   * Test Case 5: Verify NO discount is applied to rate of $150 (above threshold)
   */
  test('Should NOT apply discount to rate of $150 (above threshold)', async ({ cugPage }) => {
    const checkInDate = '2026-04-07';
    const checkOutDate = '2026-04-08';
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-150', // Hotel with $150/night rate
      }
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeFalsy();

    const displayedPrice = await bookingEnginePage.getDisplayedPrice();
    expect(displayedPrice).toBeCloseTo(150, 2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-rate-150-not-applied.png',
      fullPage: true 
    });

    console.log(`✓ Rate $150: No discount applied (above threshold)`);
  });

  /**
   * Test Case 6: Verify NO discount is applied to rate of $250 (well above threshold)
   */
  test('Should NOT apply discount to rate of $250 (well above threshold)', async ({ cugPage }) => {
    const checkInDate = '2026-04-12';
    const checkOutDate = '2026-04-13';
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-250', // Hotel with $250/night rate
      }
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeFalsy();

    const displayedPrice = await bookingEnginePage.getDisplayedPrice();
    expect(displayedPrice).toBeCloseTo(250, 2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-rate-250-not-applied.png',
      fullPage: true 
    });

    console.log(`✓ Rate $250: No discount applied (well above threshold)`);
  });

  /**
   * Test Case 7: Verify NO discount before date range starts (March 31, 2026)
   */
  test('Should NOT apply discount before date range starts (March 31, 2026)', async ({ cugPage }) => {
    const checkInDate = '2026-03-31'; // Before discount period
    const checkOutDate = '2026-04-01';
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-50', // Hotel with $50/night rate (under threshold)
      }
    );

    await cugPage.waitForTimeout(3000);

    // Even though rate is under $100, discount should NOT apply (outside date range)
    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeFalsy();

    const displayedPrice = await bookingEnginePage.getDisplayedPrice();
    expect(displayedPrice).toBeCloseTo(50, 2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-before-date-range.png',
      fullPage: true 
    });

    console.log(`✓ March 31: No discount applied (before date range)`);
  });

  /**
   * Test Case 8: Verify discount on first day of date range (April 1, 2026)
   */
  test('Should apply discount on first day of date range (April 1, 2026)', async ({ cugPage }) => {
    const checkInDate = '2026-04-01'; // First day of discount period
    const checkOutDate = '2026-04-02';
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-50',
      }
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeTruthy();

    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-first-day.png',
      fullPage: true 
    });

    console.log(`✓ April 1: Discount applied (first day of range)`);
  });

  /**
   * Test Case 9: Verify discount on last day of date range (April 15, 2026)
   */
  test('Should apply discount on last day of date range (April 15, 2026)', async ({ cugPage }) => {
    const checkInDate = '2026-04-15'; // Last day of discount period
    const checkOutDate = '2026-04-16';
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-50',
      }
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeTruthy();

    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-last-day.png',
      fullPage: true 
    });

    console.log(`✓ April 15: Discount applied (last day of range)`);
  });

  /**
   * Test Case 10: Verify NO discount after date range ends (April 16, 2026)
   */
  test('Should NOT apply discount after date range ends (April 16, 2026)', async ({ cugPage }) => {
    const checkInDate = '2026-04-16'; // After discount period
    const checkOutDate = '2026-04-17';
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-50',
      }
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeFalsy();

    const displayedPrice = await bookingEnginePage.getDisplayedPrice();
    expect(displayedPrice).toBeCloseTo(50, 2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-after-date-range.png',
      fullPage: true 
    });

    console.log(`✓ April 16: No discount applied (after date range)`);
  });

  /**
   * Test Case 11: Verify discount with multi-night stay (rates under $100)
   */
  test('Should apply 2% discount to each night when rate is under $100 (3-night stay)', async ({ cugPage }) => {
    const checkInDate = '2026-04-05';
    const checkOutDate = '2026-04-08'; // 3 nights
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-50',
      }
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeTruthy();

    // For 3 nights at $50/night = $150 total
    // 2% discount on $150 = $3.00
    // Final price = $147.00
    const originalTotal = 50 * 3;
    const expectedDiscount = originalTotal * 0.02;
    const expectedFinalPrice = originalTotal - expectedDiscount;

    const breakdown = await bookingEnginePage.getPriceBreakdown();
    expect(breakdown.discount).toBeCloseTo(expectedDiscount, 2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-multi-night-under-100.png',
      fullPage: true 
    });

    console.log(`✓ 3-night stay at $50/night: Discount applied - $${expectedDiscount.toFixed(2)}`);
  });

  /**
   * Test Case 12: Verify NO discount with multi-night stay (rates over $100)
   */
  test('Should NOT apply discount to multi-night stay when rate is over $100', async ({ cugPage }) => {
    const checkInDate = '2026-04-05';
    const checkOutDate = '2026-04-08'; // 3 nights
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-150', // $150/night (over threshold)
      }
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeFalsy();

    const expectedTotal = 150 * 3; // $450
    const displayedPrice = await bookingEnginePage.getDisplayedPrice();
    expect(displayedPrice).toBeCloseTo(expectedTotal, 2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-multi-night-over-100.png',
      fullPage: true 
    });

    console.log(`✓ 3-night stay at $150/night: No discount applied (rate over threshold)`);
  });

  /**
   * Test Case 13: Verify discount calculation accuracy for $99.99 rate
   */
  test('Should apply exact 2% discount to rate of $99.99', async ({ cugPage }) => {
    const checkInDate = '2026-04-10';
    const checkOutDate = '2026-04-11';
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      jwtToken,
      {
        hotel_id: 'test-hotel-99-99',
      }
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeTruthy();

    const originalRate = 99.99;
    const expectedDiscount = 2.00; // 2% of $99.99 = $1.9998 ≈ $2.00
    const expectedFinalPrice = 97.99;

    const displayedFinalPrice = await bookingEnginePage.getDiscountedPrice();
    expect(displayedFinalPrice).toBeCloseTo(expectedFinalPrice, 2);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-rate-99-99-applied.png',
      fullPage: true 
    });

    console.log(`✓ Rate $${originalRate}: Discount applied - $${expectedDiscount.toFixed(2)} (2%)`);
  });

  /**
   * Test Case 14: Verify discount with varying rates across different properties
   */
  test('Should apply discount correctly across different rate points under $100', async ({ cugPage }) => {
    const testCases = [
      { rate: 25, hotelId: 'test-hotel-25' },
      { rate: 50, hotelId: 'test-hotel-50' },
      { rate: 75, hotelId: 'test-hotel-75' },
      { rate: 99, hotelId: 'test-hotel-99' },
    ];

    const jwtToken = process.env.JWT_TOKEN || '';

    for (const testCase of testCases) {
      await bookingEnginePage.gotoHotelBookingWithDates(
        '2026-04-10',
        '2026-04-11',
        jwtToken,
        { hotel_id: testCase.hotelId }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied).toBeTruthy();

      const expectedDiscount = testCase.rate * 0.02;
      const expectedFinalPrice = testCase.rate - expectedDiscount;

      const displayedFinalPrice = await bookingEnginePage.getDiscountedPrice();
      expect(displayedFinalPrice).toBeCloseTo(expectedFinalPrice, 2);

      console.log(`✓ Rate $${testCase.rate}: Final price $${expectedFinalPrice.toFixed(2)} (2% discount)`);
    }
  });

  /**
   * Test Case 15: Verify NO discount across different rate points over $100
   */
  test('Should NOT apply discount across different rate points over $100', async ({ cugPage }) => {
    const testCases = [
      { rate: 100, hotelId: 'test-hotel-100' },
      { rate: 150, hotelId: 'test-hotel-150' },
      { rate: 200, hotelId: 'test-hotel-200' },
      { rate: 300, hotelId: 'test-hotel-300' },
    ];

    const jwtToken = process.env.JWT_TOKEN || '';

    for (const testCase of testCases) {
      await bookingEnginePage.gotoHotelBookingWithDates(
        '2026-04-10',
        '2026-04-11',
        jwtToken,
        { hotel_id: testCase.hotelId }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied).toBeFalsy();

      const displayedPrice = await bookingEnginePage.getDisplayedPrice();
      expect(displayedPrice).toBeCloseTo(testCase.rate, 2);

      console.log(`✓ Rate $${testCase.rate}: No discount applied (at or above threshold)`);
    }
  });
});

/**
 * Test Suite: Low Rate Discount - Edge Cases and Boundary Testing
 */
test.describe('Low Rate Discount - Edge Cases', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
  });

  /**
   * Test Case 16: Verify discount with rate exactly at $99.99 (boundary)
   */
  test('Should handle boundary case: $99.99 vs $100.00', async ({ cugPage }) => {
    const jwtToken = process.env.JWT_TOKEN || '';

    // Test $99.99 - should get discount
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-04-10',
      '2026-04-11',
      jwtToken,
      { hotel_id: 'test-hotel-99-99' }
    );

    await cugPage.waitForTimeout(3000);
    let isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeTruthy();
    console.log('✓ $99.99: Discount applied');

    // Test $100.00 - should NOT get discount
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-04-10',
      '2026-04-11',
      jwtToken,
      { hotel_id: 'test-hotel-100' }
    );

    await cugPage.waitForTimeout(3000);
    isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeFalsy();
    console.log('✓ $100.00: No discount applied');

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-boundary-test.png',
      fullPage: true 
    });
  });

  /**
   * Test Case 17: Verify discount with very low rates (under $10)
   */
  test('Should apply discount to very low rates under $10', async ({ cugPage }) => {
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-04-10',
      '2026-04-11',
      jwtToken,
      { hotel_id: 'test-hotel-5' } // $5/night
    );

    await cugPage.waitForTimeout(3000);

    const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
    expect(isDiscountApplied).toBeTruthy();

    const expectedFinalPrice = 5 - (5 * 0.02); // $4.90
    const displayedFinalPrice = await bookingEnginePage.getDiscountedPrice();
    expect(displayedFinalPrice).toBeCloseTo(expectedFinalPrice, 2);

    console.log('✓ Rate $5: Discount applied - $0.10 (2%)');
  });

  /**
   * Test Case 18: Verify discount display shows strike-through pricing
   */
  test('Should display strike-through price when discount is applied', async ({ cugPage }) => {
    const jwtToken = process.env.JWT_TOKEN || '';

    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-04-10',
      '2026-04-11',
      jwtToken,
      { hotel_id: 'test-hotel-50' }
    );

    await cugPage.waitForTimeout(3000);

    // Verify strike-through prices are visible
    const strikeThroughPrices = await bookingEnginePage.getStrikeThroughPrices();
    expect(strikeThroughPrices.length).toBeGreaterThan(0);

    // Verify original price is shown with strike-through
    expect(strikeThroughPrices).toContain(50);

    await cugPage.screenshot({ 
      path: 'test-results/hotel/screenshots/low-rate-discount-strike-through.png',
      fullPage: true 
    });

    console.log('✓ Strike-through pricing displayed correctly');
  });
});

/**
 * Test Suite: Low Rate Discount - Date Range Validation
 */
test.describe('Low Rate Discount - Date Range Validation', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
  });

  /**
   * Test Case 19: Verify discount across entire date range
   */
  test('Should apply discount consistently across entire date range (April 1-15)', async ({ cugPage }) => {
    const jwtToken = process.env.JWT_TOKEN || '';
    const testDates = [
      '2026-04-01', '2026-04-05', '2026-04-10', '2026-04-15'
    ];

    for (const checkInDate of testDates) {
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + 1);
      const checkOutStr = checkOutDate.toISOString().split('T')[0];

      await bookingEnginePage.gotoHotelBookingWithDates(
        checkInDate,
        checkOutStr,
        jwtToken,
        { hotel_id: 'test-hotel-50' }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied).toBeTruthy();

      console.log(`✓ ${checkInDate}: Discount applied`);
    }
  });

  /**
   * Test Case 20: Verify NO discount outside date range
   */
  test('Should NOT apply discount outside date range', async ({ cugPage }) => {
    const jwtToken = process.env.JWT_TOKEN || '';
    const testDates = [
      '2026-03-31', // Before range
      '2026-04-16', // After range
      '2026-05-01', // Well after range
    ];

    for (const checkInDate of testDates) {
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + 1);
      const checkOutStr = checkOutDate.toISOString().split('T')[0];

      await bookingEnginePage.gotoHotelBookingWithDates(
        checkInDate,
        checkOutStr,
        jwtToken,
        { hotel_id: 'test-hotel-50' }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied).toBeFalsy();

      console.log(`✓ ${checkInDate}: No discount applied (outside range)`);
    }
  });
});


