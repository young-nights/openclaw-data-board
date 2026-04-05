<!-- Dashboard.svelte - Main Dashboard Container -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import GlobalVisibility from './GlobalVisibility.svelte';
  import ConnectionHealth from './ConnectionHealth.svelte';
  import BrainSection from './BrainSection.svelte';
  import TeamOverview from './TeamOverview.svelte';
  import OfficeSpace from './OfficeSpace.svelte';
  import TaskBoard from './TaskBoard.svelte';
  import TaskCertainty from './TaskCertainty.svelte';
  import Collaboration from './Collaboration.svelte';
  import MemoryStatus from './MemoryStatus.svelte';
  import DocsSection from './DocsSection.svelte';
  import UsageCost from './UsageCost.svelte';
  import InformationCertainty from './InformationCertainty.svelte';
  import ContextPressure from './ContextPressure.svelte';
  import SecurityStatus from './SecurityStatus.svelte';
  import UpdateStatus from './UpdateStatus.svelte';
  import ActivityPage from './ActivityPage.svelte';
  import type { UiLanguage, BrainTimelineItem } from '../types';

  let { section, language, brainTimeline, loading, error, compactMode }: {
    section: string;
    language: UiLanguage;
    brainTimeline: BrainTimelineItem[];
    loading: boolean;
    error: string | null;
    compactMode: boolean;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }
</script>

<div class="dashboard">
  {#if error}
    <div class="error-banner">
      <span>⚠️ {error}</span>
    </div>
  {/if}

  {#if section === 'overview'}
    <div class="dashboard-grid">
      <div class="full-width">
        <GlobalVisibility {language} {loading} />
      </div>
      <ConnectionHealth {language} {loading} />
      <InformationCertainty {language} {loading} />
      <div class="full-width">
        <BrainSection {language} items={brainTimeline} {loading} />
      </div>
      <SecurityStatus {language} {loading} />
      <UpdateStatus {language} {loading} />
    </div>

  {:else if section === 'brain'}
    <BrainSection {language} items={brainTimeline} {loading} expanded />

  {:else if section === 'team'}
    <div class="dashboard-grid">
      <TeamOverview {language} {loading} />
      <OfficeSpace {language} {loading} />
    </div>

  {:else if section === 'projects-tasks'}
    <div class="dashboard-grid">
      <TaskBoard {language} {loading} />
      <TaskCertainty {language} {loading} />
    </div>

  {:else if section === 'collaboration'}
    <Collaboration {language} {loading} />

  {:else if section === 'memory'}
    <MemoryStatus {language} {loading} />

  {:else if section === 'docs'}
    <DocsSection {language} {loading} />

  {:else if section === 'usage-cost'}
    <div class="usage-page">
      <ActivityPage {language} />
      <div class="usage-section">
        <ContextPressure {language} {loading} />
      </div>
    </div>

  {:else if section === 'settings'}
    <div class="dashboard-grid">
      <Card title={t('Settings', '设置')} subtitle={t('Configuration', '配置')}>
        <div class="settings-list">
          <div class="setting-row">
            <span>{t('Language', '语言')}</span>
            <span class="mono">{language === 'zh' ? '中文' : 'English'}</span>
          </div>
          <div class="setting-row">
            <span>{t('Readonly Mode', '只读模式')}</span>
            <span class="badge-ok">{t('Enabled', '已启用')}</span>
          </div>
          <div class="setting-row">
            <span>{t('Gateway', '网关连接')}</span>
            <span class="badge-ok">Connected</span>
          </div>
          <div class="setting-row">
            <span>{t('Port', '端口')}</span>
            <span class="mono">4320</span>
          </div>
          <div class="setting-row">
            <span>{t('Frontend', '前端框架')}</span>
            <span class="mono">Svelte 5 + Vite</span>
          </div>
          <div class="setting-row">
            <span>{t('Bundle Size (gzip)', '包大小 (gzip)')}</span>
            <span class="mono">~37 KB</span>
          </div>
        </div>
      </Card>
      <SecurityStatus {language} {loading} />
      <UpdateStatus {language} {loading} />
    </div>
  {/if}
</div>

<style>
  .dashboard {
    max-width: 1400px;
    margin: 0 auto;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
  }

  @media (max-width: 900px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  .full-width {
    grid-column: 1 / -1;
  }

  .error-banner {
    background: var(--danger-soft);
    color: var(--danger);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-lg);
    font-size: var(--font-size-sm);
  }

  .settings-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--border-color);
    font-size: var(--font-size-sm);
  }

  .setting-row:last-child {
    border-bottom: none;
  }

  .mono {
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
  }

  .badge-ok {
    background: var(--ok-soft);
    color: var(--ok);
    padding: 2px 8px;
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: 600;
  }

  .usage-page {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .usage-section {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
  }
</style>
