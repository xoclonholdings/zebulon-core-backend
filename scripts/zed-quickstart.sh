#!/bin/bash
# ZED quickstart: start backend and client in parallel, wait for both to be ready

BACKEND_PORT=$(grep PORT ./apps/zed/.env | cut -d '=' -f2 | tr -d '\r')
CLIENT_PORT=3100

# Start backend
(pnpm --filter ./apps/zed dev &)
# Start client (if present)
if [ -d ./apps/zed/client ]; then
  (pnpm --filter ./apps/zed/client dev &)
fi

# Wait for backend
for i in {1..14}; do
  if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null; then
    echo "ZED backend ready on port $BACKEND_PORT"
    break
  fi
  sleep 0.5
done

# Wait for client
if [ -d ./apps/zed/client ]; then
  for i in {1..14}; do
    if curl -s http://localhost:$CLIENT_PORT > /dev/null; then
      echo "ZED client ready on port $CLIENT_PORT"
      break
    fi
    sleep 0.5
  done
fi

echo "ZED is ready!"
