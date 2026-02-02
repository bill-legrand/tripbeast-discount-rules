import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { BookingEnginePage } from './pages/BookingEnginePage';
import { NEW_YORK_HOTELS } from './helpers/dow-discount-data';

/**
 * NY Discount Test Suite
 * Runs full discount scenarios against 2 New York hotels on travel.tripbeast.com (Ancillary).
 * Generates NY_DISCOUNT_TEST_REPORT.md with URLs, JWT, properties, and results.
 *
 * Run: npx playwright test dow-discount-report-ny.spec.ts --project=chromium
 * Or: .\run-tests.ps1 dow-discount-report-ny.spec.ts
 */

const ANCILLARY_BASE = 'https://travel.tripbeast.com';
const REPORT_PATH = 'NY_DISCOUNT_TEST_REPORT.md';

// Fresh Ancillary JWT - regenerate with: node generate-jwt-ancillary.js
// Ensure we use only the token (3 base64 segments), not URL-embedded with extra params
function sanitizeJwt(raw: string): string {
  const part = raw.split('&')[0].trim();
  return /^eyJ[\w\-=.]+\.eyJ[\w\-=.]+\.[\w\-=]+$/.test(part) ? part : raw;
}
const ANCILLARY_JWT = sanitizeJwt(process.env.ANCILLARY_JWT ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzY5OTg1Mjk5fQ.eLKwEiJ8qWJyo67F5YNvdtIclMoz9JcPkhdUumH9TPU');

const ALL_SCENARIOS = [
  { checkIn: '2026-03-02', checkOut: '2026-03-03', label: '1N Mon' },
  { checkIn: '2026-03-03', checkOut: '2026-03-04', label: '1N Tue' },
  { checkIn: '2026-03-04', checkOut: '2026-03-05', label: '1N Wed' },
  { checkIn: '2026-03-05', checkOut: '2026-03-06', label: '1N Thu' },
  { checkIn: '2026-03-06', checkOut: '2026-03-07', label: '1N Fri' },
  { checkIn: '2026-03-07', checkOut: '2026-03-08', label: '1N Sat' },
  { checkIn: '2026-03-08', checkOut: '2026-03-09', label: '1N Sun' },
  { checkIn: '2026-03-01', checkOut: '2026-03-02', label: '1N Mar 1 (shoulder)' },
  { checkIn: '2026-03-09', checkOut: '2026-03-10', label: '1N Mar 9 (shoulder)' },
  { checkIn: '2026-03-02', checkOut: '2026-03-04', label: '2N Mon-Tue' },
  { checkIn: '2026-03-03', checkOut: '2026-03-06', label: '3N Tue-Thu' },
  { checkIn: '2026-03-02', checkOut: '2026-03-09', label: '7N full week' },
];

function getEffectiveDiscountPct(itemPrice: number, discountAmount: number): number {
  if (itemPrice <= 0) return 0;
  return Math.round((discountAmount / itemPrice) * 100 * 10) / 10;
}

test.describe('NY Discount Test Suite', () => {
  test('Run full discount suite on NY hotels and generate report', async ({ page }) => {
    test.setTimeout(360000);

    const results: Array<{
      hotel: string;
      hotelId: string;
      propertyId: string;
      scenario: string;
      checkIn: string;
      checkOut: string;
      itemPrice: number;
      discount: number;
      total: number;
      effectivePct: number;
      url: string;
      error?: string;
    }> = [];

    const bookingEnginePage = new BookingEnginePage(page);

    for (const hotel of NEW_YORK_HOTELS) {
      const hotelParams = {
        search_query: hotel.search_query,
        hotel_id: hotel.hotel_id,
        checkin: '',
        checkout: '',
        adults: '1',
        children: '',
        property_id: hotel.property_id,
        room_id: hotel.room_id,
        mobile_promotion: 'false',
        longitude: hotel.longitude,
        latitude: hotel.latitude,
        type: hotel.type,
        gds: hotel.gds,
      };

      for (const scenario of ALL_SCENARIOS) {
        hotelParams.checkin = scenario.checkIn;
        hotelParams.checkout = scenario.checkOut;

        const params = new URLSearchParams(hotelParams as Record<string, string>);
        const bookingUrl = `${ANCILLARY_BASE}/hotel/hotel-booking?${params.toString()}`;
        const fullUrl = `${ANCILLARY_BASE}/?jwt=${ANCILLARY_JWT}`;

        try {
          // Auth first
          await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(1000);

          // Then go to booking
          await page.goto(bookingUrl, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(2500);

          const breakdown = await bookingEnginePage.getPriceBreakdown();
          const gross = breakdown.subtotal + breakdown.discount;
          const effectivePct = getEffectiveDiscountPct(gross, breakdown.discount);

          results.push({
            hotel: hotel.name,
            hotelId: hotel.hotel_id,
            propertyId: hotel.property_id,
            scenario: scenario.label,
            checkIn: scenario.checkIn,
            checkOut: scenario.checkOut,
            itemPrice: gross,
            discount: breakdown.discount,
            total: breakdown.total,
            effectivePct,
            url: bookingUrl,
          });

          await page.waitForTimeout(200);
        } catch (e) {
          results.push({
            hotel: hotel.name,
            hotelId: hotel.hotel_id,
            propertyId: hotel.property_id,
            scenario: scenario.label,
            checkIn: scenario.checkIn,
            checkOut: scenario.checkOut,
            itemPrice: 0,
            discount: 0,
            total: 0,
            effectivePct: 0,
            url: bookingUrl,
            error: (e as Error).message,
          });
          console.log(`  ERROR: ${hotel.name} ${scenario.label} - ${(e as Error).message}`);
        }
      }
    }

    // Generate report
    const lines: string[] = [
      '# New York Discount Test Report',
      '',
      `**Generated:** ${new Date().toISOString()}`,
      `**Engine:** ${ANCILLARY_BASE} (Ancillary)`,
      '',
      '---',
      '',
      '## Configuration',
      '',
      '### JWT Used',
      '```',
      ANCILLARY_JWT,
      '```',
      '',
      '### Base URL',
      `${ANCILLARY_BASE}`,
      '',
      '### Auth URL (JWT in query)',
      `${ANCILLARY_BASE}/?jwt=${ANCILLARY_JWT.substring(0, 50)}...`,
      '',
      '### Properties Tested',
      '',
    ];

    for (const h of NEW_YORK_HOTELS) {
      lines.push(`- **${h.name}**`);
      lines.push(`  - hotel_id: \`${h.hotel_id}\``);
      lines.push(`  - property_id: \`${h.property_id}\``);
      lines.push(`  - room_id: \`${h.room_id}\``);
      lines.push(`  - search_query: ${h.search_query}`);
      lines.push('');
    }

    lines.push('---');
    lines.push('');
    lines.push('## Test Results');
    lines.push('');
    lines.push('| Hotel | Scenario | Check-In | Item Price | Discount | Total | Effective % | Status |');
    lines.push('|-------|----------|----------|------------|----------|-------|-------------|--------|');

    for (const r of results) {
      const status = r.error ? `ERROR: ${r.error.substring(0, 30)}...` : 'OK';
      lines.push(`| ${r.hotel} | ${r.scenario} | ${r.checkIn} | $${r.itemPrice.toFixed(2)} | $${r.discount.toFixed(2)} | $${r.total.toFixed(2)} | ${r.effectivePct}% | ${status} |`);
    }

    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Sample Booking URLs');
    lines.push('');
    lines.push('### Full URL Format');
    lines.push('Authenticate first: `' + ANCILLARY_BASE + '/?jwt=<JWT>`');
    lines.push('Then navigate to booking, or append JWT: `' + ANCILLARY_BASE + '/hotel/hotel-booking?jwt=<JWT>&...params...`');
    lines.push('');
    for (const h of NEW_YORK_HOTELS) {
      const r = results.find((res) => res.propertyId === h.property_id);
      if (r) {
        lines.push(`### ${h.name} (property_id ${h.property_id})`);
        lines.push(`\`\`\``);
        lines.push(r.url + '&jwt=' + ANCILLARY_JWT);
        lines.push(`\`\`\``);
        lines.push('');
      }
    }

    fs.writeFileSync(REPORT_PATH, lines.join('\n'));
    console.log(`\nReport written to ${REPORT_PATH}`);
  });
});
