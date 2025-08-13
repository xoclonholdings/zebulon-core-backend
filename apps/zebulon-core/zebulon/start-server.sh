#!/bin/bash
echo "🚀 Starting ZED AI Assistant Server..."

# Kill any existing processes on port 5001 (correct port)
echo "🔍 Checking for existing processes on port 5001..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || echo "No processes found on port 5001"

# Navigate to the correct directory
cd /home/xoclonholdings/Zebulon/Zed/AIAssist

echo "📁 Current directory: $(pwd)"

# Check environment
echo "� Environment check..."
if [ -f ".env" ]; then
    echo "✅ .env file found"
else
    echo "❌ .env file not found"
fi

echo "🚀 Starting TypeScript development server..."
exec npm run dev:simple

echo "⏳ Waiting for server to start..."
sleep 5

echo "📊 Server status:"
echo "PID: $SERVER_PID"
echo "Port 5000 status:"
lsof -i :5000 2>/dev/null || echo "No process found on port 5000"

echo "🧪 Testing server..."
curl -s http://localhost:5000/api/health || echo "Server not responding"

echo "📝 Server log:"
cat /tmp/zed-server.log 2>/dev/null || echo "No log file found"

echo "✅ Startup script completed!"
