#!/usr/bin/env bash
set -euo pipefail
BASE="http://127.0.0.1:3001"
sleep 2
for p in /home /settings /api/health /api/subscription/status; do
  printf "%-32s -> %s\n" "$p" "$(curl -fsS -o /dev/null -w '%{http_code}' "$BASE$p")"
done
printf "GET  /api/stripe/webhook -> %s\n"  "$(curl -fsS -o /dev/null -w '%{http_code}' -X GET  "$BASE/api/stripe/webhook" || true)"
printf "POST /api/stripe/webhook -> %s\n"  "$(curl -fsS -o /dev/null -w '%{http_code}' -X POST -H 'content-type: application/json' --data '{}' "$BASE/api/stripe/webhook" || true)"
printf "/chat (ageok=1)        -> %s\n"    "$(curl -fsS -o /dev/null -w '%{http_code}' -H 'Cookie: ageok=1' "$BASE/chat")"
