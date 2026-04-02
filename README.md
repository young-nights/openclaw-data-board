# OpenClaw Data Board

> **English** | [中文](README.zh-CN.md)

Turn OpenClaw from a black box into a local dashboard you can see, trust, and control.

## What is this

A **local-first observability and control center** for OpenClaw. It connects to your running OpenClaw Gateway and presents agent sessions, tasks, usage, memory, and security status in a single web UI — no data leaves your machine.

**Core value:**
- One place to see whether OpenClaw is healthy, busy, blocked, or drifting
- Built for operators who need observability and certainty, not raw backend payloads
- Safety-first defaults: read-only, local token auth, mutations disabled

## Feature overview

### 📊 Overview
The main operating screen. Shows system health, pending action items, runtime issues, stalled runs, budget risk, who is active, and what needs attention first. Best for answering: *"Is OpenClaw okay right now?"*

### 💰 Usage & Cost
Today / 7-day / 30-day usage and spend trends. Includes subscription windows, quota consumption, usage mix (direct vs cron), context pressure indicators, and data connector status. Best for: *"Are we burning too fast?"*

### 👥 Staff (Team)
Who is truly working now versus who only has queued tasks. Separates live execution from "next up" so backlog is never confused with active work. Agent identity cards include avatars, roles, recent output, and schedule state.

### 🤝 Collaboration
Parent-child session relays and verified cross-session agent communication (e.g. `Main ⇄ Pandas`) in one view. Shows who accepted work first, who delegated, and which session is holding the next move.

### 🧠 Memory
A source-backed workbench for daily and long-term memory files. Scoped to active agents from `openclaw.json` — deleted agents don't clutter the view. Includes a health indicator per agent (usable / searchable / needs attention).

### 📄 Documents
View and edit shared docs (`AGENTS.md`, `SOUL.md`, `USER.md`, etc.) and per-agent core files directly from the dashboard. Reads and writes to the real source files.

### ✅ Tasks & Projects
Task board, schedule, approvals, execution chains, and runtime evidence in one section. Distinguishes planned work from actual execution, highlights blocked items, and surfaces what needs operator review.

### 🔁 Replay & Audit
Timeline of operation audit entries (exports, imports, ack prunes, task heartbeats) with severity filtering. Session drilldowns with full message history.

### ⚙️ Settings
Connection health card, security risk summary, update status, and data-link expectations. Tells you exactly what is wired, what is partial, and which high-risk actions are intentionally disabled.

## Screenshots

> **Note:** Screenshots below are from the running dashboard at `http://127.0.0.1:<PORT>/?section=<name>`.
> To generate fresh screenshots, run `node scripts/take-screenshots.cjs` (requires Playwright browser deps).

| Section | Description |
|---------|-------------|
| ![](docs/assets/overview.png) | **Overview** — health, sessions, alerts, and operator summary |
| ![](docs/assets/usage-cost.png) | **Usage & Cost** — token spend, quota windows, context pressure |
| ![](docs/assets/team.png) | **Staff** — active agents, recent output, schedule state |
| ![](docs/assets/collaboration.png) | **Collaboration** — parent-child relays, cross-session messages |
| ![](docs/assets/memory.png) | **Memory** — daily/long-term files, agent memory health |
| ![](docs/assets/projects-tasks.png) | **Tasks** — task board, approvals, execution chains |
| ![](docs/assets/settings.png) | **Settings** — connection health, security, update status |
| ![](docs/assets/replay-audit.png) | **Replay & Audit** — operation timeline, session drilldowns |

## Deployment constraints

> ⚠️ **Read this section before deploying.** These are hard requirements, not suggestions.

### Runtime requirements

| Dependency | Version | Check command |
|-----------|---------|---------------|
| **Node.js** | ≥ 22.0.0 | `node --version` |
| **npm** | ≥ 9.0.0 | `npm --version` |
| **OpenClaw CLI** | ≥ 2026.4.0 | `openclaw --version` |
| **OpenClaw Gateway** | running & reachable | `openclaw gateway status` |

### System requirements

| Resource | Minimum | Notes |
|----------|---------|-------|
| **OS** | Linux / macOS / WSL2+Ubuntu | Windows native is not tested |
| **RAM** | 256 MB free | Node process + browser rendering |
| **Disk** | 50 MB | Source + runtime artifacts |
| **Network** | localhost only | UI binds to `127.0.0.1` by default |
| **Ports** | `4310` (UI), `18789` (Gateway) | Both must be free or explicitly configured |

### Security constraints (mandatory)

These defaults are **intentional** and should not be changed without understanding the implications:

