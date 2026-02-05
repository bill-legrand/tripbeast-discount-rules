/**
 * Car Rental Discount Configuration and Helper Functions
 * Based on Tripbeast Ancillary "Ancii Stage DR" discount rule
 * 
 * Period 0 (Feb 15-21): 12% fixed
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
 * Get car test run ID (date_time) for organizing output.
 * Set CAR_TEST_RUN_ID env var (e.g. from run-car-tests.ps1) for consistent run folder.
 */
export function getCarRunId(): string {
  if (process.env.CAR_TEST_RUN_ID) return process.env.CAR_TEST_RUN_ID;
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
}

/**
 * Get output base path for a car test suite: test-results/car/{runId}/{suiteName}
 */
export function getCarOutputBase(suiteName: string): string {
  return `test-results/car/${getCarRunId()}/${suiteName}`;
}

/**
 * Sanitize JWT - trim whitespace, strip URL params if pasted with full URL
 */
function sanitizeJwt(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, '');
  const match = trimmed.match(/(?:jwt=|\?jwt=)?(eyJ[\w\-=.]+\.eyJ[\w\-=.]+\.[\w\-=]+)/);
  return match ? match[1] : trimmed;
}

/**
 * JWT Token for car rental testing - Tripbeast Ancillary (same as working hotel tests)
 * Uses Ancillary JWT with discountRuleId: eb511fff-19b8-4a27-91d5-dd8e69f31809 (Ancii Stage DR)
 * Generate fresh: node generate-jwt-ancillary.js
 */
// Full JWT with businessRuleId and discountRuleId (freshly generated 2026-02-05 @ 1:07 PM)
const _fullJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzcwMjczNjUxfQ.rNqB1pdVETSaZpaJgII-FF7k4bnrfNiox6o2IpvHqlI';
// Minimal JWT (no businessRuleId/discountRuleId) - for fallback testing
// Generate fresh: node generate-jwt-ancillary.js --minimal
const _minimalJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiIiLCJjbGllbnRMb2dvVXJsIjoiIiwibWVtYmVyc2hpcCI6ZmFsc2UsImlhdCI6MTc3MDI1OTc3OX0.c9bpla6L6AFH2q7kw5EiSaQmNY58m1u7V4HzK5Wn_hc';
const _rawJwt = process.env.CAR_BOOKING_JWT || process.env.ANCILLARY_JWT || _fullJwt;
export const CAR_BOOKING_JWT = sanitizeJwt(_rawJwt);

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
  
  // Period 0: Feb 15-21 (12%)
  if (dateStr >= '2026-02-15' && dateStr <= '2026-02-21') {
    return 12;
  }
  
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
  return (dateStr >= '2026-02-15' && dateStr <= '2026-02-21') ||
    (dateStr >= '2026-03-01' && dateStr <= '2026-03-28');
}

/**
 * Get the discount period name for a date
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Period name (e.g., "Period 1", "Period 2", "Period 3 (DOW)", "No Discount")
 */
