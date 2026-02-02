/**
 * JWT Token Generator for Tripbeast Discount Rules
 * 
 * This script generates a JWT token with the Low Rate Discount Rule ID
 * to be used in the booking engine URL.
 * 
 * Usage:
 *   node generate-jwt.js
 * 
 * Or with custom discount rule ID:
 *   node generate-jwt.js <discount-rule-id>
 * 
 * Examples:
 *   node generate-jwt.js 07883db1-759d-4589-8f13-8a008c081ae8  # Low Rate Discount
 *   node generate-jwt.js f73356ed-4b76-4649-9ef4-f97abab1ab5a  # Bill Discount
 */

const crypto = require('crypto');

// JWT Secret Key from Distribution Channel → Voyager Travel Platform
const JWT_SECRET = 'voyager_travel';

// Get discount rule ID from command line or use Low Rate Discount by default
const discountRuleId = process.argv[2] || '07883db1-759d-4589-8f13-8a008c081ae8';

// JWT Header
const header = {
  alg: 'HS256',
  typ: 'JWT'
};

// JWT Payload
const payload = {
  partnerName: 'ExplorePro',
  userFirstName: 'Skyline',
  userLastName: 'Voyages',
  userEmail: 'skyline.cus@yopmail.com',
  pricingRuleId: '3de108d0-7994-4957-a9bd-dc2a7c056186',    // Markup Rule ID
  businessRuleId: 'd5228803-c475-4972-81b5-0420431f1608',   // Business Rule ID
  discountRuleId: discountRuleId,                             // Discount Rule ID (NEW!)
  spendingLimit: '10875.0',
  payCyclesPerYear: 12,
  clientLogoUrl: '',
  returnUrl: 'https://partner-app.rezmate.com',
  cartPayloadUrl: 'https://partner-app.rezmate.com/api/partner',
  partnerCartUrl: 'https://partner-app.rezmate.com',
  returnAuth: '3fb88d69-1d3e-3418-a970-5314255c10a2',
  iat: Math.floor(Date.now() / 1000)  // Current Unix timestamp
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
console.log('🔑 JWT TOKEN GENERATOR - Tripbeast Discount Rules');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📋 Configuration:');
console.log(`   Customer: Skyline Voyages`);
console.log(`   Partner: ExplorePro`);
console.log(`   Channel: Voyager Travel Platform`);
console.log(`   JWT Secret: ${JWT_SECRET}`);
console.log(`   Discount Rule ID: ${discountRuleId}\n`);

console.log('🎯 Discount Rule:');
if (discountRuleId === '07883db1-759d-4589-8f13-8a008c081ae8') {
  console.log(`   Name: Discount Voyag (Low Rate Discount)`);
  console.log(`   Discount: 2% on rates under $100`);
  console.log(`   Date Range: April 1-15, 2026`);
} else if (discountRuleId === 'f73356ed-4b76-4649-9ef4-f97abab1ab5a') {
  console.log(`   Name: Bill Discount`);
  console.log(`   Default: 5%, Date Range: 10% (Feb 1-14, 2026)`);
} else if (discountRuleId === 'eb511fff-19b8-4a27-91d5-dd8e69f31809') {
  console.log(`   Name: Ancii Stage DR`);
  console.log(`   Customer: Tripbeast Ancillary`);
} else {
  console.log(`   Custom Discount Rule`);
}
console.log('');

console.log('🔐 Generated JWT Token:');
console.log('─────────────────────────────────────────────────────────');
console.log(token);
console.log('─────────────────────────────────────────────────────────\n');

console.log('🌐 Booking Engine URLs:');
console.log(`\n   Full URL:\n   https://bookings.rezmate.com?jwt=${token}\n`);
console.log(`   With Hotel Search (April 5-6, 2026):\n   https://bookings.rezmate.com?jwt=${token}&page=hotel&check_in=2026-04-05&check_out=2026-04-06&city=Las%20Vegas\n`);

console.log('📝 To Use This Token:');
console.log(`   1. Copy the token above`);
console.log(`   2. Add to .env file: JWT_TOKEN=${token}`);
console.log(`   3. Run tests: .\\run-low-rate-tests.ps1\n`);

console.log('✅ Token generated successfully!');
console.log('═══════════════════════════════════════════════════════════\n');

// Also decode and display the payload for verification
console.log('🔍 Token Payload (for verification):');
console.log(JSON.stringify(payload, null, 2));
console.log('');

// Verify signature
const parts = token.split('.');
console.log('📦 Token Structure:');
console.log(`   Header: ${parts[0].substring(0, 20)}...`);
console.log(`   Payload: ${parts[1].substring(0, 20)}...`);
console.log(`   Signature: ${parts[2].substring(0, 20)}...`);
console.log(`   Total Length: ${token.length} characters\n`);

// Provide verification URL
console.log('🔗 Verify Token at: https://jwt.io');
console.log(`   Paste the token and use secret: ${JWT_SECRET}\n`);
