import { test, expect } from '@playwright/test';
import { BookingEnginePage } from '../pages/BookingEnginePage';

/**
 * Comprehensive Low Rate Discount Testing for April 1-15, 2026
 * 
 * Expected behavior:
 * - April 1-15: Base discount = 0%
 * - If rate < $100: Apply 2% Low Rate Discount
 * - If rate >= $100: No Low Rate Discount (0%)
 */

const BOOKING_ENGINE_JWT = process.env.BOOKING_ENGINE_JWT || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI';

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

interface TestResult {
  checkIn: string;
  checkOut: string;
  nights: number;
  itemPrice: number;
  discount: number;
  discountPercent: number;
  total: number;
  expectedDiscount: number;
  pass: boolean;
  note: string;
}

test.describe('Low Rate Discount - Comprehensive April Testing', () => {
  let bookingEnginePage: BookingEnginePage;
  const results: TestResult[] = [];

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  test.afterAll(async () => {
    // Print summary table
    console.log('\n\n═══════════════════════════════════════════════════════════════════════════');
    console.log('                    LOW RATE DISCOUNT TEST RESULTS');
    console.log('═══════════════════════════════════════════════════════════════════════════');
    console.log('Expected: If rate < $100 → 2% discount | If rate >= $100 → 0% discount');
    console.log('───────────────────────────────────────────────────────────────────────────');
    
    results.forEach(r => {
      const status = r.pass ? '✅ PASS' : '❌ FAIL';
      console.log(`\n${status} | ${r.checkIn} to ${r.checkOut} (${r.nights}N)`);
      console.log(`   Item Price: $${r.itemPrice.toFixed(2)} | Discount: ${r.discountPercent}% ($${r.discount.toFixed(2)})`);
      console.log(`   Expected: ${r.expectedDiscount}% | ${r.note}`);
    });
    
    console.log('\n═══════════════════════════════════════════════════════════════════════════\n');
  });

  /**
   * Helper function to extract price data
   */
  async function getPriceData(page: any): Promise<{ itemPrice: number; discount: number; discountPercent: number; total: number }> {
    const pageText = await page.textContent('body');
    
    if (!pageText) {
      return { itemPrice: 0, discount: 0, discountPercent: 0, total: 0 };
    }
    
    const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
    const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
    const totalMatch = pageText.match(/Total[:\s]+\$?([\d,]+\.?\d*)/i);
    
    const itemPrice = itemPriceMatch ? parseFloat(itemPriceMatch[1].replace(/,/g, '')) : 0;
    const discount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
    const total = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0;
    const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
    
    return { itemPrice, discount, discountPercent, total };
  }

  /**
   * Test April 1 (Start of range) - Single night
   */
  test('April 1-2, 2026 (1 night) - Start of discount range', async ({ page }) => {
    const checkIn = '2026-04-01';
    const checkOut = '2026-04-02';
    
    console.log(`\n📅 Testing: ${checkIn} to ${checkOut} (1 night)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    const data = await getPriceData(page);
    const expectedDiscount = data.itemPrice < 100 ? 2 : 0;
    const pass = data.discountPercent === expectedDiscount;
    
    console.log(`   Rate: $${data.itemPrice.toFixed(2)} | Found: ${data.discountPercent}% | Expected: ${expectedDiscount}%`);
    
    results.push({
      checkIn, checkOut, nights: 1,
      ...data, expectedDiscount, pass,
      note: data.itemPrice < 100 ? 'Under $100 → should have 2%' : 'At/over $100 → should have 0%'
    });
    
    await page.screenshot({ path: `test-results/hotel/screenshots/low-rate-april-01-single.png`, fullPage: true });
  });

  /**
   * Test April 5 (Mid-range) - Single night
   */
  test('April 5-6, 2026 (1 night) - Middle of discount range', async ({ page }) => {
    const checkIn = '2026-04-05';
    const checkOut = '2026-04-06';
    
    console.log(`\n📅 Testing: ${checkIn} to ${checkOut} (1 night)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    const data = await getPriceData(page);
    const expectedDiscount = data.itemPrice < 100 ? 2 : 0;
    const pass = data.discountPercent === expectedDiscount;
    
    console.log(`   Rate: $${data.itemPrice.toFixed(2)} | Found: ${data.discountPercent}% | Expected: ${expectedDiscount}%`);
    
    results.push({
      checkIn, checkOut, nights: 1,
      ...data, expectedDiscount, pass,
      note: data.itemPrice < 100 ? 'Under $100 → should have 2%' : 'At/over $100 → should have 0%'
    });
    
    await page.screenshot({ path: `test-results/hotel/screenshots/low-rate-april-05-single.png`, fullPage: true });
  });

  /**
   * Test April 10 (Mid-range) - Single night
   */
  test('April 10-11, 2026 (1 night) - Middle of discount range', async ({ page }) => {
    const checkIn = '2026-04-10';
    const checkOut = '2026-04-11';
    
    console.log(`\n📅 Testing: ${checkIn} to ${checkOut} (1 night)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    const data = await getPriceData(page);
    const expectedDiscount = data.itemPrice < 100 ? 2 : 0;
    const pass = data.discountPercent === expectedDiscount;
    
    console.log(`   Rate: $${data.itemPrice.toFixed(2)} | Found: ${data.discountPercent}% | Expected: ${expectedDiscount}%`);
    
    results.push({
      checkIn, checkOut, nights: 1,
      ...data, expectedDiscount, pass,
      note: data.itemPrice < 100 ? 'Under $100 → should have 2%' : 'At/over $100 → should have 0%'
    });
    
    await page.screenshot({ path: `test-results/hotel/screenshots/low-rate-april-10-single.png`, fullPage: true });
  });

  /**
   * Test April 15 (End of range) - Single night
   */
  test('April 15-16, 2026 (1 night) - End of discount range', async ({ page }) => {
    const checkIn = '2026-04-15';
    const checkOut = '2026-04-16';
    
    console.log(`\n📅 Testing: ${checkIn} to ${checkOut} (1 night)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    const data = await getPriceData(page);
    const expectedDiscount = data.itemPrice < 100 ? 2 : 0;
    const pass = data.discountPercent === expectedDiscount;
    
    console.log(`   Rate: $${data.itemPrice.toFixed(2)} | Found: ${data.discountPercent}% | Expected: ${expectedDiscount}%`);
    
    results.push({
      checkIn, checkOut, nights: 1,
      ...data, expectedDiscount, pass,
      note: data.itemPrice < 100 ? 'Under $100 → should have 2%' : 'At/over $100 → should have 0%'
    });
    
    await page.screenshot({ path: `test-results/hotel/screenshots/low-rate-april-15-single.png`, fullPage: true });
  });

  /**
   * Test April 5-8 (Multi-night within range)
   */
  test('April 5-8, 2026 (3 nights) - Multi-night stay', async ({ page }) => {
    const checkIn = '2026-04-05';
    const checkOut = '2026-04-08';
    
    console.log(`\n📅 Testing: ${checkIn} to ${checkOut} (3 nights)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    const data = await getPriceData(page);
    const expectedDiscount = data.itemPrice < 100 ? 2 : 0;
    const pass = data.discountPercent === expectedDiscount;
    
    console.log(`   Rate: $${data.itemPrice.toFixed(2)} | Found: ${data.discountPercent}% | Expected: ${expectedDiscount}%`);
    
    results.push({
      checkIn, checkOut, nights: 3,
      ...data, expectedDiscount, pass,
      note: data.itemPrice < 100 ? 'Under $100 → should have 2%' : 'At/over $100 → should have 0%'
    });
    
    await page.screenshot({ path: `test-results/hotel/screenshots/low-rate-april-05-08-multi.png`, fullPage: true });
  });

  /**
   * Test April 1-15 (Full range)
   */
  test('April 1-15, 2026 (14 nights) - Full discount period', async ({ page }) => {
    const checkIn = '2026-04-01';
    const checkOut = '2026-04-15';
    
    console.log(`\n📅 Testing: ${checkIn} to ${checkOut} (14 nights)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    const data = await getPriceData(page);
    const expectedDiscount = data.itemPrice < 100 ? 2 : 0;
    const pass = data.discountPercent === expectedDiscount;
    
    console.log(`   Rate: $${data.itemPrice.toFixed(2)} | Found: ${data.discountPercent}% | Expected: ${expectedDiscount}%`);
    
    results.push({
      checkIn, checkOut, nights: 14,
      ...data, expectedDiscount, pass,
      note: data.itemPrice < 100 ? 'Under $100 → should have 2%' : 'At/over $100 → should have 0%'
    });
    
    await page.screenshot({ path: `test-results/hotel/screenshots/low-rate-april-01-15-full.png`, fullPage: true });
  });

  /**
   * Test March 31 (BEFORE range)
   */
  test('March 31 - April 1, 2026 (1 night) - BEFORE discount range', async ({ page }) => {
    const checkIn = '2026-03-31';
    const checkOut = '2026-04-01';
    
    console.log(`\n📅 Testing: ${checkIn} to ${checkOut} (1 night) - BEFORE RANGE`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    const data = await getPriceData(page);
    const expectedDiscount = 0; // Outside range, no Low Rate Discount
    const pass = data.discountPercent === expectedDiscount || data.discountPercent !== 2; // Accept 0% or other discount, but not 2%
    
    console.log(`   Rate: $${data.itemPrice.toFixed(2)} | Found: ${data.discountPercent}% | Expected: NOT 2%`);
    
    results.push({
      checkIn, checkOut, nights: 1,
      ...data, expectedDiscount, pass,
      note: 'Before April 1 → should NOT have 2% Low Rate Discount'
    });
    
    await page.screenshot({ path: `test-results/hotel/screenshots/low-rate-march-31-before.png`, fullPage: true });
  });

  /**
   * Test April 16 (AFTER range)
   */
  test('April 16-17, 2026 (1 night) - AFTER discount range', async ({ page }) => {
    const checkIn = '2026-04-16';
    const checkOut = '2026-04-17';
    
    console.log(`\n📅 Testing: ${checkIn} to ${checkOut} (1 night) - AFTER RANGE`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    const data = await getPriceData(page);
    const expectedDiscount = 0; // Outside range, no Low Rate Discount
    const pass = data.discountPercent === expectedDiscount || data.discountPercent !== 2; // Accept 0% or other discount, but not 2%
    
    console.log(`   Rate: $${data.itemPrice.toFixed(2)} | Found: ${data.discountPercent}% | Expected: NOT 2%`);
    
    results.push({
      checkIn, checkOut, nights: 1,
      ...data, expectedDiscount, pass,
      note: 'After April 15 → should NOT have 2% Low Rate Discount'
    });
    
    await page.screenshot({ path: `test-results/hotel/screenshots/low-rate-april-16-after.png`, fullPage: true });
  });
});
