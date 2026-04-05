<!-- UsageCost.svelte - Usage & Cost Dashboard (Updated) -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import Badge from './common/Badge.svelte';
  import StatusStrip from './common/StatusStrip.svelte';
  import ActivityChart from './ActivityChart.svelte';
  import type { UiLanguage } from '../types';

  let { language, loading = false }: {
    language: UiLanguage;
    loading?: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  const budgetUsed = 120;
  const budgetLimit = 1000;
  const budgetRatio = budgetUsed / budgetLimit;
</script>

<div class="usage-layout">
  <div class="usage-main">
    <ActivityChart {language} {loading} />
  </div>

  <div class="usage-side">
    <Card title={t('Budget Overview', '预算总览')} {loading}>
      <div class="budget-card">
        <div class="budget-gauge">
          <svg viewBox="0 0 120 120" class="gauge-svg">
            <circle cx="60" cy="60" r="50" class="gauge-bg" />
            <circle
              cx="60" cy="60" r="50"
              class="gauge-fill"
              class:ok={budgetRatio < 0.7}
              class:warn={budgetRatio >= 0.7 && budgetRatio < 0.9}
              class:critical={budgetRatio >= 0.9}
              style="stroke-dasharray: {budgetRatio * 314} 314"
            />
          </svg>
          <div class="gauge-label">
            <strong>{Math.round(budgetRatio * 100)}%</strong>
            <small>{t('Used', '已使用')}</small>
          </div>
        </div>
        <StatusStrip items={[
          { label: t('Used', '已花费'), value: `$${budgetUsed}` },
          { label: t('Limit', '上限'), value: `$${budgetLimit}` },
          { label: t('Remaining', '剩余'), value: `$${budgetLimit - budgetUsed}` },
        ]} />
      </div>
    </Card>

    <Card title={t('Data Sources', '数据源状态')} {loading}>
      <div class="source-list">
        {#each [
          { name: t('Model Context', '模型上下文'), status: 'ok' as const },
          { name: t('Digest History', '趋势历史'), status: 'ok' as const },
          { name: t('Request Counts', '请求计数'), status: 'ok' as const },
          { name: t('Budget Limit', '预算限额'), status: 'ok' as const },
          { name: t('Provider Mapping', '供应商归因'), status: 'partial' as const },
          { name: t('Subscription', '订阅额度'), status: 'blocked' as const },
        ] as source}
          <div class="source-row">
            <span>{source.name}</span>
            <Badge status={source.status} label={source.status === 'ok' ? t('Connected', '已连接') : source.status === 'partial' ? t('Partial', '部分') : t('Missing', '未连接')} />
          </div>
        {/each}
      </div>
    </Card>
  </div>
</div>

<style>
  .usage-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: var(--space-lg);
  }

  @media (max-width: 900px) {
    .usage-layout {
      grid-template-columns: 1fr;
    }
  }

  .usage-side {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .budget-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);
  }

  .budget-gauge {
    position: relative;
    width: 120px;
    height: 120px;
  }

  .gauge-svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }

  .gauge-bg {
    fill: none;
    stroke: var(--bg-input);
    stroke-width: 8;
  }

  .gauge-fill {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dasharray var(--transition-smooth);
  }

  .gauge-fill.ok { stroke: var(--ok); }
  .gauge-fill.warn { stroke: var(--warn); }
  .gauge-fill.critical { stroke: var(--danger); }

  .gauge-label {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .gauge-label strong {
    font-size: var(--font-size-2xl);
    font-family: var(--font-mono);
    color: var(--text-primary);
  }

  .gauge-label small {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  .source-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .source-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--border-color);
    font-size: var(--font-size-sm);
  }

  .source-row:last-child {
    border-bottom: none;
  }
</style>
