#!/bin/bash
# Start Zebulon Core backend and client only (no ZED)

# Start Zebulon Core backend
if [ -f ./apps/zebulon-core/dist/server.js ]; then
  echo "Starting Zebulon Core backend (prod build)..."
  node ./apps/zebulon-core/dist/server.js &
else
  echo "Starting Zebulon Core backend (dev)..."
  pnpm --filter ./apps/zebulon-core dev &
fi
sleep 2

# Start client (main UI)
echo "Starting Zebulon client (main UI)..."
pnpm --filter ./client dev &

wait
