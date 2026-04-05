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
  let detailView = $state<'spend' | 'requests' | 'tokens' | null>(null);
  let lastUpdated = $state(new Date());
  let showTimeMenu = $state(false);
  let showFilterMenu = $state(false);

  // Filter state
  let expandedSection = $state<'models' | 'keys' | null>(null);
  let modelSearch = $state('');
  let keySearch = $state('');
  let selectedModels = $state<Set<string>>(new Set(['MiMo-V2-Pro', 'DeepSeek V3', 'MiMo-V2-Omni']));
  let selectedKeys = $state<Set<string>>(new Set(['All API Keys']));

  const timeRanges = [
    { key: '1h' as const, label: '1 Hour' },
    { key: '1d' as const, label: '1 Day' },
    { key: '7d' as const, label: '7 Days' },
    { key: '1m' as const, label: '1 Month' },
    { key: '1y' as const, label: '1 Year' },
  ];

  // Dynamic model data
  const allModels = [
    { name: 'MiMo-V2-Pro', color: '#f5a623', spend: 0.0679, requests: 6030, tokens: 608000000 },
    { name: 'DeepSeek V3', color: '#3ecf8e', spend: 0.00552, requests: 2, tokens: 11000 },
    { name: 'MiMo-V2-Omni', color: '#7c9aff', spend: 0, requests: 507, tokens: 25200000 },
  ];

  const allKeys = [
    { name: 'openclaw-desktop', key: 'sk-...a1b2', requests: 4520 },
    { name: 'openclaw-server', key: 'sk-...c3d4', requests: 2017 },
  ];

  const filteredModels = $derived(
    allModels.filter(m => m.name.toLowerCase().includes(modelSearch.toLowerCase()))
  );

  const filteredKeys = $derived(
    allKeys.filter(k => k.name.toLowerCase().includes(keySearch.toLowerCase()) || k.key.toLowerCase().includes(keySearch.toLowerCase()))
  );

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

  const activeFilterCount = $derived(
    (selectedModels.size < allModels.length ? 1 : 0) +
    (!selectedKeys.has('All API Keys') ? 1 : 0)
  );

  function formatNum(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    if (n < 0.01) return n.toFixed(4);
    return String(n);
  }

  const spendModels = $derived(allModels.filter(m => m.spend > 0 && selectedModels.has(m.name)).map(m => ({ name: m.name, value: formatNum(m.spend), color: m.color })));
  const requestsModels = $derived(allModels.filter(m => m.requests > 0 && selectedModels.has(m.name)).map(m => ({ name: m.name, value: formatNum(m.requests), color: m.color })));
  const tokensModels = $derived(allModels.filter(m => m.tokens > 0 && selectedModels.has(m.name)).map(m => ({ name: m.name, value: formatNum(m.tokens), color: m.color })));

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
    return 12;
  }

  const pointCount = $derived(getPointCount(timeRange));
  const hasData = $derived(timeRange !== '1h');

  const spendChartData = $derived(hasData ? genMiniData(8, Math.floor(pointCount * 0.7), pointCount) : Array(pointCount).fill(0));
  const requestsChartData = $derived(hasData ? genMiniData(350, Math.floor(pointCount * 0.7), pointCount) : Array(pointCount).fill(0));
  const tokensChartData = $derived(hasData ? genMiniData(65000, Math.floor(pointCount * 0.7), pointCount) : Array(pointCount).fill(0));

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
  <div class="page-header">
    <h2 class="page-title">Activity</h2>
    <div class="header-controls">
      <!-- Time Range Dropdown -->
      <div class="dropdown-wrap time-dropdown">
        <button class="dropdown-trigger" onclick={() => { showTimeMenu = !showTimeMenu; showFilterMenu = false; }}>
          {timeRanges.find(r => r.key === timeRange)?.label ?? '7 Days'}
          <span class="chevron" class:open={showTimeMenu}>▾</span>
        </button>
        {#if showTimeMenu}
          <div class="dropdown-menu fade-in">
            {#each timeRanges as tr}
              <button class="dropdown-item" class:active={timeRange === tr.key} onclick={() => { timeRange = tr.key; showTimeMenu = false; }}>
                {tr.label}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Filter Dropdown - Accordion Style -->
      <div class="dropdown-wrap filter-dropdown">
        <button class="dropdown-trigger filter-trigger" onclick={() => { showFilterMenu = !showFilterMenu; showTimeMenu = false; expandedSection = null; }}>
          <span class="filter-icon">🔍</span>
          {t('Filters', '筛选')}
          {#if activeFilterCount > 0}
            <span class="filter-badge">{activeFilterCount}</span>
          {/if}
          <span class="chevron" class:open={showFilterMenu}>▾</span>
        </button>
        {#if showFilterMenu}
          <div class="dropdown-menu accordion-menu fade-in">
            <!-- Models Section -->
            <div class="accordion-section">
              <button class="accordion-header" onclick={() => expandedSection = expandedSection === 'models' ? null : 'models'}>
                <span>{t('Models', '模型')}</span>
                <span class="chevron" class:open={expandedSection === 'models'}>▸</span>
              </button>
              {#if expandedSection === 'models'}
                <div class="accordion-body fade-in">
                  <input type="text" class="search-input" placeholder={t('Search models', '搜索模型')} bind:value={modelSearch} />
                  <div class="filter-list">
                    {#each filteredModels as model}
                      <label class="filter-option">
                        <input type="checkbox" checked={selectedModels.has(model.name)} onchange={() => toggleModel(model.name)} />
                        <span class="model-color-dot" style="background: {model.color}"></span>
                        <span>{model.name}</span>
                      </label>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>

            <!-- API Keys Section -->
            <div class="accordion-section">
              <button class="accordion-header" onclick={() => expandedSection = expandedSection === 'keys' ? null : 'keys'}>
                <span>API Keys</span>
                <span class="chevron" class:open={expandedSection === 'keys'}>▸</span>
              </button>
              {#if expandedSection === 'keys'}
                <div class="accordion-body fade-in">
                  <input type="text" class="search-input" placeholder={t('Search API keys', '搜索 API Key')} bind:value={keySearch} />
                  <div class="filter-list">
                    <label class="filter-option">
                      <input type="radio" name="apikey" checked={selectedKeys.has('All API Keys')} onchange={() => toggleKey('All API Keys')} />
                      <span>{t('All API Keys', '全部 API Key')}</span>
                    </label>
                    {#each filteredKeys as key}
                      <label class="filter-option">
                        <input type="radio" name="apikey" checked={selectedKeys.has(key.key)} onchange={() => toggleKey(key.key)} />
                        <span class="key-icon">🔑</span>
                        <span>{key.name} <span class="key-value">{key.key}</span></span>
                      </label>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
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

  {#if detailView}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="detail-overlay" onclick={(e) => { if ((e.target as HTMLElement).classList.contains('detail-overlay')) detailView = null; }}>
      <DetailPanel viewType={detailView} {language} {timeRange} onClose={() => detailView = null} />
    </div>
  {/if}

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
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
  }

  .page-title { font-size: 24px; font-weight: 600; margin: 0; color: #111827; letter-spacing: -0.01em; }

  .header-controls { display: flex; align-items: center; gap: 10px; }

  /* Dropdown */
  .dropdown-wrap { position: relative; }

  .dropdown-trigger {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border: 1px solid #e5e7eb; background: #ffffff;
    color: #374151; font-size: 13px; border-radius: 10px;
    cursor: pointer; transition: all 120ms; white-space: nowrap;
  }

  .dropdown-trigger:hover { border-color: #d1d5db; background: #f9fafb; }

  .filter-trigger { gap: 8px; }
  .filter-icon { font-size: 12px; }

  .filter-badge {
    background: #3b82f6; color: white; font-size: 11px; font-weight: 600;
    padding: 1px 6px; border-radius: 10px; min-width: 18px; text-align: center;
  }

  .chevron { font-size: 11px; color: #9ca3af; transition: transform 200ms; display: inline-block; }
  .chevron.open { transform: rotate(180deg); }

  /* Dropdown Menu */
  .dropdown-menu {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); z-index: 100;
  }

  .accordion-menu { padding: 8px; min-width: 280px; }

  .dropdown-item {
    display: block; width: 100%; text-align: left;
    padding: 8px 12px; border: none; background: transparent;
    color: #374151; font-size: 13px; border-radius: 8px;
    cursor: pointer; transition: background 120ms;
  }

  .dropdown-item:hover { background: #f3f4f6; }
  .dropdown-item.active { background: #eff6ff; color: #2563eb; font-weight: 500; }

  /* Accordion */
  .accordion-section {
    border-bottom: 1px solid #f3f4f6;
  }

  .accordion-section:last-child { border-bottom: none; }

  .accordion-header {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 10px 8px; border: none; background: transparent;
    color: #111827; font-size: 14px; font-weight: 600;
    cursor: pointer; border-radius: 8px; transition: background 120ms;
  }

  .accordion-header:hover { background: #f9fafb; }

  .accordion-header .chevron { transform: rotate(0deg); transition: transform 200ms; }
  .accordion-header .chevron.open { transform: rotate(90deg); }

  .accordion-body { padding: 4px 8px 12px; }

  .search-input {
    width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb;
    border-radius: 8px; font-size: 13px; color: #374151;
    outline: none; margin-bottom: 8px; box-sizing: border-box;
  }

  .search-input:focus { border-color: #3b82f6; }

  .filter-list { display: flex; flex-direction: column; gap: 2px; max-height: 200px; overflow-y: auto; }

  .filter-option {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 4px; font-size: 13px; color: #374151;
    cursor: pointer; border-radius: 6px; transition: background 120ms;
  }

  .filter-option:hover { background: #f3f4f6; }
  .filter-option input { accent-color: #3b82f6; width: 15px; height: 15px; }

  .model-color-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .key-icon { font-size: 12px; }
  .key-value { color: #9ca3af; font-family: 'SF Mono', monospace; font-size: 11px; }

  /* Fade */
  .fade-in { animation: fadeIn 150ms ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

  /* Metrics Row */
  .metrics-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 24px; margin-bottom: 28px; max-width: 1400px;
  }

  @media (max-width: 900px) { .metrics-row { grid-template-columns: 1fr; } }

  /* Detail Overlay */
  .detail-overlay {
    position: fixed; inset: 0; background: #ffffff; z-index: 100;
    overflow-y: auto; padding: 40px; animation: fadeIn 200ms ease-out;
  }

  /* Footer */
  .page-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 20px; flex-wrap: wrap; gap: 12px;
  }

  .footer-note { font-size: 13px; color: #9ca3af; }
  .footer-link { color: #6b7280; text-decoration: underline; margin-left: 4px; }
  .footer-actions { display: flex; align-items: center; gap: 12px; }
  .last-updated { font-size: 12px; color: #9ca3af; font-family: 'SF Mono', monospace; }

  .refresh-btn {
    width: 32px; height: 32px; border: 1px solid #e5e7eb;
    background: #ffffff; color: #6b7280; border-radius: 8px;
    cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
  }

  .refresh-btn:hover { border-color: #d1d5db; color: #111827; }
</style>
