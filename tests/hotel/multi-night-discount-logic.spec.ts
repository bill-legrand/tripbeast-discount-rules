import { test, expect } from '@playwright/test';
import { BookingEnginePage } from '../pages/BookingEnginePage';
import {
  BOOKING_ENGINE_JWT,
  TEST_HOTEL_PARAMS,
  LAS_VEGAS_HOTELS,
} from '../helpers/dow-discount-data';

/**
 * Multi-Night Discount Logic Verification
 *
 * Tests whether the booking engine uses:
 * - Model A: Arrival-date discount applied to entire stay
 * - Model B: Per-night discount applied to each night's rate
 *
 * Uses DOW config (March 2-8): Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, Sat 40%, Sun 10%
 * Booking flow: bookings.tripbeast.com with direct hotel params (no search)
 *
 * Run: npx playwright test multi-night-discount-logic.spec.ts
 * Plan: MULTI_NIGHT_DISCOUNT_TEST_PLAN.md
 */

interface MultiNightScenario {
  checkIn: string;
  checkOut: string;
  nights: number;
  arrivalDiscountPct: number; // Model A
  perNightAvgPct: number; // Model B (average of nightly discounts)
  label: string;
}

const MULTI_NIGHT_SCENARIOS: MultiNightScenario[] = [
  // 2-night Mon-Tue (Mar 2-4): arrival 15%, per-night avg 17.5%
  {
    checkIn: '2026-03-02',
    checkOut: '2026-03-04',
    nights: 2,
    arrivalDiscountPct: 15,
    perNightAvgPct: 17.5,
    label: '2-night Mon-Tue (15% vs 17.5%)',
  },
  // 2-night Thu-Fri (Mar 5-7): arrival 30%, per-night avg 32.5%
  {
    checkIn: '2026-03-05',
    checkOut: '2026-03-07',
    nights: 2,
    arrivalDiscountPct: 30,
    perNightAvgPct: 32.5,
    label: '2-night Thu-Fri (30% vs 32.5%)',
  },
  // 3-night Tue-Thu (Mar 3-6): arrival 20%, per-night avg 25%
  {
    checkIn: '2026-03-03',
    checkOut: '2026-03-06',
    nights: 3,
    arrivalDiscountPct: 20,
    perNightAvgPct: 25,
    label: '3-night Tue-Thu (20% vs 25%)',
  },
  // 3-night Wed-Fri (Mar 4-7): arrival 25%, per-night avg 30%
  {
    checkIn: '2026-03-04',
    checkOut: '2026-03-07',
    nights: 3,
    arrivalDiscountPct: 25,
    perNightAvgPct: 30,
    label: '3-night Wed-Fri (25% vs 30%)',
  },
];

function getEffectiveDiscountPct(itemPrice: number, discountAmount: number): number {
  if (itemPrice <= 0) return 0;
  return Math.round((discountAmount / itemPrice) * 100 * 10) / 10;
}

