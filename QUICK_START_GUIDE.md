# Quick Start Guide - Tripbeast Discount Rules Testing

## Welcome! 👋

This guide will help you get started with testing the Tripbeast Discount Rules enhancement quickly and efficiently.

---

## 📋 What You Need to Know

### The Feature in 30 Seconds
Tripbeast now supports discount rules for Closed User Groups (CUG). Discounts are:
- Applied on subtotal (Price + Markups), excluding taxes & fees
- Passed via JWT tokens for Ancillary and CUG Booking Engines
- Configurable per channel, stakeholder, and product
- Available in 4 types: Default, Date Range, Specific Date, and Dynamic

### Strike-Through Display Logic
- **Both ON**: Shows ~~$1200~~ ~~$1000~~ $900
- **Hotel OFF, Discount ON**: Shows ~~$1000~~ $900
- **Hotel ON, Discount OFF**: Shows $900 only
- **Both OFF**: Shows $900 only

---

## 🚀 Getting Started (5 Minutes)

### Step 1: Access Test Environment
```
Admin Panel: https://test-admin.tripbeast.com
Ancillary BE: https://test-ancillary.tripbeast.com
CUG BE: https://test-cug.tripbeast.com
B2C BE: https://test-b2c.tripbeast.com
```

**Login Credentials**: [Get from Test Lead]

### Step 2: Import API Collection
1. Open Postman
2. Import `API_TEST_COLLECTION.json`
3. Set environment variables:
   - `base_url`: https://test-api.tripbeast.com
   - `auth_token`: [Your auth token]

### Step 3: Review Test Plan
Open `TEST_PLAN.md` and familiarize yourself with:
- Section 4: Test Cases (50 total)
- Section 5: Test Data Templates
- Section 6: Test Execution Checklist

---

## 📝 Your First Test (10 Minutes)

### Test Case: Create a Simple Discount Rule

**Goal**: Create a 10% default discount rule

**Steps**:
1. Login to Admin Panel
2. Navigate to Discount Rules → Create New
3. Enter rule name: "Test_Discount_10"
4. Select discount type: "Default"
5. Enter discount: 10%
6. Select channel: "Channel_A"
7. Click Save
8. **Verify**: System generates unique ID (e.g., DR-12345)

**Expected Result**: ✅ Rule created with system-generated ID

**If it fails**: Document in defect report using `DEFECT_REPORT_TEMPLATE.md`

---

## 🎯 Priority Testing Areas

### Day 1: Core Functionality
Focus on these critical test cases first:
- **TC-001 to TC-005**: Discount Rule Creation
- **TC-006 to TC-007**: JWT Token Integration (Critical!)
- **TC-017**: Default Discount Application

### Day 2: Discount Types
- **TC-018**: Date Range-Based Discount
- **TC-019**: Specific Date-Based Discount
- **TC-020**: Dynamic Discount Rules
- **TC-023**: Discount on Subtotal Only (Critical!)

### Day 3: Strike-Through Display
- **TC-025 to TC-028**: All 4 strike-through cases (All Critical!)

### Day 4: Integration & Security
- **TC-034**: Discount + Markup Combined (Critical!)
- **TC-046**: JWT Token Tampering (Critical!)
- **TC-050**: Regression Test - Markup Rules (Critical!)

---

## 🔍 Common Test Scenarios

### Scenario 1: Test JWT Token Integration

**API Request** (Use Postman):
```json
POST /api/v1/auth/generate-token
{
  "user_id": "USR-12345",
  "booking_engine_type": "cug",
  "discount_rule_id": "DR-12345",
  "channel_id": "Channel_A"
}
```

**Verify**:
1. Token generated successfully
2. Decode token at jwt.io
3. Check `discount_rule_id` field exists
4. Value matches "DR-12345"

### Scenario 2: Test Price Calculation

**Given**:
- Base Price: $1,000
- Markup: +10% = $100
- Subtotal: $1,100

**Apply**: 15% discount

**Expected Calculation**:
- Discount: 15% of $1,100 = $165
- Discounted Subtotal: $935
- Add Taxes ($50) + Fees ($25)
- **Final Total: $1,010**

**Verify**: All calculations match

### Scenario 3: Test Strike-Through Display

