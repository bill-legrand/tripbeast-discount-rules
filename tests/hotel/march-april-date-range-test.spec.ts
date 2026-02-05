import { test, expect } from '@playwright/test';
import { BookingEnginePage } from '../pages/BookingEnginePage';

/**
 * Test Hotel ID 2008 across multiple dates in March and April
 * to identify when different discount rules activate
 */

const BOOKING_ENGINE_JWT = process.env.BOOKING_ENGINE_JWT || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI';

const TEST_HOTEL = {
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

interface DateTestResult {
  date: string;
  dayOfWeek: string;
  itemPrice: number;
  discount: number;
  discountPercent: number;
  expectedDiscount: number;
  expectedRule: string;
  match: boolean;
  notes: string;
}

// Test dates spanning March and April
const TEST_DATES = [
  // Before all discounts
  { checkIn: '2026-03-01', checkOut: '2026-03-02', expected: 0, rule: 'Default (No discount)' },
  
  // DOW range (March 2-8)
  { checkIn: '2026-03-02', checkOut: '2026-03-03', expected: 0, rule: 'DOW (varies by day)' },
  { checkIn: '2026-03-05', checkOut: '2026-03-06', expected: 0, rule: 'DOW (varies by day)' },
  { checkIn: '2026-03-08', checkOut: '2026-03-09', expected: 0, rule: 'DOW (last day)' },
  
  // 14.5% range (March 9-22)
  { checkIn: '2026-03-09', checkOut: '2026-03-10', expected: 14.5, rule: '14.5% Date Range (Mar 9-22)' },
  { checkIn: '2026-03-15', checkOut: '2026-03-16', expected: 14.5, rule: '14.5% Date Range (Mar 9-22)' },
  { checkIn: '2026-03-22', checkOut: '2026-03-23', expected: 14.5, rule: '14.5% Date Range (last day)' },
  
  // Between March and April ranges
  { checkIn: '2026-03-25', checkOut: '2026-03-26', expected: 0, rule: 'Default (between ranges)' },
  { checkIn: '2026-03-31', checkOut: '2026-04-01', expected: 0, rule: 'Default (day before April range)' },
  
  // Low Rate Discount range (April 1-15) - 2% for rates under $100
  { checkIn: '2026-04-01', checkOut: '2026-04-02', expected: 2, rule: 'Low Rate Discount (Apr 1-15, first day)' },
  { checkIn: '2026-04-05', checkOut: '2026-04-06', expected: 2, rule: 'Low Rate Discount (Apr 1-15, middle)' },
  { checkIn: '2026-04-10', checkOut: '2026-04-11', expected: 2, rule: 'Low Rate Discount (Apr 1-15, middle)' },
  { checkIn: '2026-04-15', checkOut: '2026-04-16', expected: 2, rule: 'Low Rate Discount (Apr 1-15, last day)' },
  
  // After Low Rate Discount range
  { checkIn: '2026-04-16', checkOut: '2026-04-17', expected: 0, rule: 'Default (after April range)' },
  { checkIn: '2026-04-20', checkOut: '2026-04-21', expected: 0, rule: 'Default (late April)' },
  { checkIn: '2026-04-30', checkOut: '2026-05-01', expected: 0, rule: 'Default (end of April)' },
];

test.describe('March-April Date Range Testing', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  test('Should test Longhorn Casino across March and April date ranges', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📅 MARCH-APRIL DATE RANGE TESTING');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('Hotel: Longhorn Casino & Hotel (ID: 2008)');
    console.log('Base Rate: ~$50 (UNDER $100 - qualifies for Low Rate Discount)');
    console.log('Testing: Multiple dates across March and April 2026');
    console.log('───────────────────────────────────────────────────────────────\n');
    
    const results: DateTestResult[] = [];
    
    for (const dateTest of TEST_DATES) {
      console.log(`\n📅 ${dateTest.checkIn} to ${dateTest.checkOut}`);
      console.log(`   Expected: ${dateTest.expected}% - ${dateTest.rule}`);
      
      try {
        await bookingEnginePage.gotoHotelBookingWithDates(
          dateTest.checkIn,
          dateTest.checkOut,
          BOOKING_ENGINE_JWT,
          TEST_HOTEL
        );
        
        const pageText = await page.textContent('body') || '';
        
        // Extract prices
        const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
        const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
        
        if (itemPriceMatch) {
          const itemPrice = parseFloat(itemPriceMatch[1].replace(/,/g, ''));
          const discount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
          const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
          
          // Get day of week
          const date = new Date(dateTest.checkIn);
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
          
          const match = Math.abs(discountPercent - dateTest.expected) < 1;
          const status = match ? '✅' : '❌';
          
          let notes = '';
          if (!match) {
            notes = `Expected ${dateTest.expected}%, got ${discountPercent}%`;
          }
          
          console.log(`   ${status} Found: ${discountPercent}% ($${discount.toFixed(2)}) | Price: $${itemPrice.toFixed(2)}`);
          if (notes) console.log(`   ${notes}`);
          
          results.push({
            date: dateTest.checkIn,
            dayOfWeek,
            itemPrice,
            discount,
            discountPercent,
            expectedDiscount: dateTest.expected,
            expectedRule: dateTest.rule,
            match,
            notes: notes || 'Correct'
          });
        } else {
          console.log('   ⚠️  Could not extract price');
          results.push({
            date: dateTest.checkIn,
            dayOfWeek: 'Unknown',
            itemPrice: 0,
            discount: 0,
            discountPercent: 0,
            expectedDiscount: dateTest.expected,
            expectedRule: dateTest.rule,
            match: false,
            notes: 'Could not extract price'
          });
        }
        
        await page.waitForTimeout(1000);
        
      } catch (e: any) {
        console.log(`   ❌ Error: ${e.message}`);
        results.push({
          date: dateTest.checkIn,
          dayOfWeek: 'Unknown',
          itemPrice: 0,
          discount: 0,
          discountPercent: 0,
          expectedDiscount: dateTest.expected,
          expectedRule: dateTest.rule,
          match: false,
          notes: `Error: ${e.message}`
        });
      }
    }
    
    // Generate comprehensive summary
    console.log('\n\n═══════════════════════════════════════════════════════════════');
    console.log('📊 COMPREHENSIVE RESULTS TABLE');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('Date       | Day       | Price   | Discount | Expected | Status');
    console.log('───────────────────────────────────────────────────────────────');
    
    results.forEach(r => {
      const status = r.match ? '✅ PASS' : '❌ FAIL';
      const priceStr = r.itemPrice > 0 ? `$${r.itemPrice.toFixed(2)}` : 'N/A    ';
      const discountStr = `${r.discountPercent}%`.padEnd(5);
      const expectedStr = `${r.expectedDiscount}%`.padEnd(5);
      
      console.log(`${r.date} | ${r.dayOfWeek.padEnd(9)} | ${priceStr} | ${discountStr}  | ${expectedStr}  | ${status}`);
    });
    
    // Analyze patterns
    const passing = results.filter(r => r.match);
    const failing = results.filter(r => !r.match);
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📈 ANALYSIS');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`Total dates tested: ${results.length}`);
    console.log(`Passing: ${passing.length}`);
    console.log(`Failing: ${failing.length}`);
    console.log(`Pass rate: ${((passing.length / results.length) * 100).toFixed(1)}%`);
    
    // Group by discount found
    const discountGroups = new Map<number, DateTestResult[]>();
    results.forEach(r => {
      if (!discountGroups.has(r.discountPercent)) {
        discountGroups.set(r.discountPercent, []);
      }
      discountGroups.get(r.discountPercent)!.push(r);
    });
    
    console.log('\n📊 Discounts Found:');
    Array.from(discountGroups.keys()).sort((a, b) => b - a).forEach(discount => {
      const dates = discountGroups.get(discount)!;
      console.log(`\n   ${discount}% discount: ${dates.length} date(s)`);
      dates.forEach(d => {
        console.log(`      - ${d.date} (expected ${d.expectedDiscount}%)`);
      });
    });
    
    // Check for Low Rate Discount failures
    const aprilTests = results.filter(r => r.date >= '2026-04-01' && r.date <= '2026-04-15');
    const aprilPassing = aprilTests.filter(r => r.match);
    
    console.log('\n🎯 LOW RATE DISCOUNT (April 1-15) ANALYSIS:');
    console.log(`   Tested: ${aprilTests.length} dates`);
    console.log(`   Correct (2%): ${aprilPassing.length}`);
    console.log(`   Incorrect: ${aprilTests.length - aprilPassing.length}`);
    
    if (aprilPassing.length === 0) {
      console.log('\n   ❌ CRITICAL: Low Rate Discount is NOT working on ANY April date!');
    } else if (aprilPassing.length < aprilTests.length) {
      console.log('\n   ⚠️  WARNING: Low Rate Discount is partially working');
    } else {
      console.log('\n   ✅ SUCCESS: Low Rate Discount is working correctly!');
    }
    
    // Check March 9-22 range
    const marchTests = results.filter(r => r.date >= '2026-03-09' && r.date <= '2026-03-22');
    const marchPassing = marchTests.filter(r => r.match);
    
    console.log('\n📅 MARCH 9-22 (14.5%) ANALYSIS:');
    console.log(`   Tested: ${marchTests.length} dates`);
    console.log(`   Correct (14.5/15%): ${marchPassing.length}`);
    console.log(`   Incorrect: ${marchTests.length - marchPassing.length}`);
    
    if (marchPassing.length === marchTests.length) {
      console.log('   ✅ March 9-22 discount is working correctly!');
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════\n');
    
    // Save results
    const fs = require('fs');
    fs.writeFileSync('test-results/hotel/screenshots/march-april-discount-analysis.json', JSON.stringify({
      testDate: new Date().toISOString(),
      hotel: 'Longhorn Casino & Hotel (ID: 2008)',
      totalTests: results.length,
      passing: passing.length,
      failing: failing.length,
      results: results
    }, null, 2));
    
    console.log('💾 Detailed results saved to: test-results/hotel/screenshots/march-april-discount-analysis.json\n');
  });
});
