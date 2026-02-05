/**
 * Manual Login Test - Interactive MFA Entry
 * Opens browser and pauses for manual MFA code entry
 */

import { test } from '@playwright/test';
import { CarBookingPage } from '../pages/CarBookingPage';
import { CAR_BOOKING_JWT } from '../helpers/car-discount-data';

const LOGIN_EMAIL = 'bill.legrand.test@yopmail.com';
const LOGIN_PASSWORD = 'Tester123123!';

test('Manual login with interactive MFA', async ({ page }) => {
  test.setTimeout(600000); // 10 minutes

  const carBookingPage = new CarBookingPage(page);

  console.log(`\n=== MANUAL LOGIN TEST ===`);
  console.log(`Email: ${LOGIN_EMAIL}`);
  console.log(`Password: ${LOGIN_PASSWORD}`);
  
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

  // Fill email
  console.log(`[3] Filling email...`);
  const emailInput = page.getByRole('textbox', { name: /email/i });
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await emailInput.fill(LOGIN_EMAIL);

  // Fill password
  console.log(`[4] Filling password...`);
  const passwordInput = page.getByRole('textbox', { name: /password/i });
  await passwordInput.fill(LOGIN_PASSWORD);

  // PAUSE HERE - You can now manually inspect and submit
  console.log(`\n⏸️  PAUSED: Please verify the login form and press Enter in console to continue...`);
  await page.pause();
  
  // After manual submit, check for MFA
  console.log(`[5] Checking for MFA page...`);
  await page.waitForTimeout(3000);
  
  const mfaInput = page.getByRole('textbox', { name: /mfa code/i });
  const isMfaVisible = await mfaInput.isVisible({ timeout: 2000 }).catch(() => false);
  
  if (isMfaVisible) {
    console.log(`\n✅ MFA page detected!`);
    console.log(`⏸️  PAUSED: Please enter MFA code and submit...`);
    await page.pause();
  }
  
  // Check if logged in
  console.log(`[6] Verifying login...`);
  await page.waitForTimeout(2000);
  const logoutBtn = page.getByRole('button', { name: /logout/i });
  const isLoggedIn = await logoutBtn.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (isLoggedIn) {
    console.log(`\n✅ ✅ ✅ LOGIN SUCCESSFUL! ✅ ✅ ✅`);
    console.log(`User is now logged in and ready for testing.`);
  } else {
    console.log(`\n❌ Login verification failed. Current URL: ${page.url()}`);
  }
  
  // Keep browser open
  await page.pause();
});
