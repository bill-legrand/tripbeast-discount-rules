# Defect Report Template

## Defect Information

**Defect ID**: DEF-[NUMBER]  
**Date Reported**: [DD/MM/YYYY]  
**Reported By**: [Tester Name]  
**Test Case ID**: TC-[NUMBER]

---

## Defect Details

### Summary
[Brief one-line description of the defect]

### Description
[Detailed description of what went wrong]

---

## Classification

**Severity**: 
- [ ] Critical - System crash, data loss, security breach
- [ ] High - Major functionality broken, no workaround
- [ ] Medium - Functionality impaired, workaround exists
- [ ] Low - Minor issue, cosmetic problem

**Priority**: 
- [ ] P1 - Fix immediately
- [ ] P2 - Fix in current sprint
- [ ] P3 - Fix in next sprint
- [ ] P4 - Fix when time permits

**Category**:
- [ ] Discount Rule Creation
- [ ] JWT Token Integration
- [ ] Channel Configuration
- [ ] Discount Types
- [ ] Strike-Through Display
- [ ] Integration
- [ ] Performance
- [ ] UI/UX
- [ ] Security
- [ ] Regression

**Type**:
- [ ] Functional
- [ ] UI/UX
- [ ] Performance
- [ ] Security
- [ ] Data
- [ ] Configuration

---

## Environment

**Booking Engine Type**:
- [ ] Ancillary Booking Engine
- [ ] CUG Booking Engine
- [ ] B2C Public Booking Engine
- [ ] Admin Panel

**Browser**: [Browser name and version]  
**Operating System**: [OS name and version]  
**Device**: [Desktop/Tablet/Mobile - Model if applicable]  
**Test Environment URL**: [URL]

---

## Reproduction Steps

### Preconditions
[Any setup required before reproducing the defect]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Continue as needed]

---

## Results

### Expected Result
[What should have happened]

### Actual Result
[What actually happened]

### Impact
[How this affects users/system]

---

## Test Data Used

**Discount Rule ID**: [e.g., DR-12345]  
**Channel**: [e.g., Channel_A]  
**Product ID**: [e.g., PROD-001]  
**Discount Percentage**: [e.g., 10%]  
**Base Price**: [e.g., $1000]  
**Other Relevant Data**: [Any other test data used]

---

## Attachments

### Screenshots
- [ ] Screenshot 1: [Description]
- [ ] Screenshot 2: [Description]
- [ ] Screenshot 3: [Description]

### Logs
- [ ] Application logs attached
- [ ] Browser console logs attached
- [ ] Network logs attached
- [ ] Database logs attached (if applicable)

### Videos
- [ ] Screen recording attached (if applicable)

### Other Files
- [ ] JWT token sample
- [ ] API request/response
- [ ] Configuration files

---

## Additional Information

### Frequency
- [ ] Always reproducible
- [ ] Intermittent (occurs sometimes)
- [ ] Rare (occurred once)

**Reproducibility Rate**: [e.g., 5 out of 5 attempts]

### Workaround Available
- [ ] Yes
- [ ] No

**Workaround Description**: [If yes, describe the workaround]

### Related Defects
[List any related defect IDs]

### Notes
[Any additional observations or comments]

---

## Developer Section (To be filled by Development Team)

**Assigned To**: [Developer Name]  
**Assigned Date**: [DD/MM/YYYY]  
**Target Fix Date**: [DD/MM/YYYY]

### Root Cause
[Description of what caused the defect]

### Fix Description
[Description of how the defect was fixed]

### Code Changes
- [ ] File 1: [Filename and brief description]
- [ ] File 2: [Filename and brief description]

### Fix Verification
- [ ] Unit tests added/updated
- [ ] Code review completed
- [ ] Fix deployed to test environment

**Fixed Date**: [DD/MM/YYYY]  
**Fixed Version**: [Version number]

---

## Retest Section (To be filled by Tester)

**Retested By**: [Tester Name]  
**Retest Date**: [DD/MM/YYYY]  
**Retest Result**: 
- [ ] Pass - Defect fixed
- [ ] Fail - Defect still exists
- [ ] Partial - Partially fixed

**Retest Comments**: [Any comments about the retest]

**Regression Impact**: 
- [ ] No regression found
- [ ] Regression found (see defect DEF-[NUMBER])

---

## Status History

| Date | Status | Updated By | Comments |
|------|--------|------------|----------|
| [DD/MM/YYYY] | New | [Name] | Defect reported |
| [DD/MM/YYYY] | Assigned | [Name] | Assigned to developer |
| [DD/MM/YYYY] | In Progress | [Name] | Fix in progress |
| [DD/MM/YYYY] | Fixed | [Name] | Fix completed |
| [DD/MM/YYYY] | Retest | [Name] | Ready for retest |
| [DD/MM/YYYY] | Closed | [Name] | Verified and closed |

---

## Current Status

**Status**: 
- [ ] New
- [ ] Assigned
- [ ] In Progress
- [ ] Fixed
- [ ] Retest
- [ ] Reopened
- [ ] Closed
- [ ] Deferred
- [ ] Rejected

**Resolution**: 
- [ ] Fixed
- [ ] Won't Fix
- [ ] Duplicate
- [ ] Cannot Reproduce
- [ ] Works as Designed
- [ ] Deferred to Future Release

---

## Sign-off

