# Tripbeast Discount Rules - Test Plan

## Document Information
- **Version**: 1.0
- **Date**: January 29, 2026
- **Feature**: Closed User Groups (CUG) Discount Rules Enhancement
- **Test Type**: Functional, Integration, UI Testing

---

## 1. Overview

This test plan covers the comprehensive testing of discount rules for closed user groups in the Tripbeast system. The discount rules are applied on subtotal (ITEM PRICE) excluding taxes & fees.

### 1.1 Scope
- Discount Rule Creation and Management
- JWT Token Integration for Ancillary and CUG Booking Engines
- Application & Channel Configuration
- Multiple Discount Types (Default, Date Range, Specific Date, Dynamic)
- Strike-Through Price Display Logic

### 1.2 Out of Scope
- B2C Public Booking Engine (system-generated ID not applicable)
- Upload User functionality for B2C Public Booking Engine
- Tax and fee calculations

---

## 2. Test Environment Requirements

### 2.1 Booking Engine Types
- Ancillary Booking Engine
- CUG Booking Engine
- B2C Public Booking Engine

### 2.2 Test Data Requirements
- Multiple channels with active products
- Various stakeholder configurations
- Sample discount percentages
- Date ranges for testing
- JWT tokens with embedded discount rule IDs

### 2.3 Prerequisites
- Access to discount rule creation interface
- Access to markup rules for comparison
- Test users with appropriate permissions
- Multiple product types (Hotels, Flights, etc.)
- Supplier data with strike-through pricing (e.g., Expedia hotels)

---

## 3. Test Strategy

### 3.1 Testing Levels
1. **Unit Testing**: Individual discount rule components
2. **Integration Testing**: JWT token integration, channel configuration
3. **System Testing**: End-to-end discount application
4. **UI Testing**: Strike-through display logic

### 3.2 Testing Types
- Functional Testing
- Negative Testing
- Boundary Testing
- Compatibility Testing
- Regression Testing

---

## 4. Test Cases

### 4.1 Discount Rule Creation

#### TC-001: Create Discount Rule with Manual Name
**Priority**: High  
**Preconditions**: User has access to discount rule creation interface

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to discount rule creation page | Page loads successfully |
| 2 | Enter rule name: "CUG_Winter_Discount" | Name is accepted |
| 3 | Save the rule | Rule is created with system-generated ID |
| 4 | Verify rule ID is generated | Unique ID is displayed (e.g., DR-12345) |

**Test Data**: Rule Name: "CUG_Winter_Discount"  
**Expected Result**: Rule created successfully with system-generated ID

---

#### TC-002: Verify System-Generated ID Format
**Priority**: High  
**Preconditions**: None

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create multiple discount rules | Each rule gets unique ID |
| 2 | Verify ID format | ID follows consistent pattern |
| 3 | Check ID uniqueness | No duplicate IDs exist |

**Test Data**: Create 5 rules with different names  
**Expected Result**: All IDs are unique and follow standard format

---

#### TC-003: Create Rule with Special Characters in Name
**Priority**: Medium  
**Preconditions**: User has access to discount rule creation interface

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter rule name with special chars: "CUG@2026#Discount!" | System validates input |
| 2 | Save the rule | Rule is created or appropriate error shown |

**Test Data**: Rule Name: "CUG@2026#Discount!"  
**Expected Result**: System handles special characters appropriately

---

#### TC-004: Create Rule with Empty Name
**Priority**: High  
**Preconditions**: User has access to discount rule creation interface

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave rule name field empty | Validation error appears |
| 2 | Attempt to save | Save is prevented |
| 3 | Verify error message | Clear error message displayed |

**Test Data**: Rule Name: ""  
**Expected Result**: Validation error: "Rule name is required"

---

#### TC-005: Create Rule with Duplicate Name
**Priority**: Medium  
**Preconditions**: Discount rule "Summer_Sale" already exists

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter existing rule name: "Summer_Sale" | Name is accepted |
| 2 | Save the rule | System allows or shows warning |
| 3 | Verify both rules exist | Both rules have unique IDs |

**Test Data**: Rule Name: "Summer_Sale" (duplicate)  
**Expected Result**: System behavior documented (allow with unique ID or prevent)

---

