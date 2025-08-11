#!/bin/bash
# Start Zulu backend only
if [ -f ./apps/zulu/dist/server/index.js ]; then
  echo "Starting Zulu backend (prod build)..."
  node ./apps/zulu/dist/server/index.js &
else
  echo "Starting Zulu backend (dev)..."
  pnpm --filter ./apps/zulu dev &
fi
wait
