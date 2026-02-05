/**
 * Debug spec: Single car 1-day test to diagnose 403 Forbidden
 * Captures network 403/non-2xx responses and runs one case until resolved.
 *
 * Run: npx playwright test tests/car/car-1day-debug.spec.ts --project=chromium
 * Or with minimal JWT: ANCILLARY_JWT=<minimal> npx playwright test ...
 */

import { test, expect } from '@playwright/test';
import { CarBookingPage } from '../pages/CarBookingPage';
import { CAR_BOOKING_JWT, getEffectiveDiscountPct } from '../helpers/car-discount-data';

// Minimal JWT (no businessRuleId/discountRuleId) - use if full JWT returns 403
const MINIMAL_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiIiLCJjbGllbnRMb2dvVXJsIjoiIiwibWVtYmVyc2hpcCI6ZmFsc2UsImlhdCI6MTc2ODg5NDQwMn0.MpE_ewPTnBTDW3bGyo0U7hiMcvIWLV0V5I_EPOQIBkg';

// Single test case: March 7, 2026 (Friday) - Period 3, expect 35% DOW discount
const PICKUP = '2026-03-07';
const DROPOFF = '2026-03-08';
const EXPECTED_DISCOUNT = 35;

const TEST_CAR_PARAMS = {
  pickup_location: 'Las Vegas Strip',
  dropoff_location: 'Las Vegas Strip',
  pickup_time: '10:00 AM',
  dropoff_time: '10:00 AM',
  renter_age: '30',
};

test.describe('Car 1-Day Debug - 403 Investigation', () => {
  test('Single case: 2026-03-07 (Fri) expect 35% - capture 403s', async ({ page }) => {
    test.setTimeout(120000);

    const forbiddenUrls: string[] = [];
    const forbiddenResponses: Array<{ url: string; status: number; statusText: string }> = [];
    const non2xxResponses: Array<{ url: string; status: number }> = [];

    page.on('response', (response) => {
      const status = response.status();
      const url = response.url();
      if (status === 403) {
        forbiddenUrls.push(url);
        forbiddenResponses.push({ url, status, statusText: response.statusText() });
        console.log(`\n[403] ${url}`);
      } else if (status >= 400 && !url.includes('favicon')) {
        non2xxResponses.push({ url: url.substring(0, 120), status });
      }
    });

    const carBookingPage = new CarBookingPage(page);

    // Use minimal JWT if CAR_USE_MINIMAL_JWT=1 (to test 403 avoidance)
    const jwtToUse = process.env.CAR_USE_MINIMAL_JWT === '1' ? MINIMAL_JWT : CAR_BOOKING_JWT;
    const jwtType = jwtToUse === MINIMAL_JWT ? 'minimal (no rule IDs)' : 'full (with discountRuleId)';

    console.log('\n=== CAR 1-DAY DEBUG ===');
    console.log('JWT type:', jwtType);
    console.log('JWT (first 50 chars):', jwtToUse.substring(0, 50) + '...');
    console.log('Dates:', PICKUP, '→', DROPOFF);
    console.log('Expected discount:', EXPECTED_DISCOUNT + '%');
    console.log('');

    await carBookingPage.gotoCarBookingWithDates(PICKUP, DROPOFF, jwtToUse, TEST_CAR_PARAMS);

    const breakdown = await carBookingPage.getPriceBreakdown();
    const gross = breakdown.subtotal + breakdown.discount;
    const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

    console.log('\n=== RESULT ===');
    console.log('Gross:', gross, '| Discount:', breakdown.discount, '| Net:', breakdown.subtotal);
    console.log('Effective discount:', effectivePct + '%');
    console.log('Expected:', EXPECTED_DISCOUNT + '%');

    if (forbiddenResponses.length > 0) {
      console.log('\n=== 403 FORBIDDEN RESPONSES ===');
      forbiddenResponses.forEach((r) => console.log(r.url));
    }
    if (non2xxResponses.length > 0) {
      console.log('\n=== OTHER NON-2XX RESPONSES ===');
      non2xxResponses.slice(0, 10).forEach((r) => console.log(`[${r.status}] ${r.url}`));
    }

    const pageErrors = await carBookingPage.getPageValidationErrors();
    if (pageErrors !== 'No validation message found') {
      console.log('\nPage validation/error:', pageErrors);
    }

    // Primary: no 403 Forbidden
    expect(forbiddenUrls.length, `403 Forbidden on: ${forbiddenUrls.join(', ') || 'none'}`).toBe(0);
    // Secondary: discount applied (may still be 0% if car discount not supported)
    const diff = Math.abs(effectivePct - EXPECTED_DISCOUNT);
    expect(diff, `Discount ${effectivePct}% vs expected ${EXPECTED_DISCOUNT}%`).toBeLessThanOrEqual(2);
  });
});
