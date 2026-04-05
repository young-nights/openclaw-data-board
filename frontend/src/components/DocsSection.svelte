<!-- DocsSection.svelte - Documents Section -->
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

  const docs = [
    { name: 'README.md', desc: t('Project overview', '项目概览'), href: '/docs/readme' },
    { name: 'RUNBOOK.md', desc: t('Operations guide', '运维手册'), href: '/docs/runbook' },
    { name: 'ARCHITECTURE.md', desc: t('Architecture design', '架构设计'), href: '/docs/architecture' },
    { name: 'PROGRESS.md', desc: t('Development progress', '开发进度'), href: '/docs/progress' },
  ];
</script>

<Card
  title={t('Documents', '文档')}
  subtitle={t('Project documentation', '项目文档')}
  {loading}
>
  <div class="doc-list">
    {#each docs as doc}
      <a class="doc-item" href={doc.href}>
        <div class="doc-icon">📄</div>
        <div class="doc-info">
          <strong>{doc.name}</strong>
          <small>{doc.desc}</small>
        </div>
        <span class="doc-arrow">→</span>
      </a>
    {/each}
  </div>
</Card>

<style>
  .doc-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .doc-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--bg-input);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .doc-item:hover {
    border-color: var(--border-active);
    transform: translateX(2px);
  }

  .doc-icon {
    font-size: 1.25rem;
  }

  .doc-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .doc-info strong {
    font-size: var(--font-size-sm);
    color: var(--text-primary);
  }

  .doc-info small {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  .doc-arrow {
    color: var(--text-muted);
    transition: color var(--transition-fast);
  }

  .doc-item:hover .doc-arrow {
    color: var(--accent);
  }
</style>
