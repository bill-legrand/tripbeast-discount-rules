/**
 * Test Data Configuration for Low Rate Discount Tests
 * Rule: 2% discount on rates under $100 (April 1-15, 2026)
 */

export interface HotelTestData {
  hotelId: string;
  rate: number;
  shouldGetDiscount: boolean;
  description: string;
}

export interface DateTestData {
  checkInDate: string;
  description: string;
  isWithinRange: boolean;
}

/**
 * Low Rate Discount Rule Configuration
 */
export const LOW_RATE_DISCOUNT_CONFIG = {
  ruleName: 'Low Rate Discount',
  discountPercentage: 2,
  startDate: '2026-04-01',
  endDate: '2026-04-15',
  rateThreshold: 100, // Rates under this amount get discount
  applyTo: 'Adjust',
};

/**
 * Real hotel parameters from booking system
 * Using the same Las Vegas hotel (ID: 2008) that works in DOW tests
 */
export const TEST_HOTEL_PARAMS = {
  hotel_id: '2008',
  property_id: '12384405',
  room_id: '201273159',
  search_query: 'Las Vegas',
  mobile_promotion: 'false',
  longitude: '-115.141376',
  latitude: '36.17006',
  type: 'id',
  gds: 'expedia'
};

/**
 * Hotel Test Data
 * NOTE: We use ONE real hotel and test based on its actual rate
 * The discount rule applies to rates UNDER $100
 */
export const HOTEL_TEST_DATA: HotelTestData[] = [
  // Using real hotel ID 2008 (Las Vegas)
  // The test will check the actual rate and verify discount logic
  {
    hotelId: '2008',
    rate: 0, // Will be determined at runtime
    shouldGetDiscount: true, // Will be determined based on actual rate
    description: 'Las Vegas hotel - rate determined at runtime',
  },
];

/**
 * Date Test Data
 */
export const DATE_TEST_DATA: DateTestData[] = [
  // Before discount period
  {
    checkInDate: '2026-03-31',
    description: 'Day before discount starts',
    isWithinRange: false,
  },
  {
    checkInDate: '2026-03-15',
    description: 'Two weeks before discount',
    isWithinRange: false,
  },
  
  // First day of discount period
  {
    checkInDate: '2026-04-01',
    description: 'First day of discount period',
    isWithinRange: true,
  },
  
  // Within discount period
  {
    checkInDate: '2026-04-05',
    description: 'Early in discount period',
    isWithinRange: true,
  },
  {
    checkInDate: '2026-04-08',
    description: 'Middle of discount period',
    isWithinRange: true,
  },
  {
    checkInDate: '2026-04-10',
    description: 'Mid-late in discount period',
    isWithinRange: true,
  },
  {
    checkInDate: '2026-04-12',
    description: 'Late in discount period',
    isWithinRange: true,
  },
  
  // Last day of discount period
  {
    checkInDate: '2026-04-15',
    description: 'Last day of discount period',
    isWithinRange: true,
  },
  
  // After discount period
  {
    checkInDate: '2026-04-16',
    description: 'Day after discount ends',
    isWithinRange: false,
  },
  {
    checkInDate: '2026-05-01',
    description: 'Two weeks after discount',
    isWithinRange: false,
  },
];

/**
 * Calculate expected discount amount
 */
export function calculateExpectedDiscount(rate: number): number {
  if (rate >= LOW_RATE_DISCOUNT_CONFIG.rateThreshold) {
    return 0; // No discount for rates at or above threshold
  }
  return rate * (LOW_RATE_DISCOUNT_CONFIG.discountPercentage / 100);
}

/**
 * Calculate expected final price after discount
 */
export function calculateExpectedFinalPrice(rate: number): number {
  const discount = calculateExpectedDiscount(rate);
  return rate - discount;
}

/**
 * Check if a date is within the discount period
 */
export function isDateWithinDiscountPeriod(date: string): boolean {
  const checkDate = new Date(date);
  const startDate = new Date(LOW_RATE_DISCOUNT_CONFIG.startDate);
  const endDate = new Date(LOW_RATE_DISCOUNT_CONFIG.endDate);
  
  return checkDate >= startDate && checkDate <= endDate;
}

/**
 * Get next day date string
 */
