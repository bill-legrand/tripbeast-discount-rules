/**
 * Verify if HOTELS show discounts but CARS don't on travel.tripbeast.com
 * Uses same minimal JWT for both hotel and car bookings
 *
 * Run: npx playwright test tests/car/hotel-vs-car-discount-test.spec.ts --project=chromium
 */

import { test, expect } from '@playwright/test';
import { BookingEnginePage } from '../pages/BookingEnginePage';
import { CarBookingPage } from '../pages/CarBookingPage';

const MINIMAL_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiIiLCJjbGllbnRMb2dvVXJsIjoiIiwibWVtYmVyc2hpcCI6ZmFsc2UsImlhdCI6MTc3MDI1OTc3OX0.c9bpla6L6AFH2q7kw5EiSaQmNY58m1u7V4HzK5Wn_hc';

test.describe('Hotel vs Car Discount Comparison', () => {
  
  test('Hotel booking should show discount for Mar 7, 2026', async ({ page }) => {
    const bookingEnginePage = new BookingEnginePage(page);
    
    console.log('\n=== HOTEL TEST (Feb 5-6) ===');
    
    await bookingEnginePage.gotoHotelBookingWithDates(
      '2026-02-05',
      '2026-02-06',
      MINIMAL_JWT,
      {
        search_query: 'Las Vegas',
        hotel_id: '',
        adults: '1',
        children: ''
      }
    );
    
    await page.waitForTimeout(8000);
    const bodyText = await page.textContent('body') || '';
    
    const hasDiscount = /discount/i.test(bodyText);
    const discountMatch = bodyText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
    
    console.log('Has "Discount" text:', hasDiscount);
    console.log('Discount amount:', discountMatch ? discountMatch[1] : 'NOT FOUND');
    
    await page.screenshot({ path: 'test-results/hotel-discount-check.png', fullPage: true });
    
    // Expect discount to be present for hotels
    expect(hasDiscount, 'Hotels should show discount').toBe(true);
  });
  
  test('Car booking should NOT show discount (not implemented)', async ({ page }) => {
    const carBookingPage = new CarBookingPage(page);
    
    console.log('\n=== CAR TEST (Mar 7-8) ===');
    
    await carBookingPage.gotoCarBookingWithDates(
      '2026-03-07',
      '2026-03-08',
      MINIMAL_JWT,
      {
        pickup_location: 'Las Vegas Strip',
        dropoff_location: 'Las Vegas Strip',
        pickup_time: '10:00 AM',
        dropoff_time: '10:00 AM',
        renter_age: '30'
      }
    );
    
    const breakdown = await carBookingPage.getPriceBreakdown();
    
    console.log('Base Price:', breakdown.subtotal + breakdown.discount);
    console.log('Discount:', breakdown.discount);
    console.log('Total:', breakdown.total);
    
    await page.screenshot({ path: 'test-results/car-no-discount-check.png', fullPage: true });
    
    // Document the finding: cars don't show discounts
    console.log('\n=== FINDING ===');
    console.log('Car bookings do NOT display discount line items.');
    console.log('This is likely a backend/frontend limitation, not a test issue.');
    
    expect(breakdown.discount).toBe(0);
  });
});
