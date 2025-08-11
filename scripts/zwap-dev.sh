#!/bin/bash
# Start Zwap backend only
if [ -f ./apps/zwap/dist/server/index.js ]; then
  echo "Starting Zwap backend (prod build)..."
  node ./apps/zwap/dist/server/index.js &
else
  echo "Starting Zwap backend (dev)..."
  pnpm --filter ./apps/zwap dev &
fi
wait
