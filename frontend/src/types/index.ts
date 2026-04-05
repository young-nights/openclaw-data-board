// OpenClaw Data Board - Type Definitions

export type TaskState = 'todo' | 'in_progress' | 'blocked' | 'done';
export type AgentRunState = 'idle' | 'running' | 'blocked' | 'waiting_approval' | 'error';
export type ProjectState = 'active' | 'paused' | 'completed' | 'archived';
export type UiLanguage = 'en' | 'zh';
export type UiQuickFilter = 'all' | 'my' | 'due' | 'blocked' | 'today';

export interface TaskListItem {
  taskId: string;
  title: string;
  status: TaskState;
  owner: string;
  projectId: string;
  projectTitle: string;
  dueAt?: string;
  sessionKeys: string[];
}

export interface SessionSummary {
  sessionKey: string;
  label?: string;
  agentId?: string;
  state: AgentRunState;
  lastMessageAt?: string;
}

export interface SessionStatus {
  sessionKey: string;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  cost?: number;
  updatedAt?: string;
}

export interface ReadModelSnapshot {
  sessions: SessionSummary[];
  statuses: SessionStatus[];
  cronJobs: unknown[];
  approvals: unknown[];
  projects: unknown[];
  tasks: unknown[];
  budgetSummary?: BudgetSummary;
  generatedAt: string;
}

export interface BudgetSummary {
  used: number;
  limit: number;
  ratio: number;
}

export interface InformationCertaintySignal {
  key: string;
  label: string;
  status: 'connected' | 'partial' | 'not_connected';
  detail: string;
}

export interface InformationCertaintyModel {
  score: number;
  badgeStatus: 'ok' | 'warn' | 'blocked';
  badgeLabel: string;
  headline: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  signals: InformationCertaintySignal[];
}

export interface TaskCertaintyCard {
  taskId: string;
  title: string;
  projectTitle: string;
  owner: string;
  score: number;
  tone: 'ok' | 'warn' | 'blocked';
  toneLabel: string;
  summary: string;
  evidence: string[];
  gaps: string[];
  detailHref: string;
}

export interface BrainSession {
  agentId: string;
  sessionKey: string;
  sessionLabel: string;
  state: AgentRunState;
  model: string;
  lastMessageAt: string;
  latestSnippet: string;
  latestRole: string;
}

export interface BrainTimelineItem {
  sessionKey: string;
  sessionLabel: string;
  agentId: string;
  sessionState: AgentRunState;
  accent: string;
  displayName: string;
  roleLabel: string;
  role: string;
  content: string;
  timestamp: string;
  kind: string;
  toolName: string;
  toolStatus: string;
}

export interface GlobalVisibilityTask {
  taskType: 'cron' | 'heartbeat' | 'current_task' | 'tool_call';
  taskTypeLabel: string;
  taskName: string;
  executor: string;
  currentAction: string;
  nextRun: string;
  latestResult: string;
  status: 'done' | 'not_done';
  nextAction: string;
  detailsHref: string;
  detailsLabel: string;
}

export interface GlobalVisibilityModel {
  tasks: GlobalVisibilityTask[];
  doneCount: number;
  notDoneCount: number;
  noTaskMessage: string;
  signalCounts: {
    schedule: number;
    heartbeat: number;
    currentTasks: number;
    toolCalls: number;
  };
}

export interface UiPreferences {
  language: UiLanguage;
  compactStatusStrip: boolean;
  quickFilter: UiQuickFilter;
  taskFilters: {
    status?: TaskState;
    owner?: string;
    project?: string;
  };
  updatedAt: string;
}

export interface ConnectionHealthItem {
  label: string;
  status: 'ok' | 'info' | 'warn' | 'blocked';
  detail: string;
  value: string;
}

export interface UsageCostSnapshot {
  connectors: {
    modelContextCatalog: string;
    digestHistory: string;
    requestCounts: string;
    budgetLimit: string;
    providerAttribution: string;
    subscriptionUsage: string;
  };
  contextWindows: Array<{
    sessionKey: string;
    sessionLabel: string;
    agentId: string;
    model: string;
    usedTokens: number;
    contextLimitTokens?: number;
    usagePercent?: number;
    thresholdState: string;
    paceLabel: string;
  }>;
  subscription: {
    status: string;
  };
}
