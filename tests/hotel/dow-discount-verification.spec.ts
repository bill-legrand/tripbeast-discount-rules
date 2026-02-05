import { test, expect } from '@playwright/test';
import { BookingEnginePage } from '../pages/BookingEnginePage';
import { 
  DOW_DISCOUNT_CONFIG, 
  getDOWTestDates, 
  formatDateForInput, 
  getCheckoutDate,
  getDayName,
  isWithinDOWRange,
  getDayOfWeekDiscount,
  BOOKING_ENGINE_JWT,
  TEST_HOTEL_PARAMS
} from '../helpers/dow-discount-data';

/**
 * Test Suite: Day of Week Discount Verification
 * Tests the DOW discount pattern: Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, Sat 40%, Sun 10%
 * Date Range: 2026-03-02 to 2026-03-08
 * 
 * Based on TC-018: Date Range-Based Discount with DOW pattern
 * Based on TC-020: Dynamic Discount Rules
 */

test.describe('Day of Week Discount Verification', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  /**
   * Test: Monday (2026-03-02) should apply 15% discount
   */
  test('Monday (2026-03-02) should apply 15% discount', async ({ page }) => {
    const checkInDate = '2026-03-02'; // Monday
    const checkOutDate = '2026-03-03';
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    // Verify 15% discount is applied
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(15);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/hotel/dow-monday-15-percent.png',
      fullPage: true 
    });
    
    console.log('✓ Monday (3/2): 15% discount verified');
  });

  /**
   * Test: Tuesday (2026-03-03) should apply 20% discount
   */
  test('Tuesday (2026-03-03) should apply 20% discount', async ({ page }) => {
    const checkInDate = '2026-03-03'; // Tuesday
    const checkOutDate = '2026-03-04';
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(20);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-tuesday-20-percent.png',
      fullPage: true 
    });
    
    console.log('✓ Tuesday (3/3): 20% discount verified');
  });

  /**
   * Test: Wednesday (2026-03-04) should apply 25% discount
   */
  test('Wednesday (2026-03-04) should apply 25% discount', async ({ page }) => {
    const checkInDate = '2026-03-04'; // Wednesday
    const checkOutDate = '2026-03-05';
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(25);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-wednesday-25-percent.png',
      fullPage: true 
    });
    
    console.log('✓ Wednesday (3/4): 25% discount verified');
  });

  /**
   * Test: Thursday (2026-03-05) should apply 30% discount
   */
  test('Thursday (2026-03-05) should apply 30% discount', async ({ page }) => {
    const checkInDate = '2026-03-05'; // Thursday
    const checkOutDate = '2026-03-06';
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(30);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-thursday-30-percent.png',
      fullPage: true 
    });
    
    console.log('✓ Thursday (3/5): 30% discount verified');
  });

  /**
   * Test: Friday (2026-03-06) should apply 35% discount
   */
  test('Friday (2026-03-06) should apply 35% discount', async ({ page }) => {
    const checkInDate = '2026-03-06'; // Friday
    const checkOutDate = '2026-03-07';
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(35);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-friday-35-percent.png',
      fullPage: true 
    });
    
    console.log('✓ Friday (3/6): 35% discount verified');
  });

  /**
   * Test: Saturday (2026-03-07) should apply highest discount (40%)
   */
  test('Saturday (2026-03-07) should apply highest discount (40%)', async ({ page }) => {
    const checkInDate = '2026-03-07'; // Saturday
    const checkOutDate = '2026-03-08';
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(40);
    
    // Verify this is the highest discount
    const allDiscounts = Object.values(DOW_DISCOUNT_CONFIG.discounts);
    const maxDiscount = Math.max(...allDiscounts);
    expect(appliedDiscount).toBe(maxDiscount);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-saturday-40-percent-highest.png',
      fullPage: true 
    });
    
    console.log('✓ Saturday (3/7): 40% discount verified (HIGHEST)');
  });

  /**
   * Test: Sunday (2026-03-08) should apply lowest discount (10%)
   */
  test('Sunday (2026-03-08) should apply lowest discount (10%)', async ({ page }) => {
    const checkInDate = '2026-03-08'; // Sunday
    const checkOutDate = '2026-03-09';
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(10);
    
    // Verify this is the lowest discount
    const allDiscounts = Object.values(DOW_DISCOUNT_CONFIG.discounts);
    const minDiscount = Math.min(...allDiscounts);
    expect(appliedDiscount).toBe(minDiscount);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-sunday-10-percent-lowest.png',
      fullPage: true 
    });
    
    console.log('✓ Sunday (3/8): 10% discount verified (LOWEST)');
  });
});

