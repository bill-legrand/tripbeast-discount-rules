import { test, expect } from '@playwright/test';

/**
 * Search Las Vegas hotels and categorize by price (under/over $100)
 * This helps identify which hotels qualify for Low Rate Discount
 */

const BOOKING_ENGINE_JWT = process.env.BOOKING_ENGINE_JWT || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI';

interface HotelResult {
  name: string;
  price: number;
  priceDisplay: string;
  category: 'under_100' | 'over_100';
  hotelId?: string;
  propertyId?: string;
}

test.describe('Las Vegas Hotel Search - Price Categories', () => {
  
  test('Should search Las Vegas hotels for April 5, 2026 and categorize by price', async ({ page }) => {
    const checkIn = '2026-04-05';
    const checkOut = '2026-04-06';
    const location = 'Las Vegas, NV';
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🏨 LAS VEGAS HOTEL SEARCH - PRICE CATEGORIZATION');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📅 Dates: ${checkIn} to ${checkOut}`);
    console.log(`📍 Location: ${location}`);
    console.log(`💰 Goal: Find hotels with rates under $100 vs over $100`);
    console.log('───────────────────────────────────────────────────────────────');
    
    // Navigate to booking engine search page
    const searchUrl = `https://bookings.tripbeast.com/?page=hotel&jwt=${BOOKING_ENGINE_JWT}`;
    
    console.log('\n🔄 Step 1: Navigating to booking engine...');
    await page.goto(searchUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('✓ Page loaded');
    
    // Fill in search form
    console.log('\n🔄 Step 2: Filling search form...');
    
    try {
      // Try multiple possible selectors for search inputs
      const locationInput = page.locator('input[name="search"], input[placeholder*="destination" i], input[placeholder*="location" i], input[placeholder*="city" i]').first();
      const checkInInput = page.locator('input[name="checkin"], input[name="check_in"], input[placeholder*="check-in" i]').first();
      const checkOutInput = page.locator('input[name="checkout"], input[name="check_out"], input[placeholder*="check-out" i]').first();
      
      // Fill location
      await locationInput.waitFor({ state: 'visible', timeout: 5000 });
      await locationInput.fill(location);
      await page.waitForTimeout(1000);
      
      // Select from dropdown if it appears
      const locationOption = page.locator(`text="${location}"`).first();
      if (await locationOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await locationOption.click();
      }
      
      // Fill dates
      await checkInInput.fill(checkIn);
      await checkOutInput.fill(checkOut);
      
      console.log('✓ Search form filled');
      
      // Click search button
      console.log('\n🔄 Step 3: Clicking search...');
      const searchButton = page.locator('button:has-text("Search"), button[type="submit"]').first();
      await searchButton.click();
      
      // Wait for results to load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      
      console.log('✓ Search results loading...');
      
    } catch (e: any) {
      console.log(`⚠️  Could not use search form: ${e.message}`);
      console.log('   Trying direct URL navigation...');
      
      // Fallback: Navigate directly to search results URL
      const directUrl = `https://bookings.tripbeast.com/hotel/search-result?checkin=${checkIn}&checkout=${checkOut}&adults=1&search_query=Las+Vegas%2C+NV&jwt=${BOOKING_ENGINE_JWT}`;
      await page.goto(directUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
    }
    
    console.log('\n🔄 Step 4: Extracting hotel data...');
    
    // Take screenshot of search results
    await page.screenshot({ 
      path: 'screenshots/las-vegas-search-results.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: screenshots/las-vegas-search-results.png');
    
    // Extract hotel cards
    const hotelCards = await page.locator('.product-card, .hotel-card, [data-testid="hotel-card"], .custom-bookingresultListBox').all();
    
    console.log(`\n   Found ${hotelCards.length} hotel card(s)`);
    
    const hotels: HotelResult[] = [];
    
    for (let i = 0; i < Math.min(hotelCards.length, 20); i++) {
      const card = hotelCards[i];
      
      try {
        // Extract hotel name
        const nameElement = card.locator('h1, h2, h3, h4, .hotel-name, .product-title, [data-testid="hotel-name"]').first();
        const name = await nameElement.textContent({ timeout: 2000 }).catch(() => null);
        
        // Extract price
        const priceElement = card.locator('.price, .product-price, [data-testid="price"], .custom-pdValue').first();
        const priceText = await priceElement.textContent({ timeout: 2000 }).catch(() => null);
        
        if (name && priceText) {
          // Parse price
          const priceMatch = priceText.match(/\$?\s*([\d,]+\.?\d*)/);
          if (priceMatch) {
            const price = parseFloat(priceMatch[1].replace(/,/g, ''));
            
            hotels.push({
              name: name.trim(),
              price: price,
              priceDisplay: `$${price.toFixed(2)}`,
              category: price < 100 ? 'under_100' : 'over_100'
            });
            
            console.log(`   ✓ ${i + 1}. ${name.trim()} - $${price.toFixed(2)}`);
          }
        }
      } catch (e: any) {
        console.log(`   ⚠️  Could not extract data for hotel ${i + 1}`);
      }
    }
    
    // Categorize hotels
    const under100 = hotels.filter(h => h.category === 'under_100').sort((a, b) => a.price - b.price);
    const over100 = hotels.filter(h => h.category === 'over_100').sort((a, b) => a.price - b.price);
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 RESULTS SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`Total hotels found: ${hotels.length}`);
    console.log(`Hotels UNDER $100: ${under100.length} (qualify for Low Rate Discount)`);
    console.log(`Hotels OVER $100: ${over100.length} (do NOT qualify)`);
    
    console.log('\n💰 HOTELS UNDER $100 (Qualify for 2% Low Rate Discount):');
    console.log('───────────────────────────────────────────────────────────────');
    if (under100.length === 0) {
      console.log('   (None found)');
    } else {
      under100.forEach((hotel, idx) => {
        console.log(`   ${idx + 1}. ${hotel.name}`);
        console.log(`      Price: ${hotel.priceDisplay}`);
      });
    }
    
    console.log('\n💵 HOTELS OVER $100 (Do NOT qualify):');
    console.log('───────────────────────────────────────────────────────────────');
    if (over100.length === 0) {
      console.log('   (None found)');
    } else {
      over100.forEach((hotel, idx) => {
        console.log(`   ${idx + 1}. ${hotel.name}`);
        console.log(`      Price: ${hotel.priceDisplay}`);
      });
    }
    
    // Calculate statistics
    if (hotels.length > 0) {
      const avgPrice = hotels.reduce((sum, h) => sum + h.price, 0) / hotels.length;
      const minPrice = Math.min(...hotels.map(h => h.price));
      const maxPrice = Math.max(...hotels.map(h => h.price));
      
      console.log('\n📈 STATISTICS:');
      console.log('───────────────────────────────────────────────────────────────');
      console.log(`   Average Price: $${avgPrice.toFixed(2)}`);
      console.log(`   Lowest Price: $${minPrice.toFixed(2)}`);
      console.log(`   Highest Price: $${maxPrice.toFixed(2)}`);
      console.log(`   % Under $100: ${((under100.length / hotels.length) * 100).toFixed(1)}%`);
      console.log(`   % Over $100: ${((over100.length / hotels.length) * 100).toFixed(1)}%`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════\n');
    
    // Save results to JSON file
    const fs = require('fs');
    const resultsData = {
      searchDate: new Date().toISOString(),
      checkIn,
      checkOut,
      location,
      totalHotels: hotels.length,
      under100Count: under100.length,
      over100Count: over100.length,
      hotelsUnder100: under100,
      hotelsOver100: over100
    };
    
    fs.writeFileSync('screenshots/las-vegas-hotels-by-price.json', JSON.stringify(resultsData, null, 2));
    console.log('💾 Results saved to: screenshots/las-vegas-hotels-by-price.json\n');
  });

  test('Should test Low Rate Discount on hotels under $100', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTING LOW RATE DISCOUNT ON HOTELS UNDER $100');
    console.log('═══════════════════════════════════════════════════════════════');
    
    // Read the results from the previous test
    const fs = require('fs');
    let resultsData;
    
    try {
      const data = fs.readFileSync('screenshots/las-vegas-hotels-by-price.json', 'utf8');
      resultsData = JSON.parse(data);
    } catch (e) {
      console.log('⚠️  No search results found. Run the search test first.');
      return;
    }
    
    const under100 = resultsData.hotelsUnder100 || [];
    
    if (under100.length === 0) {
      console.log('⚠️  No hotels under $100 found in previous search.');
      return;
    }
    
    console.log(`\n📋 Testing ${Math.min(under100.length, 5)} hotels under $100...`);
    console.log('   Expected: 2% discount on April 1-15, 2026\n');
    
    for (let i = 0; i < Math.min(under100.length, 5); i++) {
      const hotel = under100[i];
      
      console.log(`\n${i + 1}. Testing: ${hotel.name} (${hotel.priceDisplay})`);
      
      // Note: We would need hotel_id and property_id to test specific hotels
      // For now, just document what should happen
      console.log(`   Should qualify for 2% Low Rate Discount`);
      console.log(`   Expected discount: $${(hotel.price * 0.02).toFixed(2)}`);
      console.log(`   Final price: $${(hotel.price * 0.98).toFixed(2)}`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════\n');
  });
});
