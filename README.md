# Tripbeast Discount Rules - Testing Documentation

## 🚀 Quick Start

```powershell
# 1. Install dependencies (first time only)
npm install
npx playwright install chromium

# 2. Run quick verification test
.\run-tests.ps1 -Headed

# 3. Open interactive test UI
.\run-tests.ps1 -UI
```

**See [QUICK_START_TESTING.md](QUICK_START_TESTING.md) for detailed instructions.**

---

## Overview

This repository contains comprehensive testing documentation for the Tripbeast Discount Rules enhancement for Closed User Groups (CUG). The discount rules feature allows for flexible discount configuration across different booking engines, channels, and stakeholders.

## Feature Summary

### Discount Rule Creation
- Manual rule name entry
- System-generated unique rule IDs
- Applied on subtotal (ITEM PRICE) excluding taxes & fees

### Booking Engine Support
- **Ancillary Booking Engine**: System-generated ID passed via JWT token
- **CUG Booking Engine**: System-generated ID passed via JWT token
- **B2C Public Booking Engine**: System-generated ID not applicable

### Configuration Options
- Default rule assignment per channel
- Stakeholder-wise discount configuration
- Product-level discount application
- Upload user functionality (Ancillary & CUG only)

### Discount Types
1. **Default Discount**: Fixed percentage applied to all bookings
2. **Date Range-Based Discount**: Applied within specific date ranges
3. **Specific Date-Based Discount**: Applied on specific dates
4. **Dynamic Discount Rules**: Condition-based discounts (similar to markup rules)

### Strike-Through Price Display
Four display scenarios based on toggle configurations:
- **Case 1**: Hotel strike-through ON + Discount strike-through ON → Combined display
- **Case 2**: Hotel strike-through OFF + Discount strike-through ON → Discount only
- **Case 3**: Hotel strike-through ON + Discount strike-through OFF → Final price only
- **Case 4**: Both OFF → Final discounted price only

## Documentation Files

### 1. TEST_PLAN.md
Comprehensive test plan document containing:
- Test strategy and approach
- 50 detailed test cases across 11 categories
- Test data templates
- Test execution checklist
- Defect reporting guidelines
- Exit criteria and sign-off requirements

**Categories Covered**:
- Discount Rule Creation (TC-001 to TC-005)
- JWT Token Integration (TC-006 to TC-010)
- Application & Channel Configuration (TC-011 to TC-016)
- Discount Types (TC-017 to TC-024)
- Strike-Through Price Display (TC-025 to TC-030)
- Integration Testing (TC-031 to TC-035)
- Negative Testing (TC-036 to TC-040)
- Performance Testing (TC-041 to TC-042)
- UI/UX Testing (TC-043 to TC-045)
- Security Testing (TC-046 to TC-049)
- Regression Testing (TC-050)

### 2. TEST_SCENARIOS.xlsx
Spreadsheet format of all test scenarios for easy tracking and reporting. Includes:
- Test scenario ID
- Test scenario name
- Priority level
- Category
- Preconditions
- Test steps
- Expected results
- Test data
- Status tracking

### 3. TEST_EXECUTION_CHECKLIST.md
Detailed checklist for test execution including:
- Pre-test setup requirements
- Environment setup checklist
- Test data preparation checklist
- Category-wise test execution tracking
- Post-test activities
- Test metrics and reporting
- Exit criteria verification

### 4. DEFECT_REPORT_TEMPLATE.md
Standardized defect reporting template with:
- Defect classification (Severity, Priority, Category, Type)
- Environment details
- Reproduction steps
- Expected vs actual results
- Attachments section
- Developer section for root cause and fix details
- Retest section
- Status history tracking
- Example defect report

### 5. API_TEST_COLLECTION.json
Postman collection for API testing including:
- Discount rule management endpoints
- Date-based discount rule creation
- Dynamic discount rule configuration
- Channel configuration APIs
- JWT token operations
- Price calculation endpoints
- Booking operations
- Upload user functionality
- Validation and error case testing

## Getting Started

### Prerequisites
1. Access to Tripbeast test environments:
   - Ancillary Booking Engine
   - CUG Booking Engine
   - B2C Public Booking Engine
   - Admin Panel

2. Test accounts with appropriate permissions

3. Tools required:
   - Postman (for API testing)
   - Browser with developer tools
   - Screen capture tool
   - JWT token decoder

### Setup Instructions

1. **Review Documentation**
   ```
   Start with TEST_PLAN.md to understand the overall testing strategy
   ```

2. **Import API Collection**
   ```
   Import API_TEST_COLLECTION.json into Postman
   Update environment variables (base_url, auth_token, etc.)
   ```

3. **Prepare Test Environment**
   ```
   Follow the Pre-Test Setup Checklist in TEST_EXECUTION_CHECKLIST.md
   Create test channels, products, and stakeholders
   Configure test users
   ```

4. **Execute Tests**
   ```
   Follow the test execution order in TEST_EXECUTION_CHECKLIST.md
   Use TEST_SCENARIOS.xlsx for tracking progress
   Document results and defects using DEFECT_REPORT_TEMPLATE.md
   ```

## Test Execution Order

### Phase 1: Core Functionality (Days 1-2)
1. Discount Rule Creation (TC-001 to TC-005)
2. JWT Token Integration (TC-006 to TC-010)
3. Channel Configuration (TC-011 to TC-016)

