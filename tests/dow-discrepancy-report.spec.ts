import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { BookingEnginePage } from './pages/BookingEnginePage';
import {
  BOOKING_ENGINE_JWT,
  LAS_VEGAS_HOTELS,
} from './helpers/dow-discount-data';

/**
 * DOW Discrepancy Report
 * Runs all discount scenarios with 1% tolerance. Any result >1% off expected = discrepancy.
 * Screenshots every discrepancy. Generates DISCREPANCY_REPORT.md with embedded screenshots.
 * Runs against 2 properties if available.
 *
 * Run: npx playwright test dow-discrepancy-report.spec.ts
 */

const DISCREPANCY_TOLERANCE = 1;
const DISCREPANCY_DIR = 'test-results/discrepancy-screenshots';
const REPORT_PATH = 'DISCREPANCY_REPORT.md';

function getEffectiveDiscountPct(itemPrice: number, discountAmount: number): number {
  if (itemPrice <= 0) return 0;
  return Math.round((discountAmount / itemPrice) * 100 * 10) / 10;
}

const ALL_SCENARIOS = [
  // Single nights Mar 2-8
  { checkIn: '2026-03-02', checkOut: '2026-03-03', label: '1N Mon', expected: 15 },
  { checkIn: '2026-03-03', checkOut: '2026-03-04', label: '1N Tue', expected: 20 },
  { checkIn: '2026-03-04', checkOut: '2026-03-05', label: '1N Wed', expected: 25 },
  { checkIn: '2026-03-05', checkOut: '2026-03-06', label: '1N Thu', expected: 30 },
  { checkIn: '2026-03-06', checkOut: '2026-03-07', label: '1N Fri', expected: 35 },
  { checkIn: '2026-03-07', checkOut: '2026-03-08', label: '1N Sat', expected: 40 },
  { checkIn: '2026-03-08', checkOut: '2026-03-09', label: '1N Sun', expected: 10 },
  // Shoulders (expect 0%)
  { checkIn: '2026-03-01', checkOut: '2026-03-02', label: '1N Mar 1 (before)', expected: 0 },
  { checkIn: '2026-03-09', checkOut: '2026-03-10', label: '1N Mar 9 (after)', expected: 0 },
  // Multi-night
  { checkIn: '2026-03-02', checkOut: '2026-03-04', label: '2N Mon-Tue', expected: 17.5 },
  { checkIn: '2026-03-03', checkOut: '2026-03-06', label: '3N Tue-Thu', expected: 25 },
  { checkIn: '2026-03-04', checkOut: '2026-03-07', label: '3N Wed-Fri', expected: 30 },
  { checkIn: '2026-03-05', checkOut: '2026-03-08', label: '4N Thu-Sun', expected: 28.75 },
  { checkIn: '2026-03-02', checkOut: '2026-03-09', label: '7N full week', expected: 25 },
  { checkIn: '2026-03-01', checkOut: '2026-03-04', label: '3N Sun+Mon+Tue', expected: 11.67 },
  { checkIn: '2026-03-07', checkOut: '2026-03-10', label: '3N Sat+Sun+Mon', expected: 16.67 },
  { checkIn: '2026-02-28', checkOut: '2026-03-03', label: '4N 2before+Mon+Tue', expected: 8.75 },
];

function isDiscrepancy(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) > DISCREPANCY_TOLERANCE;
}

test.describe('DOW Discrepancy Report', () => {
  test('Run all scenarios across properties and generate discrepancy report', async ({ page }) => {
    test.setTimeout(300000);

    const hotelsToTest = LAS_VEGAS_HOTELS.slice(0, 2);
    const discrepancies: Array<{
      hotel: string;
      hotelId: string;
      scenario: string;
      expected: number;
      actual: number;
      diff: number;
      screenshotPath: string;
    }> = [];

    fs.mkdirSync(DISCREPANCY_DIR, { recursive: true });

    const bookingEnginePage = new BookingEnginePage(page);

    for (const hotel of hotelsToTest) {
      const hotelParams = {
        hotel_id: hotel.hotel_id,
        property_id: hotel.property_id,
        room_id: hotel.room_id,
        search_query: hotel.search_query,
        mobile_promotion: 'false',
        longitude: hotel.longitude,
        latitude: hotel.latitude,
        type: hotel.type,
        gds: hotel.gds,
      };

      for (const scenario of ALL_SCENARIOS) {
        try {
          await bookingEnginePage.gotoHotelBookingWithDates(
            scenario.checkIn,
            scenario.checkOut,
            BOOKING_ENGINE_JWT,
            hotelParams
          );

          const breakdown = await bookingEnginePage.getPriceBreakdown();
          const gross = breakdown.subtotal + breakdown.discount;
          const actual = getEffectiveDiscountPct(gross, breakdown.discount);

          if (isDiscrepancy(actual, scenario.expected)) {
            const safeName = `${hotel.hotel_id}-${scenario.label.replace(/[^a-zA-Z0-9]/g, '-')}-${scenario.checkIn}`;
            const screenshotPath = path.join(DISCREPANCY_DIR, `${safeName}.png`);

            await page.screenshot({ path: screenshotPath, fullPage: true });

            discrepancies.push({
              hotel: hotel.name,
              hotelId: hotel.hotel_id,
              scenario: scenario.label,
              expected: scenario.expected,
              actual,
              diff: Math.round((actual - scenario.expected) * 10) / 10,
              screenshotPath: path.relative(process.cwd(), screenshotPath),
            });

            console.log(`  DISCREPANCY: ${hotel.name} | ${scenario.label}: expected ${scenario.expected}%, got ${actual}%`);
          }

          await page.waitForTimeout(300);
        } catch (e) {
          console.log(`  SKIP: ${hotel.name} ${scenario.label} - ${(e as Error).message}`);
        }
      }
    }

    // Generate report
    const lines: string[] = [
      '# DOW Discount Discrepancy Report',
      '',
      `**Generated:** ${new Date().toISOString()}`,
      `**Tolerance:** ${DISCREPANCY_TOLERANCE}% (discrepancy = more than 1% off expected)`,
      `**Properties tested:** ${hotelsToTest.map((h) => h.name).join(', ')}`,
      '',
      '---',
      '',
    ];

    if (discrepancies.length === 0) {
      lines.push('## No discrepancies found');
      lines.push('');
      lines.push('All discount percentages were within 1% of expected.');
    } else {
      lines.push(`## Discrepancies (${discrepancies.length} total)`);
      lines.push('');
      lines.push('| Hotel | Scenario | Expected | Actual | Diff | Screenshot |');
      lines.push('|-------|----------|----------|--------|------|------------|');

      for (const d of discrepancies) {
        const relPath = d.screenshotPath.replace(/\\/g, '/');
        lines.push(`| ${d.hotel} | ${d.scenario} | ${d.expected}% | ${d.actual}% | ${d.diff > 0 ? '+' : ''}${d.diff}% | ![screenshot](${relPath}) |`);
      }

      lines.push('');
      lines.push('---');
      lines.push('');
      lines.push('## Screenshots');
      lines.push('');

      for (const d of discrepancies) {
        const relPath = d.screenshotPath.replace(/\\/g, '/');
        lines.push(`### ${d.hotel} - ${d.scenario} (expected ${d.expected}%, actual ${d.actual}%)`);
        lines.push('');
        lines.push(`![${d.scenario}](${relPath})`);
        lines.push('');
      }
    }

    fs.writeFileSync(REPORT_PATH, lines.join('\n'));
    console.log(`\nReport written to ${REPORT_PATH}`);
  });
});
