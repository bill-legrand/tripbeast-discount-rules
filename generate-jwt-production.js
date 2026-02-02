/**
 * JWT Token Generator for Production (Without Discount Rules)
 * 
 * This generates a JWT compatible with bookings.tripbeast.com
 * Note: Production does NOT include discountRuleId field
 */

const crypto = require('crypto');

// JWT Secret Key
const JWT_SECRET = 'voyager_travel';

// JWT Header
const header = {
  alg: 'HS256',
  typ: 'JWT'
};

// JWT Payload (NO discountRuleId for production)
const payload = {
  partnerName: 'ExplorePro',
  userFirstName: 'Skyline',
  userLastName: 'Voyages',
  userEmail: 'skyline.cus@yopmail.com',
  pricingRuleId: '3de108d0-7994-4957-a9bd-dc2a7c056186',
  businessRuleId: 'd5228803-c475-4972-81b5-0420431f1608',  // Correct ID (missing the 4)
  spendingLimit: '10875.0',
  payCyclesPerYear: 12,
  clientLogoUrl: '',
  returnUrl: 'https://partner-app.rezmate.com',
  cartPayloadUrl: 'https://partner-app.rezmate.com/api/partner',
  partnerCartUrl: 'https://partner-app.rezmate.com',
  returnAuth: '3fb88d69-1d3e-3418-a970-5314255c10a2',
  iat: Math.floor(Date.now() / 1000)
};

/**
 * Base64 URL encode
 */
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate JWT token
 */
function generateJWT() {
  // Encode header
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  
  // Encode payload
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  // Create signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // Combine to create JWT
  const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;
  
  return jwt;
}

// Generate the token
const token = generateJWT();

console.log('\n═══════════════════════════════════════════════════════════');
console.log('🔑 JWT TOKEN GENERATOR - Production (No Discount Rules)');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📋 Configuration:');
console.log(`   Customer: Skyline Voyages`);
console.log(`   Partner: ExplorePro`);
console.log(`   Channel: Voyager Travel Platform`);
console.log(`   JWT Secret: ${JWT_SECRET}`);
console.log(`   Environment: PRODUCTION (bookings.tripbeast.com)`);
console.log(`   ⚠️  Note: NO discountRuleId field (not supported in production yet)\n`);

console.log('🔐 Generated JWT Token:');
console.log('─────────────────────────────────────────────────────────');
console.log(token);
console.log('─────────────────────────────────────────────────────────\n');

console.log('🌐 Booking Engine URLs:');
console.log(`\n   Full URL:\n   https://bookings.tripbeast.com/?jwt=${token}\n`);
console.log(`   With Hotel Search (Las Vegas, Feb 5-6, 2026):\n   https://bookings.tripbeast.com/?jwt=${token}&page=hotel&check_in=2026-02-05&check_out=2026-02-06&city=Las%20Vegas\n`);

console.log('✅ Token generated successfully!');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('🔍 Token Payload (for verification):');
console.log(JSON.stringify(payload, null, 2));
console.log('');
