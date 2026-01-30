#!/bin/bash

# Tripbeast Discount Rules - Playwright Test Setup Script

echo "🚀 Setting up Playwright tests for Tripbeast Discount Rules..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo "✅ Playwright browsers installed"
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p screenshots
mkdir -p test-results
mkdir -p playwright-report

echo "✅ Directories created"
echo ""

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your credentials!"
    echo ""
fi

# Run a test to verify setup
echo "🧪 Running verification test..."
npx playwright test tests/discount-rule-creation.spec.ts --grep "TC-001" --headed

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete! You're ready to run tests."
    echo ""
    echo "📚 Quick start commands:"
    echo "   npm test              - Run all tests"
    echo "   npm run test:headed   - Run with browser UI"
    echo "   npm run test:ui       - Interactive UI mode"
    echo "   npm run test:report   - View test report"
    echo ""
    echo "📖 See PLAYWRIGHT_TESTING_GUIDE.md for detailed documentation"
else
    echo ""
    echo "⚠️  Verification test failed. Please check:"
    echo "   1. .env file has correct credentials"
    echo "   2. Test environment is accessible"
    echo "   3. Network connection is stable"
    echo ""
    echo "Run 'npm run test:debug' to troubleshoot"
fi
