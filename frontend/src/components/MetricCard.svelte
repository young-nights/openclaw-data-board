<!-- MetricCard.svelte - Large Metric Summary Card -->
<script lang="ts">
  let { title, value, subtitle, color, icon, loading = false, onClick }: {
    title: string;
    value: string;
    subtitle: string;
    color: 'spend' | 'requests' | 'tokens';
    icon: string;
    loading?: boolean;
    onClick?: () => void;
  } = $props();

  const colorMap = {
    spend: { bg: 'rgba(245, 166, 35, 0.08)', border: 'rgba(245, 166, 35, 0.25)', text: '#f5a623', glow: 'rgba(245, 166, 35, 0.08)' },
    requests: { bg: 'rgba(62, 207, 142, 0.08)', border: 'rgba(62, 207, 142, 0.25)', text: '#3ecf8e', glow: 'rgba(62, 207, 142, 0.08)' },
    tokens: { bg: 'rgba(124, 154, 255, 0.08)', border: 'rgba(124, 154, 255, 0.25)', text: '#7c9aff', glow: 'rgba(124, 154, 255, 0.08)' },
  };

  const c = $derived(colorMap[color]);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="metric-card"
  class:clickable={!!onClick}
  style="--card-bg: {c.bg}; --card-border: {c.border}; --card-text: {c.text}; --card-glow: {c.glow}"
  onclick={onClick}
  onkeydown={(e) => e.key === 'Enter' && onClick?.()}
  role={onClick ? 'button' : undefined}
  tabindex={onClick ? 0 : undefined}
>
  {#if loading}
    <div class="skeleton-lines">
      <div class="skeleton-line" style="width: 40%;"></div>
      <div class="skeleton-line" style="width: 70%;"></div>
      <div class="skeleton-line" style="width: 50%;"></div>
    </div>
  {:else}
    <div class="metric-header">
      <span class="metric-icon">{icon}</span>
      <span class="metric-title">{title}</span>
      {#if onClick}
        <span class="metric-expand">↗</span>
      {/if}
    </div>
    <div class="metric-value">{value}</div>
    <div class="metric-subtitle">{subtitle}</div>
  {/if}
</div>

<style>
  .metric-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-xl);
    padding: var(--space-xl);
    transition: all var(--transition-normal);
    cursor: default;
  }

  .metric-card.clickable {
    cursor: pointer;
  }

  .metric-card:hover {
    box-shadow: 0 0 32px var(--card-glow);
    transform: translateY(-2px);
    border-color: var(--card-text);
  }

  .metric-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .metric-icon {
    font-size: 1.25rem;
  }

  .metric-title {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--text-secondary);
    flex: 1;
  }

  .metric-expand {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    transition: color var(--transition-fast);
  }

  .metric-card:hover .metric-expand {
    color: var(--card-text);
  }

  .metric-value {
    font-size: 2.25rem;
    font-weight: 700;
    font-family: var(--font-mono);
    color: var(--card-text);
    line-height: 1.1;
    margin-bottom: var(--space-sm);
    letter-spacing: -0.02em;
  }

  .metric-subtitle {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    line-height: 1.4;
  }

  .skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .skeleton-line {
    height: 14px;
    background: linear-gradient(90deg, var(--bg-card) 25%, rgba(255,255,255,0.04) 50%, var(--bg-card) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--radius-sm);
  }
</style>
