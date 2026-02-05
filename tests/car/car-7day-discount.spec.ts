import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { CarBookingPage } from '../pages/CarBookingPage';
import {
  CAR_BOOKING_JWT,
  getSevenDayCarRentalTests,
  getEffectiveDiscountPct,
  getCarOutputBase
} from '../helpers/car-discount-data';

/**
 * Car Rental 7-Day (1-Week) Discount Test Suite
 * Tests March 1-24, 2026 for 7-day car rentals (24 tests total)
 * 
 * Expected Discounts (blended average of 7 days):
 * - Week entirely in one period: Use that period's discount
 * - Week spanning multiple periods: Average all 7 days
 * 
 * Run: npx playwright test car-7day-discount.spec.ts --project=chromium
 */

const REPORT_PATH = 'CAR_7DAY_DISCOUNT_REPORT.md';
const SUITE_NAME = '7-day';
const SCREENSHOT_DIR = getCarOutputBase(SUITE_NAME);

// Tolerance for discount percentage comparison
const TOLERANCE = 2; // ±2% for multi-day (due to rounding)

// Test data: All 7-day rentals for March 2026
const testCases = getSevenDayCarRentalTests();

const TEST_CAR_PARAMS = {
  pickup_location: 'Las Vegas Strip',
  dropoff_location: 'Las Vegas Strip',
  pickup_time: '10:00',
  dropoff_time: '10:00',
  renter_age: '30',
};