export function getCarDiscountPeriod(dateStr: string): string {
  if (dateStr >= '2026-02-15' && dateStr <= '2026-02-21') {
    return 'Period 0 (12% Fixed - Feb)';
  }
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
 * Tests start from Mar 1 through Mar 31 (31 tests total)
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
  
  for (let day = 1; day <= 31; day++) {
    const pickupDate = `2026-03-${String(day).padStart(2, '0')}`;
    const pickup = new Date(pickupDate + 'T00:00:00');
    const dropoff = new Date(pickup);
    dropoff.setDate(dropoff.getDate() + 2);
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
 * Get 50 comprehensive car rental tests covering all discount periods with various lengths
 * Covers: Feb 15-21 (12%), Mar 1-7 (12%), Mar 8-14 (22%), Mar 15-28 (DOW), Mar 29-31 (0%)
 * Rental lengths: 1, 2, 3, 4, 5, 7 days with diverse start dates
 */
export function getComprehensiveCarRentalTests(): Array<{
  pickupDate: string;
  dropoffDate: string;
  expectedDiscount: number;
  rentalDays: number;
  dailyBreakdown: string;
  periodSummary: string;
}> {
  const tests: Array<{
    pickupDate: string;
    dropoffDate: string;
    expectedDiscount: number;
    rentalDays: number;
    dailyBreakdown: string;
    periodSummary: string;
  }> = [];

  // Helper to add a test case
  const addTest = (pickupDate: string, rentalDays: number) => {
    const pickup = new Date(pickupDate + 'T00:00:00');
    const dropoff = new Date(pickup);
    dropoff.setDate(dropoff.getDate() + rentalDays);
    const dropoffDate = formatDateForInput(dropoff);

    const calculation = calculateMultiDayCarDiscount(pickupDate, dropoffDate);
    const dailyBreakdown = calculation.dailyDiscounts
      .map(d => `${d.day} ${d.discount}%`)
      .join(' + ');
    const periodSummary = calculation.dailyDiscounts
      .map(d => getCarDiscountPeriod(d.date))
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ');

    tests.push({
      pickupDate,
      dropoffDate,
      expectedDiscount: calculation.averageDiscount,
      rentalDays: calculation.rentalDays,
      dailyBreakdown,
      periodSummary
    });
  };

  // Feb 15-21 period (12%): 5 tests - 1-day, 2-day, 3-day, 5-day, 7-day
  addTest('2026-02-15', 1);  // Sun
  addTest('2026-02-17', 2);  // Tue-Wed
  addTest('2026-02-18', 3);  // Wed-Thu-Fri
  addTest('2026-02-16', 5);  // Mon-Fri
  addTest('2026-02-15', 7);  // Full week Feb 15-21

  // Mar 1-7 period (12%): 6 tests
  addTest('2026-03-01', 1);  // Sun
  addTest('2026-03-03', 2);  // Tue-Wed
  addTest('2026-03-05', 3);  // Thu-Fri-Sat
  addTest('2026-03-02', 4);  // Mon-Thu
  addTest('2026-03-06', 5);  // Fri-Tue (crosses to Mar 8)
  addTest('2026-03-01', 7);  // Full period 1

  // Mar 8-14 period (22%): 6 tests
  addTest('2026-03-08', 1);  // Sun
  addTest('2026-03-10', 2);  // Tue-Wed
  addTest('2026-03-12', 3);  // Thu-Fri-Sat
  addTest('2026-03-09', 4);  // Mon-Thu
  addTest('2026-03-11', 5);  // Wed-Sun
  addTest('2026-03-08', 7);  // Full period 2

  // Mar 15-28 DOW period: 18 tests - varied lengths and start dates
  addTest('2026-03-15', 1);  // Sat 5%
  addTest('2026-03-16', 1);  // Sun 10%
  addTest('2026-03-17', 1);  // Mon 15%
  addTest('2026-03-20', 1);  // Thu 30%
  addTest('2026-03-21', 1);  // Fri 35%
  addTest('2026-03-15', 2);  // Sat-Sun: 5%+10% = 7.5%
  addTest('2026-03-17', 2);  // Mon-Tue: 15%+20% = 17.5%
  addTest('2026-03-19', 2);  // Wed-Thu: 25%+30% = 27.5%
  addTest('2026-03-21', 2);  // Fri-Sat: 35%+5% = 20%
  addTest('2026-03-15', 3);  // Sat-Mon
  addTest('2026-03-18', 4);  // Tue-Fri
  addTest('2026-03-22', 5);  // Sun-Thu
  addTest('2026-03-15', 7);  // Full DOW week Sat-Fri = 20%
  addTest('2026-03-16', 7);  // Sun-Sat
  addTest('2026-03-20', 5);  // Thu-Mon (crosses to Mar 24)
  addTest('2026-03-24', 3);  // Mon-Wed
  addTest('2026-03-26', 2);  // Wed-Thu
  addTest('2026-03-28', 1);  // Fri 35%

  // Cross-period: 8 tests
  addTest('2026-02-21', 2);  // Feb 21 (Sat 12%) + Mar 1 (Sun 12%) - both 12%
  addTest('2026-03-07', 2);  // Period 1→2: 12%+22% = 17%
  addTest('2026-03-14', 2);  // Period 2→3: 22%+5%(Sat) = 13.5%
  addTest('2026-03-06', 5);  // Period 1→2 cross
  addTest('2026-03-12', 5);  // Period 2→3 cross
  addTest('2026-03-28', 2);  // Period 3→no discount: 35%+0% = 17.5%
  addTest('2026-03-27', 3);  // Thu-Sat: 30%+35%+0% = 21.7%
  addTest('2026-03-25', 5);  // Tue-Sat: crosses to Mar 29

  // No discount period Mar 29-31: 4 tests
  addTest('2026-03-29', 1);  // Sun 0%
  addTest('2026-03-30', 1);  // Mon 0%
  addTest('2026-03-31', 1);  // Tue 0%
  addTest('2026-03-29', 2);  // Sun-Mon 0%

  // Add 3 more to reach exactly 50 - edge cases
  addTest('2026-03-01', 4);  // Sun-Wed period 1
  addTest('2026-03-23', 4);  // Sun-Wed period 3
  addTest('2026-02-19', 3);  // Thu-Sat Feb period

  return tests.slice(0, 50); // Ensure exactly 50
}

/** Unified test case shape for comprehensive suite */
export type CarRentalTestCase = {
  pickupDate: string;
  dropoffDate: string;
  expectedDiscount: number;
  rentalDays: number;
  dailyBreakdown: string;
};

/**
 * March-focused comprehensive tests:
 * - 1 day: every day in March (31 tests)
 * - 2 day: every day in March (31 tests)
 * - 5 day: 5 random dates in March (5 tests)
 * - 10 day: arriving each Monday in March (5 tests)
 * Total: 72 tests
 */
export function getMarchComprehensiveCarRentalTests(): CarRentalTestCase[] {
  const tests: CarRentalTestCase[] = [];

  // 1. 1-day tests for every day in March (31 tests)
  const oneDay = getOneDayCarRentalTests();
  for (const t of oneDay) {
    tests.push({
      pickupDate: t.pickupDate,
      dropoffDate: t.dropoffDate,
      expectedDiscount: t.expectedDiscount,
      rentalDays: 1,
      dailyBreakdown: `${t.day} ${t.expectedDiscount}%`
    });
  }

  // 2. 2-day tests for every day in March (31 tests)
  const twoDay = getTwoDayCarRentalTests();
  tests.push(...twoDay);

  // 3. 5-day tests for 5 random dates in March
  const march5DaySeeds = [7, 12, 18, 22, 27]; // Mar 7, 12, 18, 22, 27
  for (const day of march5DaySeeds) {
    const pickupDate = `2026-03-${String(day).padStart(2, '0')}`;
    const pickup = new Date(pickupDate + 'T00:00:00');
    const dropoff = new Date(pickup);
    dropoff.setDate(dropoff.getDate() + 5);
    const dropoffDate = formatDateForInput(dropoff);
    const calculation = calculateMultiDayCarDiscount(pickupDate, dropoffDate);
    tests.push({
      pickupDate,
      dropoffDate,
      expectedDiscount: calculation.averageDiscount,
      rentalDays: 5,
      dailyBreakdown: calculation.dailyDiscounts.map(d => `${d.day} ${d.discount}%`).join(' + ')
    });
  }

  // 4. 10-day tests arriving each Monday in March (Mar 2, 9, 16, 23, 30)
  const marchMondays = [2, 9, 16, 23, 30];
  for (const day of marchMondays) {
    const pickupDate = `2026-03-${String(day).padStart(2, '0')}`;
    const pickup = new Date(pickupDate + 'T00:00:00');
    const dropoff = new Date(pickup);
    dropoff.setDate(dropoff.getDate() + 10);
    const dropoffDate = formatDateForInput(dropoff);
    const calculation = calculateMultiDayCarDiscount(pickupDate, dropoffDate);
    tests.push({
      pickupDate,
      dropoffDate,
      expectedDiscount: calculation.averageDiscount,
      rentalDays: 10,
      dailyBreakdown: calculation.dailyDiscounts.map(d => `${d.day} ${d.discount}%`).join(' + ')
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
