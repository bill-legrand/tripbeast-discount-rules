# Cruise Discount Test Runner
# Tests cruise discounts using Ancillary JWT with Ancii Stage DR rule

param(
    [switch]$Headed,      # Run with browser visible
    [switch]$UI,          # Run in Playwright UI mode
    [switch]$Report,      # Generate HTML report
    [string]$Filter = ""  # Filter specific tests
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cruise Discount Test Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Build test command
$testCmd = "npx playwright test tests/cruise-discount.spec.ts"

if ($Headed) {
    $testCmd += " --headed"
    Write-Host "Mode: Headed (browser visible)" -ForegroundColor Green
}

if ($UI) {
    $testCmd += " --ui"
    Write-Host "Mode: UI Mode" -ForegroundColor Green
}

if ($Report) {
    $testCmd += " --reporter=html"
    Write-Host "Report: HTML report will be generated" -ForegroundColor Green
}

if ($Filter) {
    $testCmd += " --grep `"$Filter`""
    Write-Host "Filter: $Filter" -ForegroundColor Green
}

Write-Host ""
Write-Host "Discount Configuration:" -ForegroundColor Yellow
Write-Host "  Period 1 (Mar 1-7):   22% Fixed" -ForegroundColor White
Write-Host "  Period 2 (Mar 8-14):  DOW-Based" -ForegroundColor White
Write-Host "    Mon: 36%, Tue: 48%, Wed: 60%" -ForegroundColor Gray
Write-Host "    Thu: 72%, Fri: 84%, Sat: 12%, Sun: 24%" -ForegroundColor Gray
Write-Host "  Period 3 (Mar 15-21): 21% Fixed" -ForegroundColor White
Write-Host "  Mar 22-31:            No Discount (0%)" -ForegroundColor White
Write-Host ""

Write-Host "Running command: $testCmd" -ForegroundColor Cyan
Write-Host ""

# Run tests
Invoke-Expression $testCmd

# Check if report was generated
if (Test-Path "CRUISE_DISCOUNT_REPORT.md") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Report Generated: CRUISE_DISCOUNT_REPORT.md" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
}

if ($Report -and (Test-Path "playwright-report")) {
    Write-Host ""
    Write-Host "Opening HTML report..." -ForegroundColor Cyan
    npx playwright show-report
}