**Tester Sign-off**: _________________ Date: _______  
**Developer Sign-off**: _________________ Date: _______  
**Test Lead Sign-off**: _________________ Date: _______

---

## Example Defect Report

---

# Defect Report - Example

## Defect Information

**Defect ID**: DEF-001  
**Date Reported**: 29/01/2026  
**Reported By**: John Doe  
**Test Case ID**: TC-025

---

## Defect Details

### Summary
Strike-through price not displaying correctly when both hotel and discount strike-throughs are enabled

### Description
When testing Case 1 of strike-through display (both hotel strike-through and discount strike-through enabled), the combined strike-through is not displaying correctly. Only the discount strike-through is visible, but the hotel's original price strike-through is missing.

---

## Classification

**Severity**: 
- [ ] Critical
- [x] High
- [ ] Medium
- [ ] Low

**Priority**: 
- [ ] P1
- [x] P2
- [ ] P3
- [ ] P4

**Category**:
- [x] Strike-Through Display

**Type**:
- [ ] Functional
- [x] UI/UX

---

## Environment

**Booking Engine Type**:
- [ ] Ancillary Booking Engine
- [x] CUG Booking Engine
- [ ] B2C Public Booking Engine

**Browser**: Chrome 120.0.6099.109  
**Operating System**: Windows 11  
**Device**: Desktop  
**Test Environment URL**: https://test-cug.tripbeast.com

---

## Reproduction Steps

### Preconditions
- Hotel product from Expedia with strike-through pricing configured (Original: $1200, Supplier Price: $1000)
- Discount rule DR-12345 configured with 10% discount
- Hotel strike-through toggle: ON
- Discount strike-through toggle: ON

### Steps to Reproduce
1. Login to CUG Booking Engine
2. Search for hotels
3. Select the Expedia hotel product (Product ID: HOTEL-EXP-001)
4. View the product details page
5. Observe the price display

---

## Results

### Expected Result
Combined strike-through should be visible showing: ~~$1200~~ ~~$1000~~ $900

### Actual Result
Only showing: ~~$1000~~ $900 (missing the original $1200 strike-through)

### Impact
Users cannot see the full discount value from the original supplier price, which reduces the perceived value of the discount and may impact conversion rates.

---

## Test Data Used

**Discount Rule ID**: DR-12345  
**Channel**: Channel_A  
**Product ID**: HOTEL-EXP-001  
**Discount Percentage**: 10%  
**Supplier Original Price**: $1200  
**Supplier Price**: $1000  
**Final Discounted Price**: $900

---

## Attachments

### Screenshots
- [x] Screenshot 1: Current display showing only ~~$1000~~ $900
- [x] Screenshot 2: Expected display mockup showing ~~$1200~~ ~~$1000~~ $900
- [x] Screenshot 3: Configuration settings showing both toggles ON

### Logs
- [x] Browser console logs attached
- [x] Network logs showing API response with price data

---

## Additional Information

### Frequency
- [x] Always reproducible

**Reproducibility Rate**: 5 out of 5 attempts

### Workaround Available
- [ ] Yes
- [x] No

### Related Defects
None

### Notes
The issue appears to be in the frontend rendering logic. The API response contains all three price points ($1200, $1000, $900) correctly, but the UI is only rendering two of them.

---

## Developer Section

**Assigned To**: Jane Smith  
**Assigned Date**: 29/01/2026  
**Target Fix Date**: 31/01/2026

### Root Cause
The frontend component was only checking for discount strike-through and not combining it with supplier strike-through when both are enabled.

### Fix Description
Updated the PriceDisplay component to handle multiple strike-through scenarios and render all applicable price points when both hotel and discount strike-throughs are enabled.

### Code Changes
- [x] File 1: components/PriceDisplay.tsx - Updated rendering logic
- [x] File 2: utils/priceFormatter.ts - Added helper function for multiple strike-throughs

### Fix Verification
- [x] Unit tests added/updated
- [x] Code review completed
- [x] Fix deployed to test environment

**Fixed Date**: 30/01/2026  
**Fixed Version**: 2.1.5

---

## Retest Section

**Retested By**: John Doe  
**Retest Date**: 31/01/2026  
**Retest Result**: 
- [x] Pass - Defect fixed

**Retest Comments**: Strike-through now displays correctly as ~~$1200~~ ~~$1000~~ $900. Tested across all four strike-through cases and all are working as expected.

**Regression Impact**: 
- [x] No regression found

---

## Status History

| Date | Status | Updated By | Comments |
|------|--------|------------|----------|
| 29/01/2026 | New | John Doe | Defect reported |
| 29/01/2026 | Assigned | Test Lead | Assigned to Jane Smith |
| 29/01/2026 | In Progress | Jane Smith | Investigating root cause |
| 30/01/2026 | Fixed | Jane Smith | Fix completed and deployed |
| 31/01/2026 | Retest | Test Lead | Ready for retest |
| 31/01/2026 | Closed | John Doe | Verified and closed |

---

## Current Status

**Status**: 
- [x] Closed

**Resolution**: 
- [x] Fixed

---

## Sign-off

**Tester Sign-off**: John Doe, Date: 31/01/2026  
**Developer Sign-off**: Jane Smith, Date: 30/01/2026  
**Test Lead Sign-off**: Mike Johnson, Date: 31/01/2026

---

**End of Defect Report**
