#!/usr/bin/env bash
set -euo pipefail
cd /home/runner/workspace/ditonachat-clean/DitonaChat
TS="$(date +%Y%m%d-%H%M%S)"; OPS="_ops"; LOG="$OPS/logs/22B_GIT_BOOTSTRAP_AND_PUSH_$TS.log"
mkdir -p "$OPS/logs"; exec > >(tee -a "$LOG") 2>&1
echo "== 22B_GIT_BOOTSTRAP_AND_PUSH =="

: "${GITHUB_URL:?Provide GITHUB_URL=https://github.com/<USER>/<REPO>.git}"
echo "Repository URL: $GITHUB_URL"
echo "PWD=$(pwd)"

# init / branch
[ -d .git ] || { git init && echo "Initialized Git repo"; }
git checkout -B main >/dev/null 2>&1 || git branch -M main

# initial commit if needed
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  [ -f .gitignore ] || cat > .gitignore <<EOF
node_modules/
.next/
.DS_Store
_ops/logs/
_ops/backups/
EOF
  git add -A
  git commit -m "init: DitonaChat MVP"
fi

# remote setup
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$GITHUB_URL"; echo "Updated remote origin."
else
  git remote add origin "$GITHUB_URL"; echo "Added remote origin."
fi

# push
echo "Pushing to origin main..."
if git push -u origin main; then
  echo "✅ Push OK"
else
  echo "⚠️ Push failed. Check GitHub auth (HTTPS login or PAT)."
fi

# state + gate
echo "-- git state --"; git remote -v | sed "s/^/remote: /"; git rev-parse --abbrev-ref HEAD | sed "s/^/branch: /"
echo "— dev age gate hit"; curl -sS -I http://localhost:3000/api/age/allow | head -n 3 || true
echo "Log: $LOG"
