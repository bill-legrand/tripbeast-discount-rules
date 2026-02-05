import { test, expect } from '@playwright/test';
import { BookingEnginePage } from '../pages/BookingEnginePage';

/**
 * Check multiple Las Vegas hotel IDs to find rates under/over $100
 * Tests specific hotels to categorize them for Low Rate Discount eligibility
 */

const BOOKING_ENGINE_JWT = process.env.BOOKING_ENGINE_JWT || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI';

// Sample Las Vegas hotel IDs to test (starting with the one we know works)
const LAS_VEGAS_HOTELS = [
  {
    hotel_id: '2008',
    property_id: '12384405',
    room_id: '201273159',
    search_query: 'Las Vegas',
    longitude: '-115.141376',
    latitude: '36.17006',
    type: 'id',
    gds: 'expedia',
    expectedName: 'Longhorn Casino & Hotel'
  },
  // Add more hotel IDs if known
  // These are example IDs - may or may not work
  {
    hotel_id: '2009',
    property_id: '12384406',
    room_id: '201273160',
    search_query: 'Las Vegas',
    longitude: '-115.141376',
    latitude: '36.17006',
    type: 'id',
    gds: 'expedia',
    expectedName: 'Unknown Hotel 2'
  },
  {
    hotel_id: '2010',
    property_id: '12384407',
    room_id: '201273161',
    search_query: 'Las Vegas',
    longitude: '-115.141376',
    latitude: '36.17006',
    type: 'id',
    gds: 'expedia',
    expectedName: 'Unknown Hotel 3'
  },
];

interface HotelPriceResult {
  hotelId: string;
  hotelName: string;
  itemPrice: number;
  discount: number;
  discountPercent: number;
  category: 'under_100' | 'over_100';
  qualifiesForLowRate: boolean;
  success: boolean;
  error?: string;
}

