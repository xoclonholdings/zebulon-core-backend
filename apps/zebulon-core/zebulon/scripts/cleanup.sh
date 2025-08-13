#!/bin/bash

# Zebulon Project Cleanup and Optimization Script
# This script optimizes storage and cleans up the project

echo "🧹 Starting Zebulon Project Cleanup..."

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Remove development logs
echo "Removing development logs..."
find . -name "*.log" -type f -delete
find . -name "debug_*.txt" -type f -delete
find . -name "audit_*.txt" -type f -delete

# Clean uploads directory (keep structure but remove old files)
echo "Cleaning uploads directory..."
find uploads/ -type f -mtime +7 -delete 2>/dev/null || true

# Clean node_modules build cache
echo "Cleaning build cache..."
rm -rf node_modules/.cache
rm -rf .vite
rm -rf dist/

# Clean TypeScript build info
echo "Cleaning TypeScript build info..."
rm -f node_modules/typescript/tsbuildinfo

# Optimize package-lock.json
echo "Optimizing package-lock.json..."
npm install --package-lock-only

echo "✅ Cleanup completed!"
echo "📊 Storage saved:"
du -sh node_modules/.cache 2>/dev/null || echo "Cache directory cleaned"
du -sh .vite 2>/dev/null || echo "Vite cache cleaned"
du -sh dist/ 2>/dev/null || echo "Build directory cleaned"