### 4.2 JWT Token Integration

#### TC-006: JWT Token Contains Discount Rule ID (Ancillary BE)
**Priority**: Critical  
**Preconditions**: Discount rule created with ID "DR-12345"

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Configure rule for Ancillary Booking Engine | Configuration saved |
| 2 | Generate JWT token for ancillary booking | Token generated successfully |
| 3 | Decode JWT token | Token contains discount rule ID "DR-12345" |
| 4 | Verify token structure | ID is in correct field/format |

**Test Data**: Discount Rule ID: "DR-12345"  
**Expected Result**: JWT token contains discount_rule_id: "DR-12345"

---

#### TC-007: JWT Token Contains Discount Rule ID (CUG BE)
**Priority**: Critical  
**Preconditions**: Discount rule created with ID "DR-67890"

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Configure rule for CUG Booking Engine | Configuration saved |
| 2 | Generate JWT token for CUG booking | Token generated successfully |
| 3 | Decode JWT token | Token contains discount rule ID "DR-67890" |
| 4 | Make booking with token | Discount applied correctly |

**Test Data**: Discount Rule ID: "DR-67890"  
**Expected Result**: JWT token contains discount_rule_id: "DR-67890"

---

#### TC-008: JWT Token Not Used for B2C Public BE
**Priority**: High  
**Preconditions**: Discount rule configured for B2C Public BE

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Access B2C Public Booking Engine | Page loads |
| 2 | Check JWT token (if any) | No discount rule ID in token |
| 3 | Verify discount application method | Uses alternative method (not JWT) |

**Test Data**: B2C Public Booking Engine session  
**Expected Result**: Discount rule ID not passed via JWT token

---

#### TC-009: Invalid JWT Token with Missing Discount Rule ID
**Priority**: High  
**Preconditions**: JWT token without discount rule ID

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Use JWT token without discount_rule_id | Token is validated |
| 2 | Attempt booking | System handles gracefully |
| 3 | Verify discount application | No discount applied or default used |

**Test Data**: JWT token without discount_rule_id field  
**Expected Result**: System handles missing ID gracefully

---

#### TC-010: JWT Token with Invalid Discount Rule ID
**Priority**: High  
**Preconditions**: JWT token with non-existent discount rule ID

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Use JWT token with ID "DR-99999" (non-existent) | Token is validated |
| 2 | Attempt booking | System validates discount rule ID |
| 3 | Verify error handling | Appropriate error message shown |

**Test Data**: JWT token with discount_rule_id: "DR-99999"  
**Expected Result**: Error: "Invalid discount rule ID"

---

### 4.3 Application & Channel Configuration

#### TC-011: Mark Discount Rule as Default for Channel
**Priority**: High  
**Preconditions**: Channel "Channel_A" exists with products

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to discount rule configuration | Page loads |
| 2 | Select discount rule "DR-12345" | Rule selected |
| 3 | Mark as default for "Channel_A" | Setting saved |
| 4 | Verify default status | Rule shows as default for channel |

**Test Data**: Channel: "Channel_A", Rule: "DR-12345"  
**Expected Result**: Rule marked as default for Channel_A

---

#### TC-012: Configure Stakeholder-Wise Discount
**Priority**: High  
**Preconditions**: Channel with multiple stakeholders

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select channel "Channel_B" | Channel selected |
| 2 | Configure discount for "Stakeholder_1": 10% | Configuration saved |
| 3 | Configure discount for "Stakeholder_2": 15% | Configuration saved |
| 4 | Verify configurations | Both stakeholders have different discounts |

**Test Data**: Stakeholder_1: 10%, Stakeholder_2: 15%  
**Expected Result**: Different discount percentages per stakeholder

---

#### TC-013: Apply Discount Rule to Active Products
**Priority**: Critical  
**Preconditions**: Channel with 5 active products

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select discount rule "DR-12345" | Rule selected |
| 2 | Apply to all active products in channel | Application successful |
| 3 | Verify each product has discount | All 5 products show discount |
| 4 | Check inactive products | Inactive products not affected |

**Test Data**: 5 active products in channel  
**Expected Result**: Discount applied to all active products only

---