test.describe('Car Rental 7-Day (1-Week) Discount Tests - March 2026', () => {
  let carBookingPage: CarBookingPage;
  let reportContent: string[] = [];

  test.beforeAll(async () => {
    // Create screenshot directory
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    // Initialize report
    reportContent.push('# Car Rental 7-Day (1-Week) Discount Test Report');
    reportContent.push('');
    reportContent.push('**Date:** ' + new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    reportContent.push('**Test Suite:** 7-Day (1-Week) Car Rentals');
    reportContent.push('**Total Tests:** ' + testCases.length);
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Test Configuration');
    reportContent.push('');
    reportContent.push('**Discount Rule:** Ancii Stage DR');
    reportContent.push('**Discount Rule ID:** eb511fff-19b8-4a27-91d5-dd8e69f31809');
    reportContent.push('**Customer:** Tripbeast Ancillary');
    reportContent.push('**Booking Engine:** https://bookings.tripbeast.com');
    reportContent.push('**Location:** Las Vegas Strip');
    reportContent.push('**Rental Duration:** 7 days (1 week)');
    reportContent.push('**Tolerance:** ±' + TOLERANCE + '%');
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Discount Calculation Method');
    reportContent.push('');
    reportContent.push('For 7-day rentals, the discount is calculated as the **average of all 7 days**:');
    reportContent.push('');
    reportContent.push('```');
    reportContent.push('Expected Discount % = (Sum of 7 daily discounts) / 7');
    reportContent.push('```');
    reportContent.push('');
    reportContent.push('**Examples:**');
    reportContent.push('- **Mar 1-7 (all Period 1):** (12×7) / 7 = **12%**');
    reportContent.push('- **Mar 8-14 (all Period 2):** (22×7) / 7 = **22%**');
    reportContent.push('- **Mar 15-21 (all Period 3 DOW):** (5+10+15+20+25+30+35) / 7 = **20%**');
    reportContent.push('- **Mar 5-11 (Period 1+2 mix):** (12+12+12+22+22+22+22) / 7 = **17.7%**');
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Test Results');
    reportContent.push('');
  });

  test.beforeEach(async ({ page }) => {
    carBookingPage = new CarBookingPage(page);
  });

  // Group tests by starting period for better organization
  test.describe('Rentals Starting in Period 1 (Mar 1-7)', () => {
    const period1Tests = testCases.filter(tc => 
      tc.pickupDate >= '2026-03-01' && tc.pickupDate <= '2026-03-07'
    );

    for (const tc of period1Tests) {
      test(`${tc.pickupDate} to ${tc.dropoffDate}: Expect ${tc.expectedDiscount}%`, async ({ page }) => {
        await carBookingPage.gotoCarBookingWithDates(
          tc.pickupDate,
          tc.dropoffDate,
          CAR_BOOKING_JWT,
          TEST_CAR_PARAMS
        );

        const screenshotName = `7day-${tc.pickupDate}-to-${tc.dropoffDate}`;
        await carBookingPage.screenshotCarBooking(screenshotName, true);

        const breakdown = await carBookingPage.getPriceBreakdown();
        const gross = breakdown.subtotal + breakdown.discount;
        const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

        const diff = Math.abs(effectivePct - tc.expectedDiscount);
        const passed = diff <= TOLERANCE;

        const status = passed ? '✅ PASS' : '❌ FAIL';
        const message = `${status} ${tc.pickupDate} → ${tc.dropoffDate}: ${effectivePct}% (expected ${tc.expectedDiscount}%, diff: ${diff.toFixed(1)}%)`;
        console.log(message);

        reportContent.push(`### ${tc.pickupDate} to ${tc.dropoffDate}`);
        reportContent.push('');
        reportContent.push(`**Status:** ${passed ? '✅ PASS' : '❌ FAIL'}`);
        reportContent.push(`**Rental Days:** ${tc.rentalDays}`);
        reportContent.push(`**Daily Breakdown:**`);
        reportContent.push('```');
        reportContent.push(tc.dailyBreakdown);
        reportContent.push('```');
        reportContent.push(`**Expected Discount:** ${tc.expectedDiscount}%`);
        reportContent.push(`**Actual Discount:** ${effectivePct}%`);
        reportContent.push(`**Difference:** ${diff.toFixed(1)}%`);
        reportContent.push(`**Gross Price:** $${gross.toFixed(2)}`);
        reportContent.push(`**Discount Amount:** $${breakdown.discount.toFixed(2)}`);
        reportContent.push(`**Net Price:** $${breakdown.subtotal.toFixed(2)}`);
        reportContent.push('');
        reportContent.push(`![Screenshot](${SCREENSHOT_DIR}/${screenshotName}.png)`);
        reportContent.push('');
        reportContent.push('---');
        reportContent.push('');

        expect(diff).toBeLessThanOrEqual(TOLERANCE);
      });
    }
  });

  test.describe('Rentals Starting in Period 2 (Mar 8-14)', () => {
    const period2Tests = testCases.filter(tc => 
      tc.pickupDate >= '2026-03-08' && tc.pickupDate <= '2026-03-14'
    );

    for (const tc of period2Tests) {
      test(`${tc.pickupDate} to ${tc.dropoffDate}: Expect ${tc.expectedDiscount}%`, async ({ page }) => {
        await carBookingPage.gotoCarBookingWithDates(
          tc.pickupDate,
          tc.dropoffDate,
          CAR_BOOKING_JWT,
          TEST_CAR_PARAMS
        );

        const screenshotName = `7day-${tc.pickupDate}-to-${tc.dropoffDate}`;
        await carBookingPage.screenshotCarBooking(screenshotName, true);

        const breakdown = await carBookingPage.getPriceBreakdown();
        const gross = breakdown.subtotal + breakdown.discount;
        const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

        const diff = Math.abs(effectivePct - tc.expectedDiscount);
        const passed = diff <= TOLERANCE;

        const status = passed ? '✅ PASS' : '❌ FAIL';
        const message = `${status} ${tc.pickupDate} → ${tc.dropoffDate}: ${effectivePct}% (expected ${tc.expectedDiscount}%, diff: ${diff.toFixed(1)}%)`;
        console.log(message);

        reportContent.push(`### ${tc.pickupDate} to ${tc.dropoffDate}`);
        reportContent.push('');
        reportContent.push(`**Status:** ${passed ? '✅ PASS' : '❌ FAIL'}`);
        reportContent.push(`**Rental Days:** ${tc.rentalDays}`);
        reportContent.push(`**Daily Breakdown:**`);
        reportContent.push('```');
        reportContent.push(tc.dailyBreakdown);
        reportContent.push('```');
        reportContent.push(`**Expected Discount:** ${tc.expectedDiscount}%`);
        reportContent.push(`**Actual Discount:** ${effectivePct}%`);
        reportContent.push(`**Difference:** ${diff.toFixed(1)}%`);
        reportContent.push(`**Gross Price:** $${gross.toFixed(2)}`);
        reportContent.push(`**Discount Amount:** $${breakdown.discount.toFixed(2)}`);
        reportContent.push(`**Net Price:** $${breakdown.subtotal.toFixed(2)}`);
        reportContent.push('');
        reportContent.push(`![Screenshot](${SCREENSHOT_DIR}/${screenshotName}.png)`);
        reportContent.push('');
        reportContent.push('---');
        reportContent.push('');

        expect(diff).toBeLessThanOrEqual(TOLERANCE);
      });
    }
  });

  test.describe('Rentals Starting in Period 3 (Mar 15-24)', () => {
    const period3Tests = testCases.filter(tc => 
      tc.pickupDate >= '2026-03-15' && tc.pickupDate <= '2026-03-24'
    );

    for (const tc of period3Tests) {
      test(`${tc.pickupDate} to ${tc.dropoffDate}: Expect ${tc.expectedDiscount}%`, async ({ page }) => {
        await carBookingPage.gotoCarBookingWithDates(
          tc.pickupDate,
          tc.dropoffDate,
          CAR_BOOKING_JWT,
          TEST_CAR_PARAMS
        );

        const screenshotName = `7day-${tc.pickupDate}-to-${tc.dropoffDate}`;
        await carBookingPage.screenshotCarBooking(screenshotName, true);

        const breakdown = await carBookingPage.getPriceBreakdown();
        const gross = breakdown.subtotal + breakdown.discount;
        const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

        const diff = Math.abs(effectivePct - tc.expectedDiscount);
        const passed = diff <= TOLERANCE;

        const status = passed ? '✅ PASS' : '❌ FAIL';
        const message = `${status} ${tc.pickupDate} → ${tc.dropoffDate}: ${effectivePct}% (expected ${tc.expectedDiscount}%, diff: ${diff.toFixed(1)}%)`;
        console.log(message);

        reportContent.push(`### ${tc.pickupDate} to ${tc.dropoffDate}`);
        reportContent.push('');
        reportContent.push(`**Status:** ${passed ? '✅ PASS' : '❌ FAIL'}`);
        reportContent.push(`**Rental Days:** ${tc.rentalDays}`);
        reportContent.push(`**Daily Breakdown:**`);
        reportContent.push('```');
        reportContent.push(tc.dailyBreakdown);
        reportContent.push('```');
        reportContent.push(`**Expected Discount:** ${tc.expectedDiscount}%`);
        reportContent.push(`**Actual Discount:** ${effectivePct}%`);
        reportContent.push(`**Difference:** ${diff.toFixed(1)}%`);
        reportContent.push(`**Gross Price:** $${gross.toFixed(2)}`);
        reportContent.push(`**Discount Amount:** $${breakdown.discount.toFixed(2)}`);
        reportContent.push(`**Net Price:** $${breakdown.subtotal.toFixed(2)}`);
        reportContent.push('');
        reportContent.push(`![Screenshot](${SCREENSHOT_DIR}/${screenshotName}.png)`);
        reportContent.push('');
        reportContent.push('---');
        reportContent.push('');

        expect(diff).toBeLessThanOrEqual(TOLERANCE);
      });
    }
  });

  test.afterAll(async () => {
    // Write report to file
    reportContent.push('');
    reportContent.push('## Summary');
    reportContent.push('');
    reportContent.push(`**Total Tests:** ${testCases.length}`);
    reportContent.push(`**Test Date:** ${new Date().toLocaleString()}`);
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Key Test Scenarios');
    reportContent.push('');
    reportContent.push('### Single Period Weeks');
    reportContent.push('- **Mar 1-7:** All 7 days in Period 1 (12%) → **12% average**');
    reportContent.push('- **Mar 8-14:** All 7 days in Period 2 (22%) → **22% average**');
    reportContent.push('- **Mar 15-21:** Full week in Period 3 (DOW: Sat→Fri) → **20% average**');
    reportContent.push('  - Sat 5%, Sun 10%, Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%');
    reportContent.push('  - Average: (5+10+15+20+25+30+35) / 7 = 20%');
    reportContent.push('');
    reportContent.push('### Cross-Period Weeks');
    reportContent.push('- **Mar 5-11:** 3 days Period 1 (12%) + 4 days Period 2 (22%)');
    reportContent.push('  - (12+12+12+22+22+22+22) / 7 = **17.7% average**');
    reportContent.push('- **Mar 12-18:** 3 days Period 2 (22%) + 4 days Period 3 (DOW)');
    reportContent.push('  - Period 2: 22%, 22%, 22%');
    reportContent.push('  - Period 3: Sat 5%, Sun 10%, Mon 15%, Tue 20%');
    reportContent.push('  - Average calculated from all 7 days');
    reportContent.push('');
    reportContent.push('### Weeks Ending in No-Discount Period');
    reportContent.push('- **Mar 24-30:** 5 days Period 3 (DOW) + 2 days No Discount (0%)');
    reportContent.push('  - Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, No discount 0%, 0%');
    reportContent.push('  - Average: (15+20+25+30+35+0+0) / 7 = **17.9% average**');
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Discount Period Summary');
    reportContent.push('');
    reportContent.push('| Period | Date Range | Discount | Full Week Average |');
    reportContent.push('|--------|------------|----------|-------------------|');
    reportContent.push('| Period 1 | Mar 1-7 | 12% fixed | 12% |');
    reportContent.push('| Period 2 | Mar 8-14 | 22% fixed | 22% |');
    reportContent.push('| Period 3 | Mar 15-28 | DOW-based (5-35%) | 20% (full DOW week) |');
    reportContent.push('| No Discount | Mar 29-31 | 0% | 0% |');
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Notes');
    reportContent.push('');
    reportContent.push('- This test suite validates 7-day car rentals starting from Mar 1 through Mar 24, 2026');
    reportContent.push('- Expected discounts use per-day model: average of all 7 rental days');
    reportContent.push('- Tolerance: ±' + TOLERANCE + '% (higher than 1-day due to rounding in multi-day calculations)');
    reportContent.push('- Cross-period rentals blend discounts from all periods touched');
    reportContent.push('- DOW period weeks have interesting patterns based on which days are included');
    reportContent.push('- A full DOW week (Sat-Fri) averages to 20%');
    reportContent.push('- Weeks ending in no-discount period will have lower averages');
    reportContent.push('');

    fs.writeFileSync(REPORT_PATH, reportContent.join('\n'));
    console.log(`\n✅ Report generated: ${REPORT_PATH}`);
  });
});
