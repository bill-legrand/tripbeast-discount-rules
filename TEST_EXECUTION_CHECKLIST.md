# Tripbeast Discount Rules - Test Execution Checklist

## Pre-Test Setup Checklist

### Environment Setup
- [ ] **Test Environment Access**
  - [ ] Ancillary Booking Engine URL accessible
  - [ ] CUG Booking Engine URL accessible
  - [ ] B2C Public Booking Engine URL accessible
  - [ ] Admin Panel access verified
  - [ ] API endpoints documented and accessible

- [ ] **User Accounts & Permissions**
  - [ ] Admin user with full discount rule management access
  - [ ] Test user for Ancillary BE
  - [ ] Test user for CUG BE
  - [ ] Test user for B2C Public BE
  - [ ] User without permissions (for negative testing)
  - [ ] Multiple stakeholder accounts created

- [ ] **Test Data Preparation**
  - [ ] Channels created (Channel_A, Channel_B, Channel_C)
  - [ ] Active products configured (minimum 10 products)
  - [ ] Inactive products configured (for testing)
  - [ ] Stakeholder configurations set up
  - [ ] Existing markup rules documented
  - [ ] Hotel products with supplier strike-through (Expedia)
  - [ ] Products without supplier strike-through

- [ ] **JWT Token Infrastructure**
  - [ ] JWT token generation mechanism available
  - [ ] JWT token decoder tool ready
  - [ ] Sample JWT tokens prepared
  - [ ] Token validation endpoint accessible

- [ ] **Tools & Resources**
  - [ ] Screen capture tool installed
  - [ ] Browser developer tools accessible
  - [ ] Network monitoring tool ready
  - [ ] Database access (if needed)
  - [ ] Log file access configured
  - [ ] Defect tracking system access

### Documentation Review
- [ ] Requirements document reviewed
- [ ] Markup rules functionality documented
- [ ] API documentation reviewed
- [ ] UI mockups/wireframes reviewed (if available)
- [ ] Business rules clarified with stakeholders

---

## Test Execution Checklist by Category

### 1. Discount Rule Creation (TC-001 to TC-005)

#### TC-001: Create Discount Rule with Manual Name
- [ ] Test case executed
- [ ] Rule created successfully
- [ ] System-generated ID verified
- [ ] ID format documented
- [ ] Screenshot captured
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-002: Verify System-Generated ID Format
- [ ] Test case executed
- [ ] 5 rules created
- [ ] All IDs unique
- [ ] ID pattern documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-003: Create Rule with Special Characters in Name
- [ ] Test case executed
- [ ] Special characters tested
- [ ] System behavior documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-004: Create Rule with Empty Name
- [ ] Test case executed
- [ ] Validation error verified
- [ ] Error message documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-005: Create Rule with Duplicate Name
- [ ] Test case executed
- [ ] System behavior documented
- [ ] Both rules verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

### 2. JWT Token Integration (TC-006 to TC-010)

#### TC-006: JWT Token Contains Discount Rule ID (Ancillary BE)
- [ ] Test case executed
- [ ] Rule configured for Ancillary BE
- [ ] JWT token generated
- [ ] Token decoded successfully
- [ ] Discount rule ID present in token
- [ ] Token structure documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-007: JWT Token Contains Discount Rule ID (CUG BE)
- [ ] Test case executed
- [ ] Rule configured for CUG BE
- [ ] JWT token generated
- [ ] Token decoded successfully
- [ ] Booking completed successfully
- [ ] Discount applied correctly
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-008: JWT Token Not Used for B2C Public BE
- [ ] Test case executed
- [ ] B2C BE accessed
- [ ] Token checked (if any)
- [ ] Alternative method verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-009: Invalid JWT Token with Missing Discount Rule ID
- [ ] Test case executed
- [ ] Token without rule ID tested
- [ ] System behavior documented
- [ ] Error handling verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-010: JWT Token with Invalid Discount Rule ID
- [ ] Test case executed
- [ ] Non-existent rule ID tested
- [ ] Error message verified
- [ ] System handles gracefully
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

