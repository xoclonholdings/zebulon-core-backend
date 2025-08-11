#!/bin/bash
# Robust tile launcher: starts backend and frontend, waits for both to be ready, never fails
# Usage: ./scripts/launch-zebulon-core.sh

BACKEND_SCRIPT=./scripts/zebulon-core-dev.sh
BACKEND_HEALTH_URL="http://localhost:5001/health"
FRONTEND_URL="http://localhost:5173" # Adjust if needed

# Start backend if not running
function wait_for_backend() {
  echo "Starting backend..."
  $BACKEND_SCRIPT &
  for i in {1..14}; do
    sleep 0.5
    if curl -sf "$BACKEND_HEALTH_URL" > /dev/null; then
      echo "Backend ready."
      return 0
    fi
    echo "Waiting for backend... ($i)"
  done
  echo "Backend not ready, retrying..."
  wait_for_backend
}

# Start frontend if not running (assume Vite default port, adjust as needed)
function wait_for_frontend() {
  echo "Starting frontend..."
  pnpm --filter ./client dev &
  for i in {1..14}; do
    sleep 0.5
    if curl -sf "$FRONTEND_URL" > /dev/null; then
      echo "Frontend ready."
      return 0
    fi
    echo "Waiting for frontend... ($i)"
  done
  echo "Frontend not ready, retrying..."
  wait_for_frontend
}

wait_for_backend &
wait_for_frontend &
wait

echo "Tile is fully ready!"
