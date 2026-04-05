<!-- DetailPanel.svelte - Activity Detail View -->
<script lang="ts">
  import type { UiLanguage } from '../types';

  let { viewType, language, timeRange, onClose }: {
    viewType: 'spend' | 'requests' | 'tokens';
    language: UiLanguage;
    timeRange: string;
    onClose: () => void;
  } = $props();

  let sortKey = $state<string>('sum');
  let sortAsc = $state(false);
  let hoveredBarIdx = $state<number | null>(null);
  let hoveredModel = $state<string | null>(null);
  let tooltipDay = $state<number | null>(null);
  let tooltipX = $state(0);
  let tooltipY = $state(0);

  function showTooltip(idx: number, el: HTMLElement) {
    tooltipDay = idx;
    const r = el.getBoundingClientRect();
    tooltipX = r.right;
    tooltipY = r.top + r.height / 2;
  }

  function onMouseMove(e: MouseEvent) {
    if (tooltipDay !== null) {
      tooltipY = e.clientY;
    }
  }

  function hideAll() {
    hoveredBarIdx = null;
    hoveredModel = null;
    tooltipDay = null;
  }

  const config = {
    spend: { title: 'Spend By Model', unit: '$' },
    requests: { title: 'Requests By Model', unit: '' },
    tokens: { title: 'Tokens By Model', unit: '' },
  };
  const cfg = $derived(config[viewType]);

  // Time range → labels + bar count
  function getLabelsAndCount(range: string): { labels: string[]; count: number } {
    if (range === '1h') return { labels: Array.from({ length: 12 }, (_, i) => `${i * 5}m`), count: 12 };
    if (range === '1d') return { labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), count: 24 };
    if (range === '7d') {
      return {
        labels: Array.from({ length: 7 }, (_, i) => new Date(2026, 3, 1 + i).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        count: 7
      };
    }
    if (range === '1m') {
      return {
        labels: Array.from({ length: 30 }, (_, i) => new Date(2026, 2, 6 + i).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        count: 30
      };
    }
    return { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], count: 12 };
  }

  const { labels: dayLabels, count: barCount } = $derived(getLabelsAndCount(timeRange));

  function genDaily(base: number, spike: number, spikeIdx: number): number[] {
    return Array.from({ length: barCount }, (_, i) => {
      if (i < spikeIdx - 2) return Math.round(base * (0.3 + Math.random() * 0.7));
      if (i < spikeIdx) return Math.round(base * (1 + (i - spikeIdx + 2) * 0.3));
      if (i === spikeIdx) return spike;
      if (i < spikeIdx + 2) return Math.round(spike * (0.2 + Math.random() * 0.3));
      return Math.round(base * (0.4 + Math.random() * 0.6));
    });
  }

  const models = $derived({
    spend: [
      { name: 'MiMo-V2-Pro', color: '#f5a623', data: genDaily(1, 67, Math.floor(barCount * 0.8)) },
      { name: 'DeepSeek V3', color: '#3ecf8e', data: genDaily(0.5, 5, Math.floor(barCount * 0.8)) },
      { name: 'MiMo-V2-Omni', color: '#7c9aff', data: dayLabels.map(() => 0) },
    ],
    requests: [
      { name: 'MiMo-V2-Pro', color: '#00d4aa', data: genDaily(80, 2300, Math.floor(barCount * 0.8)) },
      { name: 'MiMo-V2-Omni', color: '#7c9aff', data: genDaily(15, 85, Math.floor(barCount * 0.8)) },
      { name: 'DeepSeek V3', color: '#f5a623', data: dayLabels.map(() => Math.round(Math.random() * 2)) },
    ],
    tokens: [
      { name: 'MiMo-V2-Pro', color: '#00d4aa', data: genDaily(5000000, 120000000, Math.floor(barCount * 0.8)) },
      { name: 'MiMo-V2-Omni', color: '#7c9aff', data: genDaily(800000, 5000000, Math.floor(barCount * 0.8)) },
      { name: 'DeepSeek V3', color: '#f5a623', data: dayLabels.map(() => Math.round(Math.random() * 5000)) },
    ],
  });

  const currentModels = $derived(models[viewType]);

  const maxStacked = $derived(
    Math.max(...dayLabels.map((_, i) =>
      currentModels.reduce((sum, m) => sum + m.data[i], 0)
    ))
  );

  // Y-axis
  function niceMax(v: number): number {
    if (viewType === 'spend') {
      const steps = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
      return steps.find(s => s >= v * 1.15) ?? Math.ceil(v * 1.15 * 10) / 10;
    }
    const target = v * 1.15;
    const steps = [10, 50, 100, 250, 500, 1000, 2000, 3000, 5000, 10000, 50000, 100000, 500000, 1000000];
    return steps.find(s => s >= target) ?? Math.ceil(target);
  }

  const yMax = $derived(niceMax(maxStacked || 1));

  function yLabelsFromMax(max: number): string[] {
    if (viewType === 'spend') {
      return [0, 1, 2, 3, 4].map(i => max * i / 4).reverse().map(v => v === 0 ? '$0' : `$${v.toFixed(2)}`);
    }
    return [0, 1, 2, 3, 4].map(i => max * i / 4).reverse().map(v => {
      if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
      if (v >= 1000) return `${Math.round(v / 1000)}K`;
      return String(Math.round(v));
    });
  }

  const currentYLabels = $derived(yLabelsFromMax(yMax));

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

  function formatVal(v: number): string {
    if (viewType === 'spend') return `$${v < 0.01 ? v.toFixed(3) : v.toFixed(2)}`;
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return String(v);
  }

  function shouldShowLabel(idx: number): boolean {
    if (barCount <= 12) return true;
    return idx % Math.ceil(barCount / 8) === 0 || idx === dayLabels.length - 1;
  }
