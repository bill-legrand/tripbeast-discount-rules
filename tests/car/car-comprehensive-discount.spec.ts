import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { CarBookingPage } from '../pages/CarBookingPage';
import {
  CAR_BOOKING_JWT,
  getMarchComprehensiveCarRentalTests,
  getEffectiveDiscountPct,
  getCarOutputBase
} from '../helpers/car-discount-data';

/**
 * Comprehensive Car Rental Discount Test Suite - March Coverage
 * - 1 day: every day in March (31 tests)
 * - 2 day: every day in March (31 tests)
 * - 5 day: 5 random dates in March (5 tests)
 * - 10 day: arriving each Monday in March (5 tests)
 * Total: 72 tests
 *
 * Discount Configuration (Tripbeast Ancillary - Ancii Stage DR):
 * - Mar 1-7: 12% fixed | Mar 8-14: 22% fixed
 * - Mar 15-28: DOW (Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, Sat 5%, Sun 10%)
 * - Mar 29-31: 0% (no discount)
 *
 * Run: npx playwright test car-comprehensive-discount.spec.ts --project=chromium
 */

const REPORT_PATH = 'CAR_COMPREHENSIVE_DISCOUNT_REPORT.md';
const SUITE_NAME = 'comprehensive';
const SCREENSHOT_DIR = getCarOutputBase(SUITE_NAME);
const FAILED_SCREENSHOTS_DIR = getCarOutputBase(SUITE_NAME) + '/failed';

// Tolerance: ±2% for multi-day (rounding); ±1% acceptable for 1-day
const TOLERANCE = 2;

const testCases = getMarchComprehensiveCarRentalTests();

const TEST_CAR_PARAMS = {
  pickup_location: 'Las Vegas Strip',
  // dropoff_location omitted - defaults to same as pickup
  pickup_time: '10:00 AM',
  dropoff_time: '10:00 AM',
  renter_age: '30',
};

