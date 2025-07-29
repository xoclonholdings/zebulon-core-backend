#!/bin/bash
echo "🚀 Starting ZED server with debug logging..."

# Kill any existing processes
pkill -f "tsx server" 2>/dev/null || true
pkill -f "node.*5001" 2>/dev/null || true

# Wait a moment
sleep 2

# Navigate to correct directory
cd /home/xoclonholdings/Zebulon/Zed/AIAssist

# Start server with output visible
echo "📂 Starting from: $(pwd)"
echo "🔧 NODE_ENV=development npx tsx server/index.simple.ts"

NODE_ENV=development npx tsx server/index.simple.ts