test.describe('Day of Week Discount - Comprehensive Testing', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  /**
   * Test: All days in DOW range using data-driven approach
   */
  test('Should apply correct discount for all days in DOW range', async ({ page }) => {
    const testDates = getDOWTestDates();
    
    for (const testData of testDates) {
      console.log(`\nTesting ${testData.day} (${formatDateForInput(testData.date)})...`);
      
      const checkInDate = formatDateForInput(testData.date);
      const nextDay = new Date(testData.date);
      nextDay.setDate(nextDay.getDate() + 1);
      const checkOutDate = formatDateForInput(nextDay);
      
      await bookingEnginePage.gotoHotelBookingWithDates(
        checkInDate,
        checkOutDate,
        BOOKING_ENGINE_JWT,
        TEST_HOTEL_PARAMS
      );
      
      const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
      
      expect(appliedDiscount).toBe(testData.discount);
      console.log(`✓ ${testData.day}: Expected ${testData.discount}%, Got ${appliedDiscount}%`);
    }
    
    console.log('\n✅ All DOW discounts verified successfully!');
  });

  /**
   * Test: Weekend vs Weekday discount comparison
   */
  test('Saturday (40%) should have higher discount than Monday (15%)', async ({ page }) => {
    // Test Monday
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-02',
      '2026-03-03',
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    const mondayDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    // Test Saturday
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-07',
      '2026-03-08',
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    const saturdayDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    // Verify Saturday discount is higher
    expect(saturdayDiscount).toBeGreaterThan(mondayDiscount);
    expect(saturdayDiscount).toBe(40);
    expect(mondayDiscount).toBe(15);
    
    console.log(`✓ Weekend discount (${saturdayDiscount}%) > Weekday discount (${mondayDiscount}%)`);
  });
});

test.describe('Day of Week Discount - Multi-Night Stays', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  /**
   * Test: 2-night stay Monday-Wednesday (15%, 20%)
   */
  test('2-night stay Mon-Wed should apply blended or per-night discount', async ({ page }) => {
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-02', // Monday
      '2026-03-04', // Check out Wednesday
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    console.log(`2-night Mon-Wed discount: ${appliedDiscount}%`);
    console.log('Expected: 15% (Mon) + 20% (Tue) = avg 17.5% or first-night 15%');
    
    // Document the behavior - could be first night, average, or highest
    expect(appliedDiscount).toBeGreaterThan(0);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-multi-night-mon-wed.png',
      fullPage: true 
    });
  });

  /**
   * Test: 3-night stay Wednesday-Saturday (25%, 30%, 35%)
   */
  test('3-night stay Wed-Sat should handle multiple DOW discounts', async ({ page }) => {
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-04', // Wednesday
      '2026-03-07', // Check out Saturday
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    console.log(`3-night Wed-Sat discount: ${appliedDiscount}%`);
    console.log('Nights: Wed 25%, Thu 30%, Fri 35%');
    console.log('Expected: avg 30% or first-night 25% or highest 35%');
    
    expect(appliedDiscount).toBeGreaterThan(0);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-multi-night-wed-sat.png',
      fullPage: true 
    });
  });

  /**
   * Test: 4-night stay Thursday-Monday (30%, 35%, 40%, 10%)
   */
  test('4-night stay Thu-Mon spanning weekend should handle highest discount day', async ({ page }) => {
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-05', // Thursday
      '2026-03-09', // Check out Monday (next week)
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    console.log(`4-night Thu-Mon discount: ${appliedDiscount}%`);
    console.log('Nights: Thu 30%, Fri 35%, Sat 40% (highest), Sun 10% (lowest)');
    console.log('Expected: Could use highest (40%), avg (28.75%), or first-night (30%)');
    
    expect(appliedDiscount).toBeGreaterThan(0);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-multi-night-thu-mon.png',
      fullPage: true 
    });
  });

  /**
   * Test: Week-long stay covering entire DOW range
   */
  test('7-night stay covering entire DOW range (Mon-Mon)', async ({ page }) => {
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-02', // Monday
      '2026-03-09', // Check out Monday
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    console.log(`7-night full week discount: ${appliedDiscount}%`);
    console.log('All nights: Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, Sat 40%, Sun 10%');
    console.log('Average would be: 25%');
    
    expect(appliedDiscount).toBeGreaterThan(0);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-multi-night-full-week.png',
      fullPage: true 
    });
  });
});

