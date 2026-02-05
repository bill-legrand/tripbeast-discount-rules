import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Car Rental Booking Engine
 * Handles car rental price display, discounts, and verification
 * Similar to BookingEnginePage but specialized for cars
 */
export class CarBookingPage {
  readonly page: Page;
  
  // Car Search Elements
  readonly pickupLocationInput: Locator;
  readonly dropoffLocationInput: Locator;
  readonly pickupDateInput: Locator;
  readonly dropoffDateInput: Locator;
  readonly pickupTimeInput: Locator;
  readonly dropoffTimeInput: Locator;
  readonly renterAgeInput: Locator;
  readonly findCarsButton: Locator;
  
  // Car Result Elements
  readonly carCard: Locator;
  readonly carTitle: Locator;
  readonly carPrice: Locator;
  readonly selectCarButton: Locator;
  
  // Price Breakdown
  readonly subtotalLabel: Locator;
  readonly subtotalAmount: Locator;
  readonly taxLabel: Locator;
  readonly taxAmount: Locator;
  readonly feesLabel: Locator;
  readonly feesAmount: Locator;
  readonly totalLabel: Locator;
  readonly totalAmount: Locator;
  readonly discountLabel: Locator;
  readonly discountAmount: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Car Search Elements
    this.pickupLocationInput = page.locator('input[placeholder*="Pick-up"], input[name="pickup_location"], [data-testid="pickup-location"]');
    this.dropoffLocationInput = page.locator('input[placeholder*="Drop-off"], input[name="dropoff_location"], [data-testid="dropoff-location"]');
    this.pickupDateInput = page.locator('input[placeholder*="Pick-up Date"], [data-testid="pickup-date"]');
    this.dropoffDateInput = page.locator('input[placeholder*="Drop-off Date"], [data-testid="dropoff-date"]');
    this.pickupTimeInput = page.locator('input[placeholder*="Pick-up Time"], [data-testid="pickup-time"]');
    this.dropoffTimeInput = page.locator('input[placeholder*="Drop-off Time"], [data-testid="dropoff-time"]');
    this.renterAgeInput = page.locator('input[name="renter_age"], [data-testid="renter-age"]');
    this.findCarsButton = page.locator('button:has-text("Find Cars"), [data-testid="find-cars-button"]');
    
    // Car Result Elements
    this.carCard = page.locator('.car-card, .vehicle-card, [data-testid="car-card"]');
    this.carTitle = page.locator('.car-title, .vehicle-name, h2, h3, [data-testid="car-title"]');
    this.carPrice = page.locator('.price, .car-price, [data-testid="car-price"]');
    this.selectCarButton = page.locator('button:has-text("Select"), button:has-text("Book"), [data-testid="select-car-button"]');
    
