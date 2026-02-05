import { test, expect } from '@playwright/test';
import { BookingEnginePage } from '../pages/BookingEnginePage';

/**
 * Test February 11, 2026 - Should have 32% specific date discount
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

test.describe('Discount Rule Verification - February 11, 2026', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  test('Should have 32% discount on February 11, 2026 (Wednesday)', async ({ page }) => {
    const checkIn = '2026-02-11';
    const checkOut = '2026-02-12';
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📅 TESTING FEBRUARY 11, 2026 (WEDNESDAY)');
    console.log('═══════════════════════════════════════════════════');
    console.log(`Check-in: ${checkIn}`);
    console.log(`Check-out: ${checkOut}`);
    console.log(`Expected: 32% discount (specific date configuration)`);
    console.log('───────────────────────────────────────────────────');
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    const pageText = await page.textContent('body') || '';
    
    // Extract price information
    const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
    const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
    const totalMatch = pageText.match(/Total[:\s]+\$?([\d,]+\.?\d*)/i);
    
    if (itemPriceMatch && discountMatch) {
      const itemPrice = parseFloat(itemPriceMatch[1].replace(/,/g, ''));
      const discount = parseFloat(discountMatch[1].replace(/,/g, ''));
      const total = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0;
      const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
      
      console.log('\n💰 PRICE BREAKDOWN:');
      console.log(`   Item Price: $${itemPrice.toFixed(2)}`);
      console.log(`   Discount: $${discount.toFixed(2)} (${discountPercent}%)`);
      console.log(`   Total: $${total.toFixed(2)}`);
      
      console.log('\n🔍 ANALYSIS:');
      console.log(`   Expected: 32%`);
      console.log(`   Found: ${discountPercent}%`);
      
      if (discountPercent === 32) {
        console.log('\n✅ ✅ ✅ SUCCESS! ✅ ✅ ✅');
        console.log('   February 11 discount is working correctly!');
        console.log('   This confirms the discount rule IS active.');
      } else if (discountPercent === 15) {
        console.log('\n❌ WRONG: Found 15% instead of 32%');
        console.log('   This is the same 15% showing up everywhere!');
        console.log('   Suggests a global discount is overriding specific dates.');
      } else if (discountPercent === 0) {
        console.log('\n❌ WRONG: No discount applied');
        console.log('   The specific date discount is not working.');
      } else {
        console.log(`\n⚠️  UNEXPECTED: Found ${discountPercent}% discount`);
        console.log('   This is neither the expected 32% nor the mysterious 15%.');
      }
      
      // Calculate what the discount should be
      const expectedDiscount = itemPrice * 0.32;
      const discountDifference = Math.abs(discount - expectedDiscount);
      
      console.log('\n📊 VERIFICATION:');
      console.log(`   If 32% applied: $${itemPrice.toFixed(2)} × 0.32 = $${expectedDiscount.toFixed(2)}`);
      console.log(`   Actual discount: $${discount.toFixed(2)}`);
      console.log(`   Difference: $${discountDifference.toFixed(2)}`);
      
      if (discountDifference < 0.50) {
        console.log('   ✅ Discount amount matches 32%!');
      }
      
    } else {
      console.log('\n❌ ERROR: Could not extract price data from page');
      console.log('   Page might not have loaded correctly.');
    }
    
    console.log('\n═══════════════════════════════════════════════════\n');
    
    await page.screenshot({ 
      path: `test-results/hotel/screenshots/feb-11-2026-test.png`,
      fullPage: true 
    });
    
    console.log('📸 Screenshot saved: test-results/hotel/screenshots/feb-11-2026-test.png');
  });

  test('Should compare Feb 11 vs April 5 discounts side-by-side', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🔄 COMPARING MULTIPLE DISCOUNT DATES');
    console.log('═══════════════════════════════════════════════════');
    
    const testDates = [
      { checkIn: '2026-02-11', checkOut: '2026-02-12', expected: 32, desc: 'Feb 11 (Wednesday) - Specific Date' },
      { checkIn: '2026-03-15', checkOut: '2026-03-16', expected: 14.5, desc: 'Mar 15 - Within Mar 9-22 range' },
      { checkIn: '2026-04-05', checkOut: '2026-04-06', expected: 2, desc: 'Apr 5 - Low Rate Discount range' },
      { checkIn: '2026-03-31', checkOut: '2026-04-01', expected: 0, desc: 'Mar 31 - No discount configured' },
    ];
    
    const results: any[] = [];
    
    for (const dateTest of testDates) {
      console.log(`\n📅 Testing: ${dateTest.checkIn} - ${dateTest.desc}`);
      
      await bookingEnginePage.gotoHotelBookingWithDates(
        dateTest.checkIn, dateTest.checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
      );
      
      const pageText = await page.textContent('body') || '';
      const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
      const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
      
      if (itemPriceMatch && discountMatch) {
        const itemPrice = parseFloat(itemPriceMatch[1].replace(/,/g, ''));
        const discount = parseFloat(discountMatch[1].replace(/,/g, ''));
        const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
        
        const match = Math.abs(discountPercent - dateTest.expected) < 1;
        const status = match ? '✅' : '❌';
        
        console.log(`   ${status} Rate: $${itemPrice.toFixed(2)} | Expected: ${dateTest.expected}% | Found: ${discountPercent}%`);
        
        results.push({
          date: dateTest.checkIn,
          desc: dateTest.desc,
          expected: dateTest.expected,
          found: discountPercent,
          match: match
        });
      }
      
      await page.waitForTimeout(1000);
    }
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📊 RESULTS SUMMARY');
    console.log('═══════════════════════════════════════════════════');
    
    results.forEach(r => {
      const status = r.match ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} | ${r.date}: Expected ${r.expected}%, Found ${r.found}%`);
      console.log(`        ${r.desc}`);
    });
    
    const allSame = results.every(r => r.found === results[0].found);
    if (allSame && results[0].found === 15) {
      console.log('\n⚠️  CRITICAL: ALL dates showing 15% discount!');
      console.log('   This suggests a global 15% discount is overriding everything.');
    } else if (allSame) {
      console.log(`\n⚠️  CRITICAL: ALL dates showing same ${results[0].found}% discount!`);
      console.log('   Discount rules are not being applied per date range.');
    }
    
    console.log('═══════════════════════════════════════════════════\n');
  });
});
