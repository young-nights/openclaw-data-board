<!-- AvatarLibrary.svelte - Avatar Library Popup (Rendered on Body) -->
<script lang="ts">
  let { currentAvatar, onSelect, onClose }: {
    currentAvatar: string;
    onSelect: (emoji: string) => void;
    onClose: () => void;
  } = $props();

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

  // Position popup near the trigger button
  let popupStyle = $state('');

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }

  // Position the popup at the center of the viewport
  $effect(() => {
    popupStyle = 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="overlay" onclick={onClose} onkeydown={(e) => e.key === 'Enter' && onClose()}></div>

<div class="avatar-library" style={popupStyle}>
  <div class="library-header">
    <h4>头像库</h4>
    <button class="close-btn" onclick={onClose}>✕</button>
  </div>

  {#each Object.entries(avatarCategories) as [key, category]}
    <div class="category">
      <span class="category-label">{category.label}</span>
      <div class="avatar-grid">
        {#each category.items as item}
          <button
            class="avatar-item"
            class:active={currentAvatar === item.emoji}
            onclick={() => onSelect(item.emoji)}
            title={item.name}
          >
            {item.emoji}
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 150ms ease-out;
  }

  .avatar-library {
    position: fixed;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    z-index: 1000;
    min-width: 360px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    animation: scaleIn 200ms ease-out;
  }

  .library-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--border-color);
  }

  .library-header h4 {
    font-size: var(--font-size-lg);
    margin: 0;
    color: var(--text-primary);
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: var(--font-size-lg);
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .close-btn:hover {
    background: var(--bg-input);
    color: var(--text-primary);
  }

  .category {
    margin-bottom: var(--space-lg);
  }

  .category:last-child {
    margin-bottom: 0;
  }

  .category-label {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-sm);
    font-weight: 600;
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
  }

  .avatar-item {
    font-size: 1.5rem;
    padding: 8px;
    background: var(--bg-input);
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: center;
  }

  .avatar-item:hover {
    background: var(--accent-soft);
    border-color: var(--accent);
    transform: scale(1.15);
  }

  .avatar-item.active {
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
</style>
