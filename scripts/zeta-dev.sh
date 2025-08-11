#!/bin/bash
# Start Zeta backend only
if [ -f ./apps/zeta/dist/server/index.js ]; then
  echo "Starting Zeta backend (prod build)..."
  node ./apps/zeta/dist/server/index.js &
else
  echo "Starting Zeta backend (dev)..."
  pnpm --filter ./apps/zeta dev &
fi
wait
