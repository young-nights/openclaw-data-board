<!-- TaskBoard.svelte - Task Board with Kanban -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import Badge from './common/Badge.svelte';
  import type { UiLanguage, TaskState } from '../types';

  let { language, loading = false }: {
    language: UiLanguage;
    loading?: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  const columns: { key: TaskState; en: string; zh: string; color: string }[] = [
    { key: 'todo', en: 'To Do', zh: '待办', color: 'var(--text-muted)' },
    { key: 'in_progress', en: 'In Progress', zh: '进行中', color: 'var(--accent)' },
    { key: 'blocked', en: 'Blocked', zh: '阻塞', color: 'var(--danger)' },
    { key: 'done', en: 'Done', zh: '已完成', color: 'var(--ok)' },
  ];
</script>

<Card
  title={t('Task Board', '任务看板')}
  subtitle={t('Current tasks by status', '按状态分类的任务')}
  {loading}
>
  <div class="kanban-board">
    {#each columns as col}
      <div class="kanban-column">
        <div class="column-header" style:border-color={col.color}>
          <span class="column-title">{t(col.en, col.zh)}</span>
          <span class="column-count">0</span>
        </div>
        <div class="column-body">
          <div class="empty-column">{t('No tasks', '暂无任务')}</div>
        </div>
      </div>
    {/each}
  </div>
</Card>

<style>
  .kanban-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-md);
    min-height: 200px;
  }

  .kanban-column {
    display: flex;
    flex-direction: column;
  }

  .column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm) var(--space-md);
    border-bottom: 2px solid;
    margin-bottom: var(--space-sm);
  }

  .column-title {
    font-size: var(--font-size-sm);
    font-weight: 600;
  }

  .column-count {
    font-size: var(--font-size-xs);
    font-family: var(--font-mono);
    background: var(--bg-input);
    padding: 2px 8px;
    border-radius: var(--radius-full);
  }

  .column-body {
    flex: 1;
  }

  .empty-column {
    color: var(--text-muted);
    font-size: var(--font-size-xs);
    text-align: center;
    padding: var(--space-lg);
  }
</style>