### 3. Application & Channel Configuration (TC-011 to TC-016)

#### TC-011: Mark Discount Rule as Default for Channel
- [ ] Test case executed
- [ ] Rule marked as default
- [ ] Default status verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-012: Configure Stakeholder-Wise Discount
- [ ] Test case executed
- [ ] Multiple stakeholder discounts configured
- [ ] Different percentages verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-013: Apply Discount Rule to Active Products
- [ ] Test case executed
- [ ] Rule applied to all active products
- [ ] All 5 products verified
- [ ] Inactive products checked
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-014: Apply Discount to Specific Products Only
- [ ] Test case executed
- [ ] Selective application verified
- [ ] Selected products have discount
- [ ] Non-selected products verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-015: Multiple Discount Rules for Same Channel
- [ ] Test case executed
- [ ] Multiple rules created
- [ ] Priority/conflict resolution tested
- [ ] System behavior documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-016: Remove Default Status from Channel
- [ ] Test case executed
- [ ] Default status removed
- [ ] Booking tested without default
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

### 4. Discount Types (TC-017 to TC-024)

#### TC-017: Apply Default Discount
- [ ] Test case executed
- [ ] Default discount configured
- [ ] Price calculation verified ($1000 → $900)
- [ ] Subtotal verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-018: Apply Date Range-Based Discount
- [ ] Test case executed
- [ ] Date range configured
- [ ] Discount applied within range
- [ ] Discount not applied outside range
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-019: Apply Specific Date-Based Discount
- [ ] Test case executed
- [ ] Specific date configured
- [ ] Discount applied on specific date
- [ ] Discount not applied on other dates
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-020: Apply Dynamic Discount Rules
- [ ] Test case executed
- [ ] Dynamic rule configured
- [ ] Condition met - discount applied
- [ ] Condition not met - no discount
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-021: Multiple Discount Types Priority
- [ ] Test case executed
- [ ] Multiple discount types configured
- [ ] Priority order verified
- [ ] Priority logic documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-022: Discount Percentage Validation
- [ ] Test case executed
- [ ] 0% tested
- [ ] 100% tested
- [ ] 101% tested (should fail)
- [ ] -5% tested (should fail)
- [ ] 25.5% tested
- [ ] Validation rules documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-023: Discount Applied on Subtotal Only
- [ ] Test case executed
- [ ] Price breakdown verified
- [ ] Discount calculation verified
- [ ] Taxes and fees excluded from discount
- [ ] Final price verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-024: Dynamic Discount with Multiple Conditions
- [ ] Test case executed
- [ ] Multiple conditions configured
- [ ] All conditions met - discount applied
- [ ] Partial conditions met - no discount
- [ ] AND logic verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

### 5. Strike-Through Price Display (TC-025 to TC-030)

#### TC-025: Case 1 - Both Strike-Throughs ON
- [ ] Test case executed
- [ ] Hotel strike-through ON
- [ ] Discount strike-through ON
- [ ] Combined strike-through verified
- [ ] Display: ~~$1200~~ ~~$1000~~ $900
- [ ] Screenshot captured
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-026: Case 2 - Hotel OFF, Discount ON with Strike-Through
- [ ] Test case executed
- [ ] Hotel strike-through OFF
- [ ] Discount strike-through ON
- [ ] Only discount strike-through visible
- [ ] Display: ~~$1000~~ $900
- [ ] Screenshot captured
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-027: Case 3 - Hotel ON, Discount ON, Discount Strike-Through OFF
- [ ] Test case executed
- [ ] Hotel strike-through ON
- [ ] Discount strike-through OFF
- [ ] No strike-through visible
- [ ] Display: $900 only
- [ ] Screenshot captured
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-028: Case 4 - Both Strike-Throughs OFF
- [ ] Test case executed
- [ ] Hotel strike-through OFF
- [ ] Discount strike-through OFF
- [ ] No strike-through visible
- [ ] Display: $900 only
- [ ] Screenshot captured
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-029: Toggle Strike-Through Display Setting
- [ ] Test case executed
- [ ] Strike-through initially ON
- [ ] Toggled to OFF
- [ ] Display updated
- [ ] Toggled back to ON
- [ ] Display restored
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-030: Strike-Through with Multiple Discounts
- [ ] Test case executed
- [ ] Multiple discounts applied
- [ ] Strike-through display verified
- [ ] Final price calculation verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

