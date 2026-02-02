import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Cruise Booking Engine
 * Handles cruise price display, discounts, and verification
 * Uses travel.tripbeast.com with Ancillary JWT
 */
export class CruiseBookingPage {
  readonly page: Page;
  
  // Cruise Search Elements
  readonly departureDateInput: Locator;
  readonly returnDateInput: Locator;
  readonly departurePortInput: Locator;
  readonly destinationInput: Locator;
  readonly cruiseLineInput: Locator;
  readonly passengersInput: Locator;
  readonly searchCruisesButton: Locator;
  
  // Cruise Result Elements
  readonly cruiseCard: Locator;
  readonly cruiseTitle: Locator;
  readonly cruisePrice: Locator;
  readonly selectCruiseButton: Locator;
  
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
    
    // Cruise Search Elements
    this.departureDateInput = page.locator('input[placeholder*="Departure"], input[name="departure_date"], [data-testid="departure-date"]');
    this.returnDateInput = page.locator('input[placeholder*="Return"], input[name="return_date"], [data-testid="return-date"]');
    this.departurePortInput = page.locator('input[placeholder*="Departure Port"], input[name="departure_port"], [data-testid="departure-port"]');
    this.destinationInput = page.locator('input[placeholder*="Destination"], input[name="destination"], [data-testid="destination"]');
    this.cruiseLineInput = page.locator('input[placeholder*="Cruise Line"], input[name="cruise_line"], [data-testid="cruise-line"]');
    this.passengersInput = page.locator('input[name="passengers"], [data-testid="passengers"]');
    this.searchCruisesButton = page.locator('button:has-text("Search Cruises"), button:has-text("Find Cruises"), [data-testid="search-cruises-button"]');
    
    // Cruise Result Elements
    this.cruiseCard = page.locator('.cruise-card, .cruise-result, [data-testid="cruise-card"]');
    this.cruiseTitle = page.locator('.cruise-title, .cruise-name, h2, h3, [data-testid="cruise-title"]');
    this.cruisePrice = page.locator('.price, .cruise-price, [data-testid="cruise-price"]');
    this.selectCruiseButton = page.locator('button:has-text("Select"), button:has-text("Book"), button:has-text("View"), [data-testid="select-cruise-button"]');
    
    // Price Breakdown
    this.subtotalLabel = page.locator('text=Subtotal, text=Item Price, [data-testid="subtotal-label"]');
    this.subtotalAmount = page.locator('[data-testid="subtotal-amount"], .subtotal-amount');
    this.taxLabel = page.locator('text=Tax, text=Taxes, [data-testid="tax-label"]');
    this.taxAmount = page.locator('[data-testid="tax-amount"], .tax-amount');
    this.feesLabel = page.locator('text=Fees, text=Port Fees, text=Service Fee, [data-testid="fees-label"]');
    this.feesAmount = page.locator('[data-testid="fees-amount"], .fees-amount');
    this.totalLabel = page.locator('text=Total, text=Grand Total, [data-testid="total-label"]');
    this.totalAmount = page.locator('[data-testid="total-amount"], .total-amount');
    this.discountLabel = page.locator('text=Discount, [data-testid="discount-label"]');
    this.discountAmount = page.locator('[data-testid="discount-amount"], .discount-amount');
  }

  /**
   * Navigate to cruise booking page with JWT authentication and date parameters
   * Uses URL query parameters for direct cruise booking navigation
   */
  async gotoCruiseBookingWithDates(
    startDate: string,
    endDate: string,
    jwtToken: string,
    cruiseParams?: {
      departure_port?: string;
      destination?: string;
      cruise_line?: string;
      ship_name?: string;
      cabin_type?: string;
      passengers?: string;
      [key: string]: string | undefined;
    }
  ) {
    // Ancillary engine (travel.tripbeast.com) - Ancii Stage DR for Tripbeast Ancillary
    const baseUrl = 'https://travel.tripbeast.com';
    
    // First navigate to base URL with JWT to authenticate
    await this.page.goto(`${baseUrl}/?jwt=${jwtToken}`);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    if (cruiseParams) {
      // Build URL for specific cruise booking page
      const params = new URLSearchParams({
        page: 'cruise',
        departure_date: startDate,
        return_date: endDate,
        passengers: cruiseParams.passengers || '2',
        ...cruiseParams
      } as Record<string, string>);
      
      const url = `${baseUrl}/?${params.toString()}`;
      await this.page.goto(url);
    } else {
      // Build URL for cruise search page
      const params = new URLSearchParams({
        page: 'cruise',
        departure_date: startDate,
        return_date: endDate
      });
      const url = `${baseUrl}/?${params.toString()}`;
      await this.page.goto(url);
    }
    
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
    
    // Wait for page content to render
    try {
      await this.page.waitForFunction(
        () => {
          const text = document.body.textContent || '';
          return text.includes('Item Price') || 
                 text.includes('Total') || 
                 text.includes('Cruise') ||
                 text.includes('Departure') ||
                 text.match(/\$\s*\d+/) !== null ||
                 text.length > 10000;
        },
        { timeout: 15000 }
      );
      console.log('✓ Cruise booking page content loaded');
    } catch (e) {
      console.log('⚠️ Warning: Cruise booking page content may not have fully loaded');
    }
  }

  /**
   * Get price breakdown from cruise booking page
   * Uses text pattern matching similar to hotel/car booking
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
    
    // Extract Fees (including Port Fees)
    const feesMatch = pageContent.match(/(?:Fees|Port\s+Fees|Service\s+Fee)[:\s]+\$?([\d,]+\.?\d*)/i);
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
   * Get the displayed price for a cruise
   */
  async getDisplayedPrice(): Promise<number> {
    const priceText = await this.cruisePrice.first().textContent();
    return this.extractPrice(priceText || '');
  }

  /**
   * Select a cruise from results
   */
  async selectCruise(cruiseName?: string) {
    if (cruiseName) {
      const cruise = this.page.locator(`.cruise-card:has-text("${cruiseName}"), .cruise-result:has-text("${cruiseName}")`);
      await cruise.click();
    } else {
      await this.selectCruiseButton.first().click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot of cruise booking page
   */
  async screenshotCruiseBooking(filename: string, fullPage: boolean = false) {
    await this.page.screenshot({ 
      path: `test-results/cruise-screenshots/${filename}.png`,
      fullPage
    });
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
   * Verify cruise booking is displayed
   */
  async verifyCruiseBookingDisplayed() {
    await expect(this.page.locator('body')).toContainText(/Item Price|Total|Cruise|Cabin|Departure/i);
  }
}
