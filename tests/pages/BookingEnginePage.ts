import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Booking Engine
 * Handles price display, strike-through, and discount verification
 */
export class BookingEnginePage {
  readonly page: Page;
  
  // Product Elements
  readonly productCard: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly originalPrice: Locator;
  readonly discountedPrice: Locator;
  readonly strikeThroughPrice: Locator;
  readonly discountBadge: Locator;
  readonly discountPercentage: Locator;
  readonly savingsAmount: Locator;
  
  // Search and Filter
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly filterButton: Locator;
  
  // Booking Details
  readonly checkInDate: Locator;
  readonly checkOutDate: Locator;
  readonly guestsInput: Locator;
  readonly bookNowButton: Locator;
  
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
    
    // Product Elements
    this.productCard = page.locator('.product-card, .hotel-card, [data-testid="product-card"]');
    this.productTitle = page.locator('.product-title, .hotel-name, h2, h3, [data-testid="product-title"]');
    this.productPrice = page.locator('.price, .product-price, [data-testid="product-price"]');
    this.originalPrice = page.locator('.original-price, .price-original, [data-testid="original-price"]');
    this.discountedPrice = page.locator('.discounted-price, .price-discounted, .final-price, [data-testid="discounted-price"]');
    this.strikeThroughPrice = page.locator('.strike-through, .price-strike, del, s, [data-testid="strike-through-price"]');
    this.discountBadge = page.locator('.discount-badge, .badge-discount, [data-testid="discount-badge"]');
    this.discountPercentage = page.locator('.discount-percentage, [data-testid="discount-percentage"]');
    this.savingsAmount = page.locator('.savings, .you-save, [data-testid="savings-amount"]');
    
    // Search and Filter
    this.searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
    this.searchButton = page.locator('button:has-text("Search"), [data-testid="search-button"]');
    this.filterButton = page.locator('button:has-text("Filter"), [data-testid="filter-button"]');
    
