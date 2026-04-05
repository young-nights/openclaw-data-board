<!-- PlanCardForm.svelte - Add/Edit Provider Plan Card Modal -->
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

  let provider = $state('');
  let logo = $state('⚡');
  let plan = $state('Free');
  let creditLimit = $state('0.00');
  let billingUrl = $state('');
  let color = $state('#3b82f6');

  const planOptions = ['Free', 'Pro', 'Team', 'Enterprise', 'Custom'];
  const colorOptions = ['#3b82f6', '#f5a623', '#3ecf8e', '#8b5cf6', '#ef4444', '#f472b6', '#06b6d4', '#84cc16'];
  const logoOptions = ['⚡', '🧠', '🔥', '💎', '🚀', '🌐', '🤖', '🎯', '☁️', '🔮', '⭐', '🔷', '🟠', '🟢', '🔴', '💜'];

  let showLogoPicker = $state(false);
  let showColorPicker = $state(false);

  const isValid = $derived(provider.trim().length > 0);

  function handleSubmit() {
    if (!isValid) return;
    onSave({
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      provider: provider.trim(),
      logo,
      plan,
      credit: '$0.00',
      creditLimit: `$${creditLimit}`,
      cost: '$0.00',
      requests: 0,
      billingUrl: billingUrl.trim() || '#',
      color,
    });
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" onclick={(e) => { if ((e.target as HTMLElement).classList.contains('modal-overlay')) onClose(); }}>
  <div class="modal-card fade-in">
    <div class="modal-header">
      <h3 class="modal-title">{t('Add Provider Plan', '添加供应商套餐')}</h3>
      <button class="close-btn" onclick={onClose}>✕</button>
    </div>

    <form class="modal-body" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <!-- Provider Name -->
      <div class="field">
        <label class="field-label">{t('Provider Name', '供应商名称')} <span class="required">*</span></label>
        <input type="text" class="field-input" placeholder="e.g. OpenRouter, DeepSeek, Xiaomi MiMo" bind:value={provider} />
      </div>

      <!-- Logo + Color Row -->
      <div class="field-row">
        <!-- Logo Picker -->
        <div class="field">
          <label class="field-label">{t('Logo', '图标')}</label>
          <button type="button" class="logo-trigger" onclick={() => showLogoPicker = !showLogoPicker}>
            <span class="logo-preview">{logo}</span>
            <span class="chevron">▾</span>
          </button>
          {#if showLogoPicker}
            <div class="logo-grid fade-in">
              {#each logoOptions as emoji}
                <button type="button" class="logo-option" class:selected={logo === emoji} onclick={() => { logo = emoji; showLogoPicker = false; }}>
                  {emoji}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Color Picker -->
        <div class="field">
          <label class="field-label">{t('Accent Color', '主题色')}</label>
          <button type="button" class="color-trigger" onclick={() => showColorPicker = !showColorPicker}>
            <span class="color-preview" style="background: {color}"></span>
            <span class="chevron">▾</span>
          </button>
          {#if showColorPicker}
            <div class="color-grid fade-in">
              {#each colorOptions as c}
                <button type="button" class="color-option" class:selected={color === c} style="background: {c}" onclick={() => { color = c; showColorPicker = false; }}></button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Plan Tier -->
      <div class="field">
        <label class="field-label">{t('Plan Tier', '套餐等级')}</label>
        <div class="plan-chips">
          {#each planOptions as opt}
            <button type="button" class="plan-chip" class:active={plan === opt} onclick={() => plan = opt} style="--chip-color: {color}">
              {opt}
            </button>
          {/each}
        </div>
      </div>

      <!-- Credit Limit -->
      <div class="field">
        <label class="field-label">{t('Credit Limit ($)', '额度上限 ($)')}</label>
        <input type="number" class="field-input" placeholder="0.00" step="0.01" min="0" bind:value={creditLimit} />
      </div>

      <!-- Billing URL -->
      <div class="field">
        <label class="field-label">{t('Billing URL (optional)', '账单链接（可选）')}</label>
        <input type="url" class="field-input" placeholder="https://..." bind:value={billingUrl} />
      </div>

      <!-- Preview -->
      <div class="preview-section">
        <label class="field-label">{t('Preview', '预览')}</label>
        <div class="preview-card" style="border-left: 4px solid {color}">
          <div class="preview-header">
            <span class="preview-logo">{logo}</span>
            <div>
              <div class="preview-provider">{provider || t('Provider Name', '供应商名称')}</div>
              <div class="preview-plan" style="color: {color}">{plan}</div>
            </div>
          </div>
          <div class="preview-stats">
            <span>$0.00</span>
            <span>0</span>
            <span>$0.00 / {creditLimit ? `$${creditLimit}` : '$0.00'}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button type="button" class="btn-cancel" onclick={onClose}>{t('Cancel', '取消')}</button>
        <button type="submit" class="btn-save" style="background: {color}" disabled={!isValid}>
          {t('Add Plan', '添加套餐')}
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
  }

  .modal-card {
    background: #ffffff; border-radius: 16px; width: 480px; max-width: 95vw;
    max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
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

  .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 13px; font-weight: 500; color: #374151; }
  .required { color: #ef4444; }

  .field-input {
    padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 10px;
    font-size: 14px; color: #111827; outline: none; transition: border-color 120ms;
  }

  .field-input:focus { border-color: #3b82f6; }
  .field-input::placeholder { color: #9ca3af; }

  .field-row { display: flex; gap: 16px; }
  .field-row .field { flex: 1; }

  /* Logo Picker */
  .logo-trigger {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border: 1px solid #e5e7eb; border-radius: 10px;
    background: #ffffff; cursor: pointer; transition: all 120ms;
  }

  .logo-trigger:hover { border-color: #d1d5db; }
  .logo-preview { font-size: 24px; }
  .chevron { font-size: 11px; color: #9ca3af; }

  .logo-grid {
    display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px;
    padding: 8px; border: 1px solid #e5e7eb; border-radius: 10px;
    margin-top: 6px; background: #fafafa;
  }

  .logo-option {
    width: 36px; height: 36px; border: none; background: transparent;
    font-size: 20px; cursor: pointer; border-radius: 8px; transition: all 120ms;
    display: flex; align-items: center; justify-content: center;
  }

  .logo-option:hover { background: #f3f4f6; }
  .logo-option.selected { background: #eff6ff; box-shadow: 0 0 0 2px #3b82f6; }

  /* Color Picker */
  .color-trigger {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border: 1px solid #e5e7eb; border-radius: 10px;
    background: #ffffff; cursor: pointer;
  }

  .color-preview { width: 20px; height: 20px; border-radius: 50%; }

  .color-grid {
    display: flex; gap: 8px; padding: 8px;
    border: 1px solid #e5e7eb; border-radius: 10px; margin-top: 6px; background: #fafafa;
  }

  .color-option {
    width: 32px; height: 32px; border: 2px solid transparent; border-radius: 50%;
    cursor: pointer; transition: all 120ms;
  }

  .color-option:hover { transform: scale(1.15); }
  .color-option.selected { border-color: #111827; box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px currentColor; }

  /* Plan Chips */
  .plan-chips { display: flex; gap: 8px; flex-wrap: wrap; }

  .plan-chip {
    padding: 6px 16px; border: 1px solid #e5e7eb; border-radius: 20px;
    background: #ffffff; color: #374151; font-size: 13px; cursor: pointer;
    transition: all 120ms;
  }

  .plan-chip:hover { border-color: #d1d5db; }
  .plan-chip.active { background: var(--chip-color); color: #ffffff; border-color: var(--chip-color); }

  /* Preview */
  .preview-section { }
  .preview-card {
    background: #f9fafb; border-radius: 12px; padding: 16px; margin-top: 8px;
  }

  .preview-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .preview-logo { font-size: 28px; }
  .preview-provider { font-size: 14px; font-weight: 600; color: #111827; }
  .preview-plan { font-size: 12px; font-weight: 500; }

  .preview-stats {
    display: flex; gap: 16px; font-size: 12px; color: #6b7280;
    font-family: 'SF Mono', monospace;
  }

  /* Actions */
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 8px; }

  .btn-cancel {
    padding: 10px 20px; border: 1px solid #e5e7eb; border-radius: 10px;
    background: #ffffff; color: #374151; font-size: 14px; cursor: pointer;
    transition: all 120ms;
  }

  .btn-cancel:hover { background: #f9fafb; }

  .btn-save {
    padding: 10px 24px; border: none; border-radius: 10px;
    color: #ffffff; font-size: 14px; font-weight: 500; cursor: pointer;
    transition: all 120ms;
  }

  .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-save:hover:not(:disabled) { filter: brightness(1.1); }

  .fade-in { animation: fadeIn 150ms ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
</style>
