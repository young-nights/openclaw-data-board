<!-- SubscriptionUsage.svelte - Subscription Usage Details with Agent/Model/Key tabs -->
<script lang="ts">
  import type { UiLanguage } from '../types';

  let { language }: { language: UiLanguage } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  let activeTab = $state<'agent' | 'model' | 'key'>('agent');

  // Mock subscription data
  const subscription = $state({
    plan: 'Free',
    credit: '$0.00',
    creditLimit: '$0.00',
    totalCost: '$0.0735',
    remainingCredit: '$0.00',
    expiresAt: 'N/A',
  });

  // Agent data - each agent has assigned model and usage
  const agentData = [
    { agent: 'main', icon: '🦞', model: 'MiMo-V2-Pro', requests: 2100, tokens: '220M', cost: '$0.032', pct: 43 },
    { agent: 'coder', icon: '🐒', model: 'MiMo-V2-Pro', requests: 1800, tokens: '180M', cost: '$0.028', pct: 38 },
    { agent: 'secretary', icon: '🦊', model: 'MiMo-V2-Flash', requests: 1200, tokens: '45M', cost: '$0.005', pct: 7 },
    { agent: 'analyst', icon: '🦉', model: 'DeepSeek V3', requests: 850, tokens: '95M', cost: '$0.006', pct: 8 },
    { agent: 'evaluator', icon: '🐻', model: 'MiMo-V2-Pro', requests: 589, tokens: '68M', cost: '$0.006', pct: 4 },
  ];

  // Model data
  const modelData = [
    { model: 'MiMo-V2-Pro', color: '#f5a623', requests: 4489, tokens: '468M', cost: '$0.066', agents: ['main', 'coder', 'evaluator'] },
    { model: 'MiMo-V2-Omni', color: '#7c9aff', requests: 507, tokens: '25M', cost: '$0.00552', agents: ['main'] },
    { model: 'DeepSeek V3', color: '#3ecf8e', requests: 852, tokens: '95M', cost: '$0.006', agents: ['analyst'] },
    { model: 'MiMo-V2-Flash', color: '#f472b6', requests: 1200, tokens: '45M', cost: '$0.005', agents: ['secretary'] },
  ];

  // API Key data
  const keyData = [
    { name: 'openclaw-desktop', key: 'sk-...a1b2', requests: 4520, cost: '$0.0520', models: ['MiMo-V2-Pro', 'MiMo-V2-Omni'], agents: ['main', 'coder'] },
    { name: 'openclaw-server', key: 'sk-...c3d4', requests: 2019, cost: '$0.0215', models: ['MiMo-V2-Pro', 'DeepSeek V3'], agents: ['evaluator', 'analyst'] },
  ];

  // Agent detail state
  let expandedAgent = $state<string | null>(null);

  // Daily trend mock data
  function genTrend(base: number): number[] {
    return Array.from({ length: 7 }, (_, i) => Math.round(base * (0.6 + Math.random() * 0.8)));
  }

  const agentTrends: Record<string, number[]> = {
    main: genTrend(300),
    coder: genTrend(257),
    secretary: genTrend(171),
    analyst: genTrend(121),
    evaluator: genTrend(84),
  };

  const weekLabels = ['Mar 30', 'Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5'];
</script>

