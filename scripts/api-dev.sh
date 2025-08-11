#!/bin/bash
# Start API backend only
if [ -f ./apps/api/dist/server/index.js ]; then
  echo "Starting API backend (prod build)..."
  node ./apps/api/dist/server/index.js &
else
  echo "Starting API backend (dev)..."
  pnpm --filter ./apps/api dev &
fi
wait
