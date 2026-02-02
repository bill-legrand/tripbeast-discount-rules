const crypto = require('crypto');

const cugJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6IkV4cGxvcmVQcm8iLCJ1c2VyRmlyc3ROYW1lIjoiU2t5bGluZSIsInVzZXJMYXN0TmFtZSI6IlZveWFnZXMiLCJ1c2VyRW1haWwiOiJza3lsaW5lLmN1c0B5b3BtYWlsLmNvbSIsInByaWNpbmdSdWxlSWQiOiIzZGUxMDhkMC03OTk0LTQ5NTctYTliZC1kYzJhN2MwNTYxODYiLCJidXNpbmVzc1J1bGVJZCI6ImQ1MjI4ODAzLWM0NzUtNDk3Mi04MWI1LTA0MjA0MzFmMTYwOCIsInNwZW5kaW5nTGltaXQiOiIxMDg3NS4wIiwicGF5Q3ljbGVzUGVyWWVhciI6MTIsImNsaWVudExvZ29VcmwiOiIiLCJyZXR1cm5VcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwiY2FydFBheWxvYWRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tL2FwaS9wYXJ0bmVyIiwicGFydG5lckNhcnRVcmwiOiJodHRwczovL3BhcnRuZXItYXBwLnJlem1hdGUuY29tIiwicmV0dXJuQXV0aCI6IjNmYjg4ZDY5LTFkM2UtMzQxOC1hOTcwLTUzMTQyNTVjMTBhMiIsImlhdCI6MTcyOTQ5NDI2Mn0.Ha3371JIFdj3Z4L-SrlYSYnfus3X_r91ke_-pUOpbuI';

const ancillaryJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiIiLCJjbGllbnRMb2dvVXJsIjoiIiwibWVtYmVyc2hpcCI6ZmFsc2UsImlhdCI6MTc2ODg5NDQwMn0.MpE_ewPTnBTDW3bGyo0U7hiMcvIWLV0V5I_EPOQIBkg';

function testSecret(jwt, secretName, secret) {
  const parts = jwt.split('.');
  const signatureInput = parts[0] + '.' + parts[1];
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signatureInput)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  const match = signature === parts[2];
  
  if (match) console.log('✅ MATCH FOUND!');
  console.log('Secret:', secretName, '=', secret);
  console.log('Expected:', parts[2]);
  console.log('Generated:', signature);
  console.log('Match:', match);
  console.log('');
  
  return match;
}

const secrets = [
  ['voyager_travel', 'voyager_travel'],
  ['123456789', '123456789'],
  ['LULX6HXY7L', 'LULX6HXY7L']
];

console.log('=== TESTING CUG JWT (bookings.tripbeast.com) ===\n');
let cugFound = false;
for (const [name, secret] of secrets) {
  if (testSecret(cugJwt, name, secret)) {
    cugFound = true;
    break;
  }
}
if (!cugFound) console.log('❌ No matching secret found for CUG JWT\n');

console.log('\n=== TESTING ANCILLARY JWT (travel.tripbeast.com) ===\n');
let ancillaryFound = false;
for (const [name, secret] of secrets) {
  if (testSecret(ancillaryJwt, name, secret)) {
    ancillaryFound = true;
    break;
  }
}
if (!ancillaryFound) console.log('❌ No matching secret found for Ancillary JWT');