### 6. Integration Testing (TC-031 to TC-035)

#### TC-031: Upload User Functionality (Ancillary BE)
- [ ] Test case executed
- [ ] User list uploaded
- [ ] Discount rule assignment verified
- [ ] Booking tested
- [ ] JWT token verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-032: Upload User Functionality (CUG BE)
- [ ] Test case executed
- [ ] CUG user list uploaded
- [ ] User-discount mapping verified
- [ ] Booking tested
- [ ] JWT token verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-033: Discount Rule Similar to Markup Rule Behavior
- [ ] Test case executed
- [ ] UI/UX compared
- [ ] Configuration options compared
- [ ] Application logic compared
- [ ] Consistency verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-034: Discount + Markup Combined Application
- [ ] Test case executed
- [ ] Base price set
- [ ] Markup applied
- [ ] Discount applied
- [ ] Final subtotal verified ($935)
- [ ] Taxes and fees added correctly
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-035: Discount Rule Deactivation
- [ ] Test case executed
- [ ] Rule deactivated
- [ ] Status verified
- [ ] Booking tested (no discount)
- [ ] Rule reactivated
- [ ] Booking tested (discount applied)
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

### 7. Negative Testing (TC-036 to TC-040)

#### TC-036: Invalid Discount Percentage (Text Input)
- [ ] Test case executed
- [ ] Text input tested
- [ ] Validation error verified
- [ ] Error message documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-037: Expired Date Range Discount
- [ ] Test case executed
- [ ] Past date range configured
- [ ] Discount not applied
- [ ] Full price verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-038: Discount Rule Without Channel Assignment
- [ ] Test case executed
- [ ] Unassigned rule created
- [ ] Rule not available in booking
- [ ] System behavior documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-039: Concurrent Discount Rule Modifications
- [ ] Test case executed
- [ ] Two users accessed same rule
- [ ] Concurrent modifications attempted
- [ ] Conflict resolution verified
- [ ] Final state documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-040: Discount Rule Deletion with Active Bookings
- [ ] Test case executed
- [ ] Rule with active bookings identified
- [ ] Deletion attempted
- [ ] Warning/prevention verified
- [ ] Existing bookings protected
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

### 8. Performance Testing (TC-041 to TC-042)

#### TC-041: Discount Calculation Performance
- [ ] Test case executed
- [ ] 100 products loaded
- [ ] Calculation time measured
- [ ] All discounts verified
- [ ] Page load time < 3 seconds
- [ ] Performance metrics documented
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-042: JWT Token Size with Discount Rule ID
- [ ] Test case executed
- [ ] Token size measured
- [ ] Comparison with baseline
- [ ] Size difference minimal
- [ ] Token validity verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

### 9. UI/UX Testing (TC-043 to TC-045)

#### TC-043: Strike-Through Price Readability
- [ ] Test case executed
- [ ] Text styling verified
- [ ] Color contrast checked
- [ ] Mobile device tested
- [ ] Readability confirmed
- [ ] Screenshots captured (desktop & mobile)
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-044: Discount Information Display
- [ ] Test case executed
- [ ] Discount percentage displayed
- [ ] Savings amount displayed
- [ ] Tooltip/info icon checked
- [ ] User experience verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-045: Responsive Design - Strike-Through Display
- [ ] Test case executed
- [ ] Desktop (1920x1080) tested
- [ ] Tablet (768x1024) tested
- [ ] Mobile (375x667) tested
- [ ] Text wrapping verified
- [ ] No layout issues
- [ ] Screenshots captured (all devices)
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

### 10. Security Testing (TC-046 to TC-049)

