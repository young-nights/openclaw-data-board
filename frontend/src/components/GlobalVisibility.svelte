<!-- GlobalVisibility.svelte - Global Status Overview -->
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

  const visibilityItems = [
    { key: 'schedule', icon: '⏰', en: 'Timed Jobs', zh: '定时任务', status: 'done' as const, value: 0 },
    { key: 'heartbeat', icon: '💓', en: 'Heartbeat', zh: '任务心跳', status: 'done' as const, value: 0 },
    { key: 'tasks', icon: '📋', en: 'Current Tasks', zh: '当前任务', status: 'not_done' as const, value: 0 },
    { key: 'tools', icon: '🔧', en: 'Tool Calls', zh: '工具调用', status: 'done' as const, value: 0 },
  ];
</script>

<Card
  title={t('Global Visibility', '全局总览')}
  subtitle={t('One place to see everything important', '一眼看四件事')}
  {loading}
>
  <div class="visibility-grid">
    {#each visibilityItems as item}
      <div class="visibility-card">
        <div class="visibility-head">
          <span class="visibility-icon">{item.icon}</span>
          <span class="visibility-label">{t(item.en, item.zh)}</span>
          <Badge status={item.status === 'done' ? 'ok' : 'warn'}
            label={item.status === 'done' ? t('Done', '已完成') : t('Not Done', '未完成')} />
        </div>
        <div class="visibility-body">
          <strong class="visibility-value">{item.value}</strong>
        </div>
      </div>
    {/each}
  </div>

  <div class="summary-row">
    <div class="summary-item">
      <span>{t('Done', '已完成')}</span>
      <div class="summary-bar">
        <div class="summary-fill ok" style="width: {3/4*100}%"></div>
      </div>
      <strong>3</strong>
    </div>
    <div class="summary-item">
      <span>{t('Not Done', '未完成')}</span>
      <div class="summary-bar">
        <div class="summary-fill warn" style="width: {1/4*100}%"></div>
      </div>
      <strong>1</strong>
    </div>
  </div>
</Card>

<style>
  .visibility-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }

  .visibility-card {
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    transition: all var(--transition-fast);
  }

  .visibility-card:hover {
    border-color: var(--border-active);
    transform: translateY(-1px);
  }

  .visibility-head {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
  }

  .visibility-icon {
    font-size: 1rem;
  }

  .visibility-label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    flex: 1;
  }

  .visibility-body {
    text-align: center;
  }

  .visibility-value {
    font-size: var(--font-size-2xl);
    font-family: var(--font-mono);
    color: var(--text-primary);
  }

  .summary-row {
    display: flex;
    gap: var(--space-lg);
    margin-top: var(--space-lg);
    padding-top: var(--space-md);
    border-top: 1px solid var(--border-color);
  }

  .summary-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--font-size-sm);
  }

  .summary-item span {
    color: var(--text-secondary);
    min-width: 60px;
  }

  .summary-item strong {
    color: var(--text-primary);
    font-family: var(--font-mono);
  }

  .summary-bar {
    flex: 1;
    height: 6px;
    background: var(--bg-input);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .summary-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width var(--transition-smooth);
  }

  .summary-fill.ok {
    background: var(--ok);
  }

  .summary-fill.warn {
    background: var(--warn);
  }
</style>
