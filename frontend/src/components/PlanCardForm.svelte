<!-- PlanCardForm.svelte - Add Provider Plan Card Modal with Provider Dropdown & Card Selection -->
<script lang="ts">
  import type { UiLanguage } from '../types';

  let { language, onSave, onClose }: {
    language: UiLanguage;
    onSave: (plan: ProviderPlan) => void;
    onClose: () => void;
  } = $props();

  function t(en: string, zh: string): string {
    return language === 'zh' ? zh : en;
  }

  export interface ProviderPlan {
    id: string;
    provider: string;
    logo: string;
    plan: string;
    credit: string;
    creditLimit: string;
    cost: string;
    requests: number;
    billingUrl: string;
    color: string;
  }

  interface SnapshotType {
    type: 'plan' | 'usage';
    label: string;
    labelZh: string;
    url: string;
  }

  interface ProviderInfo {
    name: string;
    logo: string;
    color: string;
    snapshotTypes: SnapshotType[];
  }

  const providers: ProviderInfo[] = [
    {
      name: 'Xiaomi MiMo',
      logo: '⚡',
      color: '#f5a623',
      snapshotTypes: [
        { type: 'plan', label: 'Token Plan', labelZh: 'Token Plan', url: 'https://platform.xiaomimimo.com/#/console/plan-manage' },
        { type: 'usage', label: 'Usage Details', labelZh: '用量明细', url: 'https://platform.xiaomimimo.com/#/console/usage' }
      ]
    },
    {
      name: 'OpenAI',
      logo: '🤖',
      color: '#10a37f',
      snapshotTypes: [
        { type: 'plan', label: 'Billing', labelZh: '账单', url: 'https://platform.openai.com/account/billing' }
      ]
    },
    {
      name: 'Anthropic',
      logo: '🧠',
      color: '#d97706',
      snapshotTypes: [
        { type: 'plan', label: 'Billing', labelZh: '账单', url: 'https://console.anthropic.com/settings/billing' }
      ]
    },
    {
      name: 'Google Gemini',
      logo: '💎',
      color: '#4285f4',
      snapshotTypes: [
        { type: 'plan', label: 'Billing', labelZh: '账单', url: 'https://console.cloud.google.com/billing' }
      ]
    },
    {
      name: 'Moonshot (Kimi)',
      logo: '🌙',
      color: '#7c3aed',
      snapshotTypes: [
        { type: 'plan', label: 'Plan', labelZh: '套餐', url: 'https://platform.moonshot.cn/console/billing' }
      ]
    },
    {
      name: 'DeepSeek',
      logo: '🔥',
      color: '#3ecf8e',
      snapshotTypes: [
        { type: 'plan', label: 'Billing', labelZh: '账单', url: 'https://platform.deepseek.com/billing' }
      ]
    },
    {
      name: 'OpenRouter',
      logo: '🌐',
      color: '#6366f1',
      snapshotTypes: [
        { type: 'plan', label: 'Credits', labelZh: '额度', url: 'https://openrouter.ai/credits' }
      ]
    },
    {
      name: 'Together AI',
      logo: '🚀',
      color: '#ec4899',
      snapshotTypes: [
        { type: 'plan', label: 'Billing', labelZh: '账单', url: 'https://api.together.xyz/settings/billing' }
      ]
    },
    {
      name: 'Groq',
      logo: '⚡',
      color: '#f97316',
      snapshotTypes: [
        { type: 'plan', label: 'Billing', labelZh: '账单', url: 'https://console.groq.com/billing' }
      ]
    },
    {
      name: 'Mistral AI',
      logo: '🔷',
      color: '#0ea5e9',
      snapshotTypes: [
        { type: 'plan', label: 'Billing', labelZh: '账单', url: 'https://console.mistral.ai/billing' }
      ]
    }
  ];

  let selectedProvider = $state<ProviderInfo | null>(null);
  let selectedCardIndex = $state(0);
  let customUrl = $state('');
  let showProviderDropdown = $state(false);
  let dropdownPosition = $state({ top: 0, left: 0, width: 0 });
  let dropdownTriggerEl: HTMLElement | undefined = $state();

  function openDropdown() {
    if (dropdownTriggerEl) {
      const rect = dropdownTriggerEl.getBoundingClientRect();
      dropdownPosition = { top: rect.bottom + 6, left: rect.left, width: rect.width };
    }
    showProviderDropdown = true;
  }

  function selectProvider(p: ProviderInfo) {
    selectedProvider = p;
    selectedCardIndex = 0;
    showProviderDropdown = false;
  }

  function selectCard(i: number) {
    selectedCardIndex = i;
  }

  function handleSubmit() {
    if (!selectedProvider) return;
    const snapshot = selectedProvider.snapshotTypes[selectedCardIndex];
    if (!snapshot) return;

    onSave({
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      provider: selectedProvider.name,
      logo: selectedProvider.logo,
      plan: snapshot.type === 'plan' ? t('Token Plan', 'Token Plan') : t('Usage Details', '用量明细'),
      credit: '$0.00',
      creditLimit: '$0.00',
      cost: '$0.00',
      requests: 0,
      billingUrl: customUrl.trim() || '#',
      color: selectedProvider.color,
    });
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" onclick={(e) => { if ((e.target as HTMLElement).classList.contains('modal-overlay')) onClose(); }}>
  <div class="modal-card fade-in">
    <div class="modal-header">
      <h3 class="modal-title">{t('Add Provider', '添加供应商')}</h3>
      <button class="close-btn" onclick={onClose}>✕</button>
    </div>

    <form class="modal-body" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <!-- Provider Dropdown -->
      <div class="field">
        <label class="field-label">{t('Select Provider', '选择供应商')}</label>
        <div class="provider-dropdown">
          <button type="button" class="dropdown-trigger" bind:this={dropdownTriggerEl} onclick={() => showProviderDropdown ? showProviderDropdown = false : openDropdown()}>
            {#if selectedProvider}
              <span class="provider-logo">{selectedProvider.logo}</span>
              <span class="provider-name">{selectedProvider.name}</span>
            {:else}
              <span class="placeholder">{t('Choose a provider...', '选择供应商...')}</span>
            {/if}
            <span class="chevron" class:open={showProviderDropdown}>▾</span>
          </button>
          
          {#if showProviderDropdown}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="dropdown-backdrop" onclick={() => showProviderDropdown = false} onkeydown={() => {}}></div>
            <div class="dropdown-menu fade-in" style="top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; width: {dropdownPosition.width}px; position: fixed;">
              {#each providers as p}
                <button type="button" class="dropdown-item" onclick={() => selectProvider(p)}>
                  <span class="item-logo">{p.logo}</span>
                  <span class="item-name">{p.name}</span>
                  <span class="item-count">{p.snapshotTypes.length}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Preview Cards (clickable to select) -->
      {#if selectedProvider}
        <div class="preview-section">
          <label class="field-label">{t('Select Card Type', '选择卡片类型')}</label>
          <div class="preview-cards">
            {#each selectedProvider.snapshotTypes as snapshot, i}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="preview-card"
                class:selected={selectedCardIndex === i}
                style="border-left: 4px solid {selectedProvider.color}"
                onclick={() => selectCard(i)}
                onkeydown={() => {}}
                role="button"
                tabindex="0"
              >
                <div class="preview-header">
                  <span class="preview-logo">{selectedProvider.logo}</span>
                  <div class="preview-info">
                    <div class="preview-provider">{selectedProvider.name}</div>
                    <div class="preview-plan" style="color: {selectedProvider.color}">
                      {snapshot.type === 'plan' ? t('Token Plan', 'Token Plan') : t('Usage Details', '用量明细')}
                    </div>
                  </div>
                  {#if selectedCardIndex === i}
                    <span class="check-mark">✓</span>
                  {/if}
                </div>
                
                {#if selectedProvider.name === 'Xiaomi MiMo'}
                  {#if snapshot.type === 'plan'}
                    <div class="preview-stats-grid">
                      <div class="preview-stat">
                        <span class="stat-label">{t('Status', '状态')}</span>
                        <span class="stat-value status-ok">connected</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Plan', '套餐')}</span>
                        <span class="stat-value">Xiaomi MiMo Token Plan</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Consumed', '已消耗')}</span>
                        <span class="stat-value">25,534,301 tokens</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Limit', '限额')}</span>
                        <span class="stat-value">1,000,000,000 tokens</span>
                      </div>
                    </div>
                  {:else}
                    <div class="preview-stats-grid">
                      <div class="preview-stat">
                        <span class="stat-label">{t('Status', '状态')}</span>
                        <span class="stat-value status-ok">connected</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Cumulative', '累计消费')}</span>
                        <span class="stat-value">—</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Token History', 'token历史消耗')}</span>
                        <span class="stat-value">25,534,301 tokens</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Input (Hit)', '输入(命中缓存)')}</span>
                        <span class="stat-value">1,000,000,000 tokens</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Input (Miss)', '输入(未命中缓存)')}</span>
                        <span class="stat-value">—</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Output', '输出')}</span>
                        <span class="stat-value">—</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Plugin Calls', '插件服务调用')}</span>
                        <span class="stat-value">—</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Search Calls', '搜索服务调用')}</span>
                        <span class="stat-value">—</span>
                      </div>
                      <div class="preview-stat">
                        <span class="stat-label">{t('Total Cost', '总体消费金额')}</span>
                        <span class="stat-value">—</span>
                      </div>
                    </div>
                  {/if}
                {:else}
                  <div class="preview-stats-grid">
                    <div class="preview-stat">
                      <span class="stat-label">{t('Status', '状态')}</span>
                      <span class="stat-value status-ok">connected</span>
                    </div>
                    <div class="preview-stat">
                      <span class="stat-label">{t('Cost', '花费')}</span>
                      <span class="stat-value">$0.00</span>
                    </div>
                    <div class="preview-stat">
                      <span class="stat-label">{t('Tokens', 'Token')}</span>
                      <span class="stat-value">0</span>
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Billing URL -->
      {#if selectedProvider}
        <div class="field">
          <label class="field-label">{t('Link', '链接')}</label>
          <input type="url" class="url-input" placeholder="https://..." bind:value={customUrl} />
        </div>
      {/if}

      <!-- Actions -->
      <div class="modal-actions">
        <button type="button" class="btn-cancel" onclick={onClose}>{t('Cancel', '取消')}</button>
        <button type="submit" class="btn-save" style="background: {selectedProvider?.color ?? '#3b82f6'}" disabled={!selectedProvider || !customUrl.trim()}>
          {t('Add Provider', '添加供应商')}
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4);
    display: flex; align-items: center; justify-content: center; z-index: 200;
    backdrop-filter: blur(4px);
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .modal-card {
    background: #ffffff; border-radius: 16px; width: 560px; max-width: 95vw;
    max-height: 90vh; overflow: visible; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid #f3f4f6;
  }

  .modal-title { font-size: 18px; font-weight: 600; color: #111827; margin: 0; }

  .close-btn {
    width: 32px; height: 32px; border: none; background: #f3f4f6;
    color: #6b7280; border-radius: 8px; cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center; transition: all 120ms;
  }

  .close-btn:hover { background: #e5e7eb; color: #111827; }

  .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; max-height: 75vh; overflow-y: auto; }

  .field { display: flex; flex-direction: column; gap: 8px; }
  .field-label { font-size: 13px; font-weight: 600; color: #374151; }

  .provider-dropdown { position: relative; }

  .dropdown-trigger {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 10px;
    background: #ffffff; cursor: pointer; transition: all 120ms; text-align: left;
  }

  .dropdown-trigger:hover { border-color: #d1d5db; }
  .provider-logo { font-size: 22px; }
  .provider-name { flex: 1; font-size: 14px; color: #111827; font-weight: 500; }
  .placeholder { flex: 1; font-size: 14px; color: #9ca3af; }
  .chevron { font-size: 11px; color: #9ca3af; transition: transform 200ms; }
  .chevron.open { transform: rotate(180deg); }

  .dropdown-backdrop { position: fixed; inset: 0; z-index: 299; }

  .dropdown-menu {
    position: fixed; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); z-index: 300;
    max-height: 280px; overflow-y: auto;
  }

  .dropdown-item {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 10px 14px; border: none; background: transparent;
    cursor: pointer; transition: background 120ms; text-align: left;
  }

  .dropdown-item:hover { background: #f9fafb; }
  .item-logo { font-size: 20px; }
  .item-name { flex: 1; font-size: 14px; color: #374151; }
  .item-count { font-size: 11px; background: #f3f4f6; color: #6b7280; padding: 2px 6px; border-radius: 6px; }

  .preview-section { }
  .preview-cards { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }

  .preview-card {
    background: #f9fafb; border-radius: 12px; padding: 16px;
    cursor: pointer; transition: all 150ms; border: 2px solid transparent;
  }

  .preview-card:hover { background: #f3f4f6; }
  .preview-card.selected { background: #eff6ff; border-color: #3b82f6; }

  .preview-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .preview-logo { font-size: 26px; }
  .preview-info { flex: 1; }
  .preview-provider { font-size: 14px; font-weight: 600; color: #111827; }
  .preview-plan { font-size: 12px; font-weight: 500; }

  .check-mark {
    width: 24px; height: 24px; background: #3b82f6; color: #ffffff;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700;
  }

  .preview-stats-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px; padding-top: 12px; border-top: 1px solid #e5e7eb;
  }

  .preview-stat { display: flex; flex-direction: column; gap: 3px; }
  .stat-label { font-size: 11px; color: #9ca3af; }
  .stat-value { font-size: 13px; font-weight: 600; color: #111827; font-family: 'SF Mono', monospace; }
  .status-ok { color: #10b981; }

  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 8px; }

  .btn-cancel {
    padding: 10px 20px; border: 1px solid #e5e7eb; border-radius: 10px;
    background: #ffffff; color: #374151; font-size: 14px; cursor: pointer; transition: all 120ms;
  }

  .url-input {
    width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 10px;
    font-size: 13px; color: #111827; outline: none; transition: border-color 120ms;
    font-family: 'SF Mono', monospace;
  }

  .url-input:focus { border-color: #3b82f6; }

  .btn-cancel:hover { background: #f9fafb; }

  .btn-save {
    padding: 10px 24px; border: none; border-radius: 10px;
    color: #ffffff; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 120ms;
  }

  .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-save:hover:not(:disabled) { filter: brightness(1.1); }

  .fade-in { animation: fadeIn 150ms ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
</style>
