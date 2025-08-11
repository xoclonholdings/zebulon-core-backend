#!/bin/bash
# Start Zync backend only
if [ -f ./apps/zync/dist/server/index.js ]; then
  echo "Starting Zync backend (prod build)..."
  node ./apps/zync/dist/server/index.js &
else
  echo "Starting Zync backend (dev)..."
  pnpm --filter ./apps/zync dev &
fi
wait
