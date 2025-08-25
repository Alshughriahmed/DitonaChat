#!/usr/bin/env bash
set -euo pipefail
DITONA_ROOT="${DITONA_ROOT:-/home/runner/workspace/ditonachat-clean/DitonaChat}"
[ -d "$DITONA_ROOT" ] || DITONA_ROOT="/workspace/ditonachat-clean/DitonaChat"
cd "$DITONA_ROOT"
: "${DEPLOY_URL:?Set DEPLOY_URL, e.g. DEPLOY_URL=https://your-app.vercel.app bash 20C_POSTDEPLOY_SMOKE_INLINE.sh}"
TS="$(date +%Y%m%d-%H%M%S)"; OPS="_ops"; LOG="$OPS/logs/20C_POSTDEPLOY_SMOKE_INLINE_$TS.log"
mkdir -p "$OPS/logs"; exec > >(tee -a "$LOG") 2>&1
echo "== 20C_POSTDEPLOY_SMOKE_INLINE =="; echo "Target: $DEPLOY_URL"
ok=1; need(){ echo "❌ $1"; ok=0; }
curl -sS -I "$DEPLOY_URL" | head -n 5 || need "HEAD / failed"
for p in / /home /chat /settings /legal/privacy /legal/terms ; do code=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL$p" || true); printf "%-24s -> %s\n" "$p" "$code"; done
TURN_JSON="$(curl -s "$DEPLOY_URL/api/turn" || true)"; echo "$TURN_JSON" | grep -q '"ttl":\s*300' || need "/api/turn missing ttl=300"; echo "$TURN_JSON" | grep -qi "stun" || need "/api/turn missing STUN server"
HOME_HTML="$(curl -s "$DEPLOY_URL/home" || true)"; echo "$HOME_HTML" | grep -qi "DitonaChat" || need "Home title not found"; echo "$HOME_HTML" | grep -qi "/api/age/allow" || need "Home CTA not found"; echo "$HOME_HTML" | grep -qi "/legal/privacy" || need "Privacy link not found"
echo "— dev age gate hit"; curl -sS -I "http://localhost:3000/api/age/allow" | head -n 3 || true
if [ "$ok" -eq 1 ]; then echo "✅ 20C_POSTDEPLOY_SMOKE_INLINE: OK"; else echo "❌ 20C_POSTDEPLOY_SMOKE_INLINE: FAILED — see $LOG"; exit 1; fi
echo "Log: $LOG"
