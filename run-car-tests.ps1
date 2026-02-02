# Car Rental Discount Tests - Quick Run Script
# 
# This script runs the car rental discount test suite
# Usage:
#   .\run-car-tests.ps1           # Run all tests headless
#   .\run-car-tests.ps1 -Headed   # Run with browser visible
#   .\run-car-tests.ps1 -UI       # Run in interactive UI mode
#   .\run-car-tests.ps1 -Report   # Generate HTML report after tests

param(
    [switch]$Headed,
    [switch]$UI,
    [switch]$Report,
    [switch]$OneDay,
    [switch]$TwoDay,
    [switch]$SevenDay,
    [switch]$Help
)

# Color output functions
function Write-Header {
    param([string]$Message)
    Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Show help
if ($Help) {
    Write-Header "Car Rental Discount Tests - Help"
    
    Write-Host "USAGE:" -ForegroundColor White
    Write-Host "  .\run-car-tests.ps1 [OPTIONS]`n"
    
    Write-Host "OPTIONS:" -ForegroundColor White
    Write-Host "  -Headed       Run tests with browser visible (headed mode)"
    Write-Host "  -UI           Run tests in interactive UI mode"
    Write-Host "  -Report       Generate HTML report after test run"
    Write-Host "  -OneDay       Run only 1-day rental tests (31 tests)"
    Write-Host "  -TwoDay       Run only 2-day rental tests (29 tests)"
    Write-Host "  -SevenDay     Run only 7-day rental tests (24 tests)"
    Write-Host "  -Help         Show this help message`n"
    
    Write-Host "EXAMPLES:" -ForegroundColor White
    Write-Host "  .\run-car-tests.ps1"
    Write-Host "    Run all 84 tests in headless mode`n"
    
    Write-Host "  .\run-car-tests.ps1 -Headed"
    Write-Host "    Run all tests with browser visible`n"
    
    Write-Host "  .\run-car-tests.ps1 -OneDay -Headed"
    Write-Host "    Run only 1-day rental tests with browser visible`n"
    
    Write-Host "  .\run-car-tests.ps1 -Report"
    Write-Host "    Run all tests and generate HTML report`n"
    
    Write-Host "TEST SUITES:" -ForegroundColor White
    Write-Host "  1-Day Rentals:  31 tests (Mar 1-31, 2026)"
    Write-Host "  2-Day Rentals:  29 tests (Mar 1-29, 2026)"
    Write-Host "  7-Day Rentals:  24 tests (Mar 1-24, 2026)"
    Write-Host "  Total:          84 tests`n"
    
    Write-Host "DISCOUNT PERIODS:" -ForegroundColor White
    Write-Host "  Period 1: Mar 1-7   → 12% fixed discount"
    Write-Host "  Period 2: Mar 8-14  → 22% fixed discount"
    Write-Host "  Period 3: Mar 15-28 → 5-35% DOW-based discount"
    Write-Host "  No Discount: Mar 29-31 → 0%`n"
    
    Write-Host "REPORTS:" -ForegroundColor White
    Write-Host "  Generated after each test run:"
    Write-Host "    - CAR_1DAY_DISCOUNT_REPORT.md"
    Write-Host "    - CAR_2DAY_DISCOUNT_REPORT.md"
    Write-Host "    - CAR_7DAY_DISCOUNT_REPORT.md"
    Write-Host "  Screenshots saved to:"
    Write-Host "    - test-results/car-screenshots/1-day/"
    Write-Host "    - test-results/car-screenshots/2-day/"
    Write-Host "    - test-results/car-screenshots/7-day/`n"
    
    exit 0
}

Write-Header "Car Rental Discount Tests"

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Info "node_modules not found. Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Failed to install dependencies"
        exit 1
    }
    Write-Success "Dependencies installed"
}

# Determine which tests to run
$testFiles = @()
if ($OneDay) {
    $testFiles += "car-1day-discount.spec.ts"
    Write-Info "Running 1-Day Rental tests (31 tests)"
} elseif ($TwoDay) {
    $testFiles += "car-2day-discount.spec.ts"
    Write-Info "Running 2-Day Rental tests (29 tests)"
} elseif ($SevenDay) {
    $testFiles += "car-7day-discount.spec.ts"
    Write-Info "Running 7-Day Rental tests (24 tests)"
} else {
    $testFiles += "car-1day-discount.spec.ts"
    $testFiles += "car-2day-discount.spec.ts"
    $testFiles += "car-7day-discount.spec.ts"
    Write-Info "Running ALL Car Rental tests (84 tests)"
}

# Build test command
$testCommand = "npx playwright test"

# Add test files
foreach ($file in $testFiles) {
    $testCommand += " tests/$file"
}

# Add project
$testCommand += " --project=chromium"

# Add mode flags
if ($UI) {
    $testCommand += " --ui"
    Write-Info "Opening interactive UI mode..."
} elseif ($Headed) {
    $testCommand += " --headed"
    Write-Info "Running tests in headed mode (browser visible)"
} else {
    Write-Info "Running tests in headless mode"
}

# Add reporter if requested
if ($Report) {
    $testCommand += " --reporter=html"
    Write-Info "HTML report will be generated"
}

Write-Host "`nExecuting: $testCommand`n" -ForegroundColor Gray

# Run the tests
Invoke-Expression $testCommand

if ($LASTEXITCODE -eq 0) {
    Write-Success "Tests completed successfully!"
    
    Write-Host "`n" -NoNewline
    Write-Header "Test Reports Generated"
    
    if ($OneDay -or !$TwoDay -and !$SevenDay) {
        if (Test-Path "CAR_1DAY_DISCOUNT_REPORT.md") {
            Write-Success "CAR_1DAY_DISCOUNT_REPORT.md"
        }
    }
    if ($TwoDay -or !$OneDay -and !$SevenDay) {
        if (Test-Path "CAR_2DAY_DISCOUNT_REPORT.md") {
            Write-Success "CAR_2DAY_DISCOUNT_REPORT.md"
        }
    }
    if ($SevenDay -or !$OneDay -and !$TwoDay) {
        if (Test-Path "CAR_7DAY_DISCOUNT_REPORT.md") {
            Write-Success "CAR_7DAY_DISCOUNT_REPORT.md"
        }
    }
    
    Write-Host "`nScreenshots saved to:" -ForegroundColor White
    if ($OneDay -or !$TwoDay -and !$SevenDay) {
        Write-Success "test-results/car-screenshots/1-day/"
    }
    if ($TwoDay -or !$OneDay -and !$SevenDay) {
        Write-Success "test-results/car-screenshots/2-day/"
    }
    if ($SevenDay -or !$OneDay -and !$TwoDay) {
        Write-Success "test-results/car-screenshots/7-day/"
    }
    
    if ($Report) {
        Write-Host "`n" -NoNewline
        Write-Info "Opening HTML report..."
        npx playwright show-report
    }
    
    Write-Host "`n" -NoNewline
    Write-Success "For complete documentation, see CAR_RENTAL_TEST_SUITE_REPORT.md"
    
} else {
    Write-Error-Custom "Tests failed with exit code $LASTEXITCODE"
    Write-Host "`nTo view detailed results, run:" -ForegroundColor Yellow
    Write-Host "  npx playwright show-report`n" -ForegroundColor White
    exit $LASTEXITCODE
}

Write-Host "`n"
