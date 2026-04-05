<!-- Header.svelte - Top Navigation Bar with Theme Toggle -->
<script lang="ts">
  import type { UiLanguage } from '../types';
  import type { Theme } from '../stores/theme';

  let { language, theme, onLangChange, onThemeChange }: {
    language: UiLanguage;
    theme: Theme;
    onLangChange: (lang: UiLanguage) => void;
    onThemeChange: (theme: Theme) => void;
  } = $props();

  let time = $state(new Date());
  let showThemeMenu = $state(false);

  $effect(() => {
    const timer = setInterval(() => time = new Date(), 1000);
    return () => clearInterval(timer);
  });

  function formatTime(date: Date): string {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function toggleLanguage() {
    onLangChange(language === 'en' ? 'zh' : 'en');
  }

  const themeOptions: { key: Theme; icon: string; label: string }[] = [
    { key: 'dark', icon: '🌙', label: '深色' },
    { key: 'light', icon: '☀️', label: '浅色' },
    { key: 'midnight', icon: '🌌', label: '午夜' },
  ];

  function selectTheme(t: Theme) {
    onThemeChange(t);
    showThemeMenu = false;
  }
</script>

<header class="header">
  <div class="header-left">
    <div class="logo">
      <span class="logo-icon">🦞</span>
      <h1 class="logo-text">OpenClaw</h1>
    </div>
    <span class="badge ok">Live</span>
  </div>

  <div class="header-center">
    <div class="search-box">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="M21 21l-4.35-4.35"></path>
      </svg>
      <input type="text" placeholder={language === 'zh' ? '搜索任务、会话...' : 'Search tasks, sessions...'} />
    </div>
  </div>

  <div class="header-right">
    <!-- Theme Toggle -->
    <div class="theme-switcher">
      <button class="btn-icon" onclick={() => showThemeMenu = !showThemeMenu} title="切换主题">
        {themeOptions.find(t => t.key === theme)?.icon ?? '🌙'}
      </button>
      {#if showThemeMenu}
        <div class="theme-dropdown">
          {#each themeOptions as opt}
            <button
              class="theme-option"
              class:active={theme === opt.key}
              onclick={() => selectTheme(opt.key)}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          {/each}
        </div>
        <div class="overlay" onclick={() => showThemeMenu = false}></div>
      {/if}
    </div>

    <button class="btn-icon" onclick={toggleLanguage} title="Switch language">
      {language === 'zh' ? 'EN' : '中'}
    </button>
    <span class="time">{formatTime(time)}</span>
    <a href="http://127.0.0.1:18789" target="_blank" rel="noopener" class="btn-icon" title="OpenClaw Dashboard">
      ↗
    </a>
  </div>
</header>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-lg);
    height: 56px;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border-bottom: 1px solid var(--glass-border);
    z-index: var(--z-sticky);
    position: sticky;
    top: 0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .logo-text {
    font-size: var(--font-size-lg);
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent), #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .badge {
    font-size: var(--font-size-xs);
    padding: 2px 8px;
    border-radius: var(--radius-full);
    font-weight: 600;
  }

  .badge.ok {
    background: var(--ok-soft);
    color: var(--ok);
  }

  .header-center {
    flex: 1;
    max-width: 400px;
    margin: 0 var(--space-xl);
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-sm) var(--space-md);
    transition: border-color var(--transition-fast);
  }

  .search-box:focus-within {
    border-color: var(--border-active);
  }

  .search-box input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    outline: none;
  }

  .search-box input::placeholder {
    color: var(--text-muted);
  }

  .search-box svg {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .btn-icon {
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: 600;
    transition: all var(--transition-fast);
    text-decoration: none;
  }

  .btn-icon:hover {
    background: var(--bg-card-hover);
    color: var(--text-primary);
  }

  .time {
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }

  .theme-switcher {
    position: relative;
  }

  .theme-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-xs);
    z-index: var(--z-modal);
    min-width: 120px;
    box-shadow: var(--shadow-lg);
    animation: slideDown 150ms ease-out;
  }

  .theme-option {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    background: none;
    border: none;
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: var(--font-size-sm);
    transition: all var(--transition-fast);
  }

  .theme-option:hover {
    background: var(--bg-input);
    color: var(--text-primary);
  }

  .theme-option.active {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-modal) - 1);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
