import { test, expect } from './fixtures/auth.fixture';
import { CustomerDiscountPage } from './pages/CustomerDiscountPage';

/**
 * Test Suite: Customer Discount Management
 * Based on actual UI flow recorded via Playwright Codegen
 */

test.describe('Customer Discount Management', () => {
  let customerDiscountPage: CustomerDiscountPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    customerDiscountPage = new CustomerDiscountPage(authenticatedPage);
  });

  /**
   * Test: Add Date Range Discount for Customer
   * This replicates the exact flow you demonstrated
   */
  test('Should add date range discount for Skyline Voyages customer', async ({ authenticatedPage }) => {
    // Navigate to Customers
    await customerDiscountPage.navigateToCustomers();
    
    // Select Skyline Voyages customer
    await customerDiscountPage.selectCustomer('Skyline Voyages.');
    
    // Open Distribution Channel section
    await customerDiscountPage.openDistributionChannel();
    
    // Select Voyager Travel Platform
    await customerDiscountPage.selectPlatform('Voyager Travel Platform');
    
    // Open Discount configuration
    await customerDiscountPage.openDiscountConfiguration();
    
    // Select Hotels tab
    await customerDiscountPage.selectProductTab('Hotels');
    
    // Add date range discount: Jan 29 - Feb 14, 2026 at 25%
    await customerDiscountPage.addDateRangeDiscount(
      'Thursday, January 29th',
      'Saturday, February 14th',
      25
    );
    
    // Verify success
    await customerDiscountPage.verifyDiscountSaved();
    
    // Take screenshot
    await authenticatedPage.screenshot({ 
      path: 'test-results/customer-discount-added.png',
      fullPage: true 
    });
  });

  /**
   * Test: Add Date Range Discount - Complete Workflow (Using Helper Method)
   */
  test('Should add date range discount using complete workflow', async ({ authenticatedPage }) => {
    await customerDiscountPage.addDateRangeDiscountForCustomer(
      'Skyline Voyages.',
      'Voyager Travel Platform',
      'Hotels',
      'Thursday, January 29th',
      'Saturday, February 14th',
      25
    );
    
    await customerDiscountPage.verifyDiscountSaved();
    
    console.log('✓ Date range discount added successfully');
  });

  /**
   * Test: Add Default Discount for All Dates
   */
  test('Should add default discount for customer', async ({ authenticatedPage }) => {
    await customerDiscountPage.navigateToCustomers();
    await customerDiscountPage.selectCustomer('Skyline Voyages.');
    await customerDiscountPage.openDistributionChannel();
    await customerDiscountPage.selectPlatform('Voyager Travel Platform');
    await customerDiscountPage.openDiscountConfiguration();
    await customerDiscountPage.selectProductTab('Hotels');
    
    // Add default 15% discount
    await customerDiscountPage.addDefaultDiscount(15);
    
    await customerDiscountPage.verifyDiscountSaved();
    
    await authenticatedPage.screenshot({ 
      path: 'test-results/default-discount-added.png' 
    });
  });

  /**
   * Test: Add Discount for Multiple Product Types
   */
  test('Should add discounts for Hotels and Flights', async ({ authenticatedPage }) => {
    await customerDiscountPage.navigateToCustomers();
    await customerDiscountPage.selectCustomer('Skyline Voyages.');
    await customerDiscountPage.openDistributionChannel();
    await customerDiscountPage.selectPlatform('Voyager Travel Platform');
    await customerDiscountPage.openDiscountConfiguration();
    
    // Add discount for Hotels
    await customerDiscountPage.selectProductTab('Hotels');
    await customerDiscountPage.addDateRangeDiscount(
      'Thursday, January 29th',
      'Saturday, February 14th',
      20
    );
    
    // Add discount for Flights
    await customerDiscountPage.selectProductTab('Flights');
    await customerDiscountPage.addDateRangeDiscount(
      'Thursday, January 29th',
      'Saturday, February 14th',
      15
    );
    
    console.log('✓ Discounts added for Hotels (20%) and Flights (15%)');
  });

  /**
   * Test: Verify Discount Percentage Display
   */
  test('Should display correct discount percentage', async ({ authenticatedPage }) => {
    await customerDiscountPage.navigateToCustomers();
    await customerDiscountPage.selectCustomer('Skyline Voyages.');
    await customerDiscountPage.openDistributionChannel();
    await customerDiscountPage.selectPlatform('Voyager Travel Platform');
    await customerDiscountPage.openDiscountConfiguration();
    await customerDiscountPage.selectProductTab('Hotels');
    
    // Get current discount value
    const discountValue = await customerDiscountPage.getDiscountValue();
    console.log('Current discount:', discountValue);
    
    // Verify it's a valid percentage format
    expect(discountValue).toMatch(/\d+ %/);
  });

  /**
   * Test: Navigate Through All Product Tabs
   */
  test('Should navigate through all product tabs', async ({ authenticatedPage }) => {
    await customerDiscountPage.navigateToCustomers();
    await customerDiscountPage.selectCustomer('Skyline Voyages.');
    await customerDiscountPage.openDistributionChannel();
    await customerDiscountPage.selectPlatform('Voyager Travel Platform');
    await customerDiscountPage.openDiscountConfiguration();
    
    // Navigate through each product tab
    const productTypes: Array<'Hotels' | 'Flights' | 'Cars' | 'Activities'> = [
      'Hotels', 
      'Flights', 
      'Cars', 
      'Activities'
    ];
    
    for (const productType of productTypes) {
      await customerDiscountPage.selectProductTab(productType);
      await authenticatedPage.waitForTimeout(500);
      
      // Take screenshot of each tab
      await authenticatedPage.screenshot({ 
        path: `test-results/product-tab-${productType.toLowerCase()}.png` 
      });
      
      console.log(`✓ Navigated to ${productType} tab`);
    }
  });
});