</script>

<div class="detail-panel">
  <div class="detail-header">
    <h3>{cfg.title}</h3>
    <button class="close-btn" onclick={onClose}>✕</button>
  </div>

  <div class="chart-wrapper">
    <div class="chart-row">
      <!-- Y Axis -->
      <div class="y-axis">
        {#each currentYLabels as label}
          <span class="y-label">{label}</span>
        {/each}
      </div>

      <!-- Chart Area -->
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
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="bar-cell"
              class:active={hoveredBarIdx === i}
              onmouseenter={(e) => { hoveredBarIdx = i; showTooltip(i, e.currentTarget); }}
              onmousemove={onMouseMove}
              onmouseleave={() => hideAll()}
            >
              <div class="bar-stack" style="height: {Math.min(pct, 100)}%">
                {#each currentModels.slice().reverse() as model}
                  {@const mpct = yMax > 0 ? (model.data[i] / yMax) * 100 : 0}
                  <div
                    class="bar-segment"
                    style="height: {Math.min(mpct, 100)}%; background: {model.color}"
                    class:dimmed={hoveredModel !== null && hoveredModel !== model.name}
                    class:highlighted={hoveredModel === model.name}
                    onmouseenter={() => { hoveredModel = model.name; }}
                    onmouseleave={() => { hoveredModel = null; }}
                  ></div>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        <!-- Tooltip -->
        {#if tooltipDay !== null}
          <div class="tooltip" style="--tx: {tooltipX}px; --ty: {tooltipY}px">
            <div class="tooltip-date">{dayLabels[tooltipDay]}, 2026 at 8:00 AM</div>
            <div class="tooltip-body">
              {#each currentModels as model}
                {#if model.data[tooltipDay] > 0}
                  <div class="tooltip-row" class:hl={hoveredModel === model.name}>
                    <span class="tooltip-dot" style="background: {model.color}"></span>
                    <span class="tooltip-name">{model.name}</span>
                    <span class="tooltip-val">{formatVal(model.data[tooltipDay])}</span>
                  </div>
                {/if}
              {/each}
              <div class="tooltip-total">
                <span>Total</span>
                <span class="tooltip-val">{formatVal(currentModels.reduce((s, m) => s + m.data[tooltipDay], 0))}</span>
              </div>
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

  .close-btn {
    width: 36px;
    height: 36px;
    border: none;
    background: #f3f4f6;
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
    background: #e5e7eb;
    color: #111827;
  }

  /* Chart */
  .chart-wrapper {
    overflow: hidden;
    margin-bottom: 20px;
  }

  .chart-row {
    display: flex;
    gap: 0;
    height: 420px;
    margin-bottom: 20px;
  }

  .y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px 12px 28px 8px;
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
    overflow: hidden;
    padding: 16px 16px 0 0;
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

  /* Bars */
  .bars-row {
    position: absolute;
    inset: 16px 0 28px 0;
    display: flex;
    align-items: flex-end;
    gap: 2px;
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

  .bar-cell.active::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 4px;
  }

  .bar-stack {
    width: 100%;
    max-width: 32px;
    min-width: 8px;
    display: flex;
    flex-direction: column-reverse;
    border-radius: 4px 4px 0 0;
    transition: height 300ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .bar-segment {
    width: 100%;
    min-height: 0;
    transition: height 300ms cubic-bezier(0.22, 1, 0.36, 1), filter 150ms, opacity 150ms;
    cursor: pointer;
  }

  .bar-segment:first-child {
    border-radius: 4px 4px 0 0;
  }

  .bar-segment:hover {
    filter: brightness(1.15);
  }

  .bar-segment.dimmed {
    filter: brightness(0.6);
    opacity: 0.3;
  }

  .bar-segment.highlighted {
    filter: brightness(1.3);
    box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.4);
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

  /* Tooltip */
  .tooltip {
    position: fixed;
    left: 0;
    top: 0;
    transform: translate(4px, calc(var(--ty) - 50%));
    z-index: 100;
    pointer-events: none;
    min-width: 220px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    overflow: hidden;
  }

  .tooltip-date {
    background: #f9fafb;
    color: #111827;
    font-size: 12px;
    font-weight: 600;
    padding: 8px 12px;
    border-bottom: 1px solid #f3f4f6;
  }

  .tooltip-body {
    padding: 6px 10px;
  }

  .tooltip-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    padding: 2px 4px;
    line-height: 1.3;
    transition: background 150ms;
  }

  .tooltip-row.hl {
    background: #eff6ff;
    border-radius: 4px;
  }

  .tooltip-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .tooltip-name {
    flex: 1;
    color: #6b7280;
  }

  .tooltip-val {
    font-family: 'SF Mono', monospace;
    font-size: 11px;
    color: #111827;
    font-weight: 600;
  }

  .tooltip-total {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid #e5e7eb;
    font-size: 12px;
    color: #374151;
    font-weight: 500;
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
  }

  .sortable:hover {
    color: #111827;
  }

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
    font-size: 12px;
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
    font-size: 12px;
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
