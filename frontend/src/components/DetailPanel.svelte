<!-- DetailPanel.svelte - OpenRouter-style Detail View (Fixed) -->
<script lang="ts">
  import type { UiLanguage } from '../types';

  let { viewType, language, timeRange, onClose }: {
    viewType: 'spend' | 'requests' | 'tokens';
    language: UiLanguage;
    timeRange: string;
    onClose: () => void;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  let tokenFilter = $state<'total' | 'prompt' | 'completion' | 'reasoning' | 'cached'>('total');
  let sortKey = $state<string>('sum');
  let sortAsc = $state(false);

  const config = {
    spend: { title: t('Spend By Model', '按模型花费'), unit: '$' },
    requests: { title: t('Requests By Model', '按模型请求数'), unit: '' },
    tokens: { title: t('Tokens By Model', '按模型 Token'), unit: '' },
  };
  const cfg = $derived(config[viewType]);

  // Generate labels and data based on timeRange
  function getLabelsAndCount(range: string): { labels: string[]; count: number } {
    if (range === '1h') return { labels: Array.from({ length: 12 }, (_, i) => `${i * 5}m`), count: 12 };
    if (range === '1d') return { labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), count: 24 };
    if (range === '7d') {
      return {
        labels: Array.from({ length: 7 }, (_, i) => new Date(2026, 3, 1 + i).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', 8:00 AM'),
        count: 7
      };
    }
    if (range === '1m') {
      return {
        labels: Array.from({ length: 30 }, (_, i) => new Date(2026, 2, 6 + i).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', 8:00 AM'),
        count: 30
      };
    }
    return { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], count: 12 };
  }

  const { labels: dayLabels, count: barCount } = $derived(getLabelsAndCount(timeRange));

  function genDaily(base: number, spike: number, spikeDay: number): number[] {
    return Array.from({ length: barCount }, (_, i) => {
      if (i < spikeDay - 5) return Math.round(base * (0.3 + Math.random() * 0.7));
      if (i < spikeDay) return Math.round(base * (1 + (i - spikeDay + 5) * 0.4));
      if (i === spikeDay) return spike;
      if (i < spikeDay + 5) return Math.round(spike * (0.2 + Math.random() * 0.3));
      return Math.round(base * (0.4 + Math.random() * 0.6));
    });
  }

  const models = {
    spend: [
      { name: 'MiMo-V2-Pro', color: '#f5a623', data: genDaily(1, 67, 28) },
      { name: 'DeepSeek V3', color: '#3ecf8e', data: genDaily(0.5, 5, 28) },
      { name: 'MiMo-V2-Omni', color: '#7c9aff', data: dayLabels.map(() => 0) },
    ],
    requests: [
      { name: 'MiMo-V2-Pro', color: '#00d4aa', data: genDaily(80, 2300, 28) },
      { name: 'MiMo-V2-Omni', color: '#7c9aff', data: genDaily(15, 85, 28) },
      { name: 'DeepSeek V3', color: '#f5a623', data: dayLabels.map(() => Math.round(Math.random() * 2)) },
    ],
    tokens: [
      { name: 'MiMo-V2-Pro', color: '#00d4aa', data: genDaily(5000000, 120000000, 28) },
      { name: 'MiMo-V2-Omni', color: '#7c9aff', data: genDaily(800000, 5000000, 28) },
      { name: 'DeepSeek V3', color: '#f5a623', data: dayLabels.map(() => Math.round(Math.random() * 5000)) },
    ],
  };

  const currentModels = $derived(models[viewType]);

  // Max stacked value
  const maxStacked = $derived(
    Math.max(...dayLabels.map((_, i) =>
      currentModels.reduce((sum, m) => sum + m.data[i], 0)
    ))
  );

  // Nice Y-axis max
  function niceMax(v: number): number {
    if (viewType === 'spend') {
      const steps = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
      return (steps.find(s => s >= v * 1.2) ?? v * 1.2) / 100;
    }
    const mag = Math.pow(10, Math.floor(Math.log10(v || 1)));
    const norm = v / mag;
    const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    return nice * mag;
  }

  const yMax = $derived(niceMax(maxStacked || 1));

  function yLabelsFromMax(max: number): string[] {
    if (viewType === 'spend') {
      return [0, 1, 2, 3, 4].map(i => {
        const v = max * i / 4;
        return v === 0 ? '0' : `$${v.toFixed(2)}`;
      }).reverse();
    }
    return [0, 1, 2, 3, 4].map(i => {
      const v = max * i / 4;
      if (v >= 1000000) return `${(v / 1000000).toFixed(0)}M`;
      if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
      return String(Math.round(v));
    }).reverse();
  }

  const currentYLabels = $derived(yLabelsFromMax(yMax));

  // Tooltip
  let tooltipDay = $state<number | null>(null);
  let tooltipEl = $state<HTMLElement | null>(null);

  function showTooltip(e: MouseEvent, idx: number) {
    tooltipDay = idx;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const container = target.closest('.chart-area')?.getBoundingClientRect();
    if (container) {
      tooltipX = rect.left - container.left + rect.width / 2;
    }
  }

  function hideTooltip() { tooltipDay = null; }

  let tooltipX = $state(0);

  function formatVal(v: number): string {
    if (viewType === 'spend') return `$${v < 0.01 ? v.toFixed(3) : v.toFixed(2)}`;
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return String(v);
  }

  // Table data
  let tableData = $state([
    { model: 'MiMo-V2-Pro', color: '#f5a623', min: 0, max: 2300, avg: 603, sum: 6030 },
    { model: 'MiMo-V2-Omni', color: '#7c9aff', min: 16, max: 218, avg: 84.5, sum: 507 },
    { model: 'DeepSeek V3', color: '#3ecf8e', min: 2, max: 2, avg: 2, sum: 2 },
  ]);

  function handleSort(key: string) {
    if (sortKey === key) sortAsc = !sortAsc;
    else { sortKey = key; sortAsc = false; }
    tableData = [...tableData].sort((a: any, b: any) => {
      const av = a[key] ?? 0, bv = b[key] ?? 0;
      return sortAsc ? av - bv : bv - av;
    });
  }

  function exportCSV() {
    const csv = ['Model,Min,Max,Avg,Sum', ...tableData.map(r => `${r.model},${r.min},${r.max},${r.avg},${r.sum}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `activity-${viewType}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  // X-axis: show labels based on count
  function shouldShowLabel(idx: number): boolean {
    if (barCount <= 12) return true; // show all for small counts
    return idx % Math.ceil(barCount / 8) === 0 || idx === dayLabels.length - 1;
  }
</script>

<div class="detail-panel">
  <div class="detail-header">
    <h3>{cfg.title}</h3>
    <div class="header-right">
      {#if viewType === 'tokens'}
        <select class="filter-select" bind:value={tokenFilter}>
          <option value="total">Total</option>
          <option value="prompt">Prompt</option>
          <option value="completion">Completion</option>
          <option value="reasoning">Reasoning</option>
          <option value="cached">Cached</option>
        </select>
      {/if}
      <button class="close-btn" onclick={onClose}>✕</button>
    </div>
  </div>

  <!-- Chart with overflow hidden -->
  <div class="chart-wrapper">
    <div class="chart-container">
      <!-- Y Axis -->
      <div class="y-axis">
        {#each currentYLabels as label}
          <span class="y-label">{label}</span>
        {/each}
      </div>

      <!-- Chart Area (overflow hidden clips bars) -->
      <div class="chart-area">
        <div class="chart-grid">
          {#each currentYLabels as _}
            <div class="grid-line"></div>
          {/each}
        </div>

        <div class="bars-row">
          {#each dayLabels as _, i}
            {@const total = currentModels.reduce((s, m) => s + m.data[i], 0)}
            {@const pct = yMax > 0 ? (total / yMax) * 100 : 0}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="bar-cell"
              onmouseenter={(e) => showTooltip(e, i)}
              onmouseleave={hideTooltip}
            >
              <div class="bar-stack" style="height: {Math.min(pct, 100)}%">
                {#each currentModels.slice().reverse() as model}
                  {@const mpct = yMax > 0 ? (model.data[i] / yMax) * 100 : 0}
                  <div class="bar-segment" style="height: {Math.min(mpct, 100)}%; background: {model.color}"></div>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        <!-- Tooltip -->
        {#if tooltipDay !== null}
          <div class="tooltip" style="left: {tooltipX}px">
            <div class="tooltip-date">{dayLabels[tooltipDay]}, 2026 at 8:00 AM</div>
            <div class="tooltip-models">
              {#each currentModels as model}
                {#if model.data[tooltipDay] > 0}
                  <div class="tooltip-row">
                    <span class="tooltip-dot" style="background: {model.color}"></span>
                    <span>{model.name}</span>
                    <strong>{formatVal(model.data[tooltipDay])}</strong>
                  </div>
                {/if}
              {/each}
            </div>
            <div class="tooltip-total">
              Total: <strong>{formatVal(currentModels.reduce((s, m) => s + m.data[tooltipDay], 0))}</strong>
            </div>
          </div>
        {/if}

        <!-- X Axis -->
        <div class="x-axis">
          {#each dayLabels as label, i}
            <span class="x-label" class:visible={shouldShowLabel(i)}>{shouldShowLabel(i) ? label : ''}</span>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="table-container">
    <table class="detail-table">
      <thead>
        <tr>
          <th class="sortable" onclick={() => handleSort('model')}>
            Model <span class="sort-ico">{sortKey === 'model' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
          </th>
          <th class="num sortable" onclick={() => handleSort('min')}>
            Min <span class="sort-ico">{sortKey === 'min' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
          </th>
          <th class="num sortable" onclick={() => handleSort('max')}>
            Max <span class="sort-ico">{sortKey === 'max' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
          </th>
          <th class="num sortable" onclick={() => handleSort('avg')}>
            Avg <span class="sort-ico">{sortKey === 'avg' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
          </th>
          <th class="num sortable highlight" onclick={() => handleSort('sum')}>
            Sum <span class="sort-ico">{sortKey === 'sum' ? (sortAsc ? '↑' : '↓') : '↕'}</span>
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
            <td class="num">{row.min}</td>
            <td class="num">{row.max}</td>
            <td class="num">{row.avg}</td>
            <td class="num highlight">{row.sum}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .detail-panel {
    max-width: 900px;
    margin: 0 auto;
  }

  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .detail-header h3 {
    font-size: 20px;
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
    padding: 8px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 13px;
    color: #374151;
    background: #fff;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    border: 1px solid #e5e7eb;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 120ms;
    color: #6b7280;
  }

  .close-btn:hover {
    background: #f3f4f6;
    color: #111827;
  }

  /* Chart - overflow hidden clips bars */
  .chart-wrapper {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .chart-container {
    display: flex;
    gap: 0;
    height: 320px;
  }

  .y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px 12px 28px 16px;
    min-width: 56px;
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
    overflow: hidden;
    padding: 16px 16px 0 0;
    contain: layout;
  }

  .chart-grid {
    position: absolute;
    inset: 16px 0 28px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .grid-line {
    border-bottom: 1px solid #f3f4f6;
    width: 100%;
  }

  /* Bars - stacked, one per day */
  .bars-row {
    position: absolute;
    inset: 16px 0 28px 0;
    display: flex;
    align-items: flex-end;
    gap: 1px;
  }

  .bar-cell {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    cursor: pointer;
    position: relative;
  }

  .bar-cell:hover .bar-stack {
    filter: brightness(1.1);
  }

  .bar-cell:hover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.04);
  }

  .bar-stack {
    width: 6px;
    max-width: 70%;
    display: flex;
    flex-direction: column-reverse;
    transition: height 300ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .bar-segment {
    width: 100%;
    min-height: 0;
    transition: height 300ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* Tooltip - transparent, compact */
  .tooltip {
    position: absolute;
    top: -8px;
    transform: translateX(-50%);
    background: rgba(17, 24, 39, 0.88);
    backdrop-filter: blur(8px);
    color: #f9fafb;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 11px;
    z-index: 10;
    min-width: 160px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    pointer-events: none;
  }

  .tooltip-date {
    font-size: 10px;
    color: #d1d5db;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .tooltip-models {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .tooltip-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
  }

  .tooltip-row span:first-child { flex: 1; }
  .tooltip-row strong { font-family: 'SF Mono', monospace; font-size: 11px; }

  .tooltip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .tooltip-total {
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 11px;
    text-align: right;
  }

  /* X Axis */
  .x-axis {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding-top: 8px;
  }

  .x-label {
    flex: 1;
    font-size: 10px;
    color: #9ca3af;
    text-align: center;
    white-space: nowrap;
    visibility: hidden;
  }

  .x-label.visible {
    visibility: visible;
  }

  /* Table */
  .table-container { overflow-x: auto; }

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

  .detail-table th.num { text-align: right; }
  .detail-table th.highlight { color: #111827; font-weight: 600; }

  .sortable {
    cursor: pointer;
    user-select: none;
  }

  .sortable:hover { color: #111827; }

  .sort-ico {
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
    font-family: 'SF Mono', monospace;
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

  .detail-table tbody tr:hover { background: #f9fafb; }
</style>
