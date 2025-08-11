#!/bin/bash
# Zebulon Core quickstart: start backend and client in parallel, wait for both to be ready

BACKEND_PORT=$(grep PORT ./apps/zebulon-core/.env | cut -d '=' -f2 | tr -d '\r')
CLIENT_PORT=3000

# Start backend
(pnpm --filter ./apps/zebulon-core dev &) 
# Start client
(pnpm --filter ./client dev &)

# Wait for backend
for i in {1..14}; do
  if curl -s http://localhost:$BACKEND_PORT/health > /dev/null; then
    echo "Zebulon Core backend ready on port $BACKEND_PORT"
    break
  fi
  sleep 0.5
done

# Wait for client
for i in {1..14}; do
  if curl -s http://localhost:$CLIENT_PORT > /dev/null; then
    echo "Zebulon Core client ready on port $CLIENT_PORT"
    break
  fi
  sleep 0.5
done

echo "Zebulon Core is ready!"
