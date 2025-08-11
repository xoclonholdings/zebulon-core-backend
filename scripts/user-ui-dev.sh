#!/bin/bash
# Start User UI only
if [ -f ./apps/user-ui/dist/server/index.js ]; then
  echo "Starting User UI (prod build)..."
  node ./apps/user-ui/dist/server/index.js &
else
  echo "Starting User UI (dev)..."
  pnpm --filter ./apps/user-ui dev &
fi
wait
