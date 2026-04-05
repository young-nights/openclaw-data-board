<!-- OfficeSpace.svelte - Office Space Visualization -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import Badge from './common/Badge.svelte';
  import type { UiLanguage, AgentRunState } from '../types';

  let { language, loading = false }: {
    language: UiLanguage;
    loading?: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  const agents = [
    { id: 'main', name: '龙虾主管', animal: '🦞', accent: '#ff9966', status: 'idle' as AgentRunState, sessions: 0, tasks: 0 },
    { id: 'coder', name: '设计师', animal: '🐒', accent: '#f0a030', status: 'idle' as AgentRunState, sessions: 0, tasks: 0 },
    { id: 'secretary', name: '秘书', animal: '🦊', accent: '#ffb36e', status: 'idle' as AgentRunState, sessions: 0, tasks: 0 },
    { id: 'analyst', name: '产品分析员', animal: '🦉', accent: '#f4ccff', status: 'idle' as AgentRunState, sessions: 0, tasks: 0 },
    { id: 'evaluator', name: '评估员', animal: '🐻', accent: '#a4ffb0', status: 'idle' as AgentRunState, sessions: 0, tasks: 0 },
  ];

  function getStatusLabel(state: AgentRunState): string {
    const labels: Record<string, { en: string; zh: string }> = {
      idle: { en: 'Standby', zh: '待命' },
      running: { en: 'Running', zh: '执行中' },
      blocked: { en: 'Blocked', zh: '阻塞' },
      waiting_approval: { en: 'Waiting', zh: '待审批' },
      error: { en: 'Error', zh: '异常' },
    };
    const l = labels[state] ?? labels.idle;
    return language === 'zh' ? l.zh : l.en;
  }

  function getStatusBadge(state: AgentRunState): 'ok' | 'info' | 'warn' | 'blocked' {
    if (state === 'running') return 'ok';
    if (state === 'idle') return 'info';
    if (state === 'waiting_approval') return 'warn';
    return 'blocked';
  }
</script>

<Card
  title={t('Office Space', '办公室')}
  subtitle={t('Team status at a glance', '团队状态一览')}
  {loading}
>
  <div class="office-grid">
    {#each agents as agent}
      <div class="agent-card" style:border-color={agent.accent}33>
        <div class="agent-avatar" style:background={agent.accent}22>
          <span class="avatar-emoji">{agent.animal}</span>
        </div>
        <div class="agent-info">
          <strong>{agent.name}</strong>
          <div class="agent-meta">
            <Badge status={getStatusBadge(agent.status)} label={getStatusLabel(agent.status)} />
          </div>
          <div class="agent-stats">
            <span>{agent.sessions} {t('sessions', '会话')}</span>
            <span>·</span>
            <span>{agent.tasks} {t('tasks', '任务')}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</Card>

<style>
  .office-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--space-md);
  }

  .agent-card {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .agent-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .agent-avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .avatar-emoji {
    font-size: 1.5rem;
  }

  .agent-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .agent-info strong {
    font-size: var(--font-size-sm);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .agent-meta {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .agent-stats {
    display: flex;
    gap: var(--space-xs);
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }
</style>
