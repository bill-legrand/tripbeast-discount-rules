/**
 * Cruise Discount Configuration and Helper Functions
 * Based on Tripbeast Ancillary "Ancii Stage DR" discount rule
 * 
 * Period 1 (Mar 1-7): 22% fixed
 * Period 2 (Mar 8-14): DOW-based (Mon 36%, Tue 48%, Wed 60%, Thu 72%, Fri 84%, Sat 12%, Sun 24%)
 * Period 3 (Mar 15-21): 21% fixed
 * Period 4 (Mar 22-30): No discount (0%) - Not configured
 */

export const CRUISE_DISCOUNT_CONFIG = {
  discountRuleId: 'eb511fff-19b8-4a27-91d5-dd8e69f31809',
  ruleName: 'Ancii Stage DR',
  customer: 'Tripbeast Ancillary',
  channel: 'TripBeast',
  
  periods: {
    period1: {
      start: '2026-03-01',
      end: '2026-03-07',
      type: 'fixed',
      discount: 22
    },
    period2: {
      start: '2026-03-08',
      end: '2026-03-14',
      type: 'dow',
      discounts: {
        sunday: 24,
        monday: 36,
        tuesday: 48,
        wednesday: 60,
        thursday: 72,
        friday: 84,
        saturday: 12
      }
    },
    period3: {
      start: '2026-03-15',
      end: '2026-03-21',
      type: 'fixed',
      discount: 21
    }
  },
  
  // March 22-31 have no discount (outside configured ranges)
  noDiscountDates: ['2026-03-22', '2026-03-23', '2026-03-24', '2026-03-25', '2026-03-26', '2026-03-27', '2026-03-28', '2026-03-29', '2026-03-30', '2026-03-31']
};

/**
 * JWT Token for cruise testing - Ancii Stage DR (Tripbeast Ancillary)
 * Uses Ancillary JWT with discountRuleId: eb511fff-19b8-4a27-91d5-dd8e69f31809
 * Generate fresh: node generate-jwt-ancillary.js
 */
export const CRUISE_BOOKING_JWT = process.env.CRUISE_ANCILLARY_JWT || process.env.CAR_ANCILLARY_JWT || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzcwMDExMDE3fQ.qLSLikPZHwGAVCOJcseoZNab6Fqm-FJP6jzvxGvXw0Y';

/**
 * Test cruise parameters
 */
export const TEST_CRUISE_PARAMS = {
  departure_port: 'Miami',
  destination: 'Caribbean',
  cruise_line: '', // To be determined from search
  ship_name: '', // To be determined from search
  cabin_type: 'interior', // Default cabin type
};

/**
 * Get the discount percentage for a specific date
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Discount percentage for that date
 */
export function getCruiseDiscountForDate(dateStr: string): number {
  const date = new Date(dateStr + 'T00:00:00');
  
  // Period 1: Mar 1-7 (22% fixed)
  if (dateStr >= '2026-03-01' && dateStr <= '2026-03-07') {
    return 22;
  }
  
  // Period 2: Mar 8-14 (DOW-based)
  if (dateStr >= '2026-03-08' && dateStr <= '2026-03-14') {
    const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const dowDiscounts = [24, 36, 48, 60, 72, 84, 12]; // Sun-Sat
    return dowDiscounts[dayOfWeek];
  }
  
  // Period 3: Mar 15-21 (21% fixed)
  if (dateStr >= '2026-03-15' && dateStr <= '2026-03-21') {
    return 21;
  }
  
  // No discount for other dates
  return 0;
}

/**
 * Get the day of week discount percentage for Period 2
 * @param date - Date object
 * @returns Discount percentage for that day of week
 */
export function getDayOfWeekCruiseDiscount(date: Date): number {
  const dayOfWeek = date.getDay();
  const dowDiscounts = [24, 36, 48, 60, 72, 84, 12]; // Sun-Sat (0-6)
  return dowDiscounts[dayOfWeek];
}

/**
 * Check if a date is within a discount period
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns true if date has a discount configured
 */
export function isWithinCruiseDiscountRange(dateStr: string): boolean {
  return dateStr >= '2026-03-01' && dateStr <= '2026-03-21';
}

/**
 * Get the discount period name for a date
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Period name (e.g., "Period 1", "Period 2", "Period 3", "No Discount")
 */
export function getCruiseDiscountPeriod(dateStr: string): string {
  if (dateStr >= '2026-03-01' && dateStr <= '2026-03-07') {
    return 'Period 1 (22% Fixed)';
  }
  if (dateStr >= '2026-03-08' && dateStr <= '2026-03-14') {
    return 'Period 2 (DOW-Based)';
  }
  if (dateStr >= '2026-03-15' && dateStr <= '2026-03-21') {
    return 'Period 3 (21% Fixed)';
  }
  return 'No Discount';
}

/**
 * Calculate expected discount for a multi-day cruise
 * Uses per-day discount model and returns the average
 * @param startDate - Cruise start date string (YYYY-MM-DD)
 * @param endDate - Cruise end date string (YYYY-MM-DD)
 * @returns Object with average discount, daily breakdown, and cruise days
 */
