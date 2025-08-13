#!/usr/bin/env bash
set -euo pipefail

API_BASE="${1:-https://zebulon-backend-production.up.railway.app}"

echo "==> GET $API_BASE/health"
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/health" || true)
echo "Health HTTP: $HEALTH_CODE"

echo "==> POST $API_BASE/chat"
CHAT_OUT=$(curl -s -i "$API_BASE/chat" -H "Content-Type: application/json" -d '{"message":"Hello Zebulon"}' || true)
echo "---- /chat response ----"
echo "$CHAT_OUT"
echo "------------------------"

if [[ "$HEALTH_CODE" != "200" ]]; then
  echo "::FAIL:: /health not 200"
  exit 2
fi

if echo "$CHAT_OUT" | grep -qi "HTTP/.* 200"; then
  echo "::OK:: /chat returned 200"
  exit 0
fi

echo "::FAIL:: /chat not 200"
exit 3