#### TC-014: Apply Discount to Specific Products Only
**Priority**: Medium  
**Preconditions**: Channel with 10 active products

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select discount rule "DR-12345" | Rule selected |
| 2 | Apply to products 1, 3, 5 only | Selection saved |
| 3 | Verify selected products | Products 1, 3, 5 have discount |
| 4 | Verify non-selected products | Products 2, 4, 6-10 have no discount |

**Test Data**: Products 1, 3, 5 selected  
**Expected Result**: Discount applied only to selected products

---

#### TC-015: Multiple Discount Rules for Same Channel
**Priority**: High  
**Preconditions**: Channel "Channel_C" exists

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create discount rule "DR-AAA" for Channel_C | Rule created |
| 2 | Create discount rule "DR-BBB" for Channel_C | Rule created |
| 3 | Verify both rules exist | Both rules active |
| 4 | Test rule priority/conflict resolution | System handles appropriately |

**Test Data**: Two rules for same channel  
**Expected Result**: System handles multiple rules per channel

---

#### TC-016: Remove Default Status from Channel
**Priority**: Medium  
**Preconditions**: Rule "DR-12345" is default for "Channel_A"

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to rule configuration | Page loads |
| 2 | Unmark "DR-12345" as default | Setting updated |
| 3 | Verify default status removed | No default rule for Channel_A |
| 4 | Test booking on Channel_A | No default discount applied |

**Test Data**: Channel_A with default rule  
**Expected Result**: Default status removed successfully

---

### 4.4 Discount Types

#### TC-017: Apply Default Discount
**Priority**: Critical  
**Preconditions**: Product with price $1000

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Configure default discount: 10% | Configuration saved |
| 2 | View product in booking engine | Product displayed |
| 3 | Verify discounted price | Price shows $900 |
| 4 | Verify subtotal calculation | Subtotal = $900 (before taxes/fees) |

**Test Data**: Original Price: $1000, Discount: 10%  
**Expected Result**: Discounted Price: $900

---

#### TC-018: Apply Date Range-Based Discount
**Priority**: Critical  
**Preconditions**: Current date within discount range

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Configure discount: 15% for Jan 1-31, 2026 | Configuration saved |
| 2 | Access booking on Jan 15, 2026 | Discount applied |
| 3 | Verify discounted price (from $1000) | Price shows $850 |
| 4 | Access booking on Feb 1, 2026 | Discount not applied |

**Test Data**: Date Range: Jan 1-31, 2026; Discount: 15%  
**Expected Result**: Discount applied only within date range

---

#### TC-019: Apply Specific Date-Based Discount
**Priority**: High  
**Preconditions**: Specific dates configured

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Configure discount: 20% on Jan 15, 2026 | Configuration saved |
| 2 | Access booking on Jan 15, 2026 | Discount applied |
| 3 | Verify discounted price (from $1000) | Price shows $800 |
| 4 | Access booking on Jan 14, 2026 | Discount not applied |
| 5 | Access booking on Jan 16, 2026 | Discount not applied |

**Test Data**: Specific Date: Jan 15, 2026; Discount: 20%  
**Expected Result**: Discount applied only on specific date

---

#### TC-020: Apply Dynamic Discount Rules
**Priority**: Critical  
**Preconditions**: Dynamic rules configured (similar to markup rules)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Configure dynamic rule: 10% if booking value > $500 | Rule saved |
| 2 | Book product worth $600 | 10% discount applied |
| 3 | Book product worth $400 | No discount applied |
| 4 | Verify dynamic condition evaluation | Conditions work correctly |

**Test Data**: Condition: booking value > $500; Discount: 10%  
**Expected Result**: Discount applied only when condition met

---

#### TC-021: Multiple Discount Types Priority
**Priority**: High  
**Preconditions**: Multiple discount types configured for same product

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Configure default: 10%, date range: 15%, specific date: 20% | All configured |
| 2 | Access on specific date within range | System applies appropriate discount |
| 3 | Verify which discount is applied | Priority logic followed |
| 4 | Document priority order | Priority order confirmed |

**Test Data**: Default: 10%, Date Range: 15%, Specific: 20%  
**Expected Result**: System follows defined priority order

---

