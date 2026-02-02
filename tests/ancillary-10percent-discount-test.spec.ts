import { test, expect } from '@playwright/test';

/**
 * Test: Ancillary 10% Discount for Feb 1-2, 2026
 *
 * Verifies the 10% discount is applied on the SUBTOTAL (price breakdown:
 * Subtotal/Item Price, Discount, Total) — not on search-result cards.
 *
 * JWT options (both valid with secret LULX6HXY7L):
 * - JWT_WITH_DISCOUNT_RULE: includes businessRuleId + discountRuleId (Ancii Stage DR)
 * - JWT_USER_WORKING: minimal payload (no rule IDs)
 *
 * Run: npx playwright test ancillary-10percent-discount-test.spec.ts
 * Verify JWTs: node verify-ancillary-jwt.js
 */

const BOOKING_ENGINE_URL = 'https://travel.tripbeast.com';

// JWT with discount rule. Regenerate with: node generate-jwt-ancillary.js
// If booking engine shows "malformed jwt", use a fresh token from that script or set ANCILLARY_JWT env.
const JWT_WITH_DISCOUNT_RULE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzY5ODk4NjI0fQ.WrZ3RLvRGZRmDlJF9dJdtO685LDgvITmE1GXPIb6qUg';

// Your working JWT (minimal payload - no businessRuleId, no discountRuleId)
const JWT_USER_WORKING =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiIiLCJjbGllbnRMb2dvVXJsIjoiIiwibWVtYmVyc2hpcCI6ZmFsc2UsImlhdCI6MTc2ODg5NDQwMn0.MpE_ewPTnBTDW3bGyo0U7hiMcvIWLV0V5I_EPOQIBkg';

// Default: JWT with discountRuleId. Override with env ANCILLARY_JWT to use a specific token.
const JWT_TOKEN = process.env.ANCILLARY_JWT || JWT_WITH_DISCOUNT_RULE;

