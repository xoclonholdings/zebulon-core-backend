#!/bin/bash
# Start Zebulon Core, ZED, and Ollama as fully independent processes

# Start Ollama AI backend (if needed)
if ! pgrep -f "ollama serve" > /dev/null; then
  echo "Starting Ollama AI backend..."
  ollama serve &
  sleep 2
fi

# Start Zebulon Core backend
if [ -f ./apps/zebulon-core/dist/server.js ]; then
  echo "Starting Zebulon Core backend (prod build)..."
  node ./apps/zebulon-core/dist/server.js &
else
  echo "Starting Zebulon Core backend (dev)..."
  pnpm --filter ./apps/zebulon-core dev &
fi
sleep 2

# Start ZED backend
if [ -f ./apps/zed/dist/server/index.js ]; then
  echo "Starting ZED backend (prod build)..."
  node ./apps/zed/dist/server/index.js &
else
  echo "Starting ZED backend (dev)..."
  pnpm --filter ./apps/zed dev &
fi
sleep 2

# Start client (main UI)
echo "Starting Zebulon client (main UI)..."
pnpm --filter ./client dev &

wait
