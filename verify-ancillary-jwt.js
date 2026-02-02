/**
 * Verify Ancillary JWTs for travel.tripbeast.com
 * - Decode payloads
 * - Verify signatures against known secret LULX6HXY7L
 */

const crypto = require('crypto');

const JWT_SECRET = 'LULX6HXY7L';

// User's working JWT (from conversation - you said this works on travel.tripbeast.com)
const USER_WORKING_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiIiLCJjbGllbnRMb2dvVXJsIjoiIiwibWVtYmVyc2hpcCI6ZmFsc2UsImlhdCI6MTc2ODg5NDQwMn0.MpE_ewPTnBTDW3bGyo0U7hiMcvIWLV0V5I_EPOQIBkg';

// Our generated JWT (with businessRuleId + discountRuleId) - used in the test
const OUR_TEST_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyTmFtZSI6InRyaXBCZWFzdCIsInVzZXJGaXJzdE5hbWUiOiIiLCJ1c2VyTGFzdE5hbWUiOiIiLCJ1c2VyRW1haWwiOiIiLCJwcmljaW5nUnVsZUlkIjoiIiwiYnVzaW5lc3NSdWxlSWQiOiJhYTRjNzg2Yi02NTE2LTRjZjgtYmUxYy0yOWU0NThkY2YxZjYiLCJkaXNjb3VudFJ1bGVJZCI6ImViNTExZmZmLTE5YjgtNGEyNy05MWQ1LWRkOGU2OWYzMTgwOSIsImNsaWVudExvZ29VcmwiOiIiLCJtZW1iZXJzaGlwIjpmYWxzZSwiaWF0IjoxNzY5ODk3NDU4fQ.mJ25TX0Sdm8aZlV94y7Wb9Pa-F_jFWEKLvVEGSr-sPU';

function decodePayload(jwt) {
  const parts = jwt.split('.');
  if (parts.length !== 3) return null;
  const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
  return JSON.parse(payload);
}

function verifySignature(jwt, secret) {
  const parts = jwt.split('.');
  const signatureInput = parts[0] + '.' + parts[1];
  const expectedSig = parts[2];
  const computed = crypto
    .createHmac('sha256', secret)
    .update(signatureInput)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return computed === expectedSig;
}

console.log('=== ANCILLARY JWT VERIFICATION (travel.tripbeast.com) ===\n');
console.log('Secret used for signing:', JWT_SECRET);
console.log('');

console.log('--- 1. YOUR WORKING JWT (you said this works on travel.tripbeast.com) ---\n');
const userPayload = decodePayload(USER_WORKING_JWT);
console.log('Payload:', JSON.stringify(userPayload, null, 2));
console.log('Has businessRuleId:', !!userPayload.businessRuleId, '→', userPayload.businessRuleId || '(empty/none)');
console.log('Has discountRuleId:', 'discountRuleId' in userPayload, '→', userPayload.discountRuleId || '(not in payload)');
const userSigOk = verifySignature(USER_WORKING_JWT, JWT_SECRET);
console.log('Signature valid with LULX6HXY7L:', userSigOk ? '✅ YES' : '❌ NO');
console.log('');

console.log('--- 2. OUR TEST JWT (with businessRuleId + discountRuleId) ---\n');
const ourPayload = decodePayload(OUR_TEST_JWT);
console.log('Payload:', JSON.stringify(ourPayload, null, 2));
console.log('Has businessRuleId:', !!ourPayload.businessRuleId, '→', ourPayload.businessRuleId || '(empty)');
console.log('Has discountRuleId:', !!ourPayload.discountRuleId, '→', ourPayload.discountRuleId || '(empty)');
const ourSigOk = verifySignature(OUR_TEST_JWT, JWT_SECRET);
console.log('Signature valid with LULX6HXY7L:', ourSigOk ? '✅ YES' : '❌ NO');
console.log('');

console.log('--- SUMMARY ---\n');
console.log('Your working JWT: minimal payload (no businessRuleId, no discountRuleId).');
console.log('Our test JWT: includes businessRuleId + discountRuleId for "Ancii Stage DR".');
console.log('');
if (userSigOk && ourSigOk) {
  console.log('Both JWTs have valid signatures with LULX6HXY7L.');
  console.log('If discounts still don’t show, the booking engine may:');
  console.log('  - Ignore discountRuleId and use channel default, or');
  console.log('  - Require the minimal payload (your working JWT format).');
  console.log('Recommendation: Test with YOUR working JWT URL first; if the 10% discount');
  console.log('still doesn’t appear, the backend may need discountRuleId in the JWT.');
} else {
  if (!userSigOk) console.log('⚠️ Your working JWT does NOT verify with LULX6HXY7L (wrong secret?).');
  if (!ourSigOk) console.log('⚠️ Our generated JWT does NOT verify with LULX6HXY7L.');
}
