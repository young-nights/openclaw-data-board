<!-- MetricCard.svelte - OpenRouter-style Metric Card with Mini Chart -->
<script lang="ts">
  let { title, value, subtitle, color, icon, chartData, modelBreakdown, loading = false, onClick }: {
    title: string;
    value: string;
    subtitle: string;
    color: 'spend' | 'requests' | 'tokens';
    icon: string;
    chartData?: number[];
    modelBreakdown?: Array<{ name: string; value: string; color: string }>;
    loading?: boolean;
    onClick?: () => void;
  } = $props();

  const colorMap = {
    spend: { accent: '#f5a623', accentSoft: 'rgba(245, 166, 35, 0.15)' },
    requests: { accent: '#3ecf8e', accentSoft: 'rgba(62, 207, 142, 0.15)' },
    tokens: { accent: '#00d4aa', accentSoft: 'rgba(0, 212, 170, 0.15)' },
  };

  const c = $derived(colorMap[color]);
  const maxVal = $derived(chartData ? Math.max(...chartData) : 1);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="metric-card"
  class:clickable={!!onClick}
  onclick={onClick}
  onkeydown={(e) => e.key === 'Enter' && onClick?.()}
  role={onClick ? 'button' : undefined}
  tabindex={onClick ? 0 : undefined}
>
  {#if loading}
    <div class="skeleton-lines">
      <div class="skeleton-line" style="width: 40%;"></div>
      <div class="skeleton-line" style="width: 70%;"></div>
    </div>
  {:else}
    <!-- Header -->
    <div class="card-header">
      <span class="card-title">{title}</span>
      {#if onClick}
        <button class="expand-btn" title="Expand">⛶</button>
      {/if}
    </div>

    <!-- Main Value -->
    <div class="card-value">{value}</div>

    <!-- Mini Chart -->
    {#if chartData && chartData.length > 0}
      <div class="mini-chart">
        {#each chartData as val}
          <div
            class="mini-bar"
            style="height: {maxVal > 0 ? (val / maxVal) * 100 : 0}%; background: {c.accent}"
          ></div>
        {/each}
      </div>
    {/if}

    <!-- Model Breakdown -->
    {#if modelBreakdown && modelBreakdown.length > 0}
      <div class="model-list">
        {#each modelBreakdown as model}
          <div class="model-row">
            <span class="model-dot" style="background: {model.color}"></span>
            <span class="model-name">{model.name}</span>
            <span class="model-value">{model.value}</span>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Subtitle -->
    <div class="card-subtitle">{subtitle}</div>
  {/if}
</div>

<style>
  .metric-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .metric-card.clickable {
    cursor: pointer;
  }

  .metric-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .card-title {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
  }

  .expand-btn {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    border-radius: 6px;
    transition: all 120ms;
  }

  .expand-btn:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .card-value {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    line-height: 1.1;
    margin-bottom: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    letter-spacing: -0.02em;
  }

  /* Mini Chart - thin tall bars */
  .mini-chart {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 64px;
    margin-bottom: 16px;
    padding: 0 4px;
  }

  .mini-bar {
    width: 3px;
    flex: none;
    border-radius: 1.5px 1.5px 0 0;
    transition: height 350ms cubic-bezier(0.22, 1, 0.36, 1);
    min-height: 1px;
  }

  /* Model Breakdown */
  .model-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }

  .model-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }

  .model-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .model-name {
    color: #374151;
    flex: 1;
  }

  .model-value {
    color: #6b7280;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 12px;
  }

  .card-subtitle {
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.4;
  }

  .skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .skeleton-line {
    height: 14px;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
</style>
