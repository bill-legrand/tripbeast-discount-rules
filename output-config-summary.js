#!/usr/bin/env node
/**
 * Output Config Summary - URLs, discount policies, IDs, JWTs
 * Run: node output-config-summary.js
 */

const BOOKING_ENGINE_JWT = process.env.BOOKING_ENGINE_JWT || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI';

const ANCILLARY_JWT = process.env.ANCILLARY_JWT ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzY5ODk4NjI0fQ.WrZ3RLvRGZRmDlJF9dJdtO685LDgvITmE1GXPIb6qUg';

function decodePayload(jwt) {
  try {
    const payload = jwt.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch (e) { return {}; }
}

const sep = '='.repeat(70);
console.log(sep);
console.log('CONFIG SUMMARY REPORT - Tripbeast Discount Rules');
console.log(sep);
console.log('');

console.log('--- URLS ---');
console.log('  Admin:            https://admin.rezmatestage.com');
console.log('  Booking (DOW):    https://bookings.tripbeast.com');
console.log('  Ancillary:        https://travel.tripbeast.com');
console.log('  CUG:              https://cug.rezmatestage.com');
console.log('  B2C:              https://b2c.rezmatestage.com');
console.log('  API:              https://api.rezmatestage.com');
console.log('');

console.log('--- LOGINS (run-tests.ps1) ---');
console.log('  ADMIN_USERNAME:   bill.legrand@gmail.com');
console.log('  ADMIN_PASSWORD:   (set in run-tests.ps1)');
console.log('');

console.log('--- DOW DISCOUNT POLICY (Mar 2-8, 2026) ---');
console.log('  Mon: 15% | Tue: 20% | Wed: 25% | Thu: 30% | Fri: 35% | Sat: 40% | Sun: 10%');
console.log('  Shoulders (Mar 1, Mar 9): Expected 0%');
console.log('  Discrepancy threshold: >1% off expected');
console.log('');

console.log('--- ANCILLARY DISCOUNT POLICY (helpers/ancillary-discount-nights) ---');
console.log('  Feb 1-2:      10% flat');
console.log('  Feb 15-21:    12% flat');
console.log('  Feb 22-28:    DOW Sun 15%, Mon 20%, Tue 25%, Wed 30%, Thu 35%, Fri 40%, Sat 10%');
console.log('');

console.log('--- HOTEL IDs (LAS_VEGAS_HOTELS) ---');
console.log('  Longhorn:  hotel_id=2008, property_id=12384405, room_id=201273159');
console.log('  Hotel 2007: hotel_id=2007, property_id=12384404, room_id=201273158');
console.log('  Hotel 2009: hotel_id=2009, property_id=12384406, room_id=201273160');
console.log('');

console.log('--- BOOKING_ENGINE_JWT (DOW / bookings.tripbeast.com) ---');
const dowPayload = decodePayload(BOOKING_ENGINE_JWT);
console.log('  Partner:     ', dowPayload.partnerName);
console.log('  User:        ', dowPayload.userFirstName, dowPayload.userLastName, dowPayload.userEmail);
console.log('  pricingRuleId:  ', dowPayload.pricingRuleId);
console.log('  businessRuleId: ', dowPayload.businessRuleId);
console.log('  spendingLimit:  ', dowPayload.spendingLimit);
console.log('  Full JWT:    ', BOOKING_ENGINE_JWT.substring(0, 60) + '...');
console.log('  Env override: BOOKING_ENGINE_JWT');
console.log('');

console.log('--- ANCILLARY_JWT (travel.tripbeast.com) ---');
const ancPayload = decodePayload(ANCILLARY_JWT);
console.log('  Partner:       ', ancPayload.partnerName);
console.log('  businessRuleId: ', ancPayload.businessRuleId);
console.log('  discountRuleId: ', ancPayload.discountRuleId);
console.log('  Full JWT:    ', ANCILLARY_JWT.substring(0, 60) + '...');
console.log('  Env override: ANCILLARY_JWT');
console.log('');

console.log('--- KEYS / SECRETS ---');
console.log('  JWT secrets: Not stored in repo (used server-side to sign tokens)');
console.log('  Generate DOW JWT:  node generate-jwt.js');
console.log('  Generate Ancillary: node generate-jwt-ancillary.js');
console.log('  Verify JWT:        node verify-ancillary-jwt.js');
console.log('');

console.log(sep);