**Setup**:
1. Use hotel product from Expedia with strike-through
2. Configure discount rule with 10% discount
3. Enable both strike-through toggles

**Test Each Case**:
- Case 1: Both ON → ~~$1200~~ ~~$1000~~ $900
- Case 2: Hotel OFF, Discount ON → ~~$1000~~ $900
- Case 3: Hotel ON, Discount OFF → $900
- Case 4: Both OFF → $900

**Capture**: Screenshots for each case

---

## 📊 Using the Test Tracking Sheet

### Open `TEST_SCENARIOS.xlsx`

**Columns**:
- **Test Scenario ID**: Unique identifier (TS-001, TS-002, etc.)
- **Priority**: Critical, High, Medium, Low
- **Status**: Not Started, In Progress, Pass, Fail, Blocked

**Update After Each Test**:
1. Change Status to "In Progress" when starting
2. Mark "Pass" or "Fail" when complete
3. Add comments if needed

---

## 🐛 Reporting Defects

### Quick Defect Report (2 Minutes)

**Use `DEFECT_REPORT_TEMPLATE.md`**

**Minimum Required**:
1. **Defect ID**: DEF-[NUMBER]
2. **Summary**: One-line description
3. **Severity**: Critical/High/Medium/Low
4. **Steps to Reproduce**: Numbered list
5. **Expected vs Actual**: What should happen vs what happened
6. **Screenshot**: Always attach!

**Example**:
```
Defect ID: DEF-001
Summary: Discount not applied on CUG booking engine
Severity: High
Steps:
1. Login to CUG BE with JWT token containing DR-12345
2. Select product PROD-001
3. View price
Expected: Price shows $900 (10% discount applied)
Actual: Price shows $1000 (no discount)
```

---

## ✅ Daily Checklist

### Start of Day
- [ ] Check test environment status
- [ ] Review assigned test cases
- [ ] Prepare test data
- [ ] Clear browser cache
- [ ] Open defect tracking system

### During Testing
- [ ] Follow test cases step-by-step
- [ ] Document actual results
- [ ] Capture screenshots for failures
- [ ] Log defects immediately
- [ ] Update test tracking sheet

### End of Day
- [ ] Update all test case statuses
- [ ] Submit defect reports
- [ ] Backup test evidence
- [ ] Report blockers to Test Lead
- [ ] Plan next day's testing

---

## 🔧 Troubleshooting

### Problem: Can't Login to Test Environment
**Solution**: 
1. Check VPN connection
2. Verify credentials with Test Lead
3. Clear browser cookies
4. Try incognito mode

### Problem: JWT Token Not Generated
**Solution**:
1. Verify discount rule ID exists
2. Check rule is active
3. Verify booking engine type is correct (ancillary/cug)
4. Check API authentication token

### Problem: Discount Not Applied
**Solution**:
1. Verify rule is assigned to channel
2. Check product is included in rule
3. Verify rule status is "active"
4. Check date range (if date-based discount)
5. Verify JWT token contains correct rule ID

### Problem: Strike-Through Not Showing
**Solution**:
1. Check strike-through toggle settings
2. Clear browser cache
3. Verify supplier data includes strike-through
4. Check CSS/styling issues in browser console

---

## 📞 Who to Contact

### For Test Environment Issues
**Contact**: DevOps Team  
**Email**: devops@tripbeast.com

### For Test Data Setup
**Contact**: Test Lead  
**Email**: [Test Lead Email]

### For Defect Clarification
**Contact**: Development Lead  
**Email**: [Dev Lead Email]

### For Requirements Questions
**Contact**: Product Owner  
**Email**: [PO Email]

### For Urgent Blockers
**Contact**: QA Manager  
**Email**: [QA Manager Email]  
**Phone**: [Phone Number]

---

## 📚 Key Documents Reference

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `TEST_PLAN.md` | Complete test strategy | Planning & reference |
| `TEST_SCENARIOS.xlsx` | Test case tracking | Daily execution |
| `TEST_EXECUTION_CHECKLIST.md` | Detailed execution steps | During testing |
| `DEFECT_REPORT_TEMPLATE.md` | Defect reporting | When bugs found |
| `API_TEST_COLLECTION.json` | API testing | API validation |
| `README.md` | Overview & setup | Getting started |

---

## 💡 Pro Tips