#### TC-022: Discount Percentage Validation
**Priority**: High  
**Preconditions**: Discount rule creation interface

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter discount: 0% | Validation check |
| 2 | Enter discount: 100% | Validation check |
| 3 | Enter discount: 101% | Error shown |
| 4 | Enter discount: -5% | Error shown |
| 5 | Enter discount: 25.5% | Accepted or rejected per business rules |

**Test Data**: Various percentage values  
**Expected Result**: Only valid percentages (0-100%) accepted

---

#### TC-023: Discount Applied on Subtotal Only
**Priority**: Critical  
**Preconditions**: Product with price breakdown

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Product: Base Price $1000, Markup $100, Tax $50, Fees $25 | Total: $1175 |
| 2 | Apply 10% discount | Discount calculated on subtotal |
| 3 | Verify calculation | Discount = 10% of $1100 (Price + Markup) = $110 |
| 4 | Verify final price | Subtotal: $990, Tax: $50, Fees: $25, Total: $1065 |

**Test Data**: Base: $1000, Markup: $100, Discount: 10%  
**Expected Result**: Discount applied on subtotal (Price + Markup), excluding taxes & fees

---

#### TC-024: Dynamic Discount with Multiple Conditions
**Priority**: High  
**Preconditions**: Complex dynamic rule configured

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Configure: 15% if value > $1000 AND booking date < 30 days | Rule saved |
| 2 | Book $1200 product, 20 days advance | 15% discount applied |
| 3 | Book $1200 product, 40 days advance | No discount |
| 4 | Book $800 product, 20 days advance | No discount |

**Test Data**: Multiple conditions with AND logic  
**Expected Result**: Discount applied only when all conditions met

---

### 4.5 Strike-Through Price Display

#### TC-025: Case 1 - Both Strike-Throughs ON
**Priority**: Critical  
**Preconditions**: Hotel with Expedia strike-through + Discount rule

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hotel strike-through: ON (Original: $1200, Supplier: $1000) | Configured |
| 2 | Discount rule: ON (10% discount) | Configured |
| 3 | Discount strike-through: ON | Configured |
| 4 | View product in booking engine | Combined strike-through visible |
| 5 | Verify display | Shows: ~~$1200~~ ~~$1000~~ $900 |

**Test Data**: Supplier Original: $1200, Supplier Price: $1000, Discount: 10%  
**Expected Result**: Combined strike-through: ~~$1200~~ ~~$1000~~ $900

---

#### TC-026: Case 2 - Hotel OFF, Discount ON with Strike-Through
**Priority**: Critical  
**Preconditions**: Hotel without strike-through + Discount rule

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hotel strike-through: OFF (Price: $1000) | Configured |
| 2 | Discount rule: ON (10% discount) | Configured |
| 3 | Discount strike-through: ON | Configured |
| 4 | View product in booking engine | Only discount strike-through visible |
| 5 | Verify display | Shows: ~~$1000~~ $900 |

**Test Data**: Hotel Price: $1000, Discount: 10%  
**Expected Result**: Discount strike-through only: ~~$1000~~ $900

---

#### TC-027: Case 3 - Hotel ON, Discount ON, Discount Strike-Through OFF
**Priority**: Critical  
**Preconditions**: Hotel with strike-through + Discount rule

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hotel strike-through: ON (Original: $1200, Supplier: $1000) | Configured |
| 2 | Discount rule: ON (10% discount) | Configured |
| 3 | Discount strike-through: OFF | Configured |
| 4 | View product in booking engine | No strike-through visible |
| 5 | Verify display | Shows: $900 (final discounted price only) |

**Test Data**: Supplier Original: $1200, Supplier Price: $1000, Discount: 10%  
**Expected Result**: Final price only: $900 (no strike-through)

---

#### TC-028: Case 4 - Both Strike-Throughs OFF
**Priority**: High  
**Preconditions**: Hotel without strike-through + Discount rule

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hotel strike-through: OFF (Price: $1000) | Configured |
| 2 | Discount rule: ON (10% discount) | Configured |
| 3 | Discount strike-through: OFF | Configured |
| 4 | View product in booking engine | No strike-through visible |
| 5 | Verify display | Shows: $900 (discounted value only) |

**Test Data**: Hotel Price: $1000, Discount: 10%  
**Expected Result**: Discounted value only: $900 (no strike-through)

---

