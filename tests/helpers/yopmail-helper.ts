import { Page, chromium } from '@playwright/test';

/**
 * Helper to fetch MFA code from Yopmail
 * Yopmail is a temporary email service that allows programmatic access
 */
export class YopmailHelper {
  /**
   * Get MFA code from yopmail inbox
   * @param email - Full yopmail email (e.g., bill.legrand.test@yopmail.com)
   * @param maxWaitSeconds - Maximum time to wait for email (default 60 seconds)
   * @returns MFA code as string
   */
  static async getMfaCode(email: string, maxWaitSeconds: number = 60): Promise<string> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      console.log(`[YOPMAIL] Fetching MFA code for ${email}...`);
      
      // Extract username from email (everything before @)
      const username = email.split('@')[0];
      
      // Navigate to yopmail inbox
      await page.goto(`https://yopmail.com/en/?login=${username}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Accept cookies if present
      try {
        const acceptBtn = page.locator('#accept');
        if (await acceptBtn.isVisible({ timeout: 2000 })) {
          await acceptBtn.click();
          await page.waitForTimeout(500);
        }
      } catch { /* ignore */ }

      // Check inbox button
      const checkBtn = page.locator('#refreshbut');
      
      // Wait for email with MFA code (retry up to maxWaitSeconds)
      const startTime = Date.now();
      let mfaCode: string | null = null;

      while (Date.now() - startTime < maxWaitSeconds * 1000) {
        // Refresh inbox
        await checkBtn.click();
        await page.waitForTimeout(2000);

        // Switch to email content iframe
        const mailFrame = page.frameLocator('#ifmail');
        
        try {
          // Look for MFA code patterns in email content
          const emailBody = mailFrame.locator('body');
          const bodyText = await emailBody.textContent({ timeout: 3000 });
          
          if (bodyText) {
            console.log(`[YOPMAIL] Email content preview: ${bodyText.substring(0, 200)}...`);
            
            // Common MFA code patterns:
            // - "Your verification code is: 123456"
            // - "Your code: 123456"
            // - "MFA Code: 123456"
            // - "123456" (6-digit number)
            const patterns = [
              /(?:verification|MFA|auth|security)\s+code[:\s]+(\d{6})/i,
              /your\s+code[:\s]+(\d{6})/i,
              /code[:\s]+(\d{6})/i,
              /(\d{6})/
            ];

            for (const pattern of patterns) {
              const match = bodyText.match(pattern);
              if (match) {
                mfaCode = match[1];
                console.log(`[YOPMAIL] Found MFA code: ${mfaCode}`);
                break;
              }
            }

            if (mfaCode) break;
          }
        } catch (e) {
          console.log(`[YOPMAIL] No email yet, waiting... (${Math.round((Date.now() - startTime) / 1000)}s)`);
        }

        await page.waitForTimeout(3000);
      }

      if (!mfaCode) {
        throw new Error(`MFA code not found in yopmail inbox after ${maxWaitSeconds} seconds`);
      }

      return mfaCode;

    } finally {
      await browser.close();
    }
  }

  /**
   * Clear all emails from yopmail inbox
   * @param email - Full yopmail email
   */
  static async clearInbox(email: string): Promise<void> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      const username = email.split('@')[0];
      await page.goto(`https://yopmail.com/en/?login=${username}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Click delete all button
      const deleteAllBtn = page.locator('#delall');
      if (await deleteAllBtn.isVisible({ timeout: 5000 })) {
        await deleteAllBtn.click();
        await page.waitForTimeout(1000);
        console.log(`[YOPMAIL] Cleared inbox for ${email}`);
      }
    } finally {
      await browser.close();
    }
  }
}
