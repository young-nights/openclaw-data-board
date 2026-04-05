<!-- SubscriptionUsage.svelte - Subscription Usage Details -->
<script lang="ts">
  import Card from './common/Card.svelte';
  import Badge from './common/Badge.svelte';
  import type { UiLanguage } from '../types';

  let { language }: { language: UiLanguage } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  // Mock subscription data - would come from API
  const subscription = $state({
    plan: 'Free',
    credit: '$0.00',
    creditLimit: '$0.00',
    totalCost: '$0.0735',
    remainingCredit: '$0.00',
    expiresAt: 'N/A',
  });

  // Mock usage data per model
  const usageByModel = $state([
    {
      model: 'MiMo-V2-Pro',
      color: '#f5a623',
      requests: 6030,
      promptTokens: '31.4M',
      completionTokens: '25.2M',
      cost: '$0.0679',
      avgCostPerRequest: '$0.0000113',
      firstUsed: 'Mar 18, 2026',
      lastUsed: 'Apr 5, 2026 at 8:00 AM',
    },
    {
      model: 'MiMo-V2-Omni',
      color: '#7c9aff',
      requests: 507,
      promptTokens: '16.5M',
      completionTokens: '8.7M',
      cost: '$0.00552',
      avgCostPerRequest: '$0.0000109',
      firstUsed: 'Apr 1, 2026',
      lastUsed: 'Apr 5, 2026 at 8:00 AM',
    },
    {
      model: 'DeepSeek V3',
      color: '#3ecf8e',
      requests: 2,
      promptTokens: '5.5K',
      completionTokens: '5.5K',
      cost: '$0.00004',
      avgCostPerRequest: '$0.00002',
      firstUsed: 'Apr 4, 2026',
      lastUsed: 'Apr 4, 2026 at 8:00 AM',
    },
  ]);

  // Mock API key usage
  const usageByKey = $state([
    { name: 'openclaw-desktop', key: 'sk-...a1b2', requests: 4520, cost: '$0.0520', models: ['MiMo-V2-Pro', 'MiMo-V2-Omni'] },
    { name: 'openclaw-server', key: 'sk-...c3d4', requests: 2019, cost: '$0.0215', models: ['MiMo-V2-Pro', 'DeepSeek V3'] },
  ]);

  let activeTab = $state<'models' | 'keys'>('models');
</script>

<div class="subscription-section">
  <!-- Header -->
  <div class="section-header">
    <div class="header-left">
      <h3 class="section-title">{t('Subscription & Usage Details', '订阅用量明细')}</h3>
      <span class="section-subtitle">{t('Based on your API key configuration', '基于你的 API Key 配置')}</span>
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
      <div class="sub-card-detail">{t('All models combined', '所有模型合计')}</div>
    </div>
    <div class="sub-card">
      <div class="sub-card-label">{t('Credit', '额度')}</div>
      <div class="sub-card-value">{subscription.credit}</div>
      <div class="sub-card-detail">{t('Remaining', '剩余')}: {subscription.remainingCredit}</div>
    </div>
    <div class="sub-card">
      <div class="sub-card-label">{t('Total Requests', '总请求数')}</div>
      <div class="sub-card-value">6,539</div>
      <div class="sub-card-detail">{t('Across all models', '跨所有模型')}</div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tab-bar">
    <button class="tab-btn" class:active={activeTab === 'models'} onclick={() => activeTab = 'models'}>
      {t('By Model', '按模型')}
    </button>
    <button class="tab-btn" class:active={activeTab === 'keys'} onclick={() => activeTab = 'keys'}>
      {t('By API Key', '按 API Key')}
    </button>
  </div>

  <!-- By Model Table -->
  {#if activeTab === 'models'}
    <div class="table-container">
      <table class="detail-table">
        <thead>
          <tr>
            <th>{t('Model', '模型')}</th>
            <th class="num">{t('Requests', '请求数')}</th>
            <th class="num">{t('Prompt Tokens', '输入 Token')}</th>
            <th class="num">{t('Completion Tokens', '输出 Token')}</th>
            <th class="num highlight">{t('Cost ($)', '花费 ($)')}</th>
            <th class="num">{t('Avg Cost/Req', '平均花费')}</th>
            <th>{t('First Used', '首次使用')}</th>
            <th>{t('Last Used', '最近使用')}</th>
          </tr>
        </thead>
        <tbody>
          {#each usageByModel as row}
            <tr>
              <td class="model-cell">
                <span class="model-dot" style="background: {row.color}"></span>
                {row.model}
              </td>
              <td class="num">{row.requests.toLocaleString()}</td>
              <td class="num">{row.promptTokens}</td>
              <td class="num">{row.completionTokens}</td>
              <td class="num highlight">{row.cost}</td>
              <td class="num">{row.avgCostPerRequest}</td>
              <td class="date-cell">{row.firstUsed}</td>
              <td class="date-cell">{row.lastUsed}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- By API Key Table -->
  {#if activeTab === 'keys'}
    <div class="table-container">
      <table class="detail-table">
        <thead>
          <tr>
            <th>{t('API Key', 'API Key')}</th>
            <th>{t('Name', '名称')}</th>
            <th class="num">{t('Requests', '请求数')}</th>
            <th class="num highlight">{t('Cost ($)', '花费 ($)')}</th>
            <th>{t('Models Used', '使用的模型')}</th>
          </tr>
        </thead>
        <tbody>
          {#each usageByKey as row}
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
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .subscription-section {
    max-width: 1400px;
    margin: 0 auto;
  }

  .section-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .section-subtitle {
    font-size: 13px;
    color: #9ca3af;
    margin-top: 4px;
    display: block;
  }

  /* Sub Cards Row */
  .sub-cards-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 900px) {
    .sub-cards-row { grid-template-columns: repeat(2, 1fr); }
  }

  .sub-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    transition: all 200ms;
  }

  .sub-card:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .sub-card-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }

  .sub-card-value {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 6px;
  }

  .sub-card-value.cost { color: #f5a623; }

  .sub-card-detail {
    font-size: 12px;
    color: #9ca3af;
  }

  /* Tabs */
  .tab-bar {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0;
  }

  .tab-btn {
    padding: 10px 20px;
    border: none;
    background: transparent;
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 120ms;
  }

  .tab-btn:hover { color: #111827; }

  .tab-btn.active {
    color: #111827;
    border-bottom-color: #3b82f6;
  }

  /* Table */
  .table-container { overflow-x: auto; }

  .detail-table {
    width: 100%;
    border-collapse: collapse;
  }

  .detail-table th {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
    white-space: nowrap;
  }

  .detail-table th.num { text-align: right; }
  .detail-table th.highlight { color: #111827; font-weight: 600; }

  .detail-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
    color: #374151;
  }

  .detail-table td.num {
    text-align: right;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 13px;
    color: #6b7280;
  }

  .detail-table td.highlight {
    color: #111827;
    font-weight: 600;
  }

  .detail-table tbody tr:hover {
    background: #f9fafb;
  }

  .model-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'SF Mono', monospace;
    font-size: 13px;
    color: #111827;
  }

  .model-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .date-cell {
    font-size: 12px;
    color: #9ca3af;
    white-space: nowrap;
  }

  .key-cell {
    font-family: 'SF Mono', monospace;
    font-size: 13px;
  }

  .model-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .model-tag {
    font-size: 11px;
    padding: 2px 8px;
    background: #f3f4f6;
    color: #374151;
    border-radius: 6px;
    font-family: 'SF Mono', monospace;
  }
</style>