#### TC-029: Toggle Strike-Through Display Setting
**Priority**: Medium  
**Preconditions**: Discount rule with strike-through ON

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | View product with strike-through: ~~$1000~~ $900 | Strike-through visible |
| 2 | Toggle strike-through setting to OFF | Setting updated |
| 3 | Refresh booking engine | Strike-through removed |
| 4 | Verify display | Shows: $900 only |
| 5 | Toggle back to ON | Strike-through reappears |

**Test Data**: Discount: 10%, Original: $1000  
**Expected Result**: Toggle controls strike-through display

---

#### TC-030: Strike-Through with Multiple Discounts
**Priority**: Medium  
**Preconditions**: Multiple discount rules applicable

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Apply default discount: 10% ($1000 → $900) | Applied |
| 2 | Apply date range discount: additional 5% | Applied |
| 3 | Verify strike-through display | Shows appropriate strike-through |
| 4 | Verify final price calculation | Correctly calculated |

**Test Data**: Multiple discounts stacked  
**Expected Result**: Strike-through shows correct original and final prices

---

### 4.6 Integration Testing

#### TC-031: Upload User Functionality (Ancillary BE)
**Priority**: High  
**Preconditions**: Ancillary Booking Engine configured

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Upload user list with discount rule IDs | Upload successful |
| 2 | Verify discount rule assignment | Users assigned to rules |
| 3 | Test booking with uploaded user | Correct discount applied |
| 4 | Verify JWT token contains correct rule ID | Token validated |

**Test Data**: User list CSV with discount rule IDs  
**Expected Result**: Discount rules applied via upload user functionality

---

#### TC-032: Upload User Functionality (CUG BE)
**Priority**: High  
**Preconditions**: CUG Booking Engine configured

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Upload user list for CUG with discount rules | Upload successful |
| 2 | Verify user-discount mapping | Mapping correct |
| 3 | Test booking with CUG user | Correct discount applied |
| 4 | Verify JWT token | Token contains correct rule ID |

**Test Data**: CUG user list with discount rule IDs  
**Expected Result**: CUG users get appropriate discounts

---

#### TC-033: Discount Rule Similar to Markup Rule Behavior
**Priority**: High  
**Preconditions**: Existing markup rules configured

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Compare discount rule interface with markup rule | Similar UI/UX |
| 2 | Test configuration options | Similar options available |
| 3 | Test application logic | Follows similar patterns |
| 4 | Verify consistency | Discount rules work like markup rules |

**Test Data**: Existing markup rule configurations  
**Expected Result**: Discount rules behave consistently with markup rules

---

#### TC-034: Discount + Markup Combined Application
**Priority**: Critical  
**Preconditions**: Product with both markup and discount rules

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Product base price: $1000 | Base price set |
| 2 | Apply markup rule: +10% ($100) | Subtotal: $1100 |
| 3 | Apply discount rule: -15% | Discount on $1100 = $165 |
| 4 | Verify final subtotal | Subtotal: $935 |
| 5 | Add taxes and fees | Final total calculated correctly |

**Test Data**: Base: $1000, Markup: +10%, Discount: -15%  
**Expected Result**: Subtotal: $935 (before taxes/fees)

---

#### TC-035: Discount Rule Deactivation
**Priority**: Medium  
**Preconditions**: Active discount rule "DR-12345"

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Deactivate discount rule "DR-12345" | Rule deactivated |
| 2 | Verify rule status | Shows as inactive |
| 3 | Test booking with deactivated rule | No discount applied |
| 4 | Reactivate rule | Rule active again |
| 5 | Test booking | Discount applied |

**Test Data**: Discount rule "DR-12345"  
**Expected Result**: Deactivated rules don't apply discounts

---

### 4.7 Negative Testing

#### TC-036: Invalid Discount Percentage (Text Input)
**Priority**: Medium  
**Preconditions**: Discount rule creation interface

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter discount: "ABC" | Validation error |
| 2 | Attempt to save | Save prevented |
| 3 | Verify error message | "Please enter a valid percentage" |

**Test Data**: Discount: "ABC"  
**Expected Result**: Validation error displayed

---

