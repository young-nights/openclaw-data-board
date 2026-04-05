<!-- DetailPanel.svelte - OpenRouter-style Detail View -->
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

  let tokenFilter = $state<'total' | 'prompt' | 'completion' | 'reasoning' | 'cached'>('total');
  let sortKey = $state<string>('sum');
  let sortAsc = $state(false);

  const config = {
    spend: {
      title: t('Spend By Model', '按模型花费'),
      unit: '$',
      yLabels: ['0.02', '0.04', '0.06', '0.08'],
      yMax: 0.08,
    },
    requests: {
      title: t('Requests By Model', '按模型请求数'),
      unit: '',
      yLabels: ['1K', '2K', '3K', '4K'],
      yMax: 4000,
    },
    tokens: {
      title: t('Tokens By Model', '按模型 Token'),
      unit: '',
      yLabels: ['85M', '170M', '255M', '340M'],
      yMax: 340000000,
    },
  };

  const cfg = $derived(config[viewType]);

  // Time labels for X axis
  const xLabels = ['Mar 6, 8:00 AM', 'Mar 13, 8:00 AM', 'Mar 20, 8:00 AM', 'Mar 27, 8:00 AM', 'Apr 3, 8:00 AM'];

  // Mock stacked data per model per time period
  const models = {
    spend: [
      { name: 'MiMo-V2-Pro', color: '#f5a623', data: [0, 0, 0.002, 0.008, 0.0679] },
      { name: 'DeepSeek V3', color: '#3ecf8e', data: [0, 0, 0, 0.002, 0.00552] },
      { name: 'MiMo-V2-Omni', color: '#7c9aff', data: [0, 0, 0, 0, 0] },
    ],
    requests: [
      { name: 'MiMo-V2-Pro', color: '#00d4aa', data: [200, 350, 800, 1200, 6030] },
      { name: 'MiMo-V2-Omni', color: '#7c9aff', data: [50, 80, 120, 200, 507] },
      { name: 'DeepSeek V3', color: '#f5a623', data: [0, 0, 1, 1, 2] },
    ],
    tokens: [
      { name: 'MiMo-V2-Pro', color: '#00d4aa', data: [10000000, 15000000, 40000000, 85000000, 608000000] },
      { name: 'MiMo-V2-Omni', color: '#7c9aff', data: [2000000, 3000000, 5000000, 8000000, 25200000] },
      { name: 'DeepSeek V3', color: '#f5a623', data: [0, 0, 1000, 5000, 11000] },
    ],
  };

  const currentModels = $derived(models[viewType]);

  // Calculate max stacked value for chart scaling
  const maxStacked = $derived(
    Math.max(...Array(5).fill(0).map((_, i) =>
      currentModels.reduce((sum, m) => sum + m.data[i], 0)
    ))
  );

  // Table data
  let tableData = $state([
    { model: 'MiMo-V2-Pro', color: '#f5a623', min: 0, max: 0.067, avg: 0.00679, sum: 0.0679 },
    { model: 'DeepSeek V3', color: '#3ecf8e', min: 0.00552, max: 0.00552, avg: 0.00552, sum: 0.00552 },
    { model: 'MiMo-V2-Omni', color: '#7c9aff', min: 0, max: 0, avg: 0, sum: 0 },
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

  function formatVal(v: number): string {
    if (viewType === 'spend') return `$${v}`;
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return String(v);
  }

  function exportCSV() {
    const headers = ['Model', 'Min', 'Max', 'Avg', 'Sum'];
    const rows = tableData.map(r => [r.model, r.min, r.max, r.avg, r.sum]);
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
    { key: 'total' as const, label: 'Total' },
    { key: 'prompt' as const, label: 'Prompt' },
    { key: 'completion' as const, label: 'Completion' },
    { key: 'reasoning' as const, label: 'Reasoning' },
    { key: 'cached' as const, label: 'Cached' },
  ];
</script>

<div class="detail-panel">
  <!-- Header -->
  <div class="detail-header">
    <h3>{cfg.title}</h3>
    <div class="header-right">
      {#if viewType === 'tokens'}
        <select class="filter-select" bind:value={tokenFilter}>
          {#each tokenFilters as f}
            <option value={f.key}>{f.label}</option>
          {/each}
        </select>
      {/if}
      <button class="icon-btn" title="Settings">⚙️</button>
      <button class="icon-btn close-btn" onclick={onClose}>✕</button>
    </div>
  </div>

  <!-- Stacked Bar Chart -->
  <div class="chart-container">
    <!-- Y Axis Labels -->
    <div class="y-axis">
      {#each cfg.yLabels.slice().reverse() as label}
        <span class="y-label">{label}</span>
      {/each}
    </div>

    <!-- Chart Area -->
    <div class="chart-area">
      <div class="chart-grid">
        {#each cfg.yLabels as _}
          <div class="grid-line"></div>
        {/each}
      </div>

      <div class="bars-container">
        {#each Array(5) as _, i}
          <div class="bar-group">
            {#each currentModels as model}
              {@const val = model.data[i]}
              {@const pct = cfg.yMax > 0 ? (val / cfg.yMax) * 100 : 0}
              <div
                class="stacked-bar"
                style="height: {pct}%; background: {model.color};"
                title="{model.name}: {formatVal(val)}"
              ></div>
            {/each}
          </div>
        {/each}
      </div>

      <!-- X Axis Labels -->
      <div class="x-axis">
        {#each xLabels as label}
          <span class="x-label">{label}</span>
        {/each}
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="table-container">
    <table class="detail-table">
      <thead>
        <tr>
          <th class="sortable" onclick={() => handleSort('model')}>
            Model <span class="sort-icon">{sortKey === 'model' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
          </th>
          <th class="num sortable" onclick={() => handleSort('min')}>
            Min {viewType === 'spend' ? '($)' : '(tok)'} <span class="sort-icon">{sortKey === 'min' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
          </th>
          <th class="num sortable" onclick={() => handleSort('max')}>
            Max {viewType === 'spend' ? '($)' : '(tok)'} <span class="sort-icon">{sortKey === 'max' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
          </th>
          <th class="num sortable" onclick={() => handleSort('avg')}>
            Avg {viewType === 'spend' ? '($)' : '(tok)'} <span class="sort-icon">{sortKey === 'avg' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
          </th>
          <th class="num sortable highlight" onclick={() => handleSort('sum')}>
            Sum {viewType === 'spend' ? '($)' : '(tok)'} <span class="sort-icon">{sortKey === 'sum' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
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
            <td class="num">{formatVal(row.min)}</td>
            <td class="num">{formatVal(row.max)}</td>
            <td class="num">{formatVal(row.avg)}</td>
            <td class="num highlight">{formatVal(row.sum)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .detail-panel {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    animation: slideUp 250ms ease-out;
  }

  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .detail-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-select {
    padding: 6px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 13px;
    color: #374151;
    background: #ffffff;
    outline: none;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 120ms;
  }

  .icon-btn:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  /* Chart */
  .chart-container {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    height: 240px;
  }

  .y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px 0;
    min-width: 48px;
  }

  .y-label {
    font-size: 12px;
    color: #9ca3af;
    text-align: right;
    font-family: 'SF Mono', monospace;
  }

  .chart-area {
    flex: 1;
    position: relative;
  }

  .chart-grid {
    position: absolute;
    inset: 8px 0 28px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .grid-line {
    border-bottom: 1px solid #f3f4f6;
    width: 100%;
  }

  .bars-container {
    position: absolute;
    inset: 8px 0 28px 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    gap: 16px;
    padding: 0 24px;
  }

  .bar-group {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    flex: 1;
    max-width: 48px;
    height: 100%;
  }

  .stacked-bar {
    flex: 1;
    border-radius: 3px 3px 0 0;
    transition: height 350ms cubic-bezier(0.22, 1, 0.36, 1);
    min-height: 1px;
    cursor: pointer;
  }

  .stacked-bar:hover {
    opacity: 0.85;
  }

  .x-axis {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    padding: 8px 24px 0;
  }

  .x-label {
    font-size: 11px;
    color: #9ca3af;
    white-space: nowrap;
  }

  /* Table */
  .table-container {
    overflow-x: auto;
  }

  .detail-table {
    width: 100%;
    border-collapse: collapse;
  }

  .detail-table th {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
    white-space: nowrap;
  }

  .detail-table th.num {
    text-align: right;
  }

  .detail-table th.highlight {
    color: #111827;
    font-weight: 600;
  }

  .sortable {
    cursor: pointer;
    user-select: none;
    transition: color 120ms;
  }

  .sortable:hover {
    color: #111827;
  }

  .sort-icon {
    font-size: 10px;
    margin-left: 4px;
    color: #d1d5db;
  }

  .detail-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
    color: #374151;
  }

  .detail-table td.num {
    text-align: right;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 13px;
    color: #6b7280;
  }

  .detail-table td.highlight {
    color: #111827;
    font-weight: 600;
  }

  .model-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'SF Mono', monospace;
    font-size: 13px;
    color: #111827;
  }

  .model-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .detail-table tbody tr:hover {
    background: #f9fafb;
  }
</style>
