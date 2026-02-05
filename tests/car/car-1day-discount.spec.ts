import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { CarBookingPage } from '../pages/CarBookingPage';
import {
  CAR_BOOKING_JWT,
  getOneDayCarRentalTests,
  getCarDiscountForDate,
  getCarDiscountPeriod,
  getEffectiveDiscountPct,
  getCarOutputBase
} from '../helpers/car-discount-data';

/**
 * Car Rental 1-Day Discount Test Suite
 * Tests all dates in March 2026 for 1-day car rentals
 * 
 * Expected Discounts:
 * - Mar 1-7 (Period 1): 12% fixed
 * - Mar 8-14 (Period 2): 22% fixed
 * - Mar 15-28 (Period 3): DOW-based (Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, Sat 5%, Sun 10%)
 * - Mar 29-31: 0% (no discount configured)
 * 
 * Run: npx playwright test car-1day-discount.spec.ts --project=chromium
 */

const REPORT_PATH = 'CAR_1DAY_DISCOUNT_REPORT.md';
const SUITE_NAME = '1-day';
const SCREENSHOT_DIR = getCarOutputBase(SUITE_NAME);

// Tolerance for discount percentage comparison
const TOLERANCE = 1; // ±1%

// Test data: All 1-day rentals for March 2026
const testCases = getOneDayCarRentalTests();

// NOTE: Car parameters need to be obtained from a car search
// For now, we'll use a placeholder structure that matches the hotel pattern
const TEST_CAR_PARAMS = {
  pickup_location: 'Las Vegas',
  dropoff_location: 'Las Vegas',
  pickup_time: '10:00 AM',
  dropoff_time: '10:00 AM',
  renter_age: '30',
};