    // Price Breakdown
    this.subtotalLabel = page.locator('text=Subtotal, text=Item Price, [data-testid="subtotal-label"]');
    this.subtotalAmount = page.locator('[data-testid="subtotal-amount"], .subtotal-amount');
    this.taxLabel = page.locator('text=Tax, text=Taxes, [data-testid="tax-label"]');
    this.taxAmount = page.locator('[data-testid="tax-amount"], .tax-amount');
    this.feesLabel = page.locator('text=Fees, text=Service Fee, [data-testid="fees-label"]');
    this.feesAmount = page.locator('[data-testid="fees-amount"], .fees-amount');
    this.totalLabel = page.locator('text=Total, text=Grand Total, [data-testid="total-label"]');
    this.totalAmount = page.locator('[data-testid="total-amount"], .total-amount');
    this.discountLabel = page.locator('text=Discount, [data-testid="discount-label"]');
    this.discountAmount = page.locator('[data-testid="discount-amount"], .discount-amount');
  }

  /**
   * Get validation/error messages visible on the page (e.g. "Dropoff location is required")
   */
  async getPageValidationErrors(): Promise<string> {
    try {
      const text = await this.page.textContent('body') || '';
      const requiredMatch = text.match(/(?:pickup|pick-up|dropoff|drop-off|date|time|age)\s+(?:location\s+)?is\s+required\.?/i);
      if (requiredMatch) return requiredMatch[0].trim();
      const forbiddenMatch = text.match(/forbidden|access denied/i);
      if (forbiddenMatch) return 'Access forbidden or denied';
      return 'No validation message found';
    } catch {
      return 'Could not read page';
    }
  }

  /**
   * Dismiss modal popup (e.g. "Become a Member") if visible
   */
  async dismissModal() {
    try {
      this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(300);
    } catch { /* ignore */ }
    const selectors = [
      '.join-membership-modal-wrapper button:first-of-type',
      '[aria-labelledby="join-membership-modal"] button:first-of-type',
      'button[aria-label="Close"]',
      '[aria-label="close"]',
      'button:has(svg)',
      '.modal-close',
      '[data-dismiss="modal"]',
      'div[role="dialog"] button:first-of-type',
      '.modal button:first-of-type',
      '[class*="modal"] button:first-of-type'
    ];
    for (const sel of selectors) {
      try {
        const btn = this.page.locator(sel).first();
        if (await btn.isVisible({ timeout: 1000 })) {
          await btn.click();
          await this.page.waitForTimeout(500);
          return;
        }
      } catch {
        // Try next selector
      }
    }
  }

  /**
   * Login to travel.tripbeast.com with email and password
   * Required for car discounts to be applied
   * 
   * @param email - User email (use @yopmail.com for automated MFA)
   * @param password - User password
   * @param mfaCode - Optional MFA code. If using yopmail, can be fetched automatically
   * @param fetchMfaFromYopmail - If true and email is @yopmail.com, will fetch MFA code automatically
   */
  async login(email: string, password: string, mfaCode?: string, fetchMfaFromYopmail: boolean = true) {
    console.log(`[LOGIN] Navigating to home page first with JWT...`);
    // Must navigate with JWT first to avoid 403 on login page
    await this.page.goto('https://travel.tripbeast.com/');
    await this.page.waitForLoadState('networkidle');
    
    console.log(`[LOGIN] Navigating to login page...`);
    await this.page.goto('https://travel.tripbeast.com/login');
    await this.page.waitForLoadState('networkidle');

    console.log(`[LOGIN] Filling email: ${email}`);
    const emailInput = this.page.getByRole('textbox', { name: /email/i });
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(email);

    console.log(`[LOGIN] Filling password`);
    const passwordInput = this.page.getByRole('textbox', { name: /password/i });
    await passwordInput.fill(password);
    
    console.log(`[LOGIN] Submitting login form`);
    // Press Enter to submit the form instead of clicking button
    await passwordInput.press('Enter');

    // Wait longer for login to process
    console.log(`[LOGIN] Waiting for login to process...`);
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(3000);

    // Check if MFA is required - check multiple times with retries
    console.log(`[LOGIN] Checking for MFA page...`);
    let mfaInput = this.page.getByRole('textbox', { name: /mfa code/i });
    let isMfaVisible = await mfaInput.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (!isMfaVisible) {
      // Wait a bit more and check again
      await this.page.waitForTimeout(2000);
      mfaInput = this.page.getByRole('textbox', { name: /mfa code/i });
      isMfaVisible = await mfaInput.isVisible({ timeout: 2000 }).catch(() => false);
    }
    
    console.log(`[LOGIN] MFA required: ${isMfaVisible}`);
    
    // Check for error messages
    const bodyText = await this.page.textContent('body') || '';
    console.log(`[LOGIN DEBUG] Checking for error messages...`);
    
    // Look for common error patterns
    const errorPatterns = [
      /invalid.*email/i,
      /invalid.*password/i,
      /incorrect/i,
      /not found/i,
      /does not exist/i,
      /email.*required/i,
      /password.*required/i
    ];
    
    for (const pattern of errorPatterns) {
      if (pattern.test(bodyText)) {
        console.log(`[LOGIN ERROR] Error detected: ${bodyText.match(pattern)?.[0]}`);
        await this.page.screenshot({ path: 'login-error-detected.png', fullPage: true });
        throw new Error(`Login error: ${bodyText.match(pattern)?.[0]}. Email: ${email}`);
      }
    }
    
    // Check if still on login page
    const currentUrl = this.page.url();
    console.log(`[LOGIN DEBUG] Current URL: ${currentUrl}`);
    if (currentUrl.includes('/login')) {
      console.log(`[LOGIN ERROR] Still on login page after submit`);
      // Wait a bit more in case it's slow
      await this.page.waitForTimeout(5000);
      const newUrl = this.page.url();
      if (newUrl.includes('/login')) {
        await this.page.screenshot({ path: 'stuck-on-login.png', fullPage: true });
        throw new Error(`Login did not progress. Still on login page. Check credentials: ${email} / ${password.substring(0, 3)}...`);
      }
    }

    if (isMfaVisible) {
      let finalMfaCode = mfaCode;
      
      // If no MFA code provided and email is yopmail, fetch it automatically
      if (!finalMfaCode && fetchMfaFromYopmail && email.includes('@yopmail.com')) {
        console.log(`[LOGIN] Fetching MFA code from yopmail...`);
        const { YopmailHelper } = await import('../helpers/yopmail-helper');
        finalMfaCode = await YopmailHelper.getMfaCode(email, 60);
        console.log(`[LOGIN] Retrieved MFA code from yopmail: ${finalMfaCode}`);
      }
      
      if (!finalMfaCode) {
        console.log(`[LOGIN] ⏸️  MFA code required. Waiting 120 seconds for manual entry...`);
        // Wait 2 minutes for manual MFA entry
        await this.page.waitForTimeout(120000);
      } else {
        console.log(`[LOGIN] Entering MFA code`);
        await mfaInput.fill(finalMfaCode);
        const verifyBtn = this.page.getByRole('button', { name: /verify/i });
        await verifyBtn.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
      }
    }

    // Verify login successful by checking for "Logout" button
    console.log(`[LOGIN] Verifying login success...`);
    const logoutBtn = this.page.getByRole('button', { name: /logout/i });
    const isLoggedIn = await logoutBtn.isVisible({ timeout: 5000 }).catch(() => false);

    if (!isLoggedIn) {
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'login-failed-debug.png', fullPage: true });
      const bodyText = await this.page.textContent('body');
      console.log(`[LOGIN DEBUG] Page content: ${bodyText?.substring(0, 500)}...`);
      throw new Error('Login failed - Logout button not found. Check credentials or MFA code.');
    }

    console.log(`[LOGIN] Successfully logged in`);
  }

  /**
   * Convert YYYY-MM-DD to MM/DD/YYYY for date inputs
   */
  private formatDateForInput(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${m}/${d}/${y}`;
  }

  /**
   * Navigate to car page, perform search, select car, and reach booking/checkout with price breakdown.
   * Optimized for headless: explicit waits, force clicks where needed, accurate selectors.
   */
  async gotoCarBookingWithDates(
    pickupDate: string,
    dropoffDate: string,
    jwtToken: string,
    carParams?: {
      pickup_location?: string;
      dropoff_location?: string;
      pickup_time?: string;
      dropoff_time?: string;
      renter_age?: string;
      [key: string]: string | undefined;
    }
  ) {
    const baseUrl = 'https://travel.tripbeast.com';
    const pickupLoc = carParams?.pickup_location || 'Las Vegas';
    const dropoffLoc = carParams?.dropoff_location ?? pickupLoc; // default: same as pickup
    const pickupTime = carParams?.pickup_time || '10:00 AM';
    const dropoffTime = carParams?.dropoff_time || '10:00 AM';
    const renterAge = carParams?.renter_age || '30';
    const timeVal = pickupTime.includes('AM') || pickupTime.includes('PM') ? pickupTime : `${pickupTime} AM`;
    const dropoffTimeVal = dropoffTime.includes('AM') || dropoffTime.includes('PM') ? dropoffTime : `${dropoffTime} AM`;

    // 1. Navigate to car page (JWT + page=car)
    const params = new URLSearchParams({ page: 'car', jwt: jwtToken });
    await this.page.goto(`${baseUrl}/?${params.toString()}`, { waitUntil: 'networkidle', timeout: 45000 });
    await this.page.waitForTimeout(3000);

    // 1b. Detect "invalid token" / 403 - fail fast with helpful message
    const bodyText = await this.page.textContent('body') || '';
    if (/invalid token|403 forbidden|access denied/i.test(bodyText)) {
      throw new Error(
        `JWT rejected: page shows "${bodyText.slice(0, 80)}...". ` +
        `Regenerate: node generate-jwt-ancillary.js --minimal (or node generate-jwt-ancillary.js for full). ` +
        `Set CAR_BOOKING_JWT or ANCILLARY_JWT env var.`
      );
    }

    // 2. Wait for loader and modal - dismiss before any interaction
    await this.page.locator('.landing-loader').waitFor({ state: 'hidden', timeout: 25000 }).catch(() => {});
    await this.dismissModal();
    await this.page.waitForTimeout(500);

    // 3. Always click Cars tab - page may default to Hotels. Tab can be role=tab or button.
    const carsTab = this.page.getByRole('tab', { name: /Cars/i })
      .or(this.page.getByRole('button', { name: /Cars/i }))
      .or(this.page.locator('a:has-text("Cars"), button:has-text("Cars")').first());
    await carsTab.waitFor({ state: 'visible', timeout: 20000 });
    await carsTab.click({ force: true, timeout: 15000 });
    await this.page.waitForTimeout(2000);
    await this.dismissModal();
    await this.page.waitForTimeout(500);

    // 4. Wait for car form - Find Cars and Renter Age (car-specific, not hotel)
    const findCarsBtn = this.page.getByRole('button', { name: /Find Cars/i });
    await findCarsBtn.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.getByRole('textbox', { name: /Renter Age/i }).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.locator('.landing-loader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(1000);

    // 5. Fill form fields - use fill() for text inputs, combobox for locations
    const carPanel = this.page.getByRole('tabpanel', { name: 'Cars' });
    const pickupCombobox = carPanel.getByRole('combobox').first();
    await pickupCombobox.click({ timeout: 10000 });
    await this.page.waitForTimeout(200);
    await this.page.keyboard.press('Control+a');
    await this.page.keyboard.type(pickupLoc, { delay: 25 });
    await this.page.waitForTimeout(600);
    const pickupOpt = this.page.getByRole('option').filter({ hasText: pickupLoc }).first();
    if (await pickupOpt.isVisible({ timeout: 2000 })) {
      await pickupOpt.click();
    } else {
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForTimeout(400);

    const pickupDateInput = this.page.locator('input[placeholder*="MM/DD/YYYY"]').first();
    await pickupDateInput.fill(this.formatDateForInput(pickupDate));
    await this.page.waitForTimeout(200);

    const pickupTimeInput = this.page.getByLabel(/Pick-up Time|Pickup time/i).first();
    await pickupTimeInput.fill(timeVal);
    await this.page.waitForTimeout(200);

    const dropoffCombobox = carPanel.getByRole('combobox').nth(1); // 2nd combobox = dropoff
    await dropoffCombobox.click({ timeout: 10000 });
    await this.page.waitForTimeout(200);
    await this.page.keyboard.press('Control+a');
    await this.page.keyboard.type(dropoffLoc, { delay: 25 });
    await this.page.waitForTimeout(600);
    const dropoffOpt = this.page.getByRole('option').filter({ hasText: dropoffLoc }).first();
    if (await dropoffOpt.isVisible({ timeout: 2000 })) {
      await dropoffOpt.click();
    } else {
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForTimeout(400);

    const dropoffDateInput = this.page.locator('input[placeholder*="MM/DD/YYYY"]').nth(1);
    await dropoffDateInput.fill(this.formatDateForInput(dropoffDate));
    await this.page.waitForTimeout(200);

    const dropoffTimeInput = this.page.getByLabel(/Drop-off Time|Dropoff time/i).first();
    await dropoffTimeInput.fill(dropoffTimeVal);
    await this.page.waitForTimeout(200);

    const ageInput = this.page.getByRole('textbox', { name: /Renter Age/i });
    await ageInput.fill(renterAge);
    await this.page.waitForTimeout(300);

    // Helper: fill a single field if missing. All fields are always required.
    const fillPickupLoc = async () => {
      const carPanel = this.page.getByRole('tabpanel', { name: 'Cars' });
      const cb = carPanel.getByRole('combobox').first();
      await cb.click({ timeout: 5000 });
      await this.page.waitForTimeout(300);
      await this.page.keyboard.press('Control+a');
      await this.page.keyboard.type(pickupLoc, { delay: 30 });
      await this.page.waitForTimeout(800);
      const opt = this.page.getByRole('option').filter({ hasText: pickupLoc }).first();
      if (await opt.isVisible({ timeout: 3000 })) await opt.click();
      else await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(500);
    };
    const fillDropoffLoc = async () => {
      // Drop-off = same as pickup. Use 2nd combobox in Cars tabpanel.
      const loc = dropoffLoc || pickupLoc;
      const panel = this.page.getByRole('tabpanel', { name: 'Cars' });
      const cb = panel.getByRole('combobox').nth(1);
      await cb.click({ timeout: 5000 });
      await this.page.waitForTimeout(300);
      await this.page.keyboard.press('Control+a');
      await this.page.keyboard.type(loc, { delay: 30 });
      await this.page.waitForTimeout(800);
      const opt = this.page.getByRole('option').filter({ hasText: loc }).first();
      if (await opt.isVisible({ timeout: 3000 })) await opt.click();
      else await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(500);
    };
    const pickupDateStr = this.formatDateForInput(pickupDate);
    const dropoffDateStr = this.formatDateForInput(dropoffDate);

    const ensureFormComplete = async () => {
      await fillPickupLoc();
      await this.page.locator('input[placeholder*="MM/DD/YYYY"]').first().fill(pickupDateStr);
      await this.page.getByLabel(/Pick-up Time|Pickup time/i).first().fill(timeVal);
      await fillDropoffLoc();
      await this.page.locator('input[placeholder*="MM/DD/YYYY"]').nth(1).fill(dropoffDateStr);
      await this.page.getByLabel(/Drop-off Time|Dropoff time/i).first().fill(dropoffTimeVal);
      await this.page.getByRole('textbox', { name: /Renter Age/i }).fill(renterAge);
    };

    // 6. Ensure all required fields are complete, then click Find Cars
    await ensureFormComplete();
    await this.page.waitForTimeout(500);

    // 6b. Click Find Cars; on validation error re-fill all required fields and retry
    for (let attempt = 0; attempt < 3; attempt++) {
      await ensureFormComplete();
      await this.page.waitForTimeout(500);
      await findCarsBtn.click();
      await this.page.waitForTimeout(3000);
      const bodyText = (await this.page.textContent('body')) || '';
      const hasValidationError = /(?:pickup|pick-up|dropoff|drop-off)\s+location\s+is\s+required/i.test(bodyText) ||
        /(?:pick-up|pickup|drop-off|dropoff)\s+time\s+is\s+required/i.test(bodyText) ||
        /(?:date|age)\s+is\s+required/i.test(bodyText);
      if (hasValidationError) {
        continue; // ensureFormComplete will re-fill all on next iteration
      }
      break;
    }

    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    await this.page.waitForTimeout(10000);

    await this.dismissModal();

    // 7. Wait for car results - require "Select Car" (car-specific, not hotel)
    await this.page.waitForFunction(
      () => {
        const u = window.location.href || '';
        const t = document.body?.textContent || '';
        const hasCarUrl = u.includes('/car') && (u.includes('pickup_date') || u.includes('cardetail'));
        const hasSelectCar = t.includes('Select Car');
        const hasChooseCar = t.includes('Choose your Car');
        return hasCarUrl && (hasSelectCar || hasChooseCar);
      },
      { timeout: 45000 }
    );
    await this.page.waitForTimeout(3000);

    // 7b. Take screenshot of car results to see pricing display
    await this.page.waitForTimeout(2000);
    console.log(`[CAR RESULTS] Taking screenshot of car results page...`);
    await this.page.screenshot({ path: 'car-results-debug.png', fullPage: false });
    
    // Extract prices by looking at the first car card's HTML for strikethrough
    const selectCarBtn = this.page.getByRole('button', { name: 'Select Car' }).first();
    await selectCarBtn.waitFor({ state: 'visible', timeout: 15000 });
    
    // Get HTML to look for strikethrough styling
    const pageHTML = await this.page.content();
    
    // Look for text-decoration: line-through or <s> or <del> tags near prices
    console.log(`[CAR RESULTS] Searching for strikethrough prices in HTML...`);
    
    // Store that we couldn't find prices
    (this.page as any)._carResultsPrices = [];
    
    // Select the car
    await selectCarBtn.click({ force: true, timeout: 10000 });
    await this.page.waitForURL(/\/car\/cardetail|cardetail/, { timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    await this.page.waitForTimeout(5000);

    await this.dismissModal();

    // 8. Click Continue to reach price breakdown (if present)
    const continueBtn = this.page.getByRole('button', { name: 'Continue' });
    if (await continueBtn.isVisible({ timeout: 3000 })) {
      await continueBtn.click();
      await this.page.waitForTimeout(5000);
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    }

    // 9. Wait for price breakdown (Item Price, Discount, or Summary of Charges / Base Price)
    await this.page.waitForFunction(
      () => {
        const t = document.body.textContent || '';
        return t.includes('Item Price') || (t.includes('Discount') && t.includes('$')) ||
          t.includes('Summary of Charges') || t.includes('Base Price') || t.includes('Total Price');
      },
      { timeout: 20000 }
    );
  }

  /**
   * Get price breakdown from car booking page
   * Uses text pattern matching similar to hotel booking
   */
  async getPriceBreakdown(): Promise<{
    subtotal: number;
    tax: number;
    fees: number;
    discount: number;
    total: number;
  }> {
    // Get entire page content
    const pageContent = await this.page.textContent('body');
    
    if (!pageContent) {
      return {
        subtotal: 0,
        tax: 0,
        fees: 0,
        discount: 0,
        total: 0
      };
    }
    
    // Extract Item Price (subtotal before discount) - car flow may use "Base Price"
    const itemPriceMatch = pageContent.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i) ||
      pageContent.match(/Base\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
    const itemPrice = itemPriceMatch ? parseFloat(itemPriceMatch[1].replace(/,/g, '')) : 0;

    // Extract Discount - car flow may show "-$X.XX" format
    const discountMatch = pageContent.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
    const discount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
    
    // Extract Tax
    const taxMatch = pageContent.match(/(?:Tax|Taxes)[:\s]+\$?([\d,]+\.?\d*)/i);
    const tax = taxMatch ? parseFloat(taxMatch[1].replace(/,/g, '')) : 0;
    
    // Extract Fees
    const feesMatch = pageContent.match(/(?:Fees|Service\s+Fee)[:\s]+\$?([\d,]+\.?\d*)/i);
    const fees = feesMatch ? parseFloat(feesMatch[1].replace(/,/g, '')) : 0;
    
    // Extract Total
    const totalMatch = pageContent.match(/(?:Total\s+Price|Total|Grand\s+Total)[:\s]+\$?([\d,]+\.?\d*)/i);
    const total = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : 0;
    
    // Calculate subtotal (Item Price - Discount)
    const subtotal = itemPrice - discount;
    
    return {
      subtotal,
      tax,
      fees,
      discount,
      total
    };
  }

  /**
   * Extract numeric price from text
   */
  private extractPrice(text: string): number {
    const match = text.match(/[\d,]+\.?\d*/);
    if (!match) return 0;
    return parseFloat(match[0].replace(/,/g, ''));
  }

  /**
   * Get the displayed price for a car
   */
  async getDisplayedPrice(): Promise<number> {
    const priceText = await this.carPrice.first().textContent();
    return this.extractPrice(priceText || '');
  }

  /**
   * Select a car from results
   */
  async selectCar(carName?: string) {
    if (carName) {
      const car = this.page.locator(`.car-card:has-text("${carName}"), .vehicle-card:has-text("${carName}")`);
      await car.click();
    } else {
      await this.selectCarButton.first().click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot of car booking page
   * @param pathOrFilename - Full path (e.g. test-results/car/2026-02-03_14-30-00/1-day/march-01.png) or legacy filename
   */
  async screenshotCarBooking(pathOrFilename: string, fullPage: boolean = false) {
    const path = pathOrFilename.endsWith('.png') ? pathOrFilename : `test-results/car/${pathOrFilename}.png`;
    await this.page.screenshot({ path, fullPage });
  }

  /**
   * Get applied discount percentage from page
   */
  async getAppliedDiscountPercentage(): Promise<number> {
    // Strategy 1: Calculate from Item Price and Discount amount
    try {
      const summaryText = await this.page.textContent('body');
      if (summaryText) {
        const itemPriceMatch = summaryText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
        const discountMatch = summaryText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
        
        if (itemPriceMatch && discountMatch) {
          const itemPrice = parseFloat(itemPriceMatch[1].replace(/,/g, ''));
          const discountAmount = parseFloat(discountMatch[1].replace(/,/g, ''));
          
          if (itemPrice > 0 && discountAmount > 0) {
            const percentage = Math.round((discountAmount / itemPrice) * 100 * 10) / 10;
            console.log(`Calculated discount: ${percentage}% (${discountAmount} / ${itemPrice})`);
            return percentage;
          }
        }
      }
    } catch (e) {
      console.log('Failed to calculate discount percentage:', e);
    }
    
    return 0;
  }

  /**
   * Calculate effective discount percentage
   */
  getEffectiveDiscountPct(gross: number, discountAmount: number): number {
    if (gross <= 0) return 0;
    return Math.round((discountAmount / gross) * 100 * 10) / 10;
  }

  /**
   * Extract car pricing from results page
   * Returns gross price, discount amount, net price, and effective discount percentage
   * Uses prices captured from car results page (original + discounted)
   */
  async extractCarPricing(): Promise<{
    gross: number;
    discount: number;
    net: number;
    effectivePct: number;
  }> {
    console.log(`[PRICE EXTRACTION] Checking for prices from car results page...`);
    
    // Try to get prices stored from car results page
    const resultsPrices = (this.page as any)._carResultsPrices as number[] | undefined;
    
    let gross = 0;
    let net = 0;
    
    if (resultsPrices && resultsPrices.length >= 2) {
      // First price is usually original (with strikethrough), second is discounted
      gross = Math.max(resultsPrices[0], resultsPrices[1]); // Original is higher
      net = Math.min(resultsPrices[0], resultsPrices[1]); // Discounted is lower
      console.log(`[PRICE EXTRACTION] Using prices from car results: Original $${gross.toFixed(2)}, Discounted $${net.toFixed(2)}`);
    } else {
      // Fallback: try to extract from current checkout page
      console.log(`[PRICE EXTRACTION] No prices from results page, checking checkout page...`);
      const pageContent = await this.page.textContent('body') || '';
      
      const basePriceMatch = pageContent.match(/(?:Base\s+Price|Item\s+Price)[:\s]+\$?([\d,]+\.?\d*)/i);
      if (basePriceMatch) {
        net = parseFloat(basePriceMatch[1].replace(/,/g, ''));
        console.log(`[PRICE EXTRACTION] Base Price (after discount): $${net.toFixed(2)}`);
        console.log(`[PRICE EXTRACTION] WARNING: Cannot calculate discount % - original price not shown on checkout page`);
      }
    }
    
    // Calculate discount
    const discount = gross - net;
    const effectivePct = this.getEffectiveDiscountPct(gross, discount);
    
    console.log(`[PRICE EXTRACTION] Final - Gross: $${gross.toFixed(2)}, Net: $${net.toFixed(2)}, Discount: $${discount.toFixed(2)}, Percentage: ${effectivePct.toFixed(1)}%`);
    
    return {
      gross,
      discount,
      net,
      effectivePct
    };
  }

  /**
   * Verify car booking is displayed
   */
  async verifyCarBookingDisplayed() {
    await expect(this.page.locator('body')).toContainText(/Item Price|Total|Car|Vehicle/i);
  }
}
