/**
 * Day of Week Discount Configuration and Helper Functions
 * Based on configured DOW pattern: Mon 15%, Tue 20%, Wed 25%, Thu 30%, Fri 35%, Sat 40%, Sun 10%
 */

export const DOW_DISCOUNT_CONFIG = {
  dateRange: {
    start: '2026-03-02',
    end: '2026-03-08'
  },
  discounts: {
    monday: 15,
    tuesday: 20,
    wednesday: 25,
    thursday: 30,
    friday: 35,
    saturday: 40,
    sunday: 10
  }
};

/**
 * JWT Token for Skyline Voyages customer authentication
 * This token includes the pricing and discount rules for the customer
 */
export const BOOKING_ENGINE_JWT = process.env.BOOKING_ENGINE_JWT || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI';

/**
 * Test hotel parameters for Las Vegas hotel
 * Used for direct hotel booking page navigation
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
 * Additional Las Vegas hotels for multi-hotel testing
 * hotel_id/property_id/room_id from booking engine.
 * Only 2008/12384405/201273159 confirmed working; others are candidates to try.
 */
export const LAS_VEGAS_HOTELS = [
  {
    hotel_id: '2008',
    property_id: '12384405',
    room_id: '201273159',
    search_query: 'Las Vegas',
    longitude: '-115.141376',
    latitude: '36.17006',
    type: 'id',
    gds: 'expedia',
    name: 'Longhorn Casino & Hotel'
  },
  {
    hotel_id: '2007',
    property_id: '12384404',
    room_id: '201273158',
    search_query: 'Las Vegas',
    longitude: '-115.141376',
    latitude: '36.17006',
    type: 'id',
    gds: 'expedia',
    name: 'Hotel 2007'
  },
  {
    hotel_id: '2009',
    property_id: '12384406',
    room_id: '201273160',
    search_query: 'Las Vegas',
    longitude: '-115.141376',
    latitude: '36.17006',
    type: 'id',
    gds: 'expedia',
    name: 'Hotel 2009'
  },
  {
    hotel_id: '2008',
    property_id: '12384405',
    room_id: '201273160',
    search_query: 'Las Vegas',
    longitude: '-115.141376',
    latitude: '36.17006',
    type: 'id',
    gds: 'expedia',
    name: 'Longhorn - Room 160'
  },
  {
    hotel_id: '2008',
    property_id: '12384405',
    room_id: '201273161',
    search_query: 'Las Vegas',
    longitude: '-115.141376',
    latitude: '36.17006',
    type: 'id',
    gds: 'expedia',
    name: 'Longhorn - Room 161'
  }
];

/**
 * New York, NY hotels for discount testing (travel.tripbeast.com Ancillary engine)
 * Searched: New York, New York, United States of America
 * hotel_id 2621 = destination/city ID
 */
export const NEW_YORK_HOTELS = [
  {
    hotel_id: '2621',
    property_id: '82501881',
    room_id: '327618641',
    search_query: 'New York',
    longitude: '-74.005966',
    latitude: '40.712843',
    type: 'id',
    gds: 'expedia',
    name: 'Interfaith Retreats'
  },
  {
    hotel_id: '2621',
    property_id: '24245',
    room_id: '201967771',
    search_query: 'New York',
    longitude: '-74.005966',
    latitude: '40.712843',
    type: 'id',
    gds: 'expedia',
    name: 'Paramount'
  },
  {
    hotel_id: '2621',
    property_id: '109701641',
    room_id: '327435609',
    search_query: 'New York',
    longitude: '-74.005966',
    latitude: '40.712843',
    type: 'id',
    gds: 'expedia',
    name: 'Now Now Noho'
  }
];

/**
 * Get the discount percentage for a specific day of the week
 * @param date - The date to check
 * @returns Discount percentage for that day
 */
export function getDayOfWeekDiscount(date: Date): number {
  const day = date.getDay();
  const discounts = [10, 15, 20, 25, 30, 35, 40]; // Sun-Sat (0-6)
  return discounts[day];
}

/**
 * Check if a date is within the DOW discount range
 * @param date - The date to check
 * @returns true if date is within the configured DOW range
 */
export function isWithinDOWRange(date: Date): boolean {
  const start = new Date('2026-03-02');
  const end = new Date('2026-03-08');
  return date >= start && date <= end;
}

/**
 * Get all test dates for the DOW discount range
 * @returns Array of dates with their expected discounts
 */
export function getDOWTestDates(): Array<{ date: Date; day: string; discount: number }> {
  return [
    { date: new Date('2026-03-02'), day: 'Monday', discount: 15 },
    { date: new Date('2026-03-03'), day: 'Tuesday', discount: 20 },
    { date: new Date('2026-03-04'), day: 'Wednesday', discount: 25 },
    { date: new Date('2026-03-05'), day: 'Thursday', discount: 30 },
    { date: new Date('2026-03-06'), day: 'Friday', discount: 35 },
    { date: new Date('2026-03-07'), day: 'Saturday', discount: 40 },
    { date: new Date('2026-03-08'), day: 'Sunday', discount: 10 }
  ];
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
 * Get date for checkout (1 day after check-in)
 * @param checkInDate - Check-in date
 * @returns Check-out date
 */
export function getCheckoutDate(checkInDate: Date): Date {
  const checkout = new Date(checkInDate);
  checkout.setDate(checkout.getDate() + 1);
  return checkout;
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
