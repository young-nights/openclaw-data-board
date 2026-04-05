<!-- TeamOverview.svelte - Team Overview -->
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

  const team = [
    { id: 'main', name: '龙虾主管', role: t('Orchestrator', '总调度'), model: 'xiaomi/mimo-v2-pro', sessions: 2, cronJobs: 0 },
    { id: 'coder', name: '设计师', role: t('Code & Design', '编码与设计'), model: 'xiaomi/mimo-v2-pro', sessions: 0, cronJobs: 0 },
    { id: 'secretary', name: '秘书', role: t('Secretary', '秘书'), model: 'xiaomi/mimo-v2-pro', sessions: 0, cronJobs: 0 },
    { id: 'analyst', name: '产品分析员', role: t('Analysis', '调研分析'), model: 'xiaomi/mimo-v2-pro', sessions: 0, cronJobs: 0 },
    { id: 'evaluator', name: '评估员', role: t('Code Review', '代码评估'), model: 'xiaomi/mimo-v2-pro', sessions: 0, cronJobs: 0 },
  ];
</script>

<Card
  title={t('Team Overview', '团队总览')}
  subtitle={t('Staff, roles and assignments', '员工、角色与分工')}
  {loading}
>
  <table class="team-table">
    <thead>
      <tr>
        <th>{t('Agent', '智能体')}</th>
        <th>{t('Role', '角色')}</th>
        <th>{t('Model', '模型')}</th>
        <th>{t('Sessions', '会话')}</th>
        <th>{t('Cron', '定时任务')}</th>
      </tr>
    </thead>
    <tbody>
      {#each team as member}
        <tr>
          <td>
            <div class="member-cell">
              <strong>{member.name}</strong>
              <small>{member.id}</small>
            </div>
          </td>
          <td>{member.role}</td>
          <td><code>{member.model.split('/').pop()}</code></td>
          <td>{member.sessions}</td>
          <td>{member.cronJobs}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</Card>

<style>
  .team-table {
    width: 100%;
  }

  .member-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .member-cell strong {
    font-size: var(--font-size-sm);
  }

  .member-cell small {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    font-family: var(--font-mono);
  }

  code {
    background: var(--bg-input);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
  }
</style>
