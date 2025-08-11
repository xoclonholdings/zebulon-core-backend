#!/bin/bash
# Start Memory API backend only
if [ -f ./apps/memory-api/dist/server/index.js ]; then
  echo "Starting Memory API backend (prod build)..."
  node ./apps/memory-api/dist/server/index.js &
else
  echo "Starting Memory API backend (dev)..."
  pnpm --filter ./apps/memory-api dev &
fi
wait