test.describe('Multi-Night Discount Logic', () => {
  let bookingEnginePage: BookingEnginePage;

  test.beforeEach(async ({ page }) => {
    bookingEnginePage = new BookingEnginePage(page);
  });

  for (const scenario of MULTI_NIGHT_SCENARIOS) {
    test(`${scenario.label}: detect arrival-date vs per-night model`, async ({ page }) => {
      await bookingEnginePage.gotoHotelBookingWithDates(
        scenario.checkIn,
        scenario.checkOut,
        BOOKING_ENGINE_JWT,
        TEST_HOTEL_PARAMS
      );

      const breakdown = await bookingEnginePage.getPriceBreakdown();
      const itemPrice = breakdown.subtotal + breakdown.discount; // gross before discount
      const discountAmount = breakdown.discount;
      const effectivePct = getEffectiveDiscountPct(itemPrice, discountAmount);

      console.log(`\n--- ${scenario.label} ---`);
      console.log(`  Item Price (gross): $${itemPrice.toFixed(2)} | Discount: $${discountAmount.toFixed(2)} | Total: $${breakdown.total.toFixed(2)}`);
      console.log(`  Actual effective discount: ${effectivePct}%`);
      console.log(`  Model A (arrival-date): ${scenario.arrivalDiscountPct}%`);
      console.log(`  Model B (per-night avg): ${scenario.perNightAvgPct}%`);

      const matchesA = Math.abs(effectivePct - scenario.arrivalDiscountPct) <= 1;
      const matchesB = Math.abs(effectivePct - scenario.perNightAvgPct) <= 1;

      if (matchesA && !matchesB) {
        console.log(`  ✓ CONFIRMED: Arrival-date model`);
      } else if (matchesB && !matchesA) {
        console.log(`  ✓ CONFIRMED: Per-night model`);
      } else if (matchesA && matchesB) {
        console.log(`  ? INCONCLUSIVE: Could match either (scenario too close)`);
      } else {
        console.log(`  ✗ REFUTED: Neither model (actual ${effectivePct}% vs A ${scenario.arrivalDiscountPct}% / B ${scenario.perNightAvgPct}%)`);
      }

      expect(discountAmount).toBeGreaterThan(0);

      await page.screenshot({
        path: `test-results/hotel/multi-night-${scenario.checkIn.replace(/-/g, '')}-${scenario.checkOut.replace(/-/g, '')}.png`,
        fullPage: true,
      });
    });
  }

  test('Summary: aggregate model determination across all scenarios', async ({ page }) => {
    const findings: Array<{
      scenario: string;
      effectivePct: number;
      modelA: number;
      modelB: number;
      verdict: 'arrival' | 'per-night' | 'inconclusive' | 'neither';
    }> = [];

    for (const scenario of MULTI_NIGHT_SCENARIOS) {
      await bookingEnginePage.gotoHotelBookingWithDates(
        scenario.checkIn,
        scenario.checkOut,
        BOOKING_ENGINE_JWT,
        TEST_HOTEL_PARAMS
      );

      const breakdown = await bookingEnginePage.getPriceBreakdown();
      const itemPrice = breakdown.subtotal + breakdown.discount;
      const effectivePct = getEffectiveDiscountPct(itemPrice, breakdown.discount);

      const matchesA = Math.abs(effectivePct - scenario.arrivalDiscountPct) <= 1;
      const matchesB = Math.abs(effectivePct - scenario.perNightAvgPct) <= 1;

      let verdict: 'arrival' | 'per-night' | 'inconclusive' | 'neither' = 'neither';
      if (matchesA && !matchesB) verdict = 'arrival';
      else if (matchesB && !matchesA) verdict = 'per-night';
      else if (matchesA && matchesB) verdict = 'inconclusive';

      findings.push({
        scenario: scenario.label,
        effectivePct,
        modelA: scenario.arrivalDiscountPct,
        modelB: scenario.perNightAvgPct,
        verdict,
      });
    }

    const arrivalCount = findings.filter((f) => f.verdict === 'arrival').length;
    const perNightCount = findings.filter((f) => f.verdict === 'per-night').length;
    const neitherCount = findings.filter((f) => f.verdict === 'neither').length;
    const inconclusiveCount = findings.filter((f) => f.verdict === 'inconclusive').length;

    console.log('\n========== MULTI-NIGHT DISCOUNT LOGIC SUMMARY ==========');
    findings.forEach((f) => {
      console.log(`  ${f.scenario}: ${f.effectivePct}% actual → ${f.verdict}`);
    });
    console.log(`\n  Arrival-date matches: ${arrivalCount}`);
    console.log(`  Per-night matches: ${perNightCount}`);
    console.log(`  Neither: ${neitherCount}`);
    console.log(`  Inconclusive: ${inconclusiveCount}`);

    if (arrivalCount >= 3 && arrivalCount > perNightCount) {
      console.log('\n  OVERALL: Arrival-date model appears to be in use');
    } else if (perNightCount >= 3 && perNightCount > arrivalCount) {
      console.log('\n  OVERALL: Per-night model appears to be in use');
    } else if (neitherCount >= 2) {
      console.log('\n  OVERALL: Neither model - system may use flat or different logic');
    } else {
      console.log('\n  OVERALL: Inconclusive - run individual scenarios for details');
    }
    console.log('========================================================\n');

    expect(findings.length).toBe(MULTI_NIGHT_SCENARIOS.length);
  });

  test('Multi-hotel: run 2-night Mon-Tue across additional Las Vegas hotels', async ({ page }) => {
    const scenario = MULTI_NIGHT_SCENARIOS[0]; // 2-night Mon-Tue
    const results: Array<{
      hotel: string;
      hotelId: string;
      success: boolean;
      effectivePct?: number;
      verdict?: string;
      itemPrice?: number;
      discount?: number;
      error?: string;
    }> = [];

    console.log('\n========== MULTI-HOTEL MULTI-NIGHT TEST ==========');
    console.log(`Scenario: ${scenario.label} (15% arrival vs 17.5% per-night)`);
    console.log(`Hotels to test: ${LAS_VEGAS_HOTELS.length}\n`);

    for (const hotel of LAS_VEGAS_HOTELS) {
      const hotelParams = {
        hotel_id: hotel.hotel_id,
        property_id: hotel.property_id,
        room_id: hotel.room_id,
        search_query: hotel.search_query,
        mobile_promotion: 'false',
        longitude: hotel.longitude,
        latitude: hotel.latitude,
        type: hotel.type,
        gds: hotel.gds
      };

      try {
        await bookingEnginePage.gotoHotelBookingWithDates(
          scenario.checkIn,
          scenario.checkOut,
          BOOKING_ENGINE_JWT,
          hotelParams
        );

        const breakdown = await bookingEnginePage.getPriceBreakdown();
        const itemPrice = breakdown.subtotal + breakdown.discount;
        const discountAmount = breakdown.discount;

        if (itemPrice <= 0 || discountAmount < 0) {
          results.push({
            hotel: hotel.name,
            hotelId: hotel.hotel_id,
            success: false,
            error: 'No price/discount found'
          });
          console.log(`  ⚠️ ${hotel.name} (${hotel.hotel_id}): No price found`);
          continue;
        }

        const effectivePct = getEffectiveDiscountPct(itemPrice, discountAmount);
        const matchesA = Math.abs(effectivePct - scenario.arrivalDiscountPct) <= 1;
        const matchesB = Math.abs(effectivePct - scenario.perNightAvgPct) <= 1;
        const verdict = matchesB && !matchesA ? 'per-night ✓' : matchesA && !matchesB ? 'arrival ✓' : matchesA && matchesB ? 'inconclusive' : 'neither';

        results.push({
          hotel: hotel.name,
          hotelId: hotel.hotel_id,
          success: true,
          effectivePct,
          verdict,
          itemPrice,
          discount: discountAmount
        });

        console.log(`  ✓ ${hotel.name} (${hotel.hotel_id}): ${effectivePct}% → ${verdict}`);
        await page.waitForTimeout(500);
      } catch (e: any) {
        results.push({
          hotel: hotel.name,
          hotelId: hotel.hotel_id,
          success: false,
          error: e.message
        });
        console.log(`  ❌ ${hotel.name} (${hotel.hotel_id}): ${e.message}`);
      }
    }

    const successful = results.filter((r) => r.success);
    const perNightCount = successful.filter((r) => r.verdict === 'per-night ✓').length;

    console.log('\n--- Summary ---');
    console.log(`  Successful: ${successful.length}/${results.length} hotels`);
    console.log(`  Per-night model: ${perNightCount}/${successful.length}`);
    console.log('================================================\n');

    expect(successful.length).toBeGreaterThanOrEqual(1);
  });

  test('Search-based: Las Vegas multi-night across hotels from search (travel.tripbeast.com)', async ({ page }) => {
    const ANCILLARY_JWT = process.env.ANCILLARY_JWT ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzY5ODk4NjI0fQ.WrZ3RLvRGZRmDlJF9dJdtO685LDgvITmE1GXPIb6qUg';
    const scenario = MULTI_NIGHT_SCENARIOS[0];
    const BOOKING_ENGINE_URL = 'https://travel.tripbeast.com';

    const results: Array<{ hotel: string; success: boolean; effectivePct?: number; verdict?: string }> = [];
    const maxHotels = 3;

    console.log('\n========== SEARCH-BASED MULTI-HOTEL TEST (travel.tripbeast.com) ==========');
    console.log(`Scenario: ${scenario.label} | Max hotels: ${maxHotels}\n`);

    const searchUrl = `${BOOKING_ENGINE_URL}/?jwt=${ANCILLARY_JWT}&page=hotel&check_in=${scenario.checkIn}&check_out=${scenario.checkOut}&city=Las%20Vegas`;
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.locator('button').filter({ hasText: /close|dismiss|×/i }).first().click().catch(() => {});
    await page.waitForTimeout(4000);

    const selectButtons = page.locator('button:has-text("Select Hotel")');
    const count = await selectButtons.count();
    console.log(`  Found ${count} "Select Hotel" button(s)`);

    for (let i = 0; i < Math.min(count, maxHotels); i++) {
      const btn = selectButtons.nth(i);
      if ((await btn.count()) === 0) break;

      try {
        await btn.click();
        await page.waitForTimeout(5000);

        const bookNow = page.locator('button:has-text("Book Now")').first();
        if ((await bookNow.count()) > 0) {
          await bookNow.click();
          await page.waitForTimeout(5000);
        }

        const hasSummary = await page.locator('text=Summary of Charges').isVisible({ timeout: 8000 }).catch(() => false);
        if (!hasSummary) {
          console.log(`  ⚠️ Hotel ${i + 1}: Could not reach Summary`);
          results.push({ hotel: `Hotel ${i + 1}`, success: false });
          await page.goBack().catch(() => {});
          await page.waitForTimeout(2000);
          continue;
        }

        const bodyText = (await page.textContent('body')) || '';
        const itemPriceMatch = bodyText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
        const discountMatch = bodyText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);

        const itemPrice = itemPriceMatch ? parseFloat(itemPriceMatch[1].replace(/,/g, '')) : 0;
        const discountAmount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
        const gross = itemPrice + discountAmount;
        const effectivePct = gross > 0 ? getEffectiveDiscountPct(gross, discountAmount) : 0;

        const matchesA = Math.abs(effectivePct - scenario.arrivalDiscountPct) <= 1;
        const matchesB = Math.abs(effectivePct - scenario.perNightAvgPct) <= 1;
        const verdict = matchesB && !matchesA ? 'per-night ✓' : matchesA && !matchesB ? 'arrival ✓' : 'neither';

        const nameEl = page.locator('h1, h2, h3').first();
        const hotelName = await nameEl.textContent({ timeout: 2000 }).catch(() => `Hotel ${i + 1}`) || `Hotel ${i + 1}`;

        results.push({ hotel: hotelName.trim().slice(0, 40), success: true, effectivePct, verdict });
        console.log(`  ✓ ${hotelName.trim().slice(0, 35)}: ${effectivePct}% → ${verdict}`);

        await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(3000);
      } catch (e: any) {
        console.log(`  ❌ Hotel ${i + 1}: ${e.message}`);
        results.push({ hotel: `Hotel ${i + 1}`, success: false });
        await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
      }
    }

    const successful = results.filter((r) => r.success);
    console.log(`\n  Successful: ${successful.length}/${results.length}`);
    if (results.length === 0) {
      console.log('  (Search returned no hotels - direct booking flow may be needed)');
    }
    console.log('============================================================\n');

    if (successful.length > 0) {
      expect(successful.every((r) => r.verdict === 'per-night ✓' || r.verdict === 'arrival ✓')).toBeTruthy();
    }
  });
});