#### TC-046: JWT Token Tampering - Discount Rule ID
- [ ] Test case executed
- [ ] Valid token generated
- [ ] Token tampered
- [ ] Booking attempted
- [ ] Token validation failed
- [ ] Error handling verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-047: Unauthorized Access to Discount Rules
- [ ] Test case executed
- [ ] User without permissions logged in
- [ ] Access to creation denied
- [ ] Access to modification denied
- [ ] Error message verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-048: SQL Injection in Rule Name
- [ ] Test case executed
- [ ] SQL injection attempted
- [ ] Input sanitized
- [ ] Database integrity verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

#### TC-049: XSS Attack in Rule Name
- [ ] Test case executed
- [ ] XSS script attempted
- [ ] Input sanitized
- [ ] Script not executed
- [ ] Display verified
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

### 11. Regression Testing (TC-050)

#### TC-050: Existing Markup Rules Still Function
- [ ] Test case executed
- [ ] All existing markup rules verified
- [ ] Markup application tested
- [ ] New booking with markup completed
- [ ] No interference from discount feature
- [ ] Result: ⬜ Pass ⬜ Fail ⬜ Blocked

**Section Status**: ⬜ Complete ⬜ In Progress ⬜ Not Started

---

## Post-Test Activities Checklist

### Defect Management
- [ ] All defects logged in tracking system
- [ ] Defect severity assigned
- [ ] Defect priority assigned
- [ ] Screenshots attached to defects
- [ ] Steps to reproduce documented
- [ ] Defects assigned to development team
- [ ] Defect status tracked

### Retesting
- [ ] Fixed defects identified
- [ ] Retest plan created
- [ ] All fixed defects retested
- [ ] Retest results documented
- [ ] Regression testing performed after fixes

### Test Reporting
- [ ] Test execution summary prepared
- [ ] Pass/fail statistics calculated
- [ ] Test coverage report generated
- [ ] Defect summary report created
- [ ] Performance metrics documented
- [ ] Risk assessment updated

### Documentation
- [ ] Test results archived
- [ ] Screenshots organized and saved
- [ ] Test data backed up
- [ ] Lessons learned documented
- [ ] Best practices identified

### Sign-off
- [ ] Test completion criteria met
- [ ] Test lead sign-off obtained
- [ ] Development lead sign-off obtained
- [ ] Product owner sign-off obtained
- [ ] QA manager sign-off obtained

---

## Test Summary Metrics

### Overall Progress
- **Total Test Cases**: 50
- **Executed**: ___ / 50
- **Passed**: ___ / 50
- **Failed**: ___ / 50
- **Blocked**: ___ / 50
- **Not Started**: ___ / 50

### Pass Rate
- **Overall Pass Rate**: ____%
- **Critical Test Cases Pass Rate**: ____%
- **High Priority Test Cases Pass Rate**: ____%

### Defects Summary
- **Total Defects Found**: ___
- **Critical Severity**: ___
- **High Severity**: ___
- **Medium Severity**: ___
- **Low Severity**: ___
- **Defects Fixed**: ___
- **Defects Open**: ___

### Test Coverage
- **Discount Rule Creation**: ____%
- **JWT Token Integration**: ____%
- **Channel Configuration**: ____%
- **Discount Types**: ____%
- **Strike-Through Display**: ____%
- **Integration Testing**: ____%
- **Negative Testing**: ____%
- **Performance Testing**: ____%
- **UI/UX Testing**: ____%
- **Security Testing**: ____%
- **Regression Testing**: ____%

---

## Exit Criteria Status

- [ ] 100% of critical test cases executed and passed
- [ ] 95% of high priority test cases executed and passed
- [ ] No critical or high severity defects open
- [ ] All regression tests passed
- [ ] Performance benchmarks met
- [ ] Security tests passed
- [ ] All stakeholder sign-offs obtained
- [ ] Test documentation complete

---

## Notes & Observations

### General Notes
- 
- 
- 

### Issues Encountered
- 
- 
- 

### Recommendations
- 
- 
- 

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | | | |
| Development Lead | | | |
| Product Owner | | | |
| QA Manager | | | |

---

**Document Version**: 1.0  
**Last Updated**: January 29, 2026  
**Prepared By**: Test Team
