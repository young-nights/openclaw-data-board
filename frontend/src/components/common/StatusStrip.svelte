<!-- StatusStrip.svelte - Compact Status Strip -->
<script lang="ts">
  let { items }: {
    items: Array<{ label: string; value: string | number; status?: string }>;
  } = $props();
</script>

<div class="status-strip">
  {#each items as item}
    <div class="status-chip">
      <span class="chip-label">{item.label}</span>
      <strong class="chip-value">{item.value}</strong>
    </div>
  {/each}
</div>

<style>
  .status-strip {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    padding: var(--space-sm) 0;
  }

  .status-chip {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 4px 10px;
    font-size: var(--font-size-xs);
    transition: all var(--transition-fast);
  }

  .status-chip:hover {
    border-color: var(--border-active);
  }

  .chip-label {
    color: var(--text-muted);
  }

  .chip-value {
    color: var(--text-primary);
    font-family: var(--font-mono);
  }
</style>
