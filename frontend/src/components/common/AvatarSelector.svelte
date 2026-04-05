<!-- AvatarSelector.svelte - Avatar Customization with Library -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { currentAvatar, agentId, onSelect }: {
    currentAvatar: string;
    agentId: string;
    onSelect: (avatar: string) => void;
  } = $props();

  let showLibrary = $state(false);

  // Avatar library - categorized
  const avatarCategories = {
    animals: {
      label: '动物',
      items: [
        { emoji: '🦞', name: '龙虾' },
        { emoji: '🐒', name: '猴子' },
        { emoji: '🦊', name: '狐狸' },
        { emoji: '🦉', name: '猫头鹰' },
        { emoji: '🐻', name: '熊' },
        { emoji: '🐯', name: '老虎' },
        { emoji: '🦁', name: '狮子' },
        { emoji: '🐼', name: '熊猫' },
        { emoji: '🦅', name: '鹰' },
        { emoji: '🐬', name: '海豚' },
        { emoji: '🐱', name: '猫' },
        { emoji: '🐶', name: '狗' },
        { emoji: '🐰', name: '兔子' },
        { emoji: '🦄', name: '独角兽' },
        { emoji: '🐺', name: '狼' },
        { emoji: '🦝', name: '浣熊' },
      ],
    },
    roles: {
      label: '角色',
      items: [
        { emoji: '🤖', name: '机器人' },
        { emoji: '👾', name: '外星人' },
        { emoji: '🧙', name: '巫师' },
        { emoji: '🥷', name: '忍者' },
        { emoji: '🦸', name: '超人' },
        { emoji: '🧛', name: '吸血鬼' },
        { emoji: '👸', name: '公主' },
        { emoji: '🤠', name: '牛仔' },
        { emoji: '👮', name: '警察' },
        { emoji: '👷', name: '工人' },
      ],
    },
    nature: {
      label: '自然',
      items: [
        { emoji: '🌊', name: '海浪' },
        { emoji: '🔥', name: '火' },
        { emoji: '⚡', name: '闪电' },
        { emoji: '🌟', name: '星星' },
        { emoji: '🌙', name: '月亮' },
        { emoji: '☀️', name: '太阳' },
        { emoji: '🌈', name: '彩虹' },
        { emoji: '💎', name: '钻石' },
        { emoji: '🎯', name: '靶心' },
        { emoji: '🚀', name: '火箭' },
      ],
    },
    tech: {
      label: '科技',
      items: [
        { emoji: '💻', name: '电脑' },
        { emoji: '⚙️', name: '齿轮' },
        { emoji: '🔧', name: '扳手' },
        { emoji: '📡', name: '天线' },
        { emoji: '🔬', name: '显微镜' },
        { emoji: '🧬', name: 'DNA' },
        { emoji: '🛸', name: 'UFO' },
        { emoji: '🎮', name: '游戏' },
        { emoji: '📱', name: '手机' },
        { emoji: '🌐', name: '网络' },
      ],
    },
  };

  function select(emoji: string) {
    onSelect(emoji);
    showLibrary = false;
  }
</script>

<div class="avatar-selector">
  <button class="avatar-btn" onclick={() => showLibrary = !showLibrary}>
    <span class="avatar-emoji">{currentAvatar}</span>
    <span class="avatar-edit">✏️</span>
  </button>

  {#if showLibrary}
    <div class="avatar-library">
      <div class="library-header">
        <h4>头像库</h4>
        <button class="close-btn" onclick={() => showLibrary = false}>✕</button>
      </div>

      {#each Object.entries(avatarCategories) as [key, category]}
        <div class="category">
          <span class="category-label">{category.label}</span>
          <div class="avatar-grid">
            {#each category.items as item}
              <button
                class="avatar-item"
                class:active={currentAvatar === item.emoji}
                onclick={() => select(item.emoji)}
                title={item.name}
              >
                {item.emoji}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
    <div class="overlay" onclick={() => showLibrary = false}></div>
  {/if}
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

  .avatar-library {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    z-index: var(--z-modal);
    min-width: 320px;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    animation: slideDown 200ms ease-out;
  }

  .library-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--border-color);
  }

  .library-header h4 {
    font-size: var(--font-size-sm);
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: var(--font-size-sm);
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .close-btn:hover {
    background: var(--bg-input);
    color: var(--text-primary);
  }

  .category {
    margin-bottom: var(--space-md);
  }

  .category:last-child {
    margin-bottom: 0;
  }

  .category-label {
    display: block;
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    margin-bottom: var(--space-sm);
    font-weight: 600;
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
  }

  .avatar-item {
    font-size: 1.25rem;
    padding: 6px;
    background: var(--bg-input);
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: center;
  }

  .avatar-item:hover {
    background: var(--accent-soft);
    border-color: var(--accent);
    transform: scale(1.1);
  }

  .avatar-item.active {
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-modal) - 1);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
