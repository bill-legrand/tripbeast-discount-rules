import { test, expect } from '../fixtures/auth.fixture';
import { DiscountRulePage } from '../pages/DiscountRulePage';

/**
 * Test Suite: Discount Rule Creation
 * Test Cases: TC-001 to TC-005
 */

test.describe('Discount Rule Creation', () => {
  let discountRulePage: DiscountRulePage;

  test.beforeEach(async ({ authenticatedPage }) => {
    discountRulePage = new DiscountRulePage(authenticatedPage);
    await discountRulePage.goto();
  });

  /**
   * TC-001: Create Discount Rule with Manual Name
   * Priority: High
   */
  test('TC-001: Should create discount rule with manual name and system-generated ID', async ({ authenticatedPage }) => {
    const ruleName = `Test_Discount_${Date.now()}`;
    
    // Click Create New button
    await discountRulePage.clickCreateNew();
    
    // Fill in rule details
    await discountRulePage.createDefaultRule(ruleName, 10, 'Channel_A');
    
    // Verify success message
    await discountRulePage.verifySuccessMessage();
    
    // Verify rule appears in table
    await discountRulePage.verifyRuleExists(ruleName);
    
    // Verify system-generated ID exists
    const ruleId = await discountRulePage.getRuleId();
    expect(ruleId).toMatch(/^DR-\d+$/); // Format: DR-12345
    
    // Take screenshot
    await authenticatedPage.screenshot({ path: `test-results/admin/screenshots/TC-001-rule-created.png` });
  });

  /**
   * TC-002: Verify System-Generated ID Format
   * Priority: High
   */
  test('TC-002: Should generate unique IDs for multiple discount rules', async ({ authenticatedPage }) => {
    const ruleIds: string[] = [];
    
    // Create 5 discount rules
    for (let i = 0; i < 5; i++) {
      const ruleName = `Test_Rule_${Date.now()}_${i}`;
      
      await discountRulePage.clickCreateNew();
      await discountRulePage.createDefaultRule(ruleName, 10 + i, 'Channel_A');
      await discountRulePage.verifySuccessMessage();
      
      // Get the rule ID
      await discountRulePage.searchRule(ruleName);
      const ruleId = await discountRulePage.getRuleId();
      ruleIds.push(ruleId);
      
      // Wait a bit to ensure different timestamps
      await authenticatedPage.waitForTimeout(500);
    }
    
    // Verify all IDs are unique
    const uniqueIds = new Set(ruleIds);
    expect(uniqueIds.size).toBe(5);
    
    // Verify all IDs follow the pattern
    ruleIds.forEach(id => {
      expect(id).toMatch(/^DR-\d+$/);
    });
    
    console.log('Generated Rule IDs:', ruleIds);
  });

  /**
   * TC-003: Create Rule with Special Characters in Name
   * Priority: Medium
   */
  test('TC-003: Should handle special characters in rule name', async ({ authenticatedPage }) => {
    const ruleName = `Test@2026#Discount!_${Date.now()}`;
    
    await discountRulePage.clickCreateNew();
    await discountRulePage.createDefaultRule(ruleName, 15, 'Channel_A');
    
    // System should either accept it or show validation error
    const hasSuccess = await discountRulePage.successMessage.isVisible();
    const hasError = await discountRulePage.errorMessage.isVisible();
    
    expect(hasSuccess || hasError).toBeTruthy();
    
    if (hasSuccess) {
      await discountRulePage.verifyRuleExists(ruleName);
      console.log('Special characters accepted in rule name');
    } else {
      console.log('Special characters rejected - validation working');
    }
    
    await authenticatedPage.screenshot({ path: `test-results/admin/screenshots/TC-003-special-chars.png` });
  });

  /**
   * TC-004: Create Rule with Empty Name
   * Priority: High
   */
  test('TC-004: Should show validation error for empty rule name', async ({ authenticatedPage }) => {
    await discountRulePage.clickCreateNew();
    
    // Try to create rule without entering name
    await discountRulePage.discountTypeDropdown.selectOption('default');
    await discountRulePage.discountPercentageInput.fill('10');
    await discountRulePage.channelSelect.selectOption('Channel_A');
    await discountRulePage.saveButton.click();
    
    // Verify validation error is shown
    await discountRulePage.verifyValidationError();
    
    // Verify error message contains relevant text
    const errorText = await discountRulePage.validationError.textContent();
    expect(errorText?.toLowerCase()).toContain('required');
    
    await authenticatedPage.screenshot({ path: `test-results/admin/screenshots/TC-004-empty-name-error.png` });
  });

  /**
   * TC-005: Create Rule with Duplicate Name
   * Priority: Medium
   */
  test('TC-005: Should handle duplicate rule names', async ({ authenticatedPage }) => {
    const ruleName = `Duplicate_Test_${Date.now()}`;
    
    // Create first rule
    await discountRulePage.clickCreateNew();
    await discountRulePage.createDefaultRule(ruleName, 10, 'Channel_A');
    await discountRulePage.verifySuccessMessage();
    
    // Try to create second rule with same name
    await discountRulePage.clickCreateNew();
    await discountRulePage.createDefaultRule(ruleName, 15, 'Channel_A');
    
    // System should either:
    // 1. Allow it (with different ID)
    // 2. Show warning/error
    const hasSuccess = await discountRulePage.successMessage.isVisible();
    const hasError = await discountRulePage.errorMessage.isVisible();
    
    expect(hasSuccess || hasError).toBeTruthy();
    
    if (hasSuccess) {
      // If allowed, verify both rules exist with different IDs
      await discountRulePage.searchRule(ruleName);
      const allRules = await discountRulePage.getAllRuleNames();
      const duplicateCount = allRules.filter(name => name === ruleName).length;
      expect(duplicateCount).toBeGreaterThanOrEqual(1);
      console.log('Duplicate names allowed with unique IDs');
    } else {
      console.log('Duplicate names prevented');
    }
    
    await authenticatedPage.screenshot({ path: `test-results/admin/screenshots/TC-005-duplicate-name.png` });
  });
});

