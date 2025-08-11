#!/bin/bash
# Robust tile launcher for Memory API
BACKEND_SCRIPT=./scripts/memory-api-dev.sh
BACKEND_HEALTH_URL="http://localhost:5800/health"

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

wait_for_backend &
wait

echo "Memory API tile is fully ready!"
