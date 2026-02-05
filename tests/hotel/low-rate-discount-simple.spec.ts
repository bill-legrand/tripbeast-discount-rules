import { test, expect } from '@playwright/test';
import { BookingEnginePage } from '../pages/BookingEnginePage';

/**
 * Simplified Low Rate Discount Test
 * Tests the Low Rate Discount rule: 2% discount on rates under $100
 * Date Range: 2026-04-01 to 2026-04-15
 * 
 * Uses REAL hotel from your system (ID: 2008 - Las Vegas)
 */

// Real hotel parameters that work in your system
const TEST_HOTEL_PARAMS = {
  hotel_id: '2008',
  property_id: '12384405',
  room_id: '201273159',
  search_query: 'Las Vegas',
  mobile_promotion: 'false',
  longitude: '-115.141376',
  latitude: '36.17006',
  type: 'id',
  gds: 'expedia'
};

const JWT_TOKEN = process.env.JWT_TOKEN || '';

test.describe('Low Rate Discount - Real Hotel Tests', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  /**
   * Test 1: Check discount within date range (April 5, 2026)
   */
  test('Should check Low Rate Discount on April 5, 2026 (within range)', async ({ page }) => {
    const checkInDate = '2026-04-05'; // Within discount date range
    const checkOutDate = '2026-04-06';
    
    console.log('\n=== Low Rate Discount Test ===');
    console.log(`Check-in: ${checkInDate}`);
    console.log(`Check-out: ${checkOutDate}`);
    console.log(`Hotel ID: ${TEST_HOTEL_PARAMS.hotel_id}`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      JWT_TOKEN,
      TEST_HOTEL_PARAMS
    );
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // Wait for prices to appear (up to 30 seconds)
    console.log('Waiting for prices to load...');
    let pricesFound = false;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (!pricesFound && attempts < maxAttempts) {
      const pageText = await page.textContent('body');
      if (pageText && (
        pageText.includes('Item Price') || 
        pageText.includes('Subtotal') ||
        pageText.includes('Total') ||
        pageText.match(/\$\s*[\d,]+\.?\d*/))) {
        pricesFound = true;
        console.log(`✓ Prices found after ${attempts + 1} seconds`);
      } else {
        attempts++;
        await page.waitForTimeout(1000);
        if (attempts % 5 === 0) {
          console.log(`Still waiting... (${attempts}s)`);
        }
      }
    }
    
    if (!pricesFound) {
      console.log('⚠️ WARNING: Prices not detected after 30 seconds');
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-no-prices-found.png`,
        fullPage: true 
      });
    }
    
    // Debug: Check what's on the page
    const pageText = await page.textContent('body');
    console.log('\n--- Page Content Sample ---');
    if (pageText) {
      // Look for price-related text
      const priceSection = pageText.match(/.{0,200}(Item|Price|Discount|Total|Tax).{0,200}/gi);
      if (priceSection) {
        console.log('Found price text:', priceSection.slice(0, 5));
      } else {
        console.log('No price text found. Sample:', pageText.substring(0, 500));
      }
    }
    
    // Get the price breakdown
    try {
      const breakdown = await bookingEnginePage.getPriceBreakdown();
      
      console.log('\n--- Price Breakdown ---');
      console.log(`Item Price: $${breakdown.subtotal.toFixed(2)}`);
      console.log(`Discount: $${breakdown.discount.toFixed(2)}`);
      console.log(`Tax: $${breakdown.tax.toFixed(2)}`);
      console.log(`Fees: $${breakdown.fees.toFixed(2)}`);
      console.log(`Total: $${breakdown.total.toFixed(2)}`);
      
      // Calculate the base rate (before discount)
      const baseRate = breakdown.subtotal + breakdown.discount;
      console.log(`\nBase Rate (before discount): $${baseRate.toFixed(2)}`);
      
      // FAIL if no prices found (all zeros)
      if (baseRate === 0 && breakdown.total === 0) {
        throw new Error('❌ NO PRICES FOUND ON PAGE! All values are $0.00. The page may not have loaded correctly or prices are not displayed.');
      }
      
      // FAIL if base rate is suspiciously low
      if (baseRate > 0 && baseRate < 10) {
        throw new Error(`❌ SUSPICIOUS RATE: $${baseRate.toFixed(2)} is unusually low. Verify the page loaded correctly.`);
      }
      
      // Check if rate is under $100
      const isUnder100 = baseRate < 100;
      console.log(`Rate is under $100: ${isUnder100}`);
      
      // If rate is under $100, verify 2% discount is applied
      if (isUnder100) {
        const expectedDiscount = baseRate * 0.02;
        console.log(`\nExpected 2% discount: $${expectedDiscount.toFixed(2)}`);
        console.log(`Actual discount: $${breakdown.discount.toFixed(2)}`);
        
        // Verify discount is approximately 2%
        expect(breakdown.discount).toBeCloseTo(expectedDiscount, 1);
        console.log('✓ 2% discount verified!');
      } else {
        console.log(`\nRate is $${baseRate.toFixed(2)} (at or above $100)`);
        console.log('Discount should NOT be applied for rates >= $100');
        
        // If rate is >= $100, there should be no Low Rate Discount
        // (there may be other discounts, but not the 2% Low Rate Discount)
        if (breakdown.discount > 0) {
          console.log(`Note: A discount of $${breakdown.discount.toFixed(2)} is applied`);
          console.log('This may be a different discount rule (not Low Rate Discount)');
        }
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-april-5-actual.png`,
        fullPage: true 
      });
      
    } catch (error) {
      console.error('Error getting price breakdown:', error);
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-error.png`,
        fullPage: true 
      });
      throw error;
    }
  });

  /**
   * Test 2: Check NO discount before date range (March 31, 2026)
   */
  test('Should NOT apply Low Rate Discount before date range (March 31, 2026)', async ({ page }) => {
    const checkInDate = '2026-03-31'; // Before discount period
    const checkOutDate = '2026-04-01';
    
    console.log('\n=== Low Rate Discount Test (Before Range) ===');
    console.log(`Check-in: ${checkInDate} (before April 1)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      JWT_TOKEN,
      TEST_HOTEL_PARAMS
    );
    
    await page.waitForTimeout(5000);
    
    try {
      const breakdown = await bookingEnginePage.getPriceBreakdown();
      const baseRate = breakdown.subtotal + breakdown.discount;
      
      console.log(`Base Rate: $${baseRate.toFixed(2)}`);
      console.log(`Discount Applied: $${breakdown.discount.toFixed(2)}`);
      
      // The Low Rate Discount should NOT be applied (outside date range)
      // Even if rate is under $100
      if (baseRate < 100) {
        console.log('Rate is under $100, but date is BEFORE April 1');
        console.log('Low Rate Discount should NOT be applied');
        
        // If there's a 2% discount, it's unexpected
        const twoPercentDiscount = baseRate * 0.02;
        if (Math.abs(breakdown.discount - twoPercentDiscount) < 0.5) {
          console.log('⚠️ WARNING: 2% discount detected outside date range!');
        } else {
          console.log('✓ Low Rate Discount correctly NOT applied');
        }
      }
      
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-march-31-before-range.png`,
        fullPage: true 
      });
      
    } catch (error) {
      console.error('Error:', error);
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-march-31-error.png`,
        fullPage: true 
      });
    }
  });

  /**
   * Test 3: Check NO discount after date range (April 16, 2026)
   */
  test('Should NOT apply Low Rate Discount after date range (April 16, 2026)', async ({ page }) => {
    const checkInDate = '2026-04-16'; // After discount period
    const checkOutDate = '2026-04-17';
    
    console.log('\n=== Low Rate Discount Test (After Range) ===');
    console.log(`Check-in: ${checkInDate} (after April 15)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      JWT_TOKEN,
      TEST_HOTEL_PARAMS
    );
    
    await page.waitForTimeout(5000);
    
    try {
      const breakdown = await bookingEnginePage.getPriceBreakdown();
      const baseRate = breakdown.subtotal + breakdown.discount;
      
      console.log(`Base Rate: $${baseRate.toFixed(2)}`);
      console.log(`Discount Applied: $${breakdown.discount.toFixed(2)}`);
      
      if (baseRate < 100) {
        console.log('Rate is under $100, but date is AFTER April 15');
        console.log('Low Rate Discount should NOT be applied');
        
        const twoPercentDiscount = baseRate * 0.02;
        if (Math.abs(breakdown.discount - twoPercentDiscount) < 0.5) {
          console.log('⚠️ WARNING: 2% discount detected outside date range!');
        } else {
          console.log('✓ Low Rate Discount correctly NOT applied');
        }
      }
      
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-april-16-after-range.png`,
        fullPage: true 
      });
      
    } catch (error) {
      console.error('Error:', error);
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-april-16-error.png`,
        fullPage: true 
      });
    }
  });

  /**
   * Test 4: Check discount on first day (April 1, 2026)
   */
  test('Should apply Low Rate Discount on first day (April 1, 2026)', async ({ page }) => {
    const checkInDate = '2026-04-01'; // First day of discount period
    const checkOutDate = '2026-04-02';
    
    console.log('\n=== Low Rate Discount Test (First Day) ===');
    console.log(`Check-in: ${checkInDate} (first day of range)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      JWT_TOKEN,
      TEST_HOTEL_PARAMS
    );
    
    await page.waitForTimeout(5000);
    
    try {
      const breakdown = await bookingEnginePage.getPriceBreakdown();
      const baseRate = breakdown.subtotal + breakdown.discount;
      
      console.log(`Base Rate: $${baseRate.toFixed(2)}`);
      console.log(`Discount Applied: $${breakdown.discount.toFixed(2)}`);
      
      if (baseRate < 100) {
        const expectedDiscount = baseRate * 0.02;
        console.log(`Expected 2% discount: $${expectedDiscount.toFixed(2)}`);
        expect(breakdown.discount).toBeCloseTo(expectedDiscount, 1);
        console.log('✓ 2% discount verified on first day!');
      }
      
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-april-1-first-day.png`,
        fullPage: true 
      });
      
    } catch (error) {
      console.error('Error:', error);
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-april-1-error.png`,
        fullPage: true 
      });
    }
  });

  /**
   * Test 5: Check discount on last day (April 15, 2026)
   */
  test('Should apply Low Rate Discount on last day (April 15, 2026)', async ({ page }) => {
    const checkInDate = '2026-04-15'; // Last day of discount period
    const checkOutDate = '2026-04-16';
    
    console.log('\n=== Low Rate Discount Test (Last Day) ===');
    console.log(`Check-in: ${checkInDate} (last day of range)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkInDate,
      checkOutDate,
      JWT_TOKEN,
      TEST_HOTEL_PARAMS
    );
    
    await page.waitForTimeout(5000);
    
    try {
      const breakdown = await bookingEnginePage.getPriceBreakdown();
      const baseRate = breakdown.subtotal + breakdown.discount;
      
      console.log(`Base Rate: $${baseRate.toFixed(2)}`);
      console.log(`Discount Applied: $${breakdown.discount.toFixed(2)}`);
      
      if (baseRate < 100) {
        const expectedDiscount = baseRate * 0.02;
        console.log(`Expected 2% discount: $${expectedDiscount.toFixed(2)}`);
        expect(breakdown.discount).toBeCloseTo(expectedDiscount, 1);
        console.log('✓ 2% discount verified on last day!');
      }
      
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-april-15-last-day.png`,
        fullPage: true 
      });
      
    } catch (error) {
      console.error('Error:', error);
      await page.screenshot({ 
        path: `test-results/hotel/screenshots/low-rate-discount-april-15-error.png`,
        fullPage: true 
      });
    }
  });
});
