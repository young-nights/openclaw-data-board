// theme.ts - Theme Store
export type Theme = 'dark' | 'light' | 'midnight';

export const themes: Record<Theme, Record<string, string>> = {
  dark: {
    '--bg-primary': '#0f1117',
    '--bg-secondary': '#161822',
    '--bg-card': 'rgba(22, 24, 34, 0.85)',
    '--bg-card-hover': 'rgba(30, 32, 48, 0.9)',
    '--bg-glass': 'rgba(22, 24, 34, 0.65)',
    '--bg-input': 'rgba(255, 255, 255, 0.05)',
    '--text-primary': '#e8e8ed',
    '--text-secondary': '#8b8fa3',
    '--text-muted': '#5c5f73',
    '--text-accent': '#8ad2ff',
    '--border-color': 'rgba(255, 255, 255, 0.08)',
    '--border-active': 'rgba(138, 210, 255, 0.3)',
    '--glass-bg': 'rgba(22, 24, 34, 0.6)',
    '--glass-border': 'rgba(255, 255, 255, 0.08)',
  },
  light: {
    '--bg-primary': '#f5f5f7',
    '--bg-secondary': '#ffffff',
    '--bg-card': 'rgba(255, 255, 255, 0.85)',
    '--bg-card-hover': 'rgba(245, 245, 247, 0.9)',
    '--bg-glass': 'rgba(255, 255, 255, 0.65)',
    '--bg-input': 'rgba(0, 0, 0, 0.04)',
    '--text-primary': '#1d1d1f',
    '--text-secondary': '#6e6e73',
    '--text-muted': '#aeaeb2',
    '--text-accent': '#007aff',
    '--border-color': 'rgba(0, 0, 0, 0.08)',
    '--border-active': 'rgba(0, 122, 255, 0.3)',
    '--glass-bg': 'rgba(255, 255, 255, 0.6)',
    '--glass-border': 'rgba(0, 0, 0, 0.08)',
  },
  midnight: {
    '--bg-primary': '#0a0a12',
    '--bg-secondary': '#10101c',
    '--bg-card': 'rgba(16, 16, 28, 0.85)',
    '--bg-card-hover': 'rgba(24, 24, 40, 0.9)',
    '--bg-glass': 'rgba(16, 16, 28, 0.65)',
    '--bg-input': 'rgba(255, 255, 255, 0.03)',
    '--text-primary': '#d4d4e0',
    '--text-secondary': '#7878a0',
    '--text-muted': '#484860',
    '--text-accent': '#7c6aff',
    '--border-color': 'rgba(255, 255, 255, 0.06)',
    '--border-active': 'rgba(124, 106, 255, 0.3)',
    '--glass-bg': 'rgba(16, 16, 28, 0.6)',
    '--glass-border': 'rgba(255, 255, 255, 0.06)',
  },
};

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const vars = themes[theme];
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
  localStorage.setItem('theme', theme);
}

export function loadTheme(): Theme {
  const saved = localStorage.getItem('theme') as Theme | null;
  if (saved && saved in themes) return saved;
  return 'dark';
}
