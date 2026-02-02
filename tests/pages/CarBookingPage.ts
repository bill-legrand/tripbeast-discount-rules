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
   * Navigate to car booking page with JWT authentication and date parameters
   * Uses URL query parameters for direct car booking navigation
   */
  async gotoCarBookingWithDates(
    pickupDate: string,
    dropoffDate: string,
    jwtToken: string,
    carParams?: {
      pickup_location?: string;
      dropoff_location?: string;
      car_id?: string;
      vehicle_type?: string;
      pickup_time?: string;
      dropoff_time?: string;
      renter_age?: string;
      [key: string]: string | undefined;
    }
  ) {
    // Ancillary engine (travel.tripbeast.com) - Ancii Stage DR for Tripbeast Ancillary
    const baseUrl = 'https://travel.tripbeast.com';
    
    // First navigate to base URL with JWT to authenticate
    await this.page.goto(`${baseUrl}/?jwt=${jwtToken}`);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    if (carParams) {
      // Build URL for specific car booking page
      const params = new URLSearchParams({
        page: 'car',
        pickup_date: pickupDate,
        dropoff_date: dropoffDate,
        pickup_time: carParams.pickup_time || '10:00',
        dropoff_time: carParams.dropoff_time || '10:00',
        renter_age: carParams.renter_age || '30',
        ...carParams
      } as Record<string, string>);
      
      const url = `${baseUrl}/?${params.toString()}`;
      await this.page.goto(url);
    } else {
      // Build URL for car search page
      const params = new URLSearchParams({
        page: 'car',
        pickup_date: pickupDate,
        dropoff_date: dropoffDate
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
                 text.includes('Pick-up') ||
                 text.match(/\$\s*\d+/) !== null ||
                 text.length > 10000;
        },
        { timeout: 15000 }
      );
      console.log('✓ Car booking page content loaded');
    } catch (e) {
      console.log('⚠️ Warning: Car booking page content may not have fully loaded');
    }
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
   */
  async screenshotCarBooking(filename: string, fullPage: boolean = false) {
    await this.page.screenshot({ 
      path: `test-results/car-screenshots/${filename}.png`,
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
   * Verify car booking is displayed
   */
  async verifyCarBookingDisplayed() {
    await expect(this.page.locator('body')).toContainText(/Item Price|Total|Car|Vehicle/i);
  }
}