#### TC-037: Expired Date Range Discount
**Priority**: High  
**Preconditions**: Date range discount configured for past dates

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Configure discount: 10% for Dec 1-31, 2025 | Configuration saved |
| 2 | Access booking on Jan 29, 2026 | Discount not applied |
| 3 | Verify no discount | Full price shown |

**Test Data**: Date Range: Dec 1-31, 2025 (expired)  
**Expected Result**: Expired discounts not applied

---

#### TC-038: Discount Rule Without Channel Assignment
**Priority**: Medium  
**Preconditions**: Discount rule created but not assigned to channel

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create discount rule "DR-ORPHAN" | Rule created |
| 2 | Do not assign to any channel | No assignment |
| 3 | Attempt to use in booking | Rule not available |
| 4 | Verify behavior | Appropriate handling |

**Test Data**: Unassigned discount rule  
**Expected Result**: Rule must be assigned to channel to be used

---

#### TC-039: Concurrent Discount Rule Modifications
**Priority**: Low  
**Preconditions**: Two users accessing same discount rule

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | User A opens discount rule "DR-12345" | Rule loaded |
| 2 | User B opens same rule | Rule loaded |
| 3 | User A modifies discount to 15% and saves | Saved successfully |
| 4 | User B modifies discount to 20% and saves | Conflict handling |
| 5 | Verify final state | Appropriate conflict resolution |

**Test Data**: Concurrent modifications  
**Expected Result**: System handles concurrent edits appropriately

---

#### TC-040: Discount Rule Deletion with Active Bookings
**Priority**: High  
**Preconditions**: Discount rule with active bookings

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Identify rule "DR-12345" with active bookings | Rule identified |
| 2 | Attempt to delete rule | Warning or prevention |
| 3 | Verify system behavior | Existing bookings protected |
| 4 | Verify new bookings | Rule not available for new bookings |

**Test Data**: Active discount rule with bookings  
**Expected Result**: System protects active bookings

---

### 4.8 Performance Testing

#### TC-041: Discount Calculation Performance
**Priority**: Medium  
**Preconditions**: 100 products with discount rules

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load booking engine with 100 products | Page loads |
| 2 | Measure discount calculation time | Time recorded |
| 3 | Verify all discounts calculated | All 100 products show discounts |
| 4 | Check page load time | Within acceptable limits (<3 seconds) |

**Test Data**: 100 products with various discount rules  
**Expected Result**: Discount calculations don't significantly impact performance

---

#### TC-042: JWT Token Size with Discount Rule ID
**Priority**: Low  
**Preconditions**: JWT token generation

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Generate JWT token with discount rule ID | Token generated |
| 2 | Measure token size | Size recorded |
| 3 | Compare with token without discount ID | Size difference minimal |
| 4 | Verify token validity | Token works correctly |

**Test Data**: JWT tokens with and without discount rule ID  
**Expected Result**: Token size remains within acceptable limits

---

### 4.9 UI/UX Testing

#### TC-043: Strike-Through Price Readability
**Priority**: Medium  
**Preconditions**: Product with strike-through pricing

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | View product with strike-through: ~~$1000~~ $900 | Display rendered |
| 2 | Verify text styling | Strike-through clearly visible |
| 3 | Verify color contrast | Original and discounted prices distinguishable |
| 4 | Test on mobile device | Readable on small screens |

**Test Data**: Various price points  
**Expected Result**: Strike-through pricing is clear and readable

---

#### TC-044: Discount Information Display
**Priority**: Medium  
**Preconditions**: Product with discount applied

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | View product with 15% discount | Product displayed |
| 2 | Verify discount percentage shown | "15% OFF" or similar displayed |
| 3 | Verify savings amount | "Save $150" shown |
| 4 | Check tooltip/info icon | Additional discount details available |

**Test Data**: 15% discount on $1000 product  
**Expected Result**: Discount information clearly communicated to user

---

#### TC-045: Responsive Design - Strike-Through Display
**Priority**: Medium  
**Preconditions**: Booking engine with discount rules

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | View on desktop (1920x1080) | Strike-through displays correctly |
| 2 | View on tablet (768x1024) | Strike-through displays correctly |
| 3 | View on mobile (375x667) | Strike-through displays correctly |
| 4 | Verify text wrapping | No layout issues |

**Test Data**: Multiple device sizes  
**Expected Result**: Strike-through pricing responsive across devices

