import { test as base, Page } from '@playwright/test';

/**
 * Authentication Fixture
 * Provides authenticated page contexts for different user types
 */

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
  ancillaryPage: Page;
  cugPage: Page;
};

/**
 * Login helper function
 */
async function login(page: Page, username: string, password: string) {
  // Navigate to root which will redirect to the appropriate login page
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for any animations
  await page.waitForTimeout(2000);
  
  // Try multiple selectors for the email field
  const emailInput = page.locator('input[type="text"], input[type="email"], input[placeholder*="mail" i], input[name*="email" i], input[id*="email" i]').first();
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await emailInput.clear();
  await emailInput.fill(username);
  
  // Try multiple selectors for the password field
  const passwordInput = page.locator('input[type="password"], input[placeholder*="password" i], input[name*="password" i], input[id*="password" i]').first();
  await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  await passwordInput.clear();
  await passwordInput.fill(password);
  
  // Wait a moment before clicking
  await page.waitForTimeout(500);
  
  // Click the Sign In button
  const signInButton = page.getByRole('button', { name: /sign in/i });
  await signInButton.click();
  
  // Wait for navigation away from login/root page
  await page.waitForURL(url => {
    const urlStr = url.toString();
    return !urlStr.endsWith('/login') && !urlStr.endsWith('/');
  }, { timeout: 15000 });
  
  // Wait for the page to fully load after login
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

/**
 * Extended test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  /**
   * Generic authenticated page
   */
  authenticatedPage: async ({ page }, use) => {
    const username = process.env.ADMIN_USERNAME || 'admin@tripbeast.com';
    const password = process.env.ADMIN_PASSWORD || 'password';
    
    await login(page, username, password);
    await use(page);
  },

  /**
   * Admin user page
   */
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const username = process.env.ADMIN_USERNAME || 'admin@tripbeast.com';
    const password = process.env.ADMIN_PASSWORD || 'password';
    
    await login(page, username, password);
    await use(page);
    
    await context.close();
  },

  /**
   * Ancillary BE user page
   */
  ancillaryPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const username = process.env.ANCILLARY_USERNAME || 'ancillary@tripbeast.com';
    const password = process.env.ANCILLARY_PASSWORD || 'password';
    
    await login(page, username, password);
    await use(page);
    
    await context.close();
  },

  /**
   * CUG BE user page
   */
  cugPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const username = process.env.CUG_USERNAME || 'cug@tripbeast.com';
    const password = process.env.CUG_PASSWORD || 'password';
    
    await login(page, username, password);
    await use(page);
    
    await context.close();
  },
});

export { expect } from '@playwright/test';
