#!/bin/bash
# Start Zlab backend only
if [ -f ./apps/zlab/dist/server/index.js ]; then
  echo "Starting Zlab backend (prod build)..."
  node ./apps/zlab/dist/server/index.js &
else
  echo "Starting Zlab backend (dev)..."
  pnpm --filter ./apps/zlab dev &
fi
wait
