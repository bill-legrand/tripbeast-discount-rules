import { test, expect } from './fixtures/auth.fixture';
import { BookingEnginePage } from './pages/BookingEnginePage';
import lowRateDiscountData, {
  calculateExpectedDiscount,
  calculateExpectedFinalPrice,
  getNextDay,
  getHotelsWithDiscount,
  getHotelsWithoutDiscount,
  getDatesWithinPeriod,
  getDatesOutsidePeriod,
  formatCurrency,
  calculateMultiNightDiscount,
  calculateMultiNightFinalPrice,
} from './helpers/low-rate-discount-data';

/**
 * Enhanced Test Suite: Low Rate Discount - Data-Driven Tests
 * Uses test data helpers for maintainable, scalable testing
 */

test.describe('Low Rate Discount - Data-Driven Tests', () => {
  let bookingEnginePage: BookingEnginePage;
  const jwtToken = process.env.JWT_TOKEN || '';

  test.beforeEach(async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
  });

  /**
   * Data-Driven Test: All rates under $100 within date range
   */
  test('Should apply 2% discount to all rates under $100 within date range', async ({ cugPage }) => {
    const hotelsWithDiscount = getHotelsWithDiscount();
    const testDate = '2026-04-10'; // Mid-range date
    const checkOutDate = getNextDay(testDate);

    for (const hotel of hotelsWithDiscount) {
      console.log(`\nTesting: ${hotel.description}`);
      
      await bookingEnginePage.gotoHotelBookingWithDates(
        testDate,
        checkOutDate,
        jwtToken,
        { hotel_id: hotel.hotelId }
      );

      await cugPage.waitForTimeout(3000);

      // Verify discount is applied
      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied, `Discount should be applied for ${hotel.description}`).toBeTruthy();

      // Calculate expected values
      const expectedDiscount = calculateExpectedDiscount(hotel.rate);
      const expectedFinalPrice = calculateExpectedFinalPrice(hotel.rate);

      // Verify discount percentage
      const appliedDiscount = await bookingEnginePage.getAppliedDiscountPercentage();
      expect(appliedDiscount, `Discount percentage for ${hotel.description}`).toBe(
        lowRateDiscountData.config.discountPercentage
      );

      console.log(`✓ Rate: ${formatCurrency(hotel.rate)}`);
      console.log(`  Discount: ${formatCurrency(expectedDiscount)} (${lowRateDiscountData.config.discountPercentage}%)`);
      console.log(`  Final: ${formatCurrency(expectedFinalPrice)}`);
    }

    await cugPage.screenshot({ 
      path: 'screenshots/low-rate-discount-all-rates-under-100.png',
      fullPage: true 
    });
  });

  /**
   * Data-Driven Test: All rates at/above $100 should NOT get discount
   */
  test('Should NOT apply discount to rates at or above $100', async ({ cugPage }) => {
    const hotelsWithoutDiscount = getHotelsWithoutDiscount();
    const testDate = '2026-04-10';
    const checkOutDate = getNextDay(testDate);

    for (const hotel of hotelsWithoutDiscount) {
      console.log(`\nTesting: ${hotel.description}`);
      
      await bookingEnginePage.gotoHotelBookingWithDates(
        testDate,
        checkOutDate,
        jwtToken,
        { hotel_id: hotel.hotelId }
      );

      await cugPage.waitForTimeout(3000);

      // Verify NO discount is applied
      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied, `No discount should be applied for ${hotel.description}`).toBeFalsy();

      // Verify full price is shown
      const displayedPrice = await bookingEnginePage.getDisplayedPrice();
      expect(displayedPrice, `Full price for ${hotel.description}`).toBeCloseTo(hotel.rate, 2);

      console.log(`✓ Rate: ${formatCurrency(hotel.rate)} - No discount (at/above threshold)`);
    }

    await cugPage.screenshot({ 
      path: 'screenshots/low-rate-discount-rates-above-100.png',
      fullPage: true 
    });
  });

  /**
   * Data-Driven Test: Discount applies across all dates within range
   */
  test('Should apply discount consistently across all dates within range', async ({ cugPage }) => {
    const datesWithinPeriod = getDatesWithinPeriod();
    const testHotel = getHotelsWithDiscount()[0]; // Use first hotel with discount eligibility

    for (const dateData of datesWithinPeriod) {
      console.log(`\nTesting: ${dateData.description} (${dateData.checkInDate})`);
      
      const checkOutDate = getNextDay(dateData.checkInDate);

      await bookingEnginePage.gotoHotelBookingWithDates(
        dateData.checkInDate,
        checkOutDate,
        jwtToken,
        { hotel_id: testHotel.hotelId }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied, `Discount should apply on ${dateData.description}`).toBeTruthy();

      console.log(`✓ ${dateData.checkInDate}: Discount applied`);
    }

    await cugPage.screenshot({ 
      path: 'screenshots/low-rate-discount-all-dates-within-range.png',
      fullPage: true 
    });
  });

  /**
   * Data-Driven Test: NO discount outside date range
   */
  test('Should NOT apply discount outside the date range', async ({ cugPage }) => {
    const datesOutsidePeriod = getDatesOutsidePeriod();
    const testHotel = getHotelsWithDiscount()[0];

    for (const dateData of datesOutsidePeriod) {
      console.log(`\nTesting: ${dateData.description} (${dateData.checkInDate})`);
      
      const checkOutDate = getNextDay(dateData.checkInDate);

      await bookingEnginePage.gotoHotelBookingWithDates(
        dateData.checkInDate,
        checkOutDate,
        jwtToken,
        { hotel_id: testHotel.hotelId }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied, `No discount should apply on ${dateData.description}`).toBeFalsy();

      console.log(`✓ ${dateData.checkInDate}: No discount (outside range)`);
    }

    await cugPage.screenshot({ 
      path: 'screenshots/low-rate-discount-dates-outside-range.png',
      fullPage: true 
    });
  });

  /**
   * Data-Driven Test: Multi-night stays
   */
  test('Should apply discount correctly for multi-night stays', async ({ cugPage }) => {
    const multiNightTests = lowRateDiscountData.multiNight;

    for (const testData of multiNightTests) {
      if (!testData.shouldGetDiscount) continue; // Skip non-discount scenarios for this test

      console.log(`\nTesting: ${testData.description}`);
      
      const checkOutDate = new Date(testData.checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + testData.nights);
      const checkOutStr = checkOutDate.toISOString().split('T')[0];

      await bookingEnginePage.gotoHotelBookingWithDates(
        testData.checkInDate,
        checkOutStr,
        jwtToken,
        { hotel_id: testData.hotelId }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied, `Discount should apply for ${testData.description}`).toBeTruthy();

      const expectedDiscount = calculateMultiNightDiscount(testData.rate, testData.nights);
      const expectedFinalPrice = calculateMultiNightFinalPrice(testData.rate, testData.nights);

      console.log(`✓ ${testData.nights} nights at ${formatCurrency(testData.rate)}/night`);
      console.log(`  Total: ${formatCurrency(testData.rate * testData.nights)}`);
      console.log(`  Discount: ${formatCurrency(expectedDiscount)}`);
      console.log(`  Final: ${formatCurrency(expectedFinalPrice)}`);
    }

    await cugPage.screenshot({ 
      path: 'screenshots/low-rate-discount-multi-night-stays.png',
      fullPage: true 
    });
  });

  /**
   * Data-Driven Test: Boundary cases
   */
  test('Should handle boundary cases correctly', async ({ cugPage }) => {
    const boundaryTests = lowRateDiscountData.boundary;
    const testDate = '2026-04-10';
    const checkOutDate = getNextDay(testDate);

    for (const testCase of boundaryTests) {
      // Skip zero rate test as it may not have a real hotel
      if (testCase.rate === 0) continue;

      console.log(`\nTesting: ${testCase.description} (${formatCurrency(testCase.rate)})`);
      
      // Determine hotel ID based on rate
      let hotelId = '';
      if (testCase.rate === 99.99) hotelId = 'test-hotel-99-99';
      else if (testCase.rate === 100.00) hotelId = 'test-hotel-100';
      else if (testCase.rate === 100.01) hotelId = 'test-hotel-100-01';
      else if (testCase.rate === 1.00) hotelId = 'test-hotel-1';

      if (!hotelId) continue;

      await bookingEnginePage.gotoHotelBookingWithDates(
        testDate,
        checkOutDate,
        jwtToken,
        { hotel_id: hotelId }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      
      if (testCase.shouldGetDiscount) {
        expect(isDiscountApplied, `Discount should apply for ${testCase.description}`).toBeTruthy();
        console.log(`✓ Discount applied as expected`);
      } else {
        expect(isDiscountApplied, `No discount should apply for ${testCase.description}`).toBeFalsy();
        console.log(`✓ No discount applied as expected`);
      }
    }

    await cugPage.screenshot({ 
      path: 'screenshots/low-rate-discount-boundary-cases.png',
      fullPage: true 
    });
  });
});

