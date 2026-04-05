<!-- ContextPressure.svelte - Context Window Pressure -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import Badge from './common/Badge.svelte';
  import type { UiLanguage } from '../types';

  let { language, loading = false }: {
    language: UiLanguage;
    loading?: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  // Mock data - will be replaced with API data
  const sessions: Array<{
    sessionKey: string;
    label: string;
    agentId: string;
    model: string;
    usedTokens: number;
    contextLimit?: number;
    usagePercent?: number;
    thresholdState: string;
  }> = [];

  function getThresholdBadge(state: string) {
    if (state === 'critical') return { status: 'warn' as const, label: t('Critical', '临界') };
    if (state === 'warn') return { status: 'info' as const, label: t('Warning', '预警') };
    if (state === 'ok') return { status: 'ok' as const, label: t('Healthy', '正常') };
    return { status: 'blocked' as const, label: t('Unknown', '未知') };
  }

  function formatTokens(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  }
</script>

<Card
  title={t('Context Pressure', '上下文压力')}
  subtitle={t('Session context window usage', '会话上下文窗口使用率')}
  {loading}
>
  {#if sessions.length === 0}
    <div class="empty-state">{t('No session context data yet.', '当前还没有会话上下文数据。')}</div>
  {:else}
    <div class="context-list">
      {#each sessions as session}
        {@const badge = getThresholdBadge(session.thresholdState)}
        <div class="context-row">
          <div class="session-info">
            <strong>{session.label}</strong>
            <small>{session.agentId} · {session.model}</small>
          </div>
          <div class="context-meter">
            <div class="meter-track">
              <div
                class="meter-fill"
                class:ok={session.thresholdState === 'ok'}
                class:warn={session.thresholdState === 'warn'}
                class:critical={session.thresholdState === 'critical'}
                style="width: {session.usagePercent ?? 0}%"
              ></div>
            </div>
            <span class="meter-label">
              {formatTokens(session.usedTokens)} / {session.contextLimit ? formatTokens(session.contextLimit) : '-'}
            </span>
          </div>
          <Badge status={badge.status} label={badge.label} />
        </div>
      {/each}
    </div>
  {/if}
</Card>

<style>
  .empty-state {
    color: var(--text-muted);
    text-align: center;
    padding: var(--space-xl) 0;
    font-size: var(--font-size-sm);
  }

  .context-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .context-row {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--border-color);
  }

  .context-row:last-child {
    border-bottom: none;
  }

  .session-info {
    min-width: 150px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .session-info strong {
    font-size: var(--font-size-sm);
  }

  .session-info small {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  .context-meter {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .meter-track {
    flex: 1;
    height: 8px;
    background: var(--bg-input);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .meter-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width var(--transition-smooth);
  }

  .meter-fill.ok { background: var(--ok); }
  .meter-fill.warn { background: var(--warn); }
  .meter-fill.critical { background: var(--danger); }

  .meter-label {
    font-size: var(--font-size-xs);
    font-family: var(--font-mono);
    color: var(--text-secondary);
    min-width: 80px;
    text-align: right;
  }
</style>
