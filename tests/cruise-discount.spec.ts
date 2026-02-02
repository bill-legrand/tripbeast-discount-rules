import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { CruiseBookingPage } from './pages/CruiseBookingPage';
import {
  CRUISE_BOOKING_JWT,
  CRUISE_DISCOUNT_CONFIG,
  getCruiseDiscountForDate,
  getCruiseDiscountPeriod,
  calculateMultiDayCruiseDiscount,
  getOneDayCruiseTests,
  getThreeDayCruiseTests,
  getSevenDayCruiseTests,
  formatDateForInput,
  getDayName
} from './helpers/cruise-discount-data';

// Ensure screenshot directory exists
const screenshotDir = 'test-results/cruise-screenshots';

// Test results storage for report generation
interface TestResult {
  testName: string;
  startDate: string;
  endDate: string;
  duration: string;
  expectedDiscount: number;
  actualDiscount: number;
  passed: boolean;
  screenshotPath: string;
  notes: string;
  priceBreakdown?: {
    itemPrice: number;
    discount: number;
    tax: number;
    fees: number;
    total: number;
  };
}

const testResults: TestResult[] = [];

test.describe('Cruise Discount Tests - Tripbeast Ancillary (Ancii Stage DR)', () => {
  
  test.beforeAll(async () => {
    // Create screenshot directory
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  test.afterAll(async () => {
    // Generate comprehensive report
    const reportContent = generateCruiseReport(testResults);
    fs.writeFileSync('CRUISE_DISCOUNT_REPORT.md', reportContent);
    console.log('\n📊 Report generated: CRUISE_DISCOUNT_REPORT.md');
  });

  // ==========================================
  // 1-DAY CRUISE TESTS (March 1-21, 2026)
  // ==========================================
  test.describe('1-Day Cruise Tests', () => {
    
    // Test Period 1: March 1-7 (22% Fixed)
    const period1Days = [1, 3, 5, 7]; // Sample days from Period 1
    for (const day of period1Days) {
      const startDate = `2026-03-${String(day).padStart(2, '0')}`;
      
      test(`1-Day Cruise Mar ${day} - Period 1 (22% Fixed)`, async ({ page }) => {
        const cruisePage = new CruiseBookingPage(page);
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        const endDate = formatDateForInput(end);
        
        const expectedDiscount = getCruiseDiscountForDate(startDate);
        const dayName = getDayName(start);
        
        console.log(`\n📅 Testing 1-Day Cruise: ${startDate} (${dayName})`);
        console.log(`   Expected Discount: ${expectedDiscount}%`);
        
        await cruisePage.gotoCruiseBookingWithDates(startDate, endDate, CRUISE_BOOKING_JWT);
        
        const priceBreakdown = await cruisePage.getPriceBreakdown();
        const actualDiscount = await cruisePage.getAppliedDiscountPercentage();
        
        const screenshotPath = `${screenshotDir}/1day-mar${day}-period1.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        const passed = Math.abs(actualDiscount - expectedDiscount) <= 1;
        
        testResults.push({
          testName: `1-Day Cruise Mar ${day}`,
          startDate,
          endDate,
          duration: '1 day',
          expectedDiscount,
          actualDiscount,
          passed,
          screenshotPath,
          notes: `Period 1 (22% Fixed) - ${dayName}`,
          priceBreakdown: {
            itemPrice: priceBreakdown.subtotal + priceBreakdown.discount,
            discount: priceBreakdown.discount,
            tax: priceBreakdown.tax,
            fees: priceBreakdown.fees,
            total: priceBreakdown.total
          }
        });
        
        console.log(`   Actual Discount: ${actualDiscount}%`);
        console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      });
    }
    
    // Test Period 2: March 8-14 (DOW-Based)
    const period2Days = [8, 9, 10, 11, 12, 13, 14]; // All days of Period 2
    for (const day of period2Days) {
      const startDate = `2026-03-${String(day).padStart(2, '0')}`;
      
      test(`1-Day Cruise Mar ${day} - Period 2 (DOW)`, async ({ page }) => {
        const cruisePage = new CruiseBookingPage(page);
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        const endDate = formatDateForInput(end);
        
        const expectedDiscount = getCruiseDiscountForDate(startDate);
        const dayName = getDayName(start);
        
        console.log(`\n📅 Testing 1-Day Cruise: ${startDate} (${dayName})`);
        console.log(`   Expected Discount: ${expectedDiscount}% (DOW: ${dayName})`);
        
        await cruisePage.gotoCruiseBookingWithDates(startDate, endDate, CRUISE_BOOKING_JWT);
        
        const priceBreakdown = await cruisePage.getPriceBreakdown();
        const actualDiscount = await cruisePage.getAppliedDiscountPercentage();
        
        const screenshotPath = `${screenshotDir}/1day-mar${day}-period2-dow.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        const passed = Math.abs(actualDiscount - expectedDiscount) <= 1;
        
        testResults.push({
          testName: `1-Day Cruise Mar ${day}`,
          startDate,
          endDate,
          duration: '1 day',
          expectedDiscount,
          actualDiscount,
          passed,
          screenshotPath,
          notes: `Period 2 (DOW) - ${dayName}: ${expectedDiscount}%`,
          priceBreakdown: {
            itemPrice: priceBreakdown.subtotal + priceBreakdown.discount,
            discount: priceBreakdown.discount,
            tax: priceBreakdown.tax,
            fees: priceBreakdown.fees,
            total: priceBreakdown.total
          }
        });
        
        console.log(`   Actual Discount: ${actualDiscount}%`);
        console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      });
    }
    
    // Test Period 3: March 15-21 (21% Fixed)
    const period3Days = [15, 17, 19, 21]; // Sample days from Period 3
    for (const day of period3Days) {
      const startDate = `2026-03-${String(day).padStart(2, '0')}`;
      
      test(`1-Day Cruise Mar ${day} - Period 3 (21% Fixed)`, async ({ page }) => {
        const cruisePage = new CruiseBookingPage(page);
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        const endDate = formatDateForInput(end);
        
        const expectedDiscount = getCruiseDiscountForDate(startDate);
        const dayName = getDayName(start);
        
        console.log(`\n📅 Testing 1-Day Cruise: ${startDate} (${dayName})`);
        console.log(`   Expected Discount: ${expectedDiscount}%`);
        
        await cruisePage.gotoCruiseBookingWithDates(startDate, endDate, CRUISE_BOOKING_JWT);
        
        const priceBreakdown = await cruisePage.getPriceBreakdown();
        const actualDiscount = await cruisePage.getAppliedDiscountPercentage();
        
        const screenshotPath = `${screenshotDir}/1day-mar${day}-period3.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        const passed = Math.abs(actualDiscount - expectedDiscount) <= 1;
        
        testResults.push({
          testName: `1-Day Cruise Mar ${day}`,
          startDate,
          endDate,
          duration: '1 day',
          expectedDiscount,
          actualDiscount,
          passed,
          screenshotPath,
          notes: `Period 3 (21% Fixed) - ${dayName}`,
          priceBreakdown: {
            itemPrice: priceBreakdown.subtotal + priceBreakdown.discount,
            discount: priceBreakdown.discount,
            tax: priceBreakdown.tax,
            fees: priceBreakdown.fees,
            total: priceBreakdown.total
          }
        });
        
        console.log(`   Actual Discount: ${actualDiscount}%`);
        console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      });
    }
    
    // Test No Discount Period: March 22+ (0%)
    const noDiscountDays = [22, 25, 28];
    for (const day of noDiscountDays) {
      const startDate = `2026-03-${String(day).padStart(2, '0')}`;
      
      test(`1-Day Cruise Mar ${day} - No Discount`, async ({ page }) => {
        const cruisePage = new CruiseBookingPage(page);
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        const endDate = formatDateForInput(end);
        
        const expectedDiscount = 0;
        const dayName = getDayName(start);
        
        console.log(`\n📅 Testing 1-Day Cruise: ${startDate} (${dayName})`);
        console.log(`   Expected Discount: ${expectedDiscount}% (No discount configured)`);
        
        await cruisePage.gotoCruiseBookingWithDates(startDate, endDate, CRUISE_BOOKING_JWT);
        
        const priceBreakdown = await cruisePage.getPriceBreakdown();
        const actualDiscount = await cruisePage.getAppliedDiscountPercentage();
        
        const screenshotPath = `${screenshotDir}/1day-mar${day}-no-discount.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        const passed = actualDiscount === 0;
        
        testResults.push({
          testName: `1-Day Cruise Mar ${day}`,
          startDate,
          endDate,
          duration: '1 day',
          expectedDiscount,
          actualDiscount,
          passed,
          screenshotPath,
          notes: `No Discount Period - ${dayName}`,
          priceBreakdown: {
            itemPrice: priceBreakdown.subtotal + priceBreakdown.discount,
            discount: priceBreakdown.discount,
            tax: priceBreakdown.tax,
            fees: priceBreakdown.fees,
            total: priceBreakdown.total
          }
        });
        
        console.log(`   Actual Discount: ${actualDiscount}%`);
        console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      });
    }
  });

  // ==========================================
  // 3-DAY CRUISE TESTS (Typical Short Cruise)
  // ==========================================
  test.describe('3-Day Cruise Tests', () => {
    
    // Sample 3-day cruises from different periods
    const threeDayTests = [
      { startDay: 1, name: 'Period 1 only' },
      { startDay: 5, name: 'Period 1 → Period 2 transition' },
      { startDay: 8, name: 'Period 2 (DOW) only' },
      { startDay: 12, name: 'Period 2 → Period 3 transition' },
      { startDay: 15, name: 'Period 3 only' },
      { startDay: 19, name: 'Period 3 → No Discount transition' },
    ];
    
    for (const testCase of threeDayTests) {
      const startDate = `2026-03-${String(testCase.startDay).padStart(2, '0')}`;
      
      test(`3-Day Cruise starting Mar ${testCase.startDay} - ${testCase.name}`, async ({ page }) => {
        const cruisePage = new CruiseBookingPage(page);
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(start);
        end.setDate(end.getDate() + 3);
        const endDate = formatDateForInput(end);
        
        const calculation = calculateMultiDayCruiseDiscount(startDate, endDate);
        const expectedDiscount = calculation.averageDiscount;
        
        console.log(`\n🚢 Testing 3-Day Cruise: ${startDate} → ${endDate}`);
        console.log(`   Daily Breakdown: ${calculation.dailyDiscounts.map(d => `${d.day}: ${d.discount}%`).join(', ')}`);
        console.log(`   Expected Average: ${expectedDiscount}%`);
        
        await cruisePage.gotoCruiseBookingWithDates(startDate, endDate, CRUISE_BOOKING_JWT);
        
        const priceBreakdown = await cruisePage.getPriceBreakdown();
        const actualDiscount = await cruisePage.getAppliedDiscountPercentage();
        
        const screenshotPath = `${screenshotDir}/3day-mar${testCase.startDay}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        const passed = Math.abs(actualDiscount - expectedDiscount) <= 2;
        
        testResults.push({
          testName: `3-Day Cruise Mar ${testCase.startDay}`,
          startDate,
          endDate,
          duration: '3 days',
          expectedDiscount,
          actualDiscount,
          passed,
          screenshotPath,
          notes: `${testCase.name} | ${calculation.dailyDiscounts.map(d => `${d.day.substring(0,3)}: ${d.discount}%`).join(', ')}`,
          priceBreakdown: {
            itemPrice: priceBreakdown.subtotal + priceBreakdown.discount,
            discount: priceBreakdown.discount,
            tax: priceBreakdown.tax,
            fees: priceBreakdown.fees,
            total: priceBreakdown.total
          }
        });
        
        console.log(`   Actual Discount: ${actualDiscount}%`);
        console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      });
    }
  });

  // ==========================================
  // 7-DAY CRUISE TESTS (Typical Caribbean Cruise)
  // ==========================================
  test.describe('7-Day Cruise Tests', () => {
    
    // Sample 7-day cruises from different periods
    const sevenDayTests = [
      { startDay: 1, name: 'Starts Period 1, ends Period 2' },
      { startDay: 5, name: 'Spans Period 1 → Period 2 → Period 3' },
      { startDay: 8, name: 'Period 2 (DOW) → Period 3' },
      { startDay: 15, name: 'Period 3 → No Discount' },
    ];
    
    for (const testCase of sevenDayTests) {
      const startDate = `2026-03-${String(testCase.startDay).padStart(2, '0')}`;
      
      test(`7-Day Cruise starting Mar ${testCase.startDay} - ${testCase.name}`, async ({ page }) => {
        const cruisePage = new CruiseBookingPage(page);
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        const endDate = formatDateForInput(end);
        
        const calculation = calculateMultiDayCruiseDiscount(startDate, endDate);
        const expectedDiscount = calculation.averageDiscount;
        
        console.log(`\n🛳️ Testing 7-Day Cruise: ${startDate} → ${endDate}`);
        console.log(`   Daily Breakdown:`);
        for (const d of calculation.dailyDiscounts) {
          console.log(`      ${d.date} (${d.day}): ${d.discount}% - ${d.period}`);
        }
        console.log(`   Expected Average: ${expectedDiscount}%`);
        
        await cruisePage.gotoCruiseBookingWithDates(startDate, endDate, CRUISE_BOOKING_JWT);
        
        const priceBreakdown = await cruisePage.getPriceBreakdown();
        const actualDiscount = await cruisePage.getAppliedDiscountPercentage();
        
        const screenshotPath = `${screenshotDir}/7day-mar${testCase.startDay}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        const passed = Math.abs(actualDiscount - expectedDiscount) <= 2;
        
        testResults.push({
          testName: `7-Day Cruise Mar ${testCase.startDay}`,
          startDate,
          endDate,
          duration: '7 days',
          expectedDiscount,
          actualDiscount,
          passed,
          screenshotPath,
          notes: `${testCase.name}`,
          priceBreakdown: {
            itemPrice: priceBreakdown.subtotal + priceBreakdown.discount,
            discount: priceBreakdown.discount,
            tax: priceBreakdown.tax,
            fees: priceBreakdown.fees,
            total: priceBreakdown.total
          }
        });
        
        console.log(`   Actual Discount: ${actualDiscount}%`);
        console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      });
    }
  });
});

/**
 * Generate comprehensive markdown report
 */
function generateCruiseReport(results: TestResult[]): string {
  const passCount = results.filter(r => r.passed).length;
  const failCount = results.filter(r => !r.passed).length;
  const passRate = results.length > 0 ? ((passCount / results.length) * 100).toFixed(1) : '0';
  
  let report = `# Cruise Discount Test Report

## Executive Summary

- **Discount Rule**: Ancii Stage DR
- **Rule ID**: ${CRUISE_DISCOUNT_CONFIG.discountRuleId}
- **Customer**: ${CRUISE_DISCOUNT_CONFIG.customer}
- **Channel**: ${CRUISE_DISCOUNT_CONFIG.channel}
- **Test Date**: ${new Date().toISOString().split('T')[0]}

### Results Overview

| Metric | Value |
|--------|-------|
| Total Tests | ${results.length} |
| Passed | ${passCount} |
| Failed | ${failCount} |
| Pass Rate | ${passRate}% |

## Discount Configuration

### Cruise Discount Rules (March 2026)

| Period | Date Range | Discount Type | Value |
|--------|------------|---------------|-------|
| Period 1 | Mar 1-7 | Fixed | 22% |
| Period 2 | Mar 8-14 | DOW | Mon: 36%, Tue: 48%, Wed: 60%, Thu: 72%, Fri: 84%, Sat: 12%, Sun: 24% |
| Period 3 | Mar 15-21 | Fixed | 21% |
| No Config | Mar 22-31 | None | 0% |

## Test Results

### 1-Day Cruise Tests

| Test | Date | Day | Expected | Actual | Status | Notes |
|------|------|-----|----------|--------|--------|-------|
`;

  // 1-Day tests
  const oneDayResults = results.filter(r => r.duration === '1 day');
  for (const r of oneDayResults) {
    const start = new Date(r.startDate + 'T00:00:00');
    const day = getDayName(start).substring(0, 3);
    report += `| ${r.testName} | ${r.startDate} | ${day} | ${r.expectedDiscount}% | ${r.actualDiscount}% | ${r.passed ? '✅' : '❌'} | ${r.notes} |\n`;
  }

  report += `
### 3-Day Cruise Tests

| Test | Dates | Expected Avg | Actual | Status | Daily Breakdown |
|------|-------|--------------|--------|--------|-----------------|
`;

  // 3-Day tests
  const threeDayResults = results.filter(r => r.duration === '3 days');
  for (const r of threeDayResults) {
    report += `| ${r.testName} | ${r.startDate} → ${r.endDate} | ${r.expectedDiscount}% | ${r.actualDiscount}% | ${r.passed ? '✅' : '❌'} | ${r.notes} |\n`;
  }

  report += `
### 7-Day Cruise Tests

| Test | Dates | Expected Avg | Actual | Status | Notes |
|------|-------|--------------|--------|--------|-------|
`;

  // 7-Day tests
  const sevenDayResults = results.filter(r => r.duration === '7 days');
  for (const r of sevenDayResults) {
    report += `| ${r.testName} | ${r.startDate} → ${r.endDate} | ${r.expectedDiscount}% | ${r.actualDiscount}% | ${r.passed ? '✅' : '❌'} | ${r.notes} |\n`;
  }

  // Failed tests section
  const failedTests = results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    report += `
## Failed Tests Analysis

| Test | Expected | Actual | Variance | Screenshot |
|------|----------|--------|----------|------------|
`;
    for (const r of failedTests) {
      const variance = Math.abs(r.actualDiscount - r.expectedDiscount).toFixed(1);
      report += `| ${r.testName} | ${r.expectedDiscount}% | ${r.actualDiscount}% | ${variance}% | [View](${r.screenshotPath}) |\n`;
    }
  }

  report += `
## Screenshots

All test screenshots are saved in \`test-results/cruise-screenshots/\`

## Technical Details

### JWT Used
\`\`\`
${CRUISE_BOOKING_JWT.substring(0, 50)}...
\`\`\`

### Booking Engine
- URL: https://travel.tripbeast.com
- Page: cruise

### Test Framework
- Playwright
- TypeScript

---
*Report generated automatically by cruise-discount.spec.ts*
`;

  return report;
}
