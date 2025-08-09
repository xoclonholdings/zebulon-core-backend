#!/usr/bin/env bash
set -euo pipefail

API_BASE="${1:-$PROD_API_BASE}"

if [ -z "$API_BASE" ]; then
  echo "Usage: ./scripts/prod-check.sh https://<your-railway-domain>"
  exit 1
fi

echo "==> Checking /health at $API_BASE/health"
HTTP_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/health" || true)
echo "Health status: $HTTP_HEALTH"

echo "==> Hitting /chat"
CHAT_RESP=$(curl -s -i "$API_BASE/chat" \
  -H "Content-Type: application/json" \
  --data '{"message":"Hello Zed"}' || true)

echo "---- /chat response ----"
echo "$CHAT_RESP"
echo "------------------------"

if [[ "$HTTP_HEALTH" != "200" ]]; then
  echo "::FAIL:: /health not 200"
  exit 2
fi

if echo "$CHAT_RESP" | grep -qi "HTTP/.* 200"; then
  echo "::OK:: /chat returned 200"
  exit 0
fi

echo "::FAIL:: /chat not 200"
exit 3
