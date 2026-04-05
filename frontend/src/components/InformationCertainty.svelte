<!-- InformationCertainty.svelte - Information Certainty Dashboard -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import Badge from './common/Badge.svelte';
  import StatusStrip from './common/StatusStrip.svelte';
  import type { UiLanguage } from '../types';

  let { language, loading = false }: {
    language: UiLanguage;
    loading?: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  const score = 72;
  const signals = [
    { key: 'freshness', label: t('Live Picture', '实时画面'), status: 'connected' as const, detail: t('Updated just now, suitable for current decisions.', '刚刚更新，适合直接判断。') },
    { key: 'roster', label: t('Staff & Owners', '员工与负责人'), status: 'connected' as const, detail: t('Staff roster and ownership signals are readable.', '员工名单和负责人信号可读。') },
    { key: 'live_sessions', label: t('Live Execution', '实时执行'), status: 'connected' as const, detail: t('0 live sessions visible, signal connected.', '实时会话信号已连上；当前无执行中会话。') },
    { key: 'usage', label: t('AI Usage & Cost', 'AI 用量与费用'), status: 'partial' as const, detail: t('Usage trend visible, subscription snapshot incomplete.', '已能看到用量趋势，订阅快照不完整。') },
    { key: 'subscription', label: t('Subscription', '订阅额度'), status: 'not_connected' as const, detail: t('Remaining subscription room not confirmed.', '剩余额度尚未确认。') },
    { key: 'history', label: t('Replay History', '回放历史'), status: 'connected' as const, detail: t('Recent activity and trend history available.', '最近活动和趋势历史可用。') },
  ];

  const connectedCount = signals.filter(s => s.status === 'connected').length;
  const partialCount = signals.filter(s => s.status === 'partial').length;
  const blindSpotCount = signals.filter(s => s.status === 'not_connected').length;

  function getScoreBadge(s: number) {
    if (s >= 80) return { status: 'ok' as const, label: t('High Certainty', '高确定性') };
    if (s >= 55) return { status: 'warn' as const, label: t('Medium Certainty', '中等确定性') };
    return { status: 'blocked' as const, label: t('Low Certainty', '低确定性') };
  }

  const scoreBadge = getScoreBadge(score);
</script>

<Card
  title={t('Information Certainty', '信息确定性')}
  subtitle={t('How much can you trust this dashboard?', '这张画面有多少可以放心相信？')}
  {loading}
>
  <div class="certainty-header">
    <div class="score-display">
      <span class="score-label">{t('Certainty Score', '确定性分数')}</span>
      <strong class="score-value">{score}</strong>
      <Badge status={scoreBadge.status} label={scoreBadge.label} />
    </div>
    <StatusStrip items={[
      { label: t('Reliable', '可靠'), value: connectedCount },
      { label: t('Partial', '部分'), value: partialCount },
      { label: t('Blind Spot', '盲区'), value: blindSpotCount },
    ]} />
  </div>

  <div class="signals-grid">
    <section class="signals-section">
      <h4>{t('What you can trust', '可以放心看的')}</h4>
      <ul class="signal-list">
        {#each signals.filter(s => s.status === 'connected') as signal}
          <li>
            <Badge status="ok" label="" />
            <span>{signal.label}</span>
          </li>
        {/each}
      </ul>
    </section>
    <section class="signals-section">
      <h4>{t('What may be incomplete', '可能还不完整')}</h4>
      <ul class="signal-list">
        {#each signals.filter(s => s.status !== 'connected') as signal}
          <li>
            <Badge status={signal.status === 'partial' ? 'info' : 'blocked'} label="" />
            <span>{signal.label}: {signal.detail}</span>
          </li>
        {/each}
      </ul>
    </section>
  </div>
</Card>

<style>
  .certainty-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-lg);
  }

  .score-display {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .score-label {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  .score-value {
    font-size: var(--font-size-3xl);
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--text-primary);
  }

  .signals-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
  }

  .signals-section h4 {
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-sm);
    color: var(--text-secondary);
  }

  .signal-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .signal-list li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    line-height: 1.4;
  }

  .signal-list li span {
    flex: 1;
  }
</style>
