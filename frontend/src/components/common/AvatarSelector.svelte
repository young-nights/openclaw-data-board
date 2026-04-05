<!-- AvatarSelector.svelte - Avatar Customization with Library (Portal Fixed) -->
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { mount, unmount } from 'svelte';
  import AvatarLibrary from './AvatarLibrary.svelte';

  let { currentAvatar, agentId, onSelect }: {
    currentAvatar: string;
    agentId: string;
    onSelect: (avatar: string) => void;
  } = $props();

  let showLibrary = $state(false);
  let libraryEl: HTMLElement | null = null;
  let libraryInstance: any = null;

  function openLibrary() {
    showLibrary = true;
    // Mount the library popup to document.body
    libraryEl = document.createElement('div');
    libraryEl.id = `avatar-library-${agentId}`;
    document.body.appendChild(libraryEl);

    libraryInstance = mount(AvatarLibrary, {
      target: libraryEl,
      props: {
        currentAvatar,
        onSelect: (emoji: string) => {
          onSelect(emoji);
          closeLibrary();
        },
        onClose: closeLibrary,
      },
    });
  }

  function closeLibrary() {
    showLibrary = false;
    if (libraryInstance && libraryEl) {
      unmount(libraryInstance);
      libraryEl.remove();
      libraryInstance = null;
      libraryEl = null;
    }
  }

  onDestroy(() => {
    closeLibrary();
  });
</script>

<div class="avatar-selector">
  <button class="avatar-btn" onclick={showLibrary ? closeLibrary : openLibrary}>
    <span class="avatar-emoji">{currentAvatar}</span>
    <span class="avatar-edit">✏️</span>
  </button>
</div>

<style>
  .avatar-selector {
    position: relative;
    display: inline-block;
  }

  .avatar-btn {
    position: relative;
    background: transparent;
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    padding: 4px;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .avatar-btn:hover {
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  .avatar-emoji {
    font-size: 2rem;
    display: block;
  }

  .avatar-edit {
    position: absolute;
    bottom: -4px;
    right: -4px;
    font-size: 0.75rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-full);
    padding: 2px;
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .avatar-btn:hover .avatar-edit {
    opacity: 1;
  }
</style>
