#!/bin/bash
echo "🔍 Testing ZED Authentication System..."
echo "🌐 Testing server availability..."

# Check if server is running
if curl -s http://localhost:5001/api/auth/user > /dev/null; then
    echo "✅ Server is responding"
else
    echo "❌ Server is not responding on http://localhost:5001"
    echo "   Please make sure the server is running with: npm run dev:simple"
    exit 1
fi

echo ""
echo "🔐 Testing login endpoint..."

# Test the login endpoint
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "Admin", "password": "Zed2025"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo "Response Code: $HTTP_CODE"
echo "Response Body: $BODY"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Login successful!"
    
    echo ""
    echo "🔍 Testing authentication status..."
    
    # Extract cookies and test auth endpoint
    curl -s -X GET http://localhost:5001/api/auth/user \
      -H "Cookie: $(echo "$BODY" | grep -o 'connect.sid=[^;]*')" \
      || echo "Auth status check"
else
    echo "❌ Login failed with code: $HTTP_CODE"
    echo "   Response: $BODY"
fi

echo ""
echo "✅ Authentication test completed"