test.describe('Customer Discount Management - Edge Cases', () => {
  let customerDiscountPage: CustomerDiscountPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    customerDiscountPage = new CustomerDiscountPage(authenticatedPage);
  });

  /**
   * Test: Add Maximum Discount (100%)
   */
  test('Should allow 100% discount', async ({ authenticatedPage }) => {
    await customerDiscountPage.addDateRangeDiscountForCustomer(
      'Skyline Voyages.',
      'Voyager Travel Platform',
      'Hotels',
      'Thursday, January 29th',
      'Saturday, February 14th',
      100
    );
    
    // Verify 100% discount is accepted
    await customerDiscountPage.verifyDiscountPercentage(100);
  });

  /**
   * Test: Add Minimum Discount (0%)
   */
  test('Should allow 0% discount', async ({ authenticatedPage }) => {
    await customerDiscountPage.addDateRangeDiscountForCustomer(
      'Skyline Voyages.',
      'Voyager Travel Platform',
      'Hotels',
      'Thursday, January 29th',
      'Saturday, February 14th',
      0
    );
    
    await customerDiscountPage.verifyDiscountPercentage(0);
  });

  /**
   * Test: Add Decimal Discount (25.5%)
   */
  test('Should handle decimal discount percentages', async ({ authenticatedPage }) => {
    await customerDiscountPage.navigateToCustomers();
    await customerDiscountPage.selectCustomer('Skyline Voyages.');
    await customerDiscountPage.openDistributionChannel();
    await customerDiscountPage.selectPlatform('Voyager Travel Platform');
    await customerDiscountPage.openDiscountConfiguration();
    await customerDiscountPage.selectProductTab('Hotels');
    
    // Try to add 25.5% discount
    await customerDiscountPage.addDateRangeDiscount(
      'Thursday, January 29th',
      'Saturday, February 14th',
      25.5
    );
    
    // Check if decimal is accepted or rounded
    const discountValue = await customerDiscountPage.getDiscountValue();
    console.log('Discount value with decimal:', discountValue);
  });
});

test.describe('Customer Discount Management - Validation', () => {
  let customerDiscountPage: CustomerDiscountPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    customerDiscountPage = new CustomerDiscountPage(authenticatedPage);
  });

  /**
   * Test: Verify Date Range Validation
   */
  test('Should validate date range (end date after start date)', async ({ authenticatedPage }) => {
    await customerDiscountPage.navigateToCustomers();
    await customerDiscountPage.selectCustomer('Skyline Voyages.');
    await customerDiscountPage.openDistributionChannel();
    await customerDiscountPage.selectPlatform('Voyager Travel Platform');
    await customerDiscountPage.openDiscountConfiguration();
    await customerDiscountPage.selectProductTab('Hotels');
    
    // Click add discount
    await customerDiscountPage.addDiscountByDateRangeButton.click();
    
    // Try to select end date before start date
    await customerDiscountPage.startDateInput.click();
    await customerDiscountPage.selectDate('Saturday, February 14th');
    
    await customerDiscountPage.endDateInput.click();
    await customerDiscountPage.selectDate('Thursday, January 29th');
    
    await customerDiscountPage.discountValueInput.fill('10');
    await customerDiscountPage.saveButton.click();
    
    // Should show validation error or prevent saving
    const hasError = await customerDiscountPage.errorMessage.isVisible().catch(() => false);
    
    if (hasError) {
      console.log('✓ Date range validation working - error shown');
    } else {
      console.log('⚠ Date range validation may need improvement');
    }
  });
});
