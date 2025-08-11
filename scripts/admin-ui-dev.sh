#!/bin/bash
# Start Admin UI only
if [ -f ./apps/admin-ui/dist/server/index.js ]; then
  echo "Starting Admin UI (prod build)..."
  node ./apps/admin-ui/dist/server/index.js &
else
  echo "Starting Admin UI (dev)..."
  pnpm --filter ./apps/admin-ui dev &
fi
wait
