<!-- ConnectionHealth.svelte - Connection Health Overview -->
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

  const connections = [
    { key: 'gateway', en: 'Gateway', zh: '网关', status: 'connected' as const, value: 'Connected', detail: 'WebSocket 127.0.0.1:18789' },
    { key: 'config', en: 'Config', zh: '配置', status: 'connected' as const, value: 'Ready', detail: 'openclaw.json 已就绪' },
    { key: 'runtime', en: 'Runtime', zh: '运行时', status: 'connected' as const, value: '2 sessions', detail: '2 个会话可见' },
    { key: 'usage', en: 'Usage Sources', zh: '用量数据', status: 'partial' as const, value: 'Partial', detail: '差 1 项：订阅快照' },
  ];
</script>

<Card
  title={t('Connection Health', '接线状态')}
  subtitle={t('Data source connectivity', '数据源连接状态')}
  {loading}
>
  <div class="connection-list">
    {#each connections as conn}
      <div class="connection-row">
        <div class="connection-info">
          <strong>{t(conn.en, conn.zh)}</strong>
          <small>{conn.detail}</small>
        </div>
        <div class="connection-status">
          <Badge status={conn.status} label={conn.value} />
        </div>
      </div>
    {/each}
  </div>

  <div class="connection-summary">
    <div class="summary-stat">
      <span>{t('Healthy', '已接通')}</span>
      <strong>{connections.filter(c => c.status === 'connected').length}/{connections.length}</strong>
    </div>
    <a href="/?section=settings" class="btn-secondary">{t('Open Settings', '查看设置')}</a>
  </div>
</Card>

<style>
  .connection-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .connection-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--border-color);
  }

  .connection-row:last-child {
    border-bottom: none;
  }

  .connection-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .connection-info strong {
    font-size: var(--font-size-sm);
  }

  .connection-info small {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  .connection-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--space-md);
    padding-top: var(--space-md);
    border-top: 1px solid var(--border-color);
  }

  .summary-stat {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--font-size-sm);
  }

  .summary-stat span {
    color: var(--text-secondary);
  }

  .summary-stat strong {
    font-family: var(--font-mono);
    color: var(--ok);
  }

  .btn-secondary {
    font-size: var(--font-size-xs);
    color: var(--accent);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    background: var(--accent-soft);
    transition: all var(--transition-fast);
  }

  .btn-secondary:hover {
    background: rgba(138, 210, 255, 0.25);
  }
</style>