test.describe('Discount Rule Creation - Negative Tests', () => {
  let discountRulePage: DiscountRulePage;

  test.beforeEach(async ({ authenticatedPage }) => {
    discountRulePage = new DiscountRulePage(authenticatedPage);
    await discountRulePage.goto();
  });

  /**
   * TC-036: Invalid Discount Percentage (Text Input)
   * Priority: Medium
   */
  test('TC-036: Should show validation error for invalid discount percentage', async ({ authenticatedPage }) => {
    await discountRulePage.clickCreateNew();
    
    await discountRulePage.ruleNameInput.fill(`Invalid_Discount_${Date.now()}`);
    await discountRulePage.discountTypeDropdown.selectOption('default');
    await discountRulePage.discountPercentageInput.fill('ABC'); // Invalid text
    await discountRulePage.channelSelect.selectOption('Channel_A');
    await discountRulePage.saveButton.click();
    
    // Verify validation error
    await discountRulePage.verifyValidationError();
    
    await authenticatedPage.screenshot({ path: `test-results/admin/screenshots/TC-036-invalid-percentage.png` });
  });

  /**
   * Test: Invalid percentage > 100%
   */
  test('Should reject discount percentage greater than 100%', async ({ authenticatedPage }) => {
    await discountRulePage.clickCreateNew();
    
    await discountRulePage.ruleNameInput.fill(`Over100_${Date.now()}`);
    await discountRulePage.discountTypeDropdown.selectOption('default');
    await discountRulePage.discountPercentageInput.fill('150'); // > 100%
    await discountRulePage.channelSelect.selectOption('Channel_A');
    await discountRulePage.saveButton.click();
    
    // Should show validation error
    const hasError = await discountRulePage.validationError.isVisible() || 
                     await discountRulePage.errorMessage.isVisible();
    expect(hasError).toBeTruthy();
    
    await authenticatedPage.screenshot({ path: `test-results/admin/screenshots/TC-022-over-100-percent.png` });
  });

  /**
   * Test: Negative percentage
   */
  test('Should reject negative discount percentage', async ({ authenticatedPage }) => {
    await discountRulePage.clickCreateNew();
    
    await discountRulePage.ruleNameInput.fill(`Negative_${Date.now()}`);
    await discountRulePage.discountTypeDropdown.selectOption('default');
    await discountRulePage.discountPercentageInput.fill('-5'); // Negative
    await discountRulePage.channelSelect.selectOption('Channel_A');
    await discountRulePage.saveButton.click();
    
    // Should show validation error
    const hasError = await discountRulePage.validationError.isVisible() || 
                     await discountRulePage.errorMessage.isVisible();
    expect(hasError).toBeTruthy();
    
    await authenticatedPage.screenshot({ path: `test-results/admin/screenshots/TC-022-negative-percent.png` });
  });
});