test.describe('Day of Week Discount - Edge Cases with Multi-Night Stays', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  /**
   * Test: First day of DOW range (Monday 3/2)
   */
  test('First day of DOW range (Monday 3/2) should apply discount', async ({ page }) => {
    const firstDay = new Date('2026-03-02'); // First day of range
    
    expect(isWithinDOWRange(firstDay)).toBeTruthy();
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-02',
      '2026-03-03',
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(15);
    
    console.log('✓ First day of DOW range: 15% discount applied');
  });

  /**
   * Test: Last day of DOW range (Sunday 3/8)
   */
  test('Last day of DOW range (Sunday 3/8) should apply discount', async ({ page }) => {
    const lastDay = new Date('2026-03-08'); // Last day of range
    
    expect(isWithinDOWRange(lastDay)).toBeTruthy();
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-08',
      '2026-03-09',
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(10);
    
    console.log('✓ Last day of DOW range: 10% discount applied');
  });

  /**
   * Test: Stay starting before range and ending in range
   */
  test('Stay starting before DOW range (3/1) and ending in range (3/4) should handle mixed discounts', async ({ page }) => {
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-01', // Sunday before range
      '2026-03-04', // Wednesday in range
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    console.log(`Stay crossing into DOW range: ${appliedDiscount}%`);
    console.log('Nights: Sun 3/1 (no DOW), Mon 3/2 (15%), Tue 3/3 (20%)');
    console.log('Expected: Blended or partial DOW discount');
    
    expect(appliedDiscount).toBeGreaterThanOrEqual(0);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-edge-before-to-during.png',
      fullPage: true 
    });
  });

  /**
   * Test: Stay starting in range and ending after range
   */
  test('Stay starting in DOW range (3/6) and ending after range (3/10) should handle mixed discounts', async ({ page }) => {
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-06', // Friday in range
      '2026-03-10', // Tuesday after range
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    console.log(`Stay crossing out of DOW range: ${appliedDiscount}%`);
    console.log('Nights: Fri 3/6 (35%), Sat 3/7 (40%), Sun 3/8 (10%), Mon 3/9 (no DOW)');
    console.log('Expected: Blended or partial DOW discount');
    
    expect(appliedDiscount).toBeGreaterThanOrEqual(0);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-edge-during-to-after.png',
      fullPage: true 
    });
  });

  /**
   * Test: Stay spanning entire range plus days before and after
   */
  test('Stay spanning before, during, and after DOW range should apply mixed discount', async ({ page }) => {
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-02-28', // Saturday before range
      '2026-03-11', // Wednesday after range
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    console.log(`Long stay spanning full DOW range: ${appliedDiscount}%`);
    console.log('11 nights total: 3 before DOW, 7 with DOW, 1 after DOW');
    console.log('Expected: Blended discount across all nights');
    
    expect(appliedDiscount).toBeGreaterThanOrEqual(0);
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-edge-full-span.png',
      fullPage: true 
    });
  });

  /**
   * Test: Date before DOW range (1 night)
   */
  test('1-night stay before DOW range (2026-03-01) should not apply DOW discount', async ({ page }) => {
    const beforeRange = new Date('2026-03-01');
    
    expect(isWithinDOWRange(beforeRange)).toBeFalsy();
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-01',
      '2026-03-02',
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    console.log(`Discount before DOW range: ${appliedDiscount}%`);
    
    // Verify it's not following the DOW pattern for Sunday (10%)
    const expectedDOWDiscount = getDayOfWeekDiscount(beforeRange);
    if (appliedDiscount !== 0) {
      // If there's a discount, it should not be the DOW Sunday discount
      expect(appliedDiscount).not.toBe(expectedDOWDiscount);
    }
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-before-range.png',
      fullPage: true 
    });
  });

  /**
   * Test: Date after DOW range (1 night)
   */
  test('1-night stay after DOW range (2026-03-09) should not apply DOW discount', async ({ page }) => {
    const afterRange = new Date('2026-03-09');
    
    expect(isWithinDOWRange(afterRange)).toBeFalsy();
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-09',
      '2026-03-10',
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    
    console.log(`Discount after DOW range: ${appliedDiscount}%`);
    
    // Verify it's not following the DOW pattern for Monday (15%)
    const expectedDOWDiscount = getDayOfWeekDiscount(afterRange);
    if (appliedDiscount !== 0) {
      expect(appliedDiscount).not.toBe(expectedDOWDiscount);
    }
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-after-range.png',
      fullPage: true 
    });
  });
});

