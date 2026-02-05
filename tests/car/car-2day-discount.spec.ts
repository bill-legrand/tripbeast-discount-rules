import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { CarBookingPage } from '../pages/CarBookingPage';
import {
  CAR_BOOKING_JWT,
  getTwoDayCarRentalTests,
  getEffectiveDiscountPct,
  getCarOutputBase
} from '../helpers/car-discount-data';

/**
 * Car Rental 2-Day Discount Test Suite
 * Tests March 1-29, 2026 for 2-day car rentals (29 tests total)
 * 
 * Expected Discounts (blended average of 2 days):
 * - Single period rentals: Use period discount
 * - Cross-period rentals: Average of both days
 * 
 * Run: npx playwright test car-2day-discount.spec.ts --project=chromium
 */

const REPORT_PATH = 'CAR_2DAY_DISCOUNT_REPORT.md';
const SUITE_NAME = '2-day';
const SCREENSHOT_DIR = getCarOutputBase(SUITE_NAME);

// Tolerance for discount percentage comparison
const TOLERANCE = 2; // ±2% for multi-day (due to rounding)

// Test data: All 2-day rentals for March 2026
const testCases = getTwoDayCarRentalTests();

const TEST_CAR_PARAMS = {
  pickup_location: 'Las Vegas Strip',
  dropoff_location: 'Las Vegas Strip',
  pickup_time: '10:00',
  dropoff_time: '10:00',
  renter_age: '30',
};

test.describe('Car Rental 2-Day Discount Tests - March 2026', () => {
  let carBookingPage: CarBookingPage;
  let reportContent: string[] = [];

  test.beforeAll(async () => {
    // Create screenshot directory
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    // Initialize report
    reportContent.push('# Car Rental 2-Day Discount Test Report');
    reportContent.push('');
    reportContent.push('**Date:** ' + new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    reportContent.push('**Test Suite:** 2-Day Car Rentals');
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
    reportContent.push('**Tolerance:** ±' + TOLERANCE + '%');
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Discount Calculation Method');
    reportContent.push('');
    reportContent.push('For 2-day rentals, the discount is calculated as the **average of both days**:');
    reportContent.push('');
    reportContent.push('```');
    reportContent.push('Expected Discount % = (Day 1 Discount % + Day 2 Discount %) / 2');
    reportContent.push('```');
    reportContent.push('');
    reportContent.push('**Examples:**');
    reportContent.push('- Mar 1-2 (both in Period 1): (12% + 12%) / 2 = **12%**');
    reportContent.push('- Mar 7-8 (Period 1 → Period 2): (12% + 22%) / 2 = **17%**');
    reportContent.push('- Mar 14-15 (Period 2 → Period 3): (22% + 5% Sat) / 2 = **13.5%**');
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Test Results');
    reportContent.push('');
  });

  test.beforeEach(async ({ page }) => {
    carBookingPage = new CarBookingPage(page);
  });

  for (const tc of testCases) {
    test(`${tc.pickupDate} to ${tc.dropoffDate}: Expect ${tc.expectedDiscount}%`, async ({ page }) => {
      await carBookingPage.gotoCarBookingWithDates(
        tc.pickupDate,
        tc.dropoffDate,
        CAR_BOOKING_JWT,
        TEST_CAR_PARAMS
      );

      // Take screenshot
      const screenshotName = `2day-${tc.pickupDate}-to-${tc.dropoffDate}`;
      await carBookingPage.screenshotCarBooking(`${SCREENSHOT_DIR}/${screenshotName}.png`, true);

      const breakdown = await carBookingPage.getPriceBreakdown();
      const gross = breakdown.subtotal + breakdown.discount;
      const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

      const diff = Math.abs(effectivePct - tc.expectedDiscount);
      const passed = diff <= TOLERANCE;

      // Log result
      const status = passed ? '✅ PASS' : '❌ FAIL';
      const message = `${status} ${tc.pickupDate} → ${tc.dropoffDate}: ${effectivePct}% (expected ${tc.expectedDiscount}%, diff: ${diff.toFixed(1)}%)`;
      console.log(message);

      // Add to report
      reportContent.push(`### ${tc.pickupDate} to ${tc.dropoffDate}`);
      reportContent.push('');
      reportContent.push(`**Status:** ${passed ? '✅ PASS' : '❌ FAIL'}`);
      reportContent.push(`**Rental Days:** ${tc.rentalDays}`);
      reportContent.push(`**Daily Breakdown:** ${tc.dailyBreakdown}`);
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

      // Assertion
      expect(diff).toBeLessThanOrEqual(TOLERANCE);
    });
  }

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
    reportContent.push('### Single Period Rentals');
    reportContent.push('- **Mar 1-2, Mar 2-3, ..., Mar 6-7:** All days in Period 1 (12%) → **12% average**');
    reportContent.push('- **Mar 8-9, Mar 9-10, ..., Mar 13-14:** All days in Period 2 (22%) → **22% average**');
    reportContent.push('- **Mar 15-16, Mar 16-17, ..., Mar 27-28:** All days in Period 3 (DOW) → **Varies by days**');
    reportContent.push('');
    reportContent.push('### Cross-Period Rentals');
    reportContent.push('- **Mar 7-8:** Period 1 (12%) → Period 2 (22%) = **17% average**');
    reportContent.push('- **Mar 14-15:** Period 2 (22%) → Period 3 (5% Sat) = **13.5% average**');
    reportContent.push('- **Mar 28-29:** Period 3 (35% Fri) → No discount (0%) = **17.5% average**');
    reportContent.push('');
    reportContent.push('### DOW Period Rentals (Period 3)');
    reportContent.push('Examples of DOW-based 2-day averages:');
    reportContent.push('- **Mar 15-16 (Sat+Sun):** (5% + 10%) / 2 = **7.5%**');
    reportContent.push('- **Mar 17-18 (Mon+Tue):** (15% + 20%) / 2 = **17.5%**');
    reportContent.push('- **Mar 19-20 (Wed+Thu):** (25% + 30%) / 2 = **27.5%**');
    reportContent.push('- **Mar 21-22 (Fri+Sat):** (35% + 5%) / 2 = **20%**');
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Notes');
    reportContent.push('');
    reportContent.push('- This test suite validates 2-day car rentals starting from Mar 1 through Mar 29, 2026');
    reportContent.push('- Expected discounts use per-day model: average of both rental days');
    reportContent.push('- Tolerance: ±' + TOLERANCE + '% (higher than 1-day due to rounding in multi-day calculations)');
    reportContent.push('- Cross-period rentals blend discounts from both periods');
    reportContent.push('- DOW period rentals vary based on specific days of the week');
    reportContent.push('');

    fs.writeFileSync(REPORT_PATH, reportContent.join('\n'));
    console.log(`\n✅ Report generated: ${REPORT_PATH}`);
  });
});
