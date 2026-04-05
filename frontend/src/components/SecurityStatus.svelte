<!-- SecurityStatus.svelte - Security Risk Summary -->
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

  const findings = [
    {
      severity: 'info' as const,
      title: t('Attack surface overview', '当前暴露面概览'),
      detail: t('Single trusted operator model, high-privilege tools available.', '单一可信操作者模式，高权限工具可用。'),
    },
    {
      severity: 'info' as const,
      title: t('Tailscale Serve detected', '已通过 Tailscale Serve 暴露'),
      detail: t('Gateway is exposed to tailnet, not localhost-only.', 'Gateway 已暴露到 tailnet，不仅限本机。'),
    },
  ];

  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const warnCount = findings.filter(f => f.severity === 'warn').length;
  const infoCount = findings.filter(f => f.severity === 'info').length;
</script>

<Card
  title={t('Security Risk Summary', '安全风险摘要')}
  subtitle={t('Audit findings', '审计结果')}
  {loading}
>
  <StatusStrip items={[
    { label: t('Critical', '高风险'), value: criticalCount },
    { label: t('Warnings', '需关注'), value: warnCount },
    { label: t('Info', '提示'), value: infoCount },
  ]} />

  {#if findings.length === 0}
    <div class="empty-state">{t('No actionable security risk.', '无需要处理的安全风险。')}</div>
  {:else}
    <ul class="findings-list">
      {#each findings.slice(0, 4) as finding}
        <li class="finding-item">
          <Badge status={finding.severity} label={finding.severity.toUpperCase()} />
          <div class="finding-content">
            <strong>{finding.title}</strong>
            <small>{finding.detail}</small>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</Card>

<style>
  .findings-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-top: var(--space-md);
  }

  .finding-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
    padding: var(--space-sm);
    background: var(--bg-input);
    border-radius: var(--radius-sm);
  }

  .finding-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .finding-content strong {
    font-size: var(--font-size-sm);
  }

  .finding-content small {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    line-height: 1.4;
  }

  .empty-state {
    color: var(--text-muted);
    text-align: center;
    padding: var(--space-xl) 0;
    font-size: var(--font-size-sm);
  }
</style>
