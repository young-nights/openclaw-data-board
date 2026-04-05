<!-- Card.svelte - Glassmorphism Card Component (Svelte 5 Runes) -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { title, subtitle, loading: isLoading = false, class: className = '', children }: {
    title?: string;
    subtitle?: string;
    loading?: boolean;
    class?: string;
    children?: Snippet;
  } = $props();
</script>

<article class="card {className}">
  {#if title || subtitle}
    <header class="card-header">
      {#if title}
        <h3 class="card-title">{title}</h3>
      {/if}
      {#if subtitle}
        <p class="card-subtitle">{subtitle}</p>
      {/if}
    </header>
  {/if}
  <div class="card-body">
    {#if isLoading}
      <div class="skeleton-lines">
        <div class="skeleton-line" style="width: 80%;"></div>
        <div class="skeleton-line" style="width: 60%;"></div>
        <div class="skeleton-line" style="width: 45%;"></div>
      </div>
    {:else if children}
      {@render children()}
    {/if}
  </div>
</article>

<style>
  .card {
    background: var(--bg-glass);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: all var(--transition-normal);
  }

  .card:hover {
    border-color: var(--border-active);
    box-shadow: var(--shadow-glow);
  }

  .card-header {
    padding: var(--space-md) var(--space-lg);
    border-bottom: 1px solid var(--border-color);
  }

  .card-title {
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .card-subtitle {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    margin: var(--space-xs) 0 0;
  }

  .card-body {
    padding: var(--space-lg);
  }

  .skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .skeleton-line {
    height: 12px;
    background: linear-gradient(90deg, var(--bg-card) 25%, rgba(255,255,255,0.05) 50%, var(--bg-card) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--radius-sm);
  }
</style>
