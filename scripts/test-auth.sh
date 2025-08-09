#!/bin/bash

# Test script to verify authentication is working
echo "🧪 Testing ZED Authentication..."

# Test if server is running
echo "1. Testing server health..."
if curl -s http://localhost:5001 > /dev/null; then
    echo "✅ Server is running on port 5001"
else
    echo "❌ Server not responding on port 5001"
    echo "   Run 'npm run dev' first"
    exit 1
fi

# Test auth endpoint when not logged in
echo "2. Testing /api/auth/user (should return 401)..."
AUTH_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/auth_test.json http://localhost:5001/api/auth/user)
if [ "$AUTH_RESPONSE" = "401" ]; then
    echo "✅ Correctly returns 401 when not authenticated"
else
    echo "❌ Expected 401, got: $AUTH_RESPONSE"
fi

# Test login endpoint
echo "3. Testing login with Admin/Zed2025..."
LOGIN_RESPONSE=$(curl -s -w "%{http_code}" -c /tmp/cookies.txt -o /tmp/login_test.json \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"Admin","password":"Zed2025"}' \
    http://localhost:5001/api/login)

if [ "$LOGIN_RESPONSE" = "200" ]; then
    echo "✅ Login successful"
    cat /tmp/login_test.json | jq .
else
    echo "❌ Login failed with code: $LOGIN_RESPONSE"
    cat /tmp/login_test.json
fi

# Test auth endpoint after login
echo "4. Testing /api/auth/user after login..."
AUTH_AFTER_RESPONSE=$(curl -s -w "%{http_code}" -b /tmp/cookies.txt -o /tmp/auth_after_test.json \
    http://localhost:5001/api/auth/user)

if [ "$AUTH_AFTER_RESPONSE" = "200" ]; then
    echo "✅ Authentication working after login"
    cat /tmp/auth_after_test.json | jq .
else
    echo "❌ Authentication still failing: $AUTH_AFTER_RESPONSE"
    cat /tmp/auth_after_test.json
fi

# Cleanup
rm -f /tmp/cookies.txt /tmp/auth_test.json /tmp/login_test.json /tmp/auth_after_test.json

echo "🎯 Test complete!"
