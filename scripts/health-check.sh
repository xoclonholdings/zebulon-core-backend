#!/bin/bash

# ZED Project Health Check
# This script verifies project integrity and configuration

echo "🔍 ZED Project Health Check"
echo "=========================="

# Check Node.js version
echo "📦 Node.js version:"
node --version

# Check npm version
echo "📦 npm version:"
npm --version

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ Environment file exists"
else
    echo "❌ Environment file missing - copy .env.example to .env"
fi

# Check TypeScript compilation
echo "🔍 TypeScript check:"
npm run check

# Check if key directories exist
dirs=("client/src" "server" "shared" "uploads")
for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ Directory $dir exists"
    else
        echo "❌ Directory $dir missing"
    fi
done

# Check key files
files=("package.json" "tsconfig.json" "vite.config.ts")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ File $file exists"
    else
        echo "❌ File $file missing"
    fi
done

# Check database connection (if running)
echo "🔍 Database connection:"
if [ -f ".env" ]; then
    echo "Environment configured - run 'npm run dev' to test connection"
else
    echo "Configure .env file first"
fi

echo ""
echo "🚀 To start the server: npm run dev"
echo "🌐 Application will run on: http://localhost:5001"
