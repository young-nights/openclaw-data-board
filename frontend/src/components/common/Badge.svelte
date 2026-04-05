<!-- Badge.svelte - Status Badge Component -->
<script lang="ts">
  let { status, label }: {
    status: 'ok' | 'info' | 'warn' | 'blocked' | 'connected' | 'partial' | 'not_connected';
    label: string;
  } = $props();

  function getBadgeClass(s: string): string {
    if (s === 'ok' || s === 'connected') return 'ok';
    if (s === 'info' || s === 'partial') return 'info';
    if (s === 'warn') return 'warn';
    if (s === 'blocked' || s === 'not_connected') return 'blocked';
    return '';
  }
</script>

<span class="badge {getBadgeClass(status)}">{label}</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    font-size: var(--font-size-xs);
    font-weight: 600;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    line-height: 1.4;
  }

  .badge.ok {
    background: var(--ok-soft);
    color: var(--ok);
  }

  .badge.info {
    background: var(--info-soft);
    color: var(--info);
  }

  .badge.warn {
    background: var(--warn-soft);
    color: var(--warn);
  }

  .badge.blocked {
    background: var(--danger-soft);
    color: var(--danger);
  }
</style>
