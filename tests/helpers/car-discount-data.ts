/**
 * Car Rental Discount Configuration and Helper Functions
 * Based on Tripbeast Ancillary "Ancii Stage DR" discount rule
 * 
 * Period 1 (Mar 1-7): 12% fixed
 * Period 2 (Mar 8-14): 22% fixed
 * Period 3 (Mar 15-28): DOW-based (Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, Sat 5%, Sun 10%)
 * Period 4 (Mar 29-31): No discount (0%)
 */

export const CAR_DISCOUNT_CONFIG = {
  discountRuleId: 'eb511fff-19b8-4a27-91d5-dd8e69f31809',
  ruleName: 'Ancii Stage DR',
  customer: 'Tripbeast Ancillary',
  
  periods: {
    period1: {
      start: '2026-03-01',
      end: '2026-03-07',
      type: 'fixed',
      discount: 12
    },
    period2: {
      start: '2026-03-08',
      end: '2026-03-14',
      type: 'fixed',
      discount: 22
    },
    period3: {
      start: '2026-03-15',
      end: '2026-03-28',
      type: 'dow',
      discounts: {
        sunday: 10,
        monday: 15,
        tuesday: 20,
        wednesday: 25,
        thursday: 30,
        friday: 35,
        saturday: 5
      }
    }
  },
  
  // March 29-31 have no discount (outside configured ranges)
  noDiscountDates: ['2026-03-29', '2026-03-30', '2026-03-31']
};

/**
 * JWT Token for car rental testing - Ancii Stage DR (Tripbeast Ancillary)
 * Uses Ancillary JWT with discountRuleId: eb511fff-19b8-4a27-91d5-dd8e69f31809
 * Generate fresh: node generate-jwt-ancillary.js
 */
export const CAR_BOOKING_JWT = process.env.CAR_ANCILLARY_JWT || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzcwMDExMDE3fQ.qLSLikPZHwGAVCOJcseoZNab6Fqm-FJP6jzvxGvXw0Y';

/**
 * Test car rental parameters for Las Vegas
 * These parameters will need to be discovered from actual car searches
 */
export const TEST_CAR_PARAMS = {
  location: 'Las Vegas',
  location_code: 'LAS', // Airport code
  pickup_location_id: '', // To be determined from search
  dropoff_location_id: '', // To be determined from search
  car_type: 'economy', // Default car type
  longitude: '-115.141376',
  latitude: '36.17006',
  type: 'car',
  gds: 'expedia' // or appropriate car rental GDS
};

/**
 * Get the discount percentage for a specific date
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Discount percentage for that date
 */
export function getCarDiscountForDate(dateStr: string): number {
  const date = new Date(dateStr + 'T00:00:00');
  
  // Period 1: Mar 1-7 (12%)
  if (dateStr >= '2026-03-01' && dateStr <= '2026-03-07') {
    return 12;
  }
  
  // Period 2: Mar 8-14 (22%)
  if (dateStr >= '2026-03-08' && dateStr <= '2026-03-14') {
    return 22;
  }
  
  // Period 3: Mar 15-28 (DOW-based)
  if (dateStr >= '2026-03-15' && dateStr <= '2026-03-28') {
    const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const dowDiscounts = [10, 15, 20, 25, 30, 35, 5]; // Sun-Sat
    return dowDiscounts[dayOfWeek];
  }
  
  // No discount for other dates
  return 0;
}

/**
 * Get the day of week discount percentage
 * @param date - Date object
 * @returns Discount percentage for that day of week
 */
export function getDayOfWeekCarDiscount(date: Date): number {
  const dayOfWeek = date.getDay();
  const dowDiscounts = [10, 15, 20, 25, 30, 35, 5]; // Sun-Sat (0-6)
  return dowDiscounts[dayOfWeek];
}

/**
 * Check if a date is within a discount period
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns true if date has a discount configured
 */
export function isWithinCarDiscountRange(dateStr: string): boolean {
  return dateStr >= '2026-03-01' && dateStr <= '2026-03-28';
}

/**
 * Get the discount period name for a date
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Period name (e.g., "Period 1", "Period 2", "Period 3 (DOW)", "No Discount")
 */
export function getCarDiscountPeriod(dateStr: string): string {
  if (dateStr >= '2026-03-01' && dateStr <= '2026-03-07') {
    return 'Period 1 (12% Fixed)';
  }
  if (dateStr >= '2026-03-08' && dateStr <= '2026-03-14') {
    return 'Period 2 (22% Fixed)';
  }
  if (dateStr >= '2026-03-15' && dateStr <= '2026-03-28') {
    return 'Period 3 (DOW-Based)';
  }
  return 'No Discount';
}

/**
 * Calculate expected discount for a multi-day car rental
 * Uses per-day discount model and returns the average
 * @param pickupDate - Pickup date string (YYYY-MM-DD)
 * @param dropoffDate - Dropoff date string (YYYY-MM-DD)
 * @returns Object with average discount, daily breakdown, and rental days
 */