### Tip 1: Use Browser DevTools
- **Network Tab**: Monitor API calls and responses
- **Console Tab**: Check for JavaScript errors
- **Application Tab**: Inspect JWT tokens in localStorage

### Tip 2: Test Data Organization
Create a personal test data sheet:
```
Rule ID: DR-12345
Channel: Channel_A
Product: PROD-001
User: USR-12345
Stakeholder: STK-001
```

### Tip 3: Screenshot Naming Convention
Use descriptive names:
- `TC-025_Case1_Both-ON_Pass.png`
- `TC-017_Default-Discount_Fail.png`

### Tip 4: Batch Similar Tests
Test all date-based discounts together, all strike-through cases together, etc.

### Tip 5: Keep Notes
Document:
- Unexpected behaviors (even if not bugs)
- Performance observations
- User experience issues
- Suggestions for improvement

---

## 🎓 Testing Best Practices

### DO ✅
- Follow test cases exactly as written
- Document every step
- Capture screenshots for all failures
- Test on multiple browsers
- Clear cache between tests
- Verify JWT token contents
- Test edge cases (0%, 100%, boundary dates)
- Retest after every fix

### DON'T ❌
- Skip steps in test cases
- Assume something works without testing
- Test without clearing cache
- Ignore minor issues
- Forget to update test status
- Test in production environment
- Make assumptions about requirements

---

## 📈 Success Metrics

### Your Testing Goals
- **Test Execution Rate**: Complete assigned test cases on time
- **Defect Detection**: Find defects early
- **Defect Quality**: Write clear, reproducible defect reports
- **Coverage**: Test all critical scenarios
- **Efficiency**: Minimize blocked/skipped tests

### Team Goals
- **Overall Pass Rate**: > 95%
- **Critical Test Pass Rate**: 100%
- **Defect Detection Rate**: High in early phases
- **Test Completion**: 100% of planned tests
- **Zero Critical Defects**: At release

---

## 🚦 Test Execution Flow

```
1. Review Test Case
   ↓
2. Prepare Test Data
   ↓
3. Execute Test Steps
   ↓
4. Document Results
   ↓
5. Pass? → Update Status → Next Test
   ↓
6. Fail? → Log Defect → Capture Evidence → Update Status
   ↓
7. Blocked? → Report to Test Lead → Move to Next Test
```

---

## 📅 Weekly Schedule Template

### Monday
- Review test plan
- Setup test environment
- Execute TC-001 to TC-010

### Tuesday
- Execute TC-011 to TC-020
- Log any defects found

### Wednesday
- Execute TC-021 to TC-030
- Focus on strike-through tests

### Thursday
- Execute TC-031 to TC-040
- Integration & negative testing

### Friday
- Execute TC-041 to TC-050
- Retest fixed defects
- Update test summary

---

## 🎯 Quick Reference Card

### Critical Test Cases (Must Pass!)
- TC-006, TC-007: JWT Token Integration
- TC-013: Apply to Active Products
- TC-017: Default Discount
- TC-023: Discount on Subtotal
- TC-025 to TC-028: Strike-Through Cases
- TC-034: Discount + Markup
- TC-046: JWT Token Tampering
- TC-050: Regression Test

### Test Data Quick Access
- Channels: Channel_A, Channel_B, Channel_C
- Products: PROD-001 to PROD-010
- Users: USR-12345, USR-67890
- Stakeholders: STK-001, STK-002

### Severity Guidelines
- **Critical**: System crash, security breach, wrong calculations
- **High**: Major functionality broken, no workaround
- **Medium**: Functionality impaired, workaround exists
- **Low**: Minor cosmetic issues

---

## 🏁 Ready to Start?

### Your First Hour Checklist
- [ ] Read this Quick Start Guide (15 min)
- [ ] Access all test environments (10 min)
- [ ] Import API collection to Postman (5 min)
- [ ] Review TEST_PLAN.md sections 1-4 (20 min)
- [ ] Execute your first test case TC-001 (10 min)

### Questions?
Don't hesitate to ask! Contact your Test Lead or refer to the detailed documentation.

---

**Good luck with your testing! 🚀**

---

## Document Information

**Version**: 1.0  
**Last Updated**: January 29, 2026  
**Maintained By**: Test Team

---

**Remember**: Quality testing ensures quality software. Take your time, be thorough, and document everything!
