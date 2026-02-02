const jwt = require('jsonwebtoken');

// Ancillary Environment Configuration
const JWT_SECRET = 'LULX6HXY7L';
const BUSINESS_RULE_ID = 'aa4c786b-6516-4cf8-be1c-29e458dcf1f6';
const DISCOUNT_RULE_ID = 'eb511fff-19b8-4a27-91d5-dd8e69f31809';

// Get discount rule ID from command line argument if provided
const discountRuleId = process.argv[2] || DISCOUNT_RULE_ID;

// JWT Payload for Ancillary (TripBeast channel)
const payload = {
  partnerName: 'tripBeast',
  userFirstName: '',
  userLastName: '',
  userEmail: '',
  pricingRuleId: '',
  businessRuleId: BUSINESS_RULE_ID,
  discountRuleId: discountRuleId,
  clientLogoUrl: '',
  membership: false,
  iat: Math.floor(Date.now() / 1000)
};

// Generate JWT
const token = jwt.sign(payload, JWT_SECRET);

console.log('\n=== ANCILLARY JWT GENERATED ===\n');
console.log('Environment: travel.tripbeast.com');
console.log('Customer: Tripbeast Ancillary');
console.log('Distribution Channel: TripBeast\n');
console.log('Configuration:');
console.log('  JWT Secret:', JWT_SECRET);
console.log('  Business Rule ID:', BUSINESS_RULE_ID);
console.log('  Discount Rule ID:', discountRuleId);
console.log('\nGenerated JWT:');
console.log(token);
console.log('\n=== BOOKING ENGINE URL ===\n');
console.log(`https://travel.tripbeast.com/?jwt=${token}`);
console.log('\n=== SEARCH HOTELS URL (Feb 5-6, 2026, Las Vegas) ===\n');
console.log(`https://travel.tripbeast.com/?jwt=${token}&page=hotel&check_in=2026-02-05&check_out=2026-02-06&city=Las%20Vegas`);
console.log('\n=== PAYLOAD ===\n');
console.log(JSON.stringify(payload, null, 2));
console.log('\n');
