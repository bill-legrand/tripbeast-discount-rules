/**
 * Comprehensive Car Discount Tests with Login
 * Tests all discount periods (March 1-28) with authentication
 * 
 * IMPORTANT: Car discounts require user to be logged in!
 * 
 * This test suite:
 * 1. Opens separate yopmail browser context for MFA monitoring
 * 2. Connects booking engine with JWT
 * 3. Logs in ONCE - retrieves MFA code from yopmail context in real-time
 * 4. Stays logged in for ALL tests
 * 5. Runs with 1 worker to maintain session
 * 
 * Run: npx playwright test tests/car/car-comprehensive-with-login.spec.ts --project=chromium --workers=1
 * 
 * Prerequisites:
 * - User account must exist: bill.legrand.test@yopmail.com with password: Tester123123!
 * - Fresh JWT token in car-discount-data.ts
 */

import { test, expect } from '@playwright/test';
import { CarBookingPage } from '../pages/CarBookingPage';
import { 
  CAR_BOOKING_JWT, 
  getMarchComprehensiveCarRentalTests,
  getCarOutputBase 
} from '../helpers/car-discount-data';
import * as fs from 'fs';
import * as path from 'path';

const SUITE_NAME = 'car-comprehensive-with-login';
const SCREENSHOT_DIR = getCarOutputBase(SUITE_NAME);
const FAILED_SCREENSHOTS_DIR = `${SCREENSHOT_DIR}/failed`;

