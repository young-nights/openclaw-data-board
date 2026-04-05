<!-- Sidebar.svelte - Navigation Sidebar -->
<script lang="ts">
  import type { UiLanguage } from '../types';

  let { activeSection, language, onNavigate }: {
    activeSection: string;
    language: UiLanguage;
    onNavigate: (section: string) => void;
  } = $props();

  const sections = [
    { key: 'overview', icon: '📊', en: 'Overview', zh: '总览' },
    { key: 'team', icon: '👥', en: 'Staff', zh: '员工' },
    { key: 'projects-tasks', icon: '📋', en: 'Tasks', zh: '任务' },
    { key: 'collaboration', icon: '🤝', en: 'Collaboration', zh: '协作' },
    { key: 'memory', icon: '🧠', en: 'Memory', zh: '记忆' },
    { key: 'docs', icon: '📄', en: 'Docs', zh: '文档' },
    { key: 'brain', icon: '💭', en: 'Brain', zh: '智脑' },
    { key: 'usage-cost', icon: '💰', en: 'Usage', zh: '用量' },
    { key: 'settings', icon: '⚙️', en: 'Settings', zh: '设置' },
  ];

  function getLabel(section: typeof sections[number]): string {
    return language === 'zh' ? section.zh : section.en;
  }
</script>

<nav class="sidebar">
  <div class="nav-section">
    {#each sections as section (section.key)}
      <button
        class="nav-item"
        class:active={activeSection === section.key}
        onclick={() => onNavigate(section.key)}
      >
        <span class="nav-icon">{section.icon}</span>
        <span class="nav-label">{getLabel(section)}</span>
        {#if activeSection === section.key}
          <span class="active-indicator"></span>
        {/if}
      </button>
    {/each}
  </div>

  <div class="sidebar-footer">
    <div class="version">v1.0.0</div>
  </div>
</nav>

<style>
  .sidebar {
    width: 200px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .nav-section {
    padding: var(--space-md) var(--space-sm);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border: none;
    background: transparent;
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: var(--font-size-sm);
    transition: all var(--transition-fast);
    position: relative;
    width: 100%;
    text-align: left;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-primary);
  }

  .nav-item.active {
    background: var(--accent-soft);
    color: var(--accent);
    font-weight: 500;
  }

  .nav-icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
  }

  .nav-label {
    flex: 1;
  }

  .active-indicator {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 16px;
    background: var(--accent);
    border-radius: 0 3px 3px 0;
    animation: slideUp 200ms ease-out;
  }

  .sidebar-footer {
    margin-top: auto;
    padding: var(--space-md);
    border-top: 1px solid var(--border-color);
  }

  .version {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
</style>
