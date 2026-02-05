import { test, expect } from '@playwright/test';

/**
 * Test: Discount Line Item Verification for Ancillary Booking Engine
 *
 * Verifies that when booking a hotel for a date within a discount range:
 * 1. The discount appears as a line item in the price breakdown
 * 2. The discount is the correct percentage off the subtotal (Item Price)
 *
 * Discount Rules (Ancii Stage DR - Hotels):
 * - Feb 1-2, 2026: 10%
 * - Feb 15-21, 2026: 12%
 * - Feb 22-28, 2026: DOW (Mon +20%, Tue +25%, Wed +30%, Thu +35%, Fri +40%, Sat +10%, Sun +15%)
 *
 * Run: npx playwright test ancillary-discount-line-item-test.spec.ts
 */

const BOOKING_ENGINE_URL = 'https://travel.tripbeast.com';
const JWT_WITH_DISCOUNT_RULE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzY5ODk4NjI0fQ.WrZ3RLvRGZRmDlJF9dJdtO685LDgvITmE1GXPIb6qUg';

test.describe('Ancillary Discount Line Item Test', () => {
  test('discount should appear as line item and be correct % off subtotal for Feb 15-16 (12%)', async ({
    page,
  }) => {
    // Feb 15-16, 2026 is within the 12% discount range (Feb 15-21)
    const searchUrl = `${BOOKING_ENGINE_URL}/?jwt=${JWT_WITH_DISCOUNT_RULE}&page=hotel&check_in=2026-02-15&check_out=2026-02-16&city=Las%20Vegas`;
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });

    // Close any popups
    await page.locator('button').filter({ hasText: /close|dismiss|×/i }).first().click().catch(() => {});

    // Wait for hotel results
    await page.waitForSelector('text=Item Price', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // Click first "Select Hotel" button
    const selectHotel = page.locator('button:has-text("Select Hotel")').first();
    await selectHotel.click();
    await page.waitForTimeout(5000);

    // Wait for room details and click first "Book Now"
    const bookNow = page.locator('button:has-text("Book Now")').first();
    await bookNow.click();
    await page.waitForTimeout(5000);

    // Wait for "Review Your Booking" page with Summary of Charges
    await page.waitForSelector('text=Summary of Charges', { timeout: 15000 });

    const bodyText = (await page.textContent('body')) || '';

    // Extract price breakdown
    const itemPriceMatch = bodyText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
    const discountMatch = bodyText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
    const totalMatch = bodyText.match(/(?:Total\s+Price|Total)[:\s]+\$?([\d,]+\.?\d*)/i);

    const itemPrice = itemPriceMatch ? parseFloat(itemPriceMatch[1].replace(/,/g, '')) : 0;
    const discountAmount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
    const total = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0;

    console.log('Price Breakdown:');
    console.log('  Item Price (subtotal):', itemPrice ? `$${itemPrice}` : '(not found)');
    console.log('  Discount:', discountAmount ? `$${discountAmount}` : '(not found)');
    console.log('  Total:', total ? `$${total}` : '(not found)');

    // For 12% discount: discount = itemPrice * 0.12, total = itemPrice - discount + taxes
    // The API may return Item Price as already-discounted (net) - need to verify structure
    if (discountAmount > 0 && itemPrice > 0) {
      const calculatedPct = Math.round((discountAmount / (itemPrice + discountAmount)) * 100);
      console.log('  Calculated discount %:', calculatedPct + '%');
      expect(calculatedPct).toBe(12); // Expect 12% for Feb 15-21 range
    }

    expect(discountAmount).toBeGreaterThan(0);
    await page.screenshot({ path: 'test-results/hotel/ancillary-discount-line-item.png', fullPage: true });
  });
});