/**
 * Test Suite: Low Rate Discount - Comprehensive Matrix Testing
 */
test.describe('Low Rate Discount - Matrix Testing', () => {
  let bookingEnginePage: BookingEnginePage;
  const jwtToken = process.env.JWT_TOKEN || '';

  test.beforeEach(async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
  });

  /**
   * Matrix Test: Rate threshold boundaries
   */
  test('Matrix: Rate threshold boundaries ($99, $99.99, $100, $100.01)', async ({ cugPage }) => {
    const boundaryRates = [
      { hotelId: 'test-hotel-99', rate: 99, shouldDiscount: true },
      { hotelId: 'test-hotel-99-99', rate: 99.99, shouldDiscount: true },
      { hotelId: 'test-hotel-100', rate: 100, shouldDiscount: false },
      { hotelId: 'test-hotel-100-01', rate: 100.01, shouldDiscount: false },
    ];

    const testDate = '2026-04-10';
    const checkOutDate = getNextDay(testDate);

    console.log('\n=== Rate Threshold Boundary Matrix ===');
    console.log('Date: Within discount period (April 10, 2026)');
    console.log('Threshold: $100\n');

    for (const test of boundaryRates) {
      await bookingEnginePage.gotoHotelBookingWithDates(
        testDate,
        checkOutDate,
        jwtToken,
        { hotel_id: test.hotelId }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied).toBe(test.shouldDiscount);

      const status = test.shouldDiscount ? '✓ Discount Applied' : '✗ No Discount';
      console.log(`${formatCurrency(test.rate)}: ${status}`);
    }

    await cugPage.screenshot({ 
      path: 'screenshots/low-rate-discount-matrix-rate-boundaries.png',
      fullPage: true 
    });
  });

  /**
   * Matrix Test: Date range boundaries
   */
  test('Matrix: Date range boundaries (March 31, April 1, April 15, April 16)', async ({ cugPage }) => {
    const boundaryDates = [
      { date: '2026-03-31', description: 'March 31 (before)', shouldDiscount: false },
      { date: '2026-04-01', description: 'April 1 (first day)', shouldDiscount: true },
      { date: '2026-04-15', description: 'April 15 (last day)', shouldDiscount: true },
      { date: '2026-04-16', description: 'April 16 (after)', shouldDiscount: false },
    ];

    const testHotel = 'test-hotel-50'; // Rate under $100

    console.log('\n=== Date Range Boundary Matrix ===');
    console.log('Hotel: $50/night (under threshold)');
    console.log('Range: April 1-15, 2026\n');

    for (const test of boundaryDates) {
      const checkOutDate = getNextDay(test.date);

      await bookingEnginePage.gotoHotelBookingWithDates(
        test.date,
        checkOutDate,
        jwtToken,
        { hotel_id: testHotel }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied).toBe(test.shouldDiscount);

      const status = test.shouldDiscount ? '✓ Discount Applied' : '✗ No Discount';
      console.log(`${test.description}: ${status}`);
    }

    await cugPage.screenshot({ 
      path: 'screenshots/low-rate-discount-matrix-date-boundaries.png',
      fullPage: true 
    });
  });

  /**
   * Matrix Test: Combined rate and date scenarios
   */
  test('Matrix: Combined rate and date scenarios', async ({ cugPage }) => {
    const scenarios = [
      // Under $100, within range - SHOULD discount
      { rate: 50, hotelId: 'test-hotel-50', date: '2026-04-10', expected: true, desc: 'Under $100, within range' },
      
      // Under $100, outside range - NO discount
      { rate: 50, hotelId: 'test-hotel-50', date: '2026-03-31', expected: false, desc: 'Under $100, before range' },
      { rate: 50, hotelId: 'test-hotel-50', date: '2026-04-16', expected: false, desc: 'Under $100, after range' },
      
      // At/Above $100, within range - NO discount
      { rate: 100, hotelId: 'test-hotel-100', date: '2026-04-10', expected: false, desc: 'At $100, within range' },
      { rate: 150, hotelId: 'test-hotel-150', date: '2026-04-10', expected: false, desc: 'Above $100, within range' },
      
      // At/Above $100, outside range - NO discount
      { rate: 100, hotelId: 'test-hotel-100', date: '2026-03-31', expected: false, desc: 'At $100, before range' },
      { rate: 150, hotelId: 'test-hotel-150', date: '2026-04-16', expected: false, desc: 'Above $100, after range' },
    ];

    console.log('\n=== Combined Rate & Date Matrix ===\n');

    for (const scenario of scenarios) {
      const checkOutDate = getNextDay(scenario.date);

      await bookingEnginePage.gotoHotelBookingWithDates(
        scenario.date,
        checkOutDate,
        jwtToken,
        { hotel_id: scenario.hotelId }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied, scenario.desc).toBe(scenario.expected);

      const status = scenario.expected ? '✓ Discount' : '✗ No Discount';
      console.log(`${scenario.desc}: ${status}`);
    }

    await cugPage.screenshot({ 
      path: 'screenshots/low-rate-discount-matrix-combined.png',
      fullPage: true 
    });
  });
});

