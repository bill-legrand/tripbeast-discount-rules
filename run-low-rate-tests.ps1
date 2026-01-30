# PowerShell Script to Run Low Rate Discount Tests
# Usage: .\run-los-tests.ps1 [test-type] [options]

param(
    [Parameter(Position=0)]
    [ValidateSet("all", "basic", "enhanced", "matrix", "regression", "boundary", "dates", "rates")]
    [string]$TestType = "all",
    
    [Parameter()]
    [switch]$Headed,
    
    [Parameter()]
    [switch]$DebugMode,
    
    [Parameter()]
    [switch]$UI,
    
    [Parameter()]
    [ValidateSet("chromium", "firefox", "webkit")]
    [string]$Browser,
    
    [Parameter()]
    [switch]$Report
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Low Rate Discount Test Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "Please create a .env file with your JWT_TOKEN" -ForegroundColor Yellow
    Write-Host ""
}

# Build the base command
$baseCommand = "npx playwright test"

# Add test file based on test type
switch ($TestType) {
    "all" {
        Write-Host "Running ALL Low Rate Discount tests..." -ForegroundColor Green
        $testFile = "low-rate-discount.spec.ts low-rate-discount-enhanced.spec.ts"
    }
    "basic" {
        Write-Host "Running BASIC Low Rate Discount tests..." -ForegroundColor Green
        $testFile = "low-rate-discount.spec.ts"
    }
    "enhanced" {
        Write-Host "Running ENHANCED data-driven tests..." -ForegroundColor Green
        $testFile = "low-rate-discount-enhanced.spec.ts"
    }
    "matrix" {
        Write-Host "Running MATRIX tests..." -ForegroundColor Green
        $testFile = "low-rate-discount-enhanced.spec.ts -g 'Matrix Testing'"
    }
    "regression" {
        Write-Host "Running REGRESSION tests..." -ForegroundColor Green
        $testFile = "low-rate-discount-enhanced.spec.ts -g 'Regression'"
    }
    "boundary" {
        Write-Host "Running BOUNDARY tests..." -ForegroundColor Green
        $testFile = "low-rate-discount.spec.ts -g 'boundary'"
    }
    "dates" {
        Write-Host "Running DATE RANGE tests..." -ForegroundColor Green
        $testFile = "low-rate-discount.spec.ts -g 'Date Range'"
    }
    "rates" {
        Write-Host "Running RATE THRESHOLD tests..." -ForegroundColor Green
        $testFile = "low-rate-discount.spec.ts -g 'rate of'"
    }
}

$command = "$baseCommand $testFile"

# Add options
if ($Headed) {
    Write-Host "Mode: Headed (browser visible)" -ForegroundColor Cyan
    $command += " --headed"
}

if ($DebugMode) {
    Write-Host "Mode: Debug" -ForegroundColor Cyan
    $command += " --debug"
}

if ($UI) {
    Write-Host "Mode: UI (interactive)" -ForegroundColor Cyan
    $command += " --ui"
}

if ($Browser) {
    Write-Host "Browser: $Browser" -ForegroundColor Cyan
    $command += " --project=$Browser"
}

Write-Host ""
Write-Host "Executing: $command" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Execute the command
Invoke-Expression $command

# Show report if requested
if ($Report) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Opening test report..." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    npx playwright show-report
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test execution complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Screenshots saved to: screenshots/" -ForegroundColor Yellow
Write-Host "Test results saved to: test-results/" -ForegroundColor Yellow
Write-Host ""
Write-Host "To view the HTML report, run:" -ForegroundColor Cyan
Write-Host "  npx playwright show-report" -ForegroundColor White
Write-Host ""