export function getNextDay(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

/**
 * Get hotels that should receive discount
 */
export function getHotelsWithDiscount(): HotelTestData[] {
  return HOTEL_TEST_DATA.filter(hotel => hotel.shouldGetDiscount);
}

/**
 * Get hotels that should NOT receive discount
 */
export function getHotelsWithoutDiscount(): HotelTestData[] {
  return HOTEL_TEST_DATA.filter(hotel => !hotel.shouldGetDiscount);
}

/**
 * Get dates within discount period
 */
export function getDatesWithinPeriod(): DateTestData[] {
  return DATE_TEST_DATA.filter(date => date.isWithinRange);
}

/**
 * Get dates outside discount period
 */
export function getDatesOutsidePeriod(): DateTestData[] {
  return DATE_TEST_DATA.filter(date => !date.isWithinRange);
}

/**
 * Test scenarios combining rate and date
 */
export interface TestScenario {
  hotelId: string;
  rate: number;
  checkInDate: string;
  shouldGetDiscount: boolean;
  description: string;
}

/**
 * Generate comprehensive test scenarios
 */
export function generateTestScenarios(): TestScenario[] {
  const scenarios: TestScenario[] = [];
  
  // Rates under $100 within date range - should get discount
  const hotelsWithDiscount = getHotelsWithDiscount();
  const datesWithinPeriod = getDatesWithinPeriod();
  
  hotelsWithDiscount.forEach(hotel => {
    datesWithinPeriod.forEach(date => {
      scenarios.push({
        hotelId: hotel.hotelId,
        rate: hotel.rate,
        checkInDate: date.checkInDate,
        shouldGetDiscount: true,
        description: `${hotel.description} on ${date.description}`,
      });
    });
  });
  
  // Rates under $100 outside date range - should NOT get discount
  const datesOutsidePeriod = getDatesOutsidePeriod();
  
  hotelsWithDiscount.forEach(hotel => {
    datesOutsidePeriod.forEach(date => {
      scenarios.push({
        hotelId: hotel.hotelId,
        rate: hotel.rate,
        checkInDate: date.checkInDate,
        shouldGetDiscount: false,
        description: `${hotel.description} on ${date.description} (outside range)`,
      });
    });
  });
  
  // Rates at/above $100 - should NEVER get discount
  const hotelsWithoutDiscount = getHotelsWithoutDiscount();
  const allDates = DATE_TEST_DATA;
  
  hotelsWithoutDiscount.forEach(hotel => {
    allDates.forEach(date => {
      scenarios.push({
        hotelId: hotel.hotelId,
        rate: hotel.rate,
        checkInDate: date.checkInDate,
        shouldGetDiscount: false,
        description: `${hotel.description} on ${date.description} (rate above threshold)`,
      });
    });
  });
  
  return scenarios;
}

/**
 * Multi-night stay test data
 */
export interface MultiNightTestData {
  hotelId: string;
  rate: number;
  nights: number;
  checkInDate: string;
  shouldGetDiscount: boolean;
  description: string;
}

export const MULTI_NIGHT_TEST_DATA: MultiNightTestData[] = [
  // Rates under $100 - should get discount
  {
    hotelId: 'test-hotel-50',
    rate: 50,
    nights: 3,
    checkInDate: '2026-04-05',
    shouldGetDiscount: true,
    description: '3-night stay at $50/night',
  },
  {
    hotelId: 'test-hotel-75',
    rate: 75,
    nights: 5,
    checkInDate: '2026-04-05',
    shouldGetDiscount: true,
    description: '5-night stay at $75/night',
  },
  {
    hotelId: 'test-hotel-99',
    rate: 99,
    nights: 2,
    checkInDate: '2026-04-10',
    shouldGetDiscount: true,
    description: '2-night stay at $99/night',
  },
  
  // Rates at/above $100 - should NOT get discount
  {
    hotelId: 'test-hotel-100',
    rate: 100,
    nights: 3,
    checkInDate: '2026-04-05',
    shouldGetDiscount: false,
    description: '3-night stay at $100/night',
  },
  {
    hotelId: 'test-hotel-150',
    rate: 150,
    nights: 3,
    checkInDate: '2026-04-05',
    shouldGetDiscount: false,
    description: '3-night stay at $150/night',
  },
  {
    hotelId: 'test-hotel-200',
    rate: 200,
    nights: 7,
    checkInDate: '2026-04-05',
    shouldGetDiscount: false,
    description: '7-night stay at $200/night',
  },
];

/**
 * Calculate multi-night expected discount
 */
export function calculateMultiNightDiscount(rate: number, nights: number): number {
  const totalRate = rate * nights;
  if (rate >= LOW_RATE_DISCOUNT_CONFIG.rateThreshold) {
    return 0;
  }
  return totalRate * (LOW_RATE_DISCOUNT_CONFIG.discountPercentage / 100);
}

/**
 * Calculate multi-night final price
 */
export function calculateMultiNightFinalPrice(rate: number, nights: number): number {
  const totalRate = rate * nights;
  const discount = calculateMultiNightDiscount(rate, nights);
  return totalRate - discount;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Boundary test cases
 */
export const BOUNDARY_TEST_CASES = [
  {
    description: 'Just under threshold',
    rate: 99.99,
    shouldGetDiscount: true,
  },
  {
    description: 'Exactly at threshold',
    rate: 100.00,
    shouldGetDiscount: false,
  },
  {
    description: 'Just over threshold',
    rate: 100.01,
    shouldGetDiscount: false,
  },
  {
    description: 'Very low rate',
    rate: 1.00,
    shouldGetDiscount: true,
  },
  {
    description: 'Zero rate (edge case)',
    rate: 0.00,
    shouldGetDiscount: true, // Technically under $100, but may need special handling
  },
];

/**
 * Export all test data for easy import
 */
export default {
  config: LOW_RATE_DISCOUNT_CONFIG,
  hotels: HOTEL_TEST_DATA,
  dates: DATE_TEST_DATA,
  multiNight: MULTI_NIGHT_TEST_DATA,
  boundary: BOUNDARY_TEST_CASES,
  helpers: {
    calculateExpectedDiscount,
    calculateExpectedFinalPrice,
    isDateWithinDiscountPeriod,
    getNextDay,
    getHotelsWithDiscount,
    getHotelsWithoutDiscount,
    getDatesWithinPeriod,
    getDatesOutsidePeriod,
    generateTestScenarios,
    calculateMultiNightDiscount,
    calculateMultiNightFinalPrice,
    formatCurrency,
  },
};


