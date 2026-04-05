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

  // Mock data matching OpenRouter style
  const spendChartData = [0.01, 0.005, 0.02, 0.015, 0.08, 0.06, 0.07];
  const requestsChartData = [120, 80, 200, 150, 350, 280, 310];
  const tokensChartData = [15000, 8000, 25000, 18000, 65000, 48000, 55000];

  const spendModels = [
    { name: 'MiMo-V2-Pro', value: '0.0679', color: '#f5a623' },
    { name: 'DeepSeek V3', value: '0.00552', color: '#3ecf8e' },
    { name: 'MiMo-V2-Omni', value: '0', color: '#7c9aff' },
  ];

  const requestsModels = [
    { name: 'MiMo-V2-Pro', value: '6.03K', color: '#00d4aa' },
    { name: 'MiMo-V2-Omni', value: '507', color: '#7c9aff' },
    { name: 'DeepSeek V3', value: '2', color: '#f5a623' },
  ];

  const tokensModels = [
    { name: 'MiMo-V2-Pro', value: '608M', color: '#00d4aa' },
    { name: 'MiMo-V2-Omni', value: '25.2M', color: '#7c9aff' },
    { name: 'DeepSeek V3', value: '11K', color: '#f5a623' },
  ];

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
      <h2 class="page-title">Activity</h2>
    </div>
    <div class="header-controls">
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

      <select class="select-control" bind:value={groupBy}>
        {#each groupOptions as opt}
          <option value={opt.key}>{opt.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Three Metric Cards -->
  <div class="metrics-row">
    <MetricCard
      title="Spend"
      value="$0.0735"
      subtitle=""
      color="spend"
      icon="💰"
      chartData={spendChartData}
      modelBreakdown={spendModels}
      onClick={() => openDetail('spend')}
    />
    <MetricCard
      title="Requests"
      value="7K"
      subtitle=""
      color="requests"
      icon="📊"
      chartData={requestsChartData}
      modelBreakdown={requestsModels}
      onClick={() => openDetail('requests')}
    />
    <MetricCard
      title="Tokens"
      value="633M"
      subtitle=""
      color="tokens"
      icon="🔢"
      chartData={tokensChartData}
      modelBreakdown={tokensModels}
      onClick={() => openDetail('tokens')}
    />
  </div>

  <!-- Detail Overlay (full page) -->
  {#if detailView}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="detail-overlay" onclick={(e) => { if ((e.target as HTMLElement).classList.contains('detail-overlay')) detailView = null; }}>
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
      {t('Logs have moved', '日志已迁移')}
      <a href="#logs" class="footer-link">{t('Your API request logs now have their own dedicated page.', 'API 请求日志已有专属页面。')}</a>
    </span>
    <div class="footer-actions">
      <span class="last-updated">{formatTime(lastUpdated)}</span>
      <button class="refresh-btn" onclick={handleRefresh}>↻</button>
    </div>
  </div>
</div>

<style>
  .activity-page {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .page-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: #111827;
    letter-spacing: -0.01em;
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .control-group {
    display: flex;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 3px;
  }

  .control-btn {
    padding: 6px 14px;
    border: none;
    background: transparent;
    color: #6b7280;
    font-size: 13px;
    border-radius: 7px;
    cursor: pointer;
    transition: all 120ms;
    white-space: nowrap;
  }

  .control-btn:hover {
    color: #111827;
  }

  .control-btn.active {
    background: #f3f4f6;
    color: #111827;
    font-weight: 500;
  }

  .select-control {
    padding: 6px 12px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #374151;
    font-size: 13px;
    border-radius: 10px;
    cursor: pointer;
    outline: none;
  }

  .select-control:focus {
    border-color: #3b82f6;
  }

  /* Metrics Row */
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 900px) {
    .metrics-row {
      grid-template-columns: 1fr;
    }
  }

  /* Detail Overlay - full page */
  .detail-overlay {
    position: fixed;
    inset: 0;
    background: #ffffff;
    z-index: 100;
    overflow-y: auto;
    padding: 40px;
    animation: fadeIn 200ms ease-out;
  }

  @media (max-width: 900px) {
    .detail-overlay {
      padding: 20px;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Footer */
  .page-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .footer-note {
    font-size: 13px;
    color: #9ca3af;
  }

  .footer-link {
    color: #6b7280;
    text-decoration: underline;
    margin-left: 4px;
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .last-updated {
    font-size: 12px;
    color: #9ca3af;
    font-family: 'SF Mono', monospace;
  }

  .refresh-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #6b7280;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: all 120ms;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .refresh-btn:hover {
    border-color: #d1d5db;
    color: #111827;
  }
</style>
