import { test, expect } from '@playwright/test';
import { BookingEnginePage } from '../pages/BookingEnginePage';

/**
 * Test Low Rate Discount with JWT Secret Key: voyager_travel
 */

const JWT_SECRET = 'voyager_travel';

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

test.describe('Low Rate Discount - Using JWT Secret', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  /**
   * Test with secret key instead of JWT token
   */
  test('Should test Low Rate Discount with secret key (April 5, 2026)', async ({ page }) => {
    const checkIn = '2026-04-05';
    const checkOut = '2026-04-06';
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🔐 Testing with JWT Secret Key');
    console.log('═══════════════════════════════════════════════════');
    console.log(`Secret: ${JWT_SECRET}`);
    console.log(`Date: ${checkIn} to ${checkOut}`);
    console.log(`Expected: 2% Low Rate Discount for rates under $100`);
    
    // Try different methods to pass the secret
    
    // Method 1: Pass secret as jwt parameter
    console.log('\n📍 Method 1: Using secret as jwt parameter...');
    try {
      await bookingEnginePage.gotoHotelBookingWithDates(
        checkIn, checkOut, JWT_SECRET, TEST_HOTEL_PARAMS
      );
      
      const pageText = await page.textContent('body') || '';
      
      // Check if we got an auth error
      if (pageText.includes('Missing Token') || pageText.includes('Unauthorized') || pageText.includes('Invalid')) {
        console.log('   ❌ Method 1 failed: Auth error detected');
      } else {
        console.log('   ✅ Method 1: Page loaded!');
        
        const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
        const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
        
        if (itemPriceMatch && discountMatch) {
          const itemPrice = parseFloat(itemPriceMatch[1].replace(/,/g, ''));
          const discount = parseFloat(discountMatch[1].replace(/,/g, ''));
          const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
          
          console.log(`\n   💰 Price Data:`);
          console.log(`      Item Price: $${itemPrice.toFixed(2)}`);
          console.log(`      Discount: ${discountPercent}% ($${discount.toFixed(2)})`);
          console.log(`      Rate Status: ${itemPrice < 100 ? 'UNDER $100 ✓' : 'AT/OVER $100'}`);
          
          if (itemPrice < 100 && discountPercent === 2) {
            console.log(`\n   ✅ SUCCESS! Low Rate Discount (2%) is applied!`);
          } else if (itemPrice < 100 && discountPercent !== 2) {
            console.log(`\n   ⚠️  Found ${discountPercent}% instead of expected 2%`);
          }
        }
      }
    } catch (e: any) {
      console.log(`   ❌ Method 1 error: ${e.message}`);
    }
    
    await page.screenshot({ 
      path: `test-results/hotel/screenshots/low-rate-secret-method1-april-5.png`,
      fullPage: true 
    });
    
    // Method 2: Try building URL with secret as a parameter
    console.log('\n📍 Method 2: Using secret as URL parameter...');
    try {
      const baseUrl = 'https://bookings.tripbeast.com/hotel/hotel-booking';
      const params = new URLSearchParams({
        checkin: checkIn,
        checkout: checkOut,
        adults: '1',
        secret: JWT_SECRET,
        ...TEST_HOTEL_PARAMS
      });
      
      const url = `${baseUrl}?${params.toString()}`;
      
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const pageText = await page.textContent('body') || '';
      
      if (pageText.includes('Missing Token') || pageText.includes('Unauthorized')) {
        console.log('   ❌ Method 2 failed: Auth error detected');
      } else {
        console.log('   ✅ Method 2: Page loaded!');
        
        const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
        const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
        
        if (itemPriceMatch && discountMatch) {
          const itemPrice = parseFloat(itemPriceMatch[1].replace(/,/g, ''));
          const discount = parseFloat(discountMatch[1].replace(/,/g, ''));
          const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
          
          console.log(`\n   💰 Price Data:`);
          console.log(`      Item Price: $${itemPrice.toFixed(2)}`);
          console.log(`      Discount: ${discountPercent}% ($${discount.toFixed(2)})`);
        }
      }
    } catch (e: any) {
      console.log(`   ❌ Method 2 error: ${e.message}`);
    }
    
    await page.screenshot({ 
      path: `test-results/hotel/screenshots/low-rate-secret-method2-april-5.png`,
      fullPage: true 
    });
    
    // Method 3: Set as Authorization header
    console.log('\n📍 Method 3: Using secret in Authorization header...');
    try {
      await page.setExtraHTTPHeaders({
        'Authorization': `Bearer ${JWT_SECRET}`
      });
      
      await bookingEnginePage.gotoHotelBookingWithDates(
        checkIn, checkOut, '', TEST_HOTEL_PARAMS  // Empty JWT in URL
      );
      
      const pageText = await page.textContent('body') || '';
      
      if (pageText.includes('Missing Token') || pageText.includes('Unauthorized')) {
        console.log('   ❌ Method 3 failed: Auth error detected');
      } else {
        console.log('   ✅ Method 3: Page loaded!');
        
        const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
        const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
        
        if (itemPriceMatch && discountMatch) {
          const itemPrice = parseFloat(itemPriceMatch[1].replace(/,/g, ''));
          const discount = parseFloat(discountMatch[1].replace(/,/g, ''));
          const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
          
          console.log(`\n   💰 Price Data:`);
          console.log(`      Item Price: $${itemPrice.toFixed(2)}`);
          console.log(`      Discount: ${discountPercent}% ($${discount.toFixed(2)})`);
        }
      }
    } catch (e: any) {
      console.log(`   ❌ Method 3 error: ${e.message}`);
    }
    
    await page.screenshot({ 
      path: `test-results/hotel/screenshots/low-rate-secret-method3-april-5.png`,
      fullPage: true 
    });
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📋 SUMMARY:');
    console.log('   Tested 3 different methods to authenticate with secret key');
    console.log('   Check screenshots and console output above for results');
    console.log('═══════════════════════════════════════════════════\n');
  });

  /**
   * Test multiple April dates with the secret key
   */
  test('Should test multiple April dates with secret key', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🔐 Testing Multiple April Dates with Secret Key');
    console.log('═══════════════════════════════════════════════════');
    
    const testDates = [
      { checkIn: '2026-04-01', checkOut: '2026-04-02', desc: 'Start of range' },
      { checkIn: '2026-04-05', checkOut: '2026-04-06', desc: 'Mid range' },
      { checkIn: '2026-04-15', checkOut: '2026-04-16', desc: 'End of range' },
      { checkIn: '2026-03-31', checkOut: '2026-04-01', desc: 'Before range' },
      { checkIn: '2026-04-16', checkOut: '2026-04-17', desc: 'After range' }
    ];
    
    for (const dateTest of testDates) {
      console.log(`\n📅 Testing: ${dateTest.checkIn} (${dateTest.desc})`);
      
      try {
        await bookingEnginePage.gotoHotelBookingWithDates(
          dateTest.checkIn, dateTest.checkOut, JWT_SECRET, TEST_HOTEL_PARAMS
        );
        
        const pageText = await page.textContent('body') || '';
        const itemPriceMatch = pageText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
        const discountMatch = pageText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
        
        if (itemPriceMatch && discountMatch) {
          const itemPrice = parseFloat(itemPriceMatch[1].replace(/,/g, ''));
          const discount = parseFloat(discountMatch[1].replace(/,/g, ''));
          const discountPercent = itemPrice > 0 ? Math.round((discount / itemPrice) * 100) : 0;
          
          console.log(`   Rate: $${itemPrice.toFixed(2)} | Discount: ${discountPercent}%`);
          
          // Check if it matches expected behavior
          const isInRange = dateTest.checkIn >= '2026-04-01' && dateTest.checkIn <= '2026-04-15';
          const shouldHave2Percent = isInRange && itemPrice < 100;
          
          if (shouldHave2Percent && discountPercent === 2) {
            console.log(`   ✅ CORRECT: 2% Low Rate Discount applied`);
          } else if (shouldHave2Percent && discountPercent !== 2) {
            console.log(`   ❌ WRONG: Expected 2%, found ${discountPercent}%`);
          } else if (!shouldHave2Percent && discountPercent !== 2) {
            console.log(`   ✅ CORRECT: No 2% discount (outside range or rate >= $100)`);
          }
        } else {
          console.log(`   ⚠️  Could not extract price data`);
        }
        
        await page.waitForTimeout(1000);
        
      } catch (e: any) {
        console.log(`   ❌ Error: ${e.message}`);
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════\n');
  });
});
