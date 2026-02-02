const crypto = require('crypto');

const cugJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI';

const parts = cugJwt.split('.');
const signatureInput = parts[0] + '.' + parts[1];
const expectedSig = parts[2];

console.log('Trying to find the JWT secret for bookings.tripbeast.com...\n');

// Try various common patterns
const secretVariants = [
  // Original admin secrets
  'voyager_travel',
  '123456789',
  'LULX6HXY7L',
  
  // Case variations
  'Voyager_travel',
  'VOYAGER_TRAVEL',
  'Voyager_Travel',
  
  // Spacing/separator variations
  'voyager-travel',
  'voyagertravel',
  'voyager travel',
  'Voyager Travel',
  'VoyagerTravel',
  'voyagerTravel',
  
  // Common production secrets
  'tripbeast',
  'TripBeast',
  'TRIPBEAST',
  'tripbeast_secret',
  'tripbeast_prod',
  'skyline',
  'Skyline',
  'skyline_voyages',
  'SkylineVoyages',
  
  // Possible typos or variations
  'voyager_travels',
  'voyagers_travel',
  'v oyager_travel',
  'voyager_trave',
  
  // ExplorePro (from partner name in JWT)
  'ExplorePro',
  'explorepro',
  'explore_pro',
  'EXPLOREPRO',
  
  // Common default secrets
  'secret',
  'Secret',
  'SECRET',
  'jwt_secret',
  'JWT_SECRET',
  'my_secret_key',
  
  // Based on businessRuleId
  'd5228803-c475-4972-81b5-0420431f1608',
  
  // Based on customer email domain
  'yopmail',
  'rezmate',
  'tripbeast.com'
];

for (const secret of secretVariants) {
  const sig = crypto
    .createHmac('sha256', secret)
    .update(signatureInput)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  if (sig === expectedSig) {
    console.log('✅ ✅ ✅ MATCH FOUND! ✅ ✅ ✅');
    console.log('Secret:', secret);
    console.log('\nThis is the JWT secret for bookings.tripbeast.com!');
    process.exit(0);
  }
}

console.log('❌ No match found with', secretVariants.length, 'common variations');
console.log('\nThe JWT secret is not one of the common patterns.');
console.log('It must be stored in:');
console.log('  - A different admin panel');
console.log('  - Environment variables');
console.log('  - A configuration file');
console.log('  - Or obtained from the development team');
