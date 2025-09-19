#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4000}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BIN_DIR="$ROOT_DIR/scripts/bin"
EXE="$BIN_DIR/cloudflared.exe"
LOG_FILE="$ROOT_DIR/.cloudflared-$PORT.log"
PID_FILE="$ROOT_DIR/.cloudflared-$PORT.pid"

mkdir -p "$BIN_DIR"
rm -f "$LOG_FILE" "$PID_FILE"

if [ ! -f "$EXE" ]; then
  echo "Downloading cloudflared..."
  URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$URL" -o "$EXE"
  elif command -v wget >/dev/null 2>&1; then
    wget -q "$URL" -O "$EXE"
  else
    echo "Please install curl or wget." >&2
    exit 1
  fi
fi

chmod +x "$EXE" || true
echo "Using cloudflared: $EXE"

"$EXE" tunnel --no-autoupdate --loglevel info --url "http://localhost:$PORT" --logfile "$LOG_FILE" &
CLOUDFLARED_PID=$!
echo "$CLOUDFLARED_PID" > "$PID_FILE"
echo "Started tunnel (PID=$CLOUDFLARED_PID) → http://localhost:$PORT"

# Try to extract the public URL from log
PUBLIC_URL=""
for i in $(seq 1 120); do
  if [ -f "$LOG_FILE" ]; then
    if grep -Eo 'https://[a-zA-Z0-9.-]*trycloudflare\.com' "$LOG_FILE" >/dev/null 2>&1; then
      PUBLIC_URL=$(grep -Eo 'https://[a-zA-Z0-9.-]*trycloudflare\.com' "$LOG_FILE" | head -n1)
      break
    fi
  fi
  sleep 0.5
done

if [ -n "$PUBLIC_URL" ]; then
  echo "Tunnel URL: $PUBLIC_URL"
else
  echo "Tunnel started. Tail log for URL: $LOG_FILE"
fi

exit 0


