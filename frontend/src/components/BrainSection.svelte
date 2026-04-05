<!-- BrainSection.svelte - Real-time Brain Timeline -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import Badge from './common/Badge.svelte';
  import type { UiLanguage, BrainTimelineItem } from '../types';

  let { language, items, loading = false, expanded = false }: {
    language: UiLanguage;
    items: BrainTimelineItem[];
    loading?: boolean;
    expanded?: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  function formatTime(timestamp: string): string {
    if (!timestamp) return '';
    try {
      const d = new Date(timestamp);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch {
      return '';
    }
  }

  function getRoleBadge(role: string, kind: string) {
    if (role === 'user') return { status: 'warn' as const, label: 'User' };
    if (kind === 'tool_event') return { status: 'ok' as const, label: 'Tool' };
    if (kind === 'thinking') return { status: 'info' as const, label: 'Thinking' };
    return { status: 'ok' as const, label: role };
  }
</script>

<Card
  title={t('Brain', '智脑')}
  subtitle={t('Live conversations and thinking', '实时对话与思考')}
  class="brain-card {expanded ? 'expanded' : ''}"
  {loading}
>
  <div class="brain-timeline" style:max-height={expanded ? 'none' : '720px'}>
    {#if items.length === 0}
      <div class="empty-state">{t('No recent activity.', '暂无最近活动。')}</div>
    {:else}
      {#each items as item (item.timestamp + item.sessionKey)}
        <div class="brain-item" style:border-left-color={item.accent ?? '#8ad2ff'}>
          <div class="brain-item-header">
            <strong class="agent-name" style:color={item.accent ?? '#8ad2ff'}>
              {item.displayName ?? item.agentId ?? '?'}
            </strong>
            <span class="session-tag">{(item.sessionKey ?? '').split(':').pop()?.slice(-8)}</span>
            <Badge {...getRoleBadge(item.role, item.kind)} />
            <span class="timestamp">{formatTime(item.timestamp)}</span>
          </div>
          <div class="brain-item-content">
            {#if item.toolName}
              <div class="tool-meta">{item.toolName} {item.toolStatus}</div>
            {/if}
            <pre class="content-text">{item.content}</pre>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</Card>

<style>
  .brain-timeline {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .brain-item {
    padding: var(--space-sm) var(--space-md);
    border-left: 3px solid var(--accent);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    animation: slideUp 200ms ease-out;
    transition: background var(--transition-fast);
  }

  .brain-item:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .brain-item-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-xs);
  }

  .agent-name {
    font-size: var(--font-size-sm);
  }

  .session-tag {
    color: var(--text-muted);
    font-size: var(--font-size-xs);
    font-family: var(--font-mono);
  }

  .timestamp {
    margin-left: auto;
    color: var(--text-muted);
    font-size: var(--font-size-xs);
    font-family: var(--font-mono);
  }

  .brain-item-content {
    font-size: var(--font-size-sm);
    line-height: 1.6;
  }

  .tool-meta {
    color: var(--text-muted);
    font-size: var(--font-size-xs);
    margin-top: var(--space-xs);
  }

  .content-text {
    font-size: var(--font-size-xs);
    line-height: 1.5;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
    background: rgba(0, 0, 0, 0.2);
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    overflow-x: auto;
  }

  .empty-state {
    color: var(--text-muted);
    text-align: center;
    padding: var(--space-xl) 0;
    font-size: var(--font-size-sm);
  }
</style>
