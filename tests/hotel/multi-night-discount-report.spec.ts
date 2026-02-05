import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { BookingEnginePage } from '../pages/BookingEnginePage';
import {
  BOOKING_ENGINE_JWT,
  LAS_VEGAS_HOTELS,
  NEW_YORK_HOTELS,
} from '../helpers/dow-discount-data';

/**
 * Multi-Night Discount Test Report
 * Executes MULTI_NIGHT_DISCOUNT_TEST_PLAN.md against Las Vegas + NY hotels.
 * Takes a screenshot of each non-successful result (fail, inconclusive, ERROR) and embeds in report.
 *
 * Run: npx playwright test multi-night-discount-report.spec.ts --project=chromium
 */

const CUG_BASE = 'https://bookings.tripbeast.com';
const REPORT_PATH = 'MULTI_NIGHT_DISCOUNT_REPORT.md';
const SCREENSHOTS_DIR = 'test-results/hotel/multi-night-report';

// Las Vegas: Longhorn Casino, Hotel 2007; NY: all 4
const LV_HOTELS = LAS_VEGAS_HOTELS.slice(0, 2);
const ALL_HOTELS = [...LV_HOTELS, ...NEW_YORK_HOTELS];

function sanitizeFilename(s: string): string {
  return s.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

const MULTI_NIGHT_SCENARIOS = [
  { checkIn: '2026-03-02', checkOut: '2026-03-04', label: '2-night Mon-Tue', perNightPct: 17.5 },
  { checkIn: '2026-03-05', checkOut: '2026-03-07', label: '2-night Thu-Fri', perNightPct: 32.5 },
  { checkIn: '2026-03-03', checkOut: '2026-03-06', label: '3-night Tue-Thu', perNightPct: 25 },
  { checkIn: '2026-03-04', checkOut: '2026-03-07', label: '3-night Wed-Fri', perNightPct: 30 },
];

function getEffectiveDiscountPct(itemPrice: number, discountAmount: number): number {
  if (itemPrice <= 0) return 0;
  return Math.round((discountAmount / itemPrice) * 100 * 10) / 10;
}

test.describe('Multi-Night Discount Report', () => {
  test('Execute multi-night test plan and generate report', async ({ page }) => {
    test.setTimeout(360000);

    const results: Array<{
      hotel: string;
      propertyId: string;
      scenario: string;
      itemPrice: number;
      discount: number;
      total: number;
      effectivePct: number;
      perNightPct: number;
      verdict: string;
      url: string;
      screenshot?: string;
      error?: string;
    }> = [];

    const screenshotsPath = path.join(process.cwd(), SCREENSHOTS_DIR);
    if (!fs.existsSync(screenshotsPath)) {
      fs.mkdirSync(screenshotsPath, { recursive: true });
    }

    const bookingEnginePage = new BookingEnginePage(page);

    for (const hotel of ALL_HOTELS) {
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

      for (const scenario of MULTI_NIGHT_SCENARIOS) {
        const params = new URLSearchParams({
          checkin: scenario.checkIn,
          checkout: scenario.checkOut,
          adults: '1',
          children: '',
          ...hotelParams,
        } as Record<string, string>);
        const bookingUrl = `${CUG_BASE}/hotel/hotel-booking?${params.toString()}`;

        try {
          await bookingEnginePage.gotoHotelBookingWithDates(
            scenario.checkIn,
            scenario.checkOut,
            BOOKING_ENGINE_JWT,
            hotelParams
          );

          const breakdown = await bookingEnginePage.getPriceBreakdown();
          const gross = breakdown.subtotal + breakdown.discount;
          const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

          const matchesB = Math.abs(effectivePct - scenario.perNightPct) <= 1;
          let verdict: string;
          if (gross <= 0) verdict = 'inconclusive';
          else if (matchesB) verdict = 'pass';
          else verdict = 'fail';

          const screenshotName = `${sanitizeFilename(hotel.name)}_${sanitizeFilename(scenario.label)}.png`;
          let screenshotRelPath: string | undefined;
          if (verdict !== 'pass') {
            const screenshotPath = path.join(screenshotsPath, screenshotName);
            await page.screenshot({ path: screenshotPath, fullPage: true });
            screenshotRelPath = path.join(SCREENSHOTS_DIR, screenshotName);
          }

          results.push({
            hotel: hotel.name,
            propertyId: hotel.property_id,
            scenario: scenario.label,
            itemPrice: gross,
            discount: breakdown.discount,
            total: breakdown.total,
            effectivePct,
            perNightPct: scenario.perNightPct,
            verdict,
            url: bookingUrl,
            screenshot: screenshotRelPath,
          });

          await page.waitForTimeout(300);
        } catch (e) {
          const screenshotName = `${sanitizeFilename(hotel.name)}_${sanitizeFilename(scenario.label)}.png`;
          const screenshotPath = path.join(screenshotsPath, screenshotName);
          try {
            await page.screenshot({ path: screenshotPath, fullPage: true });
          } catch (_) { /* ignore screenshot on error */ }
          results.push({
            hotel: hotel.name,
            propertyId: hotel.property_id,
            scenario: scenario.label,
            itemPrice: 0,
            discount: 0,
            total: 0,
            effectivePct: 0,
            perNightPct: scenario.perNightPct,
            verdict: 'ERROR',
            url: bookingUrl,
            screenshot: path.join(SCREENSHOTS_DIR, screenshotName),
            error: (e as Error).message,
          });
          console.log(`  ERROR: ${hotel.name} ${scenario.label} - ${(e as Error).message}`);
        }
      }
    }

    const passCount = results.filter((r) => r.verdict === 'pass').length;
    const failCount = results.filter((r) => r.verdict === 'fail').length;
    const inconclusiveCount = results.filter((r) => r.verdict === 'inconclusive').length;

    const lines: string[] = [
      '# Multi-Night Discount Test Report',
      '',
      `**Generated:** ${new Date().toISOString()}`,
      `**Engine:** ${CUG_BASE} (CUG / DOW)`,
      `**Plan:** MULTI_NIGHT_DISCOUNT_TEST_PLAN.md`,
      '',
      '## Summary',
      '',
      '| Metric | Value |',
      '|--------|-------|',
      `| Properties tested | ${ALL_HOTELS.map((h) => h.name).join(', ')} |`,
      `| Scenarios per property | 4 (multi-night) |`,
      `| Total scenarios | ${results.length} |`,
      `| Pass (matches per-night model) | ${passCount} |`,
      `| Fail | ${failCount} |`,
      `| Inconclusive (zero rate) | ${inconclusiveCount} |`,
      '',
      '---',
      '',
      '## Configuration',
      '',
      '### JWT Used',
      '```',
      BOOKING_ENGINE_JWT,
      '```',
      '',
      '### Base URL',
      CUG_BASE,
      '',
      '### Properties Tested',
      '',
    ];

    for (const h of ALL_HOTELS) {
      lines.push(`- **${h.name}** – property_id: \`${h.property_id}\`, room_id: \`${h.room_id}\``);
    }
    lines.push('');

    lines.push('---');
    lines.push('');
    lines.push('## Test Results');
    lines.push('');

    for (const r of results) {
      const status = r.error ? `ERROR` : r.verdict;
      lines.push(`### ${r.hotel} — ${r.scenario}`);
      lines.push('');
      lines.push(`| Item Price | Discount | Effective % | Expected % | Verdict |`);
      lines.push(`|------------|----------|-------------|------------|---------|`);
      lines.push(`| $${r.itemPrice.toFixed(2)} | $${r.discount.toFixed(2)} | ${r.effectivePct}% | ${r.perNightPct}% | ${status} |`);
      if (r.verdict !== 'pass' && r.screenshot && fs.existsSync(path.join(process.cwd(), r.screenshot))) {
        lines.push('');
        lines.push(`![${r.hotel} - ${r.scenario} (${status})](${r.screenshot.replace(/\\/g, '/')})`);
      }
      lines.push('');
    }

    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Pass/Fail Rules');
    lines.push('');
    lines.push('- **Pass:** Effective % matches expected per-night blended average (±1%)');
    lines.push('- **Fail:** Effective % does not match expected');
    lines.push('- **Inconclusive:** Zero rate (no price returned)');
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Sample Booking URL');
    lines.push('');
    const sample = results.find((r) => r.itemPrice > 0);
    if (sample) {
      lines.push('```');
      lines.push(`${CUG_BASE}/?jwt=<JWT> then navigate to hotel-booking with params`);
      lines.push(sample.url + '&jwt=<JWT>');
      lines.push('```');
    }
    lines.push('');

    fs.writeFileSync(REPORT_PATH, lines.join('\n'));
    console.log(`\nReport written to ${REPORT_PATH}`);
  });
});
