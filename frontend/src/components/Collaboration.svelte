<!-- Collaboration.svelte - Collaboration Threads -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import Badge from './common/Badge.svelte';
  import type { UiLanguage } from '../types';

  let { language, loading = false }: {
    language: UiLanguage;
    loading?: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }
</script>

<Card
  title={t('Collaboration Threads', '协作线程')}
  subtitle={t('Agent handoffs and teamwork', '智能体交接与协同')}
  {loading}
>
  <div class="empty-state">
    {t('No active collaboration threads.', '暂无协作线程。')}
  </div>
</Card>

<style>
  .empty-state {
    color: var(--text-muted);
    text-align: center;
    padding: var(--space-xl) 0;
    font-size: var(--font-size-sm);
  }
</style>