---

### 4.10 Security Testing

#### TC-046: JWT Token Tampering - Discount Rule ID
**Priority**: Critical  
**Preconditions**: Valid JWT token with discount rule ID

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Generate valid JWT token with "DR-12345" | Token generated |
| 2 | Manually modify token to "DR-99999" | Token tampered |
| 3 | Attempt booking with tampered token | Token validation fails |
| 4 | Verify error handling | Appropriate error message |

**Test Data**: Tampered JWT token  
**Expected Result**: Tampered tokens rejected

---

#### TC-047: Unauthorized Access to Discount Rules
**Priority**: High  
**Preconditions**: User without discount rule management permissions

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as user without permissions | Login successful |
| 2 | Attempt to access discount rule creation | Access denied |
| 3 | Attempt to modify existing rule | Access denied |
| 4 | Verify error message | "Unauthorized access" message shown |

**Test Data**: User without permissions  
**Expected Result**: Unauthorized users cannot manage discount rules

---

#### TC-048: SQL Injection in Rule Name
**Priority**: High  
**Preconditions**: Discount rule creation interface

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter rule name: "'; DROP TABLE rules; --" | Input sanitized |
| 2 | Attempt to save | Input rejected or sanitized |
| 3 | Verify database integrity | No SQL injection occurred |

**Test Data**: SQL injection attempt in rule name  
**Expected Result**: Input properly sanitized

---

#### TC-049: XSS Attack in Rule Name
**Priority**: High  
**Preconditions**: Discount rule creation interface

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter rule name: "<script>alert('XSS')</script>" | Input sanitized |
| 2 | Save and view rule | Script not executed |
| 3 | Verify display | Rule name displayed as text, not executed |

**Test Data**: XSS attempt in rule name  
**Expected Result**: Script tags properly escaped

---

### 4.11 Regression Testing

#### TC-050: Existing Markup Rules Still Function
**Priority**: Critical  
**Preconditions**: Existing markup rules configured

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify existing markup rules | All rules present |
| 2 | Test markup rule application | Markups applied correctly |
| 3 | Create new booking with markup | Markup calculated correctly |
| 4 | Verify no interference from discount feature | Markups work independently |

**Test Data**: Existing markup rule configurations  
**Expected Result**: Markup rules unaffected by discount feature

---

---

## 5. Test Data Templates

### 5.1 Discount Rule Template

```json
{
  "rule_name": "CUG_Winter_2026",
  "rule_id": "DR-12345",
  "discount_type": "date_range",
  "discount_percentage": 15,
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "channels": ["Channel_A", "Channel_B"],
  "stakeholders": [
    {
      "stakeholder_id": "STK-001",
      "discount_percentage": 10
    },
    {
      "stakeholder_id": "STK-002",
      "discount_percentage": 15
    }
  ],
  "products": ["PROD-001", "PROD-002", "PROD-003"],
  "is_default": true,
  "strike_through_enabled": true,
  "status": "active"
}
```

### 5.2 JWT Token Template

```json
{
  "user_id": "USR-12345",
  "booking_engine_type": "CUG",
  "discount_rule_id": "DR-12345",
  "channel_id": "Channel_A",
  "stakeholder_id": "STK-001",
  "exp": 1738195200,
  "iat": 1738108800
}
```

### 5.3 Product Pricing Template

```json
{
  "product_id": "PROD-001",
  "base_price": 1000.00,
  "markup_percentage": 10,
  "markup_amount": 100.00,
  "subtotal": 1100.00,
  "discount_rule_id": "DR-12345",
  "discount_percentage": 15,
  "discount_amount": 165.00,
  "discounted_subtotal": 935.00,
  "taxes": 50.00,
  "fees": 25.00,
  "total": 1010.00,
  "original_price_strikethrough": 1100.00,
  "supplier_strikethrough": 1200.00
}
```

### 5.4 Channel Configuration Template

```json
{
  "channel_id": "Channel_A",
  "channel_name": "Corporate Travel",
  "booking_engine_type": "CUG",
  "default_discount_rule": "DR-12345",
  "active_products": [
    "PROD-001",
    "PROD-002",
    "PROD-003"
  ],
  "stakeholders": [
    {
      "stakeholder_id": "STK-001",
      "stakeholder_name": "Company A",
      "discount_rule": "DR-12345"
    }
  ]
}
```