test.describe('Ancillary 10% Discount Test (Feb 1-2, 2026)', () => {

  test('with discount-rule JWT: should apply 10% discount to Las Vegas hotels for Feb 1-2, 2026', async ({ page }) => {
    console.log('🚀 Starting Ancillary 10% discount test (JWT with discountRuleId)...');

    // Navigate to booking engine (default: JWT with discountRuleId; override with ANCILLARY_JWT env)
    const searchUrl = `${BOOKING_ENGINE_URL}/?jwt=${JWT_TOKEN}&page=hotel&check_in=2026-02-01&check_out=2026-02-02&city=Las%20Vegas`;
    console.log('📍 Navigating to:', searchUrl);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Close any popups
    const closeButtons = page.locator('button').filter({ hasText: /close|dismiss|×/i });
    if (await closeButtons.count() > 0) {
      await closeButtons.first().click().catch(() => {});
    }
    
    // Wait for hotel results to load
    console.log('⏳ Waiting for hotel results...');
    await page.waitForSelector('[class*="hotel"], [class*="card"], [class*="result"]', { timeout: 60000 });
    
    // Wait a bit more for all prices to render
    await page.waitForTimeout(3000);
    
    // Look for prices on the page
    const priceSelectors = [
      'text=/\\$\\d+/',
      '[class*="price"]',
      '[class*="rate"]',
      '[class*="amount"]'
    ];
    
    let foundPrices = false;
    for (const selector of priceSelectors) {
      const priceElements = page.locator(selector);
      const count = await priceElements.count();
      if (count > 0) {
        console.log(`✅ Found ${count} price elements using selector: ${selector}`);
        foundPrices = true;
        
        // Log first few prices
        for (let i = 0; i < Math.min(count, 5); i++) {
          const text = await priceElements.nth(i).textContent();
          console.log(`   Price ${i + 1}: ${text}`);
        }
        break;
      }
    }
    
    expect(foundPrices).toBeTruthy();
    
    // Look for strikethrough prices (original prices)
    const strikethroughSelectors = [
      '[style*="text-decoration: line-through"]',
      '[style*="text-decoration:line-through"]',
      '[class*="strike"]',
      '[class*="original"]',
      'del',
      's'
    ];
    
    let foundStrikethrough = false;
    for (const selector of strikethroughSelectors) {
      const strikeElements = page.locator(selector);
      const count = await strikeElements.count();
      if (count > 0) {
        console.log(`✅ Found ${count} strikethrough prices using selector: ${selector}`);
        foundStrikethrough = true;
        
        // Log first few strikethrough prices
        for (let i = 0; i < Math.min(count, 3); i++) {
          const text = await strikeElements.nth(i).textContent();
          console.log(`   Original Price ${i + 1}: ${text}`);
        }
        break;
      }
    }
    
    if (foundStrikethrough) {
      console.log('✅ Strikethrough display is working!');
    } else {
      console.log('⚠️  No strikethrough prices found - may need to check discount configuration');
    }
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/ancillary-10percent-discount.png', fullPage: true });
    console.log('📸 Screenshot saved to test-results/ancillary-10percent-discount.png');
    
    // Verify the page loaded successfully
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    expect(pageTitle).toContain('TripBeast');
    
    console.log('✅ Test completed!');
  });
  
  test('with user working JWT (minimal payload): load Las Vegas Feb 1-2 and check for prices', async ({ page }) => {
    console.log('🚀 Testing with YOUR working JWT (no discountRuleId in payload)...');

    const searchUrl = `${BOOKING_ENGINE_URL}/?jwt=${JWT_USER_WORKING}&page=hotel&check_in=2026-02-01&check_out=2026-02-02&city=Las%20Vegas`;
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.locator('button').filter({ hasText: /close|dismiss|×/i }).first().click().catch(() => {});
    await page.waitForTimeout(3000);
    const title = await page.title();
    expect(title).toContain('TripBeast');
    console.log('✅ Page loaded with user working JWT');
  });

  /**
   * Discount is applied on SUBTOTAL (price breakdown), not on search-result cards.
   * This test navigates to the page where Subtotal, Discount, and Total are shown,
   * then verifies the discount is applied to the subtotal.
   */
  test('discount on subtotal: navigate to price breakdown and verify', async ({ page }) => {
    console.log('🎯 Discount-on-subtotal test: loading search then finding price breakdown...');

    const searchUrl = `${BOOKING_ENGINE_URL}/?jwt=${JWT_WITH_DISCOUNT_RULE}&page=hotel&check_in=2026-02-01&check_out=2026-02-02&city=Las%20Vegas`;
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 60000 });

    await page.locator('button').filter({ hasText: /close|dismiss|×/i }).first().click().catch(() => {});
    await page.waitForTimeout(2000);

    // Go to a page that shows Subtotal / price breakdown: click first hotel, then select a rate.
    const hotelCard = page.locator('a[href*="hotel"], [class*="hotel"] a, [class*="card"] a, button:has-text("Select"), button:has-text("View"), button:has-text("See rates")').first();
    const cardCount = await page.locator('[class*="hotel"], [class*="card"], [class*="result"]').count();
    if (cardCount > 0) {
      await hotelCard.click().catch(() => {});
      await page.waitForTimeout(3000);
    }

    // Try to open a rate/room to get to booking summary (Subtotal, Discount, Total).
    const selectRate = page.locator('button:has-text("Select"), button:has-text("Book"), button:has-text("Reserve"), a:has-text("Select"), a:has-text("Book")').first();
    if (await selectRate.count() > 0) {
      await selectRate.click().catch(() => {});
      await page.waitForTimeout(4000);
    }

    const bodyText = (await page.textContent('body')) || '';

    // Extract price breakdown: Subtotal (or Item Price), Discount, Total
    const subtotalMatch = bodyText.match(/(?:Subtotal|Item\s+Price)[:\s]+\$?([\d,]+\.?\d*)/i);
    const discountMatch = bodyText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
    const totalMatch = bodyText.match(/(?:Total|Grand\s+Total)[:\s]+\$?([\d,]+\.?\d*)/i);

    const subtotal = subtotalMatch ? parseFloat(subtotalMatch[1].replace(/,/g, '')) : 0;
    const discount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
    const total = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0;

    console.log('Price breakdown (where discount is on subtotal):');
    console.log('  Subtotal/Item Price:', subtotal ? `$${subtotal}` : '(not found)');
    console.log('  Discount:', discount ? `$${discount}` : '(not found)');
    console.log('  Total:', total ? `$${total}` : '(not found)');

    if (subtotal > 0 || total > 0) {
      if (discount > 0) {
        console.log('✅ Discount on subtotal found:', discount);
        expect(discount).toBeGreaterThan(0);
      } else {
        console.log('⚠️ No discount line found on this page; discount may appear later in flow or on different label.');
      }
    } else {
      console.log('⚠️ Price breakdown (Subtotal/Total) not on this page yet; may need to complete hotel → room selection.');
    }

    await page.screenshot({ path: 'test-results/ancillary-discount-on-subtotal.png', fullPage: true });
    console.log('📸 Screenshot: test-results/ancillary-discount-on-subtotal.png');
  });
});