test.describe('Car Rental 1-Day Discount Tests - March 2026', () => {
  let carBookingPage: CarBookingPage;
  let reportContent: string[] = [];

  test.beforeAll(async () => {
    // Create screenshot directory
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    // Initialize report
    reportContent.push('# Car Rental 1-Day Discount Test Report');
    reportContent.push('');
    reportContent.push('**Date:** ' + new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    reportContent.push('**Test Suite:** 1-Day Car Rentals');
    reportContent.push('**Total Tests:** ' + testCases.length);
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Test Configuration');
    reportContent.push('');
    reportContent.push('**Discount Rule:** Ancii Stage DR');
    reportContent.push('**Discount Rule ID:** eb511fff-19b8-4a27-91d5-dd8e69f31809');
    reportContent.push('**Customer:** Tripbeast Ancillary');
    reportContent.push('**Booking Engine:** https://travel.tripbeast.com');
    reportContent.push('**JWT:** Tripbeast Ancillary (same as working hotel tests)');
    reportContent.push('**Location:** Las Vegas Strip');
    reportContent.push('**Tolerance:** ±' + TOLERANCE + '%');
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Discount Periods');
    reportContent.push('');
    reportContent.push('| Period | Date Range | Discount Type | Discount |');
    reportContent.push('|--------|------------|---------------|----------|');
    reportContent.push('| Period 1 | Mar 1-7, 2026 | Fixed | 12% |');
    reportContent.push('| Period 2 | Mar 8-14, 2026 | Fixed | 22% |');
    reportContent.push('| Period 3 | Mar 15-28, 2026 | DOW-Based | 5-35% (varies) |');
    reportContent.push('| No Discount | Mar 29-31, 2026 | None | 0% |');
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Test Results');
    reportContent.push('');
  });

  test.beforeEach(async ({ page }) => {
    carBookingPage = new CarBookingPage(page);
  });

  // Group tests by discount period
  test.describe('Period 1: March 1-7, 2026 (12% Fixed Discount)', () => {
    const period1Tests = testCases.filter(tc => 
      tc.pickupDate >= '2026-03-01' && tc.pickupDate <= '2026-03-07'
    );

    for (const tc of period1Tests) {
      test(`${tc.pickupDate} (${tc.day}): Expect 12% discount`, async ({ page }) => {
        await carBookingPage.gotoCarBookingWithDates(
          tc.pickupDate,
          tc.dropoffDate,
          CAR_BOOKING_JWT,
          TEST_CAR_PARAMS
        );

        // Take screenshot
        const screenshotName = `1day-${tc.pickupDate}`;
        await carBookingPage.screenshotCarBooking(screenshotName, true);

        const breakdown = await carBookingPage.getPriceBreakdown();
        const gross = breakdown.subtotal + breakdown.discount;
        const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

        const diff = Math.abs(effectivePct - tc.expectedDiscount);
        const passed = diff <= TOLERANCE;

        // Log result
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const message = `${status} ${tc.pickupDate} (${tc.day}): ${effectivePct}% (expected ${tc.expectedDiscount}%, diff: ${diff.toFixed(1)}%)`;
        console.log(message);

        // Add to report
        reportContent.push(`### ${tc.pickupDate} (${tc.day}) - ${tc.period}`);
        reportContent.push('');
        reportContent.push(`**Status:** ${passed ? '✅ PASS' : '❌ FAIL'}`);
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
  });

  test.describe('Period 2: March 8-14, 2026 (22% Fixed Discount)', () => {
    const period2Tests = testCases.filter(tc => 
      tc.pickupDate >= '2026-03-08' && tc.pickupDate <= '2026-03-14'
    );

    for (const tc of period2Tests) {
      test(`${tc.pickupDate} (${tc.day}): Expect 22% discount`, async ({ page }) => {
        await carBookingPage.gotoCarBookingWithDates(
          tc.pickupDate,
          tc.dropoffDate,
          CAR_BOOKING_JWT,
          TEST_CAR_PARAMS
        );

        const screenshotName = `1day-${tc.pickupDate}`;
        await carBookingPage.screenshotCarBooking(screenshotName, true);

        const breakdown = await carBookingPage.getPriceBreakdown();
        const gross = breakdown.subtotal + breakdown.discount;
        const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

        const diff = Math.abs(effectivePct - tc.expectedDiscount);
        const passed = diff <= TOLERANCE;

        const status = passed ? '✅ PASS' : '❌ FAIL';
        const message = `${status} ${tc.pickupDate} (${tc.day}): ${effectivePct}% (expected ${tc.expectedDiscount}%, diff: ${diff.toFixed(1)}%)`;
        console.log(message);

        reportContent.push(`### ${tc.pickupDate} (${tc.day}) - ${tc.period}`);
        reportContent.push('');
        reportContent.push(`**Status:** ${passed ? '✅ PASS' : '❌ FAIL'}`);
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

  test.describe('Period 3: March 15-28, 2026 (DOW-Based Discount)', () => {
    const period3Tests = testCases.filter(tc => 
      tc.pickupDate >= '2026-03-15' && tc.pickupDate <= '2026-03-28'
    );

    for (const tc of period3Tests) {
      test(`${tc.pickupDate} (${tc.day}): Expect ${tc.expectedDiscount}% discount`, async ({ page }) => {
        await carBookingPage.gotoCarBookingWithDates(
          tc.pickupDate,
          tc.dropoffDate,
          CAR_BOOKING_JWT,
          TEST_CAR_PARAMS
        );

        const screenshotName = `1day-${tc.pickupDate}`;
        await carBookingPage.screenshotCarBooking(screenshotName, true);

        const breakdown = await carBookingPage.getPriceBreakdown();
        const gross = breakdown.subtotal + breakdown.discount;
        const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

        const diff = Math.abs(effectivePct - tc.expectedDiscount);
        const passed = diff <= TOLERANCE;

        const status = passed ? '✅ PASS' : '❌ FAIL';
        const message = `${status} ${tc.pickupDate} (${tc.day}): ${effectivePct}% (expected ${tc.expectedDiscount}%, diff: ${diff.toFixed(1)}%)`;
        console.log(message);

        reportContent.push(`### ${tc.pickupDate} (${tc.day}) - ${tc.period}`);
        reportContent.push('');
        reportContent.push(`**Status:** ${passed ? '✅ PASS' : '❌ FAIL'}`);
        reportContent.push(`**Expected Discount:** ${tc.expectedDiscount}% (${tc.day} DOW)`);
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

  test.describe('No Discount Period: March 29-31, 2026', () => {
    const noDiscountTests = testCases.filter(tc => 
      tc.pickupDate >= '2026-03-29' && tc.pickupDate <= '2026-03-31'
    );

    for (const tc of noDiscountTests) {
      test(`${tc.pickupDate} (${tc.day}): Expect 0% discount`, async ({ page }) => {
        await carBookingPage.gotoCarBookingWithDates(
          tc.pickupDate,
          tc.dropoffDate,
          CAR_BOOKING_JWT,
          TEST_CAR_PARAMS
        );

        const screenshotName = `1day-${tc.pickupDate}`;
        await carBookingPage.screenshotCarBooking(screenshotName, true);

        const breakdown = await carBookingPage.getPriceBreakdown();
        const effectivePct = breakdown.discount > 0 
          ? getEffectiveDiscountPct(breakdown.subtotal + breakdown.discount, breakdown.discount)
          : 0;

        const passed = effectivePct === 0;

        const status = passed ? '✅ PASS' : '❌ FAIL';
        const message = `${status} ${tc.pickupDate} (${tc.day}): ${effectivePct}% (expected 0%)`;
        console.log(message);

        reportContent.push(`### ${tc.pickupDate} (${tc.day}) - No Discount Period`);
        reportContent.push('');
        reportContent.push(`**Status:** ${passed ? '✅ PASS' : '❌ FAIL'}`);
        reportContent.push(`**Expected Discount:** 0%`);
        reportContent.push(`**Actual Discount:** ${effectivePct}%`);
        reportContent.push(`**Net Price:** $${breakdown.subtotal.toFixed(2)}`);
        reportContent.push('');
        reportContent.push(`![Screenshot](${SCREENSHOT_DIR}/${screenshotName}.png)`);
        reportContent.push('');
        reportContent.push('---');
        reportContent.push('');

        expect(effectivePct).toBe(0);
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
    reportContent.push('## Notes');
    reportContent.push('');
    reportContent.push('- This test suite validates 1-day car rentals for all dates in March 2026');
    reportContent.push('- Expected discounts are based on the Ancii Stage DR discount rule configuration');
    reportContent.push('- Period 1 (Mar 1-7): 12% fixed discount');
    reportContent.push('- Period 2 (Mar 8-14): 22% fixed discount');
    reportContent.push('- Period 3 (Mar 15-28): Day-of-week based discounts (5-35%)');
    reportContent.push('- No discount period (Mar 29-31): 0% discount');
    reportContent.push('- Tolerance: ±' + TOLERANCE + '%');
    reportContent.push('');

    fs.writeFileSync(REPORT_PATH, reportContent.join('\n'));
    console.log(`\n✅ Report generated: ${REPORT_PATH}`);
  });
});
