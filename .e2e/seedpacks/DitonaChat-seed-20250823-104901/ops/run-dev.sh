#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Install deps if node_modules missing (optional)
[ -d node_modules ] || pnpm install || npm install
pnpm exec next dev -p 3001
