import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Discount Rule Management
 */
export class DiscountRulePage {
  readonly page: Page;
  
  // Navigation
  readonly discountRulesMenu: Locator;
  readonly createNewButton: Locator;
  
  // Form Fields
  readonly ruleNameInput: Locator;
  readonly discountTypeDropdown: Locator;
  readonly discountPercentageInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly channelSelect: Locator;
  readonly productSelect: Locator;
  readonly stakeholderSelect: Locator;
  readonly isDefaultCheckbox: Locator;
  readonly strikeThroughToggle: Locator;
  readonly statusToggle: Locator;
  
  // Buttons
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly editButton: Locator;
  
  // Table/List Elements
  readonly rulesTable: Locator;
  readonly ruleIdCell: Locator;
  readonly searchInput: Locator;
  
  // Messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Navigation
    this.discountRulesMenu = page.locator('a:has-text("Discount Rules"), [data-testid="discount-rules-menu"]');
    this.createNewButton = page.locator('button:has-text("Create"), button:has-text("New"), button:has-text("Add"), [data-testid="create-rule-button"]');
    
    // Form Fields - using multiple selectors for flexibility
    this.ruleNameInput = page.locator('input[name="ruleName"], input[name="rule_name"], #ruleName, #rule_name, [data-testid="rule-name-input"]');
    this.discountTypeDropdown = page.locator('select[name="discountType"], select[name="discount_type"], #discountType, [data-testid="discount-type-select"]');
    this.discountPercentageInput = page.locator('input[name="discountPercentage"], input[name="discount_percentage"], #discountPercentage, [data-testid="discount-percentage-input"]');
    this.startDateInput = page.locator('input[name="startDate"], input[name="start_date"], #startDate, [data-testid="start-date-input"]');
    this.endDateInput = page.locator('input[name="endDate"], input[name="end_date"], #endDate, [data-testid="end-date-input"]');
    this.channelSelect = page.locator('select[name="channel"], select[name="channels"], #channel, [data-testid="channel-select"]');
    this.productSelect = page.locator('select[name="products"], #products, [data-testid="product-select"]');
    this.stakeholderSelect = page.locator('select[name="stakeholder"], #stakeholder, [data-testid="stakeholder-select"]');
    this.isDefaultCheckbox = page.locator('input[name="isDefault"], input[name="is_default"], #isDefault, [data-testid="is-default-checkbox"]');
    this.strikeThroughToggle = page.locator('input[name="strikeThrough"], input[name="strike_through"], [data-testid="strike-through-toggle"]');
    this.statusToggle = page.locator('input[name="status"], [data-testid="status-toggle"]');
    
    // Buttons
    this.saveButton = page.locator('button:has-text("Save"), button[type="submit"], [data-testid="save-button"]');
    this.cancelButton = page.locator('button:has-text("Cancel"), [data-testid="cancel-button"]');
    this.deleteButton = page.locator('button:has-text("Delete"), [data-testid="delete-button"]');
    this.editButton = page.locator('button:has-text("Edit"), [data-testid="edit-button"]');
    
    // Table/List
    this.rulesTable = page.locator('table, [data-testid="rules-table"]');
    this.ruleIdCell = page.locator('td[data-column="ruleId"], td[data-column="rule_id"], .rule-id');
    this.searchInput = page.locator('input[placeholder*="Search"], input[type="search"], [data-testid="search-input"]');
    