test.describe('Car Rental Comprehensive Discount Tests - March (1d, 2d, 5d, 10d)', () => {
  test.setTimeout(120000);
  let carBookingPage: CarBookingPage;
  const reportContent: string[] = [];
  let lastTestResult: { actual: number; expected: number; name: string } | null = null;

  test.beforeAll(async () => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    reportContent.push('# Car Rental Comprehensive Discount Test Report');
    reportContent.push('');
    reportContent.push('**Date:** ' + new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
    reportContent.push('**Test Suite:** March comprehensive (1d×31, 2d×31, 5d×5, 10d×5 = 72 tests)');
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
    reportContent.push('**Location:** Las Vegas Strip');
    reportContent.push('**Tolerance:** ±' + TOLERANCE + '%');
    reportContent.push('');
    reportContent.push('| Date Range | Discount |');
    reportContent.push('|------------|----------|');
    reportContent.push('| Feb 15-21, 2026 | 12% |');
    reportContent.push('| Mar 1-7, 2026 | 12% |');
    reportContent.push('| Mar 8-14, 2026 | 22% |');
    reportContent.push('| Mar 15-28, 2026 | DOW: Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, Sat 5%, Sun 10% |');
    reportContent.push('| Mar 29-31, 2026 | 0% |');
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Test Results');
    reportContent.push('');
  });

  test.beforeEach(async ({ page }) => {
    carBookingPage = new CarBookingPage(page);
  });

  testCases.forEach((tc, idx) => {
    test(`#${idx + 1} ${tc.pickupDate} to ${tc.dropoffDate} (${tc.rentalDays}d): Expect ${tc.expectedDiscount}%`, async ({ page }, testInfo) => {
      try {
      await carBookingPage.gotoCarBookingWithDates(
        tc.pickupDate,
        tc.dropoffDate,
        CAR_BOOKING_JWT,
        TEST_CAR_PARAMS
      );

      const screenshotName = `comprehensive/comprehensive-${tc.pickupDate}-${tc.rentalDays}d`;
      await carBookingPage.screenshotCarBooking(screenshotName, true);

      const breakdown = await carBookingPage.getPriceBreakdown();
      const gross = breakdown.subtotal + breakdown.discount;
      const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

      const diff = Math.abs(effectivePct - tc.expectedDiscount);
      const passed = diff <= TOLERANCE;

      const status = passed ? '✅ PASS' : '❌ FAIL';
      lastTestResult = { actual: effectivePct, expected: tc.expectedDiscount, name: `${tc.pickupDate} → ${tc.dropoffDate} (${tc.rentalDays}d)` };
      console.log(`${status} ${tc.pickupDate} → ${tc.dropoffDate} (${tc.rentalDays}d): Actual ${effectivePct}%, Expected ${tc.expectedDiscount}%, diff: ${diff.toFixed(1)}%`);

      reportContent.push(`### ${tc.pickupDate} to ${tc.dropoffDate} (${tc.rentalDays} days)`);
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
      if (!passed) {
        const pageErrors = await carBookingPage.getPageValidationErrors();
        reportContent.push(`**Page/Validation Error:** ${pageErrors}`);
        reportContent.push(`**Failure Screenshot:** \`${FAILED_SCREENSHOTS_DIR}/fail-${tc.pickupDate}-${tc.rentalDays}d-expect${tc.expectedDiscount}pct.png\``);
      }
      reportContent.push('');
      reportContent.push(`![Screenshot](${SCREENSHOT_DIR}/${screenshotName}.png)`);
      reportContent.push('');
      reportContent.push('---');
      reportContent.push('');

      expect(diff).toBeLessThanOrEqual(TOLERANCE);
      } catch (err) {
        if (!fs.existsSync(FAILED_SCREENSHOTS_DIR)) {
          fs.mkdirSync(FAILED_SCREENSHOTS_DIR, { recursive: true });
        }
        await carBookingPage.dismissModal();
        await page.waitForTimeout(500);
        const failName = `fail-${tc.pickupDate}-${tc.rentalDays}d-expect${tc.expectedDiscount}pct`;
        const failPath = `${FAILED_SCREENSHOTS_DIR}/${failName}.png`;
        await page.screenshot({ path: failPath, fullPage: true });
        await testInfo.attach('failure-screenshot', { path: failPath });
        const errMsg = (err as Error)?.message || String(err);
        const isAssertionFailure = /expect|toBeLessThanOrEqual|AssertionError/i.test(errMsg);
        if (!isAssertionFailure) {
          const pageErrors = await carBookingPage.getPageValidationErrors();
          reportContent.push(`### ${tc.pickupDate} to ${tc.dropoffDate} (${tc.rentalDays} days)`);
          reportContent.push('');
          reportContent.push(`**Status:** ❌ FAIL (exception)`);
          reportContent.push(`**Expected Discount:** ${tc.expectedDiscount}%`);
          reportContent.push(`**Exception:** ${errMsg.substring(0, 300)}`);
          reportContent.push(`**Page/Validation Error:** ${pageErrors}`);
          reportContent.push(`**Failure Screenshot:** ![Screenshot](${failPath})`);
          reportContent.push('');
          reportContent.push('---');
          reportContent.push('');
        }
        lastTestResult = { actual: 0, expected: tc.expectedDiscount, name: `${tc.pickupDate} → ${tc.dropoffDate} (${tc.rentalDays}d)` };
        throw err;
      }
    });
  });

  test.afterEach(async () => {
    if (lastTestResult) {
      fs.writeFileSync(REPORT_PATH, reportContent.join('\n'));
      console.log(`Report generated: ${REPORT_PATH} | Last: Actual ${lastTestResult.actual}%, Expected ${lastTestResult.expected}% (${lastTestResult.name})`);
    }
  });

  test.afterAll(async () => {
    reportContent.push('');
    reportContent.push('## Summary');
    reportContent.push('');
    reportContent.push(`**Total Tests:** ${testCases.length}`);
    reportContent.push(`**Test Date:** ${new Date().toLocaleString()}`);
    reportContent.push('');
    reportContent.push('---');
    reportContent.push('');
    reportContent.push('## Coverage');
    reportContent.push('');
    reportContent.push('- **1-day:** 31 tests (every day in March)');
    reportContent.push('- **2-day:** 31 tests (every day in March)');
    reportContent.push('- **5-day:** 5 tests (random dates: Mar 7, 12, 18, 22, 27)');
    reportContent.push('- **10-day:** 5 tests (Mondays: Mar 2, 9, 16, 23, 30)');
    reportContent.push('');

    fs.writeFileSync(REPORT_PATH, reportContent.join('\n'));
    console.log(`\n✅ Report complete: ${REPORT_PATH}`);
  });
});
