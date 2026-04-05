<!-- ActivityPage.svelte - OpenRouter-style Activity Dashboard -->
<script lang="ts">
  import MetricCard from './MetricCard.svelte';
  import DetailPanel from './DetailPanel.svelte';
  import type { UiLanguage } from '../types';

  let { language }: {
    language: UiLanguage;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  // Time range state
  let timeRange = $state<'1h' | '1d' | '7d' | '1m' | '1y'>('7d');
  let groupBy = $state<'model' | 'key' | 'provider'>('model');
  let detailView = $state<'spend' | 'requests' | 'tokens' | null>(null);
  let lastUpdated = $state(new Date());

  const timeRanges = [
    { key: '1h' as const, label: '1 Hour' },
    { key: '1d' as const, label: '1 Day' },
    { key: '7d' as const, label: '7 Days' },
    { key: '1m' as const, label: '1 Month' },
    { key: '1y' as const, label: '1 Year' },
  ];

  const groupOptions = [
    { key: 'model' as const, label: t('By Model', '按模型') },
    { key: 'key' as const, label: t('By API Key', '按 API Key') },
    { key: 'provider' as const, label: t('By Provider', '按供应商') },
  ];

  // Summary data
  const summary = {
    totalSpend: '$1.40',
    spendSubtitle: t('Today $0.19 · This month $1.40', '今日 $0.19 · 本月 $1.40'),
    totalRequests: '418',
    requestsSubtitle: t('Including 12 chatroom sessions', '含 12 个聊天会话'),
    totalTokens: '136.5K',
    tokensSubtitle: t('Prompt 89.2K · Completion 42.1K · Reasoning 5.2K', '输入 89.2K · 输出 42.1K · 推理 5.2K'),
  };

  function handleRefresh() {
    lastUpdated = new Date();
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function openDetail(view: 'spend' | 'requests' | 'tokens') {
    detailView = detailView === view ? null : view;
  }
</script>

<div class="activity-page">
  <!-- Top Bar -->
  <div class="page-header">
    <div class="header-left">
      <h2 class="page-title">
        <span class="title-icon">📊</span>
        {t('Activity', '活动')}
      </h2>
    </div>
    <div class="header-controls">
      <!-- Time Range -->
      <div class="control-group">
        {#each timeRanges as tr}
          <button
            class="control-btn"
            class:active={timeRange === tr.key}
            onclick={() => timeRange = tr.key}
          >
            {tr.label}
          </button>
        {/each}
      </div>

      <!-- Group By -->
      <select class="select-control" bind:value={groupBy}>
        {#each groupOptions as opt}
          <option value={opt.key}>{opt.label}</option>
        {/each}
      </select>

      <!-- Export -->
      <button class="export-btn" title={t('Export CSV', '导出 CSV')}>
        📥 CSV
      </button>
    </div>
  </div>

  <!-- Metric Cards -->
  <div class="metrics-row">
    <MetricCard
      title={t('Total Spend', '总花费')}
      value={summary.totalSpend}
      subtitle={summary.spendSubtitle}
      color="spend"
      icon="💰"
      onClick={() => openDetail('spend')}
    />
    <MetricCard
      title={t('Total Requests', '总请求数')}
      value={summary.totalRequests}
      subtitle={summary.requestsSubtitle}
      color="requests"
      icon="📊"
      onClick={() => openDetail('requests')}
    />
    <MetricCard
      title={t('Total Tokens', '总 Token')}
      value={summary.totalTokens}
      subtitle={summary.tokensSubtitle}
      color="tokens"
      icon="🔢"
      onClick={() => openDetail('tokens')}
    />
  </div>

  <!-- Detail Panel (expandable) -->
  {#if detailView}
    <div class="detail-section">
      <DetailPanel
        viewType={detailView}
        {language}
        onClose={() => detailView = null}
      />
    </div>
  {/if}

  <!-- Footer -->
  <div class="page-footer">
    <span class="footer-note">
      {t('Logs have moved to the Logs page', '日志已移至日志页面')}
    </span>
    <div class="footer-actions">
      <span class="last-updated">
        {t('Updated', '更新于')} {formatTime(lastUpdated)}
      </span>
      <button class="refresh-btn" onclick={handleRefresh}>
        🔄 {t('Refresh', '刷新')}
      </button>
    </div>
  </div>
</div>

<style>
  .activity-page {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Header */
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .page-title {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .title-icon {
    font-size: 1.5rem;
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .control-group {
    display: flex;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 2px;
  }

  .control-btn {
    padding: 6px 12px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: var(--font-size-xs);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    white-space: nowrap;
  }

  .control-btn:hover {
    color: var(--text-primary);
  }

  .control-btn.active {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .select-control {
    padding: 6px 12px;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: var(--font-size-xs);
    border-radius: var(--radius-md);
    cursor: pointer;
    outline: none;
  }

  .select-control:focus {
    border-color: var(--border-active);
  }

  .export-btn {
    padding: 6px 12px;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: var(--font-size-xs);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .export-btn:hover {
    border-color: var(--border-active);
    color: var(--text-primary);
  }

  /* Metrics Row */
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  @media (max-width: 900px) {
    .metrics-row {
      grid-template-columns: 1fr;
    }
  }

  /* Detail Section */
  .detail-section {
    margin-bottom: var(--space-xl);
  }

  /* Footer */
  .page-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--space-lg);
    border-top: 1px solid var(--border-color);
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .footer-note {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .last-updated {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    font-family: var(--font-mono);
  }

  .refresh-btn {
    padding: 4px 12px;
    border: 1px solid var(--border-color);
    background: var(--bg-input);
    color: var(--text-secondary);
    font-size: var(--font-size-xs);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .refresh-btn:hover {
    border-color: var(--border-active);
    color: var(--text-primary);
  }
</style>
