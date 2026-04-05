<!-- TaskCertainty.svelte - Execution Certainty Board -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import Badge from './common/Badge.svelte';
  import type { UiLanguage, TaskCertaintyCard as TaskCertaintyType } from '../types';

  let { language, loading = false }: {
    language: UiLanguage;
    loading?: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  // Mock data for now
  const cards: TaskCertaintyType[] = [];
</script>

<Card
  title={t('Execution Certainty', '执行确定性')}
  subtitle={t('Whether tasks are really being carried', '任务是否真的被推进')}
  {loading}
>
  {#if cards.length === 0}
    <div class="empty-state">
      {t('No in-flight task under current filter.', '当前筛选下没有进行中的任务。')}
    </div>
  {:else}
    <div class="certainty-stats">
      <div class="stat-item ok">
        <span>{t('Strong Evidence', '证据充分')}</span>
        <strong>{cards.filter(c => c.tone === 'ok').length}</strong>
      </div>
      <div class="stat-item warn">
        <span>{t('Needs Follow-up', '还需跟进')}</span>
        <strong>{cards.filter(c => c.tone === 'warn').length}</strong>
      </div>
      <div class="stat-item blocked">
        <span>{t('Weak Evidence', '证据偏弱')}</span>
        <strong>{cards.filter(c => c.tone === 'blocked').length}</strong>
      </div>
    </div>

    <div class="task-list">
      {#each cards.slice(0, 8) as card}
        <a class="task-card" href={card.detailHref}>
          <div class="task-info">
            <strong>{card.title}</strong>
            <small>
              <Badge status={card.tone} label={card.toneLabel} /> ·
              {card.projectTitle} · {t('Owner', '负责人')} {card.owner}
            </small>
            <small class="summary">{card.summary}</small>
            <small class="evidence">
              {t('Confirmed', '已确认')}：{card.evidence.join(' · ') || t('No direct evidence.', '暂无直接证据。')}
            </small>
          </div>
          <div class="task-score">{card.score}</div>
        </a>
      {/each}
    </div>
  {/if}
</Card>

<style>
  .empty-state {
    color: var(--text-muted);
    text-align: center;
    padding: var(--space-xl) 0;
    font-size: var(--font-size-sm);
  }

  .certainty-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .stat-item {
    text-align: center;
    padding: var(--space-md);
    border-radius: var(--radius-md);
    background: var(--bg-input);
  }

  .stat-item span {
    display: block;
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin-bottom: var(--space-xs);
  }

  .stat-item strong {
    font-size: var(--font-size-2xl);
    font-family: var(--font-mono);
  }

  .stat-item.ok strong { color: var(--ok); }
  .stat-item.warn strong { color: var(--warn); }
  .stat-item.blocked strong { color: var(--danger); }

  .task-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .task-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    background: var(--bg-input);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .task-card:hover {
    border-color: var(--border-active);
    transform: translateX(2px);
  }

  .task-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .task-info strong {
    font-size: var(--font-size-sm);
    color: var(--text-primary);
  }

  .task-info small {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    line-height: 1.4;
  }

  .summary {
    color: var(--text-secondary) !important;
  }

  .task-score {
    font-size: var(--font-size-xl);
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--text-primary);
    min-width: 40px;
    text-align: right;
  }
</style>
