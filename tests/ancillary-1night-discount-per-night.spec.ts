import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { DISCOUNT_NIGHTS, DiscountNight } from './helpers/ancillary-discount-nights';

/**
 * Test: 1-night stays for each night with discount rules
 *
 * Runs a 1-night stay booking test for every night that has a discount configured:
 * - Feb 1-2: 10%
 * - Feb 15-21: 12%
 * - Feb 22-28: DOW (Sun 15%, Mon 20%, Tue 25%, Wed 30%, Thu 35%, Fri 40%, Sat 10%)
 *
 * Verifies hotel search loads and (when flow completes) discount appears correctly.
 *
 * Run: npx playwright test ancillary-1night-discount-per-night.spec.ts
 * Run single: npx playwright test ancillary-1night-discount-per-night.spec.ts -g "Feb 15"
 */

const BOOKING_ENGINE_URL = 'https://travel.tripbeast.com';
const JWT_WITH_DISCOUNT_RULE =
  process.env.ANCILLARY_JWT ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzY5ODk4NjI0fQ.WrZ3RLvRGZRmDlJF9dJdtO685LDgvITmE1GXPIb6qUg';

async function run1NightBookingFlow(page: Page, night: DiscountNight) {
  const searchUrl = `${BOOKING_ENGINE_URL}/?jwt=${JWT_WITH_DISCOUNT_RULE}&page=hotel&check_in=${night.checkIn}&check_out=${night.checkOut}&city=Las%20Vegas`;
  await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });

  await page.locator('button').filter({ hasText: /close|dismiss|×/i }).first().click().catch(() => {});

  await page.locator('button:has-text("Select Hotel")').first().waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const selectHotel = page.locator('button:has-text("Select Hotel")').first();
  if ((await selectHotel.count()) === 0) {
    return { itemPrice: 0, discountAmount: 0, total: 0, reachedSummary: false };
  }
  await selectHotel.click();
  await page.waitForTimeout(5000);

  const bookNow = page.locator('button:has-text("Book Now")').first();
  if ((await bookNow.count()) === 0) {
    return { itemPrice: 0, discountAmount: 0, total: 0, reachedSummary: false };
  }
  await bookNow.click();
  await page.waitForTimeout(5000);

  const summaryVisible = await page.waitForSelector('text=Summary of Charges', { timeout: 15000 }).catch(() => null);
  if (!summaryVisible) {
    return { itemPrice: 0, discountAmount: 0, total: 0, reachedSummary: false };
  }

  const bodyText = (await page.textContent('body')) || '';
  const itemPriceMatch = bodyText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
  const discountMatch = bodyText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
  const totalMatch = bodyText.match(/(?:Total\s+Price|Total)[:\s]+\$?([\d,]+\.?\d*)/i);

  const itemPrice = itemPriceMatch ? parseFloat(itemPriceMatch[1].replace(/,/g, '')) : 0;
  const discountAmount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
  const total = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0;

  return { itemPrice, discountAmount, total, reachedSummary: true };
}

test.describe('Ancillary 1-Night Discount Per Night', () => {
  for (const night of DISCOUNT_NIGHTS) {
    test(`${night.label}: 1-night stay ${night.checkIn} should apply ${night.expectedDiscountPct}% discount`, async ({
      page,
    }) => {
      const result = await run1NightBookingFlow(page, night);

      if (!result.reachedSummary) {
        console.log(`⚠️ ${night.label}: Could not reach Summary of Charges; search/hotel flow may need manual check.`);
        await page.screenshot({
          path: `test-results/ancillary-1night-${night.checkIn.replace(/-/g, '')}.png`,
          fullPage: true,
        });
        expect(result.reachedSummary).toBe(true);
        return;
      }

      console.log(`${night.label} - Item Price: $${result.itemPrice}, Discount: $${result.discountAmount}, Total: $${result.total}`);

      expect(result.discountAmount).toBeGreaterThan(0);

      if (result.itemPrice > 0 && result.discountAmount > 0) {
        const subtotalBeforeDiscount = result.itemPrice + result.discountAmount;
        const calculatedPct = Math.round((result.discountAmount / subtotalBeforeDiscount) * 100);
        expect(calculatedPct).toBe(night.expectedDiscountPct);
      }
    });
  }
});
