#!/bin/bash
# Robust tile launcher for User UI
BACKEND_SCRIPT=./scripts/user-ui-dev.sh
BACKEND_HEALTH_URL="http://localhost:6000/health"
FRONTEND_URL="http://localhost:5181"

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

function wait_for_frontend() {
  echo "Starting frontend..."
  pnpm --filter ./apps/user-ui/client dev &
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

echo "User UI tile is fully ready!"
