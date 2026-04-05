<!-- UpdateStatus.svelte - Update Status Card -->
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

  const currentVersion = '1.0.0';
  const latestVersion = '1.0.0';
  const updateAvailable = currentVersion !== latestVersion;
</script>

<Card
  title={t('Update Status', '更新状态')}
  subtitle={updateAvailable ? t('Newer version available', '发现了更新版本') : t('Up to date', '已是最新')}
  {loading}
>
  <StatusStrip items={[
    { label: t('Current', '当前版本'), value: currentVersion },
    { label: t('Latest', '最新版本'), value: latestVersion },
    { label: t('Channel', '更新通道'), value: 'stable' },
  ]} />

  <div class="update-meta">
    <span>{t('Install method', '安装方式')}: npm</span>
    <span>·</span>
    <span>{t('Package manager', '包管理器')}: pnpm</span>
  </div>
</Card>

<style>
  .update-meta {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-md);
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }
</style>