    // Messages
    this.successMessage = page.locator('.success, .alert-success, [role="alert"]:has-text("Success"), [data-testid="success-message"]');
    this.errorMessage = page.locator('.error, .alert-error, .alert-danger, [role="alert"]:has-text("Error"), [data-testid="error-message"]');
    this.validationError = page.locator('.validation-error, .field-error, .invalid-feedback');
  }

  /**
   * Navigate to Discount Rules page
   */
  async goto() {
    await this.page.goto('/discount-rules');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to Discount Rules page via menu
   */
  async navigateViaMenu() {
    await this.discountRulesMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click Create New Rule button
   */
  async clickCreateNew() {
    await this.createNewButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Create a default discount rule
   */
  async createDefaultRule(ruleName: string, percentage: number, channel: string) {
    await this.ruleNameInput.fill(ruleName);
    await this.discountTypeDropdown.selectOption('default');
    await this.discountPercentageInput.fill(percentage.toString());
    await this.channelSelect.selectOption(channel);
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Create a date range discount rule
   */
  async createDateRangeRule(
    ruleName: string, 
    percentage: number, 
    startDate: string, 
    endDate: string, 
    channel: string
  ) {
    await this.ruleNameInput.fill(ruleName);
    await this.discountTypeDropdown.selectOption('date_range');
    await this.discountPercentageInput.fill(percentage.toString());
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
    await this.channelSelect.selectOption(channel);
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Create a specific date discount rule
   */
  async createSpecificDateRule(
    ruleName: string, 
    percentage: number, 
    specificDate: string, 
    channel: string
  ) {
    await this.ruleNameInput.fill(ruleName);
    await this.discountTypeDropdown.selectOption('specific_date');
    await this.discountPercentageInput.fill(percentage.toString());
    await this.startDateInput.fill(specificDate);
    await this.channelSelect.selectOption(channel);
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Set rule as default for channel
   */
  async setAsDefault() {
    await this.isDefaultCheckbox.check();
  }

  /**
   * Enable strike-through display
   */
  async enableStrikeThrough() {
    await this.strikeThroughToggle.check();
  }

  /**
   * Disable strike-through display
   */
  async disableStrikeThrough() {
    await this.strikeThroughToggle.uncheck();
  }

  /**
   * Search for a discount rule
   */
  async searchRule(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get rule ID from the table
   */
  async getRuleId(): Promise<string> {
    const ruleIdText = await this.ruleIdCell.first().textContent();
    return ruleIdText?.trim() || '';
  }

  /**
   * Click on a rule in the table by name
   */
  async clickRuleByName(ruleName: string) {
    await this.page.locator(`tr:has-text("${ruleName}")`).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Delete a rule
   */
  async deleteRule() {
    await this.deleteButton.click();
    
    // Handle confirmation dialog if present
    this.page.on('dialog', dialog => dialog.accept());
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Edit a rule
   */
  async editRule() {
    await this.editButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify success message is displayed
   */
  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify validation error for a specific field
   */
  async verifyValidationError() {
    await expect(this.validationError).toBeVisible({ timeout: 5000 });
  }

  /**
   * Verify rule exists in table
   */
  async verifyRuleExists(ruleName: string) {
    const ruleRow = this.page.locator(`tr:has-text("${ruleName}")`);
    await expect(ruleRow).toBeVisible();
  }

  /**
   * Verify rule does not exist in table
   */
  async verifyRuleNotExists(ruleName: string) {
    const ruleRow = this.page.locator(`tr:has-text("${ruleName}")`);
    await expect(ruleRow).not.toBeVisible();
  }

  /**
   * Get all visible rule names from the table
   */
  async getAllRuleNames(): Promise<string[]> {
    const rows = await this.rulesTable.locator('tbody tr').all();
    const names: string[] = [];
    
    for (const row of rows) {
      const nameCell = row.locator('td').first();
      const name = await nameCell.textContent();
      if (name) names.push(name.trim());
    }
    
    return names;
  }

  /**
   * Apply rule to specific products
   */
  async applyToProducts(productIds: string[]) {
    for (const productId of productIds) {
      await this.productSelect.selectOption(productId);
    }
  }

  /**
   * Configure stakeholder-specific discount
   */
  async configureStakeholderDiscount(stakeholderId: string, percentage: number) {
    await this.stakeholderSelect.selectOption(stakeholderId);
    await this.discountPercentageInput.fill(percentage.toString());
  }
}
