/**
 * 1-night stay test data for each night with discount rules
 * Ancii Stage DR - Hotels discount configuration
 *
 * - Feb 1-2: 10% flat
 * - Feb 15-21: 12% flat
 * - Feb 22-28: DOW (Sun 15%, Mon 20%, Tue 25%, Wed 30%, Thu 35%, Fri 40%, Sat 10%)
 */

export interface DiscountNight {
  checkIn: string;
  checkOut: string;
  expectedDiscountPct: number;
  label: string;
}

export const DISCOUNT_NIGHTS: DiscountNight[] = [
  // Feb 1-2: 10% flat
  { checkIn: '2026-02-01', checkOut: '2026-02-02', expectedDiscountPct: 10, label: 'Feb 1 (10%)' },
  { checkIn: '2026-02-02', checkOut: '2026-02-03', expectedDiscountPct: 10, label: 'Feb 2 (10%)' },
  // Feb 15-21: 12% flat
  { checkIn: '2026-02-15', checkOut: '2026-02-16', expectedDiscountPct: 12, label: 'Feb 15 (12%)' },
  { checkIn: '2026-02-16', checkOut: '2026-02-17', expectedDiscountPct: 12, label: 'Feb 16 (12%)' },
  { checkIn: '2026-02-17', checkOut: '2026-02-18', expectedDiscountPct: 12, label: 'Feb 17 (12%)' },
  { checkIn: '2026-02-18', checkOut: '2026-02-19', expectedDiscountPct: 12, label: 'Feb 18 (12%)' },
  { checkIn: '2026-02-19', checkOut: '2026-02-20', expectedDiscountPct: 12, label: 'Feb 19 (12%)' },
  { checkIn: '2026-02-20', checkOut: '2026-02-21', expectedDiscountPct: 12, label: 'Feb 20 (12%)' },
  { checkIn: '2026-02-21', checkOut: '2026-02-22', expectedDiscountPct: 12, label: 'Feb 21 (12%)' },
  // Feb 22-28: DOW (Sun 15%, Mon 20%, Tue 25%, Wed 30%, Thu 35%, Fri 40%, Sat 10%)
  { checkIn: '2026-02-22', checkOut: '2026-02-23', expectedDiscountPct: 15, label: 'Feb 22 Sun (15%)' },
  { checkIn: '2026-02-23', checkOut: '2026-02-24', expectedDiscountPct: 20, label: 'Feb 23 Mon (20%)' },
  { checkIn: '2026-02-24', checkOut: '2026-02-25', expectedDiscountPct: 25, label: 'Feb 24 Tue (25%)' },
  { checkIn: '2026-02-25', checkOut: '2026-02-26', expectedDiscountPct: 30, label: 'Feb 25 Wed (30%)' },
  { checkIn: '2026-02-26', checkOut: '2026-02-27', expectedDiscountPct: 35, label: 'Feb 26 Thu (35%)' },
  { checkIn: '2026-02-27', checkOut: '2026-02-28', expectedDiscountPct: 40, label: 'Feb 27 Fri (40%)' },
  { checkIn: '2026-02-28', checkOut: '2026-03-01', expectedDiscountPct: 10, label: 'Feb 28 Sat (10%)' },
];