| Setting | Default | Why |
|---------|---------|-----|
| `READONLY_MODE` | `true` | Prevents any mutation through the dashboard |
| `LOCAL_TOKEN_AUTH_REQUIRED` | `true` | All protected routes require `x-local-token` header |
| `APPROVAL_ACTIONS_ENABLED` | `false` | Approval mutations are hard-gated off |
| `APPROVAL_ACTIONS_DRY_RUN` | `true` | Even if enabled, defaults to dry-run |
| `IMPORT_MUTATION_ENABLED` | `false` | Live import is disabled |
| `IMPORT_MUTATION_DRY_RUN` | `false` | Import dry-run is disabled |
| `UI_MODE` | `false` | Must be explicitly set to `true` to start the web UI |

### What the dashboard will NOT do

- ❌ Does **not** modify `~/.openclaw/openclaw.json` or any OpenClaw config
- ❌ Does **not** send data to external services
- ❌ Does **not** fabricate API keys, tokens, or credentials
- ❌ Does **not** require a GPT/Codex subscription (Usage panels degrade gracefully)
- ❌ Does **not** assume default agent names (reads from runtime config)

### Graceful degradation

If certain data sources are missing, the dashboard still works — specific panels show "not connected" instead of crashing:

| Missing source | Affected panels | Behavior |
|---------------|-----------------|----------|
| `~/.codex` | Usage, Subscription | Shows "not available" placeholders |
| Subscription snapshot | Subscription card | Shows connector TODO |
| Provider API keys | Usage data | Shows disconnected state |
| Live Gateway unreachable | All live data | Falls back to cached snapshot |

## Quick start

```bash
git clone https://github.com/young-nights/openclaw-data-board.git
cd openclaw-data-board
npm install
cp .env.example .env
npm run build
npm test
npm run smoke:ui
npm run dev:ui
```

Then open: **http://127.0.0.1:4310/?section=overview&lang=en**

### Environment variables reference

| Variable | Default | Description |
|----------|---------|-------------|
| `GATEWAY_URL` | `ws://127.0.0.1:18789` | OpenClaw Gateway WebSocket URL |
| `UI_PORT` | `4310` | Dashboard HTTP port |
| `UI_BIND_ADDRESS` | `127.0.0.1` | Bind address (change to `0.0.0.0` for remote access) |
| `READONLY_MODE` | `true` | Read-only mode |
| `LOCAL_TOKEN_AUTH_REQUIRED` | `true` | Require local token for protected routes |
| `LOCAL_API_TOKEN` | *(empty)* | Set explicitly to enable protected commands |
| `OPENCLAW_HOME` | `~/.openclaw` | OpenClaw home directory |
| `OPENCLAW_CONFIG_PATH` | `~/.openclaw/openclaw.json` | Config file path |
| `OPENCLAW_WORKSPACE_ROOT` | *(auto-detected)* | Workspace root directory |
| `OPENCLAW_AGENT_ROOT` | *(auto)* | Current agent workspace |
| `CODEX_HOME` | *(optional)* | Codex/GPT home directory |
| `OPENCLAW_SUBSCRIPTION_SNAPSHOT_PATH` | *(optional)* | Subscription snapshot file |

## CLI commands

```bash
# Backup export
APP_COMMAND=backup-export LOCAL_API_TOKEN=<token> npm run command:backup-export

# Import validation (dry-run)
APP_COMMAND=import-validate COMMAND_ARG=path/to/file.json LOCAL_API_TOKEN=<token> npm run command:import-validate

# Prune stale acks
APP_COMMAND=acks-prune LOCAL_API_TOKEN=<token> npm run command:acks-prune

# Task heartbeat
APP_COMMAND=task-heartbeat LOCAL_API_TOKEN=<token> npm run command:task-heartbeat
```

## Architecture

```
src/
├── index.ts                 # Entry point, CLI command router
├── config.ts                # Environment variable parsing
├── types.ts                 # Shared type definitions
├── adapters/
│   └── openclaw-readonly.ts # Read-only adapter over OpenClaw Gateway
├── clients/
│   ├── factory.ts           # Tool client factory
│   ├── openclaw-live-client.ts
│   └── tool-client.ts
├── mappers/
│   ├── openclaw-mappers.ts  # Session → summary mapping
│   └── session-status-parser.ts
├── runtime/                 # Business logic modules
│   ├── monitor.ts           # Main monitoring loop
│   ├── usage-cost.ts        # Usage & cost computation
│   ├── task-store.ts        # Task CRUD
│   ├── project-store.ts     # Project CRUD
│   ├── session-conversations.ts # Session history & chains
│   ├── agent-roster.ts      # Agent discovery
│   ├── notification-center.ts # Action queue & acks
│   ├── export-bundle.ts     # Backup/export logic
│   ├── openclaw-cli-insights.ts # CLI health/security/memory
│   └── ...                  # 30+ more modules
└── ui/
    └── server.ts            # HTTP server, all routes, HTML rendering
```

## What this is NOT

- Not a replacement for OpenClaw itself
- Not a generic dashboard for non-OpenClaw agent stacks
- Not a hosted SaaS control plane

## License

MIT