    // Booking Details
    this.checkInDate = page.locator('input[name="checkIn"], input[name="check_in"], [data-testid="check-in-date"]');
    this.checkOutDate = page.locator('input[name="checkOut"], input[name="check_out"], [data-testid="check-out-date"]');
    this.guestsInput = page.locator('input[name="guests"], select[name="guests"], [data-testid="guests-input"]');
    this.bookNowButton = page.locator('button:has-text("Book Now"), button:has-text("Reserve"), [data-testid="book-now-button"]');
    
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
   * Navigate to booking engine
   */
  async goto(engineType: 'ancillary' | 'cug' | 'b2c' = 'cug') {
    const urls = {
      ancillary: process.env.ANCILLARY_BE_URL || '/ancillary',
      cug: process.env.CUG_BE_URL || '/cug',
      b2c: process.env.B2C_BE_URL || '/b2c'
    };
    
    await this.page.goto(urls[engineType]);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to hotel booking page
   */
  async gotoHotelBooking(url: string = 'https://bookings.tripbeast.com/?page=hotel') {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to hotel booking with JWT authentication and date parameters
   * Uses URL query parameters instead of form inputs
   */
  async gotoHotelBookingWithDates(
    checkInDate: string, 
    checkOutDate: string, 
    jwtToken: string,
    hotelParams?: {
      hotel_id?: string;
      property_id?: string;
      room_id?: string;
      search_query?: string;
      mobile_promotion?: string;
      longitude?: string;
      latitude?: string;
      type?: string;
      gds?: string;
      [key: string]: string | undefined;
    }
  ) {
    let url: string;
    
    // First navigate to base URL with JWT to authenticate
    await this.page.goto(`https://bookings.tripbeast.com/?jwt=${jwtToken}`);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    if (hotelParams) {
      // Build URL for specific hotel booking page (JWT is already set in session/cookies)
      const params = new URLSearchParams({
        checkin: checkInDate,
        checkout: checkOutDate,
        adults: '1',
        children: '',
        ...hotelParams
      } as Record<string, string>);
      url = `https://bookings.tripbeast.com/hotel/hotel-booking?${params.toString()}`;
    } else {
      // Build URL for hotel search page
      const params = new URLSearchParams({
        page: 'hotel',
        checkin: checkInDate,
        checkout: checkOutDate
      });
      url = `https://bookings.tripbeast.com/?${params.toString()}`;
    }
    
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
    
    // Wait for React app to render content (not just framework code)
    // Look for any of these indicators that the page has loaded:
    // - Price text (Item Price, Total, etc.)
    // - Hotel name/content
    // - Any dollar amounts
    try {
      await this.page.waitForFunction(
        () => {
          const text = document.body.textContent || '';
          return text.includes('Item Price') || 
                 text.includes('Total') || 
                 text.includes('Check-in') ||
                 text.match(/\$\s*\d+/) !== null ||
                 text.length > 10000; // Page has substantial content
        },
        { timeout: 15000 }
      );
      console.log('✓ Page content loaded');
    } catch (e) {
      console.log('⚠️ Warning: Page content may not have fully loaded');
    }
  }

  /**
   * Search for a product
   */
  async searchProduct(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search hotels with check-in and check-out dates
   */
  async searchHotelsWithDates(checkInDate: string, checkOutDate: string, destination?: string) {
    if (destination) {
      await this.searchInput.fill(destination);
    }
    
    await this.checkInDate.fill(checkInDate);
    await this.checkOutDate.fill(checkOutDate);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select a product by name
   */
  async selectProduct(productName: string) {
    const product = this.page.locator(`.product-card:has-text("${productName}"), .hotel-card:has-text("${productName}")`);
    await product.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the displayed price (main price shown to user)
   */
  async getDisplayedPrice(): Promise<number> {
    const priceText = await this.productPrice.first().textContent();
    return this.extractPrice(priceText || '');
  }

  /**
   * Get the original price (before discount)
   */
  async getOriginalPrice(): Promise<number> {
    const priceText = await this.originalPrice.first().textContent();
    return this.extractPrice(priceText || '');
  }

  /**
   * Get the discounted price
   */
  async getDiscountedPrice(): Promise<number> {
    const priceText = await this.discountedPrice.first().textContent();
    return this.extractPrice(priceText || '');
  }

  /**
   * Get all strike-through prices
   */
  async getStrikeThroughPrices(): Promise<number[]> {
    const elements = await this.strikeThroughPrice.all();
    const prices: number[] = [];
    
    for (const element of elements) {
      const text = await element.textContent();
      prices.push(this.extractPrice(text || ''));
    }
    
    return prices;
  }

  /**
   * Extract numeric price from text (handles $, €, £, etc.)
   */
  private extractPrice(text: string): number {
    const match = text.match(/[\d,]+\.?\d*/);
    if (!match) return 0;
    return parseFloat(match[0].replace(/,/g, ''));
  }

  /**
   * Verify strike-through display - Case 1: Both ON
   * Expected: ~~$1200~~ ~~$1000~~ $900
   */
  async verifyStrikeThroughCase1(supplierOriginal: number, supplierPrice: number, finalPrice: number) {
    const strikeThroughPrices = await this.getStrikeThroughPrices();
    
    expect(strikeThroughPrices).toHaveLength(2);
    expect(strikeThroughPrices[0]).toBe(supplierOriginal);
    expect(strikeThroughPrices[1]).toBe(supplierPrice);
    
    const displayedPrice = await this.getDiscountedPrice();
    expect(displayedPrice).toBe(finalPrice);
  }

  /**
   * Verify strike-through display - Case 2: Hotel OFF, Discount ON
   * Expected: ~~$1000~~ $900
   */
  async verifyStrikeThroughCase2(originalPrice: number, finalPrice: number) {
    const strikeThroughPrices = await this.getStrikeThroughPrices();
    
    expect(strikeThroughPrices).toHaveLength(1);
    expect(strikeThroughPrices[0]).toBe(originalPrice);
    
    const displayedPrice = await this.getDiscountedPrice();
    expect(displayedPrice).toBe(finalPrice);
  }

  /**
   * Verify strike-through display - Case 3: Hotel ON, Discount OFF
   * Expected: $900 (no strike-through)
   */
  async verifyStrikeThroughCase3(finalPrice: number) {
    const strikeThroughPrices = await this.getStrikeThroughPrices();
    expect(strikeThroughPrices).toHaveLength(0);
    
    const displayedPrice = await this.getDisplayedPrice();
    expect(displayedPrice).toBe(finalPrice);
  }

  /**
   * Verify strike-through display - Case 4: Both OFF
   * Expected: $900 (no strike-through)
   */
  async verifyStrikeThroughCase4(finalPrice: number) {
    const strikeThroughPrices = await this.getStrikeThroughPrices();
    expect(strikeThroughPrices).toHaveLength(0);
    
    const displayedPrice = await this.getDisplayedPrice();
    expect(displayedPrice).toBe(finalPrice);
  }

  /**
   * Verify discount badge is displayed
   */
  async verifyDiscountBadge(expectedPercentage: number) {
    await expect(this.discountBadge).toBeVisible();
    const badgeText = await this.discountBadge.textContent();
    expect(badgeText).toContain(`${expectedPercentage}%`);
  }

  /**
   * Verify savings amount is displayed
   */
  async verifySavingsAmount(expectedSavings: number) {
    await expect(this.savingsAmount).toBeVisible();
    const savingsText = await this.savingsAmount.textContent();
    const actualSavings = this.extractPrice(savingsText || '');
    expect(actualSavings).toBe(expectedSavings);
  }

  /**
   * Get price breakdown
   * Uses text pattern matching to find prices on the page
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
    
    // Extract Item Price (subtotal before discount)
    const itemPriceMatch = pageContent.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
    const itemPrice = itemPriceMatch ? parseFloat(itemPriceMatch[1].replace(/,/g, '')) : 0;
    
    // Extract Discount
    const discountMatch = pageContent.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
    const discount = discountMatch ? parseFloat(discountMatch[1].replace(/,/g, '')) : 0;
    
    // Extract Tax
    const taxMatch = pageContent.match(/(?:Tax|Taxes)[:\s]+\$?([\d,]+\.?\d*)/i);
    const tax = taxMatch ? parseFloat(taxMatch[1].replace(/,/g, '')) : 0;
    
    // Extract Fees
    const feesMatch = pageContent.match(/(?:Fees|Service\s+Fee)[:\s]+\$?([\d,]+\.?\d*)/i);
    const fees = feesMatch ? parseFloat(feesMatch[1].replace(/,/g, '')) : 0;
    
    // Extract Total (including "Total Price" used by Ancillary)
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
   * Verify discount is applied on subtotal only (not on taxes/fees)
   */
  async verifyDiscountOnSubtotalOnly(
    basePrice: number,
    markup: number,
    discountPercentage: number,
    tax: number,
    fees: number
  ) {
    const breakdown = await this.getPriceBreakdown();
    
    const expectedSubtotal = basePrice + markup;
    const expectedDiscount = (expectedSubtotal * discountPercentage) / 100;
    const expectedDiscountedSubtotal = expectedSubtotal - expectedDiscount;
    const expectedTotal = expectedDiscountedSubtotal + tax + fees;
    
    expect(breakdown.subtotal).toBeCloseTo(expectedDiscountedSubtotal, 2);
    expect(breakdown.discount).toBeCloseTo(expectedDiscount, 2);
    expect(breakdown.tax).toBe(tax);
    expect(breakdown.fees).toBe(fees);
    expect(breakdown.total).toBeCloseTo(expectedTotal, 2);
  }

  /**
   * Click Book Now button
   */
  async clickBookNow() {
    await this.bookNowButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify product is displayed
   */
  async verifyProductDisplayed(productName: string) {
    const product = this.page.locator(`.product-card:has-text("${productName}"), .hotel-card:has-text("${productName}")`);
    await expect(product).toBeVisible();
  }

  /**
   * Take screenshot of price display
   */
  async screenshotPriceDisplay(filename: string) {
    await this.productCard.first().screenshot({ path: `screenshots/${filename}.png` });
  }

  /**
   * Verify discount percentage is displayed
   */
  async verifyDiscountPercentageDisplayed(percentage: number) {
    await expect(this.discountPercentage).toBeVisible();
    const text = await this.discountPercentage.textContent();
    expect(text).toContain(`${percentage}%`);
  }

  /**
   * Check if discount is applied
   */
  async isDiscountApplied(): Promise<boolean> {
    return await this.discountBadge.isVisible() || await this.strikeThroughPrice.isVisible();
  }

  /**
   * Get discount percentage from badge or price display
   * Uses multiple strategies to find discount percentage anywhere on the page
   */
  async getAppliedDiscountPercentage(): Promise<number> {
    // Strategy 1: Calculate from Item Price and Discount amount in Summary
    try {
      // Look for "Item Price" and "Discount" in the price summary
      const summaryText = await this.page.textContent('body');
      if (summaryText) {
        // Extract Item Price
        const itemPriceMatch = summaryText.match(/Item\s+Price[:\s]+\$?([\d,]+\.?\d*)/i);
        // Extract Discount amount (may be negative)
        const discountMatch = summaryText.match(/Discount[:\s]+-?\$?([\d,]+\.?\d*)/i);
        
        if (itemPriceMatch && discountMatch) {
          const itemPrice = parseFloat(itemPriceMatch[1].replace(/,/g, ''));
          const discountAmount = parseFloat(discountMatch[1].replace(/,/g, ''));
          
          if (itemPrice > 0 && discountAmount > 0) {
            const percentage = Math.round((discountAmount / itemPrice) * 100);
            console.log(`Calculated discount: ${percentage}% (${discountAmount} / ${itemPrice})`);
            return percentage;
          }
        }
      }
    } catch (e) {
      console.log('Strategy 1 failed:', e);
    }
    
    // Strategy 2: Try discount badge locator
    try {
      const badgeText = await this.discountBadge.first().textContent({ timeout: 3000 });
      if (badgeText) {
        const match = badgeText.match(/(\d+(?:\.\d+)?)\s*%/);
        if (match) return parseFloat(match[1]);
      }
    } catch (e) {
      // Badge not found, continue to next strategy
    }
    
    // Strategy 3: Search entire page content for discount percentage
    try {
      const pageContent = await this.page.textContent('body');
      if (pageContent) {
        // Look for patterns like "15%", "15% off", "15% discount", "Save 15%"
        const patterns = [
          /(\d+(?:\.\d+)?)\s*%\s*(?:off|discount|save)/i,
          /(?:save|discount)\s*(?:of)?\s*(\d+(?:\.\d+)?)\s*%/i,
          /discount[:\s]+(\d+(?:\.\d+)?)\s*%/i
        ];
        
        for (const pattern of patterns) {
          const match = pageContent.match(pattern);
          if (match) return parseFloat(match[1]);
        }
      }
    } catch (e) {
      // Page content not accessible
    }
    
    // Strategy 4: Look in price section/summary
    try {
      const priceSelectors = [
        '[class*="price"]',
        '[class*="summary"]',
        '[class*="discount"]',
        '[class*="savings"]',
        '.price-details',
        '.booking-details'
      ];
      
      for (const selector of priceSelectors) {
        const elements = await this.page.locator(selector).all();
        for (const element of elements) {
          const text = await element.textContent().catch(() => '');
          const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
          if (match) {
            const value = parseFloat(match[1]);
            // Filter out unreasonable values
            if (value >= 10 && value <= 50) {
              return value;
            }
          }
        }
      }
    } catch (e) {
      // Price section not found
    }
    
    return 0;
  }

  /**
   * Calculate expected discount based on day of week
   */
  calculateDOWDiscount(date: Date): number {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dowDiscounts: { [key: number]: number } = {
      0: 10,  // Sunday
      1: 15,  // Monday
      2: 20,  // Tuesday
      3: 25,  // Wednesday
      4: 30,  // Thursday
      5: 35,  // Friday
      6: 40   // Saturday
    };
    return dowDiscounts[dayOfWeek] || 0;
  }

  /**
   * Verify DOW discount is applied correctly for a date
   */
  async verifyDOWDiscountForDate(checkInDate: Date) {
    const expectedDiscount = this.calculateDOWDiscount(checkInDate);
    const appliedDiscount = await this.getAppliedDiscountPercentage();
    
    expect(appliedDiscount).toBe(expectedDiscount);
  }
}
