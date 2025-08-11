#!/usr/bin/env bash
# zebulon-dev.sh: Start Zebulon stack in correct order with health checks and error handling
set -euo pipefail

# 1. Start Ollama AI backend (if not running)
OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"
echo "[ZEBULON] Checking Ollama backend at $OLLAMA_URL..."
if ! curl -sf "$OLLAMA_URL/api/chat" >/dev/null; then
  if command -v ollama &>/dev/null; then
    echo "[ZEBULON] Starting Ollama backend..."
    ollama serve &
    OLLAMA_PID=$!
    # Wait for Ollama to be ready
    for i in {1..20}; do
      if curl -sf "$OLLAMA_URL/api/chat" >/dev/null; then
        echo "[ZEBULON] Ollama backend is up."
        break
      fi
      sleep 1
    done
    if ! curl -sf "$OLLAMA_URL/api/chat" >/dev/null; then
      echo "[ERROR] Ollama backend failed to start. Exiting." >&2
      exit 1
    fi
  else
    echo "[ERROR] Ollama is not installed or not in PATH. Exiting." >&2
    exit 1
  fi
else
  echo "[ZEBULON] Ollama backend already running."
fi

# 2. Build @zebulon/ai if needed
if [ ! -f ./packages/ai/dist/ollama.js ]; then
  echo "[ZEBULON] Building @zebulon/ai..."
  pnpm --filter @zebulon/ai run build
fi

# 3. Build Zebulon Core if needed
if [ ! -f ./apps/zebulon-core/dist/server.js ]; then
  echo "[ZEBULON] Building Zebulon Core..."
  pnpm --filter ./apps/zebulon-core run build
fi

# 4. Start Zebulon Core backend
ZEBULON_PORT=${PORT:-5000}
echo "[ZEBULON] Starting Zebulon Core backend on port $ZEBULON_PORT..."
node ./apps/zebulon-core/dist/server.js &
ZEBULON_PID=$!
# Wait for Zebulon Core to be ready
for i in {1..20}; do
  if curl -sf "http://localhost:$ZEBULON_PORT/health" >/dev/null; then
    echo "[ZEBULON] Zebulon Core backend is up."
    break
  fi
  sleep 1
done
if ! curl -sf "http://localhost:$ZEBULON_PORT/health" >/dev/null; then
  echo "[ERROR] Zebulon Core backend failed to start. Exiting." >&2
  kill $ZEBULON_PID || true
  exit 1
fi

# 5. Start client (Homeview/tiles)
echo "[ZEBULON] Starting client UI..."
pnpm --filter ./client dev &
CLIENT_PID=$!

# 6. Wait for all background jobs
wait $ZEBULON_PID $CLIENT_PID
