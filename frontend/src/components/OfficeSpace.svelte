<!-- OfficeSpace.svelte - Office Space Visualization with Avatar Customization -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import Badge from './common/Badge.svelte';
  import AvatarSelector from './common/AvatarSelector.svelte';
  import type { UiLanguage, AgentRunState } from '../types';

  let { language, loading = false }: {
    language: UiLanguage;
    loading?: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  // Agent data with customizable avatars
  let agents = $state([
    { id: 'main', name: '龙虾主管', avatar: '🦞', accent: '#ff9966', status: 'idle' as AgentRunState, sessions: 2, tasks: 0 },
    { id: 'coder', name: '设计师', avatar: '🐒', accent: '#f0a030', status: 'idle' as AgentRunState, sessions: 0, tasks: 0 },
    { id: 'secretary', name: '秘书', avatar: '🦊', accent: '#ffb36e', status: 'idle' as AgentRunState, sessions: 0, tasks: 0 },
    { id: 'analyst', name: '产品分析员', avatar: '🦉', accent: '#f4ccff', status: 'idle' as AgentRunState, sessions: 0, tasks: 0 },
    { id: 'evaluator', name: '评估员', avatar: '🐻', accent: '#a4ffb0', status: 'idle' as AgentRunState, sessions: 0, tasks: 0 },
  ]);

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

  function handleAvatarChange(agentId: string, newAvatar: string) {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      agent.avatar = newAvatar;
    }
  }
</script>

<Card
  title={t('Office Space', '办公室')}
  subtitle={t('Team status at a glance · Click avatar to customize', '团队状态一览 · 点击头像可自定义')}
  {loading}
>
  <div class="office-grid">
    {#each agents as agent (agent.id)}
      <div class="agent-card" style:border-color={agent.accent + '33'}>
        <AvatarSelector
          currentAvatar={agent.avatar}
          agentId={agent.id}
          onSelect={(emoji) => handleAvatarChange(agent.id, emoji)}
        />
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
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
    border-color: var(--border-active);
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
