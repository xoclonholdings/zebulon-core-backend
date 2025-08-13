#!/bin/bash
# Start Zebulon backend server, then start the client Homeview dashboard

# Start backend server in background
npm run dev &
BACKEND_PID=$!

# Wait for backend to be ready (customize this check as needed)
sleep 5

# Start client dashboard (assumes client/ uses npm)
cd client
npm run dev

# Optionally: kill backend when client stops
kill $BACKEND_PID