<div class="subscription-section">
  <!-- Header -->
  <div class="section-header">
    <div class="header-left">
      <h3 class="section-title">{t('Subscription & Usage Details', '订阅用量明细')}</h3>
      <span class="section-subtitle">{t('Track consumption across agents, models, and API keys', '追踪各 Agent、模型和 API Key 的消耗')}</span>
    </div>
  </div>

  <!-- Subscription Overview Cards -->
  <div class="sub-cards-row">
    <div class="sub-card">
      <div class="sub-card-label">{t('Current Plan', '当前套餐')}</div>
      <div class="sub-card-value">{subscription.plan}</div>
      <div class="sub-card-detail">{t('Expires', '到期')}: {subscription.expiresAt}</div>
    </div>
    <div class="sub-card">
      <div class="sub-card-label">{t('Total Cost', '总花费')}</div>
      <div class="sub-card-value cost">{subscription.totalCost}</div>
      <div class="sub-card-detail">{t('All agents combined', '所有 Agent 合计')}</div>
    </div>
    <div class="sub-card">
      <div class="sub-card-label">{t('Active Agents', '活跃 Agent')}</div>
      <div class="sub-card-value">5</div>
      <div class="sub-card-detail">{t('Across 4 models', '使用 4 个模型')}</div>
    </div>
    <div class="sub-card">
      <div class="sub-card-label">{t('Total Requests', '总请求数')}</div>
      <div class="sub-card-value">6,539</div>
      <div class="sub-card-detail">{t('Last 7 days', '近 7 天')}</div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tab-bar">
    <button class="tab-btn" class:active={activeTab === 'agent'} onclick={() => activeTab = 'agent'}>
      {t('By Agent', '按 Agent')}
    </button>
    <button class="tab-btn" class:active={activeTab === 'model'} onclick={() => activeTab = 'model'}>
      {t('By Model', '按模型')}
    </button>
    <button class="tab-btn" class:active={activeTab === 'key'} onclick={() => activeTab = 'key'}>
      {t('By API Key', '按 API Key')}
    </button>
  </div>

  <!-- By Agent -->
  {#if activeTab === 'agent'}
    <div class="table-container">
      <table class="detail-table">
        <thead>
          <tr>
            <th>{t('Agent', 'Agent')}</th>
            <th>{t('Assigned Model', '分配模型')}</th>
            <th class="num">{t('Requests', '请求数')}</th>
            <th class="num">{t('Tokens', 'Token')}</th>
            <th class="num highlight">{t('Cost', '花费')}</th>
            <th class="num">% {t('of Total', '占比')}</th>
            <th class="num">{t('Trend (7d)', '趋势')}</th>
          </tr>
        </thead>
        <tbody>
          {#each agentData as row}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <tr class="clickable-row" class:expanded={expandedAgent === row.agent} onclick={() => expandedAgent = expandedAgent === row.agent ? null : row.agent}>
              <td class="agent-cell">
                <span class="agent-icon">{row.icon}</span>
                <span class="agent-name">{row.agent}</span>
                <span class="expand-indicator">{expandedAgent === row.agent ? '▾' : '▸'}</span>
              </td>
              <td class="model-cell">
                <span class="model-tag">{row.model}</span>
              </td>
              <td class="num">{row.requests.toLocaleString()}</td>
              <td class="num">{row.tokens}</td>
              <td class="num highlight">{row.cost}</td>
              <td class="num">
                <div class="pct-bar-wrap">
                  <div class="pct-bar" style="width: {row.pct}%"></div>
                  <span class="pct-label">{row.pct}%</span>
                </div>
              </td>
              <td class="num trend-cell">
                <div class="mini-trend">
                  {#each agentTrends[row.agent] as val, i}
                    <div class="trend-bar" style="height: {(val / Math.max(...agentTrends[row.agent])) * 100}%"></div>
                  {/each}
                </div>
              </td>
            </tr>
            {#if expandedAgent === row.agent}
              <tr class="detail-row">
                <td colspan="7">
                  <div class="agent-detail fade-in">
                    <div class="detail-section">
                      <div class="detail-title">{t('Daily Requests (Last 7 Days)', '每日请求数（近 7 天）')}</div>
                      <div class="detail-chart">
                        {#each agentTrends[row.agent] as val, i}
                          <div class="detail-chart-col">
                            <div class="detail-chart-bar-wrap">
                              <div class="detail-chart-bar" style="height: {(val / Math.max(...agentTrends[row.agent])) * 100}%"></div>
                            </div>
                            <div class="detail-chart-label">{weekLabels[i]}</div>
                          </div>
                        {/each}
                      </div>
                    </div>
                    <div class="detail-stats">
                      <div class="detail-stat">
                        <span class="stat-label">{t('Avg Daily Requests', '日均请求数')}</span>
                        <span class="stat-value">{Math.round(row.requests / 7).toLocaleString()}</span>
                      </div>
                      <div class="detail-stat">
                        <span class="stat-label">{t('Avg Cost/Request', '单次平均花费')}</span>
                        <span class="stat-value">{(parseFloat(row.cost.replace('$', '')) / row.requests).toFixed(6)}</span>
                      </div>
                      <div class="detail-stat">
                        <span class="stat-label">{t('Peak Day', '峰值日')}</span>
                        <span class="stat-value">Apr 5</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- By Model -->
  {#if activeTab === 'model'}
    <div class="table-container">
      <table class="detail-table">
        <thead>
          <tr>
            <th>{t('Model', '模型')}</th>
            <th class="num">{t('Requests', '请求数')}</th>
            <th class="num">{t('Tokens', 'Token')}</th>
            <th class="num highlight">{t('Cost', '花费')}</th>
            <th>{t('Used By', '使用者')}</th>
          </tr>
        </thead>
        <tbody>
          {#each modelData as row}
            <tr>
              <td class="model-cell">
                <span class="model-dot" style="background: {row.color}"></span>
                <span class="model-name">{row.model}</span>
              </td>
              <td class="num">{row.requests.toLocaleString()}</td>
              <td class="num">{row.tokens}</td>
              <td class="num highlight">{row.cost}</td>
              <td>
                <div class="agent-tags">
                  {#each row.agents as a}
                    <span class="agent-tag">{agentData.find(d => d.agent === a)?.icon ?? ''} {a}</span>
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- By API Key -->
  {#if activeTab === 'key'}
    <div class="table-container">
      <table class="detail-table">
        <thead>
          <tr>
            <th>API Key</th>
            <th>{t('Name', '名称')}</th>
            <th class="num">{t('Requests', '请求数')}</th>
            <th class="num highlight">{t('Cost', '花费')}</th>
            <th>{t('Models', '模型')}</th>
            <th>{t('Agents', 'Agent')}</th>
          </tr>
        </thead>
        <tbody>
          {#each keyData as row}
            <tr>
              <td class="key-cell">🔑 {row.key}</td>
              <td>{row.name}</td>
              <td class="num">{row.requests.toLocaleString()}</td>
              <td class="num highlight">{row.cost}</td>
              <td>
                <div class="model-tags">
                  {#each row.models as m}
                    <span class="model-tag">{m}</span>
                  {/each}
                </div>
              </td>
              <td>
                <div class="agent-tags">
                  {#each row.agents as a}
                    <span class="agent-tag">{agentData.find(d => d.agent === a)?.icon ?? ''} {a}</span>
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .subscription-section { max-width: 1400px; margin: 0 auto; }

  .section-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .section-title { font-size: 20px; font-weight: 600; color: #111827; margin: 0; }
  .section-subtitle { font-size: 13px; color: #9ca3af; margin-top: 4px; display: block; }

  /* Sub Cards Row */
  .sub-cards-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  @media (max-width: 900px) { .sub-cards-row { grid-template-columns: repeat(2, 1fr); } }

  .sub-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; transition: all 200ms; }
  .sub-card:hover { border-color: #d1d5db; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); }
  .sub-card-label { font-size: 12px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px; }
  .sub-card-value { font-size: 28px; font-weight: 700; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; letter-spacing: -0.02em; line-height: 1; margin-bottom: 6px; }
  .sub-card-value.cost { color: #f5a623; }
  .sub-card-detail { font-size: 12px; color: #9ca3af; }

  /* Tabs */
  .tab-bar { display: flex; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
  .tab-btn { padding: 10px 20px; border: none; background: transparent; color: #6b7280; font-size: 14px; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 120ms; }
  .tab-btn:hover { color: #111827; }
  .tab-btn.active { color: #111827; border-bottom-color: #3b82f6; }

  /* Table */
  .table-container { overflow-x: auto; }
  .detail-table { width: 100%; border-collapse: collapse; }
  .detail-table th { font-size: 12px; font-weight: 500; color: #6b7280; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: left; white-space: nowrap; }
  .detail-table th.num { text-align: right; }
  .detail-table th.highlight { color: #111827; font-weight: 600; }
  .detail-table td { padding: 14px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
  .detail-table td.num { text-align: right; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; color: #6b7280; }
  .detail-table td.highlight { color: #111827; font-weight: 600; }
  .detail-table tbody tr:hover { background: #f9fafb; }

  .clickable-row { cursor: pointer; }
  .clickable-row.expanded { background: #f0f7ff; }

  .agent-cell { display: flex; align-items: center; gap: 8px; }
  .agent-icon { font-size: 16px; }
  .agent-name { font-weight: 600; color: #111827; font-family: 'SF Mono', monospace; }
  .expand-indicator { color: #9ca3af; font-size: 11px; margin-left: 4px; }

  .model-cell { }
  .model-tag { font-size: 12px; padding: 3px 8px; background: #f3f4f6; color: #374151; border-radius: 6px; font-family: 'SF Mono', monospace; }

  .model-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; display: inline-block; vertical-align: middle; margin-right: 8px; }
  .model-name { font-family: 'SF Mono', monospace; font-size: 13px; color: #111827; }

  .key-cell { font-family: 'SF Mono', monospace; font-size: 13px; }

  .model-tags, .agent-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .agent-tag { font-size: 11px; padding: 2px 8px; background: #eff6ff; color: #2563eb; border-radius: 6px; }

  /* Percentage bar */
  .pct-bar-wrap { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
  .pct-bar { height: 6px; background: #3b82f6; border-radius: 3px; min-width: 4px; max-width: 60px; }
  .pct-label { font-size: 12px; color: #6b7280; min-width: 32px; text-align: right; }

  /* Mini trend */
  .trend-cell { min-width: 100px; }
  .mini-trend { display: flex; align-items: flex-end; gap: 2px; height: 28px; justify-content: flex-end; }
  .trend-bar { width: 8px; background: #3b82f6; border-radius: 2px 2px 0 0; min-height: 2px; transition: height 300ms; }

  /* Agent Detail Row */
  .detail-row td { padding: 0; background: #f9fafb; }
  .agent-detail { padding: 20px 24px; }
  .detail-section { margin-bottom: 16px; }
  .detail-title { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 12px; }

  .detail-chart { display: flex; gap: 8px; height: 120px; align-items: flex-end; }
  .detail-chart-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .detail-chart-bar-wrap { width: 100%; height: 100px; display: flex; align-items: flex-end; justify-content: center; }
  .detail-chart-bar { width: 28px; background: #3b82f6; border-radius: 4px 4px 0 0; transition: height 350ms cubic-bezier(0.22, 1, 0.36, 1); }
  .detail-chart-label { font-size: 10px; color: #9ca3af; }

  .detail-stats { display: flex; gap: 32px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
  .detail-stat { display: flex; flex-direction: column; gap: 2px; }
  .stat-label { font-size: 11px; color: #9ca3af; }
  .stat-value { font-size: 14px; font-weight: 600; color: #111827; font-family: 'SF Mono', monospace; }

  .fade-in { animation: fadeIn 200ms ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
</style>
