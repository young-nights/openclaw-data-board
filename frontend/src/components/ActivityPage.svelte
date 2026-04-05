<!-- ActivityPage.svelte - OpenRouter-style Activity Dashboard -->
<script lang="ts">
  import MetricCard from './MetricCard.svelte';
  import DetailPanel from './DetailPanel.svelte';
  import type { UiLanguage } from '../types';

  let { language }: { language: UiLanguage } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  let timeRange = $state<'1h' | '1d' | '7d' | '1m' | '1y'>('7d');
  let groupBy = $state<'model' | 'key' | 'provider'>('model');
  let detailView = $state<'spend' | 'requests' | 'tokens' | null>(null);
  let lastUpdated = $state(new Date());
  let showTimeMenu = $state(false);
  let showFilterMenu = $state(false);

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

  // Filter state
  let selectedModels = $state<Set<string>>(new Set(['MiMo-V2-Pro', 'DeepSeek V3', 'MiMo-V2-Omni']));
  let selectedKeys = $state<Set<string>>(new Set(['All API Keys']));

  const availableModels = ['MiMo-V2-Pro', 'DeepSeek V3', 'MiMo-V2-Omni', 'Qwen3-235B'];
  const availableKeys = ['All API Keys', 'sk-...a1b2', 'sk-...c3d4'];

  function toggleModel(m: string) {
    const s = new Set(selectedModels);
    s.has(m) ? s.delete(m) : s.add(m);
    selectedModels = s;
  }

  function toggleKey(k: string) {
    if (k === 'All API Keys') {
      selectedKeys = new Set(['All API Keys']);
    } else {
      const s = new Set(selectedKeys);
      s.delete('All API Keys');
      s.has(k) ? s.delete(k) : s.add(k);
      if (s.size === 0) s.add('All API Keys');
      selectedKeys = s;
    }
  }

  function clearFilters() {
    selectedModels = new Set(availableModels);
    selectedKeys = new Set(['All API Keys']);
  }

  const activeFilterCount = $derived(
    (selectedModels.size < availableModels.length ? 1 : 0) +
    (!selectedKeys.has('All API Keys') ? 1 : 0)
  );

  // Dynamic model data
  const allModels = [
    { name: 'MiMo-V2-Pro', color: '#f5a623', spend: 0.0679, requests: 6030, tokens: 608000000 },
    { name: 'DeepSeek V3', color: '#3ecf8e', spend: 0.00552, requests: 2, tokens: 11000 },
    { name: 'MiMo-V2-Omni', color: '#7c9aff', spend: 0, requests: 507, tokens: 25200000 },
  ];

  function formatNum(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    if (n < 0.01) return n.toFixed(4);
    return String(n);
  }

  const spendModels = $derived(allModels.filter(m => m.spend > 0 && selectedModels.has(m.name)).map(m => ({ name: m.name, value: formatNum(m.spend), color: m.color })));
  const requestsModels = $derived(allModels.filter(m => m.requests > 0 && selectedModels.has(m.name)).map(m => ({ name: m.name, value: formatNum(m.requests), color: m.color })));
  const tokensModels = $derived(allModels.filter(m => m.tokens > 0 && selectedModels.has(m.name)).map(m => ({ name: m.name, value: formatNum(m.tokens), color: m.color })));

  // Mini chart data - adapts to time range
  // 1h: 12 points (5min intervals), 1d: 24 points (hourly), 7d: 7 points (daily), 1m: 30 points (daily), 1y: 12 points (monthly)
  function genMiniData(spike: number, spikeIdx: number, points: number): number[] {
    return Array.from({ length: points }, (_, i) => {
      const dist = Math.abs(i - spikeIdx);
      if (dist > 5) return Math.round(spike * 0.08 * (0.3 + Math.random() * 0.7));
      if (dist > 2) return Math.round(spike * 0.08 * (1 + (5 - dist) * 0.3));
      if (dist <= 2 && i === spikeIdx) return spike;
      return Math.round(spike * (0.15 + Math.random() * 0.25));
    });
  }

  function getPointCount(range: string): number {
    if (range === '1h') return 12;
    if (range === '1d') return 24;
    if (range === '7d') return 7;
    if (range === '1m') return 30;
    return 12; // 1y
  }

  const pointCount = $derived(getPointCount(timeRange));
  const hasData = $derived(timeRange !== '1h'); // 1h = no data for demo

  const spendChartData = $derived(hasData ? genMiniData(8, Math.floor(pointCount * 0.7), pointCount) : Array(pointCount).fill(0));
  const requestsChartData = $derived(hasData ? genMiniData(350, Math.floor(pointCount * 0.7), pointCount) : Array(pointCount).fill(0));
  const tokensChartData = $derived(hasData ? genMiniData(65000, Math.floor(pointCount * 0.7), pointCount) : Array(pointCount).fill(0));

  // X-axis labels based on time range
  function getXLabels(range: string): string[] {
    if (range === '1h') return Array.from({ length: 12 }, (_, i) => `${i * 5}m`);
    if (range === '1d') return Array.from({ length: 24 }, (_, i) => `${i}:00`);
    if (range === '7d') {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(2026, 3, 1 + i);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
    }
    if (range === '1m') {
      return Array.from({ length: 30 }, (_, i) => {
        const d = new Date(2026, 2, 6 + i);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
    }
    // 1y
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  const xLabels = $derived(getXLabels(timeRange));

  function handleRefresh() { lastUpdated = new Date(); }
  function formatTime(date: Date): string {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  function openDetail(view: 'spend' | 'requests' | 'tokens') {
    detailView = detailView === view ? null : view;
  }

  function closeMenus(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.time-dropdown') && !target.closest('.filter-dropdown')) {
      showTimeMenu = false;
      showFilterMenu = false;
    }
  }
</script>

<svelte:window onclick={closeMenus} />

<div class="activity-page">
  <!-- Top Bar -->
  <div class="page-header">
    <h2 class="page-title">Activity</h2>
    <div class="header-controls">
      <!-- Group By -->
      <select class="select-control" bind:value={groupBy}>
        {#each groupOptions as opt}
          <option value={opt.key}>{opt.label}</option>
        {/each}
      </select>

      <!-- Time Range Dropdown -->
      <div class="dropdown-wrap time-dropdown">
        <button class="dropdown-trigger" onclick={() => { showTimeMenu = !showTimeMenu; showFilterMenu = false; }}>
          {timeRanges.find(r => r.key === timeRange)?.label ?? '7 Days'}
          <span class="chevron" class:open={showTimeMenu}>▾</span>
        </button>
        {#if showTimeMenu}
          <div class="dropdown-menu fade-in">
            {#each timeRanges as tr}
              <button
                class="dropdown-item"
                class:active={timeRange === tr.key}
                onclick={() => { timeRange = tr.key; showTimeMenu = false; }}
              >
                {tr.label}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Filter Dropdown -->
      <div class="dropdown-wrap filter-dropdown">
        <button class="dropdown-trigger filter-trigger" onclick={() => { showFilterMenu = !showFilterMenu; showTimeMenu = false; }}>
          <span class="filter-icon">🔍</span>
          {t('Filters', '筛选')}
          {#if activeFilterCount > 0}
            <span class="filter-badge">{activeFilterCount}</span>
          {/if}
          <span class="chevron" class:open={showFilterMenu}>▾</span>
        </button>
        {#if showFilterMenu}
          <div class="dropdown-menu filter-menu fade-in">
            <!-- Models Section -->
            <div class="filter-section">
              <div class="filter-section-title">{t('Models', '模型')}</div>
              {#each availableModels as model}
                <label class="filter-option">
                  <input type="checkbox" checked={selectedModels.has(model)} onchange={() => toggleModel(model)} />
                  <span>{model}</span>
                </label>
              {/each}
            </div>

            <!-- API Keys Section -->
            <div class="filter-section">
              <div class="filter-section-title">API Keys</div>
              {#each availableKeys as key}
                <label class="filter-option">
                  <input type="radio" name="apikey" checked={selectedKeys.has(key)} onchange={() => toggleKey(key)} />
                  <span>{key}</span>
                </label>
              {/each}
            </div>

            <button class="clear-btn" onclick={clearFilters}>{t('Clear All', '清除全部')}</button>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Three Metric Cards -->
  <div class="metrics-row">
    <MetricCard title="Spend" value="$0.0735" subtitle="" color="spend" icon="💰"
      chartData={spendChartData} modelBreakdown={spendModels} onClick={() => openDetail('spend')} />
    <MetricCard title="Requests" value="7K" subtitle="" color="requests" icon="📊"
      chartData={requestsChartData} modelBreakdown={requestsModels} onClick={() => openDetail('requests')} />
    <MetricCard title="Tokens" value="633M" subtitle="" color="tokens" icon="🔢"
      chartData={tokensChartData} modelBreakdown={tokensModels} onClick={() => openDetail('tokens')} />
  </div>

  <!-- Detail Overlay -->
  {#if detailView}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="detail-overlay" onclick={(e) => { if ((e.target as HTMLElement).classList.contains('detail-overlay')) detailView = null; }}>
      <DetailPanel viewType={detailView} {language} {timeRange} onClose={() => detailView = null} />
    </div>
  {/if}

  <!-- Footer -->
  <div class="page-footer">
    <span class="footer-note">{t('Logs have moved', '日志已迁移')} <a href="#logs">{t('Your API request logs now have their own dedicated page.', 'API 请求日志已有专属页面。')}</a></span>
    <div class="footer-actions">
      <span class="last-updated">{formatTime(lastUpdated)}</span>
      <button class="refresh-btn" onclick={handleRefresh}>↻</button>
    </div>
  </div>
</div>

<style>
  .activity-page { max-width: 1400px; margin: 0 auto; width: 100%; }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px;
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
    gap: 10px;
  }

  .select-control {
    padding: 7px 14px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #374151;
    font-size: 13px;
    border-radius: 10px;
    cursor: pointer;
    outline: none;
  }

  /* Dropdown */
  .dropdown-wrap {
    position: relative;
  }

  .dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #374151;
    font-size: 13px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 120ms;
    white-space: nowrap;
  }

  .dropdown-trigger:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  .filter-trigger {
    gap: 8px;
  }

  .filter-icon {
    font-size: 12px;
  }

  .filter-badge {
    background: #3b82f6;
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }

  .chevron {
    font-size: 11px;
    color: #9ca3af;
    transition: transform 200ms;
    display: inline-block;
  }

  .chevron.open {
    transform: rotate(180deg);
  }

  /* Dropdown Menu - fade in/out */
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 6px;
    min-width: 160px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    z-index: 100;
  }

  .filter-menu {
    min-width: 240px;
    padding: 12px;
  }

  .dropdown-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 8px 12px;
    border: none;
    background: transparent;
    color: #374151;
    font-size: 13px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 120ms;
  }

  .dropdown-item:hover {
    background: #f3f4f6;
  }

  .dropdown-item.active {
    background: #eff6ff;
    color: #2563eb;
    font-weight: 500;
  }

  /* Filter sections */
  .filter-section {
    margin-bottom: 16px;
  }

  .filter-section:last-of-type {
    margin-bottom: 12px;
  }

  .filter-section-title {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 4px;
    font-size: 13px;
    color: #374151;
    cursor: pointer;
    border-radius: 6px;
    transition: background 120ms;
  }

  .filter-option:hover {
    background: #f3f4f6;
  }

  .filter-option input {
    accent-color: #3b82f6;
    width: 15px;
    height: 15px;
  }

  .clear-btn {
    width: 100%;
    padding: 8px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #374151;
    font-size: 13px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 120ms;
  }

  .clear-btn:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  /* Fade animation */
  .fade-in {
    animation: fadeIn 150ms ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Metrics Row */
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 28px;
    max-width: 1400px;
  }

  @media (max-width: 900px) {
    .metrics-row { grid-template-columns: 1fr; }
  }

  /* Detail Overlay */
  .detail-overlay {
    position: fixed;
    inset: 0;
    background: #ffffff;
    z-index: 100;
    overflow-y: auto;
    padding: 40px;
    animation: fadeIn 200ms ease-out;
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

  .footer-note { font-size: 13px; color: #9ca3af; }
  .footer-link { color: #6b7280; text-decoration: underline; margin-left: 4px; }

  .footer-actions { display: flex; align-items: center; gap: 12px; }
  .last-updated { font-size: 12px; color: #9ca3af; font-family: 'SF Mono', monospace; }

  .refresh-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #6b7280;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .refresh-btn:hover { border-color: #d1d5db; color: #111827; }
</style>
