<!-- DetailPanel.svelte - Drill-down Detail View with Chart + Table -->
<script lang="ts">
  import type { UiLanguage } from '../types';

  let { viewType, language, onClose }: {
    viewType: 'spend' | 'requests' | 'tokens';
    language: UiLanguage;
    onClose: () => void;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  // Token sub-type filter (for tokens view)
  let tokenFilter = $state<'total' | 'prompt' | 'completion' | 'reasoning' | 'cached'>('total');

  // Sort state
  let sortKey = $state<string>('sum');
  let sortAsc = $state(false);

  const config = {
    spend: {
      title: t('Spend Details', '花费详情'),
      icon: '💰',
      color: '#f5a623',
      unit: '$',
      yLabel: t('Amount ($)', '金额 ($)'),
    },
    requests: {
      title: t('Requests Details', '请求数详情'),
      icon: '📊',
      color: '#3ecf8e',
      unit: '',
      yLabel: t('Requests', '请求数'),
    },
    tokens: {
      title: t('Token Usage Details', 'Token 用量详情'),
      icon: '🔢',
      color: '#7c9aff',
      unit: '',
      yLabel: t('Tokens', 'Token 数'),
    },
  };

  const cfg = $derived(config[viewType]);

  // Mock data for bar chart (last 7 days)
  const chartData = [
    { label: '03/30', spend: 0.18, requests: 45, tokens: 12800 },
    { label: '03/31', spend: 0.22, requests: 52, tokens: 15200 },
    { label: '04/01', spend: 0.15, requests: 38, tokens: 11000 },
    { label: '04/02', spend: 0.28, requests: 65, tokens: 18500 },
    { label: '04/03', spend: 0.31, requests: 72, tokens: 21000 },
    { label: '04/04', spend: 0.25, requests: 58, tokens: 16800 },
    { label: '04/05', spend: 0.19, requests: 42, tokens: 12200 },
  ];

  function getChartValue(item: typeof chartData[number]): number {
    if (viewType === 'spend') return item.spend;
    if (viewType === 'requests') return item.requests;
    return item.tokens;
  }

  const maxChartValue = $derived(Math.max(...chartData.map(getChartValue)));

  // Mock model breakdown table data
  let tableData = $state([
    { model: 'xiaomi/mimo-v2-pro', color: '#7c9aff', min: 0.01, max: 0.08, avg: 0.04, sum: 0.85, requests: 245, tokens: 52000 },
    { model: 'xiaomi/mimo-v2-flash', color: '#a78bfa', min: 0.002, max: 0.01, avg: 0.005, sum: 0.12, requests: 89, tokens: 18500 },
    { model: 'deepseek/deepseek-chat', color: '#3ecf8e', min: 0.005, max: 0.03, avg: 0.015, sum: 0.28, requests: 67, tokens: 14200 },
    { model: 'qwen/qwen3-30b-a3b', color: '#f5a623', min: 0.003, max: 0.02, avg: 0.008, sum: 0.15, requests: 42, tokens: 9800 },
  ]);

  function handleSort(key: string) {
    if (sortKey === key) {
      sortAsc = !sortAsc;
    } else {
      sortKey = key;
      sortAsc = false;
    }
    tableData = [...tableData].sort((a: any, b: any) => {
      const av = a[key] ?? 0;
      const bv = b[key] ?? 0;
      return sortAsc ? av - bv : bv - av;
    });
  }

  function exportCSV() {
    const headers = ['Model', 'Min', 'Max', 'Avg', 'Sum', 'Requests', 'Tokens'];
    const rows = tableData.map(r => [r.model, r.min, r.max, r.avg, r.sum, r.requests, r.tokens]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-${viewType}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tokenFilters = [
    { key: 'total' as const, label: t('Total', '总计') },
    { key: 'prompt' as const, label: t('Prompt', '输入') },
    { key: 'completion' as const, label: t('Completion', '输出') },
    { key: 'reasoning' as const, label: t('Reasoning', '推理') },
    { key: 'cached' as const, label: t('Cached', '缓存') },
  ];
</script>

<div class="detail-panel" style="--accent-color: {cfg.color}">
  <div class="detail-header">
    <div class="header-left">
      <span class="header-icon">{cfg.icon}</span>
      <h3>{cfg.title}</h3>
    </div>
    <div class="header-actions">
      {#if viewType === 'tokens'}
        <div class="filter-group">
          {#each tokenFilters as f}
            <button
              class="filter-btn"
              class:active={tokenFilter === f.key}
              onclick={() => tokenFilter = f.key}
            >
              {f.label}
            </button>
          {/each}
        </div>
      {/if}
      <button class="action-btn" onclick={exportCSV}>📥 CSV</button>
      <button class="action-btn close-btn" onclick={onClose}>✕</button>
    </div>
  </div>

  <!-- Bar Chart -->
  <div class="chart-section">
    <div class="bar-chart">
      {#each chartData as item}
        {@const val = getChartValue(item)}
        <div class="bar-col">
          <div class="bar-value">
            {viewType === 'spend' ? `$${val.toFixed(2)}` : val.toLocaleString()}
          </div>
          <div class="bar-track">
            <div
              class="bar-fill"
              style="height: {maxChartValue > 0 ? (val / maxChartValue) * 100 : 0}%"
            ></div>
          </div>
          <span class="bar-label">{item.label}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Model Breakdown Table -->
  <div class="table-section">
    <table class="detail-table">
      <thead>
        <tr>
          <th class="sortable" onclick={() => handleSort('model')}>
            {t('Model', '模型')}
            {#if sortKey === 'model'}<span class="sort-icon">{sortAsc ? '↑' : '↓'}</span>{/if}
          </th>
          <th class="sortable num" onclick={() => handleSort('min')}>
            Min {#if sortKey === 'min'}<span class="sort-icon">{sortAsc ? '↑' : '↓'}</span>{/if}
          </th>
          <th class="sortable num" onclick={() => handleSort('max')}>
            Max {#if sortKey === 'max'}<span class="sort-icon">{sortAsc ? '↑' : '↓'}</span>{/if}
          </th>
          <th class="sortable num" onclick={() => handleSort('avg')}>
            Avg {#if sortKey === 'avg'}<span class="sort-icon">{sortAsc ? '↑' : '↓'}</span>{/if}
          </th>
          <th class="sortable num highlight" onclick={() => handleSort('sum')}>
            Sum {#if sortKey === 'sum'}<span class="sort-icon">{sortAsc ? '↑' : '↓'}</span>{/if}
          </th>
          <th class="sortable num" onclick={() => handleSort('requests')}>
            {t('Requests', '请求数')} {#if sortKey === 'requests'}<span class="sort-icon">{sortAsc ? '↑' : '↓'}</span>{/if}
          </th>
        </tr>
      </thead>
      <tbody>
        {#each tableData as row}
          <tr>
            <td class="model-cell">
              <span class="model-dot" style="background: {row.color}"></span>
              {row.model}
            </td>
            <td class="num">
              {viewType === 'spend' ? `$${row.min.toFixed(3)}` : row.min}
            </td>
            <td class="num">
              {viewType === 'spend' ? `$${row.max.toFixed(3)}` : row.max}
            </td>
            <td class="num">
              {viewType === 'spend' ? `$${row.avg.toFixed(3)}` : row.avg}
            </td>
            <td class="num highlight">
              {viewType === 'spend' ? `$${row.sum.toFixed(2)}` : row.sum.toLocaleString()}
            </td>
            <td class="num">{row.requests}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .detail-panel {
    background: var(--bg-card);
    border: 1px solid var(--accent-color);
    border-radius: var(--radius-xl);
    padding: var(--space-xl);
    animation: slideUp 300ms ease-out;
  }

  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .header-icon {
    font-size: 1.25rem;
  }

  .header-left h3 {
    font-size: var(--font-size-lg);
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .filter-group {
    display: flex;
    background: var(--bg-input);
    border-radius: var(--radius-md);
    padding: 2px;
  }

  .filter-btn {
    padding: 4px 10px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: var(--font-size-xs);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .filter-btn:hover {
    color: var(--text-primary);
  }

  .filter-btn.active {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .action-btn {
    padding: 6px 12px;
    border: 1px solid var(--border-color);
    background: var(--bg-input);
    color: var(--text-secondary);
    font-size: var(--font-size-xs);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .action-btn:hover {
    border-color: var(--border-active);
    color: var(--text-primary);
  }

  .close-btn {
    font-size: var(--font-size-sm);
  }

  /* Chart */
  .chart-section {
    margin-bottom: var(--space-xl);
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: var(--space-md);
    height: 180px;
  }

  .bar-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .bar-value {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    margin-bottom: var(--space-xs);
    white-space: nowrap;
  }

  .bar-track {
    flex: 1;
    width: 100%;
    max-width: 48px;
    background: var(--bg-input);
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
  }

  .bar-fill {
    width: 100%;
    background: var(--accent-color);
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    transition: height var(--transition-smooth);
    opacity: 0.8;
  }

  .bar-col:hover .bar-fill {
    opacity: 1;
  }

  .bar-label {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    margin-top: var(--space-sm);
    font-family: var(--font-mono);
  }

  /* Table */
  .table-section {
    overflow-x: auto;
  }

  .detail-table {
    width: 100%;
    border-collapse: collapse;
  }

  .detail-table th {
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
  }

  .detail-table th.num {
    text-align: right;
  }

  .detail-table th.highlight {
    color: var(--accent-color);
  }

  .sortable {
    cursor: pointer;
    user-select: none;
    transition: color var(--transition-fast);
  }

  .sortable:hover {
    color: var(--text-primary);
  }

  .sort-icon {
    font-size: var(--font-size-xs);
    margin-left: 2px;
  }

  .detail-table td {
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--border-color);
    font-size: var(--font-size-sm);
  }

  .detail-table td.num {
    text-align: right;
    font-family: var(--font-mono);
    color: var(--text-secondary);
  }

  .detail-table td.highlight {
    color: var(--text-primary);
    font-weight: 600;
  }

  .model-cell {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
  }

  .model-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .detail-table tbody tr:hover {
    background: var(--bg-input);
  }
</style>
