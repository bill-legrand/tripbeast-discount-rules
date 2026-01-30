import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Customer Discount Management
 * Based on actual UI flow: Management → Customers → Distribution Channel → Discount Rules
 */
export class CustomerDiscountPage {
  readonly page: Page;
  
  // Navigation
  readonly managementButton: Locator;
  readonly customersLink: Locator;
  
  // Customer Selection
  readonly customerTable: Locator;
  
  // Customer Details
  readonly viewButton: Locator;
  readonly distributionChannelButton: Locator;
  readonly discountRuleText: Locator;
  
  // Platform/Channel Selection
  readonly platformButton: Locator;
  readonly discountButton: Locator;
  
  // Product Tabs
  readonly hotelsTab: Locator;
  readonly flightsTab: Locator;
  readonly carsTab: Locator;
  readonly activitiesTab: Locator;
  
  // Discount Actions
  readonly addDiscountByDateRangeButton: Locator;
  readonly addDiscountBySpecificDateButton: Locator;
  readonly addDefaultDiscountButton: Locator;
  
  // Date Inputs
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  
  // Discount Input
  readonly discountValueInput: Locator;
  
  // Actions
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  
  // Messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Navigation
    this.managementButton = page.getByRole('button', { name: 'Management' });
    this.customersLink = page.getByRole('link', { name: 'Customers' });
    
    // Customer Selection
    this.customerTable = page.locator('table');
    
    // Customer Details
    this.viewButton = page.getByRole('button', { name: 'View' });
    this.distributionChannelButton = page.getByRole('button', { name: 'Distribution Channel' });
    this.discountRuleText = page.getByText('Discount Rule', { exact: true });
    
    // Platform/Channel Selection
    this.platformButton = page.getByRole('button', { name: /Voyager Travel Platform|Platform/ });
    this.discountButton = page.getByRole('button', { name: /Discount/ });
    
    // Product Tabs
    this.hotelsTab = page.getByRole('tab', { name: 'Hotels' });
    this.flightsTab = page.getByRole('tab', { name: 'Flights' });
    this.carsTab = page.getByRole('tab', { name: 'Cars' });
    this.activitiesTab = page.getByRole('tab', { name: 'Activities' });
    
    // Discount Actions
    this.addDiscountByDateRangeButton = page.getByRole('button', { name: 'Add Discount By Date Range' });
    this.addDiscountBySpecificDateButton = page.getByRole('button', { name: 'Add Discount By Specific Date' });
    this.addDefaultDiscountButton = page.getByRole('button', { name: 'Add Default Discount' });
    
    // Date Inputs
    this.startDateInput = page.getByRole('textbox', { name: 'Start Date' });
    this.endDateInput = page.getByRole('textbox', { name: 'End Date' });
    
    // Discount Input
    this.discountValueInput = page.locator('input[name="default_discount_value"]');
    
    // Actions
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    
    // Messages
    this.successMessage = page.locator('.success, .alert-success, [role="alert"]:has-text("Success")');
    this.errorMessage = page.locator('.error, .alert-error, [role="alert"]:has-text("Error")');
  }

  /**
   * Navigate to Customers page via Management menu
   */
  async navigateToCustomers() {
    await this.managementButton.click();
    await this.customersLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select a customer by name
   */
  async selectCustomer(customerName: string) {
    await this.page.getByRole('cell', { name: customerName }).click();
    await this.viewButton.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to Distribution Channel section
   */
  async openDistributionChannel() {
    await this.distributionChannelButton.click();
    await this.discountRuleText.click();
    await this.page.waitForTimeout(500); // Wait for accordion animation
  }

  /**
   * Select a platform/channel
   */
  async selectPlatform(platformName: string) {
    await this.page.getByRole('button', { name: platformName }).click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Open discount configuration for a platform
   */
  async openDiscountConfiguration(platformName?: string) {
    if (platformName) {
      await this.selectPlatform(platformName);
    }
    await this.discountButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Select product type tab
   */
  async selectProductTab(productType: 'Hotels' | 'Flights' | 'Cars' | 'Activities') {
    const tabs = {
      'Hotels': this.hotelsTab,
      'Flights': this.flightsTab,
      'Cars': this.carsTab,
      'Activities': this.activitiesTab
    };
    
    await tabs[productType].click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Add a date range discount
   */
  async addDateRangeDiscount(startDate: string, endDate: string, percentage: number) {
    await this.addDiscountByDateRangeButton.click();
    
    // Select start date
    await this.startDateInput.click();
    await this.selectDate(startDate);
    
    // Select end date
    await this.endDateInput.click();
    await this.selectDate(endDate);
    
    // Enter discount percentage
    await this.discountValueInput.click();
    await this.discountValueInput.fill(percentage.toString());
    
    // Save
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select a date from the date picker
   * @param dateText - e.g., "Thursday, January 29th, 2026"
   */
  async selectDate(dateText: string) {
    // Wait for date picker to open
    await this.page.waitForTimeout(300);
    
    // Try to find the date option
    const dateOption = this.page.getByRole('option', { name: new RegExp(dateText, 'i') });
    
    // Check if we need to navigate months
    const isVisible = await dateOption.isVisible().catch(() => false);
    
    if (!isVisible) {
      // Click next month button if needed
      const nextMonthButton = this.page.getByRole('button', { name: 'Next Month', exact: true });
      await nextMonthButton.click();
      await this.page.waitForTimeout(300);
    }
    
    await dateOption.click();
  }

  /**
   * Add a default discount (applies to all dates)
   */
  async addDefaultDiscount(percentage: number) {
    await this.addDefaultDiscountButton.click();
    await this.discountValueInput.fill(percentage.toString());
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Complete workflow: Navigate to customer and add date range discount
   */
  async addDateRangeDiscountForCustomer(
    customerName: string,
    platformName: string,
    productType: 'Hotels' | 'Flights' | 'Cars' | 'Activities',
    startDate: string,
    endDate: string,
    percentage: number
  ) {
    // Navigate to customers
    await this.navigateToCustomers();
    
    // Select customer
    await this.selectCustomer(customerName);
    
    // Open distribution channel
    await this.openDistributionChannel();
    
    // Select platform
    await this.selectPlatform(platformName);
    
    // Open discount configuration
    await this.openDiscountConfiguration();
    
    // Select product tab
    await this.selectProductTab(productType);
    
    // Add date range discount
    await this.addDateRangeDiscount(startDate, endDate, percentage);
  }

  /**
   * Verify discount was saved successfully
   */
  async verifyDiscountSaved() {
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get current discount value for a cell
   */
  async getDiscountValue(): Promise<string> {
    const cell = this.page.getByRole('cell', { name: /\d+ %/ });
    return await cell.textContent() || '0 %';
  }

  /**
   * Verify discount percentage is displayed
   */
  async verifyDiscountPercentage(expectedPercentage: number) {
    const discountText = await this.getDiscountValue();
    expect(discountText).toContain(`${expectedPercentage} %`);
  }
}