export function calculateMultiDayCarDiscount(
  pickupDate: string,
  dropoffDate: string
): {
  averageDiscount: number;
  dailyDiscounts: Array<{ date: string; day: string; discount: number; period: string }>;
  rentalDays: number;
} {
  const pickup = new Date(pickupDate + 'T00:00:00');
  const dropoff = new Date(dropoffDate + 'T00:00:00');
  
  const dailyDiscounts: Array<{ date: string; day: string; discount: number; period: string }> = [];
  let totalDiscount = 0;
  
  // Calculate discount for each day from pickup to day before dropoff
  let currentDate = new Date(pickup);
  while (currentDate < dropoff) {
    const dateStr = formatDateForInput(currentDate);
    const discount = getCarDiscountForDate(dateStr);
    const period = getCarDiscountPeriod(dateStr);
    const day = getDayName(currentDate);
    
    dailyDiscounts.push({ date: dateStr, day, discount, period });
    totalDiscount += discount;
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const rentalDays = dailyDiscounts.length;
  const averageDiscount = rentalDays > 0 ? totalDiscount / rentalDays : 0;
  
  return {
    averageDiscount: Math.round(averageDiscount * 10) / 10, // Round to 1 decimal
    dailyDiscounts,
    rentalDays
  };
}

/**
 * Get all 1-day car rental test dates for March 2026
 * @returns Array of test cases with pickup, dropoff, and expected discount
 */
export function getOneDayCarRentalTests(): Array<{
  pickupDate: string;
  dropoffDate: string;
  expectedDiscount: number;
  period: string;
  day: string;
}> {
  const tests = [];
  
  for (let day = 1; day <= 31; day++) {
    const pickupDate = `2026-03-${String(day).padStart(2, '0')}`;
    const pickup = new Date(pickupDate + 'T00:00:00');
    const dropoff = new Date(pickup);
    dropoff.setDate(dropoff.getDate() + 1);
    const dropoffDate = formatDateForInput(dropoff);
    
    const expectedDiscount = getCarDiscountForDate(pickupDate);
    const period = getCarDiscountPeriod(pickupDate);
    const dayName = getDayName(pickup);
    
    tests.push({
      pickupDate,
      dropoffDate,
      expectedDiscount,
      period,
      day: dayName
    });
  }
  
  return tests;
}

/**
 * Get all 2-day car rental test dates for March 2026
 * Tests start from Mar 1 through Mar 29 (29 tests total)
 * @returns Array of test cases with pickup, dropoff, and expected discount
 */
export function getTwoDayCarRentalTests(): Array<{
  pickupDate: string;
  dropoffDate: string;
  expectedDiscount: number;
  dailyBreakdown: string;
  rentalDays: number;
}> {
  const tests = [];
  
  for (let day = 1; day <= 29; day++) {
    const pickupDate = `2026-03-${String(day).padStart(2, '0')}`;
    const pickup = new Date(pickupDate + 'T00:00:00');
    const dropoff = new Date(pickup);
    dropoff.setDate(dropoff.getDate() + 2); // 2 days
    const dropoffDate = formatDateForInput(dropoff);
    
    const calculation = calculateMultiDayCarDiscount(pickupDate, dropoffDate);
    const dailyBreakdown = calculation.dailyDiscounts
      .map(d => `${d.day} ${d.discount}%`)
      .join(' + ');
    
    tests.push({
      pickupDate,
      dropoffDate,
      expectedDiscount: calculation.averageDiscount,
      dailyBreakdown,
      rentalDays: calculation.rentalDays
    });
  }
  
  return tests;
}

/**
 * Get all 7-day (1-week) car rental test dates for March 2026
 * Tests start from Mar 1 through Mar 24 (24 tests total)
 * @returns Array of test cases with pickup, dropoff, and expected discount
 */
export function getSevenDayCarRentalTests(): Array<{
  pickupDate: string;
  dropoffDate: string;
  expectedDiscount: number;
  dailyBreakdown: string;
  rentalDays: number;
}> {
  const tests = [];
  
  for (let day = 1; day <= 24; day++) {
    const pickupDate = `2026-03-${String(day).padStart(2, '0')}`;
    const pickup = new Date(pickupDate + 'T00:00:00');
    const dropoff = new Date(pickup);
    dropoff.setDate(dropoff.getDate() + 7); // 7 days (1 week)
    const dropoffDate = formatDateForInput(dropoff);
    
    const calculation = calculateMultiDayCarDiscount(pickupDate, dropoffDate);
    const dailyBreakdown = calculation.dailyDiscounts
      .map(d => `${d.date} ${d.day} ${d.discount}%`)
      .join(', ');
    
    tests.push({
      pickupDate,
      dropoffDate,
      expectedDiscount: calculation.averageDiscount,
      dailyBreakdown,
      rentalDays: calculation.rentalDays
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