export function calculateMultiDayCruiseDiscount(
  startDate: string,
  endDate: string
): {
  averageDiscount: number;
  dailyDiscounts: Array<{ date: string; day: string; discount: number; period: string }>;
  cruiseDays: number;
} {
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  
  const dailyDiscounts: Array<{ date: string; day: string; discount: number; period: string }> = [];
  let totalDiscount = 0;
  
  // Calculate discount for each day from start to day before end
  let currentDate = new Date(start);
  while (currentDate < end) {
    const dateStr = formatDateForInput(currentDate);
    const discount = getCruiseDiscountForDate(dateStr);
    const period = getCruiseDiscountPeriod(dateStr);
    const day = getDayName(currentDate);
    
    dailyDiscounts.push({ date: dateStr, day, discount, period });
    totalDiscount += discount;
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const cruiseDays = dailyDiscounts.length;
  const averageDiscount = cruiseDays > 0 ? totalDiscount / cruiseDays : 0;
  
  return {
    averageDiscount: Math.round(averageDiscount * 10) / 10, // Round to 1 decimal
    dailyDiscounts,
    cruiseDays
  };
}

/**
 * Get all 1-day cruise test dates for March 2026
 * Note: 1-day cruises are unusual but we'll test them for completeness
 * @returns Array of test cases with start, end, and expected discount
 */
export function getOneDayCruiseTests(): Array<{
  startDate: string;
  endDate: string;
  expectedDiscount: number;
  period: string;
  day: string;
}> {
  const tests = [];
  
  for (let day = 1; day <= 30; day++) {
    const startDate = `2026-03-${String(day).padStart(2, '0')}`;
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const endDate = formatDateForInput(end);
    
    const expectedDiscount = getCruiseDiscountForDate(startDate);
    const period = getCruiseDiscountPeriod(startDate);
    const dayName = getDayName(start);
    
    tests.push({
      startDate,
      endDate,
      expectedDiscount,
      period,
      day: dayName
    });
  }
  
  return tests;
}

/**
 * Get 3-day cruise test dates for March 2026 (typical short cruise)
 * Tests start from Mar 1 through Mar 28 (28 tests total)
 * @returns Array of test cases with start, end, and expected discount
 */
export function getThreeDayCruiseTests(): Array<{
  startDate: string;
  endDate: string;
  expectedDiscount: number;
  dailyBreakdown: string;
  cruiseDays: number;
}> {
  const tests = [];
  
  for (let day = 1; day <= 28; day++) {
    const startDate = `2026-03-${String(day).padStart(2, '0')}`;
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(start);
    end.setDate(end.getDate() + 3); // 3 days
    const endDate = formatDateForInput(end);
    
    const calculation = calculateMultiDayCruiseDiscount(startDate, endDate);
    const dailyBreakdown = calculation.dailyDiscounts
      .map(d => `${d.day} ${d.discount}%`)
      .join(' + ');
    
    tests.push({
      startDate,
      endDate,
      expectedDiscount: calculation.averageDiscount,
      dailyBreakdown,
      cruiseDays: calculation.cruiseDays
    });
  }
  
  return tests;
}

/**
 * Get 7-day (1-week) cruise test dates for March 2026 (typical Caribbean cruise)
 * Tests start from Mar 1 through Mar 24 (24 tests total)
 * @returns Array of test cases with start, end, and expected discount
 */
export function getSevenDayCruiseTests(): Array<{
  startDate: string;
  endDate: string;
  expectedDiscount: number;
  dailyBreakdown: string;
  cruiseDays: number;
}> {
  const tests = [];
  
  for (let day = 1; day <= 24; day++) {
    const startDate = `2026-03-${String(day).padStart(2, '0')}`;
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(start);
    end.setDate(end.getDate() + 7); // 7 days (1 week)
    const endDate = formatDateForInput(end);
    
    const calculation = calculateMultiDayCruiseDiscount(startDate, endDate);
    const dailyBreakdown = calculation.dailyDiscounts
      .map(d => `${d.date} ${d.day} ${d.discount}%`)
      .join(', ');
    
    tests.push({
      startDate,
      endDate,
      expectedDiscount: calculation.averageDiscount,
      dailyBreakdown,
      cruiseDays: calculation.cruiseDays
    });
  }
  
  return tests;
}

/**
 * Format date as YYYY-MM-DD for input fields
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get day name from date
 * @param date - Date to get day name from
 * @returns Day name (e.g., "Monday")
 */
export function getDayName(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Get day abbreviation from date
 * @param date - Date to get day abbreviation from
 * @returns Day abbreviation (e.g., "Mon")
 */
export function getDayAbbr(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

/**
 * Calculate effective discount percentage from gross and discount amount
 * @param gross - Gross price before discount
 * @param discountAmount - Discount amount
 * @returns Effective discount percentage
 */
export function getEffectiveDiscountPct(gross: number, discountAmount: number): number {
  if (gross <= 0) return 0;
  return Math.round((discountAmount / gross) * 100 * 10) / 10;
}
