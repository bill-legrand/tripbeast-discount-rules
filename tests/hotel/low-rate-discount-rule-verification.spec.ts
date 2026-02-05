import { test, expect } from '@playwright/test';
import { BookingEnginePage } from '../pages/BookingEnginePage';

/**
 * Verify which discount rule is being applied
 * Low Rate Discount Rule ID: 07883db1-759d-4589-8f13-8a008c081ae8
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

const LOW_RATE_DISCOUNT_RULE_ID = '07883db1-759d-4589-8f13-8a008c081ae8';

test.describe('Low Rate Discount - Rule ID Verification', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  test('Should check which discount rule is being applied (April 5, 2026)', async ({ page }) => {
    const checkIn = '2026-04-05';
    const checkOut = '2026-04-06';
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🔍 DISCOUNT RULE VERIFICATION');
    console.log('═══════════════════════════════════════════════════');
    console.log(`Expected Rule ID: ${LOW_RATE_DISCOUNT_RULE_ID}`);
    console.log(`Date: ${checkIn} to ${checkOut}`);
    
    // Capture network requests to see API responses
    const apiRequests: any[] = [];
    const apiResponses: any[] = [];
    
    page.on('request', request => {
      if (request.url().includes('api') || request.url().includes('discount') || request.url().includes('price')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers()
        });
      }
    });
    
    page.on('response', async response => {
      if (response.url().includes('api') || response.url().includes('discount') || response.url().includes('price')) {
        try {
          const contentType = response.headers()['content-type'] || '';
          if (contentType.includes('application/json')) {
            const body = await response.json();
            apiResponses.push({
              url: response.url(),
              status: response.status(),
              body: body
            });
          }
        } catch (e) {
          // Not JSON or couldn't parse
        }
      }
    });
    
    // Navigate to the page
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    // Get price data
    const pageText = await page.textContent('body') || '';
    
    const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
    const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
    
    const itemPrice = itemPriceMatch ? parseFloat(itemPriceMatch[1].replace(/,/g, '')) : 0;
    const discount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
    const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
    
    console.log('\n📊 PRICE DATA:');
    console.log(`   Item Price: $${itemPrice.toFixed(2)}`);
    console.log(`   Discount: ${discountPercent}% ($${discount.toFixed(2)})`);
    console.log(`   Rate Status: ${itemPrice < 100 ? 'UNDER $100 ✓' : 'AT/OVER $100'}`);
    
    // Check page content for rule IDs
    console.log('\n🔎 SEARCHING FOR DISCOUNT RULE IDs IN PAGE:');
    
    // Search for the Low Rate Discount Rule ID
    if (pageText.includes(LOW_RATE_DISCOUNT_RULE_ID)) {
      console.log(`   ✅ Found Low Rate Discount Rule ID: ${LOW_RATE_DISCOUNT_RULE_ID}`);
    } else {
      console.log(`   ❌ Low Rate Discount Rule ID NOT found in page`);
    }
    
    // Search for any UUID-like patterns (discount rule IDs)
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    const foundUUIDs = pageText.match(uuidPattern);
    
    if (foundUUIDs && foundUUIDs.length > 0) {
      console.log(`\n   Found ${foundUUIDs.length} UUID(s) in page:`);
      const uniqueUUIDs = [...new Set(foundUUIDs)];
      uniqueUUIDs.forEach((uuid, index) => {
        const isLowRateRule = uuid.toLowerCase() === LOW_RATE_DISCOUNT_RULE_ID.toLowerCase();
        const marker = isLowRateRule ? '✅ LOW RATE RULE' : '';
        console.log(`   ${index + 1}. ${uuid} ${marker}`);
      });
    } else {
      console.log(`   No UUIDs found in page HTML`);
    }
    
    // Check API responses
    console.log('\n🌐 API RESPONSES:');
    console.log(`   Captured ${apiResponses.length} API response(s)`);
    
    if (apiResponses.length > 0) {
      apiResponses.forEach((resp, index) => {
        console.log(`\n   Response ${index + 1}:`);
        console.log(`   URL: ${resp.url}`);
        console.log(`   Status: ${resp.status}`);
        
        const bodyStr = JSON.stringify(resp.body);
        
        // Check for discount rule IDs in the response
        if (bodyStr.includes(LOW_RATE_DISCOUNT_RULE_ID)) {
          console.log(`   ✅ Contains Low Rate Discount Rule ID`);
        }
        
        // Look for discount-related fields
        if (resp.body.discount || resp.body.discounts || resp.body.appliedDiscount) {
          console.log(`   📋 Discount data found in response:`);
          console.log(`   ${JSON.stringify(resp.body.discount || resp.body.discounts || resp.body.appliedDiscount, null, 2)}`);
        }
        
        // Search for any rule IDs
        const respUUIDs = bodyStr.match(uuidPattern);
        if (respUUIDs) {
          console.log(`   Found ${respUUIDs.length} UUID(s) in response`);
        }
      });
    } else {
      console.log(`   ⚠️  No API responses captured (might be client-side rendering)`);
    }
    
    // Summary
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📋 SUMMARY:');
    console.log('───────────────────────────────────────────────────');
    console.log(`Expected: ${itemPrice < 100 ? '2%' : '0%'} Low Rate Discount`);
    console.log(`Found: ${discountPercent}% discount`);
    
    if (itemPrice < 100 && discountPercent === 2) {
      console.log('✅ CORRECT: 2% Low Rate Discount is applied!');
    } else if (itemPrice < 100 && discountPercent === 15) {
      console.log('❌ WRONG: 15% discount applied instead of 2%');
      console.log('   This suggests a different discount rule is active');
      console.log('   or taking precedence over the Low Rate Discount');
    } else if (itemPrice >= 100 && discountPercent === 0) {
      console.log('✅ CORRECT: No discount (rate >= $100)');
    } else {
      console.log(`⚠️  UNEXPECTED: ${discountPercent}% discount found`);
    }
    console.log('═══════════════════════════════════════════════════\n');
    
    await page.screenshot({ 
      path: `test-results/hotel/screenshots/low-rate-rule-verification.png`,
      fullPage: true 
    });
    
    // Save the full page HTML for inspection
    const html = await page.content();
    const fs = require('fs');
    fs.writeFileSync('test-results/hotel/screenshots/page-content-april-5.html', html);
    console.log('💾 Saved full page HTML to: test-results/hotel/screenshots/page-content-april-5.html');
  });

  test('Should check discount rule outside date range (March 31, 2026)', async ({ page }) => {
    const checkIn = '2026-03-31';
    const checkOut = '2026-04-01';
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🔍 DISCOUNT RULE VERIFICATION - OUTSIDE RANGE');
    console.log('═══════════════════════════════════════════════════');
    console.log(`Date: ${checkIn} (BEFORE April 1-15 range)`);
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      checkIn, checkOut, BOOKING_ENGINE_JWT, TEST_HOTEL_PARAMS
    );
    
    const pageText = await page.textContent('body') || '';
    
    const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
    const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
    
    const itemPrice = itemPriceMatch ? parseFloat(itemPriceMatch[1].replace(/,/g, '')) : 0;
    const discount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
    const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
    
    console.log('\n📊 PRICE DATA:');
    console.log(`   Item Price: $${itemPrice.toFixed(2)}`);
    console.log(`   Discount: ${discountPercent}% ($${discount.toFixed(2)})`);
    
    // Check for Low Rate Discount Rule ID
    if (pageText.includes(LOW_RATE_DISCOUNT_RULE_ID)) {
      console.log(`\n   ⚠️  WARNING: Low Rate Discount Rule ID found on March 31`);
      console.log(`   Expected: Should NOT be applied (outside date range)`);
    } else {
      console.log(`\n   ✓ Low Rate Discount Rule ID not found (correct for outside range)`);
    }
    
    // Look for other discount rule IDs
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    const foundUUIDs = pageText.match(uuidPattern);
    
    if (foundUUIDs && foundUUIDs.length > 0) {
      console.log(`\n   Found ${foundUUIDs.length} discount rule UUID(s):`);
      const uniqueUUIDs = [...new Set(foundUUIDs)];
      uniqueUUIDs.forEach((uuid, index) => {
        console.log(`   ${index + 1}. ${uuid}`);
      });
      console.log(`\n   These might be the discount rule(s) causing the 15% discount`);
    }
    
    console.log('\n═══════════════════════════════════════════════════\n');
    
    await page.screenshot({ 
      path: `test-results/hotel/screenshots/low-rate-rule-verification-march-31.png`,
      fullPage: true 
    });
  });
});