### Phase 2: Discount Types & Display (Days 3-4)
4. Discount Types (TC-017 to TC-024)
5. Strike-Through Display (TC-025 to TC-030)

### Phase 3: Integration & Advanced Testing (Days 5-7)
6. Integration Testing (TC-031 to TC-035)
7. Negative Testing (TC-036 to TC-040)
8. Performance Testing (TC-041 to TC-042)
9. UI/UX Testing (TC-043 to TC-045)
10. Security Testing (TC-046 to TC-049)

### Phase 4: Regression & Sign-off (Days 8-9)
11. Regression Testing (TC-050)
12. Defect Retesting
13. Final Verification
14. Documentation & Sign-off

## Test Data

### Sample Discount Rules
```json
{
  "rule_name": "CUG_Winter_2026",
  "rule_id": "DR-12345",
  "discount_type": "date_range",
  "discount_percentage": 15,
  "start_date": "2026-01-01",
  "end_date": "2026-01-31"
}
```

### Sample JWT Token Payload
```json
{
  "user_id": "USR-12345",
  "booking_engine_type": "CUG",
  "discount_rule_id": "DR-12345",
  "channel_id": "Channel_A",
  "stakeholder_id": "STK-001"
}
```

### Sample Price Calculation
```
Base Price: $1,000
Markup (+10%): $100
Subtotal: $1,100
Discount (-15%): -$165
Discounted Subtotal: $935
Taxes: $50
Fees: $25
Total: $1,010
```

## Key Testing Scenarios

### Critical Test Cases (Must Pass)
- TC-006: JWT Token Contains Discount Rule ID (Ancillary BE)
- TC-007: JWT Token Contains Discount Rule ID (CUG BE)
- TC-013: Apply Discount Rule to Active Products
- TC-017: Apply Default Discount
- TC-018: Apply Date Range-Based Discount
- TC-020: Apply Dynamic Discount Rules
- TC-023: Discount Applied on Subtotal Only
- TC-025 to TC-028: All Strike-Through Display Cases
- TC-034: Discount + Markup Combined Application
- TC-046: JWT Token Tampering
- TC-050: Existing Markup Rules Still Function

### High Priority Test Cases
- All JWT token integration tests
- All channel configuration tests
- All discount type tests
- All strike-through display tests
- Security tests

## Defect Severity Guidelines

### Critical
- System crash or data loss
- Security vulnerabilities
- Incorrect price calculations
- JWT token security issues

### High
- Major functionality broken
- Discount not applied when it should be
- Strike-through display completely wrong
- No workaround available

### Medium
- Functionality impaired but workaround exists
- UI issues that affect usability
- Performance degradation

### Low
- Minor cosmetic issues
- Typos or formatting issues
- Issues with minimal user impact

## Reporting

### Daily Status Report
- Test cases executed
- Test cases passed/failed
- New defects found
- Defects fixed and retested
- Blockers or risks

### Test Summary Report
- Overall test execution statistics
- Pass/fail rates by category
- Defect summary
- Test coverage metrics
- Recommendations

## Best Practices

1. **Always verify JWT token contents** before and after each test
2. **Clear browser cache** between strike-through display tests
3. **Document actual vs expected results** with screenshots
4. **Test with multiple products** to ensure consistency
5. **Verify database state** after rule creation/modification
6. **Test edge cases** (0%, 100%, boundary dates)
7. **Perform cross-browser testing** for UI tests
8. **Monitor API response times** during performance tests
9. **Use consistent test data** across related test cases
10. **Retest after every fix** to ensure no regression

## Troubleshooting

### Common Issues

**Issue**: JWT token doesn't contain discount rule ID
- **Solution**: Verify rule is configured for correct booking engine type
- **Solution**: Check token generation API parameters

**Issue**: Discount not applied
- **Solution**: Verify rule is active and assigned to channel
- **Solution**: Check product is included in rule configuration
- **Solution**: Verify date range if using date-based discount

**Issue**: Strike-through not displaying
- **Solution**: Check strike-through toggle settings
- **Solution**: Verify supplier data includes strike-through pricing
- **Solution**: Clear browser cache and reload

**Issue**: Incorrect discount calculation
- **Solution**: Verify discount is applied on subtotal (not including taxes/fees)
- **Solution**: Check if multiple discounts are configured (priority issue)
- **Solution**: Verify markup is applied before discount

## Contact Information

- **Test Lead**: [Name, Email]
- **Development Lead**: [Name, Email]
- **Product Owner**: [Name, Email]
- **QA Manager**: [Name, Email]

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-29 | Test Team | Initial documentation created |

## License

Internal use only - Tripbeast Technologies

---

## Quick Reference

### Test Execution Commands

```bash
# Run API tests
postman collection run API_TEST_COLLECTION.json

# Generate test report
# (Add your reporting tool commands here)
```

### Important URLs

- Test Environment: `https://test.tripbeast.com`
- Ancillary BE: `https://test-ancillary.tripbeast.com`
- CUG BE: `https://test-cug.tripbeast.com`
- B2C BE: `https://test-b2c.tripbeast.com`
- Admin Panel: `https://test-admin.tripbeast.com`
- API Base URL: `https://test-api.tripbeast.com`

### Test Data Access

- Test Channels: Channel_A, Channel_B, Channel_C
- Test Products: PROD-001 to PROD-010
- Test Users: USR-12345, USR-67890
- Test Stakeholders: STK-001, STK-002

---

**For questions or issues, please contact the Test Lead or refer to the detailed documentation files.**
