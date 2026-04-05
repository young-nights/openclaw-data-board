<!-- ActivityChart.svelte - Activity Bar Chart (OpenRouter-inspired) -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import type { UiLanguage } from '../types';

  let { language, loading = false }: {
    language: UiLanguage;
    loading?: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  // Mock activity data - last 24 hours
  const hourlyData = [
    { hour: '00', value: 2 }, { hour: '01', value: 1 }, { hour: '02', value: 0 },
    { hour: '03', value: 0 }, { hour: '04', value: 1 }, { hour: '05', value: 3 },
    { hour: '06', value: 5 }, { hour: '07', value: 8 }, { hour: '08', value: 12 },
    { hour: '09', value: 15 }, { hour: '10', value: 18 }, { hour: '11', value: 22 },
    { hour: '12', value: 20 }, { hour: '13', value: 16 }, { hour: '14', value: 19 },
    { hour: '15', value: 24 }, { hour: '16', value: 21 }, { hour: '17', value: 14 },
    { hour: '18', value: 9 }, { hour: '19', value: 7 }, { hour: '20', value: 5 },
    { hour: '21', value: 4 }, { hour: '22', value: 3 }, { hour: '23', value: 2 },
  ];

  const maxValue = Math.max(...hourlyData.map(d => d.value));

  // Mock session breakdown
  const sessions = [
    { name: 'main', value: 45, color: '#7c9aff' },
    { name: 'coder', value: 28, color: '#f5a623' },
    { name: 'secretary', value: 15, color: '#3ecf8e' },
    { name: 'analyst', value: 12, color: '#a78bfa' },
  ];

  const totalRequests = sessions.reduce((sum, s) => sum + s.value, 0);
</script>

<Card
  title={t('Activity', '活动')}
  subtitle={t('Last 24 hours · Requests per hour', '最近 24 小时 · 每小时请求数')}
  {loading}
>
  <div class="chart-area">
    <div class="bar-chart">
      {#each hourlyData as item}
        <div class="bar-col" title="{item.hour}:00 — {item.value} requests">
          <div
            class="bar"
            style="height: {maxValue > 0 ? (item.value / maxValue) * 100 : 0}%"
            class:active={item.value > 0}
          ></div>
          <span class="bar-label">{item.hour}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="activity-summary">
    <div class="summary-item">
      <span class="summary-label">{t('Total Requests', '总请求')}</span>
      <strong class="summary-value">{totalRequests}</strong>
    </div>
    <div class="summary-item">
      <span class="summary-label">{t('Peak', '峰值')}</span>
      <strong class="summary-value">{Math.max(...hourlyData.map(d => d.value))}/h</strong>
    </div>
    <div class="summary-item">
      <span class="summary-label">{t('Active Sessions', '活跃会话')}</span>
      <strong class="summary-value">{sessions.length}</strong>
    </div>
  </div>

  <div class="breakdown">
    <span class="breakdown-title">{t('By Session', '按会话')}</span>
    <div class="breakdown-bars">
      {#each sessions as session}
        <div class="breakdown-row">
          <span class="breakdown-label">{session.name}</span>
          <div class="breakdown-track">
            <div class="breakdown-fill" style="width: {(session.value / totalRequests) * 100}%; background: {session.color}"></div>
          </div>
          <span class="breakdown-value">{session.value}</span>
        </div>
      {/each}
    </div>
  </div>
</Card>

<style>
  .chart-area {
    padding: var(--space-md) 0;
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 120px;
    padding: 0 var(--space-xs);
  }

  .bar-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    cursor: default;
  }

  .bar {
    width: 100%;
    flex: 1;
    background: var(--bg-input);
    border-radius: 3px 3px 0 0;
    transition: all var(--transition-smooth);
    min-height: 2px;
    align-self: flex-end;
  }

  .bar.active {
    background: var(--accent);
    opacity: 0.7;
  }

  .bar.active:hover {
    opacity: 1;
  }

  .bar-col:hover .bar.active {
    opacity: 1;
    box-shadow: 0 0 8px rgba(124, 154, 255, 0.3);
  }

  .bar-label {
    font-size: 9px;
    color: var(--text-muted);
    margin-top: var(--space-xs);
    font-family: var(--font-mono);
  }

  .bar-col:nth-child(odd) .bar-label {
    visibility: hidden;
  }

  .activity-summary {
    display: flex;
    gap: var(--space-xl);
    padding: var(--space-md) 0;
    border-top: 1px solid var(--border-color);
    margin-top: var(--space-md);
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .summary-label {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  .summary-value {
    font-size: var(--font-size-lg);
    font-family: var(--font-mono);
    font-weight: 600;
    color: var(--text-primary);
  }

  .breakdown {
    margin-top: var(--space-md);
    padding-top: var(--space-md);
    border-top: 1px solid var(--border-color);
  }

  .breakdown-title {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    display: block;
    margin-bottom: var(--space-sm);
  }

  .breakdown-bars {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .breakdown-row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .breakdown-label {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    min-width: 60px;
    font-family: var(--font-mono);
  }

  .breakdown-track {
    flex: 1;
    height: 6px;
    background: var(--bg-input);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .breakdown-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width var(--transition-smooth);
  }

  .breakdown-value {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    min-width: 24px;
    text-align: right;
  }
</style>
