#!/usr/bin/env bash
set -euo pipefail
API_BASE="https://zed-backend-production.up.railway.app"
MSG="${1:-Hello Zed}"
curl -i "$API_BASE/chat" -H "Content-Type: application/json" -d "{\"message\":\"$MSG\"}"
