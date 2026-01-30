# Low Rate Discount - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Setup Environment
Create a `.env` file in the project root:
```env
JWT_TOKEN=your_jwt_token_here
CUG_USERNAME=your_username
CUG_PASSWORD=your_password
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Run Tests
```powershell
# Easy way - Use the PowerShell script
.\run-low-rate-tests.ps1

# Or run directly with Playwright
npx playwright test low-rate-discount.spec.ts
```

---

## 📋 Rule Summary

**Low Rate Discount**
- **Discount**: 2%
- **Dates**: April 1-15, 2026
- **Condition**: Rates under $100 only
- **Apply To**: Adjust

---

## 🎯 What Gets Tested

### ✅ Should Get Discount
- Rates: $5, $25, $50, $75, $99, $99.99
- Dates: April 1-15, 2026
- Expected: 2% discount applied

### ❌ Should NOT Get Discount
- Rates at/above $100: $100, $150, $200, $250, $300
- Dates outside range: Before March 31, After April 16
- Expected: No discount

---

## 🏃 Quick Commands

### Run Different Test Types
```powershell
# All tests
.\run-low-rate-tests.ps1 all

# Basic tests only
.\run-low-rate-tests.ps1 basic

# Enhanced data-driven tests
.\run-low-rate-tests.ps1 enhanced

# Matrix tests
.\run-low-rate-tests.ps1 matrix

# Boundary tests
.\run-low-rate-tests.ps1 boundary

# Date range tests
.\run-low-rate-tests.ps1 dates

# Rate threshold tests
.\run-low-rate-tests.ps1 rates
```

### Run with Options
```powershell
# See browser while testing
.\run-low-rate-tests.ps1 -Headed

# Debug mode
.\run-low-rate-tests.ps1 -Debug

# Interactive UI mode
.\run-low-rate-tests.ps1 -UI

# Specific browser
.\run-low-rate-tests.ps1 -Browser chromium

# Show report after
.\run-low-rate-tests.ps1 -Report
```

### Combine Options
```powershell
# Run basic tests in Chrome with browser visible
.\run-low-rate-tests.ps1 basic -Browser chromium -Headed

# Run matrix tests in debug mode
.\run-low-rate-tests.ps1 matrix -Debug

# Run all tests and show report
.\run-low-rate-tests.ps1 all -Report
```

---

## 📊 View Results

### HTML Report
```powershell
npx playwright show-report
```

### Screenshots
Check the `screenshots/` folder for visual evidence:
- Rate tests: `low-rate-discount-rate-*.png`
- Date tests: `low-rate-discount-*-day.png`
- Boundary tests: `low-rate-discount-boundary-*.png`

---

## 🔍 Test Examples

### Example 1: Rate $50 in April (Should Get Discount)
```
Original: $50.00
Discount: $1.00 (2%)
Final: $49.00
Display: ~~$50.00~~ $49.00
```

### Example 2: Rate $100 in April (Should NOT Get Discount)
```
Original: $100.00
Discount: None (at threshold)
Final: $100.00
Display: $100.00
```

### Example 3: Rate $50 in March (Should NOT Get Discount)
```
Original: $50.00
Discount: None (outside date range)
Final: $50.00
Display: $50.00
```

---

## 🛠️ Troubleshooting

### Problem: "JWT Token Expired"
**Fix**: Update `JWT_TOKEN` in `.env` file

### Problem: "Hotel Not Found"
**Fix**: Update hotel IDs in test files with real hotel IDs from your system

### Problem: Tests Failing
**Fix**: 
1. Check rule is active in admin panel
2. Verify date range: April 1-15, 2026
3. Confirm rate threshold: Under $100
4. Ensure "Apply To" is set to "Adjust"

---

## 📝 Test Coverage Summary

| Category | Test Count |
|----------|-----------|
| Rate Threshold Tests | 11 |
| Date Range Tests | 10 |
| Multi-Night Tests | 6 |
| Boundary Tests | 5 |
| Matrix Tests | 3 |
| Regression Tests | 2 |
| **TOTAL** | **31+** |

---

## ✨ Key Test Scenarios

1. ✅ **$99 vs $100** - Boundary testing
2. ✅ **April 1 vs March 31** - Date boundary
3. ✅ **April 15 vs April 16** - Date boundary
4. ✅ **Multi-night stays** - Calculation accuracy
5. ✅ **Strike-through display** - UI verification
6. ✅ **High-value rates** - No false discounts

---

## 📚 Documentation

- **Full Guide**: `RUN_LOW_RATE_DISCOUNT_TESTS.md`
- **Test Summary**: `LOW_RATE_DISCOUNT_TEST_SUMMARY.md`
- **Test Data Helper**: `tests/helpers/low-rate-discount-data.ts`

---

## 🎯 Success Checklist

Before discount period (April 1):
- [ ] All tests passing
- [ ] Hotel IDs updated with real data
- [ ] JWT token is valid
- [ ] Screenshots reviewed

During discount period (April 1-15):
- [ ] Run tests daily
- [ ] Monitor for failures
- [ ] Verify discount applies correctly
- [ ] Check customer bookings

After discount period (April 16+):
- [ ] Verify discount no longer applies
- [ ] Archive test results
- [ ] Document any issues

---

## 💡 Pro Tips

1. **Run tests before the discount period** to catch issues early
2. **Use headed mode** (`-Headed`) to see what's happening
3. **Check screenshots** for visual confirmation
4. **Run matrix tests** for comprehensive coverage
5. **Keep JWT token fresh** to avoid authentication issues
6. **Update hotel IDs** with real properties from your system

---

## 🚨 Critical Tests

These tests MUST pass:
1. ✅ Rate $99 gets discount (edge case)
2. ✅ Rate $100 does NOT get discount (threshold)
3. ✅ April 1 applies discount (first day)
4. ✅ April 15 applies discount (last day)
5. ✅ March 31 does NOT apply discount (before)
6. ✅ April 16 does NOT apply discount (after)

---

## 📞 Need Help?

1. Check `RUN_LOW_RATE_DISCOUNT_TESTS.md` for detailed troubleshooting
2. Review `LOW_RATE_DISCOUNT_TEST_SUMMARY.md` for complete documentation
3. Examine `tests/helpers/low-rate-discount-data.ts` for test data configuration

---

**Ready to test?** Run: `.\run-low-rate-tests.ps1` 🚀

