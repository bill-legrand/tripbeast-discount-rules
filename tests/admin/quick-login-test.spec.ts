import { test, expect } from '../fixtures/auth.fixture';

/**
 * Quick Login Test
 * Tests login and navigation to specific customer page
 */
test.describe('Quick Login Test', () => {
  test('should login and navigate to customer page', async ({ authenticatedPage }) => {
    console.log('✓ Successfully logged in');
    console.log('Current URL after login:', authenticatedPage.url());
    
    // Navigate to the specific customer page
    console.log('Navigating to customer page...');
    await authenticatedPage.goto('/customers/8676edcb-76c2-4352-b973-bedd7152f332?page=10');
    
    // Wait for page to load
    await authenticatedPage.waitForLoadState('networkidle');
    
    console.log('Current URL:', authenticatedPage.url());
    
    // Take a screenshot for verification
    await authenticatedPage.screenshot({ path: 'test-results/admin/customer-page.png', fullPage: true });
    
    // Wait a bit to see the page (5 seconds)
    console.log('Waiting 5 seconds to view the page...');
    await authenticatedPage.waitForTimeout(5000);
    
    console.log('✓ Test completed successfully!');
  });
});