test.describe('Las Vegas Hotels - Price Check for Low Rate Discount', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  test('Should check multiple Las Vegas hotels and categorize by price', async ({ page }) => {
    const checkIn = '2026-04-05';
    const checkOut = '2026-04-06';
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🏨 LAS VEGAS HOTELS - PRICE CATEGORIZATION');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📅 Dates: ${checkIn} to ${checkOut} (within Low Rate Discount range)`);
    console.log(`💰 Threshold: $100`);
    console.log(`🎯 Goal: Identify hotels under $100 (qualify for 2% discount)`);
    console.log('───────────────────────────────────────────────────────────────\n');
    
    const results: HotelPriceResult[] = [];
    
    for (const hotel of LAS_VEGAS_HOTELS) {
      console.log(`\n🔍 Testing Hotel ID: ${hotel.hotel_id}`);
      
      try {
        await bookingEnginePage.gotoHotelBookingWithDates(
          checkIn, checkOut, BOOKING_ENGINE_JWT, hotel
        );
        
        const pageText = await page.textContent('body') || '';
        
        // Extract hotel name from the page
        const hotelNameLocator = page.locator('h1, h2, h3, h4').filter({ hasText: /Hotel|Casino|Resort|Inn|Suites/i }).first();
        const hotelName = await hotelNameLocator.textContent({ timeout: 3000 }).catch(() => hotel.expectedName);
        
        // Extract prices
        const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
        const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
        
        if (itemPriceMatch) {
          const itemPrice = parseFloat(itemPriceMatch[1].replace(/,/g, ''));
          const discount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
          const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
          
          const category = itemPrice < 100 ? 'under_100' : 'over_100';
          const qualifiesForLowRate = itemPrice < 100;
          
          results.push({
            hotelId: hotel.hotel_id,
            hotelName: hotelName,
            itemPrice: itemPrice,
            discount: discount,
            discountPercent: discountPercent,
            category: category,
            qualifiesForLowRate: qualifiesForLowRate,
            success: true
          });
          
          const icon = qualifiesForLowRate ? '💚' : '🔴';
          console.log(`   ${icon} ${hotelName}`);
          console.log(`      Item Price: $${itemPrice.toFixed(2)}`);
          console.log(`      Current Discount: ${discountPercent}% ($${discount.toFixed(2)})`);
          console.log(`      Category: ${category === 'under_100' ? 'UNDER $100 ✓' : 'OVER $100'}`);
          console.log(`      Qualifies for Low Rate Discount: ${qualifiesForLowRate ? 'YES' : 'NO'}`);
          
          if (qualifiesForLowRate && discountPercent !== 2) {
            console.log(`      ⚠️  Expected 2% Low Rate Discount, found ${discountPercent}%`);
          }
          
        } else {
          console.log(`   ⚠️  Could not extract price for this hotel`);
          results.push({
            hotelId: hotel.hotel_id,
            hotelName: hotelName,
            itemPrice: 0,
            discount: 0,
            discountPercent: 0,
            category: 'under_100',
            qualifiesForLowRate: false,
            success: false,
            error: 'Could not extract price'
          });
        }
        
        await page.waitForTimeout(1000);
        
      } catch (e: any) {
        console.log(`   ❌ Error: ${e.message}`);
        results.push({
          hotelId: hotel.hotel_id,
          hotelName: hotel.expectedName,
          itemPrice: 0,
          discount: 0,
          discountPercent: 0,
          category: 'under_100',
          qualifiesForLowRate: false,
          success: false,
          error: e.message
        });
      }
    }
    
    // Generate summary
    const successful = results.filter(r => r.success);
    const under100 = successful.filter(r => r.category === 'under_100');
    const over100 = successful.filter(r => r.category === 'over_100');
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`Total hotels tested: ${results.length}`);
    console.log(`Successful: ${successful.length}`);
    console.log(`Failed: ${results.length - successful.length}`);
    console.log('');
    console.log(`Hotels UNDER $100: ${under100.length} (qualify for 2% Low Rate Discount)`);
    console.log(`Hotels OVER $100: ${over100.length} (do NOT qualify)`);
    
    if (under100.length > 0) {
      console.log('\n💚 HOTELS UNDER $100 (Should get 2% Low Rate Discount):');
      console.log('───────────────────────────────────────────────────────────────');
      under100.forEach((hotel, idx) => {
        console.log(`   ${idx + 1}. ${hotel.hotelName} (ID: ${hotel.hotelId})`);
        console.log(`      Price: $${hotel.itemPrice.toFixed(2)}`);
        console.log(`      Current Discount: ${hotel.discountPercent}%`);
        console.log(`      Expected: 2% ($${(hotel.itemPrice * 0.02).toFixed(2)})`);
        console.log(`      Status: ${hotel.discountPercent === 2 ? '✅ CORRECT' : '❌ INCORRECT'}`);
      });
    }
    
    if (over100.length > 0) {
      console.log('\n🔴 HOTELS OVER $100 (Should NOT get Low Rate Discount):');
      console.log('───────────────────────────────────────────────────────────────');
      over100.forEach((hotel, idx) => {
        console.log(`   ${idx + 1}. ${hotel.hotelName} (ID: ${hotel.hotelId})`);
        console.log(`      Price: $${hotel.itemPrice.toFixed(2)}`);
        console.log(`      Current Discount: ${hotel.discountPercent}%`);
        console.log(`      Status: ${hotel.discountPercent === 0 ? '✅ CORRECT (no discount)' : `⚠️  Has ${hotel.discountPercent}% discount`}`);
      });
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════\n');
    
    // Save results
    const fs = require('fs');
    fs.writeFileSync('test-results/hotel/screenshots/las-vegas-hotels-price-results.json', JSON.stringify({
      testDate: new Date().toISOString(),
      checkIn,
      checkOut,
      results: results
    }, null, 2));
    
    console.log('💾 Results saved to: test-results/hotel/screenshots/las-vegas-hotels-price-results.json\n');
  });
});
