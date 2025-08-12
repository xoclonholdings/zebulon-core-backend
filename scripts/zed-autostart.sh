#!/bin/bash

set -e

# 1. Start Zed backend (Zebulon Core) in background
echo "Starting Zed backend (Zebulon Core)..."
nohup node server-simple.cjs > /tmp/zed-backend.log 2>&1 &
sleep 3

# 2. Wait for backend health check (use PORT from .env or default 5000)
BACKEND_PORT=${PORT:-3001}
if [ -f .env ]; then
  ENV_PORT=$(grep '^PORT=' .env | cut -d '=' -f2)
  if [ ! -z "$ENV_PORT" ]; then
    BACKEND_PORT=$ENV_PORT
  fi
fi
echo "Waiting for Zed backend to be ready on port $BACKEND_PORT..."
for i in {1..20}; do
  if curl -s http://localhost:$BACKEND_PORT/health | grep 'ok' > /dev/null; then
    echo "Zed backend is up."
    break
  fi
  echo "...waiting ($i)"
  sleep 2
done

# 3. Start Ollama server (if not running)
if ! pgrep -f "ollama serve" > /dev/null; then
  echo "Starting Ollama server..."
  nohup ollama serve > /tmp/ollama.log 2>&1 &
  sleep 3
else
  echo "Ollama server already running."
fi

# 4. Pull required models
echo "Pulling Ollama models..."
ollama pull llama3

# 5. Run Playwright tests (set BASE_URL for correct backend port)
echo "Running Playwright tests..."
export BASE_URL=http://localhost:$BACKEND_PORT
npx playwright test tests/zed-functionality.spec.ts

# 6. Cleanup: (optional) kill backend after tests
# pkill -f "node server-simple.cjs"

echo "All steps completed."
