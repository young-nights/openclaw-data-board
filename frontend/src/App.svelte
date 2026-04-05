<!-- App.svelte - Root Component -->
<script lang="ts">
  import Header from './components/Header.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import { api } from './stores/api';
  import { SSEManager } from './stores/sse';
  import type { UiPreferences, UiLanguage, BrainTimelineItem } from './types';

  let language = $state<UiLanguage>('zh');
  let activeSection = $state<string>('overview');
  let compactMode = $state(false);
  let brainTimeline = $state<BrainTimelineItem[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  const sse = new SSEManager();

  // Load initial preferences
  async function loadPreferences() {
    try {
      const prefs = await api.getUiPreferences() as { preferences: UiPreferences };
      language = prefs.preferences.language ?? 'zh';
      compactMode = prefs.preferences.compactStatusStrip ?? false;
    } catch {
      // Use defaults
    }
  }

  // Load initial timeline data
  async function loadTimeline() {
    try {
      loading = true;
      const data = await api.getBrainTimeline(50) as { items: BrainTimelineItem[] };
      brainTimeline = data.items ?? [];
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load data';
    } finally {
      loading = false;
    }
  }

  // Connect SSE for real-time updates
  function connectSSE() {
    sse.connect('/api/brain/stream');
    sse.on('timeline', (data) => {
      const payload = data as { items?: BrainTimelineItem[] };
      if (payload.items) {
        brainTimeline = payload.items;
      }
    });
  }

  // Initialize
  $effect(() => {
    loadPreferences();
    loadTimeline();
    connectSSE();
    return () => sse.close();
  });

  // Handle section navigation
  function handleNavigate(section: string) {
    activeSection = section;
  }
</script>

<div class="app" class:compact={compactMode}>
  <Header {language} onLangChange={(lang) => language = lang} />
  <div class="app-body">
    <Sidebar {activeSection} {language} onNavigate={handleNavigate} />
    <main class="main-content">
      <Dashboard
        section={activeSection}
        {language}
        {brainTimeline}
        {loading}
        {error}
        {compactMode}
      />
    </main>
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: var(--bg-primary);
  }

  .app-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-lg);
    animation: fadeIn 300ms ease-out;
  }

  .compact .main-content {
    padding: var(--space-md);
  }
</style>
