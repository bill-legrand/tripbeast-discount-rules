import { chromium } from '@playwright/test';

async function recordCarFlow() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000 // Slow down for better visibility
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: './videos/',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  try {
    console.log('Step 1: Navigate with JWT to establish session...');
    await page.goto('https://travel.tripbeast.com/?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzcwMjc0NTYwfQ.qYMaj4Qe2-D_9luxV-_YNWCIbvQk3p78tECxuwbtRBA');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('Step 2: Navigate to login page...');
    await page.goto('https://travel.tripbeast.com/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('Step 3: Enter credentials...');
    const emailInput = page.locator('input[placeholder="name@example.com"]');
    await emailInput.fill('bill.legrand.test@yopmail.com');
    
    const passwordInput = page.locator('input[placeholder="Enter Password"]');
    await passwordInput.fill('Tester123123!');
    await page.waitForTimeout(1000);
    
    console.log('Step 4: Submit login (pressing Enter)...');
    await passwordInput.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check for CAPTCHA/robot challenge
    const pageContent = await page.textContent('body');
    if (pageContent?.toLowerCase().includes('robot') || 
        pageContent?.toLowerCase().includes('captcha') ||
        pageContent?.toLowerCase().includes('verify you are human')) {
      console.log('\n⚠️  CAPTCHA/Robot check detected!');
      console.log('Please solve the CAPTCHA manually in the browser window.');
      console.log('The script will wait up to 2 minutes for you to complete it...\n');
      
      // Wait for CAPTCHA to be solved (check every 3 seconds for up to 2 minutes)
      for (let i = 0; i < 40; i++) {
        await page.waitForTimeout(3000);
        const currentContent = await page.textContent('body');
        if (!currentContent?.toLowerCase().includes('robot') && 
            !currentContent?.toLowerCase().includes('captcha')) {
          console.log('✅ CAPTCHA solved! Continuing...');
          break;
        }
      }
    }
    
    await page.waitForTimeout(3000); // Wait for MFA prompt

    console.log('Step 5: Get MFA code from yopmail...');
    const yopmailPage = await context.newPage();
    await yopmailPage.goto('https://yopmail.com/en/?login=bill.legrand.test');
    await yopmailPage.waitForLoadState('networkidle');
    
    console.log('\n========================================');
    console.log('📧 YOPMAIL PAGE OPENED');
    console.log('If there is a CAPTCHA, please solve it now.');
    console.log('Waiting 60 seconds for you to solve any CAPTCHA...');
    console.log('========================================\n');
    
    // Wait 60 seconds for user to solve any CAPTCHA
    await yopmailPage.waitForTimeout(60000);
    
    console.log('Continuing to read MFA code...');
    
    // Get the iframe that contains the email content
    const emailFrame = yopmailPage.frameLocator('iframe[name="ifmail"]');
    const emailBody = await emailFrame.locator('body').textContent();
    const mfaMatch = emailBody?.match(/\d{6}/);
    const mfaCode = mfaMatch ? mfaMatch[0] : '';
    console.log(`MFA Code: ${mfaCode}`);
    
    await yopmailPage.close();

    console.log('Step 6: Enter MFA code...');
    await page.fill('input[placeholder="123456"]', mfaCode);
    await page.waitForTimeout(1000);
    
    console.log('Step 7: Verify MFA...');
    await page.click('button:has-text("Verify")');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Dismiss any modals
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    console.log('Step 8: Navigate to Cars and search PHX...');
    // Use direct URL with PHX parameters
    await page.goto('https://travel.tripbeast.com/car?pickup_date=2026-03-15T10:00:00&pickup_time=2026-02-04T10:00&dropoff_date=2026-03-22T10:00:00&dropoff_time=2026-02-04T10:00&pickup_location_full_name=Phoenix%20Sky%20Harbor%20International%20Airport&dropoff_location_full_name=Phoenix%20Sky%20Harbor%20International%20Airport&pickup_code=PHX&dropoff_code=PHX&age=30&pickup_location_name=Phoenix%20Sky%20Harbor%20International%20Airport&dropoff_location_name=Phoenix%20Sky%20Harbor%20International%20Airport');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for results to load

    console.log('Step 9: Scroll through results...');
    await page.evaluate('window.scrollBy(0, 500)');
    await page.waitForTimeout(2000);
    await page.evaluate('window.scrollBy(0, 500)');
    await page.waitForTimeout(2000);

    console.log('Recording complete!');

  } catch (error) {
    console.error('Error during recording:', error);
  } finally {
    await page.waitForTimeout(3000); // Extra time to see final state
    await context.close();
    await browser.close();
    console.log('Video saved to ./videos/ directory');
  }
}

recordCarFlow().catch(console.error);
