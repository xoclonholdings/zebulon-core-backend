#!/bin/bash
# Start ZED backend only (no Zebulon Core)

# Start ZED backend
if [ -f ./apps/zed/dist/server/index.js ]; then
  echo "Starting ZED backend (prod build)..."
  node ./apps/zed/dist/server/index.js &
else
  echo "Starting ZED backend (dev)..."
  pnpm --filter ./apps/zed dev &
fi

wait
