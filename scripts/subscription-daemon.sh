#!/bin/bash
# Auto-refresh OpenRouter subscription snapshot every 5 minutes
# No agent tokens consumed - pure shell daemon
INTERVAL=300
LOG="/tmp/subscription-refresh.log"

TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
echo "$TS - Subscription refresh daemon started (interval: ${INTERVAL}s)" >> "$LOG"

while true; do
  bash /home/node/.openclaw/workspace/tools/openclaw-control-center/scripts/refresh-subscription.sh >> "$LOG" 2>&1
  sleep "$INTERVAL"
done
