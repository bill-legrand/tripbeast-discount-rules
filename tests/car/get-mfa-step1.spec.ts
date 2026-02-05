/**
 * Step 1: Get to MFA stage and wait for manual code
 * This will login and stop at MFA page so user can retrieve code
 */

import { test } from '@playwright/test';
import { CarBookingPage } from '../pages/CarBookingPage';
import { CAR_BOOKING_JWT } from '../helpers/car-discount-data';

const LOGIN_EMAIL = 'bill.legrand.test@yopmail.com';
const LOGIN_PASSWORD = 'Tester123123!';

test('Get MFA code from yopmail', async ({ page }) => {
  test.setTimeout(300000); // 5 minutes

  console.log(`\n=== STEP 1: LOGIN AND GET MFA PAGE ===`);
  console.log(`Email: ${LOGIN_EMAIL}`);
  
  // Connect with JWT first
  console.log(`[1] Connecting with JWT...`);
  await page.goto(`https://travel.tripbeast.com/?jwt=${CAR_BOOKING_JWT}`, { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  await page.waitForTimeout(2000);
  
  // Navigate to login page
  console.log(`[2] Navigating to login page...`);
  await page.goto('https://travel.tripbeast.com/login');
  await page.waitForLoadState('networkidle');

  // Fill credentials
  console.log(`[3] Filling credentials...`);
  const emailInput = page.getByRole('textbox', { name: /email/i });
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await emailInput.fill(LOGIN_EMAIL);

  const passwordInput = page.getByRole('textbox', { name: /password/i });
  await passwordInput.fill(LOGIN_PASSWORD);
  
  // Submit
  console.log(`[4] Submitting login...`);
  await passwordInput.press('Enter');
  await page.waitForTimeout(5000);

  // Check for MFA
  const mfaInput = page.getByRole('textbox', { name: /mfa code/i });
  const isMfaVisible = await mfaInput.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (isMfaVisible) {
    console.log(`\n✅ MFA PAGE DETECTED!`);
    console.log(`\n📧 Please check yopmail at: https://yopmail.com/?login=bill.legrand.test`);
    console.log(`\n⏸️  Pausing for 3 minutes - provide MFA code to the agent...`);
    
    // Take screenshot
    await page.screenshot({ path: 'mfa-page.png', fullPage: true });
    
    // Wait 3 minutes
    await page.waitForTimeout(180000);
  } else {
    console.log(`\n❌ MFA page not detected. Current URL: ${page.url()}`);
    await page.screenshot({ path: 'no-mfa-page.png', fullPage: true });
  }
});
