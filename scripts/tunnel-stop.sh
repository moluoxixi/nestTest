#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4000}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$ROOT_DIR/.cloudflared-$PORT.pid"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE" || true)
  if [ -n "${PID:-}" ]; then
    echo "Stopping cloudflared PID=$PID"
    kill -9 "$PID" >/dev/null 2>&1 || true
  fi
  rm -f "$PID_FILE"
fi

# Fallback: try to kill any cloudflared if still running (WSL/git-bash may spawn differently)
pkill -f cloudflared >/dev/null 2>&1 || true

echo "Cloudflare Tunnel stopped for port $PORT."
exit 0