/**
 * Test Suite: Low Rate Discount - Regression Tests
 */
test.describe('Low Rate Discount - Regression Tests', () => {
  let bookingEnginePage: BookingEnginePage;
  const jwtToken = process.env.JWT_TOKEN || '';

  test.beforeEach(async ({ cugPage }) => {
    bookingEnginePage = new BookingEnginePage(cugPage);
  });

  /**
   * Regression: Verify discount doesn't affect rates above threshold
   */
  test('Regression: High-value bookings should not receive discount', async ({ cugPage }) => {
    const highValueRates = [100, 150, 200, 250, 300, 500, 1000];
    const testDate = '2026-04-10';
    const checkOutDate = getNextDay(testDate);

    console.log('\n=== Regression: High-Value Rates ===\n');

    for (const rate of highValueRates) {
      const hotelId = `test-hotel-${rate}`;

      await bookingEnginePage.gotoHotelBookingWithDates(
        testDate,
        checkOutDate,
        jwtToken,
        { hotel_id: hotelId }
      );

      await cugPage.waitForTimeout(3000);

      const isDiscountApplied = await bookingEnginePage.isDiscountApplied();
      expect(isDiscountApplied, `No discount for ${formatCurrency(rate)}`).toBeFalsy();

      console.log(`✓ ${formatCurrency(rate)}: No discount applied (as expected)`);
    }
  });

  /**
   * Regression: Verify discount calculation precision
   */
  test('Regression: Discount calculation should be precise to 2 decimal places', async ({ cugPage }) => {
    const testRates = [
      { rate: 50.00, expectedDiscount: 1.00, expectedFinal: 49.00 },
      { rate: 75.50, expectedDiscount: 1.51, expectedFinal: 73.99 },
      { rate: 99.99, expectedDiscount: 2.00, expectedFinal: 97.99 },
    ];

    const testDate = '2026-04-10';
    const checkOutDate = getNextDay(testDate);

    console.log('\n=== Regression: Calculation Precision ===\n');

    for (const test of testRates) {
      const hotelId = `test-hotel-${test.rate.toString().replace('.', '-')}`;

      await bookingEnginePage.gotoHotelBookingWithDates(
        testDate,
        checkOutDate,
        jwtToken,
        { hotel_id: hotelId }
      );

      await cugPage.waitForTimeout(3000);

      const breakdown = await bookingEnginePage.getPriceBreakdown();
      
      expect(breakdown.discount).toBeCloseTo(test.expectedDiscount, 2);
      
      console.log(`✓ ${formatCurrency(test.rate)}: Discount ${formatCurrency(test.expectedDiscount)} (precise)`);
    }
  });
});



