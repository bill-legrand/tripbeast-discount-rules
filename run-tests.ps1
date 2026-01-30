# Tripbeast Discount Rules - Test Execution Script
# PowerShell script to run Playwright tests with proper credentials

param(
    [string]$TestFile = "",
    [string]$TestName = "",
    [switch]$Headed = $false,
    [switch]$Debug = $false,
    [switch]$UI = $false,
    [string]$Browser = "chromium",
    [switch]$AllTests = $false,
    [switch]$DOWTests = $false
)

# Set credentials
$env:ADMIN_USERNAME = "bill.legrand@gmail.com"
$env:ADMIN_PASSWORD = "@fHRnam2Au7VYsS"

# Set base URLs
$env:BASE_URL = "https://admin.rezmatestage.com"
$env:ANCILLARY_BE_URL = "https://ancillary.rezmatestage.com"
$env:CUG_BE_URL = "https://cug.rezmatestage.com"
$env:B2C_BE_URL = "https://b2c.rezmatestage.com"
$env:API_BASE_URL = "https://api.rezmatestage.com"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tripbeast Discount Rules - Test Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Build the command
$command = "npx playwright test"

# Add test file if specified
if ($TestFile) {
    $command += " $TestFile"
}

# Add test name filter if specified
if ($TestName) {
    $command += " -g `"$TestName`""
}

# Add browser project
$command += " --project=$Browser"

# Add headed mode if requested
if ($Headed) {
    $command += " --headed"
    Write-Host "Running in HEADED mode (browser visible)" -ForegroundColor Yellow
}

# Add debug mode if requested
if ($Debug) {
    $command += " --debug"
    Write-Host "Running in DEBUG mode" -ForegroundColor Yellow
}

# Add UI mode if requested
if ($UI) {
    $command = "npx playwright test --ui"
    Write-Host "Opening Playwright UI Mode" -ForegroundColor Green
}

# Run all tests if requested
if ($AllTests) {
    Write-Host "Running ALL test suites" -ForegroundColor Green
} elseif ($DOWTests) {
    Write-Host "Running Day of Week Discount Tests" -ForegroundColor Green
    $command += " tests/dow-discount-verification.spec.ts"
} elseif ($TestFile) {
    Write-Host "Running tests from: $TestFile" -ForegroundColor Green
} elseif ($TestName) {
    Write-Host "Running tests matching: $TestName" -ForegroundColor Green
} else {
    Write-Host "Running quick login test" -ForegroundColor Green
    $command += " tests/quick-login-test.spec.ts"
}

Write-Host ""
Write-Host "Command: $command" -ForegroundColor Gray
Write-Host ""

# Execute the command
Invoke-Expression $command

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test execution completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