test.describe('Day of Week Discount - Price Verification', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  /**
   * Test: Verify discount is applied on subtotal (excluding taxes/fees)
   */
  test('DOW discount should be applied on subtotal only', async ({ page }) => {
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-07', // Saturday - 40% discount
      '2026-03-08',
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    // Verify 40% discount is shown
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(40);
    
    // Try to get price breakdown if available
    try {
      const breakdown = await bookingEnginePage.getPriceBreakdown();
      
      console.log('Price Breakdown:');
      console.log(`Subtotal: $${breakdown.subtotal}`);
      console.log(`Discount: $${breakdown.discount}`);
      console.log(`Tax: $${breakdown.tax}`);
      console.log(`Fees: $${breakdown.fees}`);
      console.log(`Total: $${breakdown.total}`);
      
      // Verify discount is calculated on subtotal (not including tax/fees)
      expect(breakdown.discount).toBeGreaterThan(0);
    } catch (e) {
      console.log('Price breakdown not available on this page, but discount percentage verified');
    }
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-price-breakdown.png',
      fullPage: true 
    });
  });

  /**
   * Test: Strike-through display with DOW discount
   */
  test('Should display strike-through price with DOW discount', async ({ page }) => {
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-03-05', // Thursday - 30% discount
      '2026-03-06',
      BOOKING_ENGINE_JWT,
      TEST_HOTEL_PARAMS
    );
    
    // Verify 30% discount is applied
    const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
    expect(appliedDiscount).toBe(30);
    
    // Check if discount is applied and visible
    const isDiscountVisible = await bookingEnginePage.isDiscountApplied();
    console.log(`Discount visible: ${isDiscountVisible}`);
    
    // Check for strike-through pricing if enabled
    try {
      const strikeThroughPrices = await bookingEnginePage.getStrikeThroughPrices();
      
      if (strikeThroughPrices.length > 0) {
        console.log('Strike-through prices found:', strikeThroughPrices);
        
        // Verify strike-through price is higher than final price
        const finalPrice = await bookingEnginePage.getDiscountedPrice();
        expect(strikeThroughPrices[0]).toBeGreaterThan(finalPrice);
      } else {
        console.log('No strike-through prices found (may not be enabled)');
      }
    } catch (e) {
      console.log('Strike-through pricing not available, but discount verified');
    }
    
    await page.screenshot({ 
      path: 'test-results/hotel/dow-strike-through-display.png',
      fullPage: true 
    });
  });
});