---

## 6. Test Execution Checklist

### 6.1 Pre-Testing
- [ ] Test environment setup complete
- [ ] Test data prepared
- [ ] Access credentials verified
- [ ] Test users created
- [ ] Channels and products configured
- [ ] Baseline markup rules documented

### 6.2 During Testing
- [ ] Execute test cases in order
- [ ] Document actual results
- [ ] Capture screenshots for UI tests
- [ ] Log defects with severity
- [ ] Retest fixed defects
- [ ] Update test case status

### 6.3 Post-Testing
- [ ] All test cases executed
- [ ] Test summary report generated
- [ ] Defects tracked to closure
- [ ] Regression testing completed
- [ ] Sign-off obtained
- [ ] Test artifacts archived

---

## 7. Defect Reporting Template

### Defect ID: DEF-XXX
**Summary**: Brief description of the issue

**Severity**: Critical / High / Medium / Low

**Priority**: P1 / P2 / P3 / P4

**Test Case**: TC-XXX

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**: What should happen

**Actual Result**: What actually happened

**Environment**: Ancillary BE / CUG BE / B2C Public BE

**Screenshots**: Attached

**Logs**: Attached

**Status**: Open / In Progress / Fixed / Closed

---

## 8. Test Metrics

### 8.1 Key Metrics to Track
- Total test cases: 50
- Test cases executed: X
- Test cases passed: X
- Test cases failed: X
- Test cases blocked: X
- Defects found: X
- Defects fixed: X
- Test coverage: X%
- Pass rate: X%

### 8.2 Exit Criteria
- 100% of critical test cases passed
- 95% of high priority test cases passed
- No critical or high severity defects open
- All regression tests passed
- Performance benchmarks met
- Security tests passed
- Sign-off from stakeholders

---

## 9. Risks and Mitigation

### 9.1 Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| JWT token integration issues | High | Medium | Early integration testing, mock tokens |
| Strike-through display inconsistencies | Medium | High | Cross-browser testing, UI review |
| Performance degradation with multiple rules | High | Low | Load testing, optimization |
| Data migration issues | High | Low | Backup and rollback plan |
| Discount calculation errors | Critical | Low | Extensive calculation testing |

### 9.2 Dependencies
- Markup rule functionality must be stable
- JWT token infrastructure must be operational
- Booking engine environments must be available
- Test data must be prepared in advance

---

## 10. Test Schedule

| Phase | Duration | Start Date | End Date |
|-------|----------|------------|----------|
| Test Planning | 2 days | TBD | TBD |
| Test Environment Setup | 1 day | TBD | TBD |
| Test Data Preparation | 1 day | TBD | TBD |
| Test Execution - Phase 1 (TC-001 to TC-025) | 3 days | TBD | TBD |
| Test Execution - Phase 2 (TC-026 to TC-050) | 3 days | TBD | TBD |
| Defect Fixing & Retesting | 2 days | TBD | TBD |
| Regression Testing | 1 day | TBD | TBD |
| Test Closure | 1 day | TBD | TBD |
| **Total** | **14 days** | | |

---

## 11. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | | | |
| Development Lead | | | |
| Product Owner | | | |
| QA Manager | | | |

---

## 12. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-29 | Test Team | Initial test plan created |

---

## Appendix A: Glossary

- **CUG**: Closed User Group
- **BE**: Booking Engine
- **JWT**: JSON Web Token
- **DR**: Discount Rule (prefix for rule IDs)
- **Subtotal**: Price + Markups (excluding taxes and fees)
- **ITEM PRICE**: Subtotal displayed to users in booking engine
- **Strike-through**: Visual display showing original price crossed out

---

## Appendix B: Test Environment URLs

- Ancillary Booking Engine: [URL]
- CUG Booking Engine: [URL]
- B2C Public Booking Engine: [URL]
- Admin Panel: [URL]
- API Endpoints: [URL]

---

## Appendix C: Contact Information

- Test Lead: [Name, Email]
- Development Lead: [Name, Email]
- Product Owner: [Name, Email]
- QA Manager: [Name, Email]

---

**End of Test Plan**
