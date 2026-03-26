#!/bin/bash
# Watchdog: check Control Center every 30s, restart if non-200
# Zero token consumption - pure shell
INTERVAL=60
LOG="/tmp/watchdog.log"

TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
echo "$TS - Watchdog daemon started (interval: ${INTERVAL}s)" >> "$LOG"

while true; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4310/ 2>/dev/null)
  if [ "$CODE" != "200" ]; then
    TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    echo "$TS - Panel returned $CODE, restarting..." >> "$LOG"
    pkill -f "openclaw-control-center" 2>/dev/null
    sleep 2
    cd /home/node/.openclaw/workspace/tools/openclaw-control-center && setsid npm run dev:ui </dev/null > /tmp/control-center.log 2>&1 &
    sleep 3
    NEW_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4310/ 2>/dev/null)
    TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    echo "$TS - After restart: $NEW_CODE" >> "$LOG"
  fi
  sleep "$INTERVAL"
done