// Ensure output directories exist
[SCREENSHOT_DIR, FAILED_SCREENSHOTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Login credentials from environment
// Use yopmail for automated MFA code retrieval
const LOGIN_EMAIL = process.env.CAR_TEST_EMAIL || 'bill.legrand.test@yopmail.com';
const LOGIN_PASSWORD = process.env.CAR_TEST_PASSWORD || 'Tester123123!';
const MFA_CODE = process.env.CAR_TEST_MFA_CODE; // Optional - will fetch from yopmail automatically

if (!LOGIN_PASSWORD) {
  throw new Error('CAR_TEST_PASSWORD environment variable is required!');
}

// Get comprehensive test cases (March 1-28)
const testCases = getMarchComprehensiveCarRentalTests();

test.describe.serial('Car Comprehensive Discounts (March 1-28) with Login', () => {
  // Helper function to fetch MFA code from yopmail (triggered on-demand)
  async function fetchMfaCodeFromYopmail(browser: any, email: string): Promise<string> {
    const username = email.split('@')[0];
    console.log(`[YOPMAIL] Opening separate browser context for ${username}...`);
    
    const yopmailContext = await browser.newContext();
    const yopmailPage = await yopmailContext.newPage();
    
    try {
      await yopmailPage.goto(`https://yopmail.com/en/?login=${username}`, { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      await yopmailPage.waitForTimeout(2000);
      
      // Accept cookies if present
      try {
        const acceptBtn = yopmailPage.locator('#accept');
        if (await acceptBtn.isVisible({ timeout: 2000 })) {
          await acceptBtn.click();
          await yopmailPage.waitForTimeout(500);
        }
      } catch { /* ignore */ }
      
      console.log(`[YOPMAIL] Refreshing inbox to get latest email...`);
      
      // Refresh inbox once to get the latest emails
      const checkBtn = yopmailPage.locator('#refreshbut');
      if (await checkBtn.isVisible({ timeout: 5000 })) {
        await checkBtn.click({ timeout: 5000 });
        await yopmailPage.waitForTimeout(2000);
      }
      
      // Click on the FIRST (newest) email in the inbox list
      console.log(`[YOPMAIL] Opening latest email...`);
      const firstEmail = yopmailPage.locator('#mail .m').first();
      if (await firstEmail.isVisible({ timeout: 5000 })) {
        await firstEmail.click();
        await yopmailPage.waitForTimeout(1000);
      }
      
      // Switch to email content iframe and extract code
      const mailFrame = yopmailPage.frameLocator('#ifmail');
      const emailBody = mailFrame.locator('body');
      const bodyText = await emailBody.textContent({ timeout: 5000 });
      
      if (!bodyText) {
        throw new Error('Could not read email content from yopmail');
      }
      
      // Look for 6-digit MFA code
      const patterns = [
        /(?:verification|MFA|auth|security)\s+code[:\s]+(\d{6})/i,
        /your\s+code[:\s]+(\d{6})/i,
        /code[:\s]+(\d{6})/i,
        /(\d{6})/
      ];
      
      let mfaCode: string | null = null;
      for (const pattern of patterns) {
        const match = bodyText.match(pattern);
        if (match) {
          mfaCode = match[1];
          console.log(`[YOPMAIL] ✅ Found MFA code: ${mfaCode}`);
          break;
        }
      }
      
      if (!mfaCode) {
        throw new Error('No MFA code found in latest email');
      }
      
      return mfaCode;
      
    } finally {
      await yopmailContext.close();
      console.log(`[YOPMAIL] Closed yopmail context`);
    }
  }
  
  // Single login before all tests - stays logged in throughout
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(300000); // 5 minutes for login including MFA
    
    console.log(`\n=== AUTHENTICATION SETUP ===`);
    console.log(`Email: ${LOGIN_EMAIL}`);
    console.log(`JWT Token: ${CAR_BOOKING_JWT.substring(0, 50)}...`);
    console.log(`MFA will be retrieved from yopmail when needed`);
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      // First connect with JWT
      console.log(`[AUTH] Connecting with JWT...`);
      await page.goto(`https://travel.tripbeast.com/?jwt=${CAR_BOOKING_JWT}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      await page.waitForTimeout(2000);
      
      // Then login
      console.log(`\n[AUTH] Logging in as ${LOGIN_EMAIL}...`);
      await page.goto('https://travel.tripbeast.com/');
      await page.waitForLoadState('networkidle');
      await page.goto('https://travel.tripbeast.com/login');
      await page.waitForLoadState('networkidle');
      
      console.log(`[LOGIN] Filling email: ${LOGIN_EMAIL}`);
      const emailInput = page.getByRole('textbox', { name: /email/i });
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await emailInput.fill(LOGIN_EMAIL);
      
      console.log(`[LOGIN] Filling password`);
      const passwordInput = page.getByRole('textbox', { name: /password/i });
      await passwordInput.fill(LOGIN_PASSWORD);
      
      console.log(`[LOGIN] Submitting login form`);
      await passwordInput.press('Enter');
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(5000); // Wait longer for MFA email to be sent
      
      // Check for MFA page
      console.log(`[LOGIN] Checking for MFA page...`);
      let mfaInput = page.getByRole('textbox', { name: /mfa code/i });
      let isMfaVisible = await mfaInput.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (!isMfaVisible) {
        await page.waitForTimeout(2000);
        mfaInput = page.getByRole('textbox', { name: /mfa code/i });
        isMfaVisible = await mfaInput.isVisible({ timeout: 2000 }).catch(() => false);
      }
      
      if (isMfaVisible) {
        console.log(`[LOGIN] MFA required - waiting 5 seconds for email to arrive...`);
        await page.waitForTimeout(5000); // Wait 5 seconds for MFA email to be sent
        
        console.log(`[LOGIN] Now triggering yopmail lookup in separate context...`);
        
        // Fetch MFA code from yopmail in separate browser context
        const mfaCode = await fetchMfaCodeFromYopmail(browser, LOGIN_EMAIL);
        
        // Enter MFA code in booking engine
        console.log(`[LOGIN] Entering MFA code: ${mfaCode}`);
        await mfaInput.fill(mfaCode);
        const verifyBtn = page.getByRole('button', { name: /verify/i });
        await verifyBtn.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        // Dismiss any modals that might appear after login
        console.log(`[LOGIN] Dismissing any post-login modals...`);
        try {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
          const modalCloseBtn = page.locator('button:has-text("Don\'t Miss Out"), button:has-text("×"), button[aria-label="Close"]').first();
          if (await modalCloseBtn.isVisible({ timeout: 2000 })) {
            await modalCloseBtn.click();
            await page.waitForTimeout(500);
          }
        } catch { /* ignore */ }
      }
      
      // Verify login successful
      console.log(`[LOGIN] Verifying login success...`);
      const logoutBtn = page.getByRole('button', { name: /logout/i }).or(page.getByText('LOGOUT'));
      const isLoggedIn = await logoutBtn.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (!isLoggedIn) {
        await page.screenshot({ path: 'login-failed-debug.png', fullPage: true });
        throw new Error('Login failed - Logout button not found.');
      }
      
      console.log(`[AUTH] ✅ Login successful - staying logged in for all tests`);
      
      // Store the context globally for reuse
      (test as any)._sharedContext = context;
    } catch (error) {
      console.error(`[AUTH ERROR] ${error}`);
      await context.close();
      throw new Error(`Login failed. Ensure user ${LOGIN_EMAIL} exists and password is correct.`);
    }
  });

  test.beforeEach(async ({ page }) => {
    // Reuse the authenticated session - navigate with JWT to maintain session
    console.log(`[TEST] Using existing authenticated session`);
    await page.goto(`https://travel.tripbeast.com/?jwt=${CAR_BOOKING_JWT}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(1000);
  });

  for (const testCase of testCases) {
    test(`${testCase.pickupDate} → ${testCase.dropoffDate}: ${testCase.rentalDays} day(s) (${testCase.expectedDiscount}%)`, async ({ page }) => {
      test.setTimeout(180000); // 3 minutes per test

      const carBookingPage = new CarBookingPage(page);
      const screenshotName = `${testCase.pickupDate}_${testCase.rentalDays}days_${testCase.expectedDiscount}pct`;
      
      console.log(`\n=== TEST: ${testCase.rentalDays}-day rental ===`);
      console.log(`Dates: ${testCase.pickupDate} → ${testCase.dropoffDate}`);
      console.log(`Expected Discount: ${testCase.expectedDiscount}%`);

      try {
        // Navigate to car booking with JWT (user already logged in)
        await carBookingPage.gotoCarBookingWithDates(
          testCase.pickupDate,
          testCase.dropoffDate,
          CAR_BOOKING_JWT,
          {
            pickup_location: 'Las Vegas Strip',
            dropoff_location: 'Las Vegas Strip',
            pickup_time: '10:00 AM',
            dropoff_time: '10:00 AM',
            renter_age: '30'
          }
        );

        // Extract prices
        const { gross, discount, net, effectivePct } = await carBookingPage.extractCarPricing();
        
        // Debug: save page content snippet for first test
        if (testCase.pickupDate === '2026-03-01') {
          const pageContent = await page.textContent('body');
          const priceSection = pageContent?.match(/(Base Price|Item Price|Subtotal|Discount|Total|Price|\\$\\d+\\.\\d+).{0,300}/gi);
          console.log(`\n[DEBUG] Full price-related content from page:\n${priceSection?.slice(0, 20).join('\n')}`);
        }

        console.log(`\n=== RESULT ===`);
        console.log(`Gross: ${gross} | Discount: ${discount} | Net: ${net}`);
        console.log(`Effective discount: ${effectivePct.toFixed(1)}%`);
        console.log(`Expected: ${testCase.expectedDiscount}%`);

        // Take screenshot
        const screenshotPath = path.join(SCREENSHOT_DIR, `${screenshotName}.png`);
        await carBookingPage.screenshotCarBooking(screenshotPath, false);

        // Assertions with tolerance
        const diff = Math.abs(effectivePct - testCase.expectedDiscount);
        expect(diff, `Discount ${effectivePct.toFixed(1)}% vs expected ${testCase.expectedDiscount}%`).toBeLessThanOrEqual(2);

        console.log(`✅ PASS: ${testCase.rentalDays}-day rental`);

      } catch (error) {
        console.error(`\n❌ FAIL: ${testCase.rentalDays}-day rental`);
        console.error(`Error: ${error}`);

        // Save failed screenshot
        const failedScreenshotPath = path.join(FAILED_SCREENSHOTS_DIR, `${screenshotName}_FAILED.png`);
        try {
          await carBookingPage.screenshotCarBooking(failedScreenshotPath, true);
        } catch { /* ignore */ }

        throw error;
      }
    });
  }
});
