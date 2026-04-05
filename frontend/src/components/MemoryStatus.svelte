<!-- MemoryStatus.svelte - Agent Memory Status -->
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

  const agents = [
    { id: 'main', name: '龙虾主管', files: 12, chunks: 84, searchable: true, status: 'ok' as const },
    { id: 'coder', name: '设计师', files: 5, chunks: 32, searchable: true, status: 'ok' as const },
    { id: 'secretary', name: '秘书', files: 8, chunks: 56, searchable: true, status: 'ok' as const },
    { id: 'analyst', name: '产品分析员', files: 3, chunks: 18, searchable: false, status: 'warn' as const },
    { id: 'evaluator', name: '评估员', files: 0, chunks: 0, searchable: false, status: 'blocked' as const },
  ];

  const okCount = agents.filter(a => a.status === 'ok').length;
  const warnCount = agents.filter(a => a.status === 'warn').length;
  const blockedCount = agents.filter(a => a.status === 'blocked').length;
</script>

<Card
  title={t('Memory Status', '记忆状态')}
  subtitle={t('Agent memory health', '智能体记忆健康状态')}
  {loading}
>
  <StatusStrip items={[
    { label: t('Healthy', '正常'), value: okCount },
    { label: t('Needs Attention', '需关注'), value: warnCount },
    { label: t('Unavailable', '不可用'), value: blockedCount },
  ]} />

  <div class="memory-list">
    {#each agents as agent}
      <div class="memory-row">
        <div class="agent-info">
          <strong>{agent.name}</strong>
          <small>
            {agent.files} {t('files', '份记忆')} ·
            {agent.chunks} {t('chunks', '个块')} ·
            {agent.searchable ? t('Searchable', '可搜索') : t('Search not ready', '搜索未就绪')}
          </small>
        </div>
        <Badge status={agent.status} label={agent.searchable ? t('Ready', '可用') : t('Check', '检查')} />
      </div>
    {/each}
  </div>
</Card>

<style>
  .memory-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-top: var(--space-md);
  }

  .memory-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--border-color);
  }

  .memory-row:last-child {
    border-bottom: none;
  }

  .agent-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .agent-info strong {
    font-size: var(--font-size-sm);
  }

  .agent-info small {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }
</style>
