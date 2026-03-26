#!/bin/bash
# Refresh OpenRouter subscription snapshot for Control Center
OPENROUTER_KEY=$(cat ~/.openclaw/agents/main/agent/auth-profiles.json 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['profiles']['openrouter:default']['key'])" 2>/dev/null)
if [ -z "$OPENROUTER_KEY" ]; then
  echo "ERROR: OpenRouter API key not found"
  exit 1
fi

DATA=$(curl -s "https://openrouter.ai/api/v1/auth/key" \
  -H "Authorization: Bearer $OPENROUTER_KEY")

if [ -z "$DATA" ]; then
  echo "ERROR: Empty response from OpenRouter"
  exit 1
fi

python3 -c "
import json, sys, datetime
raw = json.loads('''$DATA''')
d = raw['data']
now = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
snapshot = {
    'meta': {'source': 'openrouter_api', 'fetchedAt': now, 'provider': 'openrouter'},
    'plan': {'name': 'OpenRouter (Free Tier)' if d.get('is_free_tier') else 'OpenRouter'},
    'subscription': {
        'used': d.get('usage', 0),
        'limit': d.get('limit', 0),
        'remaining': d.get('limit_remaining', 0),
        'unit': 'USD', 'currency': 'USD'
    },
    'billingCycle': {'start': now[:10] + 'T00:00:00Z', 'end': None, 'resetAt': d.get('limit_reset')},
    'usage': {
        'daily': d.get('usage_daily', 0),
        'weekly': d.get('usage_weekly', 0),
        'monthly': d.get('usage_monthly', 0)
    }
}
targets = [
    '/home/node/.openclaw/workspace/tools/openclaw-control-center/runtime/subscription-snapshot.json',
    '/home/node/.openclaw/subscription-snapshot.json'
]
for p in targets:
    with open(p, 'w') as f:
        json.dump(snapshot, f, indent=2)
print(f'OK: {d.get(\"usage\",0):.4f} used / {d.get(\"limit_remaining\",0):.4f} remaining')
" 2>&1
